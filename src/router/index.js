import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);




export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    path: '/sampling_inspection_plan_generation',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/SamplingInspectionPlanGeneration.vue'),
                    meta: { title: '抽检计划生成' }
                },
                {
                    path: '/sampling_plan_during_generation',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/SamplingPlanDuringGeneration.vue'),
                    meta: { title: '生成中抽检计划'  }
                },
                {
                    path: '/generated_sampling_plan',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/SamplingLibraryManagement.vue'),
                    meta: { title: '已生成抽检计划' }
                },
                {
                    path: '/SamplingLibraryManagement',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/SamplingLibraryManagement.vue'),
                    meta: { title: '抽检库管理' }
                },
                {
                    path: '/food_type_management',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/FoodTypeManagement.vue'),
                    meta: { title: '食品类型管理' ,adminpermission:true}
                },
                {
                    path: '/food_risk_value_control',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/FoodRiskValueControl.vue'),
                    meta: { title: '食品风险值管控',permission: true }
                },
                {
                    path: '/sampling_account_management',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/SamplingAccountManagement.vue'),
                    meta: { title: '抽检账号管理',adminpermission:true}
                },
                {
                    path: '/sampling_inspector_information_management',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/SamplingInspectorInformationManagement.vue'),
                    meta: { title: '抽检员信息管理',adminpermission:true}
                },
                {
                    path: '/admin_account_manage',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/AdminMessageManage.vue'),
                    meta: { title: '管理员账号及权限管理',permission: true }
                },
                {
                    path: '/accountmanage',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/accountmanage.vue'),
                    meta: { title: '当前账号基本信息管理' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
