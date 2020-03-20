<template>
    <div class="wrapper">
        <div class="card">
            <div class="headerCard">
                <span style="position: absolute;display: block;width: 20px;height: 20px;top: 5px;left: 138px;font-size:20px">
                    <i class="el-icon-circle-close" @click="deleteSponById(sponData.sponId)"></i>
                </span>
                <el-upload
                        class=""
                        :action="'http://localhost:8181/updateSponIcon/'+sponData.sponId"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload" >
                    <img  :src="sponData.logoUrl" class="avatar avatarImg">
                </el-upload>
                <p style="position: relative;top: 30px;">
                    <strong>赞助商：</strong>{{sponData.sponName}}
                    <i class="el-icon-edit editContent" @click="updateSpon('sponName',sponData.sponName,sponData.sponId)"></i>
                </p>
                <p style="position: relative;top: 40px;">
                    <strong>网站：</strong> <el-link type="primary" :href="'http://'+sponData.site"
                             target="_blank">{{sponData.site}}</el-link>
                    <i class="el-icon-edit editContent" @click="updateSpon('site',sponData.site,sponData.sponId)"></i>
                </p>
                <el-dialog title="修改" :visible.sync="infoCardDialogVisible" @closed="infoCardDialogCloded('sponDailogForm')">
                    <el-form :model="form" :rules="rule" ref="sponDailogForm">
                        <el-form-item label="修改项" prop="name">
                            <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="infoCardDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="updateSponInfoCardConfirm('sponDailogForm')">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div><!-- end card -->
    </div> <!-- end wrapper-->
</template>

<script>
    export default {
        name: "SponInfoCardComp",
        props:['data','allItem','currentPage','isLast','ruleForm'],
        data(){
            return{
                cardData:{},
                sponIcon:'',
                infoCardDialogVisible:false,
                form:{
                    name:'',
                    sponId:''
                },
                rule:{
                    name:[{required: true, message: '请输入信息', trigger: 'onSubmit'}]
                },
            }

        },
        computed:{
            sponData(){
                return this.data;
            }
        },
        methods:{
            page(currentPage,pageSize=2){
                const _this = this
                axios.post("/spon/page?pageNo="+(currentPage)+"&pageSize="+pageSize+"&"+this.ruleForm.select+"="+this.ruleForm.content).then(function(resp){
                    _this.allItem = resp.data.records
                    for(let i=0; i<resp.data.records.length;i++){
                        _this.allItem[i].logoUrl= axios.defaults.baseURL+'sponIcon/'+_this.allItem[i].logoUrl
                    }
                    _this.$emit(('newAllItem'),resp.data)
                })
            },
            handleAvatarSuccess(res, file) {
                this.sponData.logoUrl =axios.defaults.baseURL+'sponIcon/'+ res.filePath
                // this.sponIcon = URL.createObjectURL(file.raw);
                console.log(this.sponData.logoUrl )
                this.$message({
                    message: '上传成功',
                    type: 'success'
                });
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
            updateSpon(keys,val,id){
                this.infoCardDialogVisible = true
                this.form.key = keys
                this.form.val = val;
                this.form.sponId = id
            },
            updateSponInfoCardConfirm(formName){
                this.$refs[formName].validate((valid) => {
                    const _this = this
                    let data = {}
                    data[this.form.key]=this.form.name
                    data['sponId'] = this.form.sponId
                    if(valid){
                        axios.post('/spon/updateSpon',data).then(function (resp) {
                            let data = resp.data
                            if(data.code === '200'){
                                _this.data =resp.data.spon
                                _this.$message({
                                    message:data.msg,
                                    type:'success'
                                })
                                _this.infoCardDialogVisible = false
                            }else{
                                _this.$message({
                                    message:data.msg,
                                    type:'warning'
                                })
                            }
                        })
                    }else{
                        console.log('error submit!!');
                        return false;
                    }

                })
            },
            infoCardDialogCloded(formName){
                this.$refs[formName].resetFields();
            },
            deleteSponById(id){
                const _this = this
                this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    let data ={"sponId":id}
                    axios.post("/spon/deleteSponById",data).then(function (resp) {

                        let curPage = _this.currentPage
                        if(_this.isLast && _this.allItem.length === 1){
                            curPage -= 1;
                        }

                        _this.page(curPage)
                        console.log(_this.allItem.length)
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

        }
    }
</script>

<style scoped>
    *{
        margin: 0;
        padding: 0;
    }

    .clear{
        clear: both;
    }

    .wrapper{
        display: inline-flex;
        margin-right: 20px;
        width: 162px;
        height: 157px;
    }

    /*card*/

    .card{
        background-color: #fff;
        border: 2px solid #000;
        border-radius: 6px;
    }

    .headerCard{
        color: #000;
        text-align: center;
        font-weight: 700;
        width: 162px;
        height: 157px;
        position: relative;
    }

    .avatarImg{
        display: flex;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 3px solid #000;
        cursor: pointer;
        opacity: .8;
        position: relative;
        left: 50%;
        top: 20%;
        transform: translate(-50%,20%);
    }
    .avatarImg:hover{
        border: 3px solid #000;
        opacity: 1;
    }

    .headerCard p{
        margin-bottom: 0;

    }

    .avatarImg{
        -webkit-transition: all .8s;
        -moz-transition: all .8s;
        -o-transition: all .8s;
        -ms-transition: all .8s;
        transition: all .8s;
    }

    .editContent{
        font-size: 0.7em;
        color: #000;
    }


</style>