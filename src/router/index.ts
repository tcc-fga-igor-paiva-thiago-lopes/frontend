import { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from '@ionic/vue-router';

import AuthService from '@/services/auth';
import { presentToast } from '@/utils/toast';
import { isRouteOfflinePermitted } from '@/utils/offline';

import SignUp from '../views/SignUp.vue';
import SignIn from '../views/SignIn.vue';
import HomePage from '@/views/HomePage.vue';
import NotFound from '@/views/NotFound.vue';
import WelcomePage from '@/views/WelcomePage.vue';
import FreightShow from '@/views/Freights/FreightShow.vue';
import FreightEdit from '@/views/Freights/FreightEdit.vue';
import FreightsIndex from '@/views/Freights/FreightsIndex.vue';
import FreightCreate from '@/views/Freights/FreightCreate.vue';

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
        path: '/freights/create',
        name: 'FreightCreate',
        component: FreightCreate,
        meta: { requiresAuth: true },
    },
    {
        path: '/freights/:freightId(\\d+)',
        name: 'FreightShow',
        component: FreightShow,
        meta: { requiresAuth: true },
    },
    {
        path: '/freights/:freightId(\\d+)/edit',
        name: 'FreightEdit',
        component: FreightEdit,
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
    if (to.meta.requiresAuth && !(await AuthService.hasToken())) {
        return {
            name: 'SignIn',
            query: { redirect: to.fullPath },
        };
    }

    if (await isRouteOfflinePermitted(to.name as string)) {
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
