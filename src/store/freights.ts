import { defineStore, PiniaCustomStateProperties } from 'pinia';

import APIAdapter from '@/services/api';
import { IFormData } from '@/components/Freights';
import { Freight, IFreight } from '@/models/freight';
import { callOperation } from './helpers/apiConnector';
import { multipleDatabaseToApi } from '@/utils/conversion';

type FreightsStoreState = PiniaCustomStateProperties;

const emptyFreightFormData = (): IFormData => ({
    description: '',
    cargo: '',
    status: 'Não iniciado',
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

export const initialState = (): FreightsStoreState => ({
    _items: [],
    _newItem: emptyFreightFormData(),
    _editItem: emptyFreightFormData(),
});

const apiAdapter = new APIAdapter('/freights');

export const useFreightsStore = defineStore('freights', {
    state: (): FreightsStoreState => initialState(),
    getters: {
        freights: (state) => state._items,
        newFreight: (state: FreightsStoreState) => state._newItem as IFormData,
        editFreight: (state: FreightsStoreState) =>
            state._editItem as IFormData,
    },
    actions: {
        setNewFreightAttrs(attrs: Record<keyof IFormData, any>) {
            Object.assign(this._newItem, attrs);
        },
        setEditFreightAttrs(attrs: Record<keyof IFormData, any>) {
            Object.assign(this._editItem, attrs);
        },
        async loadPaginated(pageSize: number, pageNum: number) {
            return this.loadAllPaginated<Freight>(Freight, pageSize, pageNum);
        },
        async findEditFreight(id: IFreight['id']) {
            return this.findEditRecord<Freight>({ model: Freight, id });
        },
        async findFreight(id: IFreight['id'], asFormData = false) {
            return this.findRecord<Freight>(Freight, id, asFormData);
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
            await this.softRemoveRecord<Freight>({
                id,
                model: Freight,
                errorMsg: 'Falha ao remover frete.',
                successMsg: 'Frete removido com sucesso!',
            });

            callOperation(() => apiAdapter.delete({ url: `/${id}` }));
        },
        async updateFreight(id: IFreight['id']) {
            const [, apiAttrs] = await this.updateRecordWithEditItem<Freight>({
                id,
                model: Freight,
                errorMsg: 'Falha ao editar frete.',
                successMsg: 'Frete editado com sucesso!',
            });

            this._editItem = emptyFreightFormData();

            callOperation(() =>
                apiAdapter.patch({ url: `/${id}`, data: apiAttrs })
            );
        },
        async syncFreights() {
            const [toSync, toDelete] = await Freight.notSynced();

            const upsertPromise = apiAdapter
                .patch({
                    url: '/',
                    data: multipleDatabaseToApi(
                        toSync,
                        Freight.getRepository()
                    ),
                })
                .then((response) =>
                    Freight.updateByIdentifiers(response.data, {
                        synced: true,
                    })
                )
                .catch((response) => {
                    console.error(response);
                });

            const deletePromise = apiAdapter
                .delete({
                    url: '/',
                    params: { identifiers: toDelete },
                })
                .then((response) => Freight.deleteByIdentifiers(response.data))
                .catch((response) => {
                    console.error(response);
                });

            return Promise.all([upsertPromise, deletePromise]);
        },
    },
});
