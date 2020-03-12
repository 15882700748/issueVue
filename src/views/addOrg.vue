<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" width="500px" class="demo-ruleForm">
        <el-form-item label="账户" prop="account">
            <el-input v-model="ruleForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
            <el-input type="password" v-model="ruleForm.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
            <el-input v-model="ruleForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="logo" prop="logoUrl">
            <el-upload
                    class="avatar-uploader"
                    action="http://localhost:8181/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="机构描述" prop="orgDesc">
            <el-input v-model="ruleForm.orgDesc"></el-input>
        </el-form-item>
        <el-form-item label="网站" prop="webSite">
            <el-input v-model="ruleForm.webSite"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
<script>

    export default {
        name: "addOrg",
        data() {
            var validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (this.ruleForm.confirmPassword !== '') {
                        this.$refs.ruleForm.validateField('confirmPassword')
                    }
                    callback();
                }
            }
            var validateConfirmPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
            return {
                imageUrl: '',
                ruleForm: {
                    name: '',
                    account: '',
                    password: '',
                    confirmPassword: '',
                    tel: '',
                    email: [],
                    logoUrl: '',
                    orgDesc: '',
                    webSite: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    account: [
                        {required: true, message: '请输入账户', trigger: 'change'}
                    ],
                    password: [
                        {validator: validatePassword, trigger: 'blur'}
                    ],
                    confirmPassword: [
                        {validator: validateConfirmPassword, trigger: 'blur'}
                    ],
                    tel: [
                        {required: true, message: '请输入电话', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ],
                    logoUrl: [
                        {required: true, message: '请输入地址', trigger: 'blur'}
                    ],
                    orgDesc: [
                        {required: true, message: '请填写描述', trigger: 'blur'}
                    ],
                    webSite: [
                        {required: true, message: '请填写网站', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                this.ruleForm.logoUrl = res.filePath
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
            submitForm(formName) {
                const _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = _this.$refs[formName].model;
                        console.log(data)
                        axios.post('/addOrg', data).then(res => {
                            _this.$refs[formName].resetFields();
                            _this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            _this.$router.push('/org')
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>