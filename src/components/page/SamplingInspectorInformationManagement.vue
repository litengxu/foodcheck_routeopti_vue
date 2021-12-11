<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 抽检员信息管理
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
                >添加新的抽检员信息</el-button>
                <!--<el-select v-model="query.address" placeholder="地址" class="handle-select mr10">-->
                    <!--<el-option key="1" label="广东省" value="广东省"></el-option>-->
                    <!--<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
                <!--</el-select>-->
                <!--<el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>-->
                <!--<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>-->
            </div>
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
                <el-table-column sortable prop="sii_account" label="账号"></el-table-column>
<!--                <el-table-column sortable prop="sii_password" label="密码"></el-table-column>-->
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.leave_status!=2"
                            :disabled="true"
                            active-text="在岗"
                            inactive-text="请假">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column sortable prop="sii_name" label="姓名"></el-table-column>
                <el-table-column sortable prop="sii_sex" label="性别"></el-table-column>
                <el-table-column sortable prop="sii_phone" label="手机号"></el-table-column>
                <el-table-column sortable prop="sampling_agency" label="所属抽检机构"></el-table-column>
                <el-table-column sortable prop="create_time" label="创建时间">
                    <span slot-scope="scope">{{dateFormat('YYYY-mm-dd HH:MM',scope.row.create_time)}}</span>
                </el-table-column>

                <el-table-column sortable prop="last_update_time" label="上次更新时间">
                    <span slot-scope="scope">{{dateFormat('YYYY-mm-dd HH:MM',scope.row.last_update_time)}}</span>
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
                    </template>
                </el-table-column>
            </el-table>
            <!--:page-sizes= "query.pageSize"-->
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
        <el-dialog  v-dialogDrag title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="姓名">
                    <el-input v-model="form.sii_name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                <el-input v-model="form.sii_sex"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.sii_phone"></el-input>
                </el-form-item>
                <el-form-item label="所属抽检机构">
                    <el-input v-model="form.sampling_agency"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio v-model="form.leave_status" label="0">在岗</el-radio>
                    <el-radio v-model="form.leave_status" label="2">请假</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加弹出框 -->
        <el-dialog  v-dialogDrag title="新增抽检员信息" :visible.sync="dialogFormVisible">
            <el-form :model="addform"  :rules="rules">
                <el-form-item prop="sii_name"label="姓名" :label-width="formLabelWidth" >
                    <el-input v-model="addform.sii_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="sii_account"label="账号" :label-width="formLabelWidth" >
                    <el-input v-model="addform.sii_account" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="sii_password"label="密码" :label-width="formLabelWidth" >
                    <el-input v-model="addform.sii_password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item  prop="sii_sex"label="性别" :label-width="formLabelWidth">
                    <el-select v-model="addform.sii_sex" placeholder="请选择抽检员性别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="sii_phone"label="手机号" :label-width="formLabelWidth">
                    <el-input v-model="addform.sii_phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="sampling_agency"label="机构" :label-width="formLabelWidth">
                    <el-input v-model="addform.sampling_agency" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addnewsiinformation()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
export default {
    name: 'samplinginspectorinformation',
    data() {
        return {
            rules: {
                sii_name: [{ required: true, message: '请输入抽检员姓名', trigger: 'blur' }],
                sii_account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
                sii_password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                sii_sex: [{ required: true, message: '请输入性别', trigger: 'blur' }],
                sii_phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                sampling_agency: [{ required: true, message: '请输入抽检员所属抽检机构', trigger: 'blur' }],
            },
            formLabelWidth: '70px',
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 6
//                pageSize: [100, 200, 300, 400]
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 50,
            form: {},
            idx: -1,
            id: -1,
            dialogFormVisible: false,
            addform: {
                sii_name:'',
                sii_account:'',
                sii_password:'',
                sii_sex:'',
                sii_phone:'',
                sampling_agency: "",

            },
        };
    },
    created() {
        this.getData();
    },
    methods: {
        //根据账号名获取抽检员信息表中的所有数据
        getData() {

            this.$axios.post('/siinformation/getallsiinformationbyadminaccount',
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
                    //  请求成功，response为成功信息参数
                    this.tableData = response.data.data.tableData;
                    this.pageTotal = response.data.data.pageTotal
//                    if (response.status>= 200 && response.status < 300) {
//
//                        //  请求成功，response为成功信息参数
//                        this.tableData = response.data.data;
//                    } else {
//                        console.log(response.message);//请求失败，response为失败信息
//                        this.$message.error('添加失败！');
//                    }
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
                    this.$axios.post('/siinformation/deletesiinformationbyid',
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
//                            if (response.status>= 200 && response.status < 300) {
//                                //  请求成功，response为成功信息参数
////                                this.tableData = response.data.data;
//
//                                if(response.data.success != true || response.data.code >200){
//                                    this.$message.error('删除失败！');
//                                }else{
//
//                                    this.$message.success('删除成功');
//                                    this.tableData.splice(index, 1);
//                                }
//
//                            } else {
//
//                                this.$message.error('删除失败！');
//                            }
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

            this.$axios.post('/siinformation/enditsiinformationbyid',
                this.$qs.stringify(
                    {
                        id: this.form.id,
                        sii_name:this.form.sii_name,
                        sii_sex: this.form.sii_sex,
                        sii_phone:this.form.sii_phone,
                        sampling_agency: this.form.sampling_agency,
                        leave_status:this.form.leave_status
                    })
            )
                .then (response => {
                    if(response == null){
                        this.getData();
                        return;
                    }
                    //  请求成功，response为成功信息参数
                    // 把table的idx行修改为form，不加也会修改。
                    // 双向数据绑定，不用再调用getData方法
                    this.$set(this.tableData, this.idx, this.form);
                    this.$message.success('修改成功！');
//                    this.getData()
//                    if (response.status>= 200 && response.status < 300) {
//                        //  请求成功，response为成功信息参数
//                        // 把table的idx行修改为form，不加也会修改。
//                        // 双向数据绑定，不用再调用getData方法
//                        this.$set(this.tableData, this.idx, this.form);
//                        this.$message.success('修改成功！');
//                    } else {
//                        this.$message.error('修改失败！');
//                    }
                });
        },
        //添加
        addnewsiinformation(){

            this.$axios.post('/siinformation/addnewsiinformation',
                this.$qs.stringify(
                    {
                        adminaccount:localStorage.getItem('ms_username'),
                        sii_name:this.addform.sii_name,
                        sii_account:this.addform.sii_account,
                        sii_password:this.addform.sii_password,
                        sii_sex:this.addform.sii_sex,
                        sii_phone: this.addform.sii_phone,
                        sampling_agency: this.addform.sampling_agency,
                    })
            )
                .then (response => {
                    if(response == null){
                        return;
                    }
                    this.$message.success('添加成功！');
                    this.getData();
//                    if (response.status>= 200 && response.status < 300) {
//                        //  请求成功，response为成功信息参数
//                        if(response.data.success == false){
//                            this.$message.error(response.data.errorMsg);
//                        }else {
//                            this.$message.success('添加成功！');
//                            this.getData();
//                        }
//                    } else {
//                        console.log(response.message);//请求失败，response为失败信息
//                        this.$message.error('添加失败！');
//                    }
                });
        },
        // 分页导航
        handlePageChange(val) {
          this.$set(this.query, 'pageIndex', val);
            this.getData();
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
