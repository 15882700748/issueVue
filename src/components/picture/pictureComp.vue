<template>
    <div>

        <div class="infinite-list-wrapper" style="overflow-y:auto">
            <div class="wrapper">
                <div class="album">
                    <el-upload
                            action="http://localhost:8181/uploadImg"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
            </div>
            <div
                    class="wrapper"
                    v-for="(item,index) in imgs"
                    v-infinite-scroll="load" infinite-scroll-disabled="disabled">
                <div class="album" >
                    <div class="img">
                        <el-image
                                :src="item.imgUrl"
                                fit="cover"
                                :preview-src-list="imgUrlList"></el-image>
                    </div>
                    <span class="albumName">上传日期：{{item.uploadTime}}</span>
                    <span class="albumDelete"><i class="el-icon-circle-close" style="color: red;font-size: 1.5em" @click="deleteImg(item.imgId)"></i></span>
                    <!--<span class="albumEdit"><i class="el-icon-edit-outline" @click="editAlbum(item.albumId,item.albumName,item.albumDesc)"></i></span>-->
                    <!--<el-dialog title="修改相册" :visible.sync="updateAlbumDialogFormVisible" :close-on-click-modal="!updateAlbumDialogFormVisible"-->
                               <!--width="30%" center  @closed="addAlbumHandleOnClose('updateAlbumForm'+index)" >-->
                        <!--<el-form :model="updateAlbumForm" :rules="updateAlbumFormRule" :ref="'updateAlbumForm'+index">-->
                            <!--<el-form-item label="" prop="albumName">-->
                                <!--<el-input v-model="updateAlbumForm.albumName" autocomplete="off" placeholder="相册名"></el-input>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="" prop="albumDesc">-->
                                <!--<el-input v-model="updateAlbumForm.albumDesc" autocomplete="off" placeholder="描述"></el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-form>-->
                        <!--<div slot="footer" class="dialog-footer">-->
                            <!--<el-button @click="updateAlbumDialogFormVisible = false">取 消</el-button>-->
                            <!--<el-button type="primary" @click="submitUpdateAlbumForm('updateAlbumForm'+index)">确 定</el-button>-->
                        <!--</div>-->
                    <!--</el-dialog>-->
                </div>
            </div>
            <p v-if="loading">加载中...</p>
            <p v-if="noMore">没有更多了</p>
        </div>
        <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
    </div>
</template>

<script>
    export default {
        name: "pictureComp",
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
            handleAvatarSuccess(res, file) {
                // this.imageUrl = URL.createObjectURL(file.raw);
                const  _this =this
                let logoUrl = res.filePath
                axios.post("/img/addImg/"+this.albumId+"",{"imgUrl":logoUrl}).then(function (rep) {
                    this.$message({
                        message: resp.data.msg,
                        type: 'success'
                    })
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
                this.$message({
                    message:id,
                    type:'success'
                })
                axios.post("/img/pageQuery?pageNo="+pageNo+"&pageSize="+pageSize+"&albumId="+id).then(function (resp) {
                    _this.imgItem =Object.assign({},_this.imgItem,resp.data.records)
                    _this.imgs = _this.imgs.concat(resp.data.records)
                    // _this.albums = resp.data.records
                    for(let i=0 ; i < _this.imgs.length;i++){
                        _this.imgs[i].imgUrl = axios.defaults.baseURL+"/album/"+_this.imgs[i].imgUrl
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
                        _this.page(0)
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
            this.page(this.albumId,0)
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