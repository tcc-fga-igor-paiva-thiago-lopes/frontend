import AuthService from '@/services/auth';
import { Preferences } from '@capacitor/preferences';

describe('AuthService', () => {
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
