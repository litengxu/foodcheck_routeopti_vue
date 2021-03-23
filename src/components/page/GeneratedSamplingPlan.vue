<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 已生成的抽检计划
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--基本信息-->
            <el-table
                    v-if="tableshow"
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    style="width: 100%"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <li v-for="(val,index) in props.row.groupList">
                            <span>第{{index+1}}组</span>
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="抽检员">
                                    <span> {{val.names}}</span>
                                </el-form-item>
                                <el-form-item label="抽检账号">
                                    <span> {{val.account}}</span>
                                </el-form-item>
                                <el-form-item label="接受任务时间">
                                    <span> {{val.acceptTimeStamp}}</span>
                                </el-form-item>
                                <el-form-item label="完成任务时间">
                                    <span> {{val.finishTimeStamp}}</span>
                                </el-form-item>
                                <el-form-item label="抽检地点顺序" >
                                    <a v-for="(temp,tempindex) in val.samplingPointsNames">
                                        <span > {{temp}}</span>
                                        <span v-if="tempindex!=val.samplingPointsNames.length-1"> >></span>
                                    </a>
                                </el-form-item>
                                <el-form-item label="抽检地址顺序" >
                                    <a v-for="tempindex in val.samplePlanInfoTableList.length">
                                        <span>{{ val.samplePlanInfoTableList[tempindex -1].address}}</span>
                                        <span>({{ val.samplePlanInfoTableList[tempindex -1].state}})</span>
                                        <span v-if="tempindex!=val.samplePlanInfoTableList.length"> >></span>
                                    </a>
                                </el-form-item>
                            </el-form>

                        </li>

                    </template>
                </el-table-column>
                <el-table-column sortable prop="startPoint" label="起始点"></el-table-column>
                <el-table-column sortable  prop="samplingnames" label="抽检点"></el-table-column>
                <el-table-column sortable prop="foodtypes" label="抽检食品"></el-table-column>
                <el-table-column sortable prop="createTimeStamp" label="开始时间"></el-table-column>
                <el-table-column sortable prop="state" label="抽检状态"></el-table-column>

            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size= "query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>


    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import ElCheckbox from "../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue";
    export default {
        components: {ElCheckbox},
        name: 'foodtypemanagement',
        data() {
            return {

                formLabelWidth: '70px',
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 2
//                pageSize: [100, 200, 300, 400]
                },
                tableData: [],
                tableshow:false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,



            };
        },
        created() {

            this.getData();
        },
        mounted(){


        },
        methods: {
            //根据账号名获取抽检员信息表中的所有数据
            getData() {
                var _this = this
                this.$axios.post('/ssplan/findplan',
//                this.$axios.post('/sstype/findcustomizecategories',
                    this.$qs.stringify(
                        {
                            pageIndex:this.query.pageIndex,
                            pageSize:this.query.pageSize,
                        })
                )
                    .then (response => {
                        if(response == null){
                            return;
                        }
//                        String类型的json串 转 json
                        for(var i=0;i<response.data.data.list.length;i++){
                            var  task_json = response.data.data.list[i].task_json;
                            task_json = JSON.parse(task_json)

                            var samplingnames="";
                            var n = task_json.samplingnames.length
                            for(var j=0;j<n;j++){
                                samplingnames += task_json.samplingnames[j]
                                if(j !=n-1 ){
                                    samplingnames += " - "
                                }
                            }
                            task_json.samplingnames = samplingnames

                            var foodtypes="";
                            var n = task_json.foodtypes.length
                            for(var j=0;j<n;j++){

                                foodtypes += task_json.foodtypes[j]
                                if(j !=n-1 ){
                                    foodtypes += " - "
                                }
                            }
                            task_json.foodtypes = foodtypes

                            _this.tableData[i] = task_json;

                            if(i ==response.data.data.list.length-1 ){
                                _this.tableshow = true;
                            }

                        }
//                        this.tableData  = response.data.data.list;
                        _this.pageTotal = response.data.data.total

                    });



            },


            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            },


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
<style>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 150px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }
</style>