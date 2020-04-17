<template>
    <el-container style="box-shadow:0px 0px 20px 0 black;height: 100hv">
        <el-header style="background-color:#545c64;color: #fff; margin-bottom: 40px">
            <el-row>
                <el-col :span="1" >
                    <i class="el-icon-back" @click="backIssue"></i>
                </el-col>
                <el-col :span="8" >
                    查看:<strong>{{issueTitle}}</strong>会议文章
                </el-col>
                <el-col :span="8" :offset="5" style="max-width: 400px;position: relative;top: 10px;">
                    <el-form :model="articleForm" :rules="articleFormRule" label-position="top" ref="articleForm" label-width="55px" width="400px"  class="demo-ruleForm">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item  prop="content">
                                    <el-input placeholder="请输入内容" clearable v-model="articleForm.content" style="background-color: #545c64;color: white" >
                                        <el-select v-model="articleForm.select" style="width: 100px"  slot="prepend" placeholder="请选择" >
                                            <el-option label="标题" value="title"></el-option>
                                            <el-option label="内容" value="content"></el-option>
                                        </el-select>
                                        <el-button slot="append" icon="el-icon-search "  @click="searchArticle('articleForm')">搜索</el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
                <el-col :span="1"  :offset="1">
                    <i class="el-icon-delete-solid" @click="deleteArticles"></i>
                </el-col>
            </el-row>

        </el-header>
        <el-mian>
            <div>
                <el-table align="center" size="mini" :data="master_user.data" border style="width: 90%;margin: 0 auto;height: 440px" highlight-current-row ref="articleTable" tooltip-effect="dark"
                          @selection-change="handleSelectionChange">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column v-for="(v,i) in master_user.columns" :prop="v.field" :label="v.title" align="center">
                        <template slot-scope="scope">
                                <span v-if="scope.row.isSet">
                                    <el-date-picker v-if="v.field === 'realseTime' || v.field === 'holdupTime'"
                                                    v-model="master_user.sel[v.field]" :disabled="v.field === 'realseTime'"
                                                    type="datetime"
                                                    placeholder="选择日期时间"
                                                    align="center"
                                                    :picker-options="pickerOptions" :editable="false"></el-date-picker>
                                    <el-button type="text" v-else-if="v.field === 'content'">
                                        {{scope.row[v.field]}}
                                        <i class="el-icon-edit" v-if="master_user.isUpdate" @click="showDialogTinymecVisible(scope.row,scope.row.articleId,'update')"></i>
                                        <i class="el-icon-edit" v-else @click="showDialogTinymecVisible(scope.row,scope.row.articleId,'add')"></i>
                                        <el-dialog  title="新增赞助商" :visible.sync="dialogTinymecVisible" :close-on-click-modal="!dialogTinymecVisible"
                                                    center  @closed="HandleOnClose(scope.row)">
                                            <editor  v-model='master_user.sel[v.field]' :init='init'></editor>
                                            <span slot="footer" class="dialog-footer">
                                                <el-button @click="dialogTinymecVisible = false">取 消</el-button>
                                                <el-button type="primary" @click="saveArticleContent(scope.row,scope.$index)">保存</el-button>
                                            </span>
                                        </el-dialog>
                                    </el-button>
                                    <el-input v-else size="mini" placeholder="请输入内容" v-model="master_user.sel[v.field]"></el-input>
                                </span>
                            <span v-else-if="v.field !== 'content'">{{scope.row[v.field]}}</span>
                            <el-popover v-else
                                        :enterable="false"
                                        width="100%"
                                        trigger="hover" placement="top" :visible-arrow="true"
                                        @show="getCeilContent(scope.row.articleId)">
                                <div>
                                    <strong>标题：</strong>{{hoverTitle}}
                                    <p><strong>内容：</strong><span v-html="hoverContent"></span></p>
                                </div>
                                <sapn slot="reference">
                                    <span v-html="scope.row[v.field]"></span>
                                </sapn>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <span class="el-tag el-tag--primary el-tag--mini" style="cursor: pointer; " @click="pwdChange(scope.row,scope.$index,true)">
                                {{scope.row.isSet?'保存':"修改"}}
                            </span>
                            <span v-if="!scope.row.isSet " class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;" @click="deleteArticleConfirm(scope.row.articleId)">
                                删除
                            </span>
                            <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,false)">
                                取消
                            </span>
                        </template>
                    </el-table-column>
                    <div slot="append" style="text-align: center;height: 50px;line-height: 50px">
                        <div class="el-table-add-row" style="width: 99.2%;" @click="addMasterUser">
                            <el-tooltip class="item" effect="dark" content="新增文章" placement="top-start">
                                <span>+ 添加</span>
                            </el-tooltip>
                        </div>
                    </div>
                </el-table>

            </div>
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    @current-change = "page" style="position: relative;bottom:-10px;height: 50px;line-height: 50px">
            </el-pagination>
        </el-mian>
    </el-container>
