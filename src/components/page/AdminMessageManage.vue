<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>管理员账号及权限管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-button type="primary"  @click="dialogFormVisible = true">添加管理员<i class="el-icon-plus el-icon--right"></i></el-button>
            <el-dialog  v-dialogDrag title="新增管理员账号" :visible.sync="dialogFormVisible">
                <el-form :model="addform"  :rules="rules">
                    <el-form-item prop="name"label="账号" :label-width="formLabelWidth" >
                        <el-input v-model="addform.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码" :label-width="formLabelWidth" >
                        <el-input v-model="addform.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item prop="username"label="用户名" :label-width="formLabelWidth">
                        <el-input v-model="addform.username" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-switch
                                v-model="addform.ifenabled"
                                active-text="账号可用"
                                inactive-text="账号不可用">
                        </el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-switch
                                v-model="addform.iflocked"
                                active-text="未锁定"
                                inactive-text="锁定账号">
                        </el-switch>

                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addnewaccountmessage()">确 定</el-button>
                </div>
            </el-dialog>

            <div class="form-box"style="width: 100%;margin-top: 20px" v-if="form.showform">
                <p v-for="index in form.list ">
                <el-form :inline="true" ref="form" :model="form" >
                    <el-form-item >
                        <el-input v-model="form.id[index]" style="width: 150px" v-show="false" ></el-input>
                    </el-form-item>
                    <el-form-item label="账号" >
                        <el-input v-model="form.account[index]":disabled="true" style="width: 150px"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" >
                        <el-input v-model="form.name[index]" :disabled="true" style="width: 150px"></el-input>
                    </el-form-item>
                    <el-form-item label="上次登录时间">
                        <el-input v-model="form.lastlogintime[index]" :disabled="true" style="width: 150px"></el-input>
                    </el-form-item>
                    <el-form-item label="上次修改时间">
                        <el-input v-model="form.lastedittime[index]" :disabled="true" style="width: 150px"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-switch
                                v-model="form.ifenabled[index]"
                                active-text="账号可用"
                                inactive-text="账号不可用">
                        </el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-switch
                                v-model="form.iflocked[index]"
                                active-text="未锁定"
                                inactive-text="锁定账号">
                        </el-switch>

                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit(index)">提交修改</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
                </p>

            </div>
        </div>
    </div>
</template>

<script>
import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

export default {
    components: {ElFormItem},
    name: 'adminmessage',
    data() {
        return {
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                name: [{ required: true, message: '请输入账户名', trigger: 'blur' }],
            },
            dialogFormVisible: false,
            addform: {
                name:'',
                password:'',
                username:'',
                ifenabled: true,
                iflocked: true,
            },
            formLabelWidth: '70px',
            form: {
                list:[],
                showform:false,
                id:[],
                account:[],
                name: [],
                lastlogintime: [],
                lastedittime: [],
                ifenabled: [],
                iflocked: [],
            }
        };
    },
    created() { // 当 vm 实例 的 data 和 methods 初始化完毕后，vm实例会自动执行created 这个生命周期函数
        this.getallaccountmessage()
    },
    methods: {
        addnewaccountmessage(){
            this.$axios.post('/superuser/addnewaccountmessage',
                this.$qs.stringify(
                    {
                        name:this.addform.name,
                        password:this.addform.password,
                        username: this.addform.username,
                        ifenabled: this.addform.ifenabled,
                        iflocked: this.addform.iflocked,
                    })
            )
                .then (response => {
                    if(response == null){
                        return;
                    }
                    this.$message.success('添加成功！');
                    this.getallaccountmessage();
//                    if (response.status>= 200 && response.status < 300) {
//                        //  请求成功，response为成功信息参数
//                        if(response.data.success == false){
//                            this.$message.error(response.data.errorMsg);
//                        }else {
//                            this.$message.success('添加成功！');
//                            this.getallaccountmessage();
//                        }
//                    } else {
//                        console.log(response.message);//请求失败，response为失败信息
//                        this.$message.error('添加失败！');
//                    }
                });
        },
        getallaccountmessage(){
            this.$axios.get("/superuser/getallaccountmessage",0
            ).then(response=>{
                if(response == null){
                    return;
                }
                for (var i=0;i<response.data.data.length;i=i+1){
                    this.form.list[i] = i;
                    this.form.id[i] = response.data.data[i].id;
                    this.form.account[i]  = response.data.data[i].account;
                    this.form.name[i]  = response.data.data[i].user_name;
                    this.form.lastlogintime[i]  = response.data.data[i].last_login_time;
                    this.form.lastedittime[i]  = response.data.data[i].update_time;
                    this.form.ifenabled[i]  = response.data.data[i].enabled;
                    this.form.iflocked[i]  = response.data.data[i].account_not_locked;
                }
                this.form.showform = true


            })

        },
        onSubmit(index) {

            this.$axios.post('/superuser/editaccountpower',
                this.$qs.stringify(
                    {
                        id:this.form.id[index],
                        ifenabled:this.form.ifenabled[index],
                        iflocked: this.form.iflocked[index],

                    })
                )
                .then (response => {
                    if(response == null){
                        return;
                    }
                    this.$message.success('修改成功！');
//                    if (response.status>= 200 && response.status < 300) {
//                        //                            请求成功，response为成功信息参数
//                        this.$message.success('修改成功！');
////                        this.getallaccountmessage();
//                    } else {
//                        console.log(response.message);//请求失败，response为失败信息
//                        this.getallaccountmessage();
//                        this.$message.error('修改失败！');
//                    }
                });

        }
    }
};
</script>