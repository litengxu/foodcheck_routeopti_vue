<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 抽检主体历史信息查看
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

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
                <el-table-column sortable prop="s_account" label="抽检主体"></el-table-column>
<!--                <el-table-column prop="s_password" label="密码"></el-table-column>-->
                <el-table-column sortable prop="s_username" label="用户名"></el-table-column>
                <!--<el-table-column prop="sampling_inspector_ids" label="分配的抽检员id信息"></el-table-column>-->
                <el-table-column sortable prop="sampling_inspector_names" label="分配的抽检员姓名"></el-table-column>
                <el-table-column sortable prop="last_update_time" label="上次更新时间" >
                        <span slot-scope="scope">{{dateFormat('YYYY-mm-dd HH:MM',scope.row.last_update_time)}}</span>
                </el-table-column>
                <el-table-column sortable prop="create_time" label="创建时间">
                        <span slot-scope="scope">{{dateFormat('YYYY-mm-dd HH:MM',scope.row.create_time)}}</span>
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
        name: 'samplingaccount',
        data() {
            return {

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
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,

            };
        },
        created() {
            this.getData();
        },
        methods: {
            //根据账号名获取抽检员信息表中的所有数据
            getData() {
                this.$axios.post('/samplingAccountHistory/getallsamplingaccounthistory',
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
                        console.log(response)
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
