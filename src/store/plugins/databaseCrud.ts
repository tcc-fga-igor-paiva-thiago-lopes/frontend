import { SyncableEntity } from '@/models/syncableEntity';
import { generalOperation, inMemberOperation } from '../helpers';
import { runDatabaseOperation } from '../helpers/databaseConnector';
import {
    ModelClass,
    IMemberActionParams,
    IMemberActionWithAttrsParams,
    IMemberActionWithMsgParams,
} from '..';
import {
    instanceToObject,
    multipleDatabaseToApi,
    formDataToDatabaseAndApi,
} from '@/utils/conversion';
import APIAdapter from '@/services/api';
import { SyncStatus } from '@/services/sync';

export const DatabaseCrudPlugin = () => ({
    _syncing: false,
    _items: [] as any[],
    _newItem: {} as Record<string, any>,
    _editItem: {} as Record<string, any>,
    mergeItems(items: any[]) {
        this._items = [...this._items, ...items];
    },
    async createRecordWithNewItem<T extends SyncableEntity>({
        model,
        errorMsg,
        successMsg,
    }: Omit<IMemberActionWithMsgParams<T>, 'id'>) {
        const [attrs, apiAttrs] = formDataToDatabaseAndApi<T>({
            attrs: this._newItem,
            repository: model.getRepository<T>(),
        });

        const record = await this.createRecordByAttrs({
            model,
            attributes: attrs,
            errorMsg,
            successMsg,
        });

        return [record, apiAttrs] as [any, Record<string, any>];
    },
    async findRecord<T extends SyncableEntity>(
        model: ModelClass<T>,
        id: any,
        asFormData = false
    ) {
        const record = await model.findOneBy<T>({ id });

        if (!record) return null;

        if (asFormData) {
            return instanceToObject<T>(record, model.getRepository<T>());
        }

        return record;
    },
    async findEditRecord<T extends SyncableEntity>({
        id,
        model,
    }: IMemberActionParams<T>) {
        const foundRecord = await this.findRecord<T>(model, id, true);

        if (!foundRecord) return false;

        this._editItem = foundRecord;

        return true;
    },
    async updateRecordWithEditItem<T extends SyncableEntity>({
        id,
        model,
        errorMsg,
        successMsg,
    }: IMemberActionWithMsgParams<T>) {
        const [attributes, apiAttrs] = formDataToDatabaseAndApi<T>({
            attrs: this._editItem,
            repository: model.getRepository<T>(),
        });

        const record = await this.updateRecord<T>({
            id,
            model,
            errorMsg,
            successMsg,
            attributes,
        });

        return [record, apiAttrs] as [any, Record<string, any>];
    },
    async loadAllPaginated<T extends SyncableEntity>(
        model: ModelClass<T>,
        pageSize: number,
        pageNum: number
    ) {
        const paginationRet = await model.findAndCount({
            take: pageSize,
            skip: (pageNum - 1) * pageSize,
        });

        const [results] = paginationRet;

        if (pageNum === 1) this._items = results;
        else this.mergeItems(results);

        return paginationRet;
    },
    async findRecordByAttrs<T extends SyncableEntity>(
        model: ModelClass<T>,
        attrs: Record<string, any>
    ) {
        return model.findOneBy<T>(attrs);
    },
    async createRecordByAttrs<T extends SyncableEntity>({
        model,
        errorMsg,
        successMsg,
        attributes,
    }: Omit<IMemberActionWithAttrsParams<T>, 'id'>) {
        return runDatabaseOperation(() =>
            generalOperation({
                errorMsg,
                successMsg,
                actionFunc: async () => {
                    const record = await model.createWithAttrs(attributes);

                    this._items.push(record);

                    return record;
                },
            })
        );
    },
    async removeRecord<T extends SyncableEntity>({
        id,
        model,
        errorMsg,
        successMsg,
    }: IMemberActionWithMsgParams<T>) {
        return runDatabaseOperation(async () => {
            await inMemberOperation<SyncableEntity, Record<string, any>>({
                errorMsg,
                successMsg,
                findAttrs: { id },
                actionFunc: (instance) => instance.remove(),
                findFunc: (attrs: Record<string, any>) =>
                    this.findRecordByAttrs(model, attrs),
            });
        });
    },
    async softRemoveRecord<T extends SyncableEntity>({
        id,
        model,
        errorMsg,
        successMsg,
    }: IMemberActionWithMsgParams<T>) {
        return runDatabaseOperation(async () => {
            await inMemberOperation<SyncableEntity, Record<string, any>>({
                errorMsg,
                successMsg,
                findAttrs: { id },
                actionFunc: (instance) => instance.softRemove(),
                findFunc: (attrs: Record<string, any>) =>
                    this.findRecordByAttrs(model, attrs),
            });
        });
    },
    async updateRecord<T extends SyncableEntity>({
        id,
        model,
        errorMsg,
        successMsg,
        attributes,
    }: IMemberActionWithAttrsParams<T>) {
        return runDatabaseOperation(async () => {
            await inMemberOperation<SyncableEntity, Record<string, any>>({
                errorMsg,
                successMsg,
                findAttrs: { id },
                actionFunc: (instance) =>
                    instance.saveWithAttributes(attributes),
                findFunc: (attrs: Record<string, any>) =>
                    this.findRecordByAttrs(model, attrs),
            });
        });
    },
    async syncRecords<T extends SyncableEntity>(
        model: ModelClass<T>,
        apiAdapter: APIAdapter
    ) {
        if (this._syncing) return [];

        try {
            this._syncing = true;

            const promises = [];
            const [toSync, toDelete] = await model.notSynced<T>();

            if (toSync.length) {
                promises.push(
                    apiAdapter
                        .patch({
                            url: '/',
                            data: multipleDatabaseToApi(
                                toSync,
                                model.getRepository()
                            ),
                        })
                        .then((response) =>
                            runDatabaseOperation(() =>
                                model.updateByIdentifiers(response.data, {
                                    synced: true,
                                })
                            )
                        )
                );
            } else {
                promises.push(Promise.resolve('ignored'));
            }

            if (toDelete.length) {
                promises.push(
                    apiAdapter
                        .delete({
                            url: '/',
                            params: { identifiers: toDelete },
                        })
                        .then((response) =>
                            runDatabaseOperation(() =>
                                model.deleteByIdentifiers([
                                    ...response.data.deleted,
                                    ...response.data.not_exists,
                                ])
                            )
                        )
                );
            } else {
                promises.push(Promise.resolve('ignored'));
            }

            const settledResults = await Promise.allSettled(promises);

            return settledResults.map((result) => {
                if (result.status !== 'fulfilled') return 'error';

                return (
                    result.value && typeof result.value === 'string'
                        ? result.value
                        : 'success'
                ) as SyncStatus;
            });
        } catch (error) {
            console.error(error);

            return ['error', 'error'] as SyncStatus[];
        } finally {
            this._syncing = false;
        }
    },
});

export default DatabaseCrudPlugin;