</template>

<script>

    import tinymce from 'tinymce/tinymce'
    import 'tinymce/themes/modern/theme'
    import Editor from '@tinymce/tinymce-vue'
    import 'tinymce/plugins/image'
    import 'tinymce/plugins/link'
    import 'tinymce/plugins/code'
    import 'tinymce/plugins/table'
    import 'tinymce/plugins/lists'
    import 'tinymce/plugins/contextmenu'
    import 'tinymce/plugins/wordcount'
    import 'tinymce/plugins/colorpicker'
    import 'tinymce/plugins/textcolor'

    export default {
        name: "ArticleManage",
        mounted () {
            tinymce.init({})
        },
        beforeRouteEnter(to, form, next) {
            let issueId = window.sessionStorage.getItem("issueId");
            console.log(issueId)
            if(issueId === undefined || issueId === null){
                next('/issueManage')
            }else{
                next()
            }

        },
        beforeRouteLeave(to, form, next) {
            console.log("leave")
            window.sessionStorage.removeItem("issueId")
            next()
        },
        components: {Editor},
        data(){
            return {
                master_user: {
                    sel: null,//选中行
                    isUpdate:true,
                    columns: [
                        { field: "realseTime", title: "创建时间" },
                        { field: "title", title: "标题" },
                        { field: "content", title: "内容"},
                        { field: "holdupTime", title: "举办时间"}
                    ],
                    data: [],
                },
                articleForm : {
                  select : 'title',
                  content : ''
                },
                articleFormRule:{},
                addArticleForm:{
                    title:'',
                    content:'',
                    holdupTime:''
                },
                addArticleFormRule:{
                    title:[{required:true,message:'请输入文章标题',trigger:'onSubmit'}],
                    content:[{required:true,message:'请输入文章内容',trigger:'onSubmit'}],
                    holdupTime:[{required:true,message:'请输入发行日期',trigger:'onSubmit'}]
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                init: {
                    language_url: 'tinymce/zh_CN.js',
                    language: 'zh_CN',
                    skin_url: 'tinymce/skins/lightgray',
                    height: 300,
                    plugins: 'link lists image imagetool code table colorpicker textcolor wordcount contextmenu paste ',
                    toolbar:
                        'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
                    branding: false,
                    images_upload_handler:  (blobInfo, success, failure) => {
                        let formData = new FormData()
                        formData.append('fileName',blobInfo.blob())
                        axios.post(
                            '/uploadArticleImg',
                            formData,
                            {headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'}}
                        ).then(function(res){

                            success(axios.defaults.baseURL +'article/'+ res.data.filePath)
                        })

                    }
                },
                tinymceHtml: '请输入内容',
                total:0,
                totalPage:0,
                currentPage:0,
                pageSize:0,
                multipleSelection:'',
                hoverTitle:'',
                hoverContent:'',
                issueTitle:'',
                articleDialogFormVisible:false,
                dialogTinymecVisible:false,
                isEdited:false
            }
        },
        methods: {
            searchArticle(formName){
                this.$refs[formName].validate((valid) => {
                    const _this = this;
                    // let formData = {}
                    // formData[this.ruleForm.select] = this.ruleForm.content
                    this.page(0);
                    _this.$message({
                        message:'搜索成功',
                        type:'success'
                    })
                });
            },
            backIssue(){
              this.$router.push("/issueManage")
            },
            getCeilContent(id){
                const  _this = this
                axios.post('/article/getOneArticle',{"articleId":id}).then(function (resp) {
                    let d = resp.data.content
                    let len = _this.getLength(d)
                    if(len > 100){
                        d = d.substr(0,200)
                    }
                    _this.hoverContent = d
                    _this.hoverTitle = resp.data.title
                })
            },
            handleSelectionChange(rows){
                this.multipleSelection = rows;
            },
            getLength(str){

                let realLength = 0, len = str.length, charCode = -1;
                for (let i = 0; i < len; i++) {
                    charCode = str.charCodeAt(i);
                    if (charCode >= 0 && charCode <= 128) realLength += 1;
                    else realLength += 2;
                }
                return realLength;
            },
            subContent(str,len=5){
                str = str.replace(/&nbsp;/ig,'')
                let res  = str.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi,'').replace(/<[^>]+?>/g,'').replace(/\s+/g,' ').replace(/ /g,' ').replace(/>/g,' ')
                let size = this.getLength(res)
                if(size >= len){
                 res = res.substr(0,len)+'.....';
                }
                return res;
            },
            getRowKeys(row){
                return row.articleId
            },
            isLast(){
              if(this.total < this.pageSize && this.totalPage === this.currentPage){
                  return true
              }
              return false;
            },
            timeFormat(time,index,length){
                let dateee = new Date(time).toJSON();
                let date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
                date = date.toString()
                return date.substr(index,length);
            },
            page(pageNo,pageSize=10){
                const  _this = this
                let id = window.sessionStorage.getItem("issueId")
                axios.post("/article/page?pageNo="+pageNo+"&pageSize="+pageSize+"&issueId="+id+'&'+this.articleForm.select+"="+this.articleForm.content).then(function (resp) {
                    _this.master_user.data = resp.data.records
                   for(let i=0; i<_this.master_user.data.length;i++){
                       _this.master_user.data[i].isSet = false;
                       _this.master_user.data[i].realseTime = _this.timeFormat(_this.master_user.data[i].realseTime,0,16)
                       _this.master_user.data[i].holdupTime = _this.timeFormat(_this.master_user.data[i].holdupTime,0,11)
                       _this.master_user.data[i].content = _this.subContent(_this.master_user.data[i].content)
                   }
                    _this.total = resp.data.total
                    _this.totalPage = resp.data.pages
                    _this.currentPage = resp.data.current
                    _this.pageSize = resp.data.size
                })
            },
            deleteArticleConfirm(id){
                const  _this = this
                this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    _this.deleteArticle(id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },
            deleteArticle(id){
                const  _this = this
                axios.post("/article/deleteArticle",{"articleId":id}).then(function (resp) {
                    let currPage= _this.currentPage
                    if(_this.totalPage === _this.currentPage && _this.master_user.data.length === 1){
                        currPage -= 1
                    }
                    currPage = currPage >=0 ? currPage : 0
                    _this.page(currPage)
                })
            },
            deleteArticles(){
                let data = this.multipleSelection
                if(data.length === 0 ){
                    this.$message({
                        message:'请选中数据',
                        type:'warning'
                    })
                }else{

                    this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        for(let i=0;i<data.length; i++){
                            this.deleteArticle(data[i].articleId)
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            addMasterUser() {//添加数据
                for (let i of this.master_user.data) {
                    if (i.isSet) return this.$message.warning("请先保存当前编辑项");
                }
                let j = { "realseTime": "", "title": "", "content": "", "holdupTime": "", "isSet": true, "_temporary": true };
                this.master_user.data.push(j);//添加到
                this.master_user.isUpdate = false
                this.master_user.sel = JSON.parse(JSON.stringify(j));
            },
            pwdChange(row, index, cg) {
                const  _this =this
                //点击修改 判断是否已经保存所有操作
                for (let i of this.master_user.data) {
                    if (i.isSet && i.articleId !== row.articleId) {
                        this.$message.warning("请先保存当前编辑项");
                        return false;
                    }
                }
                //是否是取消操作
                if (!cg) {
                    if (!this.master_user.isUpdate) {//添加取消
                        this.master_user.data.splice(index,1)
                        this.page(this.currentPage)
                        return ;
                    }else{
                        row.isSet = !row.isSet
                        this.$set(this.master_user.data,index,row)
                        return ;
                    }

                }
                //提交数据
                if (row.isSet) {
                    this.isEdited = false
                    if(this.master_user.isUpdate){//更新
                        this.master_user.sel.issueId = window.sessionStorage.getItem("issueId")
                        let data = this.master_user.sel
                        if(data.title === '' || data.holdupTime === '' || data.content === ''){
                            this.$message.warning("内容不能为空")
                            return ;
                        }
                        axios.post('/article/updateArticle',data).then(function (resp) {
                            if(resp.data.code === '200'){
                                _this.$message({
                                    type: 'success',
                                    message: resp.data.msg
                                });
                                row.isSet = false;
                                _this.master_user.update =null
                                _this.page(_this.currentPage)
                            }else{
                                _this.$message({
                                    type: 'warning',
                                    message: resp.data.msg
                                });
                            }
                        })
                    }else{
                        this.master_user.sel.issueId = window.sessionStorage.getItem("issueId")
                        let data =JSON.parse(JSON.stringify(this.master_user.sel))
                        console.log(data)
                        if(data.title === '' || data.holdupTime === '' || data.content === ''){
                            this.$message.warning("内容不能为空")
                            return ;
                        }
                        axios.post('/article/addArticle',data).then(function (resp) {
                            if(resp.data.code === '200'){
                                _this.$message({
                                    type: 'success',
                                    message: resp.data.msg
                                });
                                let curPage = _this.currentPage
                                console.log(_this.total)
                                console.log(_this.pageSize)
                                if(_this.master_user.data.length > _this.pageSize){
                                    curPage += 1
                                }

                                _this.master_user.isUpdate = true
                                row.isSet = false;
                                _this.page(curPage)

                            }else{
                                _this.$message({
                                    type: 'warning',
                                    message: resp.data.msg
                                });
                            }
                        })
                    }

                } else {
                    this.master_user.sel = JSON.parse(JSON.stringify(row));
                    this.master_user.isUpdate = true
                    row.isSet= true;
                }
                this.$set(this.master_user.data,index,row)
                return ;
            },
            showDialogTinymecVisible(row,id,status){
                const  _this =this

                if(status === 'add'){
                    _this.dialogTinymecVisible=true
                    this.master_user.sel.contetn = row.content
                }else{
                    _this.dialogTinymecVisible=true
                    if(this.isEdited){//编辑过了
                        this.master_user.sel.contetn = row.content
                    }else{
                        this.master_user.sel.contetn = row.content
                        axios.post('/article/getOneArticle',{"articleId":id}).then(function (resp) {
                            _this.master_user.sel.content = resp.data.content
                            _this.dialogTinymecVisible=true
                        })
                    }
                }


            },
            HandleOnClose(row){

            },
            saveArticleContent(row,index){
                if(this.master_user.isUpdate){
                    this.isEdited = true
                }else {
                    this.isEdited = false
                }
                row.content = this.master_user.sel.content
                row.content = this.subContent(row.content)
                this.dialogTinymecVisible = false
                this.$set(this.master_user.data,index,row)
            }
        },
        created(){
            this.issueTitle = window.sessionStorage.getItem("issueTitle")
            this.page(0)
        }
    }
</script>

<style scoped>
    .el-table-add-row {
        margin-top: 10px;
        width: 100%;
        height: 34px;
        border: 1px dashed #c1c1cd;
        border-radius: 3px;
        cursor: pointer;
        justify-content: center;
        display: flex;
        line-height: 34px;
    }
