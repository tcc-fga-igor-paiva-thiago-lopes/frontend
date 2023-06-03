import { generalOperation, inMemberOperation } from '../helpers';
import { AppBaseEntity } from '@/models/appBaseEntity';
import { runDatabaseOperation } from '../helpers/databaseConnector';
import { IInMemberOperationParams, IInMemberWithAttrsParams } from '..';

export const DatabaseCrudPlugin = () => ({
    _items: [] as any[],
    mergeItems(items: any[]) {
        this._items = [...this._items, ...items];
    },
    async loadAllPaginated(
        model: typeof AppBaseEntity,
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
    async findRecordByAttrs(
        model: typeof AppBaseEntity,
        attrs: Record<string, any>
    ) {
        return model.findOneBy(attrs);
    },
    async createRecordByAttrs({
        model,
        errorMsg,
        successMsg,
        attributes,
    }: Omit<IInMemberWithAttrsParams, 'id'>) {
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
    async removeRecord({
        id,
        model,
        errorMsg,
        successMsg,
    }: IInMemberOperationParams) {
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
    async updateRecord({
        id,
        model,
        errorMsg,
        successMsg,
        attributes,
    }: IInMemberWithAttrsParams) {
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
