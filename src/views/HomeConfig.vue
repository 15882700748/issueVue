<template>
    <div >
        <el-container>
            <el-aside width="200px"  style="height: 600px;border:1px #aaa solid ">
                <el-row style="margin-top: 20px">
                    <el-col :span="22" :offset="1">
                        <el-form >
                            <el-form-item>
                                <el-input size="mini">
                                    <template slot="append">
                                        <el-button type="primary">搜索</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div class="infinite-list-wrapper" style="overflow:auto">
                            <ul
                                    class="list"
                                    v-infinite-scroll="load"
                                    infinite-scroll-disabled="disabled" >
                                <li v-for="img in imgArr" class="list-item">
                                    <img style="width: 160px;" :src="img" alt="">
                                </li>
                            </ul>
                            <p v-if="loading">加载中...</p>
                            <p v-if="noMore">没有更多了</p>
                        </div>
                    </el-col>
                </el-row>
            </el-aside>
            <div style="width: 1px;height: 600px;border-right: 1px #eee solid;position: relative;left: 10px;top: -20px;"></div>
            <el-container style="height: 600px;">
                <div class="home" ref="imageWrapper">
                    <draggable  v-model="homeData" ref="dragWrapper" @update="datadragEnd"  :animation = "500" >
                        <transition-group >
                            <el-badge value="可拖动" v-for="(element,index1) in homeData" :key="element.name"
                                      :class ="index1 === 0 ? 'top' : (index1 === 1 ? 'left' : 'right')">
                                <ul v-if="element.name === '栏目' && index1 !== 0" :key="element.name">
                                    <li v-for="(item,index2) in element.item" :key="element.name+index2" class="columnCol" @click="getItemView(index1,index2)">
                                        {{item.name}}
                                    </li>
                                </ul>
                                <ul v-else-if="element.name === '栏目' && index1 === 0 " :key="element.name">
                                    <li v-for="(item,index2) in element.item" :key="element.name+index2" class="columnRow" @click="getItemView(index1,index2)">
                                        {{item.name}}
                                    </li>
                                </ul>
                                <span v-else-if="element.name === '首页' && index1 !== 2 ">
                                    <el-carousel v-if="index1 === 0" :autoplay="false"  type="card" height="80px">
                                        <el-carousel-item style="background-color:#99a9bf ;" v-for="item in 3 " :key="element.name+item">
                                        </el-carousel-item>
                                     </el-carousel>
                                    <el-carousel v-else :autoplay="false" indicator-position="outside"   height="380px">
                                        <el-carousel-item style="background-color:#99a9bf ;" v-for="item in 2" :key="element.name+item">
                                        </el-carousel-item>
                                     </el-carousel>
                                </span>
                                <span v-else>
                                    {{element.name}}
                                </span>
                            </el-badge>
                        </transition-group>
                    </draggable>
                    <el-badge value="不可拖动" type="info" class="main">
                       <span v-if="!mainContent.isNull">
                           <span v-if="mainContent.type === 'column'" class="content" v-html="mainContent.content"></span>
                           <span v-else class="content">
                              <el-carousel :autoplay="false" indicator-position="outside"  height="320px" >
                                   <el-carousel-item v-for="(item,i) in mainContent.content" :key="item.title">
                                       <el-card shadow="always" class="box-card">
                                            <div slot="header" class="clearfix">
                                                文章{{i+1}}-<strong>标题：</strong><span>{{item.title}}</span>
                                            </div>
                                           <strong>内容：</strong>
                                           <div v-html="item.content">
                                           </div>
                                       </el-card>
                                   </el-carousel-item>
                               </el-carousel>
                               <div class="notice-wrapper">
                                   <div class="notice-item notice-item-default">默认配置</div>
                                   <div class="notice-item notice-item-set" @click="showAricleStyleDialog">配置样式</div>
                               </div>
                               <el-dialog
                                       title="样式选择"
                                       :visible.sync="styleSelectDialog"
                                       width="400px"
                                       height="400px"
                                       :before-close="handleClose">
                                  <el-carousel style="background-color: #eaeaea"  :autoplay="false" arrow="never" height="380px">
                                        <el-carousel-item :key="'书籍效果'">
                                            <book :articles="mainContent.content"></book>
                                        </el-carousel-item>
                                        <el-carousel-item >
                                            <el-card class="box-card" shadow="always">
                                              <div slot="header" class="clearfix" style="border-bottom: 1px solid white">
                                                标题：<span>{{mainContent.content[0].title}}</span>
                                              </div>
                                                <div style="width: 100%;height: 200px;font-size: 0.1px;" v-html="mainContent.content[0].content">
                                                </div>
                                            </el-card>
                                        </el-carousel-item>
                                     </el-carousel>

                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="styleSelectDialog = false">取 消</el-button>
                                        <el-button type="primary" @click="styleSelectDialog = false">确 定</el-button>
                                    </span>
                                 </el-dialog>
                           </span>
                       </span>
                        <span v-else>显示区</span>

                        <!--最终展示的地方-->
                    </el-badge>
                    <el-badge value="不可拖动" type="info" class="footer" ref="footer">
                        <el-color-picker
                                v-model="footerColor"
                                show-alpha
                                :predefine="predefineColors" @change="changeFooterColor">
                        </el-color-picker>
                    </el-badge>
                    <div class="controllerArea" >
                        <el-button type="primary" >字体控制</el-button>
                        <el-button type="primary" @click="uploadQR" >清除图片</el-button>
                        <el-button type="primary" @click="makeImg" ref="makeImgButton">生成截图</el-button>
                    </div>
                </div>
                <!---->

            </el-container>
        </el-container>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import VueDragResize from 'vue-drag-resize'
    import vueCropper from 'vue-cropper'
    import html2canvas from 'html2canvas';
    import Book from '../components/tool/book'
    export default {
        name:'HomeConfig',
        components:{draggable,VueDragResize,vueCropper,html2canvas,Book},
        data(){
            return {
                x:'',
                y:'',
                QRUrl: '',
                LOGOUrl: '',
                dataURL: '',
                footerColor: 'rgba(255, 69, 0, 0.68)',
                predefineColors: [
                    '#ff4500',
                    '#ff8c00',
                    '#ffd700',
                    '#90ee90',
                    '#00ced1',
                    '#1e90ff',
                    '#c71585',
                    'rgba(255, 69, 0, 0.68)',
                    'rgb(255, 120, 0)',
                    'hsv(51, 100, 98)',
                    'hsva(120, 40, 94, 0.5)',
                    'hsl(181, 100%, 37%)',
                    'hsla(209, 100%, 56%, 0.73)',
                    '#c7158577'
                ],
                homeData:[
                    {name: "首页",item:null},
                    {name: "栏目",item:null},
                    {name: "",item:null},
                ],
                info:{
                    category:'',
                    name:'',
                    style:{},
                    position:{}
                },
                colors: [
                    {text: "首页"},
                    {text: "栏目"},
                    {text: ""},
                ],
                startArr:[],
                endArr:[],
                imgArr:[],
                mainContent:{
                    isNull:true,
                    type:'',
                    content:null
                },
                count: 10,
                loading: false,
                styleSelectDialog:false
            }
        },
        directives:{
            drag(el,bindings){
                let _this = this
                // info.parent = parent
                el.onmousedown = function(e){
                    let disx = e.pageX - el.offsetLeft,
                        disy = e.pageY - el.offsetTop,
                        info ={category:'', name:'', style:{}, position:{}},
                        parent = el.parentElement,
                        brothers = [],
                        brotherNodes,
                        brothersInfo = [],
                        elWidth = el.clientWidth,
                        elHeight =el.clientHeight,
                        width,height
                    if(parent !== null){
                        width = parent.clientWidth-elWidth
                        height = parent.clientHeight-elHeight
                        brotherNodes = parent.children
                        //获取兄弟节点
                        // for(let i=0;i<brotherNodes.length;i++){
                        //     if(brotherNodes[i]!== el){
                        //         brothers.push(brotherNodes[i])
                        //     }
                        // }
                        // //放兄弟节点信息
                        // brothers.forEach(function(item){
                        //     brothersInfo.push({
                        //         'left':parseInt(item.style.left),
                        //         'top':parseInt(item.style.top),
                        //         'id':item.id,
                        //         'clientWidth':item.clientWidth,
                        //         'clientHeight':item.clientHeight
                        //     })
                        // })

                    }else{
                        width = 600
                        height = 500
                    }
                    document.onmousemove = function (e){
                        let x = e.pageX - disx
                        let y = e.pageY - disy
                        //判断边缘
                        x = x < 0 ? 0 : x;
                        x = x > width ? width : x
                        y = y < 0 ? 0 : y;
                        y = y > height ? height : y
                        //判断相交
                        // try{
                        //     //forEach无法跳出循环。只能用try的方法
                        //     brothersInfo.forEach(function(item){
                        //         let itemTop=item.top
                        //         let itemLeft=item.left
                        //
                        //         // console.log('在obj上',x+elHeight < itemTop)
                        //         // console.log('在obj下',x >itemTop+item.clientHeight)
                        //         // console.log('在obj左',y+elWidth < itemLeft)
                        //         // console.log('在obj右',y >itemLeft+item.clientWidth)
                        //         // x = x + elHeight > itemTop ? itemTop : x
                        //         // console.log(ftop+300<btop||ftop>btop+300||fleft+400<bleft||fleft>bleft+400)
                        //
                        //         if(x < itemTop||x >itemTop+item.clientHeight || y < itemLeft||y >itemLeft+item.clientWidth){
                        //             console.log("和所有兄弟都不相交")
                        //         }else{
                        //             console.log(e.pageX - el.offsetLeft,e.pageY - el.offsetTop,x,y,itemTop,itemLeft)
                        //             console.log(el.id,"和某个兄弟相交:",item.id)
                        //             // console.log('在obj上',x+0 < itemTop)
                        //             // console.log('在obj下',x >itemTop+item.clientHeight)
                        //             // console.log('在obj左',y+0 < itemLeft)
                        //             // console.log('在obj右',y >itemLeft+item.clientWidth)
                        //             //  console.log(el.id,x,y,item.id,itemTop,itemLeft)
                        //             // console.log()
                        //         }
                        //     })
                        // }catch(e){
                        // }
                        el.style.left =x +'px';
                        el.style.top = y+'px';
                        info.position.x = x;
                        info.position.y = y
                        info.position.width = width;
                        info.position.height = height
                        bindings.value.set(info)
                    }
                    document.onmouseup = function(){
                        document.onmousemove = document.onmouseup = null;
                    }
                }
            }
        },
        computed: {
            noMore () {
                return this.imgArr.length === this.count
            },
            disabled () {
                return this.loading || this.noMore
            }
        },
        methods: {
            //dialog
            showAricleStyleDialog(){
                this.styleSelectDialog =  true
            },
            handleClose(){

            },
            //获取数据
            page(){
                let _this = this
                axios.post("/style/queryHomePageInfo?").then(function(resp){
                    let data = resp.data,
                        column = {
                            "columId": 7,
                            "name": "栏目2",
                            "content": "",
                            "orgId": 16,
                            "creatTime": "2020-04-15T11:10:32",
                            "orderNum": null,
                            "styleId": null,
                            "issueId": 1
                        }
                    column.name = '文章'
                    column.content = data.articles
                    data.columns.push(column)
                    _this.homeData[0].item = data.issue
                    _this.homeData[0].name = "首页"
                    _this.homeData[1].item = data.columns
                    _this.homeData[1].name = "栏目"
                    _this.homeData[2].item = null
                    _this.homeData[2].name = ""
                })
            },
            set(val){
                this.info= val
            },
            //无限滚动
            load(){
                this.loading = true
                setTimeout(() => {
                    //获取资源
                    this.loading = false
                }, 2000)
            },
            datadragEnd (evt) {
                evt.preventDefault();
                let _this = this
                if(this.homeData[evt.newIndex].name === '首页' && evt.newIndex === 2 || this.homeData[2].name === '首页'){
                    this.$message({
                        message:'请重新调成'+_this.homeData[evt.newIndex].name,
                        type:'error'
                    })
                    this.$refs.makeImgButton.disabled = true
                }else{
                    this.$refs.makeImgButton.disabled = false
                }
                // console.log('拖动前的索引 :' + evt.oldIndex)
                // console.log('拖动后的索引 :' + evt.newIndex)
                // console.log(this.homeData);
                this.mainContent.isNull = true
            },
            // 将dom转成canvas
            makeImg() {
                let that = this
                let opts = {
                    logging: true, // 启用日志记录以进行调试 (发现加上对去白边有帮助)
                    allowTaint: true, // 否允许跨源图像污染画布
                    backgroundColor: null, // 解决生成的图片有白边
                    useCORS: true // 如果截图的内容里有图片,解决文件跨域问题
                }
                // eslint-disable-next-line no-undef
                html2canvas(that.$refs.imageWrapper, opts).then((canvas) => {
                    let url = canvas.toDataURL('image/png')
                    that.imgArr.push(url)
                })
            },
            // http图片转成base64，防止解决不了的图片跨域问题
            getBase64Image(img) {
                let canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                let ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, img.width, img.height)
                let dataURL = canvas.toDataURL('image/png') // 可选其他值 image/jpeg
                return dataURL
            },
            // 下载html2canvas生成的截图
            uploadQR() {
                // let a = document.createElement('a')
                // a.href = this.dataURL
                // a.download = '二维码'
                // a.click()
                this.imgArr = []
            },
            // 获取数据
            getItemView(i,j){
                let data =this.homeData[i].item[j].content
               if(  data instanceof Array){
                   this.mainContent.type = 'article'
                }else{
                   this.mainContent.type = 'column'
               }
               this.mainContent.isNull = false
                this.mainContent.content = data
            },
            changeFooterColor(){
                this.$refs.footer._vnode.elm.style.backgroundColor = this.footerColor
            }
        },
        created(){
            this.page()
        }
    }
