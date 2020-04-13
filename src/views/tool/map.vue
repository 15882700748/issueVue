
<template>
    <div class="addHospital">
        <div class="map" v-loading="loading">
            <el-input placeholder="请输入搜索地址" v-model="mapName" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="mapNameChange"></el-button>
            </el-input>
            <div style="padding:10px 0;" v-if="mapPointName">当前选中：{{mapPointName}}</div>
            <baidu-map class="bm-view" :center="location" :zoom="zoom" :scroll-wheel-zoom="true"
                       @ready="mapReady"
                       @click="getClickInfo"  style="height: 400px; width: 100%">
                <bm-scale></bm-scale>
            </baidu-map>
            <div class="map-btn">
                <el-button type="primary" @click="confirm">确认</el-button>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "map",
        data() {
            return {
                dialogMap: true,
                mapName: "",
                mapPointName: "",
                loading:false,
                mapGetshow: true,
                dialogName: "",
                location:null,
                zoom:200,
                map:null,
                geoc:null,
            };
        },
        created() {},
        mounted(){

        },
        methods: {
            getClickInfo(e){
                let _this = this
                let pt = e.point;
                let marker = new BMap.Marker(pt); // 创建标注
                _this.map.clearOverlays();
                _this.map.addOverlay(marker);
                _this.geoc.getLocation(pt, function(rs) {
                    let addComp = rs.addressComponents;
                    _this.location = addComp
                    _this.location.lng = pt.lng
                    _this.location.lat = pt.lat
                    _this.mapPointName =
                        addComp.province +
                        addComp.city +
                        addComp.district +
                        addComp.street +
                        addComp.streetNumber;
                });
            },
            //mapReady
            mapReady({BMap, map}){
                let that = this
                this.map = map
                this.geoc = new BMap.Geocoder();
                let point = new BMap.Point(116.3964, 39.9093);
                map.centerAndZoom(point, 10);
                map.enableScrollWheelZoom();
                let geolocation = new BMap.Geolocation();
                //定位
                geolocation.getCurrentPosition(
                    r => {
                        let mk = new BMap.Marker(r.point);
                        that.map.addOverlay(mk);
                        that.map.panTo(r.point);
                        that.geoc.getLocation(r.point, function(rs) {
                            let addComp = rs.addressComponents;
                            that.mapPointName =
                                addComp.province +
                                addComp.city +
                                addComp.district +
                                addComp.street +
                                addComp.streetNumber;
                            that.loading = false;
                            that.mapGetshow = false;
                            that.location = addComp
                            that.location.lng = r.point.lng
                            that.location.lat = r.point.lat
                        });
                    },
                    { enableHighAccuracy: true }
                );
            },
            //搜索地图
            mapNameChange() {
                let that = this,
                    point,
                    marker = null;
                let local = new BMap.LocalSearch(that.map, {
                    renderOptions: { map: that.map },
                    onSearchComplete: res => {
                        if (local.getResults() != undefined) {
                            that.map.clearOverlays(); //清除地图上所有覆盖物
                            if (local.getResults().getPoi(0)) {
                                point = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
                                that.map.centerAndZoom(point, 10);
                                marker = new BMap.Marker(point); // 创建标注
                                that.map.addOverlay(marker); // 将标注添加到地图中
                                marker.enableDragging(); // 可拖拽
                                that.geoc.getLocation(point, function(rs) {
                                    var addComp = rs.addressComponents;
                                    that.mapPointName =
                                        addComp.province +
                                        ", " +
                                        addComp.city +
                                        ", " +
                                        addComp.district +
                                        ", " +
                                        addComp.street +
                                        ", " +
                                        addComp.streetNumber;

                                });
                            } else {
                                alert("未匹配到地点!可拖动地图上的红色图标到精确位置");
                            }
                        } else {
                            alert("未找到搜索结果");
                        }
                    }
                });
                local.search(this.mapName);
            },
            confirm(){
               window.sessionStorage.setItem("locationMap",this.location)
            }
        }
    };
</script>
<style scoped >
    .addHospital {
        width: 100%;
        height: 100%;
    }
    .addHospital .map {
        padding: 10px;
    }
    .addHospital .map .map-btn {
        padding: 10px 20px;
        margin: auto;
        text-align: right;
    }
    .addHospital .map .map-btn button {
        padding: 12px 30px;
    }

</style>