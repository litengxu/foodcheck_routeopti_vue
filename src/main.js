import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';

import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import Api from './api/index.js';
import store from './store/store';
import Axios from './api/axiosconfig';
import qs from 'qs';

Vue.prototype.$qs = qs;
Vue.prototype.$axios = Axios;

// Axios.defaults.baseURL = 'http://211.159.161.189:7070';
Axios.defaults.baseURL = 'http://127.0.0.1:7070';
// Axios.defaults.baseURL = 'http://81.70.154.182:7070';
// Axios.defaults.baseURL = 'http://47.94.240.186:7070';
// Vue.prototype.$api = Api;
Vue.prototype.$store = store;

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});
// axios.defaults.baseURL ="http://localhost:7070/"; //开发环境
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | manage-system`;
    const rolename = localStorage.getItem('rolename');
    const  token = localStorage.getItem('token');
    if (!token && to.path !== '/login') {

        next('/login');
    } else if (to.meta.permission) {
        // 如果是超级管理员权限则可进入
        rolename === 'superadmin' ? next() : next('/403');
        //控制台会弹出重定向错误，不影响使用，直接清空
        console.clear()

    } else if (to.meta.adminpermission) {
        // 如果是管理员权限则可进入
        rolename === 'admin' ? next() : next('/403');
        //控制台会弹出重定向错误，不影响使用，直接清空
        console.clear()

    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
