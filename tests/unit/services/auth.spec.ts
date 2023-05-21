import AuthService from '@/services/auth';
import { createPinia, setActivePinia } from 'pinia';
import { Preferences } from '@capacitor/preferences';

import { DatabaseHelper } from '../../databaseHelper';

const mockDataSource = DatabaseHelper.dataSource();

jest.mock('@/database/accountsDataSource', () => {
    return jest.fn().mockImplementation(() => ({
        __esModule: true,
        default: mockDataSource,
    }));
});

jest.mock('@/database', () => {
    return jest.fn().mockImplementation(() => ({ default: {} }));
});

describe('AuthService', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
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
});
