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
            <div class="handle-box">

                <el-button
                        type="primary"
                        icon="el-icon-circle-check"
                        class="handle-del mr10"
                        @click="seecompleted()"
                >查看已完成抽检计划</el-button>
                <el-button
                        type="primary"
                        icon="el-icon-circle-close"
                        class="handle-del mr10"
                        @click="seeundone()"
                >查看未完成抽检计划</el-button>
            </div>
            <!--基本信息-->
            <!--v-if="tableshow"-->
            <el-table
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
                                <el-form-item label="抽检主体">
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
                                        <span>(该位置抽检状况：{{ val.samplePlanInfoTableList[tempindex -1].state}})</span>
                                        <span>(该位置抽检食品类型：</span>
                                        <a v-for="tempindex2 in val.samplePlanInfoTableList[tempindex -1].sampleofoodlist.length">
                                            <span>{{ val.samplePlanInfoTableList[tempindex -1].sampleofoodlist[tempindex2-1].foodtype}}</span>
                                            <span v-if="tempindex2!=val.samplePlanInfoTableList[tempindex -1].sampleofoodlist.length">  ++ </span>
                                        </a>
                                        <span>)</span>
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
                <el-table-column sortable prop="createTimeStamp" label="开始时间">
                    <span slot-scope="scope">{{dateFormat('YYYY-mm-dd HH:MM',scope.row.createTimeStamp)}}</span>
                </el-table-column>
                <!--<el-table-column sortable prop="state" label="抽检状态"></el-table-column>-->
                <el-table-column
                        prop="state"
                        label="标签"
                        width="100"
                        :filters="[{ text: '未完成', value: '未完成' }, { text: '完成', value: '完成' }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end">
                    <template #default="scope">
                        <el-tag
                                :type="scope.row.state === '未完成' ? 'primary' : 'success'"
                                disable-transitions>{{scope.row.state}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope">

                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>

                    </template>
                </el-table-column>
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
                    pageSize: 8
//                pageSize: [100, 200, 300, 400]
                },
                tableData: [],
                tableshow:false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                completeorundo:-1


            };
        },
        created() {
            this.getData(-1);
        },
        mounted(){


        },
        methods: {
            //根据账号名获取抽检员信息表中的所有数据
            getData(val) {
                var _this = this
//                _this.tableshow = false;
                var temp = []
                this.$axios.post('/ssplan/findplan',
//                this.$axios.post('/sstype/findcustomizecategories',
                    this.$qs.stringify(
                        {
                            val:val,
                            pageIndex:this.query.pageIndex,
                            pageSize:this.query.pageSize,
                        })
                )
                    .then (response => {
                        console.log(response)
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
                            task_json.id = response.data.data.list[i].id
                            temp[i] = task_json;
//                            _this.tableData[i] = task_json;


                        }
                        _this.tableData = temp
//                        _this.tableshow = true;
//                        this.tableData  = response.data.data.list;
                        _this.pageTotal = response.data.data.total

                    });



            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？（已完成任务不允许删除）', '提示', {
                    type: 'warning'
                })
                    .then(() => {

                        this.$axios.post('/ssplan/deleteplan',
                            this.$qs.stringify(
                                {
                                    id: row.id,
                                })
                           )
                            .then (response => {
                                if(response == null){
                                    return;
                                }
                                this.$message.success('删除成功');
                                this.tableData.splice(index, 1);
                            });


                    })
                    .catch(() => {});
            },
            seecompleted(){
                this.completeorundo = 1
              this.getData(1)
            },
            seeundone(){
                this.completeorundo = 0
                this.getData(0)
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData(this.completeorundo);
            },

            filterTag(value, row) {
                return row.state === value;
            },
            //时间对象处理
            dateFormat(fmt, date) {
                let ret="";
                date=new Date(date);
                const opt = {
                    'Y+': date.getFullYear().toString(), // 年
                    'm+': (date.getMonth() + 1).toString(), // 月
                    'd+': date.getDate().toString(), // 日
                    'H+': date.getHours().toString(), // 时
                    'M+': date.getMinutes().toString(), // 分
                    'S+': date.getSeconds().toString() // 秒
                    // 有其他格式化字符需求可以继续添加，必须转化成字符串
                }
                for (let k in opt) {
                    ret = new RegExp('(' + k + ')').exec(fmt)
                    if (ret) {
                        fmt = fmt.replace(
                            ret[1],
                            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
                        )
                    }
                }
                return fmt
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