</script>

<style  scoped>
    *,*:after,*:before{
        box-sizing: border-box;
        padding: 0;
    }
    .home{
        margin: 0 auto;
        width: 1000px;
        height: 600px;
        position: relative;
        color: black;
    }
    .top{
        width: 1000px;
        height: 100px;
        position: relative;
        border: 1px #aaa dashed;
    }
    .main{
        width: 560px;
        height: 400px;
        position: absolute;
        left: 220px;
        top: 101px;
        align-items: center;
        /*border: 1px deepskyblue dashed;*/
    }
    .right{
        width: 200px;
        height: 400px;
        position: absolute;
        top:105px;
        left:800px;
        border: 1px #aaa dashed;
    }
    .left{
        width: 200px;
        height: 400px;
        position: absolute;
        left: 0;
        top:105px;
        border: 1px #aaa dashed;
    }
    .footer{
        width: 1000px;
        height: 50px;
        position: relative;
        left: 0;
        top: 410px;
        border: 1px #aaa dashed;
    }
    .controllerArea{
        width: 1000px;
        height: 50px;
        position: relative;
        left: 0px;
        top: 420px;
        border: 1px #aaa dashed;
    }
    /*.top:hover ,.left:hover,.right:hover{*/
        /*border: 1px #aaa solid;*/
    /*}*/
    .drag{
        width: 100%;
        height: auto;
        position: absolute;
        align-content: center;
        top: 0;
        left: 0;
    }
    .drag:hover{
        border: 1px black solid;
    }
    .test{
        border:1px solid #ccc;
    }
    .drag-item{
        width: 200px;
        height: 50px;
        line-height: 50px;
        margin: auto;
        position: relative;
        background: #ddd;
        margin-top:20px;
    }
    .ghostClass{
        opacity: 1;
    }
    .bottom{
        width: 200px;
        height: 50px;
        position: relative;
        background: blue;
        top:2px;
        left: 2px;
        transition: all .5s linear;
    }
    .item {
        margin-top: 10px;
        margin-left: 40px;
    }
    .columnCol{
        list-style: none;
        width: 160px;
        height: 50px;
        line-height: 50px;
        align-items: center;
        margin:10px auto;
        border: 1px #aaa dashed;
        border-radius: 20px;
        cursor: pointer;
    }
    .columnRow{
        list-style: none;
        display: inline-block;
        width: 100px;
        max-height: 30px;
        line-height: 30px;
        align-items: center;
        margin:10px 10px;
        border: 1px #aaa dashed;
        border-radius: 20px;
        cursor: pointer;
    }
    .content{
        display: block;
        width: 540px;
        height: 360px;
        margin: 20px auto;
        position: relative;
        /*overflow: scroll;*/
    }
    .notice-wrapper{
        width: 100%;
        height: 57px;
        display: flex;
        font-size: 12px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 99;
        align-items: center;

    }
    .notice-item{
        width: 80px;
        height: 30px;
        line-height: 30px;
        border-radius: 20px;
        color: white !important;
    }
    .notice-item-default{
        position: absolute;
        left: 20px;
        cursor: default;
        background-color: rgba(112,112,112,0.5);
        box-shadow: 0px 7px 20px rgba(112,112,112,0.5);
    }
    .notice-item-set{
        position: absolute;
        right: 20px;
        cursor: pointer;
        background-color: rgba(106, 173, 255, 1);
        box-shadow: 0px 7px 30px rgba(106, 173, 255, 1);
        transition:  all ease-in 0.1s;
    }
    .notice-item-set:hover{
        background-color: rgba(106, 173, 255, 0.8);
        box-shadow: 0px 7px 20px rgba(43, 98, 169, 0.8);
    }
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
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
        width: 100%;
        height: 380px;
        background-color: #eaeaea
    }
    /*book*/
    .perspective {
        width: 100%;
        height: 400px;
        margin-top: 100px;
        perspective: 800px;
        transform-style: preserve-3d;
    }
    .book-wrap {
        width: 300px;
        height: 300px;
        position: relative;
        left: 480px;
        /*transform: rotateX(30deg);*/
        transform-style: preserve-3d;
    }
    .shadowBotton{
        width: 300px;
        height: 1px;
        position: absolute;
        left: 480px;
        top:301px;
        transform-origin: left;
        transform: rotateY(-150deg) ;
        box-shadow: 1px 2px 40px 4px rgb(4, 4, 4);
        transform-style: preserve-3d;
    }
    .page {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        font-size: 30px;
        /*display: flex;*/
        text-align: center;
        transform-origin: left;
        border: 1px solid #1976D2;
    }
    .book-content {
        background-color: #fff;
        color: #33363C;
        overflow: hidden;
        transform: rotateY(-30deg) ;
    }
    .book-cover {
        background-color: #1976D2;
        color: #ffffff;
        transform: rotateY(-150deg) ;

    }
    .book-content1{
        /*名称、持续时间、速度曲线延迟、播放次数、反向播放*/
        animation: roll 5s ease 0s 2 alternate;
    }
    @keyframes roll {
        from {transform: rotateY(0)}
        to {transform: rotateY(-180deg)}
    }
    .el-divider{
        border-bottom: 1px solid white;
        margin: 0;
    }
    .el-carousel__indicator{
        background-color: black!important;
    }
</style>

