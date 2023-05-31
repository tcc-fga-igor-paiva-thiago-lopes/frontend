import { defineStore } from 'pinia';

import { inMemberOperation, generalOperation } from './helpers';
import { Freight, IFreight } from '@/models/freight';
import { runDatabaseOperation } from './helpers/databaseConnector';

import APIAdapter from '@/services/api';
import { IFormData } from '@/components/Freights';
import {
    stringToFloat,
    instanceToObject,
    convertAttributes,
} from '@/utils/conversion';
import { callOperation } from './helpers/apiConnector';

interface IFreightsStoreState {
    _freights: Freight[];
    _newFreight: IFormData;
    _editFreight: IFormData;
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

const emptyFreightFormData = (): IFormData => ({
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
});

export const initialState = (): IFreightsStoreState => ({
    _newFreight: emptyFreightFormData(),
    _editFreight: emptyFreightFormData(),
    _freights: [] as Freight[],
});

const apiAdapter = new APIAdapter('/freights');

export const useFreightsStore = defineStore('freights', {
    state: (): IFreightsStoreState => initialState(),
    getters: {
        freights: (state: IFreightsStoreState) => state._freights,
        newFreight: (state: IFreightsStoreState) => state._newFreight,
        editFreight: (state: IFreightsStoreState) => state._editFreight,
    },
    actions: {
        setNewFreightAttr(field: keyof IFormData, value: any) {
            this._newFreight[field] = value;
        },
        setEditFreightAttr(field: keyof IFormData, value: any) {
            this._editFreight[field] = value;
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
        async findEditFreight(id: IFreight['id']) {
            const foundFreight = await this.findFreight(id, true);

            if (!foundFreight) return false;

            this._editFreight = foundFreight as IFormData;

            return true;
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

            await runDatabaseOperation(async () => {
                freight = await Freight.createWithAttrs(attributes);

                this._freights.push(freight);
            });

            this._newFreight = emptyFreightFormData();

            callOperation(apiAdapter.post, { url: '/', data: apiAttrs });
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
        async updateFreight(id: IFreight['id']) {
            const [attributes, apiAttrs] = convertAttrs(this._editFreight);

            await this.updateFreightByAttrs(id, attributes);

            this._editFreight = emptyFreightFormData();

            callOperation(apiAdapter.patch, { url: `/${id}`, data: apiAttrs });
        },
        async updateFreightByAttrs(
            id: IFreight['id'],
            attrs: Partial<IFreight>
        ) {
            return runDatabaseOperation(async () => {
                await generalOperation({
                    successMsg: 'Frete editado com sucesso!',
                    errorMsg: 'Falha ao editar frete.',
                    actionFunc: () => Freight.update(id, attrs),
                });

                await this.loadFreightsFromDatabase();
            });
        },
    },
});
