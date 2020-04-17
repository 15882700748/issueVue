<template>
    <el-container style="box-shadow:0px 0px 20px 0 black;height: 100hv">
        <el-header style="background-color:#545c64;color: #fff; margin-bottom: 40px">
            <el-row>
                <el-col :span="1" >
                    <i class="el-icon-back" @click="backIssue"></i>
                </el-col>
                <el-col :span="8" :offset="6">
                    管理:<strong>{{issueTitle}}</strong>会议栏目
                </el-col>
                <el-col :span="1"  :offset="8">
                    <i class="el-icon-delete-solid" @click="deleteColumns" ></i>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <div>
                <el-table size="mini" :data="columnData.data" border style="width: 90%;margin: 0 auto;height: 440px" highlight-current-row ref="articleTable" tooltip-effect="dark"
                          @selection-change=" handleColumSelectionChange">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column v-for="(v,i) in columnData.columns" :prop="v.field" :label="v.title" align="center" >
                        <template slot-scope="scope">
                                <span v-if="v.field !== 'con'">
                                    {{scope.row[v.field]}}
                                </span>
                            <el-popover v-else
                                        placement="top-start"
                                        width="100%"
                                        trigger="hover"
                                        @show = initPopoverContent(scope.row) @close="onClosePopoverContent">
                                <strong>栏目名称：</strong>
                                <span>{{scope.row.name}}</span>
                                <el-divider></el-divider>
                                <strong>栏目内容：</strong>
                                <span v-html="scope.row.content"></span>
                                <el-divider></el-divider>
                                <span slot="reference" type="primary" >{{scope.row[v.field]}}</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="el-tag el-tag--primary el-tag--mini" style="cursor: pointer; "  @click="updateColumn(scope.row)">
                                {{scope.row.isSet?'保存':"修改"}}
                            </span>
                            <span v-if="!scope.row.isSet " class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;" @click="deleteColumnConfirm(scope.row.columId)">
                                    删除
                                </span>
                            <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" >
                                    取消
                                </span>
                        </template>
                    </el-table-column>
                    <div slot="append" style="text-align: center;height: 50px;line-height: 50px;cursor: pointer;" >
                        <div class="el-table-add-row" style="width: 99.2%;" @click="showColumnDialog">
                            <el-tooltip class="item" effect="dark" content="新增栏目" placement="top-start">
                                <span>+ 添加</span>
                            </el-tooltip>
                        </div>
                        <el-dialog :top="'0'" :close-on-click-modal="false" style="width: 100%;height: 800px;" title="新增栏目"
                                   :visible.sync="dialogColumnFormVisible" @closed="addColumnHandleOnClose('addColumnForm')">
                            <el-form :model="addColumnForm" :rules="addColumnFormRule" ref="addColumnForm">
                                <el-form-item label="" prop="title" >
                                    <el-input v-model="addColumnForm.name" autocomplete="off" placeholder="栏目名称"></el-input>
                                </el-form-item>
                                <el-form-item label="" prop="content" >
                                    <kind-editor id="editor_id" height="500px" width="100%" :content.sync="addColumnForm.content"
                                                 pluginsPath="kindeditor/plugins/"
                                                 :loadStyleMode="false"
                                                 @on-content-change="onContentChange"></kind-editor>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer" >
                                <el-button @click="dialogColumnFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="submitAddColumnForm('addColumnForm')">提交</el-button>
                            </div>
                        </el-dialog>
                        <el-dialog :top="'0'" :close-on-click-modal="false" style="width: 100%;height: 800px;" title="修改栏目"
                                   :visible.sync="dialogColumnUpdateFormVisible" @closed="updateColumnHandleOnClose('updateColumnForm')">
                            <el-form :model="addColumnForm" :rules="addColumnFormRule" ref="updateColumnForm">
                                <el-form-item label="" prop="name" >
                                    <el-input v-model="addColumnForm.name" autocomplete="off" placeholder="栏目名称"></el-input>
                                </el-form-item>
                                <el-form-item label="" prop="content" >
                                    <kind-editor id="editor" height="500px" width="100%" :content.sync="editorText"
                                                 pluginsPath="kindeditor/plugins/"
                                                 :loadStyleMode="false"
                                                 @on-content-change="onContentChange"></kind-editor>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer" >
                                <el-button @click="dialogColumnUpdateFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="submitUpdateColumnForm('updateColumnForm')">提交</el-button>
                            </div>
                        </el-dialog>
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
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "ColumManage",
        beforeRouteEnter(to, form, next) {
            let issueId = window.sessionStorage.getItem("issueId");
            if(issueId === undefined || issueId === null){
                next('/issueManage')
            }else{
                next()
            }

        },
        beforeRouteLeave(to, form, next) {
            window.sessionStorage.removeItem("issueId")
            next()
        },
        data(){
            return{
                issueId:'',
                issueTitle:'',
                multipleIssueSelection:'',
                editorText:'',
                total:0,
                totalPage:0,
                currentPage:0,
                pageSize:0,
                dialogColumnFormVisible:false,
                dialogColumnUpdateFormVisible:false,
                columnData: {
                    sel: null,//选中行
                    isUpdate:true,
                    columns: [
                        { field: "name", title: "栏目名称" },
                        { field: "con", title: "内容"},
                        { field: "creatTime", title: "创建时间"}
                    ],
                    data: [],
                },
                addColumnForm:{
                    name:'',
                    content:'',
                },
                addColumnFormRule:{
                    name:[{required:true, message: '请输入栏目名称', trigger: 'onSubmit'}],
                    content:[{required:true, message: '请输入内容', trigger: 'onSubmit'}],
                },
            }
        },
        methods:{
            //tool
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
            backIssue(){
                this.$router.push("/issueManage")
            },
            timeFormat(time,index,length){
                let dateee = new Date(time).toJSON();
                let date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
                date = date.toString()
                return date.substr(index,length);
            },
            page(pageNo,pageSize=10){
                const  _this = this
                let id = this.issueId
                axios.post("/colum/queryColums?pageNo="+pageNo+"&pageSize="+pageSize+"&issueId="+id).then(function (resp) {
                    _this.columnData.data = resp.data.records
                    for(let i=0; i<_this.columnData.data.length;i++){
                        _this.columnData.data[i].isSet = false;
                        _this.columnData.data[i].creatTime = _this.timeFormat(_this.columnData.data[i].creatTime)
                        _this.columnData.data[i].con = _this.subContent(_this.columnData.data[i].content)
                    }
                    _this.total = resp.data.total
                    _this.totalPage = resp.data.pages
                    _this.currentPage = resp.data.current
                    _this.pageSize = resp.data.size
                })
            },
            //table
            handleColumSelectionChange(rows){
                this.multipleIssueSelection = rows;
            },
            //dialog
                //add
            showColumnDialog(){
                this.dialogColumnFormVisible = true
            },
            addColumnHandleOnClose(formName){
                let _this = this
                this.$refs[formName].resetFields();
                this.addColumnForm = {}
                let curPage = _this.currentPage
                if(_this.currentPage === _this.totalPage && _this.columnData.data.length === _this.pageSize){
                    curPage += 1;
                }
                _this.page(curPage)
            },
            submitAddColumnForm(formName){
                this.$refs[formName].validate((valid) => {
                    const _this = this;
                    if (valid) {
                        this.addColumnForm.issueId = this.issueId
                        axios.post('/colum/addColum',_this.addColumnForm).then(function (resp) {
                            if(resp.data.code === "200"){
                                _this.dialogColumnFormVisible = false
                                let curPage = _this.currentPage
                                if(_this.currentPage === _this.totalPage && _this.columnData.data.length === _this.pageSize){
                                    curPage += 1;
                                }
                                _this.page(curPage)
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
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
                //update
            updateColumn(row){
                this.addColumnForm = row
                this.editorText = row.content
                this.dialogColumnUpdateFormVisible = true
            },
            updateColumnHandleOnClose(formName){
                let _this = this
                this.$refs[formName].resetFields();
                this.addColumnForm = {}
                this.editorText = ''
                let curPage = _this.currentPage
                if(_this.currentPage === _this.totalPage && _this.columnData.data.length === _this.pageSize){
                    curPage += 1;
                }
                _this.page(curPage)
            },
            submitUpdateColumnForm(formName){
                this.$refs[formName].validate((valid) => {
                    const _this = this;
                    if (valid) {
                        axios.post('/colum/updateColum',_this.addColumnForm).then(function (resp) {
                            if(resp.data.code === "200"){
                                _this.dialogColumnUpdateFormVisible = false
                                let curPage = _this.currentPage
                                if(_this.currentPage === _this.totalPage&& _this.columnData.data.length === _this.pageSize){
                                    curPage += 1;
                                }
                                _this.page(curPage)
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
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //delete
            deleteColumn(id){
                const  _this = this
                axios.post("/colum/deleteColum",{"columId":id}).then(function (resp) {
                    let currPage= _this.currentPage
                    if(_this.totalPage === _this.currentPage && _this.columnData.data.length === 1){
                        currPage -= 1
                    }
                    currPage = currPage >=0 ? currPage : 0
                    _this.page(currPage)
                })
            },
            deleteColumnConfirm(issueId){
                const  _this = this
                this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    _this.deleteColumn(issueId)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteColumns(){
                let data = this.multipleIssueSelection
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
                            this.deleteColumn(data[i].columId)
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            //kindeditor
            onContentChange (val) {
                this.addColumnForm.content = val;

            },
            //popover
            initPopoverContent(row){

            },
            onClosePopoverContent(){

            }
        },
        created(){
            this.issueTitle = window.sessionStorage.getItem("issueTitle")
            this.issueId = window.sessionStorage.getItem("issueId")
            this.page(0)
        }
    }
</script>

<style scoped>

</style>