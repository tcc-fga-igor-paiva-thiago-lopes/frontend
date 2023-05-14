import { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from '@ionic/vue-router';

import AuthService from '@/services/auth';
import { useAppStore } from '@/store/app';
import { presentToast } from '@/utils/toast';

import SignUp from '../views/SignUp.vue';
import SignIn from '../views/SignIn.vue';
import HomePage from '@/views/HomePage.vue';
import NotFound from '../views/NotFound.vue';
import WelcomePage from '../views/WelcomePage.vue';

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/welcome',
    },
    {
        path: '/welcome',
        name: 'Welcome',
        component: WelcomePage,
        meta: { requiresAuth: false },
    },
    {
        path: '/home',
        name: 'Home',
        component: HomePage,
        meta: { requiresAuth: true },
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp,
        meta: { requiresAuth: false },
    },
    {
        path: '/login',
        name: 'SignIn',
        component: SignIn,
        meta: { requiresAuth: false },
    },
    {
        // Always leave this as last one
        path: '/:pathMatch(.*)',
        name: 'NotFound',
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

const offlinePermittedRoutes = ['Home', 'NotFound'];

router.beforeEach(async (to) => {
    const { readNetworkStatus } = useAppStore();

    const connectionStatus = await readNetworkStatus();

    if (to.meta.requiresAuth && !(await AuthService.hasToken())) {
        return {
            name: 'SignIn',
            query: { redirect: to.fullPath },
        };
    } else if (
        !connectionStatus.connected &&
        !offlinePermittedRoutes.includes(to.name as string)
    ) {
        presentToast(
            'Esta página não é permitida sem conexão com a Internet',
            'danger'
        );

        return { name: 'Home' };
    }
});

export default router;
