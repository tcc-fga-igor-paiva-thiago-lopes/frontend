import { defineStore, PiniaCustomStateProperties } from 'pinia';

import APIAdapter from '@/services/api';
import { IFormData } from '@/components/Categories';
import { Category, ICategory } from '@/models/category';
import { callOperation } from './helpers/apiConnector';

type CategoriesStoreState = PiniaCustomStateProperties;

const emptyCategoryFormData = (): IFormData => ({
    name: '',
    color: '',
});

export const initialState = (): CategoriesStoreState => ({
    _items: [],
    _newItem: emptyCategoryFormData(),
    _editItem: emptyCategoryFormData(),
});

const apiAdapter = new APIAdapter('/Categories');

export const useCategoriesStore = defineStore('Categories', {
    state: (): CategoriesStoreState => initialState(),
    getters: {
        Categories: (state) => state._items,
        newCategory: (state: CategoriesStoreState) =>
            state._newItem as IFormData,
        editCategory: (state: CategoriesStoreState) =>
            state._editItem as IFormData,
    },
    actions: {
        setNewCategoryAttrs(attrs: Record<keyof IFormData, any>) {
            Object.assign(this._newItem, attrs);
        },
        setEditCategoryAttrs(attrs: Record<keyof IFormData, any>) {
            Object.assign(this._editItem, attrs);
        },
        async loadPaginated(pageSize: number, pageNum: number) {
            return this.loadAllPaginated<Category>(Category, pageSize, pageNum);
        },
        async findEditCategory(id: ICategory['id']) {
            return this.findEditRecord<Category>({
                model: Category,
                id,
            });
        },
        async findCategory(id: ICategory['id'], asFormData = false) {
            return this.findRecord<Category>(Category, id, asFormData);
        },
        async createCategory() {
            const [, apiAttrs] = await this.createRecordWithNewItem<Category>({
                model: Category,
                errorMsg: 'Falha ao nova categoria.',
                successMsg: 'Categoria criada com sucesso!',
            });

            this._newItem = emptyCategoryFormData();

            callOperation(() => apiAdapter.post({ url: '/', data: apiAttrs }));
        },
        async removeCategory(id: ICategory['id']) {
            await this.removeRecord<Category>({
                id,
                model: Category,
                errorMsg: 'Falha ao remover categoria.',
                successMsg: 'Categoria removida com sucesso!',
            });

            callOperation(() => apiAdapter.delete({ url: `/${id}` }));
        },
        async updateCategory(id: ICategory['id']) {
            const [, apiAttrs] = await this.updateRecordWithEditItem<Category>({
                id,
                model: Category,
                errorMsg: 'Falha ao editar categoria.',
                successMsg: 'Categoria editada com sucesso!',
            });

            this._editItem = emptyCategoryFormData();

            callOperation(() =>
                apiAdapter.patch({ url: `/${id}`, data: apiAttrs })
            );
        },
    },
});
