<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 食品类型管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-tickets"
                        class="handle-del mr10"
                        @click="sixteen_categories"
                >查看大类食品类型</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="dialogFormVisible = true"
            >增加自定义食品类型</el-button>
            </div>
            <!--基本信息-->
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
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="自定义食品类型">
                                <span>{{ props.row.type_name }}</span>
                            </el-form-item>
                            <!--<el-form-item label="风险值">-->
                            <!--<span>{{ props.row.value_at_risk }}</span>-->
                            <!--</el-form-item>-->
                            <el-form-item label="创建时间">
                                <span>{{ props.row.create_time }}</span>
                            </el-form-item>
                            <el-form-item label="更新时间">
                                <span>{{ props.row.last_update_time }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column sortable prop="type_name" label="自定义食品类型"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
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
        <!-- 添加弹出框 -->
        <el-dialog v-dialogDrag title="增加自定义食品类型" :visible.sync="dialogFormVisible">
            <el-form :model="addform"  :rules="rules">
                <el-form-item prop="food_type"label="类型" :label-width="formLabelWidth" >
                    <el-input v-model="addform.food_type" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addnewsiinformation()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="大类食品类型" :visible.sync="sixteencategoriesVisible">

            <el-table
                    :data="sixteencategoriesdata"
                    border
                    class="table"
                    ref="multipleTable"
                    style="width: 100%"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="食品大类">
                                <span>{{ props.row.type_name }}</span>
                            </el-form-item>
                            <!--<el-form-item label="风险值">-->
                                <!--<span>{{ props.row.value_at_risk }}</span>-->
                            <!--</el-form-item>-->
                            <el-form-item label="创建时间">
                                <span>{{ props.row.create_time }}</span>
                            </el-form-item>
                            <el-form-item label="更新时间">
                                <span>{{ props.row.last_update_time }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column sortable prop="type_name" label="食品大类"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="sixteencategoriesquery.pageIndex"
                        :page-size= "sixteencategoriesquery.pageSize"
                        :total="sixteencategoriesquery.pageTotal"
                        @current-change="handlesixteencategoriesPageChange"
                ></el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sixteencategoriesVisible = false">取 消</el-button>
            </span>
        </el-dialog>
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
                searchname:"",
                rules:  {
                    food_type: [{ required: true, message: '请输入食品类型', trigger: 'blur' }],
                },
                formLabelWidth: '70px',
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 8
//                pageSize: [100, 200, 300, 400]
                },
                tableData: [],
                dialogFormVisible: false,
                sixteencategoriesVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                addform: {
                    food_type:'',
                },
                checked:true,
                /*十六大类食品类型数据*/
                sixteencategoriesdata:[],
                sixteencategoriesquery: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
            };
        },
        created() {
            this.getData();
        },
        methods: {
            //根据账号名获取抽检员信息表中的所有数据
            getData() {
                this.$axios.post('/sstype/findcustomizecategories',
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
                        this.tableData = response.data.data.list;
                        this.pageTotal = response.data.data.total
                    });
            },
            // 删除操作
            handleDelete(index, row) {

                // 二次确认删除
                this.$confirm('删除后抽检库中所有抽检点都将不包含该食品类型！！确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$axios.post('/sstype/deletecustomizecategories',
                            this.$qs.stringify(
                                {
                                    id: row.id,
                                })
                        )
                            .then (response => {
                                console.log(response)
                                if(response == null){
                                    return;
                                }
                                this.$message.success('删除成功');
                                this.tableData.splice(index, 1);
                            });


                    })
                    .catch(() => {});
            },
            /*添加信息*/
            addnewsiinformation(){

                this.$axios.post('/sstype/addcustomizecategories',
                    this.$qs.stringify(
                        {
                            food_type:this.addform.food_type,
                        })
                )
                    .then (response => {
                        if(response == null){
                            return;
                        }
                        if(this.addform.food_type == null){
                            this.$message.error('请填写所需信息');
                            return;
                        }
                        this.$message.success('添加成功！');
                        this.getData();

                    });
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            },
            sixteen_categories(){
                this.sixteencategoriesVisible = true;
                this.$axios.post('/sstype/findsixteencategories',
                    this.$qs.stringify(
                        {
                            pageIndex:this.sixteencategoriesquery.pageIndex,
                            pageSize:this.sixteencategoriesquery.pageSize,
                        })
                )
                    .then (response => {
                        if(response == null){
                            return;
                        }
                        this.sixteencategoriesdata = response.data.data;
                        this.sixteencategoriesquery.pageTotal = 31;
                    });
            },
            /*exce处理进程弹出层分页*/
            handlesixteencategoriesPageChange(val){
                this.$set(this.sixteencategoriesquery, 'pageIndex', val);
                this.sixteen_categories();
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
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>