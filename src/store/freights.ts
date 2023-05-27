import { defineStore } from 'pinia';

import { Freight, IFreight } from '@/models/freight';

import { inMemberOperation } from './helpers';
import { runDatabaseOperation } from './databaseConnector';

interface IFreightsStoreState {
    _freights: Freight[];
}

const findFreightByAttrs = (attrs: Partial<IFreight>) =>
    Freight.findOneBy(attrs);

export const useFreightsStore = defineStore('freights', {
    state: (): IFreightsStoreState => ({
        _freights: [] as Freight[],
    }),
    getters: {
        freights: (state: IFreightsStoreState) => state._freights,
    },
    actions: {
        mergeFreights(freights: Freight[]) {
            this._freights = [...this._freights, ...freights];
        },
        async loadFreightsFromDatabase() {
            this._freights = await Freight.find();
        },
        async loadPaginated(pageSize: number, pageNum: number) {
            const paginationRet = await Freight.findPaginated(
                pageSize,
                pageNum
            );

            const [results] = paginationRet;

            this.mergeFreights(results);

            return paginationRet;
        },
        async findFreight(id: IFreight['id']) {
            return Freight.findOneBy({ id });
        },
        async addFreight(attributes: Partial<IFreight>) {
            return runDatabaseOperation(async () => {
                this._freights.push(await Freight.createWithAttrs(attributes));
            });
        },
        async removeFreight(id: IFreight['id']) {
            return runDatabaseOperation(async () => {
                await inMemberOperation<Freight, Partial<IFreight>>({
                    findAttrs: { id },
                    successMsg: 'Frete removido com sucesso!',
                    errorMsg: 'Falha ao remover frete.',
                    findFunc: findFreightByAttrs,
                    actionFunc: (instance) => instance.remove(),
                });

                await this.loadFreightsFromDatabase();
            });
        },
        async updateFreight(id: IFreight['id'], attrs: Partial<IFreight>) {
            return runDatabaseOperation(async () => {
                await inMemberOperation<Freight, Partial<IFreight>>({
                    findAttrs: { id },
                    successMsg: 'Frete editado com sucesso!',
                    errorMsg: 'Falha ao editar frete.',
                    findFunc: findFreightByAttrs,
                    actionFunc: (instance) =>
                        instance.saveWithAttributes(attrs),
                });

                await this.loadFreightsFromDatabase();
            });
        },
    },
});
