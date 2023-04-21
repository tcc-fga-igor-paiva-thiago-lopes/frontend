import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import SignUp from '../views/SignUp.vue';
import HomePage from '@/views/HomePage.vue';
import NotFound from '../views/NotFound.vue';
import WelcomePage from '../views/WelcomePage.vue';

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/welcome',
        // TODO: redirect to home page when user is logged in and to signup when not
    },
    {
        path: '/welcome',
        name: 'Welcome',
        component: WelcomePage,
    },
    {
        path: '/home',
        name: 'Home',
        component: HomePage,
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp,
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

export default router;
