<template>
    <div>
        <div class="component">
            <ul class="align">
                <li>
                    <figure class='book'>

                        <ul class='paperback_front'>
                            <li>
                                <span class="ribbon">NEW</span>
                                <img src="img/paper.jpg" alt="" width="100%" height="100%">
                            </li>
                            <li></li>
                        </ul>
                        <!-- Pages -->

                        <ul class='ruled_paper' style="font-size: 14px!important; ">
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <el-tooltip class="item" effect="dark" content="下一篇" placement="top">
                                <li @click="nextBookPage('next')" style="overflow-x: scroll;overflow-x: hidden;">
                                    <el-row style="margin-top: 10px">
                                        <el-col :span="10" :offset="2">
                                            标题：{{article.title}}
                                        </el-col>
                                    </el-row>
                                    <div style="border-top: 1px black solid;width: 80%; height: 1px;margin:10px auto 0"></div>
                                    <el-row style="width: 80%; height: auto;margin:10px auto 0;min-height: 300px">
                                        <el-col>
                                            <span v-html="article.content"></span>
                                        </el-col>
                                    </el-row>
                                    <el-row style="position: relative;bottom: 5px;width: 100%">
                                        <el-col :span="24" >
                                            <span >第{{articleBookCurrentPage}}页 </span>
                                            <el-divider direction="vertical"></el-divider>
                                            <span>共{{articleBookTotalPage}}页</span>
                                        </el-col>

                                    </el-row>
                                </li>
                            </el-tooltip>

                            <el-tooltip class="item" effect="dark" content="上一篇" placement="top">
                                <li @click="nextBookPage('prev')"></li>
                            </el-tooltip>
                            <li></li>
                            <li></li>
                            <!--<li v-for="item in articleList" style="overflow: hidden">-->
                                <!--<span>{{item.title}}</span>-->
                                <!--<div style="border-bottom: 1px black solid;height: 1px; width: 140px" />-->
                                <!--<span v-html="item.content"-->
                                      <!--style="display: block;width: 100%;height:200px;position: relative;top: 0px;padding: 0 10px;">-->

                                <!--</span>-->
                            <!--</li>-->

                        </ul>

                        <!-- Back -->

                        <ul class='paperback_back'>
                            <li>
                                <img src="img/paper.jpg" alt="" width="100%" height="100%">
                            </li>
                            <li></li>
                        </ul>
                    </figure>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ColumConfig",
        props:['articles'],
        components:{
        },
        data(){
            return{
                articleList:[],
                articleBookTotal:0,
                articleBookTotalPage:0,
                articleBookCurrentPage:0,
                articleBookPageSize:0,
                articleList : [],
                article : {}
            }
        },
        methods : {
            //tool
            timeFormat(time,index,length){
                let dateee = new Date(time).toJSON();
                let date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
                date = date.toString()
                return date.substr(index,length);
            },
            nextBookPage(type){
                if(type === 'next'){
                    if(this.articleBookCurrentPage === this.articleBookTotalPage){
                        this.$message("没有更多了")
                    }else{
                        this.articleBookCurrentPage++
                        console.log( this.articleBookCurrentPage)
                        this.getBookArticles(this.articleBookCurrentPage)
                    }
                }else{
                    if(this.articleBookCurrentPage === 1){
                        this.$message("已经是第一个了")
                    }else{
                        this.articleBookCurrentPage--
                        this.getBookArticles(this.articleBookCurrentPage)
                    }
                }
            },
            getBookArticles(pageNo,pageSize=1){
                let _this = this
                axios.post('/article/getArticles?pageNo='+pageNo+'&pageSize='+pageSize).then(resp => {
                    _this.articleList =  resp.data.records
                    for(let i=0; i<_this.articleList.length;i++){
                        _this.articleList[i].holdupTime = _this.timeFormat(_this.articleList[i].holdupTime,0,11)
                        _this.articleList[i].realseTime = _this.timeFormat(_this.articleList[i].realseTime,0,16)
                    }
                    _this.article = _this.articleList[0]
                    _this.articleBookTotal = resp.data.total
                    _this.articleBookTotalPage = resp.data.pages
                    _this.articleBookCurrentPage = resp.data.current
                    _this.articleBookPageSize = resp.data.size

                })
            },
        },
        created(){
           this.getBookArticles(0)
        }
    }
</script>

