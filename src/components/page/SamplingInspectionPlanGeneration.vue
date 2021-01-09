<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 抽检计划生成
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-tickets"
                        class="handle-del mr10"
                        @click="popupdrawer"
                >开始生成抽检计划</el-button>
            </div>

        </div>
        <el-drawer
                title="抽检计划生成"
                :visible.sync="drawer"
                direction="rtl"
                custom-class="demo-drawer"
                ref="drawer"
        >
            <div class="demo-drawer__content">
                <div class="demo-drawer__content">
                    <el-form ref="form" :model="form">


                        <div style="margin-top: 20px;margin-left: 20px">
                            <span>选择此次抽检的食品类型</span>
                            <el-checkbox-group  v-model="typeoffoodselected">
                                <el-checkbox style="margin-top: 20px" v-for="name in foodtypes" :label="name" :key="name.id" border>{{name.type_name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>


                        <div style="margin-top: 20px;margin-left: 20px">
                            <span>选择参与此次抽检的抽检账号</span>
                            <el-checkbox-group v-model="selectedsamplingaccount">
                                <el-checkbox style="margin-top: 20px"  v-for="name in samplingaccount" :label="name" :key="name.id" border>{{name.s_account}}</el-checkbox>
                            </el-checkbox-group>
                        </div>

                    </el-form>
                    <div class="demo-drawer__footer" style="margin-top: 20px;margin-left: 20px" >
                        <el-button @click="cancelForm">取 消</el-button>
                        <!--<el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>-->
                        <el-button type="primary" @click="startgenerating">开始生成</el-button>
                    </div>
                </div>
            </div>
        </el-drawer>

    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import ElCheckbox from "../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue";
    export default {
        components: {ElCheckbox},
        name: 'samplinginspectionplangeneration',
        data() {
            return {
                drawer: false,
                loading: false,
                form:{},
                timer: null,
                foodtypes: {},
                typeoffoodselected:[],
                selectedsamplingaccount:[],
                samplingaccount:{}


            };
        },
        created() {
            this.getData();
        },
        methods: {
            //根据账号名获取抽检员信息表中的所有数据
            getData() {
            },
            popupdrawer(){

                this.foodtypes = []
                this.samplingaccount = []
                this.$axios.post('/ssaccount/selectAllCanParticipatebyadminid',
                    this.$qs.stringify(
                        {
                        })
                )
                    .then (response => {
                        if(response == null){
                            return;
                        }
                        for(var i=0;i<response.data.data.listaccount.length;i++){
                            this.samplingaccount = response.data.data.listaccount;
//                            this.samplingaccount.account[i]= response.data.data.listaccount[i].s_account;
//                            this.samplingaccount.id[i] = response.data.data.listaccount[i].id;
                        }
                        for(var i=0;i<response.data.data.listtype.length;i++){
                            this.foodtypes = response.data.data.listtype;
//                            this.foodtypes[i].foodtype = response.data.data.listtype[i].type_name;
//                            this.foodtypes[i].id = response.data.data.listtype[i].id;
                        }
                        this.drawer = true;

                    });


            },
            startgenerating(){
                console.log(this.typeoffoodselected)
                for(var i=0;i<this.selectedsamplingaccount.length;i++){
                    console.log(this.selectedsamplingaccount[i].id)
                }
                for(var i=0;i<this.typeoffoodselected.length;i++){
                    console.log(this.typeoffoodselected[i].id)
                }
            },
            /*处理事件提交以及加载层*/
            handleClose(done) {
                if (this.loading) {
                    return;
                }
                this.$confirm('确定要提交表单吗？')
                    .then(_ => {
                        this.loading = true;
                        this.timer = setTimeout(() => {
                            done();
                            // 动画关闭需要一定的时间
                            setTimeout(() => {
                                this.loading = false;
                            }, 400);
                        }, 2000);
                    })
                    .catch(_ => {});
            },
            /*关闭抽屉*/
            cancelForm() {
//                this.loading = false;
                this.drawer = false;
                clearTimeout(this.timer);
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
