<template>
    <div>
        <el-container>
            <el-header>
                <el-row>
                    <el-col :span="2" :offset="10">
                        会议查看
                    </el-col>
                    <el-col :span="1" :offset="11">
                        <i class="el-icon-delete-solid" @click="deleteIssues"></i>
                    </el-col>
                </el-row>
            </el-header>
            <el-mian>
                <div>
                    <el-table size="mini" :data="issueData.data" border style="width: 100%" highlight-current-row ref="articleTable" tooltip-effect="dark"
                              @selection-change=" handleIssueSelectionChange">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column v-for="(v,i) in issueData.columns" :prop="v.field" :label="v.title" align="center" >
                            <template slot-scope="scope">
                                <template v-if="v.field === 'location'">
                                    <el-popover
                                            placement="top-start"
                                            width="200"
                                            trigger="hover"
                                            @show = initPopverMap(scope.row,scope.$index) @close="onClosePopoverMap">
                                        <popover-map :location="scope.row.loc"></popover-map>
                                        <span slot="reference" type="primary" @click="viewLocation(scope.row)">{{scope.row[v.field]}}</span>
                                    </el-popover>

                                </template>
                                <el-image v-else-if="v.field === 'logo'" style="display: inline-block;width: 50px;height: 50px;"  :src="scope.row[v.field]"></el-image>
                                <span v-else>
                                    {{scope.row[v.field]}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="文章查看" align="center">
                            <template slot-scope="scope">
                                <el-link type="primary" @click="viewIssue(scope.row.issueId,scope.row.title)">查看</el-link>
                            </template>

                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center">
                            <template slot-scope="scope">
                            <span class="el-tag el-tag--primary el-tag--mini" style="cursor: pointer; "  @click="updateIssue(scope.row)">
                                {{scope.row.isSet?'保存':"修改"}}
                            </span>
                                <span v-if="!scope.row.isSet " class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;" @click="deleteIssueConfirm(scope.row.issueId)">
                                    删除
                                </span>
                                <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" >
                                    取消
                                </span>
                            </template>
                        </el-table-column>
                        <div slot="append" style="text-align: center;height: 70px;line-height: 70px;cursor: pointer;" >
                            <div class="el-table-add-row" style="width: 99.2%;" @click="showIssueDialog">
                                <el-tooltip class="item" effect="dark" content="新增会议" placement="top-start">
                                    <span>+ 添加</span>
                                </el-tooltip>
                            </div>
                            <el-dialog :top="'0'" :close-on-click-modal="false" style="width: 100%;height: 800px;" title="新增会议" :visible.sync="dialogIssueFormVisible" @closed="addIssueHandleOnClose('addIssueForm')">
                                <el-form :model="addIssueForm" :rules="addIssueFormRule" ref="addIssueForm">
                                    <el-row>
                                        <el-col>
                                            <el-steps :active="active" finish-status="success" align-center>
                                                <el-step title="会议图标" ></el-step>
                                                <el-step title="会议标题" ></el-step>
                                                <el-step title="会议内容" ></el-step>
                                                <el-step title="会议时间" ></el-step>
                                                <el-step title="会议地点" ></el-step>
                                            </el-steps>
                                        </el-col>
                                    </el-row>
                                    <el-form-item v-show="active === 1">
                                        <el-upload
                                                ref="addIssueUpload"
                                                action="http://localhost:8181/uploadSponIcon"
                                                :show-file-list="false"
                                                :on-success="addIssueHandleSuccess"
                                                :before-upload="addIssueHandleBeforeUpload"
                                                :auto-upload="true">
                                            <img v-if="true" style="display: inline-block;width: 100px;height: 100px;position: relative;border-radius: 10px;top: 40px;"  :src="axios.defaults.baseURL+tempPath">
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item label="" prop="title" v-show="active === 2">
                                        <el-input v-model="addIssueForm.title" autocomplete="off" placeholder="标题"></el-input>
                                    </el-form-item>
                                    <el-form-item label="" prop="content" v-show="active === 3">
                                        <editor style="height: 150px"  v-model='addIssueForm.content' :init='init'></editor>
                                    </el-form-item>
                                    <el-form-item v-show="active === 4" prop="holdupTime">
                                        <el-date-picker
                                                v-model="addIssueForm.holdupTime"
                                                type="datetime"
                                                placeholder="选择日期时间"
                                                align="center"
                                                :picker-options="issuePickerOptions" :editable="false"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="" prop="location" v-show="active === 5">
                                        <el-input v-model="addIssueForm.location" autocomplete="off" disabled placeholder="地点"></el-input>
                                        <searchMap @getLocationInfo="getLocationMsg" ></searchMap>
                                    </el-form-item>
                                </el-form>
                                <div slot="footer" class="dialog-footer" >
                                    <el-button @click="dialogIssueFormVisible = false">取 消</el-button>
                                    <el-button type="primary" @click="active--" v-show="active !== 1">上一步</el-button>
                                    <el-button type="primary" @click="nextItem" v-show="active !== 5">下一步</el-button>
                                    <el-button type="primary" @click="submitAddIssueForm('addIssueForm')" v-show="active === 5">确 定</el-button>
                                </div>
                            </el-dialog>
                            <el-dialog :top="'0'" :close-on-click-modal="false" style="width: 100%;height: 800px;" title="修改会议" :visible.sync="dialogIssueUpdateVisible" @closed="updateIssueHandleOnClose('updateIssueForm')">
                                <el-form :model="addIssueForm" :rules="addIssueFormRule" ref="updateIssueForm">
                                    <el-row>
                                        <el-col>
                                            <el-steps :active="active" finish-status="success" align-center>
                                                <el-step title="会议图标" ></el-step>
                                                <el-step title="会议标题" ></el-step>
                                                <el-step title="会议内容" ></el-step>
                                                <el-step title="会议时间" ></el-step>
                                                <el-step title="会议地点" ></el-step>
                                            </el-steps>
                                        </el-col>
                                    </el-row>
                                    <el-form-item v-show="active === 1">
                                        <el-upload
                                                ref="updateIssueUpload"
                                                :action="'http://localhost:8181/uploadIssueLogo'+addIssueForm.issueId"
                                                :show-file-list="false"
                                                :on-success="addIssueHandleSuccess"
                                                :before-upload="addIssueHandleBeforeUpload">
                                            <img v-if="true" style="display: inline-block;width: 100px;height: 100px;position: relative;border-radius: 10px;top: 40px;"  :src="addIssueForm.logo">
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item label="" prop="title" v-show="active === 2">
                                        <el-input v-model="addIssueForm.title" autocomplete="off" placeholder="标题" @input="updateIssueData('title',addIssueForm.issueId)"></el-input>
                                    </el-form-item>
                                    <el-form-item label="" prop="content" v-show="active === 3">
                                        <editor style="height: 150px"  v-model='addIssueForm.content' :init='init' @input="updateIssueData('content',addIssueForm.issueId)"></editor>
                                    </el-form-item>
                                    <el-form-item v-show="active === 4" prop="holdupTime">
                                        <el-date-picker
                                                v-model="addIssueForm.holdupTime"
                                                type="datetime"
                                                placeholder="选择日期时间"
                                                align="center"
                                                :picker-options="issuePickerOptions" :editable="false" @input="updateIssueData('holdupTime',addIssueForm.issueId)"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="" prop="location" v-show="active === 5">
                                        <el-input v-model="addIssueForm.location" autocomplete="off" disabled placeholder="地点"></el-input>
                                        <template>
                                            <searchMap :issueId="addIssueForm.issueId" :loc="addIssueForm.loc" @getLocationInfo="getLocationMsg" ref="searchMap"></searchMap>
                                        </template>
                                    </el-form-item>
                                </el-form>
                                <div slot="footer" class="dialog-footer" >

                                    <el-button type="primary" @click="active--" v-show="active !== 1">上一步</el-button>
                                    <el-button type="primary" @click="nextItem" v-show="active !== 5">下一步</el-button>
                                    <el-button type="error" @click="closeUpdateDialog">关闭</el-button>
                                </div>
                            </el-dialog>
                        </div>
                    </el-table>
                </div>
                <div>
                    <el-pagination
                            background
                            layout="prev, pager, next"
                            :total="total"
                            :page-size="pageSize"
                            :current-page="currentPage"
                            @current-change = "page" style="position: relative;left: 0;top:20px;">
                    </el-pagination>
                </div>
            </el-mian>
        </el-container>

    </div>
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
    import  searchMap from '../../components/tool/searchMap'
    import  popoverMap from '../../components/tool/popoverMap'

    let timer= null
    export default {
        name: "issueManage",
        mounted () {
            tinymce.init({})
        },
        components: {Editor,searchMap,popoverMap},
        data(){
            return {
                issueData: {
                    sel: null,//选中行
                    isUpdate:true,
                    columns: [
                        { field: "logo", title: "图标" },
                        { field: "title", title: "标题" },
                        { field: "content", title: "内容"},
                        { field: "holdupTime", title: "举办时间"},
                        { field: "location", title: "举办地点"},
                    ],
                    data: [],
                },
                issuePickerOptions: {
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
                addIssueForm:{
                    logo:'',
                    title:'',
                    content:'',
                    holdupTime:null,
                    location:''
                },
                addIssueFormRule:{
                    title:[{required:true, message: '请输入标题', trigger: 'onSubmit'}],
                    content:[{required:true, message: '请输入内容', trigger: 'onSubmit'}],
                    holdupTime:[{required:true,message:'请输入举办日期',trigger:'onSubmit'}],
                    location:[{required:true, message: '请输入地点', trigger: 'onSubmit'}]
                },
                location:null,
                centerPopover:{lng: 0, lat: 0},
                tinymceHtml: '请输入内容',
                tempPath:'issue/16christine-zhu-1460573-unsplash.jpg',
                uploadFileName:'',
                active:1,
                total:0,
                totalPage:0,
                currentPage:0,
                pageSize:0,
                multipleIssueSelection:'',
                map:null,
                zoom:0,
                issueId:0,
                dialogIssueFormVisible:false,
                dialogIssueUpdateVisible:false,
                isUploaded:false,
                isUpdate:false,
                geoc:null,
                tempLocation:{},
                tempRow:{},
                tempIndex:0
            }
        },
        methods:{

            initPopverMap(row,index){
                let center = JSON.parse(row.loc);
                row.popoverLocation = center
            },
            onClosePopoverMap(){
            },
            getLocInfo(str){
                let isJson = this.isJSON(str)
                if(isJson){
                    let data = JSON.parse(str);
                    str =  data.province + data.city + data.district + data.street + data.streetNumber
                }
                return str

            },
            isJSON(str) {
                if (typeof str === 'string') {
                    try {
                        JSON.parse(str);
                        return true;
                    } catch(e) {
                        return false;
                    }
                }
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
            nextItem(){
              switch (this.active) {
                  case 1 :
                      this.active++;
                      break;
                  case 2 :
                      if(this.addIssueForm.title === '') {
                          this.$message({
                              message:'请输入进行下一步'
                          })
                      }else{
                          this.active++
                      }
                      break;
                  case 3 :
                      if(this.addIssueForm.content === '') {
                          this.$message({
                              message:'请输入进行下一步'
                          })
                      }else{
                          this.active++
                      }
                      break;
                  case 4 :
                      if(this.addIssueForm.holdupTime=== '') {
                          this.$message({
                              message:'请输入进行下一步'
                          })
                      }else{
                          this.active++
                      }
                      break;
              }
            },
            page(pageNo, pageSize=5){
              const  _this = this
              axios.post("/issue/queryPage?pageNo="+pageNo+"&pageSize="+pageSize).then(function (resp) {
                  _this.issueData.data = resp.data.records
                  for(let i=0; i<_this.issueData.data.length;i++){
                      _this.issueData.data[i].isSet = false;
                      _this.issueData.data[i].content = _this.subContent(_this.issueData.data[i].content)
                      _this.issueData.data[i].logo= axios.defaults.baseURL+'issue/'+_this.issueData.data[i].logo
                      _this.issueData.data[i].loc = _this.issueData.data[i].location
                      _this.issueData.data[i].popoverLocation = JSON.parse(_this.issueData.data[i].location)
                      _this.issueData.data[i].location = _this.getLocInfo(_this.issueData.data[i].location)

                  }
                  _this.total = resp.data.total
                  _this.totalPage = resp.data.pages
                  _this.currentPage = resp.data.current
                  _this.pageSize = resp.data.size
              })
            },
            getLocationMsg(data){
                if(this.isUpdate){
                    this.location = data
                    this.addIssueForm.location =data.province + data.city + data.district + data.street + data.streetNumber
                    this.updateIssueData('location',data.issueId)
                }else{
                    this.location = data
                    this.addIssueForm.location =data.province + data.city + data.district + data.street + data.streetNumber
                }


            },
            showIssueDialog(){
              this.dialogIssueFormVisible = true
                this.isUpdate = false
            },
            updateIssue(row){
                this.addIssueForm = row
                this.addIssueForm.loc = this.getLocInfo(row.loc)
                this.dialogIssueUpdateVisible = true
                this.isUpdate = true
            },
            closeUpdateDialog(){
                this.dialogIssueUpdateVisible = false
                this.active = 1
                timer = null
                this.location = null
                this.page(this.currentPage)
            },
            updateIssueData(type,id){

                const _this = this
                let data = {}
                if(type === 'location'){
                    data[type] = JSON.stringify(this.location)

                }else{
                    data[type] = this.addIssueForm[type]
                }

                data.issueId = id
                axios.post('/issue/updateIssue',data).then(function (resp) {
                    if(resp.data.code === "200"){

                    }else{
                        _this.$message({
                            message:resp.data.msg,
                            type:'error'
                        })
                    }

                })
            },
            viewLocation(row){

            },
            addIssueHandleOnClose(formName){
                this.$refs[formName].resetFields();
                this.tempPath = 'issue/16christine-zhu-1460573-unsplash.jpg'
                this.active = 1
            },
            updateIssueHandleOnClose(formName){
                this.$refs[formName].resetFields();
                this.addIssueForm = {}
            },
            // submitUpdateIssueForm(formName){
            //     this.$refs[formName].validate((valid) => {
            //         const _this = this;
            //         if (valid) {
            //             //submit file
            //             _this.$refs['updateIssueUpload'].submit();
            //             console.log("isUpload "+this.isUploaded)
            //             console.log(_this.addIssueForm.logo)
            //             _this.addIssueForm.logo = _this.addIssueForm.logo.substr(28)
            //
            //         } else {
            //             console.log('error submit!!');
            //             return false;
            //         }
            //     });
            // },
            submitAddIssueForm(formName){
                this.$refs[formName].validate((valid) => {
                    const _this = this;
                    if (valid) {
                        //submit file
                        _this.$refs['addIssueUpload'].submit();
                        if(this.isUploaded){//uploaded
                            _this.addIssueForm.logo = _this.uploadFileName
                        }else{
                            _this.addIssueForm.logo = _this.tempPath.substr(6)
                        }
                        console.log( _this.addIssueForm.logo)
                        this.addIssueForm.location = JSON.stringify(this.location)
                        axios.post('/issue/addIssue',_this.addIssueForm).then(function (resp) {
                            if(resp.data.code === "200"){
                                _this.dialogIssueFormVisible = false
                                let curPage = _this.currentPage
                                if(_this.isLast && _this.tableData.length === _this.pageSize){
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
            handleIssueSelectionChange(rows){
                this.multipleIssueSelection = rows;
            },
            addIssueHandleSuccess(res,file){
                this.isUploaded = true
                this.addIssueForm.logo = axios.defaults.baseURL + "issue/"+res.filePath
                this.tempPath = "temp/"+res.filePath
                this.uploadFileName = file.name
            },
            addIssueHandleBeforeUpload(file){
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
            viewIssue(id,title){
              window.sessionStorage.setItem("issueId",id);
              window.sessionStorage.setItem("issueTitle",title);
              this.$router.push("/ArticleManage")
            },
            deleteIssue(id){
                const  _this = this
                axios.post("/issue/deleteIssue",{"issueId":id}).then(function (resp) {
                    let currPage= _this.currentPage
                    if(_this.totalPage === _this.currentPage && _this.issueData.data.length === 1){
                        currPage -= 1
                    }
                    currPage = currPage >=0 ? currPage : 0
                    _this.page(currPage)
                })
            },
            deleteIssueConfirm(issueId){
                const  _this = this
                this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    _this.deleteIssue(issueId)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteIssues(){
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
                            this.deleteIssue(data[i].issueId)
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
        },
        created(){
            this.page(0)
        }
    }
</script>

<style scoped>

</style>