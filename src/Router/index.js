import { createRouter, createWebHistory } from 'vue-router';
import SearchPage from '../components/SearchPage.vue';
import Calculator from '../components/Calculator.vue';
import Hello from "@/components/Hello.vue";

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
    {
        path: '/hello',
        name: 'Hello',
        component: Hello,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;