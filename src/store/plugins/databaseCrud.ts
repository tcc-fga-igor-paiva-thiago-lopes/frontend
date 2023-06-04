import { AppBaseEntity } from '@/models/appBaseEntity';
import { generalOperation, inMemberOperation } from '../helpers';
import { runDatabaseOperation } from '../helpers/databaseConnector';
import { IInMemberOperationParams, IInMemberWithAttrsParams } from '..';
import { formDataToDatabaseAndApi, instanceToObject } from '@/utils/conversion';

export const DatabaseCrudPlugin = () => ({
    _items: [] as any[],
    _newItem: {} as Record<string, any>,
    _editItem: {} as Record<string, any>,
    mergeItems(items: any[]) {
        this._items = [...this._items, ...items];
    },
    async createRecordWithNewItem<T extends AppBaseEntity>({
        model,
        errorMsg,
        successMsg,
    }: Omit<IInMemberOperationParams<T>, 'id'>) {
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
    async findRecord<T extends AppBaseEntity>(
        model: { new (): T } & typeof AppBaseEntity,
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
    async findEditRecord<T extends AppBaseEntity>(
        model: { new (): T } & typeof AppBaseEntity,
        id: any
    ) {
        const foundFreight = await this.findRecord<T>(model, id, true);

        if (!foundFreight) return false;

        this._editItem = foundFreight;

        return true;
    },
    async updateRecordWithEditItem<T extends AppBaseEntity>({
        id,
        model,
        errorMsg,
        successMsg,
    }: IInMemberOperationParams<T>) {
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
    async loadAllPaginated<T>(
        model: { new (): T } & typeof AppBaseEntity,
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
    async findRecordByAttrs<T>(
        model: { new (): T } & typeof AppBaseEntity,
        attrs: Record<string, any>
    ) {
        return model.findOneBy(attrs) as T | null;
    },
    async createRecordByAttrs<T>({
        model,
        errorMsg,
        successMsg,
        attributes,
    }: Omit<IInMemberWithAttrsParams<T>, 'id'>) {
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
    async removeRecord<T>({
        id,
        model,
        errorMsg,
        successMsg,
    }: IInMemberOperationParams<T>) {
        return runDatabaseOperation(async () => {
            await inMemberOperation<AppBaseEntity, Record<string, any>>({
                errorMsg,
                successMsg,
                findAttrs: { id },
                actionFunc: (instance) => instance.remove(),
                findFunc: (attrs: Record<string, any>) =>
                    this.findRecordByAttrs(model, attrs),
            });
        });
    },
    async updateRecord<T>({
        id,
        model,
        errorMsg,
        successMsg,
        attributes,
    }: IInMemberWithAttrsParams<T>) {
        return runDatabaseOperation(async () => {
            await inMemberOperation<AppBaseEntity, Record<string, any>>({
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
});

export default DatabaseCrudPlugin;
