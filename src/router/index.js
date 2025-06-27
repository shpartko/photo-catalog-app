import Vue from 'vue';
import VueRouter from 'vue-router';
import CatalogView from '../views/CatalogView.vue';
import FavoritesView from '../views/FavoritesView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'catalog',
    component: CatalogView,
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesView,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
