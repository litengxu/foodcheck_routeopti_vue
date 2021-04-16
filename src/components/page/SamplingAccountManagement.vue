<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 抽检主体管理
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
                >添加新的抽检主体</el-button>
                <el-button
                        type="primary"
                        icon="el-icon-refresh"
                        class="handle-del mr10"
                        @click="resetaccount()"
                >重置抽检员到抽检主体的分配</el-button>
                <el-button
                        type="primary"
                        icon="el-icon-magic-stick"
                        class="handle-del mr10"
                        @click="randomlyassigned()"
                >随机分配抽检员到抽检主体</el-button>
            </div>
            <!--基本信息-->
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!--<el-table-column prop="id" label="ID" width="55" align="center" v-show="false"></el-table-column>-->
                <el-table-column sortable prop="s_account" label="抽检主体名称"></el-table-column>
                <!--<el-table-column prop="s_password" label="密码"></el-table-column>-->
                <el-table-column sortable prop="s_username" label="用户名"></el-table-column>
                <!--<el-table-column prop="sampling_inspector_ids" label="分配的抽检员id信息"></el-table-column>-->
                <el-table-column sortable prop="sampling_inspector_names" label="分配的抽检员姓名"></el-table-column>
                <el-table-column label="是否参与抽检" align="center">
                    <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.whether_participate"
                            :disabled="true"
                            active-text="参与"
                            inactive-text="不参与">
                    </el-switch>
                    </template>
                </el-table-column>
                <el-table-column sortable prop="last_update_time" label="上次更新时间">
                    <span slot-scope="scope">{{dateFormat('YYYY-mm-dd HH:MM',scope.row.last_update_time)}}</span>
                </el-table-column>

                <el-table-column sortable prop="create_time" label="创建时间">
                    <span slot-scope="scope">{{dateFormat('YYYY-mm-dd HH:MM',scope.row.create_time)}}</span>
                </el-table-column>
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
                                @click="handleDistribute(scope.$index, scope.row)"
                        >分配管理</el-button>
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
                <el-form-item label="主体名称">
                    <el-input v-model="form.s_account"  :disabled="true"></el-input>
                </el-form-item>
                <!--<el-form-item label="密码">-->
                    <!--<el-input v-model="form.s_password"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="用户名">
                    <el-input v-model="form.s_username"></el-input>
                </el-form-item>
                <!--<el-form-item label="分配的抽检员id">-->
                    <!--<el-input v-model="form.sampling_inspector_ids"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="分配的抽检员姓名">
                    <el-input v-model="form.sampling_inspector_names" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="是否参与抽检">
                    <el-switch
                            v-model="form.whether_participate"
                            active-text="参与"
                            inactive-text="不参与">
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加弹出框 -->
        <el-dialog v-dialogDrag title="新增抽检员信息" :visible.sync="dialogFormVisible">
            <el-form :model="addform"  :rules="rules">
                <el-form-item prop="s_account"label="主体" :label-width="formLabelWidth" >
                    <el-input v-model="addform.s_account" autocomplete="off"></el-input>
                </el-form-item>
                <!--<el-form-item prop="s_password"label="密码" :label-width="formLabelWidth">-->
                    <!--<el-input v-model="addform.s_password" autocomplete="off"></el-input>-->
                <!--</el-form-item>-->
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
        <!--分配抽检员弹出框-->
        <el-dialog v-dialogDrag title="分配抽检员到此主体" :visible.sync="distributeVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="已分配">
                    <el-checkbox v-model="checked"  v-for="name in havedistributenames" :label="name" :key="name" disabled>{{name}}</el-checkbox>
                </el-form-item>
                <el-form-item label="请选择">
                    <el-checkbox-group v-model="distributenames">
                        <el-checkbox v-for="name in undistributenames" :label="name" :key="name">{{name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="distributeVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDistribute">确 定</el-button>
            </span>
        </el-dialog>
        <!--随机分配弹出框-->
        <el-dialog  v-dialogDrag title="选择每个抽检主体分配抽检员的数目" :visible.sync="randomVisible" width="30%">
        <el-form ref="form" :model="form" label-width="70px">
            <el-select v-model="selectvalue" placeholder="请选择">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="randomVisible = false">取 消</el-button>
                <el-button type="primary" @click="saverandom">确 定</el-button>
            </span>
    </el-dialog>
    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import ElCheckbox from "../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue";
    export default {
        components: {ElCheckbox},
        name: 'samplingaccount',
        data() {
            return {
                rules: {
                    s_account: [{ required: true, message: '请输入抽检主体', trigger: 'blur' }],
                    s_password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                    s_username: [{ required: true, message: '请输入抽检主体用户名', trigger: 'blur' }],
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
                multipleSelection: [],
                delList: [],
                editVisible: false,
                distributeVisible:false,
                randomVisible:false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                dialogFormVisible: false,
                addform: {
                    s_account:'',
                    s_password:'123456',
                    s_username:'',
                    whether_participate: true,
                },
                distributenames:[],
                undistributenames:[],
                havedistributenames:[],
                checked:true,
                options: [{
                    value: 1,
                    label: '每个账号分配一个抽检员'
                }, {
                    value: 2,
                    label: '每个账号分配两个抽检员'
                }, {
                    value: 3,
                    label: '每个账号分配三个抽检员'
                }],
                selectvalue:2

            };
        },
        created() {
            this.getData();
        },
        methods: {
            //根据账号名获取抽检员信息表中的所有数据
            getData() {
                this.$axios.post('/ssaccount/getallssaccountbyadminaccount',
                    this.$qs.stringify(
                        {
                            pageIndex:this.query.pageIndex,
                            pageSize:this.query.pageSize,
                            adminaccount:localStorage.getItem('ms_username'),
                        })
                )
                    .then (response => {
                        if(response == null){
                            return;
                        }

                        this.tableData = response.data.data.tableData;
                        this.pageTotal = response.data.data.pageTotal

//                        if (response.status>= 200 && response.status < 300) {
//                            //  请求成功，response为成功信息参数
//                            if(response.data.success == false){
//                                this.$message.error(response.data.errorMsg);
//                            }else if(response.data.code > 200){
//                                this.$message.error(response.data.message);
//                            }else {
//                                this.tableData = response.data.data;
//                            }
//
//                        } else {
//                            console.log(response.message);//请求失败，response为失败信息
//                            this.$message.error('添加失败！');
//                        }
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
                        this.$axios.post('/ssaccount/deletessaccountbyid',
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
//                                if (response.status>= 200 && response.status < 300) {
//                                    //  请求成功，response为成功信息参数
////                                this.tableData = response.data.data;
//                                    if(response.data.success == false){
//                                        this.$message.error(response.data.errorMsg);
//                                    }else if(response.data.code > 200){
//                                        this.$message.error(response.data.message);
//                                    }else {
//                                        this.$message.success('删除成功');
//                                        this.tableData.splice(index, 1);
//                                    }
//                                } else {
//                                    this.$message.error('删除失败！');
//                                }
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

                this.$axios.post('/ssaccount/updatessaccountbyid',
                    this.$qs.stringify(
                        {
                            id: this.form.id,
//                            s_account:this.form.s_account,
                            s_password: this.form.s_password,
                            s_username:this.form.s_username,
                            whether_participate: this.form.whether_participate,
                        })
                )
                    .then (response => {
                        if(response == null){
                            this.getData();
                            return;
                        }
                        this.$set(this.tableData, this.idx, this.form);
                        this.$message.success('修改成功！');
//                        if (response.status>= 200 && response.status < 300) {
//                            if(response.data.success == false){
//                                this.$message.error(response.data.errorMsg);
//                            }else if(response.data.code == 500){
//                                this.$message.error(response.data.message);
//                            }else {
//                                //  请求成功，response为成功信息参数
//                                // 把table的idx行修改为form，不加也会修改。
//                                // 双向数据绑定，不用再调用getData方法
//
//                            }
//
//                        } else {
//                            this.$message.error('修改失败！');
//                        }
                    });
            },
            /*添加信息*/
            addnewsiinformation(){

                this.$axios.post('/ssaccount/insertnewssaccount',
                    this.$qs.stringify(
                        {
                            adminaccount:localStorage.getItem('ms_username'),
                            s_account:this.addform.s_account,
                            s_password:this.addform.s_password,
                            s_username: this.addform.s_username,
                            whether_participate: this.addform.whether_participate,
                        })
                )
                    .then (response => {
                        if(response == null){
                            return;
                        }
                        if(this.addform.s_account == null || this.addform.s_password== null || this.addform.s_username == null ){
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
            /*处理分配信息*/
            handleDistribute(index,row ){

                this.idx = index;
                this.form = row;
                this.$axios.post('/siinformation/selectunassignedByAdminAccount',
                    this.$qs.stringify(
                        {
                            accountname:localStorage.getItem("ms_username"),
                            siiaccountid:this.form.id
                        })
                     )
                    .then (response => {
                        if(response == null){
                            return;
                        }
                        this.undistributenames=[];
                        this.havedistributenames=[];
                        for(var i=0;i<response.data.data.undes.length;i++){
                            this.undistributenames[i] = response.data.data.undes[i].sii_name;
                        }
                        var str=response.data.data.des; //这是一字符串
                        if(str!=null){
                            var strs= new Array(); //定义一数组
                            strs=str.split("-"); //字符分割
                            for (i=0;i<strs.length ;i++ )
                            {
                                this.havedistributenames[i] = strs[i];
                            }
                        }

                        this.distributeVisible = true;
                    });

            },
            /*保存分配信息*/
            saveDistribute(){
                this.distributeVisible = false;
                this.$axios.post('/ssaccount/distributetossaccount',
                    this.$qs.stringify(
                        {
                            adminaccount:localStorage.getItem("ms_username"),
                            distributenames: this.distributenames.toString(),
                            insaccountid:this.form.id
                        }),
//                    {headers: {'Content-Type': 'contentType:"application/json"'}}
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
                            size:this.selectvalue,
                        }),
                )
                    .then (response => {
                        if(response == null){
                            return;
                        }
                        this.getData();
                        this.$message.success('随机分配成功');
                    });
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
