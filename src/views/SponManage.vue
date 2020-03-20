<template>
    <el-container>
        <el-header>
            <el-row style="position: relative;top: 10px;min-width: 300px;text-align: center">
                <el-col :span="6">
                    <el-form :model="ruleForm" :rules="rules" label-position="top" ref="ruleForm" label-width="55px" width="400px"  class="demo-ruleForm">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item  prop="content">
                                    <el-input placeholder="请输入内容" v-model="ruleForm.content" class="input-with-select">
                                        <el-select v-model="ruleForm.select" slot="prepend" placeholder="请选择">
                                            <el-option label="赞助商名" value="sponName"></el-option>
                                            <el-option label="网站" value="site"></el-option>
                                        </el-select>
                                        <el-button slot="append" icon="el-icon-search" @click="submitForm('ruleForm')">搜索</el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
                <el-col :span="1" class="el-col-push-17">
                    <el-tooltip content="添加赞助商" placement="top">
                        <i class="el-icon-plus " style="position: relative;top: -10px;" @click="showDialog"></i>
                    </el-tooltip>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <div v-if="tableData">
                <SponInfoCardComp  v-for="item in tableData " :ruleForm="ruleForm" :isLast="isLast" :data="item" :currentPage="currentPage" :allItem="tableData" @newAllItem="getNewAllItem">
                </SponInfoCardComp>
                <div class="addInfo" v-if="isLast">
                    <i id="addIcon" class="el-icon-plus avatar-uploader-icon" @click="showDialog"></i>
                </div>

                <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="total"
                        :page-size="pageSize"
                        :current-page="currentPage"
                        @current-change = "page" style="position: relative;left: 0;top:20px;">
                </el-pagination>
            </div>
            <div v-else>
                没有更多了
            </div>
            <el-dialog title="新增赞助商" :visible.sync="dialogFormVisible" :close-on-click-modal="!dialogFormVisible"
                       width="30%" center  @closed="addSponHandleOnClose('addSponForm')" >
                <el-form :model="addSponForm" :rules="addSponFormRule" ref="addSponForm">
                    <el-form-item prop="logoUrl">
                        <el-row>
                            <el-col :span="8" :offset="10"  >
                                <el-upload
                                        ref="upload"
                                        action="http://localhost:8181/uploadSponIcon"
                                        :show-file-list="false"
                                        :on-success="addSponHandleSuccess"
                                        :before-upload="addSponHandleBeforeUpload"
                                        :auto-upload="true">
                                    <img v-if="true" class="addSponFormIcon" style="display: inline-block;width: 50px;height: 50px;"  :src="axios.defaults.baseURL+tempPath">
                                </el-upload>
                            </el-col>
                        </el-row>

                    </el-form-item >
                    <el-form-item label="" prop="sponName">
                        <el-input v-model="addSponForm.sponName" autocomplete="off" placeholder="赞助商"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="site">
                        <el-input v-model="addSponForm.site" autocomplete="off" placeholder="网站"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitAddSponForm('addSponForm')">确 定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
    import SponInfoCardComp from '../components/spon/SponInfoCardComp'
    export default {
        name: "SponManage",
        components:{
            SponInfoCardComp
        },
        data() {
            return {
                pageSize:2,
                total:1,
                currentPage:0,
                condition:null,
                tableData:null,
                logoUrl:'',
                ruleForm:{
                    content:'',
                    select:'sponName'
                },
                rules:{

                },
                dialogFormVisible:false,
                addSponForm:{
                    sponName:'',
                    site:'',
                    logoUrl:''
                },
                addSponFormRule:{
                    sponName:[{required: true, message: '请输入赞助商名', trigger: 'onSubmit'}],
                    site:[{required: true, message: '请输入网站', trigger: 'onSubmit'}],
                    // logoUrl:[{required: true, message: '选择图标', trigger: 'onSubmit'}]
                },
                autoUpload:false,
                isLast:false,
                uploadSuccess:true,
                tempPath:'sponIcon/16christine-zhu-1460573-unsplash.jpg',
                uploadFIleName:'',
                conditionSearch:false,
                isUploaded:false
            }
        },
        methods: {
            isLastPage(pageSize,currentPage,pages,num){
               if(num <pageSize || (pages === currentPage)) {
                   this.isLast = true
               }else{
                   this.isLast = false
               }
            },
            page(currentPage,pageSize=2){
                const _this = this
                axios.post("/spon/page?pageNo="+(currentPage)+"&pageSize="+pageSize+"&"+this.ruleForm.select+"="+this.ruleForm.content).then(function(resp){
                    _this.tableData = resp.data.records
                    console.log(resp)
                    for(let i=0; i<resp.data.records.length;i++){
                        _this.tableData[i].logoUrl= axios.defaults.baseURL+'sponIcon/'+_this.tableData[i].logoUrl
                    }
                    _this.pageSize =resp.data.size
                    _this.total = resp.data.total
                    _this.currentPage = resp.data.current
                    _this.isLastPage(resp.data.size,resp.data.current,resp.data.pages,_this.tableData.length)
                })
            },
            handleClick(row) {
                this.$message({
                    message: row.sponName,
                    type: 'success'
                });
            },
            deleteSponById(row){
                const _this = this
                this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    let data ={"sponId":row.sponId}
                    axios.post("/spon/deleteSponById",data).then(function (resp) {
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
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    const _this = this;
                    let formData = {}
                    formData[this.ruleForm.select] = this.ruleForm.content
                    this.condition = formData
                    this.page(0,2);
                    _this.$message({
                        message:'搜索成功',
                        type:'success'
                    })
                });
            },
            showDialog(){
                this.dialogFormVisible = true
            },
            addSponHandleBeforeUpload(file){
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
            addSponHandleSuccess(res,file){
                this.uploadSuccess = true
                this.isUploaded = true
                console.log(res)
                this.tempPath = res.filePath
                this.uploadFIleName = file.name
                this.tempPath ='temp/'+this.tempPath
            },
            addSponHandleOnClose(formName){
                this.$refs[formName].resetFields();
                this.tempPath = 'sponIcon/16christine-zhu-1460573-unsplash.jpg'
            },
            submitAddSponForm(formName){
                this.$refs[formName].validate((valid) => {
                    const _this = this;
                    if (valid) {
                        //submit file
                        _this.$refs['upload'].submit();
                        console.log("isUpload"+this.isUploaded)
                        if(this.isUploaded){//uploaded
                            _this.addSponForm.logoUrl = _this.uploadFIleName

                        }else{
                            _this.addSponForm.logoUrl = _this.tempPath.substr(9)
                        }
                        console.log(_this.addSponForm)
                        if(this.uploadSuccess){
                            axios.post('/spon/AddSpon',_this.addSponForm).then(function (resp) {
                                if(resp.data.code === "200"){
                                    _this.dialogFormVisible = false
                                    _this.isUploaded = false
                                    _this.tempPath='sponIcon/16christine-zhu-1460573-unsplash.jpg'
                                    let curPage = _this.currentPage
                                    if(_this.isLast && _this.tableData.length === _this.pageSize){
                                        curPage += 1;
                                    }
                                    _this.page(curPage,2)
                                    _this.$message({
                                        message:resp.data.msg,
                                        type:'success'
                                    })
                                }else{
                                    _this.$message({
                                        message:resp.data.msg,
                                        type:'error'
                                    })
                                }

                            })
                        }else{
                            _this.$message({
                                message:"上传失败",
                                type:'error'
                            })
                            console.log(_this.$refs['upload'])
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            getNewAllItem(data){
                this.tableData = data.records;
                this.pageSize =data.size
                this.total = data.total
                this.currentPage = data.current
            }
        },
        created(){
            const _this = this
            axios.post("/spon/page?pageNo=0&pageSize=2"+"&"+this.ruleForm.select+"="+this.ruleForm.content).then(function(resp){
                _this.tableData = resp.data.records
                for(let i=0; i<resp.data.records.length;i++){
                    _this.tableData[i].logoUrl= axios.defaults.baseURL+'sponIcon/'+_this.tableData[i].logoUrl
                }
                _this.pageSize =resp.data.size
                _this.total = resp.data.total
                _this.currentPage = 0
            })
        }
    }
</script>

<style scoped>
    .el-mian{
        width: 100%;
        height: auto;
    }
    .el-header{
        width: 100%;
        height: 50px;
    }
    .el-select > .el-input {
        width: 100px;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #000;
    }
    .addInfo{
        display: inline-flex;
        width: 162px;
        height: 157px;
        background-color: #fff;
        /*border: 2px solid #000;*/
        border-radius: 6px;
        color: #000;
        position: relative;
        top: -35px;
    }
    .addSponFormIcon{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 3px solid #000;
        cursor: pointer;
        opacity: .8;
    }
    #addIcon{
        position: relative;
        width: 50px;
        height: 50px;
        left: 50%;
        top: 60%;
        transform: translate(-50%,-60%);
    }

</style>