import { defineStore, PiniaCustomStateProperties } from 'pinia';

import { SyncStatus } from '@/services/sync';
import { IFormData } from '@/components/Categories';
import { Category, ICategory } from '@/models/category';
import { FilterData, IOrderData } from '@/models/appBaseEntity';

type CategoriesStoreState = PiniaCustomStateProperties;

const emptyCategoryFormData = (): IFormData => ({
    name: '',
    color: '#FFFFFF',
});

export const initialState = (): CategoriesStoreState => ({
    _items: [],
    _syncing: false,
    _filterData: {} as FilterData,
    _newItem: emptyCategoryFormData(),
    _editItem: emptyCategoryFormData(),
    _orderData: { field: 'createdAt', order: 'DESC' },
});

export const useCategoriesStore = defineStore('categories', {
    state: (): CategoriesStoreState => initialState(),
    getters: {
        categories: (state) => state._items,
        syncing: (state) => state._syncing,
        orderData: (state) => state._orderData,
        filterData: (state) => state._filterData,
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
        setFilter(value: FilterData) {
            this.setFilterData(value);
        },
        setOrder(value: Partial<IOrderData>) {
            this.changeOrderData(value);
        },
        async loadPaginated(pageSize: number, pageNum: number) {
            return this.loadAllPaginated<Category>(Category, pageSize, pageNum);
        },
        async findEditCategory(id: ICategory['id']) {
            return this.findEditRecord<Category>({ model: Category, id });
        },
        async findCategory(id: ICategory['id'], asFormData = false) {
            return this.findRecord<Category>(Category, id, asFormData);
        },
        async createCategory() {
            await this.createRecordWithNewItem<Category>({
                model: Category,
                errorMsg: 'Falha ao criar categoria.',
                successMsg: 'Categoria criada com sucesso!',
            });

            this._newItem = emptyCategoryFormData();
        },
        async removeCategory(id: ICategory['id']) {
            await this.softRemoveRecord<Category>({
                id,
                model: Category,
                errorMsg: 'Falha ao remover categoria.',
                successMsg: 'Categoria removida com sucesso!',
            });
        },
        async updateCategory(id: ICategory['id']) {
            await this.updateRecordWithEditItem<Category>({
                id,
                model: Category,
                errorMsg: 'Falha ao editar categoria.',
                successMsg: 'Categoria editada com sucesso!',
            });

            this._editItem = emptyCategoryFormData();
        },
        async syncCategories(): Promise<SyncStatus[]> {
            return this.syncRecords<Category>(Category);
        },
    },
});
