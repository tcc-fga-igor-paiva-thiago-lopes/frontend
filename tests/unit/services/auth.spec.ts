import AuthService from '@/services/auth';
import { setActivePinia } from 'pinia';
import { Preferences } from '@capacitor/preferences';

import router from '@/router';
import { presentToast } from '@/utils/toast';
import { createTestingPinia } from '@pinia/testing';
import { initialState, useAppStore } from '@/store/app';

import { DatabaseHelper } from '../../databaseHelper';

const mockDataSource = DatabaseHelper.dataSource();

jest.mock('@/database/dataSource', () => {
    return jest.fn().mockImplementation(() => ({
        __esModule: true,
        default: mockDataSource,
    }));
});

jest.mock('@/database', () => {
    return jest.fn().mockImplementation(() => ({ default: {} }));
});

jest.mock('@/utils/toast');

jest.mock('@/router', () => ({
    __esModule: true,
    default: {
        push: jest.fn(),
        replace: jest.fn(),
        currentRoute: { value: { name: 'Home' } },
    },
}));

const presentToastMock = presentToast as jest.Mock<any, any>;

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

    it('should remove all keys from preferences in logout', async () => {
        const appStore = useAppStore();

        jest.spyOn(Preferences, 'clear').mockImplementation(() =>
            Promise.resolve()
        );

        jest.spyOn(appStore, 'openLoading').mockImplementationOnce(() =>
            Promise.resolve()
        );

        jest.spyOn(appStore, 'closeLoading').mockImplementationOnce(() =>
            Promise.resolve()
        );

        jest.spyOn(appStore, 'clearDatabase').mockImplementationOnce(() =>
            Promise.resolve()
        );

        appStore._username = 'John';

        expect(appStore.username).toEqual('John');

        await AuthService.logout();

        expect(Preferences.clear).toHaveBeenCalled();
        // With stubActions = True (default) we can check if action was called
        // expect(appStore.setUsername).toHaveBeenCalledWith('');

        expect(appStore.username).toEqual('');
        expect(router.replace).toHaveBeenCalledWith({ name: 'Welcome' });
        expect(presentToastMock).toBeCalledTimes(0);
        expect(appStore.openLoading).toHaveBeenCalled();
        expect(appStore.closeLoading).toHaveBeenCalled();
    });
});
