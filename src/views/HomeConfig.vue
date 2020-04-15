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
                                    <el-carousel v-if="index1 === 0"  :interval="4000" type="card" height="80px">
                                        <el-carousel-item style="background-color:#99a9bf ;" v-for="item in 4" :key="element.name+item">
                                        </el-carousel-item>
                                     </el-carousel>
                                    <el-carousel v-else  :interval="4000"  height="380px">
                                        <el-carousel-item style="background-color:#99a9bf ;" v-for="item in 3" :key="element.name+item">
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
                               <el-carousel :interval="4000"  height="380px">
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
                        <el-button @click="uploadQR" >清除图片</el-button>
                        <el-button @click="makeImg" ref="makeImgButton">生成截图</el-button>
                    </div>
                </div>

            </el-container>
        </el-container>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import VueDragResize from 'vue-drag-resize'
    import vueCropper from 'vue-cropper'
    import html2canvas from 'html2canvas';
    export default {
        name:'HomeConfig',
        components:{draggable,VueDragResize,vueCropper,html2canvas},
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
                loading: false
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

                   console.log(this.homeData[i].item[j],data instanceof Array)
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
        cursor: default;
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
        cursor: default;
    }
    .content{
        display: block;
        width: 540px;
        height: 360px;
        margin: 20px auto;
        overflow: hidden;
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
        background-color: #fff;
    }

</style>

