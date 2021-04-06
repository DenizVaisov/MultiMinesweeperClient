import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import i18n from './plugins/i18n';
import FlagIcon from 'vue-flag-icon';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(FlagIcon);

Vue.config.productionTip = false;
Vue.config.silent = true;

new Vue({
  el: '#app',
  i18n,
  router,
  render: h => h(App)
})