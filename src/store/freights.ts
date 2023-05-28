import { defineStore } from 'pinia';

import { Freight, IFreight } from '@/models/freight';

import { inMemberOperation } from './helpers';
import { runDatabaseOperation } from './databaseConnector';

export interface IFormData extends Record<string, unknown> {
    finished: boolean;
    name: string;
    description: string;
    cargoType: string;
    cargoWeight: string;
    contractor: string;
    agreedPayment: string;
    startDatetime: string;
    dueDatetime: string;
    finishedDatetime: string;
    distance: string;
    originCountry: string;
    originCity: string;
    originState: string;
    destinationCountry: string;
    destinationCity: string;
    destinationState: string;
}

interface IFreightsStoreState {
    _freights: Freight[];
    _newFreight: IFormData;
}

const findFreightByAttrs = (attrs: Partial<IFreight>) =>
    Freight.findOneBy(attrs);

export const useFreightsStore = defineStore('freights', {
    state: (): IFreightsStoreState => ({
        _newFreight: {
            finished: false,
            name: '',
            description: '',
            cargoType: '',
            cargoWeight: '',
            contractor: '',
            agreedPayment: '',
            startDatetime: '',
            dueDatetime: '',
            finishedDatetime: '',
            distance: '',
            originCountry: 'Brasil',
            originCity: '',
            originState: '',
            destinationCountry: 'Brasil',
            destinationCity: '',
            destinationState: '',
        },
        _freights: [] as Freight[],
    }),
    getters: {
        freights: (state: IFreightsStoreState) => state._freights,
        newFreight: (state: IFreightsStoreState) => state._newFreight,
    },
    actions: {
        setNewFreightAttr(field: keyof IFreight, value: any) {
            this._newFreight[field] = value;
        },
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
