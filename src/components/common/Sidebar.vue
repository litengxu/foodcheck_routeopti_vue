<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
//                {
//                    icon: 'el-icon-lx-home',
//                    index: 'dashboard',
//                    title: '系统首页'
//                },
//                {
//                    icon: 'el-icon-lx-cascades',
//                    index: 'table',
//                    title: '基础表格'
//                },
//                {
//                    icon: 'el-icon-lx-copy',
//                    index: 'tabs',
//                    title: 'tab选项卡'
//                },
                {
                    icon:'el-icon-place',
                    index: 'sampling_inspection_plan_generation',
                    title: '抽检计划生成'
                },
                {
                    icon: 'el-icon-guide',
                    index: 'sampling_plan_management',
                    title: '抽检计划管理',
                    subs: [
//                                {
//                                    index: 'sampling_plan_during_generation',
//                                    title: '生成中抽检计划'
//                                },
                                {
                                    index: 'generated_sampling_plan',
                                    title: '已生成的抽检计划'
                                },
                    ]
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: 'SamplingLibraryManagement',
                    title: '抽检库管理'
                },
                {
                    icon: 'el-icon-data-analysis',
                    index: 'food_risk_value_and_type',
                    title: '食品风险值及类型',
                    subs: [
                        {
                            index: 'food_type_management',
                            title: '食品类型管理'
                        },
                        {
                            index: 'food_risk_value_control',
                            title: '食品风险值管控'
                        },
                    ]
                },{
                    icon: 'el-icon-lx-calendar',
                    index: '9',
                    title: '分组管理',
                    subs: [
                        {
                            index: 'sampling_account_management',
                            title: '抽检主体管理'
                        },
                        {
                            index: 'sampling_inspector_information_management',
                            title: '抽检员信息管理'
                        },
                        {
                            index: 'ask_for_leave_management',
                            title: '抽检员请假管理'
                        },
                    ]
                },
                {
                    icon: 'el-icon-s-data',
                    index: 'history_management',
                    title: '历史信息查看',
                    subs: [
                        {
                            index: 'sampling_account_management_history',
                            title: '抽检主体历史信息查看'
                        }
                    ]
                },
                {
                    icon: 'el-icon-s-custom',
                    index: '3',
                    title: '用户相关',
                    subs: [
                        {
                            index: 'accountmanage',
                            title: '当前账号基本信息管理'
                        },
                        {
                            index: 'admin_account_manage',
                            title: '管理员账号及权限管理'
                        }
//                        },
//                        {
//                            index: 'form',
//                            title: '表单管理'
//                        },
//                        {
//                            index: '3-2',
//                            title: '三级菜单',
//                            subs: [
//                                {
//                                    index: 'editor',
//                                    title: '富文本编辑器'
//                                },
//                                {
//                                    index: 'markdown',
//                                    title: 'markdown编辑器'
//                                }
//                            ]
//                        },
//                        {
//                            index: 'upload',
//                            title: '文件上传'
//                        }
                    ]
                },
//                {
//                    icon: 'el-icon-lx-emoji',
//                    index: 'icon',
//                    title: '自定义图标'
//                },
//                {
//                    icon: 'el-icon-pie-chart',
//                    index: 'charts',
//                    title: 'schart图表'
//                },
//                {
//                    icon: 'el-icon-rank',
//                    index: '6',
//                    title: '拖拽组件',
//                    subs: [
//                        {
//                            index: 'drag',
//                            title: '拖拽列表'
//                        },
//                        {
//                            index: 'dialog',
//                            title: '拖拽弹框'
//                        }
//                    ]
//                },
//                {
//                    icon: 'el-icon-lx-global',
//                    index: 'i18n',
//                    title: '国际化功能'
//                },
//                {
//                    icon: 'el-icon-lx-warn',
//                    index: '7',
//                    title: '错误处理',
//                    subs: [
//                        {
//                            index: 'permission',
//                            title: '权限测试'
//                        },
//                        {
//                            index: '404',
//                            title: '404页面'
//                        }
//                    ]
//                },
//                {
//                    icon: 'el-icon-lx-redpacket_fill',
//                    index: '/donate',
//                    title: '支持作者'
//                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
