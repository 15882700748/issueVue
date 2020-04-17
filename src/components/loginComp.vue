<template>
    <div>
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
        <div v-else style="box-shadow:0px 0px 10px 0 black;height:600px;width: 350px">
            <el-row style="background-color:#545c64;color: #fff; margin-bottom: 20px">
                <el-col :span="12" :offset="6"><h1>登录</h1></el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0"
                             style="border: 1px #545c64 solid;width: 300px;margin: 0 auto;
                                box-shadow:inset 0 0 4px 0 #aaa,0 0 3px 0 #aaa;"
                             class="demo-ruleForm">
                        <el-form-item  prop="account">
                            <el-input style="width: 80%;margin-top: 20px"  v-model="ruleForm.account" type="text" placeholder="账户" clearable></el-input>
                        </el-form-item>
                        <el-form-item  prop="password">
                            <el-input style="width: 80%" type="password" v-model="ruleForm.password" placeholder="密码" clearable show-password></el-input>
                        </el-form-item>
                        <el-form-item  prop="code">
                            <el-input style="width: 80%" v-model="ruleForm.code" placeholder="验证码"></el-input>
                        </el-form-item>
                        <el-form-item   prop="img">
                            <div class="divIdentifyingCode" >
                                <img id="imgIdentifyingCode" style="height:40px; width: 100px; cursor: pointer;" alt="点击更换"
                                     title="点击更换" :src="identifyCodeSrc" @click="getIdentifyingCode(true)"/>

                                <el-link type="primary" class="forgetPassword" @click="forgetPassword">忘记密码</el-link>
                            </div>
                        </el-form-item>
                        <el-form-item  style="position:relative;top: -10px">
                            <el-row>
                                <el-col >
                                    <el-button style="width: 80%" type="primary" @click="submitForm('ruleForm')">登录</el-button>
                                </el-col>
                                <el-col >
                                    <el-button style="width: 80%" @click="resetForm('ruleForm')">重置</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                            <el-row>
                                <el-col :span="12" :offset="6">
                                    <span>没有有帐号？点击</span>
                                    <el-link type="primary" href="/register">注册</el-link>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>

</template>

<script>
    import BackComp from  '../components/BackComp'
    export default {
        name: "loginComp",
        components:{
          BackComp
        },
        data() {
            var validatePassword = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    callback(new Error('请输入密码'))
                } else {
                    callback()
                }

            }
            var validateAccount = (rule, value, callback) => {
                const _this = this
                if(value === '' || value === undefined ){
                    callback(new Error('请输入账户'))
                }else {
                    callback()
                }
            }
            return {
                identifyCodeSrc:axios.defaults.baseURL+"/getVerify",
                loading:false,
                ruleForm: {
                    account:'',
                    password:'',
                    code:'',
                    type:undefined
                },
                rules: {
                    account: [
                        {validator:validateAccount, trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePassword, trigger: 'blur'}
                    ],
                    code :[
                        {required: true, message: '请填写验证', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                const _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = _this.$refs[formName].model;
                        let d = {'account':data.account,'password':data.password,'code':data.code}
                        _this.loading = true
                        axios.post('/organization/login',data).then(function (resp) {
                            let res = resp.data
                            if(res.code === '200'){
                                _this.$message({
                                    message:res.msg,
                                    type: "success"
                                })
                                _this.loading = false
                                window.sessionStorage.setItem('token',res.token)
                                window.sessionStorage.setItem('orgName',res.orgName)
                                _this.$router.push({
                                    path:'/index',
                                    query:{
                                        orgName:res.orgName
                                    }
                                })

                            }else{
                                _this.$message({
                                    message:res.msg,
                                    type: "warning"
                                })
                                _this.loading = false
                                // _this.getIdentifyingCode(true)
                                if(res.msg === '验证码不正确'){
                                    _this.ruleForm.code = ""
                                }else{
                                    _this.ruleForm.password = ""
                                }


                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            getIdentifyingCode: function (bRefresh) {
                let identifyCodeSrc = axios.defaults.baseURL+"getVerify";
                if (bRefresh) {
                    identifyCodeSrc =  axios.defaults.baseURL+"/getVerify?" + Math.random();
                }
                let objs = document.getElementById("imgIdentifyingCode");
                objs.src = identifyCodeSrc;
            },
            forgetPassword(){
                this.$router.push('/forgetPassword')
            }
        },
        created(){
            this.identifyCodeSrc = axios.defaults.baseURL+"/getVerify"
            console.log(this.identifyCodeSrc)
        }
    }
</script>

<style scoped>
    #loginBackground{
        position: absolute;
        left: 0;
        top: 0;
        width: 350px;
        height: 450px;
    }
    .forgetPassword{
        position: relative;
        left: 40px;

    }
    .el-button{
        width: 350px;
        margin-top: 10px;
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
</style>