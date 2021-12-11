<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 食品风险模型
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container"style="width: 100%;float: left">
<!--          <div class="demo-image">-->
<!--            <div v-for="fit in fits" :key="fit" class="block">-->
<!--              <span class="demonstration">{{ fit }}</span>-->
<!--              <el-image-->
<!--                  style="width: 200px; height: 200px;width: 30%;padding: 10px"-->
<!--                  :src="url"-->
<!--                  fit="fill"-->
<!--              ></el-image>-->
<!--            </div>-->
<!--          </div>-->

          <div v-for="url in srcList" :key="url" style="width: 50%;float: left;" >
            <img  :src="url" alt="" />
          </div>



        </div>


    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import ElCheckbox from "../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue";
    export default {
        components: {ElCheckbox},
        name: 'foodnamelist',
        data() {
            return {
              srcList: [],


            };
        },
        created() {

            this.getData();
        },
        mounted(){
//            this.id = this.$route.params.id
        },
        watch:{

        },


        methods: {
          //根据账号名获取抽检员信息表中的所有数据
          getData() {

            var temp = []
            this.$axios.post('/sfrmc/getimgs',
                this.$qs.stringify(
                    {
                    })
            )
                .then(response => {
                  if (response == null) {
                    return;

                  }
                  var urlarr = response.data.data;
                  urlarr = JSON.parse(urlarr)
                  for(var i=0;i<urlarr.url.length;i++){
                    temp[i] = this.$axios.defaults.baseURL+"\\images\\modelImages\\"+urlarr.url[i];
                    // temp[i] = this.$axios.defaults.baseURL+"\\modelImages\\"+urlarr.url[i];
                  }
                  this.srcList  = temp;
                  console.log(temp)

                });


          }
        }
    };
</script>


<style>

    .demo-table-expand label {
        width: 150px;
        color: #99a9bf;
    }
</style>
<style scoped>
  img {
    width: 80%;
    margin: 20px 4% 20px 0;
  }

</style>
