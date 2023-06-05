import { defineStore, PiniaCustomStateProperties } from 'pinia';

import APIAdapter from '@/services/api';
import { IFormData } from '@/views/CategoriesGroups';
import { CategoryGroup, ICategoryGroup } from '@/models/categoryGroup';
import { callOperation } from './helpers/apiConnector';

type CategoriesGroupsStoreState = PiniaCustomStateProperties;

const emptyCategoryGroupFormData = (): IFormData => ({
    name: '',
    color: '',
});

export const initialState = (): CategoriesGroupsStoreState => ({
    _items: [],
    _newItem: emptyCategoryGroupFormData(),
    _editItem: emptyCategoryGroupFormData(),
});

const apiAdapter = new APIAdapter('/CategoriesGroups');

export const useCategoriesGroupsStore = defineStore('CategoriesGroups', {
    state: (): CategoriesGroupsStoreState => initialState(),
    getters: {
        CategoriesGroups: (state) => state._items,
        newCategoryGroup: (state: CategoriesGroupsStoreState) =>
            state._newItem as IFormData,
        editCategoryGroup: (state: CategoriesGroupsStoreState) =>
            state._editItem as IFormData,
    },
    actions: {
        setNewCategoryGroupAttrs(attrs: Record<keyof IFormData, any>) {
            Object.assign(this._newItem, attrs);
        },
        setEditCategoryGroupAttrs(attrs: Record<keyof IFormData, any>) {
            Object.assign(this._editItem, attrs);
        },
        async loadPaginated(pageSize: number, pageNum: number) {
            return this.loadAllPaginated<CategoryGroup>(
                CategoryGroup,
                pageSize,
                pageNum
            );
        },
        async findEditCategoryGroup(id: ICategoryGroup['id']) {
            return this.findEditRecord<CategoryGroup>({
                model: CategoryGroup,
                id,
            });
        },
        async findCategoryGroup(id: ICategoryGroup['id'], asFormData = false) {
            return this.findRecord<CategoryGroup>(
                CategoryGroup,
                id,
                asFormData
            );
        },
        async createCategoryGroup() {
            const [, apiAttrs] =
                await this.createRecordWithNewItem<CategoryGroup>({
                    model: CategoryGroup,
                    errorMsg: 'Falha ao novo grupo.',
                    successMsg: 'Grupo criado com sucesso!',
                });

            this._newItem = emptyCategoryGroupFormData();

            callOperation(() => apiAdapter.post({ url: '/', data: apiAttrs }));
        },
        async removeCategoryGroup(id: ICategoryGroup['id']) {
            await this.removeRecord<CategoryGroup>({
                id,
                model: CategoryGroup,
                errorMsg: 'Falha ao remover grupo.',
                successMsg: 'Grupo removido com sucesso!',
            });

            callOperation(() => apiAdapter.delete({ url: `/${id}` }));
        },
        async updateCategoryGroup(id: ICategoryGroup['id']) {
            const [, apiAttrs] =
                await this.updateRecordWithEditItem<CategoryGroup>({
                    id,
                    model: CategoryGroup,
                    errorMsg: 'Falha ao editar grupo.',
                    successMsg: 'Grupo editado com sucesso!',
                });

            this._editItem = emptyCategoryGroupFormData();

            callOperation(() =>
                apiAdapter.patch({ url: `/${id}`, data: apiAttrs })
            );
        },
    },
});
