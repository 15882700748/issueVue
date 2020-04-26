<template>
    <el-container style="background-color:white;box-shadow:0px 0px 20px 0 black;height: 100hv">
        <el-header style="background-color:#545c64;color: #fff; margin-bottom: 20px">
            <el-row style="height: 60px;line-height: 60px">
                <el-col :span="6" :offset="10">
                    选择展示会议
                </el-col>
            </el-row>
        </el-header>
        <el-mian>
            <div style="width: 100%;height: 440px;">
                <div style="width: 90%;height: 40px;margin: 20px auto 40px" >
                    <el-row>
                        <el-col>
                            <el-form :model="issueForm"  label-position="top" ref="issueForm" label-width="55px" width="400px"  class="demo-ruleForm">
                                <el-row>
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
                    </el-row>
                </div>
                <el-table size="mini" :data="issueData.data" border style="width: 90%;height: 340px;margin: 0 auto" highlight-current-row ref="articleTable" tooltip-effect="dark"
                          @selection-change=" handleIssueSelectionChange">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column v-for="(v,i) in issueData.columns" :prop="v.field" :label="v.title" align="center" >
                        <template slot-scope="scope">
                            <template v-if="v.field === 'location'">
                                {{scope.row[v.field]}}
                            </template>
                            <span v-else-if="v.field === 'content'" >
                                    {{scope.row[v.field]}}
                                </span>
                            <el-image v-else-if="v.field === 'logo'" style="display: inline-block;width: 50px;height: 50px;"
                                      :preview-src-list="[scope.row[v.field]+'']"  :src="scope.row[v.field]"></el-image>
                            <span v-else>
                                    {{scope.row[v.field]}}
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <!--<el-button v-if="((currentPage-1)*pageSize)+ (scope.$index+1) === selectIndex" type="success" icon="el-icon-success" ></el-button>-->
                            <el-button v-if="scope.row.isSelect" type="success" icon="el-icon-success" ></el-button>
                            <el-button v-else type="primary" @click="confirmSelect(scope.row, scope.$index)"> 选择</el-button>
                        </template>
                    </el-table-column>
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
    let timer= null
    export default {
        name: "issueSelect",
        components : {
        },
        data(){
            return {
                issueData: {
                    sel: null,//选中行
                    isUpdate:true,
                    columns: [
                        { field: "logo", title: "图标(点击查看logo)" },
                        { field: "title", title: "标题" },
                        { field: "content", title: "内容"},
                        { field: "holdupTime", title: "举办时间"},
                        { field: "location", title: "举办地点"},
                    ],
                    data: [],
                },
                issueForm : {
                    select : 'title',
                    content : ''
                },
                location:null,
                centerPopover:{lng: 0, lat: 0},
                tinymceHtml: '请输入内容',
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
                dialogIssueSelectVisible:false,
                tempLocation:{},
                tempRow:{},
                tempIndex:0,
                isSet:false,
                selectIndex : 0,
                selectId : 0
            }
        },
        methods:{
            confirmSelect(row,index){
                let _this =this

                axios.post('/style/queryStyle?issueId='+row.issueId).then(resp => {
                    _this.selectId = row.issueId
                    _this.page(_this.currentPage)
                    console.log()
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
            page(pageNo, pageSize=4){
                const  _this = this
                let index = window.sessionStorage.getItem("selectIndex")
                this.selectIndex = !index ? 0 : parseInt(index)
                axios.post("/issue/page?pageNo="+pageNo+"&pageSize="+pageSize+'&'+this.issueForm.select+"="+this.issueForm.content).then(function (resp) {
                    _this.issueData.data = resp.data.records
                    for(let i=0; i<_this.issueData.data.length;i++){
                        _this.issueData.data[i].isSet = false;
                        if(_this.issueData.data[i].issueId ===  _this.selectId){
                            _this.issueData.data[i].isSelect = true
                        }else{
                            _this.issueData.data[i].isSelect = false
                        }
                        console.log(_this.issueData.data[i].isSelect,_this.selectId)
                        _this.issueData.data[i].con = _this.issueData.data[i].content
                        _this.issueData.data[i].content = _this.subContent(_this.issueData.data[i].content)
                        _this.issueData.data[i].holdupTime = _this.timeFormat(_this.issueData.data[i].holdupTime)
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
            handleIssueSelectionChange(rows){
                this.multipleIssueSelection = rows;
            },

        },
        created(){
            this.getSelected();
            this.page(0)
        }
    }
</script>

<style scoped>

</style>
