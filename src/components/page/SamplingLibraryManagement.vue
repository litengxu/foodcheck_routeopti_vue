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
                        icon="el-icon-download"
                        class="handle-del mr10"
                        @click="downLoad"
                >下载excel模板</el-button>
                <el-button
                        type="primary"
                        icon="el-icon-upload2"
                        class="handle-del mr10"
                        @click="uploadFormVisible = true"
                >利用excel上传抽检库数据</el-button>
                <el-button
                        type="primary"
                        icon="el-icon-printer"
                        class="handle-del mr10"
                        @click="viewprocessingprogress"
                >查看excel处理进度</el-button>
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
        <el-dialog v-dialogDrag title="上传数据(excel请务必按照模板格式)"   width="30%" :visible.sync="uploadFormVisible">
            <el-upload
                    class="upload-demo"
                    :limit="3"
                    ref="upload"
                    action=""
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :show-file-list="true"
                    :http-request="uploadSectionFile"
                    :on-exceed="fileexpandLimit"
                    :auto-upload="false">
                <!--:before-remove="handleRemove"-->
                <el-button slot="trigger" size="small" type="primary" >选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到抽检库</el-button>
                <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500kb</div>
            </el-upload>
            <!--<el-upload-->
                    <!--style="display:inline-block"-->
                    <!--:limit="5"-->
                    <!--class="upload-demo"-->
                    <!--ref="upload"-->
                    <!--action=""-->
                    <!--:file-list="fileList"-->
                    <!--:http-request="uploadSectionFile"-->
                    <!--:on-preview="handlePreview"-->
                    <!--:on-remove="handleRemove"-->
                    <!--:auto-upload="false"-->
                    <!--:before-remove="handleRemove">-->
                <!--<el-button slot="trigger" size="small" type="primary" plain>选取文件</el-button>-->
                <!--<el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUpload">导入</el-button>-->
            <!--</el-upload>-->
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
        <el-dialog title="excel处理进度" :visible.sync="processExcelVisible">

            <el-table
                    :data="processexceldata"
                    border
                    class="table"
                    ref="multipleTable"
                    style="width: 100%"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="文件名">
                                <span>{{ props.row.excel_name }}</span>
                            </el-form-item>
                            <el-form-item label="总数目">
                                <span>{{ props.row.total }}</span>
                            </el-form-item>
                            <el-form-item label="成功数目">
                                <span>{{ props.row.successtotal }}</span>
                            </el-form-item>
                            <el-form-item label="重复数目">
                                <span>{{ props.row.repeattotal }}</span>
                            </el-form-item>

                            <el-form-item label="上传时间">
                                <span>{{ props.row.create_time }}</span>
                            </el-form-item>
                            <el-form-item label="处理进度">
                                <span>{{ props.row.state }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column sortable prop="excel_name" label="文件名"></el-table-column>
                <el-table-column sortable prop="total" label="总数目" ></el-table-column>
                <el-table-column sortable prop="successtotal" label="成功数目"></el-table-column>
                <!--<el-table-column prop="repeattotal" label="重复数目"></el-table-column>-->
                <!--<el-table-column prop="create_time" label="上传时间"></el-table-column>-->
                <el-table-column label="处理进度" align="center">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.state"
                                :disabled="true"
                                active-text="处理完成"
                                inactive-text="正在处理">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleprocessexcelDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="processexcelquery.pageIndex"
                        :page-size= "processexcelquery.pageSize"
                        :total="processexcelquery.pageTotal"
                        @current-change="handleProcessExcelPageChange"
                ></el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="viewprocessingprogress">刷 新</el-button>
                <el-button @click="processExcelVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import ElCheckbox from "../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue";
    import $ from '../../../node_modules/jquery'
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
                    pageSize: 8
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
                processExcelVisible: false,
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
                checked:true,
                /*保存文件上传列表*/
                fileList: [],
                /*保存文件处理进度数据*/
                processexceldata:[],
                processexcelquery: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 5,
                    pageTotal: 0
                },
