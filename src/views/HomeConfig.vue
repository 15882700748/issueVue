<template>
    <div id="allmap" @click="click"></div>
</template>

<script>


    export default {
        name:'HomeConfig',
        data(){
            return {
                address:null,
                geoc:null,
                map:null,
                point:null,
            }
        },
        mounted () {
            this.createMap();
        },
        methods: {
            click(){

            },
            addressToMap(address,city){
                // 将地址解析结果显示在地图上,并调整地图视野
                var _point=this.point;
                var _map=this.map;
                this.geoc.getPoint(address, function(point){
                    if (point) {
                        _map.centerAndZoom(point, 17);
                        _map.addOverlay(new BMap.Marker(point));
                    }else{
                        alert("您选择地址没有解析到结果!");
                    }
                }, city);
            },
            handleClick(event){
                var pt = event.point;
                var _this=this;
                this.geoc.getLocation(pt, function(rs){
                    var addComp = rs.addressComponents;
                    _this.address=addComp.province +  addComp.city +  addComp.district +  addComp.street +  addComp.streetNumber;
                    _this.$emit('click',_this.address);
                });
            },
            createMap(){
                var map = new BMap.Map("allmap");
                var point = new BMap.Point(116.331398,39.897445);
                map.centerAndZoom(point,16);
                map.addControl(new BMap.NavigationControl());               // 添加平移缩放控件
                map.addControl(new BMap.ScaleControl());                    // 添加比例尺控件
                map.addControl(new BMap.OverviewMapControl());              //添加缩略地图控件
                map.enableScrollWheelZoom();                            //启用滚轮放大缩小
                map.addControl(new BMap.MapTypeControl());          //添加地图类型控件
                map.enableContinuousZoom();
                this.geoc = new BMap.Geocoder();
                this.point = point;

                var _this=this;
                map.addEventListener("click", function(e){
                    _this.handleClick(e);
                },false);
                this.map = map;
            },
        }
    }
</script>

<style  scoped>
    #allmap{
        height: 200px;
        overflow: hidden;
    }
</style>

