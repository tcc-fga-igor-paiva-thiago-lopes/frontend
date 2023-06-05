import { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from '@ionic/vue-router';

import AuthService from '@/services/auth';
import { useAppStore } from '@/store/app';
import { presentToast } from '@/utils/toast';

import SignUp from '../views/SignUp.vue';
import SignIn from '../views/SignIn.vue';
import HomePage from '@/views/HomePage.vue';
import NotFound from '@/views/NotFound.vue';
import WelcomePage from '@/views/WelcomePage.vue';
import FreightsIndex from '@/views/FreightsIndex.vue';
import CategoriesGroups from '@/views/CategoriesGroups/CategoriesGroups.vue';

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
        path: '/freights',
        name: 'FreightsIndex',
        component: FreightsIndex,
        meta: { requiresAuth: true },
    },
    {
        path: '/categories-groups',
        name: 'CategoriesGroups',
        component: CategoriesGroups,
        meta: { requiresAuth: true },
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

export const offlinePermittedRoutes = ['Home', 'Welcome', 'NotFound'];

router.beforeEach(async (to, from) => {
    const { readNetworkStatus } = useAppStore();

    const connectionStatus = await readNetworkStatus();

    if (to.meta.requiresAuth && !(await AuthService.hasToken())) {
        return {
            name: 'SignIn',
            query: { redirect: to.fullPath },
        };
    }

    if (
        !connectionStatus.connected &&
        !offlinePermittedRoutes.includes(to.name as string)
    ) {
        presentToast(
            'Esta página não é permitida sem conexão com a Internet',
            'danger'
        );

        if (!offlinePermittedRoutes.includes(from.name as string)) {
            return { name: 'Home' };
        }

        return false;
    }

    if (
        (to.name === 'SignIn' || to.name === 'Welcome') &&
        (await AuthService.hasToken())
    ) {
        return {
            path: '/home',
        };
    }
});

export default router;
