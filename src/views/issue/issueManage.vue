<template>
    <el-container style="box-shadow:0px 0px 20px 0 black;min-height:90vh">
        <el-header style="background-color:#545c64;color: #fff; margin-bottom: 40px">
            <el-row>
                <el-col :span="15">
                    <el-form :model="issueForm"  label-position="top" ref="issueForm" label-width="55px" width="400px"  class="demo-ruleForm">
                        <el-row style="position: relative;top: 10px">
                            <el-col :span="24" >
                                <el-form-item  prop="content">
                                    <el-input :placeholder="'请输入'+(issueForm.select === 'title' ? '标题' : '会议')+'内容'" clearable v-model="issueForm.content" style="background-color: #545c64;color: white" >
                                        <el-select v-model="issueForm.select" style="width: 100px"  slot="prepend" placeholder="请选择" >
                                            <el-option label="标题" value="title"></el-option>
                                            <el-option label="内容" value="content"></el-option>
                                        </el-select>
                                        <el-button slot="append" icon="el-icon-search "  @click="searchIssue('issueForm')">搜索</el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
                <el-col :span="2" >
                    会议查看
                </el-col>

                <el-col :span="1" :offset="6">
                    <i class="el-icon-delete-solid" @click="deleteIssues"></i>
                </el-col>
            </el-row>
        </el-header>
        <el-mian>
            <div>
                <el-table size="mini" :data="issueData.data" border style="width: 90%;margin: 0 auto;height: 80%" highlight-current-row ref="articleTable" tooltip-effect="dark"
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
                                        width="200%"
                                        trigger="click"
                                        @show = initPopverMap(scope.row,scope.$index) @close="onClosePopoverMap">
                                    <popover-map :location="scope.row.loc"></popover-map>
                                    <span slot="reference" type="primary" @click="viewLocation(scope.row)">{{scope.row[v.field]}}</span>
                                </el-popover>
                            </template>
                            <span v-else-if="v.field === 'content'" @click="contentDrawer(scope.row) ">
                                    {{scope.row[v.field]}}
                                </span>
                            <el-image v-else-if="v.field === 'logo'" style="display: inline-block;width: 50px;height: 50px;"
                                      :preview-src-list="[scope.row[v.field]+'']"  :src="scope.row[v.field]"></el-image>
                            <!--<span v-else-if="v.field === 'isSelect'">-->
                                <!--<el-button  v-if="scope.row[v.field]" type="success" icon="el-icon-success" ></el-button>-->
                                <!--<el-button v-else type="primary" @click="confirmSelect(scope.row, scope.$index)"> 选择</el-button>-->
                            <!--</span>-->
                            <span v-else>
                                    {{scope.row[v.field]}}
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="管理" align="center">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="viewIssue(scope.row.issueId,scope.row.title)">文章</el-link>
                            <el-divider direction="vertical"></el-divider>
                            <el-link type="primary" @click="viewIssueColum(scope.row.issueId,scope.row.title)">栏目</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="展示状态" align="center">
                        <template slot-scope="scope">
                            <el-button  v-if="scope.row.isSelect" type="success" icon="el-icon-success" ></el-button>
                            <el-button v-else type="primary" @click="confirmSelect(scope.row, scope.$index)"> 选择</el-button>
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
                    <div slot="append" style="text-align: center;height: 50px;line-height: 50px;cursor: pointer;" >
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
                                    <!--<editor style="height: 150px"  v-model='addIssueForm.content' :init='init'></editor>-->
                                    <kind-editor id="editor" height="500px" width="100%" :content.sync="addIssueForm.content"
                                                 pluginsPath="kindeditor/plugins/"
                                                 :loadStyleMode="false"
                                                 ></kind-editor>
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
                                    <!--<editor style="height: 150px"  v-model='addIssueForm.con' :init='init' @input="updateIssueData('content',addIssueForm.issueId)"></editor>-->
                                    <kind-editor id="editor_id" height="500px" width="100%" :content.sync="addIssueForm.con"
                                                 pluginsPath="kindeditor/plugins/"
                                                 :loadStyleMode="false"
                                                 @on-content-change="onContentChange"></kind-editor>
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
                        <el-drawer
                                :with-header="false"
                                :visible.sync="viewIssuedetailsVisible"
                                direction="rtl">
                            <strong>标题：</strong>{{issueDetails.title}}
                            <el-divider></el-divider>
                            <strong>内容：</strong>
                            <span v-html="issueDetails.content"></span>
                        </el-drawer>
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
                issueForm : {
                    select : 'title',
                    content : ''
                },
                issueData: {
                    sel: null,//选中行
                    isUpdate:true,
                    columns: [
                        { field: "logo", title: "图标(点击查看logo)" },
                        { field: "title", title: "标题" },
                        { field: "content", title: "内容(可点击详情)"},
                        { field: "holdupTimeShow", title: "举办时间"},
                        { field: "location", title: "举办地点(可点击详情)"},
                        // { field: "isSelect", title: "展示状态"},
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
                viewIssuedetailsVisible:false,
                geoc:null,
                tempLocation:{},
                tempRow:{},
                tempIndex:0,
                selectId :0 ,
                issueDetails:{title:'', content:''}
            }
        },
        methods:{
            onContentChange(val){
                this.addIssueForm.content = this.addIssueForm.con
                this.updateIssueData('content',this.addIssueForm.issueId)
            },
            confirmSelect(row,index){
                let _this =this

                axios.post('/style/queryStyle?issueId='+row.issueId).then(resp => {
                    _this.selectId = row.issueId
                    _this.page(_this.currentPage)
                })
            },
            searchIssue(formName){
                this.$refs[formName].validate((valid) => {
                    const _this = this;
                    this.page(0);
                    if(this.issueForm.content !== '') {
                        _this.$message({
                            message:'搜索成功',
                            type:'success'
                        })
                    }

                });
            },
            contentDrawer(row){
                this.viewIssuedetailsVisible = true
                this.issueDetails.title = row.title
                this.issueDetails.content = row.con
            },
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
            timeFormat(time){
                let dateee = new Date(time).toJSON();
                let date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
                date = date.toString()
                return date.substr(0,11);
            },
            getSelected(){
                const  _this = this
                axios.post('/issue/getSelected').then(resp => {
                    _this.selectId = parseInt(resp.data)
                })
            },
            page(pageNo, pageSize=5){
              const  _this = this
              axios.post("/issue/page?pageNo="+pageNo+"&pageSize="+pageSize+'&'+this.issueForm.select+"="+this.issueForm.content).then(function (resp) {
                  _this.issueData.data = resp.data.records
                  for(let i=0; i<_this.issueData.data.length;i++){
                      _this.issueData.data[i].isSet = false;
                      if(_this.issueData.data[i].issueId ===  _this.selectId){
                          _this.issueData.data[i].isSelect = true
                      }else{
                          _this.issueData.data[i].isSelect = false
                      }
                      _this.issueData.data[i].con = _this.issueData.data[i].content
                      _this.issueData.data[i].content = _this.subContent(_this.issueData.data[i].content)
                      _this.issueData.data[i].holdupTimeShow = _this.timeFormat(_this.issueData.data[i].holdupTime)
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
                if(type === 'content'){
                    this.addIssueForm.content = this.addIssueForm.con
                }

                data.issueId = id

                if(data.issueId === undefined){

                }else{
                    axios.post('/issue/updateIssue',data).then(function (resp) {
                        if(resp.data.code === "200"){
                            _this.page(_this.currentPage)
                        }else{
                            _this.$message({
                                message:resp.data.msg,
                                type:'error'
                            })
                        }

                    })
                }

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
                        this.addIssueForm.location = JSON.stringify(this.location)
                        axios.post('/issue/addIssue',_this.addIssueForm).then(function (resp) {
                            if(resp.data.code === "200"){
                                _this.dialogIssueFormVisible = false
                                _this.$message({
                                    message:resp.data.msg,
                                    type:'success'
                                })

                                if(resp.data.columns.length === 0 ) {
                                    _this.$confirm('还没有栏目, 请添加栏目。', '提示', {
                                        confirmButtonText: '确定',
                                        showCancelButton: false,
                                        type: 'warning'
                                    }).then(() => {
                                        window.sessionStorage.setItem("issueId",data.issue.issueId);
                                        window.sessionStorage.setItem("issueTitle",data.issue.title);
                                        _this.$router.push('/columManage')
                                    }).catch(() => {
                                    });
                                }else if( resp.data.articles.length === 0) {
                                    _this.$confirm('还没有文章, 请添加文章。', '提示', {
                                        confirmButtonText: '确定',
                                        showCancelButton: false,
                                        type: 'warning'
                                    }).then(() => {
                                        window.sessionStorage.setItem("issueId",data.issue.issueId);
                                        window.sessionStorage.setItem("issueTitle",data.issue.title);
                                        _this.$router.push('/ArticleManage')
                                    }).catch(() => {
                                    });
                                }else{
                                    let curPage = _this.currentPage
                                    if(_this.currentPage === _this.totalPage && _this.issueData.data.length === _this.pageSize){
                                        curPage += 1;
                                    }
                                    _this.page(curPage)
                                }


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
                const isPng = file.type === 'image/png'
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
            viewIssueColum(id,title){
                window.sessionStorage.setItem("issueId",id);
                window.sessionStorage.setItem("issueTitle",title);
                this.$router.push("/columManage")
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
            this.getSelected()
            this.page(0)
        }
    }
</script>

<style scoped>

</style>