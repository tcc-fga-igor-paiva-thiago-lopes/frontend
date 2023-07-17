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

import SyncManagement from '@/views/Sync/SyncManagement.vue';

import FreightShow from '@/views/Freights/FreightShow.vue';
import FreightEdit from '@/views/Freights/FreightEdit.vue';
import FreightsHome from '@/views/Freights/FreightsHome.vue';
import FreightCreate from '@/views/Freights/FreightCreate.vue';
import FreightsIndex from '@/views/Freights/FreightsIndex.vue';

import CategoryShow from '@/views/Categories/CategoryShow.vue';
import CategoryEdit from '@/views/Categories/CategoryEdit.vue';
import CategoryCreate from '@/views/Categories/CategoryCreate.vue';
import CategoriesIndex from '@/views/Categories/CategoriesIndex.vue';

import FreightAccountEdit from '@/views/Freights/Accounts/FreightAccountEdit.vue';
import FreightAccountShow from '@/views/Freights/Accounts/FreightAccountShow.vue';
import FreightAccountCreate from '@/views/Freights/Accounts/FreightAccountCreate.vue';
import FreightAccountsIndex from '@/views/Freights/Accounts/FreightAccountsIndex.vue';

import AnalysisIndex from '@/views/Analysis/AnalysisIndex.vue';
import ProfitPerColumn from '@/views/Analysis/Indicators/ProfitPerColumn.vue';
import ProfitPerPeriod from '@/views/Analysis/Indicators/ProfitPerPeriod.vue';

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
        path: '/sync',
        name: 'SyncManagement',
        component: SyncManagement,
        meta: { requiresAuth: true },
    },
    {
        path: '/analysis',
        name: 'AnalysisIndex',
        component: AnalysisIndex,
        meta: { requiresAuth: true },
    },
    {
        path: '/analysis/profit_per_column',
        name: 'ProfitPerColumn',
        component: ProfitPerColumn,
        meta: { requiresAuth: true },
    },
    {
        path: '/analysis/profit_per_period',
        name: 'ProfitPerPeriod',
        component: ProfitPerPeriod,
        meta: { requiresAuth: true },
    },
    {
        path: '/freights',
        name: 'FreightsHome',
        component: FreightsHome,
        meta: { requiresAuth: true },
    },
    {
        path: '/freights/all',
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
        path: '/freights/:freightId(\\d+)/accounts',
        name: 'FreightAccountsIndex',
        component: FreightAccountsIndex,
        meta: { requiresAuth: true },
    },
    {
        path: '/freights/:freightId(\\d+)/accounts/create',
        name: 'FreightAccountCreate',
        component: FreightAccountCreate,
        meta: { requiresAuth: true },
    },
    {
        path: '/freights/:freightId(\\d+)/accounts/:accountId(\\d+)',
        name: 'FreightAccountShow',
        component: FreightAccountShow,
        meta: { requiresAuth: true },
    },
    {
        path: '/freights/:freightId(\\d+)/accounts/:accountId(\\d+)/edit',
        name: 'FreightAccountEdit',
        component: FreightAccountEdit,
        meta: { requiresAuth: true },
    },
    {
        path: '/categories',
        name: 'CategoriesIndex',
        component: CategoriesIndex,
        meta: { requiresAuth: true },
    },
    {
        path: '/categories/create',
        name: 'CategoryCreate',
        component: CategoryCreate,
        meta: { requiresAuth: true },
    },
    {
        path: '/categories/:categoryId(\\d+)',
        name: 'CategoryShow',
        component: CategoryShow,
        meta: { requiresAuth: true },
    },
    {
        path: '/categories/:categoryId(\\d+)/edit',
        name: 'CategoryEdit',
        component: CategoryEdit,
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

export const offlinePermittedRoutes = [
    'Home',
    'Welcome',
    'NotFound',
    'SyncManagement',
    'FreightsIndex',
    'FreightCreate',
    'FreightShow',
    'FreightEdit',
];

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