//                uploadUrl:  this.$axios.defaults.baseURL+"/sslibrary/uploadbyexcel"
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
                            searchname:this.searchname,
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
                        this.pageTotal = response.data.data.pageTotal
                    });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            // 删除操作
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
                        this.getData();
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
            /*提交表单，会直接跳转到uploadSectionFile*/
            submitUpload() {
                this.$refs.upload.submit();
            },
            /*实际提交的自定义方法*/
            uploadSectionFile(file){
                let formData  = new FormData();
                // 上传文件对象 名称file与后台控制器参数要一致
                formData.set('file',file.file);
                var str = file.file.name;
                var strs= new Array(); //定义一数组
                strs= String(str).split(".");
                if(strs[1]!='xls'&&strs[1]!='xlsx'){
                    this.$message.error("上传的文件不是excel")
                    return;
                }
                 this.$axios.post('/sslibrary/uploadbyexcel',
                        formData,
                    {
                        headers: {
                            "Content-type": "multipart/form-data"
                        },
                        onUploadProgress:progressEvent => {
                            let percent=(progressEvent.loaded / progressEvent.total * 100) | 0
                            //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
                            file.onProgress({percent:percent})

                        }
                    },
                )
                    .then (response => {

                        if(response == null){
                            return;
                        }
                        this.$message.success('上传成功 查看详细情况请点击excel处理进度');

                    });
            },
            /*处理删除列表中某个文件*/
            handleRemove(file, fileList) {
                this.$message.success("移除"+file.name+"成功")
            },
            handlePreview(file) {
                console.log(file);
            },
            fileexpandLimit(files, fileList){
                this.$message.error("已上传文件超出限制，请删除后重试！")
            },

            /*查看excel处理进程*/
            viewprocessingprogress(){
                this.processExcelVisible = true;
                this.$axios.post('/sepp/getall',
                    this.$qs.stringify(
                        {
                            pageIndex:this.processexcelquery.pageIndex,
                            pageSize:this.processexcelquery.pageSize,
                        })
                )
                    .then (response => {
                        if(response == null){
                            return;
                        }
                        this.processexceldata = response.data.data.ExcelProcessingProgress;
                        this.processexcelquery.pageTotal = response.data.data.pageTotal
                    });
            },
            /*exce处理进程弹出层分页*/
            handleProcessExcelPageChange(val){
                this.$set(this.processexcelquery, 'pageIndex', val);
                this.viewprocessingprogress();
            },
            // 删除exce处理进程操作
            handleprocessexcelDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                    if(row.state == false){
                        this.$message.error('正在传入数据，不可删除');
                        return;
                    }
                        this.$axios.post('/sepp/deleteexcel',
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
                                this.processexceldata.splice(index, 1);
                            });


                    })
                    .catch(() => {});
            },
            /*下载模板*/
             downLoad() {
               //   var params = {
               //     Authorization: localStorage.getItem('token'),
               //   };
               //  var url = [this.$axios.defaults.baseURL+ "/sslibrary/download", $.param(params)].join('?');
               // // window.location.href = this.$axios.defaults.baseURL+ "/sslibrary/download"
               // window.open(url, '_blank')
               return this.$axios({
                 method: 'post',
                 url: this.$axios.defaults.baseURL+ "/sslibrary/download",
                 responseType: 'blob',
                 headers: {
                   // Authorization: localStorage.getItem('token'),
                   'Content-Type': 'application/json; application/octet-stream'
                 }
               }) .then(response => {
                 //文件名 文件保存对话框中的默认显示
                 let fileName = 'templateexcel.xlsx';
                 let data = response.data;
                 if(!data){
                   return
                 }
                 console.log(response);
                 //构造a标签 通过a标签来下载
                 let url = window.URL.createObjectURL(new Blob([data]))
                 let a = document.createElement('a')
                 a.style.display = 'none'
                 a.href = url
                 //此处的download是a标签的内容，固定写法，不是后台api接口
                 a.setAttribute('download',fileName)
                 document.body.appendChild(a)
                 //点击下载
                 a.click()
                 // 下载完成移除元素
                 document.body.removeChild(a);
                 // 释放掉blob对象
                 window.URL.revokeObjectURL(url);
               })
                   .catch(response => {
                     this.$message.error(response);
                   });
             },
            downloadFile(data) {
              // 文件导出
              if (!data) {
                return
              }
              let url = window.URL.createObjectURL(new Blob([data]));
              let link = document.createElement('a');
              link.style.display = 'none';
              link.href = url;
              link.setAttribute('download', '测试excel.xlsx');

              document.body.appendChild(link);
              link.click()
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