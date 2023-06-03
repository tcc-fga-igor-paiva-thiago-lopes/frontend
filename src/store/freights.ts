import { defineStore, PiniaCustomStateProperties } from 'pinia';

import APIAdapter from '@/services/api';
import { IFormData } from '@/components/Freights';
import { Freight, IFreight } from '@/models/freight';
import { callOperation } from './helpers/apiConnector';
import {
    stringToFloat,
    instanceToObject,
    convertAttributes,
} from '@/utils/conversion';

interface IFreightsStoreState extends PiniaCustomStateProperties {
    _freights: Freight[];
    _newFreight: IFormData;
    _editFreight: IFormData;
}

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
    _items: [],
});

const apiAdapter = new APIAdapter('/freights');

export const useFreightsStore = defineStore('freights', {
    state: (): IFreightsStoreState => initialState(),
    getters: {
        freights: (state) => state._items,
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
        async loadPaginated(pageSize: number, pageNum: number) {
            return this.loadAllPaginated(Freight, pageSize, pageNum);
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
            const [attributes, apiAttrs] = convertAttrs(this._newFreight);

            await this.createRecordByAttrs({
                attributes,
                model: Freight,
                errorMsg: 'Falha ao criar frete.',
                successMsg: 'Frete criado com sucesso!',
            });

            this._newFreight = emptyFreightFormData();

            callOperation(() => apiAdapter.post({ url: '/', data: apiAttrs }));
        },
        async removeFreight(id: IFreight['id']) {
            await this.removeRecord({
                id,
                model: Freight,
                errorMsg: 'Falha ao remover frete.',
                successMsg: 'Frete removido com sucesso!',
            });

            callOperation(() => apiAdapter.delete({ url: `/${id}` }));
        },
        async updateFreight(id: IFreight['id']) {
            const [attributes, apiAttrs] = convertAttrs(this._editFreight);

            await this.updateRecord({
                id,
                attributes,
                model: Freight,
                errorMsg: 'Falha ao editar frete.',
                successMsg: 'Frete editado com sucesso!',
            });

            this._editFreight = emptyFreightFormData();

            callOperation(() =>
                apiAdapter.patch({ url: `/${id}`, data: apiAttrs })
            );
        },
    },
});
