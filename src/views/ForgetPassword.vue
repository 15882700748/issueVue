<template>
    <div >
        <el-row v-if="loading"  id="loading">
            <el-col :span="24">
                <div class="loading_container" >
                    <div class='ring blue'></div>
                    <div id="loading_content">
                        <span>加载中，请稍后</span>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div v-if="show"  id="ForgetPassword" style="border:1px black solid; box-shadow:0px 0px 20px 0 black;">
            <template >
                <el-row style="background-color:#545c64;color: #fff; margin-bottom: 40px">
                    <el-col >
                        <h1 class="el-col-push-7">密码找回</h1>
                    </el-col>
                </el-row>
                <el-row >
                    <el-col style="width: 100%">
                        <el-form :model="ruleForm" :rules="rules" label-position="top" ref="ruleForm" label-width="55px" width="400px" id="ruleForm" class="demo-ruleForm">
                            <el-form-item label="邮箱" prop="email">
                                <el-input style="width: 80%" v-model="ruleForm.email" type="text"></el-input>
                            </el-form-item>
                            <el-form-item >
                                <el-button style="width: 80%" type="primary" @click="submitForm('ruleForm')">找回密码</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-row>
                                    <el-col :span="8" :offset="8">
                                        <el-link type="primary"  href="/login">返回登录</el-link>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </template>
        </div>
    </div>
</template>

<script>
    import BackComp from  '../components/BackComp'
    export default {
        name: "ForgetPassword",
        components:{
            BackComp
        },
        data(){
            return{
                loading:false,
                show:true,
                ruleForm:{
                    email:''
                },
                rules:{
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']},
                    ]
                }
            }
        },
        methods:{
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    const _this = this;
                    if (valid) {
                        let data = _this.$refs[formName].model;
                        _this.show = false
                        _this.loading = true
                        axios.post('/organization/forgetPassword',{'email':_this.ruleForm.email}).then(function (resp) {
                            _this.loading = false
                            _this.show = true
                            if(resp.data.code === '200'){
                                _this.$message({
                                    message:resp.data.msg,
                                    type:'success'
                                })
                                _this.$router.push({
                                    path:'/redirectPage',
                                    query:{
                                        pageName:'https://mail.163.com/'
                                    }
                                })
                            }else{
                                _this.$message({
                                    message:resp.data.msg,
                                    type:'warning'
                                })
                                _this.ruleForm.code = ''
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .el-button{
        width: 300px;
    }
    #ForgetPassword{
        width: 300px;
        height: 400px;
        left: 50%;
        top: 40%;
        transform: translate(-50%,-40%);
        position: absolute;
    }
    @-webkit-keyframes rotate {
        from { -webkit-transform: rotate(0deg) }
        to { -webkit-transform: rotate(360deg) } }
    @-moz-keyframes rotate {
        from { -moz-transform: rotate(0deg) }
        to { -moz-transform: rotate(360deg) } }
    @-o-keyframes rotate {
        from { -o-transform: rotate(0deg) }
        to { -o-transform: rotate(360deg) } }
    @keyframes rotate {
        from { transform: rotate(0deg) }
        to { transform: rotate(360deg) } }

    @-webkit-keyframes fade {
        from { opacity: 1 }
        50% { opacity: 0 }
        to { opacity: 1 } }
    @-moz-keyframes fade {
        from { opacity: 1 }
        50% { opacity: 0 }
        to { opacity: 1 } }
    @-o-keyframes fade {
        from { opacity: 1 }
        50% { opacity: 0 }
        to { opacity: 1 } }
    @keyframes fade {
        from { opacity: 1 }
        50% { opacity: 0 }
        to { opacity: 1 } }

    #loading {
        display: block;
        width: 150px;
        height: 150px;
        /* PRESENTATIONAL PURPOSES */
        margin: auto;
        position: absolute;
        top: 45%; left: 50%;
        transform: translate(-50%,-45%);
        /**/
        cursor: pointer;
        -webkit-user-select: none;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        -webkit-box-shadow: 0 0 0 6px #222,
        0 0 6px 10px #444;
        -moz-box-shadow: 0 0 0 6px #222,
        0 0 6px 10px #444;
        box-shadow: 0 0 0 6px #222,
        0 0 6px 10px #444
    }

    /* TEXT */
    #loading_content {
        background: #222;
        background: -webkit-linear-gradient(#222,#111);
        background: -moz-linear-gradient(#222,#111);
        background: -o-linear-gradient(#222,#111);
        background: linear-gradient(#222,#111);
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        text-align: center;
        font: normal normal normal 12px/140px
        'Electrolize', Helvetica, Arial, sans-serif;
        color: #fff;
    }

    #loading_content span {
        vertical-align: middle;
        -webkit-animation: fade 1s linear infinite;
        -moz-animation: fade 1s linear infinite;
        -o-animation: fade 1s linear infinite;
        animation: fade 1s linear infinite
    }

    /* SPINNING GRADIENT */
    .ring {
        margin: 0 auto;
        border-radius: 110px;
        padding: 10px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        -webkit-animation: rotate 1s linear infinite;
        -moz-animation: rotate 1s linear infinite;
        -o-animation: rotate 1s linear infinite;
        animation: rotate 1s linear infinite
    }

    /* COLORS */
    .green {
        background: -webkit-linear-gradient(#bfff00,transparent,#bfff00);
        background: -moz-linear-gradient(#bfff00,transparent,#bfff00);
        background: -o-linear-gradient(#bfff00,transparent,#bfff00);
        background: linear-gradient(#bfff00,transparent,#bfff00)
    }

    .blue {
        background: -webkit-linear-gradient(#3cf,transparent,#3cf);
        background: -moz-linear-gradient(#3cf,transparent,#3cf);
        background: -o-linear-gradient(#3cf,transparent,#3cf);
        background: linear-gradient(#3cf,transparent,#3cf)
    }

    .red {
        background: -webkit-linear-gradient(#cd5c5c,transparent,#cd5c5c);
        background: -moz-linear-gradient(#cd5c5c,transparent,#cd5c5c);
        background: -o-linear-gradient(#cd5c5c,transparent,#cd5c5c);
        background: linear-gradient(#cd5c5c,transparent,#cd5c5c)
    }

    .purple {
        background: -webkit-linear-gradient(#e166e1,transparent,#e166e1);
        background: -moz-linear-gradient(#e166e1,transparent,#e166e1);
        background: -o-linear-gradient(#e166e1,transparent,#e166e1);
        background: linear-gradient(#e166e1,transparent,#e166e1)
    }
    .el-button{

    }

</style>