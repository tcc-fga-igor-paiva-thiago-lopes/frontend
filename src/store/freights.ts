import { defineStore } from 'pinia';

import { inMemberOperation } from './helpers';
import { Freight, IFreight } from '@/models/freight';
import { runDatabaseOperation } from './databaseConnector';

import { useAppStore } from './app';
import APIAdapter from '@/services/api';
import { IFormData } from '@/components/Freights';
import {
    stringToFloat,
    instanceToObject,
    convertAttributes,
} from '@/utils/conversion';

interface IFreightsStoreState {
    _freights: Freight[];
    _newFreight: IFormData;
}

const findFreightByAttrs = (attrs: Partial<IFreight>) =>
    Freight.findOneBy(attrs);

const fieldsConversion = {
    distance: stringToFloat,
    cargoWeight: stringToFloat,
    agreedPayment: stringToFloat,
};

const convertAttrs = (attrs: IFormData) => {
    return convertAttributes({
        attrs,
        fieldsConversion,
        repository: Freight.getRepository(),
    });
};

export const initialState = (): IFreightsStoreState => ({
    _newFreight: {
        finished: false,
        name: '',
        description: '',
        cargo: '',
        cargoWeight: '',
        contractor: '',
        agreedPayment: '',
        startDate: '',
        dueDate: '',
        finishedDate: '',
        distance: '',
        originCountry: 'Brasil',
        originCity: '',
        originState: '',
        destinationCountry: 'Brasil',
        destinationCity: '',
        destinationState: '',
    },
    _freights: [] as Freight[],
});

const apiAdapter = new APIAdapter('/freights');

export const useFreightsStore = defineStore('freights', {
    state: (): IFreightsStoreState => initialState(),
    getters: {
        freights: (state: IFreightsStoreState) => state._freights,
        newFreight: (state: IFreightsStoreState) => state._newFreight,
    },
    actions: {
        setNewFreightAttr(field: keyof IFormData, value: any) {
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
        async findFreight(id: IFreight['id'], asFormData = false) {
            const freight = await Freight.findOneBy({ id });

            if (!freight) return null;

            if (asFormData) {
                return instanceToObject<Freight>(
                    freight,
                    Freight.getRepository()
                ) as IFormData;
            }

            return freight;
        },
        async createFreight() {
            let freight: Freight;
            const [attributes, apiAttrs] = convertAttrs(this._newFreight);

            const appStore = useAppStore();

            await runDatabaseOperation(async () => {
                freight = await Freight.createWithAttrs(attributes);

                this._freights.push(freight);
            });

            this._newFreight = initialState()._newFreight;

            if (appStore.connectionStatus.connected) {
                return apiAdapter.post({ url: '/', data: apiAttrs });
            }
        },
        async addFreightByAttrs(attributes: Partial<IFreight>) {
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
