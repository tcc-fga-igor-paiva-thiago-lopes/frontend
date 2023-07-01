import { defineStore, PiniaCustomStateProperties } from 'pinia';

import { SyncStatus } from '@/services/sync';
import { IFormData } from '@/components/Freights';
import { FilterData } from '@/models/appBaseEntity';
import { Freight, IFreight } from '@/models/freight';

type IFreightsStoreState = PiniaCustomStateProperties;

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

export const initialState = (): IFreightsStoreState => ({
    _items: [],
    _syncing: false,
    _filterData: {} as FilterData,
    _newItem: emptyFreightFormData(),
    _editItem: emptyFreightFormData(),
});

export const useFreightsStore = defineStore('freights', {
    state: (): IFreightsStoreState => initialState(),
    getters: {
        freights: (state) => state._items,
        syncing: (state) => state._syncing,
        filterData: (state) => state._filterData,
        newFreight: (state: IFreightsStoreState) => state._newItem as IFormData,
        editFreight: (state: IFreightsStoreState) =>
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
            await this.createRecordWithNewItem<Freight>({
                model: Freight,
                errorMsg: 'Falha ao criar frete.',
                successMsg: 'Frete criado com sucesso!',
            });

            this._newItem = emptyFreightFormData();
        },
        async removeFreight(id: IFreight['id']) {
            await this.softRemoveRecord<Freight>({
                id,
                model: Freight,
                errorMsg: 'Falha ao remover frete.',
                successMsg: 'Frete removido com sucesso!',
            });
        },
        async updateFreight(id: IFreight['id']) {
            await this.updateRecordWithEditItem<Freight>({
                id,
                model: Freight,
                errorMsg: 'Falha ao editar frete.',
                successMsg: 'Frete editado com sucesso!',
            });

            this._editItem = emptyFreightFormData();
        },
        async syncFreights(): Promise<SyncStatus[]> {
            return this.syncRecords<Freight>(Freight);
        },
        setFilter(value: FilterData) {
            this.setFilterData(value);
        },
    },
});
