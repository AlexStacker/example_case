import Vue from 'vue';
import router from './router';
import store from './store';

Vue.config.productionTip = process.env.NODE_ENV !== 'production';

new Vue({
  router,
  store,
  render: h => h('router-view')
}).$mount('#app');
