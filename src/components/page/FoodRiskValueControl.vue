<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 抽检风险值管理
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
            >增加食品类型</el-button>
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


                            <el-form-item label="更新时间">
                                <span>{{ props.row.last_update_time }}</span>
                            </el-form-item>
                            <el-form-item label="创建时间">
                                <span>{{ props.row.create_time }}</span>
                            </el-form-item>

                        </el-form>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="id" label="ID" width="55" align="center" v-show="false"></el-table-column>-->
                <el-table-column sortable prop="type_name" label="食品类型"></el-table-column>
                <el-table-column sortable prop="value_at_risk" label="风险值"></el-table-column>
                <!--<el-table-column prop="sampling_inspector_ids" label="分配的抽检员id信息"></el-table-column>-->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
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
            <el-form-item prop="risk_value"label="风险值" :label-width="formLabelWidth" >
              <el-input v-model="addform.risk_value" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addnewsiinformation()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog v-dialogDrag title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="食品类型">
                    <el-input v-model="form.type_name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="风险值">
                    <el-input v-model="form.value_at_risk"></el-input>
                </el-form-item>


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import ElCheckbox from "../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue";
    export default {
        components: {ElCheckbox},
        name: 'foodriskvaluecontrol',
        data() {
            return {
                rules:  {
                    jurisdiction: [{ required: true, message: '请输入辖区', trigger: 'blur' }],

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
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                addform: {
                  food_type:'',
                  risk_value:'',
                },
            };
        },
        created() {
            this.getData();
        },
        methods: {
            //根据账号名获取抽检员信息表中的所有数据
            getData() {
                this.$axios.post('/sstype/findsixteencategories',
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
                        this.pageTotal =response.data.data.total;
                    });
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
                this.$axios.post('/sstype/updatesixteencategories',
                    this.$qs.stringify(
                        {
                            id: this.form.id,
                            value_at_risk: this.form.value_at_risk,
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

            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            },
            //添加操作
            addnewsiinformation(){

              this.$axios.post('/sstype/addsixteencategories',
                  this.$qs.stringify(
                      {
                        food_type:this.addform.food_type,
                        risk_value: this.addform.risk_value
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
                    if(this.addform.risk_value == null){
                      this.$message.error('请填写所需信息');
                      return;
                    }
                    this.$message.success('添加成功！');
                    this.getData();

                  });
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