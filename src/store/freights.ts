import { defineStore, PiniaCustomStateProperties } from 'pinia';

import APIAdapter from '@/services/api';
import { IFormData } from '@/components/Freights';
import { Freight, IFreight } from '@/models/freight';
import { callOperation } from './helpers/apiConnector';
import { instanceToObject, formDataToDatabaseAndApi } from '@/utils/conversion';

interface IFreightsStoreState extends PiniaCustomStateProperties {
    _editFreight: IFormData;
}

const convertAttrs = (attrs: IFormData) => {
    return formDataToDatabaseAndApi({
        attrs,
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
    _newItem: emptyFreightFormData(),
    _editFreight: emptyFreightFormData(),
    _items: [],
});

const apiAdapter = new APIAdapter('/freights');

export const useFreightsStore = defineStore('freights', {
    state: (): IFreightsStoreState => initialState(),
    getters: {
        freights: (state) => state._items,
        editFreight: (state: IFreightsStoreState) => state._editFreight,
        newFreight: (state: IFreightsStoreState) => state._newItem as IFormData,
    },
    actions: {
        setNewFreightAttrs(attrs: Record<keyof IFormData, any>) {
            Object.assign(this._newItem, attrs);
        },
        setEditFreightAttr(field: keyof IFormData, value: any) {
            this._editFreight[field] = value;
        },
        async loadPaginated(pageSize: number, pageNum: number) {
            return this.loadAllPaginated<Freight>(Freight, pageSize, pageNum);
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
            const [, apiAttrs] = await this.createRecordWithNewItem<Freight>({
                model: Freight,
                errorMsg: 'Falha ao criar frete.',
                successMsg: 'Frete criado com sucesso!',
            });

            this._newItem = emptyFreightFormData();

            callOperation(() => apiAdapter.post({ url: '/', data: apiAttrs }));
        },
        async removeFreight(id: IFreight['id']) {
            await this.removeRecord<Freight>({
                id,
                model: Freight,
                errorMsg: 'Falha ao remover frete.',
                successMsg: 'Frete removido com sucesso!',
            });

            callOperation(() => apiAdapter.delete({ url: `/${id}` }));
        },
        async updateFreight(id: IFreight['id']) {
            const [attributes, apiAttrs] = convertAttrs(this._editFreight);

            await this.updateRecord<Freight>({
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
