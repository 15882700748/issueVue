<template>
    <div>
        <div id="registerBackground">
            <el-row>
                <el-col :span="12" :offset="9"><h1>注册</h1></el-col>
            </el-row>
        </div>
        <div >
            <el-form :label-position="labelPosition" status-icon="true"  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px"   class="demo-ruleForm">
                <el-form-item  prop="account">
                    <el-input v-model="ruleForm.account" type="text" placeholder="账户" clearable></el-input>
                </el-form-item>
                <el-form-item  prop="password">
                    <el-input type="password" v-model="ruleForm.password" placeholder="密码" show-password clearable></el-input>
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <el-input type="password" v-model="ruleForm.confirmPassword" placeholder="密码确认" show-password clearable></el-input>
                </el-form-item>
                <el-form-item  prop="tel">
                    <el-input v-model="ruleForm.tel" type="tel" placeholder="电话" clearable></el-input>
                </el-form-item>
                <el-form-item  prop="email">
                    <el-input v-model="ruleForm.email" placeholder="邮箱" clearable></el-input>
                </el-form-item>
                <el-form-item  prop="code">
                    <el-input v-model="ruleForm.code" placeholder="验证码" clearable></el-input>
                </el-form-item>
                <el-form-item  prop="img">
                    <el-row>
                        <el-col :span="12" :offset="8" style="position: relative;top: 10px;">
                            <img id="imgIdentifyingCode" style="height:40px; width: 100px; cursor: pointer;" alt="点击更换"
                                 title="点击更换" :src="identifyCodeSrc" @click="getIdentifyingCode(true)"/>
                        </el-col>
                    </el-row>

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
                        <el-col :span=8 :offset="8">
                            <span>已有帐号？</span>
                            <el-link type="primary" href="/login">请登录</el-link>
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
        name: "registerForm",
        components:{
            BackComp
        },
        data() {
            var validatePassword = (rule, value, callback) => {
                let pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else if(!pattern.test(value)) {
                    callback(new Error('请输入密码与数字6到18组合'))
                }else if(this.ruleForm.confirmPassword !== '') {
                    this.$refs.ruleForm.validateField('confirmPassword')

                }
                callback();

            }
            var validateaanConfirmPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
            var validateAccount = (rule, value, callback) => {
                const _this = this
                if(value === '' ){
                    callback(new Error('请输入账户'))
                }else {
                    axios.post('/organization/queryAccount',{'account':value}).then(function (res) {
                       if(res.data.length === 0){
                           callback()
                       }else{
                           callback(new Error("账户已存在"))
                       }
                    })
                }
            }
            var validatateEmail = (rule, value , callback) => {
                console.log(value)
                axios.post('/organization/queryEmail',{'email':value}).then(function (res) {

                    if(res.data.code === '200'){
                        callback()
                    }else{
                        callback(new Error("邮箱已存在"))
                    }
                })
            }
            return {
                labelPosition:'left',
                identifyCodeSrc:'',
                ruleForm: {
                    account: '',
                    password: '',
                    confirmPassword: '',
                    tel: '',
                    email: '',
                    code:''
                },
                rules: {
                    account: [
                        {required: true, message: '请输入账户', trigger: 'blur'},
                        {validator:validateAccount, trigger: 'change'}
                    ],
                    password: [
                        {validator: validatePassword, trigger: 'blur'}
                    ],
                    confirmPassword: [
                        {validator: validateaanConfirmPassword, trigger: 'blur'}
                    ],
                    tel: [
                        {required: true, message: '请输入电话', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']},
                        {validator: validatateEmail, trigger: 'blur'}
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
                        console.log(data)
                        axios.post('/organization/addOrg',data).then(resp => {
                            let res = resp.data
                            console.log(res)
                            if(res.code === '200'){
                                _this.$message({
                                    message: '注册成功',
                                    type: 'success'
                                });
                                _this.$router.push('/index')
                            }else{
                                _this.$message({
                                    message: res.msg,
                                    type: 'error'
                                });
                                _this.ruleForm.code = ''
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
            }
        },
        created(){
            this.identifyCodeSrc = axios.defaults.baseURL+"/getVerify"
        }
    }
</script>

<style scoped>
    #registerBackground{
        position: absolute;
        left: 0;
        top: -15%;
        width: 400px;
        height: 500px;
    }
    .el-button{
        width: 400px;
        margin-top: 10px;
    }
</style>