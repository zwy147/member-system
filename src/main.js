import Vue from "vue";
//在vue下面引入，防止app.vue中使用
//ElementUI组件库
import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
//使用ElementUI
Vue.use(ElementUI);
//权限拦截
import './permission'
Vue.config.productionTip = process.env.NODE_ENV === 'productionTip';
console.log(process.env.VUE_APP_SERVICE_URL);//开发环境 development,生产环境 production

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
