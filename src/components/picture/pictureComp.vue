<template>
    <div style="width: 100%;height: 600px">
        <div >
            <div class="wrapper">
                <div class="album">
                    <el-upload
                            action="http://localhost:8181/uploadImgadd/1"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
            </div>
            <!--<div-->
                    <!--class="wrapper"-->
                    <!--v-for="(item,index) in imgs"-->
                    <!--v-infinite-scroll="load" infinite-scroll-disabled="disabled">-->
                <!--<div class="album" >-->
                    <!--<div class="img">-->
                        <!--<el-image-->
                                <!--:src="item.imgUrl"-->
                                <!--fit="cover"-->
                                <!--:preview-src-list="imgUrlList"></el-image>-->
                    <!--</div>-->
                    <!--<span class="albumName">上传日期：{{item.uploadTime}}</span>-->
                    <!--<span class="albumDelete"><i class="el-icon-circle-close" style="color: red;font-size: 1.5em" @click="deleteImg(item.imgId)"></i></span>-->
                <!--</div>-->
            <!--</div>-->
            <!--<p v-if="loading">加载中...</p>-->
            <!--<p v-if="noMore">没有更多了</p>-->

        </div>
        <vue-waterfall-easy :maxCols="4" ref="waterfall" :imgsArr="imgsArr" @scrollReachBottom="getData">
            <div class="img-info" slot-scope="props">
                <p class="some-info">第{{props.index+1}}张图片</p>
                <p class="som-info">{{props.value.data.uploadTime}}</p>
            </div>
            <div slot="waterfall-over">waterfall-over</div>
        </vue-waterfall-easy>
        <div >

        </div>
    </div>
</template>

<script>
    import vueWaterfallEasy from 'vue-waterfall-easy'
    export default {
        name: "pictureComp",
        components:{
            vueWaterfallEasy
        },
        data(){
            return{
                imgItem:{},
                imgs:[],
                imgUrlList:[],
                total:0,
                totalPage:0,
                currentPage:0,
                albumId:'',
                imageUrl:'',
                loading: false,
                imgsArr: [],
                pages:0
            }
        },
        computed: {
            noMore () {
                return (this.currentPage === this.totalPage)
            },
            disabled () {
                return this.loading || this.noMore
            }
        },
        methods:{
            getData() {
                let _this = this
                axios.post("/img/pageQuery?pageNo="+_this.pages+"&pageSize="+8+"&albumId="+_this.albumId) // 真实环境中，后端会根据参数group返回新的图片数组，这里我用一个惊呆json文件模拟
                    .then(res => {
                        let logos = []
                        for(let i=0; i<res.data.records.length; i++){
                            let d = {
                                src :'',
                                href : '',
                                data : null
                            }
                            console.log(res.data.records)
                            d.src = axios.defaults.baseURL+'/album/'+res.data.records[i].imgUrl
                            //axios.defaults.baseURL+"/album/"+_this.imgs[i].imgUrl
                            d.data = res.data.records[i]
                            logos.push(d)
                        }
                        _this.imgsArr = _this.imgsArr.concat(logos)
                        console.log(_this.imgsArr)
                        if(_this.pages === res.data.pages) _this.$refs.waterfall.waterfallOver()
                        else _this.pages ++
                    })
            },
            handleAvatarSuccess(res, file) {
                // this.imageUrl = URL.createObjectURL(file.raw);
                const  _this =this
                let logoUrl = res.filePath
                axios.post("/img/addImg/"+_this.albumId+"",{"imgUrl":logoUrl}).then(function (rep) {
                    _this.imgs = []
                    _this.imgUrlList = []
                    _this.imgItem = {}
                    _this.page(_this.albumId,0)
                })

            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            load(){
                this.loading = true
                setTimeout(() => {
                    this.currentPage+=1;
                    this.page(this.albumId,this.currentPage)
                    this.loading = false
                }, 1000)

            },
            page(id,pageNo,pageSize=2,){
                const  _this = this
                axios.post("/img/pageQuery?pageNo="+pageNo+"&pageSize="+pageSize+"&albumId="+id).then(function (resp) {
                    _this.imgItem =Object.assign({},_this.imgItem,resp.data.records)
                    _this.imgs = _this.imgs.concat(resp.data.records)
                    // _this.albums = resp.data.records
                    for(let i=0 ; i < _this.imgs.length;i++){
                        if(_this.imgs[i].imgUrl.indexOf("http:")){
                            _this.imgs[i].imgUrl = axios.defaults.baseURL+"/album/"+_this.imgs[i].imgUrl
                        }
                        _this.imgUrlList.push(_this.imgs[i].imgUrl)
                    }
                    _this.total = resp.data.total
                    _this.totalPage = resp.data.pages
                    _this.currentPage = resp.data.current
                })
            },
            deleteImg(imgId){
                const _this = this
                this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    let data ={"imgId":imgId}
                    axios.post("/img/deleteImg",data).then(function (resp) {
                        _this.imgs = []
                        _this.imgUrlList = []
                        _this.imgItem = {}
                        _this.page(_this.albumId,0)
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        created(){
            const _this =this
            this.albumId = this.$route.query.albumId
            this.getData()
        }
    }
</script>

<style scoped>
    .wrapper{
        display: inline-flex;
        flex-direction:row;
        position: relative;
        width: 400px;
        height: 300px;
        top: 10px;
        margin-right: 20px;
        margin-left: 20px;
    }
    .album{
        width: 300px;
        height: 200px;
        border: 6px solid white;
        box-shadow: 1px 1px 5px #333333;
        text-align: center;
    }
    .album .img{
        display:inline-flex;
        width: 300px;
        height: 200px;
    }
    .album .albumName{
        display:inline-flex;
        width: 300px;
        height: 20px;
        top: 10px;
        position: relative;
    }
    .album .albumDelete{
        display:inline-flex;
        position: absolute;
        width: 20px;
        height: 20px;
        top:10px;
        right: 100px ;
    }
    .albumDelete:hover{
        cursor: pointer;
    }
    .album .albumEdit{
        display:inline-flex;
        position: absolute;
        width: 20px;
        height: 20px;
        top: 180px;
        right: 100px ;
    }
</style>