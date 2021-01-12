<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 抽检计划生成
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="center" placeholder="切换默认显示城市" >
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-switch style="float: right"
                        v-model="travelmode"
                        active-text="公交路线"
                        inactive-text="驾车路线">
                </el-switch>
                <el-button
                        style="margin-left: 10px"
                        type="primary"
                        icon="el-icon-tickets"
                        class="handle-del mr10"
                        @click="popupdrawer"
                >开始生成抽检计划</el-button>

            </div>
            <baidu-map class="bm-view" :center="center"  ak="GlotjjGuXh5dmWbQDwWoTBqVfWGE7qy2" :scroll-wheel-zoom="true" @ready="handler">
                <!--比例尺控件-->
                <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
                <!--缩放控件-->
                <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" ></bm-navigation>
                <!--聚合动态添加的点坐标-->
                <bm-marker-clusterer :averageCenter="true">
                    <bm-marker v-for="marker in markers"  :key="marker.code" :position="{lng: marker.lng1, lat: marker.lat1}" @click="lookDetail(marker)"></bm-marker>
                </bm-marker-clusterer>
                <bm-marker   :position="{lng: markers[markers.length-1].lng2, lat: markers[markers.length-1].lat2}" @click="lookDetail(marker)"></bm-marker>
                <!--信息窗体-->
                <!--<bm-info-window :position="{lng: infoWindow.info.lng1, lat: infoWindow.info.lat1}" :title="infoWindow.info.name" :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen">-->
                    <!--<p><span class="left">抽检食品：</span><span class="right">{{infoWindow.info.name}}</span></p>-->
                    <!--<p><span class="left">抽检人：</span><span class="right">{{infoWindow.info.name}}</span></p>-->
                <!--</bm-info-window>-->
                <bm-label v-for="marker in markers" :content="marker.ssl_name1" :position="{lng: marker.lng1, lat: marker.lat1}" :labelStyle="{color: 'red', fontSize : '4px'}" :title="marker.ssl_name1"/>
                <bm-label  :content="markers[markers.length-1].ssl_name2" :position="{lng: markers[markers.length-1].lng2, lat: markers[markers.length-1].lat2}" :labelStyle="{color: 'red', fontSize : '4px'}" :title="markers[markers.length-1].ssl_name1"/>

                <div v-if="travelmode">
                <bm-transit v-for="marker  in markers" :start="{lng: marker.lng1, lat: marker.lat1}" :end="{lng: marker.lng2, lat: marker.lat2}" :auto-viewport="true" :panel="false">
                </bm-transit>
                <bm-transit  :start="{lng: markers[markers.length-1].lng2, lat: markers[markers.length-1].lat2}" :end="{lng: markers[0].lng1, lat: markers[0].lat1}" :auto-viewport="true" :panel="false">
                </bm-transit>
                </div>
                <div v-if="!travelmode">
                    <bm-driving v-for="marker  in markers" :start="{lng: marker.lng1, lat: marker.lat1}" :end="{lng: marker.lng2, lat: marker.lat2}" :auto-viewport="true" :panel="false">
                    </bm-driving>
                    <bm-driving  :start="{lng: markers[markers.length-1].lng2, lat: markers[markers.length-1].lat2}" :end="{lng: markers[0].lng1, lat: markers[0].lat1}" :auto-viewport="true" :panel="false">
                    </bm-driving>
                </div>
                    <!--<bm-driving start="北京林业大学" end="五道口" :auto-viewport="true"></bm-driving>-->
            </baidu-map>
        </div>

        <el-drawer
                title="抽检计划生成"
                :visible.sync="drawer"
                direction="rtl"
                custom-class="demo-drawer"
                ref="drawer"
        >

        <div class="demo-drawer__content">
                <div class="demo-drawer__content">
                    <el-form ref="form" :model="form">


                        <div style="margin-top: 20px;margin-left: 20px">
                            <span>选择此次抽检的食品类型</span>
                            <el-checkbox-group  v-model="typeoffoodselected">
                                <el-checkbox style="margin-top: 20px" v-for="name in foodtypes" :label="name" :key="name.id" border>{{name.type_name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>


                        <div style="margin-top: 20px;margin-left: 20px">
                            <span>选择参与此次抽检的抽检账号</span>
                            <el-checkbox-group v-model="selectedsamplingaccount">
                                <el-checkbox style="margin-top: 20px"  v-for="name in samplingaccount" :label="name" :key="name.id" border>{{name.s_account}}</el-checkbox>
                            </el-checkbox-group>
                        </div>

                    </el-form>
                    <div class="demo-drawer__footer" style="margin-top: 20px;margin-left: 20px" >
                        <el-button @click="cancelForm">取 消</el-button>
                        <!--<el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>-->
                        <el-button type="primary" @click="startgenerating">开始生成</el-button>
                    </div>
                </div>
            </div>
        </el-drawer>

    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import ElCheckbox from "../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue";
    import BaiduMap from '../../../node_modules/vue-baidu-map/components/map/Map.vue';
    import BmScale from 'vue-baidu-map/components/controls/Scale'
    import BmNavigation from 'vue-baidu-map/components/controls/Navigation'
    import BmMarkerClusterer from  'vue-baidu-map/components/extra/MarkerClusterer'
    import BmMarker from 'vue-baidu-map/components/overlays/Marker'
    import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow'
    import BmTransit from 'vue-baidu-map/components/search/Transit'
    import BmDriving from 'vue-baidu-map/components/search/Driving.vue'
    import BmLabel from 'vue-baidu-map/components/overlays/Label.vue'
    export default {
        components: {
            ElCheckbox,
            BaiduMap,
            BmScale,
            BmNavigation,
            BmMarkerClusterer,
            BmMarker,
            BmInfoWindow,
            BmTransit,
            BmDriving,
            BmLabel
        },
        name: 'samplinginspectionplangeneration',
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
                center: '杭州',
//                zoom: 3,
                markers:[
                    {
                        ssl_name1:"1",
                        lng1:116.409443,
                        lat1:39.917149,
                        ssl_name2:"2",
                        lng2:116.509443,
                        lat2:39.817149
                    }
                    ,{
                        ssl_name1:"2",
                        lng2:116.609443,
                        lat2:39.717149,
                        ssl_name2:"3",
                        lng1:116.509443,
                        lat1:39.817149
                    }
                    ,{
                        ssl_name1:"3",
                        lng1:116.609443,
                        lat1:39.717149,
                        ssl_name2:"4",
                        lng2:116.709443,
                        lat2:39.617149
                    }
                    ],
                infoWindow: {
                    lng: 0,
                    lat: 0,
                    show: false,
                    info:{
                        samplingfoods: 0.64,
                        samplinginspector: "440300A055",
                    },
                },
                activeName: '',
                travelmode:false,
                drawer: false,
                loading: false,
                form:{},
                timer: null,
                foodtypes: {},
                typeoffoodselected:[],
                selectedsamplingaccount:[],
                samplingaccount:{}

            };
        },
        created() {
            this.getData();
        },
        methods: {
            //根据账号名获取抽检员信息表中的所有数据
            getData() {

            },
            /*处理当前地图中心点*/
            handler ({BMap, map}) {
                this.center = localStorage.getItem('city')
            },
            /*关闭点的提示框*/
            infoWindowClose (e) {
                this.infoWindow.show = false
            },
            /*打开点的提示框*/
            infoWindowOpen (e) {
                this.infoWindow.show = true
            },
            //查看详情
            lookDetail(data, target){
                this.infoWindow.show =true;
                this.infoWindow.info=data;
                this.activeName = data.name;
                //为弹窗口标题添加title
                this.$nextTick(()=>{
                    var win=document.querySelector(".BMap_bubble_title");
                    win.title = this.activeName;
                })
            },
            /*弹出右边栏*/
            popupdrawer(){

                this.foodtypes = []
                this.samplingaccount = []
                this.$axios.post('/ssaccount/selectAllCanParticipatebyadminid',
                    this.$qs.stringify(
                        {
                        })
                )
                    .then (response => {
                        if(response == null){
                            return;
                        }
                        for(var i=0;i<response.data.data.listaccount.length;i++){
                            this.samplingaccount = response.data.data.listaccount;
//                            this.samplingaccount.account[i]= response.data.data.listaccount[i].s_account;
//                            this.samplingaccount.id[i] = response.data.data.listaccount[i].id;
                        }
                        for(var i=0;i<response.data.data.listtype.length;i++){
                            this.foodtypes = response.data.data.listtype;
//                            this.foodtypes[i].foodtype = response.data.data.listtype[i].type_name;
//                            this.foodtypes[i].id = response.data.data.listtype[i].id;
                        }
                        this.drawer = true;

                    });


            },
            /*提交数据*/
            startgenerating(){
                console.log(this.typeoffoodselected)
                for(var i=0;i<this.selectedsamplingaccount.length;i++){
                    console.log(this.selectedsamplingaccount[i].id)
                }
                for(var i=0;i<this.typeoffoodselected.length;i++){
                    console.log(this.typeoffoodselected[i].id)
                }
                var plan= '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案' +
                    '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案';
                const h = this.$createElement;
                this.$notify({
                    title: '抽检计划生成成功',
                    message: h('i', { style: 'color: teal'}, plan),
                    type: 'success',
                    duration: 0
                });
            },
            /*处理事件提交以及加载层*/
            handleClose(done) {
                if (this.loading) {
                    return;
                }
                this.$confirm('确定要提交表单吗？')
                    .then(_ => {
                        this.loading = true;
                        this.timer = setTimeout(() => {
                            done();
                            // 动画关闭需要一定的时间
                            setTimeout(() => {
                                this.loading = false;
                            }, 400);
                        }, 2000);
                    })
                    .catch(_ => {});
            },
            /*关闭抽屉*/
            cancelForm() {
//                this.loading = false;
                this.drawer = false;
                clearTimeout(this.timer);
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
    .bm-view {
        width: 100%;
        height: 670px;
    }
</style>