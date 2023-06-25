import { defineStore, PiniaCustomStateProperties } from 'pinia';

import APIAdapter from '@/services/api';
import { SyncStatus } from '@/services/sync';
import { IFormData } from '@/components/Freights';
import { Freight, IFreight } from '@/models/freight';
import { multipleDatabaseToApi } from '@/utils/conversion';

interface IFreightsStoreState extends PiniaCustomStateProperties {
    _syncing: boolean;
}

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
    _newItem: emptyFreightFormData(),
    _editItem: emptyFreightFormData(),
});

const apiAdapter = new APIAdapter('/freights');

export const useFreightsStore = defineStore('freights', {
    state: (): IFreightsStoreState => initialState(),
    getters: {
        freights: (state) => state._items,
        syncing: (state) => state._syncing,
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
            if (this._syncing) return [];

            // TODO: run this inside change database operation

            try {
                this._syncing = true;

                const promises = [];
                const [toSync, toDelete] = await Freight.notSynced();

                if (toSync.length) {
                    promises.push(
                        apiAdapter
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
                            })
                    );
                } else {
                    promises.push(Promise.resolve('ignored'));
                }

                if (toSync.length) {
                    promises.push(
                        apiAdapter
                            .delete({
                                url: '/',
                                params: { identifiers: toDelete },
                            })
                            .then((response) =>
                                Freight.deleteByIdentifiers([
                                    ...response.data.deleted,
                                    ...response.data.not_exists,
                                ])
                            )
                            .catch((response) => {
                                console.error(response);
                            })
                    );
                } else {
                    promises.push(Promise.resolve('ignored'));
                }

                const settledResults = await Promise.allSettled(promises);

                return settledResults.map((result) => {
                    if (result.status !== 'fulfilled') return 'error';

                    return result.value && typeof result.value === 'string'
                        ? (result.value as SyncStatus)
                        : 'success';
                });
            } catch (error) {
                console.error(error);

                return ['error', 'error'];
            } finally {
                this._syncing = false;
            }
        },
    },
});
