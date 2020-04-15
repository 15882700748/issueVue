<template>
    <el-container>
        <el-main style="width: 100%;height: 500px;overflow-y:scroll">
            <el-row>
                <el-col>
                    <div class="addImg">
                        <i class="el-icon-plus" @click="showAlbumDialogForm"></i>
                        <el-dialog title="新增相册" :visible.sync="albumDialogFormVisible" :close-on-click-modal="!albumDialogFormVisible"
                                   width="30%" center  @closed="addAlbumHandleOnClose('addAlbumForm')" >
                            <el-form :model="addAlbumForm" :rules="addAlbumFormRule" ref="addAlbumForm">
                                <el-form-item label="" prop="albumName">
                                    <el-input v-model="addAlbumForm.albumName" autocomplete="off" placeholder="相册名"></el-input>
                                </el-form-item>
                                <el-form-item label="" prop="albumDesc">
                                    <el-input v-model="addAlbumForm.albumDesc" autocomplete="off" placeholder="描述"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="albumDialogFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="submitAddAlbumForm('addAlbumForm')">确 定</el-button>
                            </div>
                        </el-dialog>
                    </div>
                    <div class="infinite-list-wrapper" style="overflow-y:auto">
                        <div
                                class="wrapper"
                                v-for="(item,index) in albums"
                                v-infinite-scroll="load" infinite-scroll-disabled="disabled">
                            <div class="album" >
                                <img :src="axios.defaults.baseURL+'album/'+item.imgUrl" class="img" @click="pictureView(item.albumId)">
                                <span class="albumName">相册名称：{{item.albumName}}</span>
                                <span class="albumDesc">描述：{{item.albumDesc}}</span>
                                <span class="albumDelete"><i class="el-icon-circle-close" @click="deleteAlbum(item.albumId)"></i></span>
                                <span class="albumEdit"><i class="el-icon-edit-outline" @click="editAlbum(item.albumId,item.albumName,item.albumDesc)"></i></span>
                                <el-dialog title="修改相册" :visible.sync="updateAlbumDialogFormVisible" :close-on-click-modal="!updateAlbumDialogFormVisible"
                                           width="30%" center  @closed="addAlbumHandleOnClose('updateAlbumForm'+index)" >
                                    <el-form :model="updateAlbumForm" :rules="updateAlbumFormRule" :ref="'updateAlbumForm'+index">
                                        <el-form-item label="" prop="albumName">
                                            <el-input v-model="updateAlbumForm.albumName" autocomplete="off" placeholder="相册名"></el-input>
                                        </el-form-item>
                                        <el-form-item label="" prop="albumDesc">
                                            <el-input v-model="updateAlbumForm.albumDesc" autocomplete="off" placeholder="描述"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click="updateAlbumDialogFormVisible = false">取 消</el-button>
                                        <el-button type="primary" @click="submitUpdateAlbumForm('updateAlbumForm'+index)">确 定</el-button>
                                    </div>
                                </el-dialog>
                            </div>
                        </div>
                        <p v-if="loading">加载中...</p>
                        <p v-if="noMore">没有更多了</p>
                    </div>
                </el-col>
            </el-row>

        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "albumComp",
        props:['isPicturePage'],
        data(){
            return {
                albums:[],
                albumItem:{},
                addAlbumForm:{
                    albumName:'',
                    albumDesc:''
                },
                addAlbumFormRule:{
                    albumName:[{required: true, message: '请输入相册名', trigger: 'onSubmit'}],
                    albumDesc:[{required: true, message: '请输入描述', trigger: 'onSubmit'}]
                },
                updateAlbumForm:{
                    albumName:'',
                    albumDesc:'',
                    albumId:0
                },
                updateAlbumFormRule:{
                    albumName:[{required: true, message: '请输入相册名', trigger: 'onSubmit'}],
                    albumDesc:[{required: true, message: '请输入描述', trigger: 'onSubmit'}]
                },
                loading: false,
                total:0,
                pageSize:1,
                currentPage:0,
                totalPage:0,
                albumDialogFormVisible:false,
                updateAlbumDialogFormVisible:false
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
            pictureView(albumId){
                this.$emit('getHeaderStatus',true)
                this.$router.push({
                    path:'/picture',
                    query:{
                        albumId:albumId
                    }
                })
            },
            getAlbumImg(id){
                let data = {},
                    img
                data.albumId = id

                return img.imgUrl
            },
            page(pageNo,pageSize=2){
                const  _this = this
              axios.post("/album/pageQuery?pageNo="+pageNo+"&pageSize="+pageSize).then(function (resp) {
                  _this.albumItem =Object.assign({},_this.albumItem,resp.data.records)
                  _this.albums = _this.albums.concat(resp.data.records)
                  for(let i=0; i<_this.albums.length; i++){
                      axios.post("/album/getFisrtPicture",{'albumId':_this.albums[i].albumId}).then(function (resp) {
                          _this.albums[i].imgUrl = resp.data.img.imgUrl
                      })
                  }

                  // _this.albums = resp.data.records
                  _this.total = resp.data.total
                  _this.totalPage = resp.data.pages
                  _this.currentPage = resp.data.current
              })
            },
            load(){
                this.loading = true
                setTimeout(() => {
                    this.currentPage+=1;
                    this.page(this.currentPage)
                    this.loading = false
                }, 1000)

            },
            deleteAlbum(albumId){
                const _this = this
                this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    let data ={"albumId":albumId}
                    axios.post("/album/deleteAlbum",data).then(function (resp) {
                        _this.albums = []
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
            },
            showAlbumDialogForm(){
              this.albumDialogFormVisible = true
            },
            addAlbumHandleOnClose(formName){
                if(formName === 'addAblumForm'){
                    this.$refs[formName].resetFields();
                }else{
                    this.$refs[formName][0].resetFields();
                }
            },
            editAlbum(id,name, desc){
                this.updateAlbumForm.albumId = id;
                this.updateAlbumForm.albumDesc = desc
                this.updateAlbumForm.albumName = name
                this.updateAlbumDialogFormVisible = true
            },
            submitAddAlbumForm(formName){
                this.$refs[formName].validate((valid) => {
                    const _this = this;
                    if (valid) {
                       axios.post('/album/addAlbum',_this.addAlbumForm).then(function (resp) {
                           if(resp.data.code === "200"){
                               _this.$message({
                                   message:resp.data.msg,
                                   type:'success'
                               })
                               _this.albums = []
                               _this.page(0)
                               _this.albumDialogFormVisible = false
                           }else{
                               _this.$message({
                                   message:resp.data.msg,
                                   type:'warning'
                               })
                           }
                       })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitUpdateAlbumForm(formName){

                this.$refs[formName][0].validate((valid) => {
                    const _this = this;
                    if (valid) {
                        axios.post('/album/updateAlbum',_this.updateAlbumForm).then(function (resp) {
                            if(resp.data.code === "200"){
                                _this.$message({
                                    message:resp.data.msg,
                                    type:'success'
                                })
                                _this.albums = []
                                _this.page(0)
                                _this.updateAlbumDialogFormVisible = false
                            }else{
                                _this.$message({
                                    message:resp.data.msg,
                                    type:'warning'
                                })
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        created(){
            this.page(0)
        }
    }
</script>

<style scoped>
    .addImg{
        border: black 1px solid;
        display: inline-flex;
        flex-direction: column;
        position: absolute;
        border-radius: 50%;
        left: 0;
        top: 0;
    }
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
    .album .albumDesc{
        display:inline-flex;
        position: relative;
        width: 300px;
        height: 20px;
        top: 10px;
    }
    .album .albumDelete{
        display:inline-flex;
        position: absolute;
        width: 20px;
        height: 20px;
        top: 20px;
        right: 100px ;
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