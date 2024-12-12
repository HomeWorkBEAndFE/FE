import { createRouter, createWebHistory } from 'vue-router';
import SearchPage from '../components/SearchPage.vue';
import Calculator from '../components/Calculator.vue';

const routes = [
    {
        path: '/',
        name: 'Search',
        component: SearchPage,
    },
    {
        path: '/calculate',
        name: 'Calculator',
        component: Calculator,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;