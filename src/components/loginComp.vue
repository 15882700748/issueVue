<template>
    <div>
        <div id="loginBackground">
            <el-row>
                <el-col :span="12" :offset="9"><h1>登录</h1></el-col>
            </el-row>
        </div>
        <div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" width="400px"  class="demo-ruleForm">
                <el-form-item  prop="account">
                    <el-input v-model="ruleForm.account" type="text" placeholder="账户" clearable></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password" placeholder="密码" clearable show-password></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input v-model="ruleForm.code" placeholder="验证码"></el-input>
                </el-form-item>
                <el-form-item  prop="img">
                    <div class="divIdentifyingCode" >
                        <img id="imgIdentifyingCode" style="height:40px; width: 100px; cursor: pointer;" alt="点击更换"
                             title="点击更换" :src="identifyCodeSrc" @click="getIdentifyingCode(true)"/>

                        <el-link type="primary" class="forgetPassword" @click="forgetPassword">忘记密码</el-link>
                    </div>
                </el-form-item>
                <el-form-item style="position:relative;top: -10px">
                    <el-row>
                        <el-col >
                            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                        </el-col>
                        <el-col >
                            <el-button  @click="resetForm('ruleForm')">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :span="10" :offset="6">
                            <span>没有有帐号？点击</span>
                            <el-link type="primary" href="/register">注册</el-link>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
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
                        axios.post('/organization/login',data).then(function (resp) {
                            let res = resp.data
                            if(res.code === '200'){
                                _this.$message({
                                    message:res.msg,
                                    type: "success"
                                })
                                window.sessionStorage.setItem('token',res.token)
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
                                // _this.getIdentifyingCode(true)
                                _this.ruleForm.code = ""

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
        top: -20%;
        width: 350px;
        height: 450px;
    }
    .forgetPassword{
        position: relative;
        left: 141px;

    }
    .el-button{
        width: 350px;
        margin-top: 10px;
    }
</style>