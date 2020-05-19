<template>
    <el-container style="box-shadow:0px 0px 20px 0 black;min-height:740px;position: relative">
       <loading-comp v-if="loadingStatus" :text="loadingText"></loading-comp>
        <div v-else class="home" ref="imageWrapper">
            <draggable  v-model="homeData" ref="dragWrapper" @update="datadragEnd"  :animation = "500" style="position: relative">
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
                                        <el-carousel-item style="background-color:#f0f0f0 ;" v-for="item in 3 " :key="element.name+item">
                                        </el-carousel-item>
                                     </el-carousel>
                                    <el-carousel v-else :autoplay="false" indicator-position="none"   height="380px">
                                        <el-carousel-item style="background-color:#f0f0f0 ;" v-for="item in 2" :key="element.name+item">
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
                               <div v-if="articleType === '卡片效果'">
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
                               </div>
                               <div v-else-if="articleType === '书籍效果'" >
                                    <book :articles="mainContent.content"></book>
                               </div>
                              <div v-else style="height: 100%;width: 100%;">
                                  <vue-waterfall-easy style="height: 100%" class="waterfall" linkRange="custom"  :imgWidth="120" :maxCols="2"
                                                      ref="waterfall" :imgsArr="imgsArr" @scrollReachBottom="getData">
                                                <div class="img-info" slot-scope="props">
                                                    <p class="some-info">标题{{props.value.data.title}}</p>
                                                    <p class="some-info" >{{props.value.data.content}}</p>
                                                </div>
                                                <div slot=".waterfall-head" >waterfall-over</div>
                                           </vue-waterfall-easy>
                                  <el-backtop target=".vue-waterfall-easy-scroll" :right="25" :bottom="15" :visibility-height="100"></el-backtop>
                              </div>
                               <div class="notice-wrapper">
                                   <div class="notice-item notice-item-default">{{articleType }}</div>
                                   <div class="notice-item notice-item-set" @click="showAricleStyleDialog">配置样式</div>
                               </div>
                               <!--==========================dialog======================================-->
                               <el-dialog
                                       :title="'选择：'+articleTypeSelect[articleTypeIndex]+'样式'"
                                       :visible.sync="styleSelectDialog"
                                       width="400px"
                                       height="400px"
                                       :before-close="handleClose">

                                  <el-carousel @change="selectArticleStyle" style="background-color: #eaeaea"  :autoplay="false" arrow="never" height="380px">
                                       <!--===========================书籍效果==================================-->
                                        <el-carousel-item :key="'书籍效果'">
                                            <book :articles="mainContent.content"></book>
                                        </el-carousel-item>
                                        <el-carousel-item :key="'卡片效果'">
                                            <!--===========================卡片效果==================================-->
                                            <el-card class="box-card" shadow="always">
                                              <div slot="header" class="clearfix" style="border-bottom: 1px solid white">
                                                标题：<span>{{mainContent.content[0].title}}</span>
                                              </div>
                                                <div style="width: 100%;height: 200px;font-size: 0.1px;" v-html="mainContent.content[0].content">
                                                </div>
                                            </el-card>
                                        </el-carousel-item>
                                        <el-carousel-item  :key="'瀑布流效果'" style="height: 100%">
                                            <!--===========================瀑布流效果==================================-->
                                           <vue-waterfall-easy style="height: 100%" class="waterfall" linkRange="custom"  :imgWidth="100" :maxCols="2"
                                                               ref="waterfall" :imgsArr="imgsArr" @scrollReachBottom="getData">
                                                <div class="img-info" slot-scope="props">
                                                    <p class="some-info">标题{{props.value.data.title}}</p>
                                                    <p class="some-info" v-html="props.value.data.content"></p>
                                                </div>
                                                <div slot=".waterfall-head" >waterfall-over</div>
                                           </vue-waterfall-easy>
                                            <el-backtop target=".vue-waterfall-easy-scroll" :right="25" :bottom="15" :visibility-height="100"></el-backtop>
                                        </el-carousel-item>
                                     </el-carousel>

                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="styleSelectDialog = false">取 消</el-button>
                                        <el-button type="primary" @click="confirmStyleSelect">确认样式</el-button>
                                    </span>
                                 </el-dialog>
                           </span>
                       </span>
                <span v-else>显示区</span>

                <!--最终展示的地方-->
            </el-badge>
            <el-badge value="不可拖动" type="info" class="footer" ref="footer">
                <el-button style="height: 50px;margin-top: 20px" type="primary" @click="saveStyle" ref="makeImgButton">保存样式</el-button>
            </el-badge>
            <!--<el-badge value="不可拖动" type="info" class="main">-->
                       <!--<span v-if="!mainContent.isNull">-->
                           <!--<span v-if="mainContent.type === 'column'" class="content" v-html="mainContent.content"></span>-->
                           <!--<span v-else class="content">-->
                               <!--<div v-if="articleType === '卡片效果'">-->
                                   <!--<el-carousel :autoplay="false" indicator-position="outside"  height="320px" >-->
                                        <!--<el-carousel-item v-for="(item,i) in mainContent.content" :key="item.title">-->
                                       <!--<el-card shadow="always" class="box-card">-->
                                            <!--<div slot="header" class="clearfix">-->
                                                <!--文章{{i+1}}-<strong>标题：</strong><span>{{item.title}}</span>-->
                                            <!--</div>-->
                                           <!--<strong>内容：</strong>-->
                                           <!--<div v-html="item.content">-->
                                           <!--</div>-->
                                       <!--</el-card>-->
                                   <!--</el-carousel-item>-->
                                   <!--</el-carousel>-->
                               <!--</div>-->
                               <!--<div v-else-if="articleType === '书籍效果'" >-->
                                    <!--<book :articles="mainContent.content"></book>-->
                               <!--</div>-->
                              <!--<div v-else style="height: 100%;width: 100%;">-->
                                  <!--<vue-waterfall-easy style="height: 100%" class="waterfall" linkRange="custom"  :imgWidth="120" :maxCols="2"-->
                                                      <!--ref="waterfall" :imgsArr="imgsArr" @scrollReachBottom="getData">-->
                                                <!--<div class="img-info" slot-scope="props">-->
                                                    <!--<p class="some-info">标题{{props.value.data.title}}</p>-->
                                                    <!--<p class="some-info" >{{props.value.data.content}}</p>-->
                                                <!--</div>-->
                                                <!--<div slot=".waterfall-head" >waterfall-over</div>-->
                                           <!--</vue-waterfall-easy>-->
                                  <!--<el-backtop target=".vue-waterfall-easy-scroll" :right="25" :bottom="15" :visibility-height="100"></el-backtop>-->
                              <!--</div>-->
                               <!--<div class="notice-wrapper">-->
                                   <!--<div class="notice-item notice-item-default">{{articleType }}</div>-->
                                   <!--<div class="notice-item notice-item-set" @click="showAricleStyleDialog">配置样式</div>-->
                               <!--</div>-->
                               <!--&lt;!&ndash;==========================dialog======================================&ndash;&gt;-->
                               <!--<el-dialog-->
                                       <!--:title="'选择：'+articleTypeSelect[articleTypeIndex]+'样式'"-->
                                       <!--:visible.sync="styleSelectDialog"-->
                                       <!--width="400px"-->
                                       <!--height="400px"-->
                                       <!--:before-close="handleClose">-->

                                  <!--<el-carousel @change="selectArticleStyle" style="background-color: #eaeaea"  :autoplay="false" arrow="never" height="380px">-->
                                       <!--&lt;!&ndash;===========================书籍效果==================================&ndash;&gt;-->
                                        <!--<el-carousel-item :key="'书籍效果'">-->
                                            <!--<book :articles="mainContent.content"></book>-->
                                        <!--</el-carousel-item>-->
                                        <!--<el-carousel-item :key="'卡片效果'">-->
                                            <!--&lt;!&ndash;===========================卡片效果==================================&ndash;&gt;-->
                                            <!--<el-card class="box-card" shadow="always">-->
                                              <!--<div slot="header" class="clearfix" style="border-bottom: 1px solid white">-->
                                                <!--标题：<span>{{mainContent.content[0].title}}</span>-->
                                              <!--</div>-->
                                                <!--<div style="width: 100%;height: 200px;font-size: 0.1px;" v-html="mainContent.content[0].content">-->
                                                <!--</div>-->
                                            <!--</el-card>-->
                                        <!--</el-carousel-item>-->
                                        <!--<el-carousel-item  :key="'瀑布流效果'" style="height: 100%">-->
                                            <!--&lt;!&ndash;===========================瀑布流效果==================================&ndash;&gt;-->
                                           <!--<vue-waterfall-easy style="height: 100%" class="waterfall" linkRange="custom"  :imgWidth="100" :maxCols="2"-->
                                                               <!--ref="waterfall" :imgsArr="imgsArr" @scrollReachBottom="getData">-->
                                                <!--<div class="img-info" slot-scope="props">-->
                                                    <!--<p class="some-info">标题{{props.value.data.title}}</p>-->
                                                    <!--<p class="some-info" v-html="props.value.data.content"></p>-->
                                                <!--</div>-->
                                                <!--<div slot=".waterfall-head" >waterfall-over</div>-->
                                           <!--</vue-waterfall-easy>-->
                                            <!--<el-backtop target=".vue-waterfall-easy-scroll" :right="25" :bottom="15" :visibility-height="100"></el-backtop>-->
                                        <!--</el-carousel-item>-->
                                     <!--</el-carousel>-->

                                    <!--<span slot="footer" class="dialog-footer">-->
                                        <!--<el-button @click="styleSelectDialog = false">取 消</el-button>-->
                                        <!--<el-button type="primary" @click="confirmStyleSelect">确认样式</el-button>-->
                                    <!--</span>-->
                                 <!--</el-dialog>-->
                           <!--</span>-->
                       <!--</span>-->
                <!--<span v-else>显示区</span>-->

                <!--&lt;!&ndash;最终展示的地方&ndash;&gt;-->
            <!--</el-badge>-->
            <!--<el-badge value="不可拖动" type="info" class="footer" ref="footer">-->
                <!--<el-button style="height: 50px;margin-top: 20px" type="primary" @click="saveStyle" ref="makeImgButton">保存样式</el-button>-->
            <!--</el-badge>-->
            <!--<div class="controllerArea" >-->

            <!--</div>-->
        </div>

    </el-container>
