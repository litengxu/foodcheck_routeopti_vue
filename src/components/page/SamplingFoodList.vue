<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 该计划的抽检信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
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
                <el-table-column sortable prop="spot_check_location" label="抽检地点"></el-table-column>
                <el-table-column sortable prop="sampling_food_type" label="抽检食品类别"></el-table-column>
                <el-table-column sortable  prop="food_specific_name" label="具体抽检食品"></el-table-column>
                <el-table-column sortable  prop="food_counts" label="数量"></el-table-column>
                <el-table-column sortable prop="sampler" label="抽检人"></el-table-column>
                <el-table-column sortable prop="remarks" label="备注"></el-table-column>
                <el-table-column sortable prop="sampling_time" label="抽检时间">
                    <span slot-scope="scope">{{dateFormat('YYYY-mm-dd HH:MM',scope.row.sampling_time)}}</span>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">

                        <el-button
                                type="text"
                                icon="el-icon-tickets"
                                @click="seeimage(scope.$index, scope.row)"
                        >查看图片</el-button>
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

        <el-dialog
            title="提示"
            v-model="dialogVisible"
            width="30%"
            :before-close="handleClose">
        <span>这是一段信息</span>
        <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
        </template>
    </el-dialog>
        <el-dialog  v-dialogDrag title="查看图片" :visible.sync="dialogVisible" width="40%">

            <div class="demo-image__lazy">
                <el-image v-for="url in srcList"
                          :key="url"
                          :src="url"
                          :preview-src-list="srcList" lazy>
                            lazy></el-image>
            </div>

    </el-dialog>
    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import ElCheckbox from "../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue";
    export default {
        components: {ElCheckbox},
        name: 'foodnamelist',
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
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                dialogVisible: false,
                srcList: [


                ]
            };
        },
        created() {
            this.id = this.$route.query.id
            this.getData();
        },
        mounted(){
//            this.id = this.$route.params.id
        },
        watch:{
            '$route'(to,from){
                this.id=to.query.id
                var s = "SamplingFoodList"
                if(to.name == s){
                    this.getData()
                }
        }

        },
        methods: {
            //根据账号名获取抽检员信息表中的所有数据
            getData() {

                var temp = []
                this.$axios.post('/samplingFoodList/findAllBySspId',
                    this.$qs.stringify(
                        {
                            id:this.id,
                            pageIndex:this.query.pageIndex,
                            pageSize:this.query.pageSize,
                        })
                )
                    .then (response => {
                        if(response == null){
                            return;

                        }
                        this.tableData = response.data.data.listres
                        this.pageTotal = response.data.data.total


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
            seeimage(index, row){


                var temp = []
                this.$axios.post('/samplingFoodList/selectImages',
                    this.$qs.stringify(
                        {
                            id:row.id
                        })
                )
                    .then (response => {
                        if (response == null) {
                            return;
                        }
                        var urlarr = response.data.data;
                        urlarr = JSON.parse(urlarr)
                        for(var i=0;i<urlarr.url.length;i++){
                            temp[i] = this.$axios.defaults.baseURL+urlarr.url[i];
                        }
                        this.srcList  = temp;
                    });

                    this.dialogVisible = true
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
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
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