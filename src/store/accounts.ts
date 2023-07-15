import { defineStore, PiniaCustomStateProperties } from 'pinia';

import { SyncStatus } from '@/services/sync';
import { IFormData } from '@/components/Accounts';
import { Account, IAccount } from '@/models/account';
import { FilterData, IOrderData } from '@/models/appBaseEntity';

type AccountsStoreState = PiniaCustomStateProperties;

const emptyAccountFormData = (): IFormData => ({
    id: 0,
    name: '',
    value: '',
    description: '',
    accountDate: '',
    freightId: '',
    categoryId: '',
    createdAt: '',
    updatedAt: '',
});

export const initialState = (): AccountsStoreState => ({
    _items: [],
    _syncing: false,
    _filterData: {} as FilterData,
    _newItem: emptyAccountFormData(),
    _editItem: emptyAccountFormData(),
    _orderData: { field: 'createdAt', order: 'DESC' },
});

export const useAccountsStore = defineStore('accounts', {
    state: (): AccountsStoreState => initialState(),
    getters: {
        accounts: (state) => state._items,
        syncing: (state) => state._syncing,
        orderData: (state) => state._orderData,
        filterData: (state) => state._filterData,
        newAccount: (state: AccountsStoreState) => state._newItem as IFormData,
        editAccount: (state: AccountsStoreState) =>
            state._editItem as IFormData,
    },
    actions: {
        setNewAccountAttrs(attrs: Record<keyof IFormData, any>) {
            Object.assign(this._newItem, attrs);
        },
        setEditAccountAttrs(attrs: Record<keyof IFormData, any>) {
            Object.assign(this._editItem, attrs);
        },
        setFilter(value: FilterData) {
            this.setFilterData(value);
        },
        setOrder(value: Partial<IOrderData>) {
            this.changeOrderData(value);
        },
        async loadPaginated(pageSize: number, pageNum: number) {
            return this.loadAllPaginated<Account>(Account, pageSize, pageNum);
        },
        async findEditAccount(id: IAccount['id']) {
            return this.findEditRecord<Account>({ model: Account, id });
        },
        async findAccount(id: IAccount['id'], asFormData = false) {
            return this.findRecord<Account>(Account, id, asFormData);
        },
        async createAccount() {
            await this.createRecordWithNewItem<Account>({
                model: Account,
                errorMsg: 'Falha ao criar gasto.',
                successMsg: 'Gasto criada com sucesso!',
            });

            this._newItem = emptyAccountFormData();
        },
        async removeAccount(id: IAccount['id']) {
            await this.softRemoveRecord<Account>({
                id,
                model: Account,
                errorMsg: 'Falha ao remover gasto.',
                successMsg: 'Gasto removida com sucesso!',
            });
        },
        async updateAccount(id: IAccount['id']) {
            await this.updateRecordWithEditItem<Account>({
                id,
                model: Account,
                errorMsg: 'Falha ao editar gasto.',
                successMsg: 'Gasto editada com sucesso!',
            });

            this._editItem = emptyAccountFormData();
        },
        async syncAccounts(): Promise<SyncStatus[]> {
            return this.syncRecords<Account>(Account);
        },
        async findFreightAccounts(
            freightId: number,
            filterData: FilterData,
            orderData: IOrderData
        ): Promise<[Account[], number]> {
            return Account.addFilterToQuery(
                Account.createQueryBuilder('account')
                    .where({ freightId })
                    .innerJoinAndSelect('account.category', 'category'),
                filterData,
                orderData
            ).getManyAndCount();
        },
    },
});