</template>

<script>
    import draggable from 'vuedraggable'
    import VueDragResize from 'vue-drag-resize'
    import vueCropper from 'vue-cropper'
    import html2canvas from 'html2canvas';
    import Book from '../components/tool/book'
    import ShowBook from '../components/showBook'
    import vueWaterfallEasy from 'vue-waterfall-easy'
    export default {
        name:'HomeConfig',
        components:{draggable,VueDragResize,vueCropper,html2canvas,Book,vueWaterfallEasy,ShowBook},
        data(){
            return {
                x:'',
                y:'',
                QRUrl: '',
                LOGOUrl: '',
                dataURL: '',
                styleId : '',
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
                // colors: [
                //     {text: "首页"},
                //     {text: "栏目"},
                //     {text: ""},
                // ],
                startArr:[],
                endArr:[],
                imgArr:[],
                imgsArr: [],
                mainContent:{
                    isNull:true,
                    type:'',
                    content:null
                },
                articleTypeSelect : ['书籍效果','卡片效果','瀑布效果'],
                styleData: {
                    color : '',
                    articleType : '',
                    Layout : null,
                    img : ''
                },
                articleType : '卡片效果',
                loadingText : '数据保存中',
                articleTypeIndex : 1,
                count: 10,
                total:0,
                totalPage:0,
                currentPage:0,
                pageSize:0,
                pages:0,
                loading: false,
                styleSelectDialog:false,
                isSuccess : true,
                loadingStatus : false
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
            getStyle(){
                let _this = this
                axios.post('/style/getStyle').then(resp => {
                    if(resp.data.code === '200'){
                        let style = resp.data.style,
                            layout = JSON.parse(style.layout).Layout,
                            typeInfo = JSON.parse(style.layout),
                            arr = [],
                            code,
                            target
                        this.articleType = typeInfo.articleType
                        this.articleTypeIndex = this.articleTypeSelect.indexOf(this.articleType)
                        console.log(typeInfo)
                        _this.homeData[layout.indexOf('首页')].name = '首页'
                        _this.homeData[layout.indexOf('栏目')].name = '栏目'
                        _this.homeData[layout.indexOf('')].name = ''

                    }else{
                        _this.$message("未设置展示")
                    }
                })
            },
            message(message,type){
                this.$message({
                    message:message,
                    type:type
                })
            },
            //dialog
            showAricleStyleDialog(){
                this.styleSelectDialog =  true
                this.getData()
            },
            handleClose(){
                this.articleTypeIndex = 0
                this.imgsArr = []
            },
            selectArticleStyle(index,old){
                // this.message("active:"+index+',orginal:'+old,'info')
                this.articleTypeIndex = index
            },
            confirmStyleSelect(){
                this.styleSelectDialog = false
                this.articleType = this.articleTypeSelect[this.articleTypeIndex]
            },
            //
            // clickFn(event, { index, value }) {
            //     // 阻止a标签跳转
            //     event.preventDefault()
            //     // 只有当点击到图片时才进行操作
            //     // if (event.target.tagName.toLowerCase() == 'img') {
            //     //     console.log('img clicked',index, value)
            //     // }
            //     this.message(event.target.tagName.toLowerCase(),'info')
            // },
            getData() {
                let _this = this
                axios.post("/issue/queryPage?pageNo="+_this.pages+"&pageSize="+3) // 真实环境中，后端会根据参数group返回新的图片数组，这里我用一个惊呆json文件模拟
                    .then(res => {
                        let logos = []
                        for(let i=0; i<res.data.records.length; i++){
                            let d = {
                                src :'',
                                href : '',
                                data : null
                            }
                            d.src = axios.defaults.baseURL+'issue/'+res.data.records[i].logo
                            res.data.records[i].content = 'xxxxxxxxxxxx'
                            d.data = res.data.records[i]
                            logos.push(d)
                        }
                        _this.imgsArr = _this.imgsArr.concat(logos)
                        if(_this.pages === res.data.pages){
                            // _this.$refs.waterfall.waterfallOver()
                            _this.pages = 0
                        }
                        else _this.pages ++
                    })
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
                    _this.styleId = data.style.styleId
                    for(let i=0; i< _this.homeData.length; i++){
                        if(_this.homeData[i].name === '首页'){
                            _this.homeData[i].item = data.issue
                        }else if(_this.homeData[i].name === '栏目'){
                            _this.homeData[i].item = data.columns
                        }else{
                            _this.homeData[i].item = null
                        }
                    }
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
                    this.isSuccess = false;
                }else{
                    this.isSuccess = true
                }
                // console.log('拖动前的索引 :' + evt.oldIndex)
                // console.log('拖动后的索引 :' + evt.newIndex)
                // console.log(this.homeData);
                this.mainContent.isNull = true
            },
            // 将dom转成canvas
            saveStyle() {
                let that = this
                let opts = {
                    logging: true, // 启用日志记录以进行调试 (发现加上对去白边有帮助)
                    allowTaint: true, // 否允许跨源图像污染画布
                    backgroundColor: null, // 解决生成的图片有白边
                    useCORS: true // 如果截图的内容里有图片,解决文件跨域问题
                }
                if(this.isSuccess){
                    this.loadingStatus = true
                    this.styleData.color = this.footerColor
                    this.styleData.articleType = this.articleType
                    html2canvas(that.$refs.imageWrapper, opts).then((canvas) => {
                        let url = canvas.toDataURL('image/png')
                        // that.styleData.img = url
                        //that.imgArr.push(url)
                    })
                    let d = []
                    for(let i=0; i<this.homeData.length; i++){
                        d.push(this.homeData[i].name)
                    }
                    this.styleData.Layout = d
                    let data = {}
                    data.styleId = this.styleId
                    data.layout = JSON.stringify(this.styleData)
                    axios.post('style/updateStyle',data).then(resp => {
                        that.message("修改成功",'success')
                        that.loadingStatus = false
                    })
                }else{
                    this.message('请重新调整首页位置','error')
                }
                // eslint-disable-next-line no-undef

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
            this.getStyle()
            this.page()
        }
    }
</script>

<style  scoped>
    .el-badge {
        display:block;
    }
    *,*:after,*:before{
        box-sizing: border-box;
        padding: 0;
    }
    .home{
        margin: 0 auto;
        width: 90%;
        min-height: 700px;
        position: relative;
        top: 20px;
        color: black;
    }
    .top{
        width: 100%;
        height: 100px;
        position: relative;
        border: 1px #aaa dashed;
    }
    .main{
        width: 687px;
        height: auto;
        position: absolute;
        left: 220px;
        top: 105px;
        align-items: center;
        overflow: hidden;
        /*border: 1px deepskyblue dashed;*/
    }
    .right{
        width: 200px;
        min-height: 400px;
        position: absolute;
        top:105px;
        right:0;
        border: 1px #aaa dashed;
    }
    .left{
        width: 200px;
        min-height: 400px;
        position: relative;
        left: 0;
        top:5px;
        border: 1px #aaa dashed;
    }
    .footer{
        display: flex;
        justify-content: center;
        justify-items: center;
        width: 100%;
        height: 100px;
        position: relative;
        left: 0;
        bottom: 0;
        border: 1px #aaa dashed;
    }
    .controllerArea{
        width: 1000px;
        height: 50px;
        position: relative;
        left: 0px;
        top: 420px;
        /*border: 1px #aaa dashed;*/
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

