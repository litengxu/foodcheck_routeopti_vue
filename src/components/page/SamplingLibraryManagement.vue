<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 抽检库管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-plus"
                        class="handle-del mr10"
                        @click="dialogFormVisible = true"
                >添加新的抽检库</el-button>
                <el-button
                        type="primary"
                        icon="el-icon-upload2"
                        class="handle-del mr10"
                        @click="uploadFormVisible = true"
                >excel上传抽检库数据</el-button>
                <el-input v-model="searchname" placeholder="抽检点名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <!--基本信息-->
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    style="width: 100%"
                    header-cell-class-name="table-header"

                    @selection-change="handleSelectionChange"
            >

                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="辖区">
                                <span>{{ props.row.jurisdiction }}</span>
                            </el-form-item>
                            <el-form-item label="类别">
                                <span>{{ props.row.category }}</span>
                            </el-form-item>
                            <el-form-item label="抽检点名称">
                                <span>{{ props.row.ssl_name }}</span>
                            </el-form-item>
                            <el-form-item label="地址">
                                <span>{{ props.row.address }}</span>
                            </el-form-item>

                            <el-form-item label="更新时间">
                                <span>{{ props.row.last_update_time }}</span>
                            </el-form-item>
                            <el-form-item label="创建时间">
                                <span>{{ props.row.create_time }}</span>
                            </el-form-item>
                            <el-form-item label="包含抽检食品类型">
                                <span>{{ props.row.foodtype_ids }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="id" label="ID" width="55" align="center" v-show="false"></el-table-column>-->
                <el-table-column sortable prop="jurisdiction" label="辖区"></el-table-column>
                <el-table-column sortable prop="category" label="类别"></el-table-column>
                <el-table-column sortable prop="ssl_name" label="抽检点名称"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <!--<el-table-column prop="sampling_inspector_ids" label="分配的抽检员id信息"></el-table-column>-->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-guide"
                                @click="handfoodtype(scope.$index, scope.row)"
                        >抽检食品类型管理</el-button>
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

        <!-- 编辑弹出框 -->
        <el-dialog v-dialogDrag title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="辖区">
                    <el-input v-model="form.jurisdiction"></el-input>
                </el-form-item>
                <el-form-item label="类别">
                    <el-input v-model="form.category"></el-input>
                </el-form-item>
                <el-form-item label="抽检点">
                    <el-input v-model="form.ssl_name" ></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="食品类型">
                    <el-input v-model="form.foodtype_ids"  :disabled="true"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加弹出框 -->
        <el-dialog v-dialogDrag title="添加抽检点信息" :visible.sync="dialogFormVisible">
            <el-form :model="addform"  :rules="rules">
                <el-form-item prop="jurisdiction"label="辖区" :label-width="formLabelWidth" >
                    <el-input v-model="addform.jurisdiction" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="category"label="类别" :label-width="formLabelWidth">
                    <el-input v-model="addform.category" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="ssl_name"label="抽检点" :label-width="formLabelWidth">
                    <el-input v-model="addform.ssl_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="address"label="地址" :label-width="formLabelWidth">
                    <el-input v-model="addform.address" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="包含食品" :label-width="formLabelWidth">
                <el-checkbox-group v-model="selectedfoodtypes">
                    <el-checkbox v-for="name in foodtypes" :label="name" :key="name">{{name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addnewsiinformation()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 上传弹出框 -->
        <el-dialog v-dialogDrag title="上传数据" :visible.sync="uploadFormVisible">
            <el-form :model="addform"  :rules="rules">
                <el-form-item prop="s_account"label="账号" :label-width="formLabelWidth" >
                    <el-input v-model="addform.s_account" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="s_password"label="密码" :label-width="formLabelWidth">
                    <el-input v-model="addform.s_password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="s_username"label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="addform.s_username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="whether_participate"label="是否参与抽检" :label-width="formLabelWidth">
                    <el-switch
                            v-model="addform.whether_participate"
                            active-text="参与"
                            inactive-text="不参与">
                    </el-switch>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addnewsiinformation()">确 定</el-button>
            </div>
        </el-dialog>
        <!--食品类型管理弹出框-->
        <el-dialog v-dialogDrag title="食品类型管理" :visible.sync="foodtypeVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="已分配">
                    <el-checkbox-group v-model="againhavedistributenames">
                        <el-checkbox v-for="name in havedistributenames" :label="name" :key="name">{{name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="请选择">
                    <el-checkbox-group v-model="distributenames">
                        <el-checkbox v-for="name in undistributenames" :label="name" :key="name">{{name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="foodtypeVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDistribute">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import ElCheckbox from "../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue";
    export default {
        components: {ElCheckbox},
        name: 'samplinglibrary',
        data() {
            return {
                searchname:"",
                rules:  {
                    jurisdiction: [{ required: true, message: '请输入辖区', trigger: 'blur' }],
                    category: [{ required: true, message: '请输入类别', trigger: 'blur' }],
                    ssl_name: [{ required: true, message: '请输入抽检点名称', trigger: 'blur' }],
                    address: [{ required: true, message: '请输入抽检点的地址', trigger: 'blur' }],
                },
                formLabelWidth: '70px',
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
//                pageSize: [100, 200, 300, 400]
                },
                tableData: [],
                selectedfoodtypes:[],
                foodtypes:[],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                uploadFormVisible:false,
                foodtypeVisible:false,
                dialogFormVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                addform: {
                    jurisdiction:'',
                    category:'',
                    ssl_name:'',
                    address:''
                },
                /*保存之前未选择但本次已选择的*/
                distributenames:[],
                /*后台来的账号未选择的*/
                undistributenames:[],
                /*后台来的账号已经选择的*/
                havedistributenames:[],
                /*保存之前已选择但本次又选择的*/
                againhavedistributenames:[],
                checked:true

            };
        },
        created() {
            this.getData();
        },
        methods: {
            //根据账号名获取抽检员信息表中的所有数据
            getData() {
                this.$axios.post('/sslibrary/getalllibrary',
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
                        this.foodtypes = [];
                        this.tableData = response.data.data.sysSamplingLibraries;
                        for(var i=0;i<response.data.data.foodTypes.length;i++){
                            this.foodtypes[i] = response.data.data.foodTypes[i].type_name;

                        }
//                        this.pageTotal = response.data.data.pageTotal
                    });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            // 删除操作 （假的删除，把ids是否修改置为0,方便记录数据）
            handleDelete(index, row) {

                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$axios.post('/sslibrary/deletesamplinglibrarybyid',
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
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error(`删除了${str}`);
                this.multipleSelection = [];
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
//            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.$axios.post('/sslibrary/updatesamplinglibrarybyid',
                    this.$qs.stringify(
                        {
                            id: this.form.id,
                            jurisdiction: this.form.jurisdiction,
                            category:this.form.category,
                            ssl_name:this.form.ssl_name,
                            address:this.form.address
                        })
                )
                    .then (response => {
                        if(response == null){
                            this.getData();
                            return;
                        }
                        this.$set(this.tableData, this.idx, this.form);
                        this.$message.success('修改成功！');

                    });
            },
            /*添加信息*/
            addnewsiinformation(){

                this.$axios.post('/sslibrary/addnewsamplinglibrary',
                    this.$qs.stringify(
                        {
                            category:this.addform.category,
                            jurisdiction:this.addform.jurisdiction,
                            ssl_name: this.addform.ssl_name,
                            address: this.addform.address,
                            selectedfoodtypes: this.selectedfoodtypes.toString()
                        })
                )
                    .then (response => {
                        if(response == null){
                            return;
                        }
                        if(this.addform.category == null || this.addform.jurisdiction== null || this.addform.ssl_name == null || this.addform.address == null){
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
            /*处理食品类型信息*/
            handfoodtype(index,row ){

                this.idx = index;
                this.form = row;
                this.havedistributenames=[];
                var str= this.form.foodtype_ids; //这是一字符串
                if(str!=null){
                    var strs= new Array(); //定义一数组
                    strs=str.split("-"); //字符分割
                    for ( var i=0;i<strs.length ;i++ )
                    {
                        this.havedistributenames[i] = strs[i];
                    }
                }
                this.againhavedistributenames = this.havedistributenames;
                this.$axios.post('/sstype/findalltypebyadminid',
                    this.$qs.stringify(
                        {
                            id:this.form.id
                        })
                     )
                    .then (response => {
                        if(response == null){
                            return;
                        }
                        this.undistributenames=[];
                        var index = 0;
                        for(var i=0;i<response.data.data.length;i++){
                            var float = 1;
                            var type_name = response.data.data[i].type_name;
                            for(var j=0;j<this.havedistributenames.length;j++){
                                if(this.havedistributenames[j] == type_name){
                                    float = 0;
                                    break;
                                }
                            }
                            if(float == 1){
                                this.undistributenames[index++] = type_name;
                            }
                        }
                        this.foodtypeVisible = true;
                    });

            },
            /*保存食品类型信息*/
            saveDistribute(){
                this.foodtypeVisible = false;
                this.$axios.post('/sslibrary/savesamplingtype',
                    this.$qs.stringify(
                        {
                            distributenames: this.distributenames.toString(),
                            againhavedistributenames:this.againhavedistributenames.toString(),
                            insaccountid:this.form.id
                        }),
                )
                    .then (response => {
                        if(response == null){
                            return;
                        }
                        this.getData();
                        this.$message.success('分配成功');
                    });
                this.distributenames = [];
            },
            /*重置抽检员到抽检账号的分配*/
            resetaccount(){

                this.$axios.post('/ssaccount/resetsamplingaccount',
                    this.$qs.stringify(
                        {
                            adminaccount:localStorage.getItem("ms_username"),
                        }),
//                    {headers: {'Content-Type': 'contentType:"application/json"'}}
                )
                    .then (response => {
                        if(response == null){
                            return;
                        }
                        this.getData();
                        this.$message.success('重置成功');
                    });
            },
            /*随机分配抽检员到抽检账号*/
            randomlyassigned(){
                this.randomVisible = true;
            },
            saverandom(){

                this.$axios.post('/ssaccount/randomlyassigned',
                    this.$qs.stringify(
                        {
                            adminaccount:localStorage.getItem("ms_username"),
                        }),
                )
                    .then (response => {
                        if(response == null){
                            return;
                        }

                        this.getData();
                        this.$message.success('随机分配成功');
                    });
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
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>