<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 申请请假人员如下
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

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
                <el-table-column sortable prop="sii_name" label="姓名"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-check"
                            @click="handleagree(scope.$index, scope.row)"
                        >同意</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-close"
                            class="red"
                            @click="handlerefuse(scope.$index, scope.row)"
                        >拒绝</el-button>
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

        };
    },
    created() {
        this.getData();
    },
    methods: {
        //根据账号名获取抽检员信息表中的所有数据
        getData() {

            this.$axios.post('/siinformation/getaskforleave',
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
        handlerefuse(index, row) {

            // 二次确认删除
            this.$confirm('确定要拒绝吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios.post('/siinformation/handlerefuseleave',
                        this.$qs.stringify(
                            {
                                id: row.id,
                            })
                    )
                        .then (response => {
                            if(response == null){
                                return;
                            }
                            this.$message.success('操作成功');
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
        // 同意操作
        handleagree(index, row) {

            this.$axios.post('/siinformation/handleagreeleave',
                this.$qs.stringify(
                    {
                        id: row.id,
                    })
            )
                .then (response => {
                    if(response == null){
                        return;
                    }
                    //  请求成功，response为成功信息参数
                    this.$message.success('操作成功');
                    this.tableData.splice(index, 1);
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
