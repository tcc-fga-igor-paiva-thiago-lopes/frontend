import router from '@/router';
import { useAppStore } from '@/store/app';
import { presentToast } from '@/utils/toast';
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'token';

export default class AuthService {
    static async getToken() {
        return (await Preferences.get({ key: TOKEN_KEY })).value;
    }

    static async setToken(token: string) {
        Preferences.set({ key: TOKEN_KEY, value: token });
    }

    static async deleteToken() {
        return Preferences.remove({ key: TOKEN_KEY });
    }

    static async hasToken() {
        const token = await this.getToken();

        return !!token;
    }

    static async logout() {
        const { setUsername, openLoading, closeLoading, clearDatabase } =
            useAppStore();

        openLoading();

        try {
            await clearDatabase();

            await Preferences.clear();

            await setUsername('');

            await router.replace({ name: 'Welcome' });
        } catch (error) {
            console.error(error);

            await presentToast(
                'Falha ao deslogar. Tente novamente mais tarde...',
                'danger'
            );
        } finally {
            closeLoading();
        }
    }
}
