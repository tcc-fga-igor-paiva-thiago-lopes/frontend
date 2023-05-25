import AuthService from '@/services/auth';
import { setActivePinia } from 'pinia';
import { Preferences } from '@capacitor/preferences';

import router from '@/router';
import { createTestingPinia } from '@pinia/testing';
import { initialState, useAppStore } from '@/store/app';

import { DatabaseHelper } from '../../databaseHelper';

const mockDataSource = DatabaseHelper.dataSource();

jest.mock('@/database/databaseDataSource', () => {
    return jest.fn().mockImplementation(() => ({
        __esModule: true,
        default: mockDataSource,
    }));
});

jest.mock('@/database', () => {
    return jest.fn().mockImplementation(() => ({ default: {} }));
});

jest.mock('@/router', () => ({
    __esModule: true,
    default: { push: jest.fn(), currentRoute: { value: { name: 'Home' } } },
}));

describe('AuthService', () => {
    beforeEach(() => {
        setActivePinia(
            createTestingPinia({
                stubActions: false,
                initialState: {
                    application: initialState(),
                },
            })
        );
    });

    it('should create token in preferences', async () => {
        await AuthService.setToken('test01');
        expect(Preferences.set).toHaveBeenCalledWith({
            key: 'token',
            value: 'test01',
        });
    });

    it('should return token from preferences', async () => {
        jest.spyOn(Preferences, 'get').mockImplementation(() =>
            Promise.resolve({ value: 'test' })
        );

        const token = await AuthService.getToken();
        expect(token).toBe('test');
    });

    it('should return true if token exists', async () => {
        jest.spyOn(Preferences, 'get').mockImplementation(() =>
            Promise.resolve({ value: 'test' })
        );

        const hasToken = await AuthService.hasToken();
        expect(hasToken).toBe(true);
    });

    it('should delete token from preferences', async () => {
        await AuthService.deleteToken();

        expect(Preferences.remove).toHaveBeenCalledWith({ key: 'token' });
    });

    it('should remove username and token from preferences in logout', async () => {
        const appStore = useAppStore();

        appStore._username = 'John';

        expect(appStore.username).toEqual('John');

        await AuthService.logout();

        expect(Preferences.remove).toHaveBeenCalledWith({ key: 'token' });
        // With stubActions = True (default) we can check if action was called
        // expect(appStore.setUsername).toHaveBeenCalledWith('');

        expect(appStore.username).toEqual('');
        expect(router.push).toHaveBeenCalledWith({ name: 'Welcome' });
    });
});
