import { defineStore } from 'pinia';

import { Account, IAccount } from '@/models/account';

import { inMemberOperation } from './helpers';
import { runDatabaseOperation } from './databaseConnector';

interface IAccountsStoreState {
    _accounts: Account[];
}

const findAccountByAttrs = (attrs: Partial<IAccount>) =>
    Account.findOneBy(attrs);

export const useAccountsStore = defineStore('accounts', {
    state: (): IAccountsStoreState => ({
        _accounts: [] as Account[],
    }),
    getters: {
        accounts: (state: IAccountsStoreState) => state._accounts,
    },
    actions: {
        mergeAccounts(accounts: Account[]) {
            this._accounts = [...this._accounts, ...accounts];
        },
        async loadAccountsFromDatabase() {
            this._accounts = await Account.find();
        },
        async loadPaginated(pageSize: number, pageNum: number) {
            const paginationRet = await Account.findPaginated(
                pageSize,
                pageNum
            );

            const [results] = paginationRet;

            this.mergeAccounts(results);

            return paginationRet;
        },
        async findAccount(id: IAccount['id']) {
            return Account.findOneBy({ id });
        },
        async addAccount(attributes: Partial<IAccount>) {
            return runDatabaseOperation(async () => {
                this._accounts.push(await Account.createWithAttrs(attributes));
            });
        },
        async removeAccount(id: IAccount['id']) {
            return runDatabaseOperation(async () => {
                await inMemberOperation<Account, Partial<IAccount>>({
                    findAttrs: { id },
                    successMsg: 'Conta removida com sucesso!',
                    errorMsg: 'Falha ao remover conta.',
                    findFunc: findAccountByAttrs,
                    actionFunc: (instance) => instance.remove(),
                });

                await this.loadAccountsFromDatabase();
            });
        },
        async updateAccount(id: IAccount['id'], attrs: Partial<IAccount>) {
            return runDatabaseOperation(async () => {
                await inMemberOperation<Account, Partial<IAccount>>({
                    findAttrs: { id },
                    successMsg: 'Conta editada com sucesso!',
                    errorMsg: 'Falha ao editar conta.',
                    findFunc: findAccountByAttrs,
                    actionFunc: (instance) =>
                        instance.saveWithAttributes(attrs),
                });

                await this.loadAccountsFromDatabase();
            });
        },
        async removeAllAccounts() {
            return runDatabaseOperation(async () => {
                await Account.clear();

                this._accounts = [];
            });
        },
    },
});
