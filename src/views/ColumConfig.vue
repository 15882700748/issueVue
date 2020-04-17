<template>
    <div style="width: 100%;height: 100%">
        <!--<water-fall :col="4" :onReachBottom="onReachBottom">-->
            <!--<template  slot-scope="{result}" >-->
                <!--&lt;!&ndash;<el-image :src="axios.defaults.baseURL +'issue/'+goods"></el-image>&ndash;&gt;-->
                <!--<el-card class="box-card">-->
                    <!--<div slot="header" class="clearfix">-->
                        <!--<span>{{result.title}}</span>-->
                    <!--</div>-->
                    <!--<div v-html="result.content" >-->

                    <!--</div>-->
                <!--</el-card>-->
            <!--</template>-->
        <!--</water-fall>-->
        <vue-waterfall-easy  ref="waterfall" :imgsArr="imgsArr" @scrollReachBottom="getData">
            <div class="img-info" slot-scope="props">
                <p class="some-info">第{{props.value.data.issueId}}张图片</p>
            </div>
            <div slot="waterfall-over">waterfall-over</div>
        </vue-waterfall-easy>
    </div>
</template>

<script>
    import  waterFall from '../components/tool/waterFall'
    import vueWaterfallEasy from 'vue-waterfall-easy'
    export default {
        name: "ColumConfig",
        components:{
            waterFall,
            vueWaterfallEasy
        },
        data(){
            return{
                imgsArr: [],
                total:0,
                totalPage:0,
                currentPage:0,
                pageSize:0,
                pages:0
            }
        },
        methods: {
            onReachBottom(){

                //此方法用于数据请求，返回一个Promise,需要以属性方式传入组件,

                //示例:
                return axios.post("/issue/queryPage?pageNo="+0+"&pageSize="+8)

            },
            getData() {
                let _this = this
                axios.post("/issue/queryPage?pageNo="+_this.pages+"&pageSize="+8) // 真实环境中，后端会根据参数group返回新的图片数组，这里我用一个惊呆json文件模拟
                    .then(res => {
                        let logos = []
                        for(let i=0; i<res.data.records.length; i++){
                            let d = {
                                src :'',
                                href : '',
                                data : null
                            }
                            d.src = axios.defaults.baseURL+'issue/'+res.data.records[i].logo
                            d.data = res.data.records[i]
                            logos.push(d)
                        }

                        _this.imgsArr = _this.imgsArr.concat(logos)
                        for(let i=0; i<_this.imgsArr.length; i++){
                            _this.imgsArr[i]._height *= 0.8
                            console.log(_this.imgsArr[i]._height)
                        }
                        console.log(_this.imgsArr)
                        if(_this.pages === res.data.pages) _this.$refs.waterfall.waterfallOver()
                        else _this.pages ++
                    })
            },
        },
        mounted() {
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 480px;
    }
</style>