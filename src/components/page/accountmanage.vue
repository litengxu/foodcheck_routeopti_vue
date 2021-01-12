<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 账号信息
                </el-breadcrumb-item>
                <el-breadcrumb-item>查看与修改账号信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" :rules="rules"  label-width="80px">
                    <el-form-item label="账号">
                        <el-input v-model="form.accountname" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="password">
                        <el-input v-model="form.password"placeholder="需要修改密码时再输入" ></el-input>
                    </el-form-item>
                    <el-form-item label="用户名"prop="username">
                        <el-input v-model="form.username" ></el-input>
                    </el-form-item>
                    <el-form-item label="城市"prop="city">
                        <el-select v-model="value" placeholder="请选择" style="width: 100%">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上次登录">
                        <el-input v-model="form.lastlogintime" :disabled="true" value-format="yyyy-MM-dd"></el-input>
                    </el-form-item>
                    <el-form-item label="上次修改">
                        <el-input v-model="form.updatetime"  :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="修改账号">
                        <el-input v-model="form.updateuser"  :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">修改</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

export default {
    components: {ElFormItem},
    name: 'accountmessage',
    data() {
        return {
            options: [{
                value: '杭州市',
                label: '杭州市'
            }, {
                value: '嘉兴市',
                label: '嘉兴市'
            }, {
                value: '湖州市',
                label: '湖州市'
            }, {
                value: '绍兴市',
                label: '绍兴市'
            }, {
                value: '宁波市',
                label: '宁波市'
            }, {
                value: '台州市',
                label: '台州市'
            }, {
                value: '温州市',
                label: '温州市'
            }, {
                value: '金华市',
                label: '金华市'
            }, {
                value: '衢州市',
                label: '衢州市'
            }, {
                value: '丽水市',
                label: '丽水市'
            }, {
                value: '舟山市',
                label: '舟山市'
            }],
            value: '',
            accountname: localStorage.getItem("ms_username"),
            form: {
                id:'',
                accountname: '',
                password:'',
                username: '',
                lastlogintime: '',
                updatetime: '',
                updateuser:'',
                city:''
            },
            rules: {

                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
        },


        };
    },
    created() { // 当 vm 实例 的 data 和 methods 初始化完毕后，vm实例会自动执行created 这个生命周期函数
        this.getaccountmessage()
    },
    methods: {
        getaccountmessage(){

            this.$axios.get("/user/getaccountmessage",
                {params:{accountname:this.accountname}}
                ).then(response=>{
                if(response == null){
                    return;
                }
                    this.form.id = response.data.data.id;
                    this.form.accountname = response.data.data.account;
                    this.form.username = response.data.data.user_name;
//                    this.form.password = response.data.data.password;
                    this.form.lastlogintime = response.data.data.last_login_time;
                    this.form.updatetime = response.data.data.update_time;
                    this.form.updateuser = response.data.data.update_user;
                    this.form.city = response.data.data.city;
                    this.value = response.data.data.city;
            })
        },
        onSubmit() {
            this.$refs.form.validate(valid => {
                var whether_change_password;
                if(valid){
                    if(this.form.password=='' || this.form.password==null){
                        whether_change_password = 0;
                    }else{
                        whether_change_password = 1;
                    }
                    this.$axios.post('/user/editaccountmessage',
                        this.$qs.stringify(
                            {
                            id:this.form.id,
                            password:this.form.password,
                            username: this.form.username,
                            whether_change_password:whether_change_password,
                            city:this.value
                        })
                        )
                        .then (response => {
                            this.getaccountmessage();
                            if(response == null){
                                return;
                            }
//                            请求成功，response为成功信息参数
                            this.$message.success('修改成功！');
//                            if (response.status>= 200 && response.status < 300) {
//
//    //                            请求成功，response为成功信息参数
//                                this.$message.success('修改成功！');
////                                this.getaccountmessage();
//                            } else {
//                                console.log(response.message);//请求失败，response为失败信息
//                                this.getaccountmessage();
//                                this.$message.error('修改失败！');
//                            }
                    });

                }
            })

        }
    }
};
</script>