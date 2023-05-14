import router from '@/router';
import { useAppStore } from '@/store/app';
import { Preferences } from '@capacitor/preferences';

export default class AuthService {
    static async getToken() {
        return (await Preferences.get({ key: 'token' })).value;
    }

    static async setToken(token: string) {
        Preferences.set({ key: 'token', value: token });
    }

    static async deleteToken() {
        return Preferences.remove({ key: 'token' });
    }

    static async hasToken() {
        return (await this.getToken()) != null;
    }

    static async logout() {
        const { setUsername } = useAppStore();

        await AuthService.deleteToken();

        await setUsername('');

        router.push({ name: 'Welcome' });
    }
}
