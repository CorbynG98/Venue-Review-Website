import Home from './Home.vue';
import Vue from 'vue';
import App from './App.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

const routes = [
  {
    path: "/",
    component: Home
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});



new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