<style scoped>
    @import url(http://fonts.googleapis.com/css?family=Indie+Flower);
    /*
        A. Mini Reset
    */
    *, *:after, *:before { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; }

    * {
        margin: 0;
        padding: 0;
    }

    ::before,
    ::after {
        content: "";
    }

    html,
    body {
        height: 100%;
        -webkit-font-smoothing: subpixel-antialiased;
    }

    html {
        font-size: 100%;
    }

    body {
        background: #ecf0f1;
        color: #34495e;
        font-family: 'Lato', 'Arial', sans-serif;
        font-weight: 400;
        line-height: 1.2;
    }

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    a {
        color: #2c3e50;
        text-decoration: none;
    }

    .btn {
        display: inline-block;
        margin-top: 100px;
        font-size: 1.2em;
        font-weight: 700;
        padding: 0.1em 0.8em;
        text-align: center;
        -webkit-transform: rotate(20deg);
        -moz-transform: rotate(20deg);
        transform: rotate(20deg);
        font-family: "Indie Flower", serif;
        -webkit-transition: color 0.3s;
        -moz-transition: color 0.3s;
        transition: color 0.3s;
    }

    .btn:hover {
        color: #16a085;
    }

    /* basic grid, only for this demo */

    .align {
        clear: both;
        width: 320px;
        position: relative;
        top: 10%;
        left: 50%;
        transform: translate(-50%,10%);
        text-align: center;
    }

    .align > li {
        width: 160px;
        min-height: 700px;
        display: inline-block;
        position: relative;
        top: 50px;
        left: 67px;
        vertical-align: top;
    }


    /*
        1. container
    */

    .book {
        position: relative;
        width: 300px;
        height: 400px;
        -webkit-perspective: 1000px;
        -moz-perspective: 1000px;
        perspective: 1000px;
        -webkit-transform-style: preserve-3d;
        -moz-transform-style: preserve-3d;
        transform-style: preserve-3d;
    }

    /*
        2. background & color
    */

    /* HARDCOVER FRONT */

    .paperback_front {
        background-color: #000;
    }

    .paperback_front::after{
        background-image: -webkit-linear-gradient( -135deg, rgba(255, 255, 255, 0.45) 0%, transparent 100%);
        background-image: -moz-linear-gradient( -135deg, rgba(255, 255, 255, 0.45) 0%, transparent 100%);
        background-image: linear-gradient( -135deg, rgba(255, 255, 255, 0.45) 0%, transparent 100%);
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .paperback_back {
        background-color: #333;
    }

    /* page */

    .ruled_paper > li {
        background-color: #fff;
        background-image: -webkit-linear-gradient(rgba(200, 200, 200, 0.1) 0.1em, transparent 0.1em), -webkit-linear-gradient(left, #e1ddd8 0%, #fffbf6 100%);
        background-image: -moz-linear-gradient(rgba(200, 200, 200, 0.1) 0.1em, transparent 0.1em), -moz-linear-gradient(left, #e1ddd8 0%, #fffbf6 100%);
        background-image: -ms-linear-gradient(rgba(200, 200, 200, 0.1) 0.1em, transparent 0.1em), -moz-linear-gradient(left, #e1ddd8 0%, #fffbf6 100%);
        background-image: linear-gradient(rgba(200, 200, 200, 0.1) 0.1em, transparent 0.1em), linear-gradient(left, #e1ddd8 0%, #fffbf6 100%);
        background-size: 100% 0.6em;
        box-shadow: inset 0px -1px 2px rgba(50, 50, 50, 0.1), inset -1px 0px 1px rgba(150, 150, 150, 0.2);
        border-radius: 0px 10px 10px 0px;
    }

    /*
        3. opening cover, back cover and pages
    */

    .paperback_front {
        transform: rotateY(0deg) translateZ(0px);
        z-index: 100;
    }


    /*
        4. position, transform y transition
    */

    .paperback_front,
    .paperback_back,
    .paperback_front li,
    .paperback_back li {
        border-radius: 2px 8px 8px 2px;
        position: absolute;
        top: 0;
        left: 0px;
        width: 100%;
        height: 100%;
        -webkit-transform-style: preserve-3d;
        -moz-transform-style: preserve-3d;
        transform-style: preserve-3d;
    }

    .paperback_front,
    .paperback_back {
        -webkit-transform-origin: 0% 100%;
        -moz-transform-origin: 0% 100%;
        transform-origin: 0% 100%;
    }

    .paperback_front{
        -webkit-transition: all 0.5s ease, z-index 0.6s;
        -moz-transition: all 0.5s ease, z-index 0.6s;
        transition: all 0.5s ease, z-index 0.6s;
    }

    .paperback_front li img,
    .paperback_back li img {
        border-radius: 2px 8px 8px 2px;
        position: absolute;
        top: 0;
        left: 0;
    }

    /* Ruled paper */

    .ruled_paper,
    .ruled_paper > li {
        position: absolute;
        -webkit-transform-style: preserve-3d;
        -moz-transform-style: preserve-3d;
        transform-style: preserve-3d;
    }

    .ruled_paper {
        width: 98%;
        height: 98%;
        top: 1%;
        left: 1%;
        z-index: 10;
    }

    .ruled_paper > li {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .ruled_paper > li {
        transform-origin: left center;
        -webkit-transition-property: transform;
        -moz-transition-property: transform;
        transition-property: transform;
        -webkit-transition-timing-function: ease;
        -moz-transition-timing-function: ease;
        transition-timing-function: ease;
        border: 1px black solid;
    }

    .ruled_paper li:nth-child(1) {
        -webkit-transition-duration: 0.6s;
        -moz-transition-duration: 0.6s;
        transition-duration: 0.6s;
    }

    .ruled_paper li:nth-child(2) {
        -webkit-transition-duration: 0.6s;
        -moz-transition-duration: 0.6s;
        transition-duration: 0.6s;
    }

    .ruled_paper li:nth-child(3) {
        -webkit-transition-duration: 0.4s;
        -moz-transition-duration: 0.4s;
        transition-duration: 0.4s;
    }

    .ruled_paper li:nth-child(4) {
        -webkit-transition-duration: 0.5s;
        -moz-transition-duration: 0.5s;
        transition-duration: 0.5s;
    }

    .ruled_paper li:nth-child(5) {
        -webkit-transition-duration: 0.5s;
        -moz-transition-duration: 0.5s;
        transition-duration: 0.5s;
    }

    /*
        5. events
    */

     .paperback_front {
        transform: rotateY(-125deg) translateZ(0px);
         width: 300px;
        z-index: 0;
    }
    .paperback_back {
        width: 325px;
        transform-origin:  left bottom !important;

    }

    .ruled_paper li:nth-child(6) {
        transform-origin:  left bottom !important;
        left: 10px;

    }

    .ruled_paper li:nth-child(1) {
        transform-origin:  left bottom !important;
        left: 20px;

    }
    .ruled_paper li:nth-child(2) {
        transform-origin:  left bottom !important;
        left: 15px;

    }
    .ruled_paper li:nth-child(3) {
        transform-origin:  left bottom !important;
        left: 10px;

    }
    .ruled_paper li:nth-child(4) {
        transform-origin:  left bottom !important;
        left: 5px;

    }
    .ruled_paper li:nth-child(5)::-webkit-scrollbar { width: 0 !important }

     .ruled_paper li:nth-child(6) {
         border-left: 1px black solid;
        transform: rotateY(-110deg);
        -webkit-transition-duration: 2.2s;
        -moz-transition-duration: 2.2s;
        transition-duration: 2.2s;
    }

     .ruled_paper li:nth-child(7) {

        transform: rotateY(-115deg);
        -webkit-transition-duration: 1.8s;
        -moz-transition-duration: 1.8s;
        transition-duration: 1.8s;
    }

     .ruled_paper li:nth-child(8) {

        transform: rotateY(-120deg);
        -webkit-transition-duration: 1.2s;
        -moz-transition-duration: 1.2s;
        transition-duration: 1.2s;
    }

    /* Cover colors */
    .green {
        background: #2ecc71;
    }

    .red {
        background: #cb0000;
    }

    /*
        6. Bonus
    */

    /* Basic ribbon */

    .ribbon{
        background: #c0392b;
        color: #fff;
        display: block;
        font-size: 0.7em;
        position: absolute;
        top: 11px;
        right: 1px;
        width: 40px;
        height: 20px;
        line-height: 20px;
        letter-spacing: 0.15em;
        text-align: center;
        -webkit-transform: rotateZ(45deg) translateZ(1px);
        -moz-transform: rotateZ(45deg) translateZ(1px);
        transform: rotateZ(45deg) translateZ(1px);
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        backface-visibility: hidden;
        z-index: 10;
    }

    .ribbon::before,
    .ribbon::after{
        position: absolute;
        top: -20px;
        width: 0;
        height: 0;
        border-bottom: 20px solid #c0392b;
        border-top: 20px solid transparent;
    }

    .ribbon::before{
        left: -20px;
        border-left: 20px solid transparent;
    }

    .ribbon::after{
        right: -20px;
        border-right: 20px solid transparent;
    }

    /* figcaption */

    figcaption {
        padding-left: 40px;
        text-align: left;
        position: absolute;
        top: 0%;
        left: 160px;
        width: 310px;
        -webkit-backface-visibility: hidden;
    }

    figcaption h1 {
        margin: 0;
    }

    figcaption span {
        color: #16a085;
        padding: 0.6em 0 1em 0;
        display: block;
    }

    figcaption p {
        color: #63707d;
        line-height: 1.3;
    }

    /* Media Queries */
    @media screen and (max-width: 37.8125em) {
        .align > li {
            width: 100%;
            min-height: 440px;
            height: auto;
            padding: 0;
            margin: 0 0 30px 0;
        }

        .book {
            margin: 0 auto;
        }

        figcaption {
            text-align: center;
            width: 320px;
            top: 250px;
            padding-left: 0;
            left: -80px;
            font-size: 90%;
        }
    }

</style>