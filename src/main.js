import Home from './Home.vue';
import Users from './Users.vue';
import Venues from './Venues.vue';
import Login from './Login.vue';
import Signup from './Signup.vue';
import Venue from './Venue.vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Vue from 'vue';
import App from './App.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import VueCookies from 'vue-cookies';
VueCookies.config('1d');
Vue.use(VueCookies);

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

Vue.http.emulateJSON = true;

const routes = [
  {
    path: "/",
    name: 'Home',
    component: Home
  },
  {
    path: "/Venues",
    name: 'Venues',
    component: Venues
  },
  {
    path: "/Venues/:venueId",
    name: 'Venue',
    component: Venue
  },
  {
    path: "/Users",
    name: 'Users',
    component: Users
  },
  {
    path: "/Login",
    name: 'Login',
    component: Login
  },
  {
    path: "/Signup",
    name: 'Signup',
    component: Signup
  },
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
