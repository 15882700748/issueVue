<template>
    <div>
        <el-container>
            <el-header>
                <el-row>
                    <el-col :span="1" :offset="23">
                        <i class="el-icon-delete-solid" ></i>
                    </el-col>
                </el-row>
            </el-header>
            <el-mian>
                <div>
                    <el-table size="mini" :data="master_user.data" border style="width: 100%" highlight-current-row ref="articleTable" tooltip-effect="dark"
                              @selection-change="handleSelectionChange">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column v-for="(v,i) in master_user.columns" :prop="v.field" :label="v.title" >
                            <template slot-scope="scope">
                                <span v-if="scope.row.isSet">
                                    <el-date-picker v-if="v.field === 'holdupTime'"
                                                    v-model="master_user.sel[v.field]"
                                                    type="datetime"
                                                    placeholder="选择日期时间"
                                                    align="center"
                                                    :picker-options="pickerOptions" :editable="false"></el-date-picker>
                                    <el-button type="text" v-else-if="v.field === 'content'">
                                        {{scope.row[v.field]}}
                                        <!--<i class="el-icon-edit" v-if="master_user.isUpdate" @click="showDialogTinymecVisible(scope.row,scope.row.articleId,'update')"></i>-->
                                        <!--<i class="el-icon-edit" v-else @click="showDialogTinymecVisible(scope.row,scope.row.articleId,'add')"></i>-->
                                        <!--<el-dialog  title="新增赞助商" :visible.sync="dialogTinymecVisible" :close-on-click-modal="!dialogTinymecVisible"-->
                                                    <!--center  @closed="HandleOnClose(scope.row)">-->
                                            <!--<editor  v-model='master_user.sel[v.field]' :init='init'></editor>-->
                                            <!--<span slot="footer" class="dialog-footer">-->
                                                <!--<el-button @click="dialogTinymecVisible = false">取 消</el-button>-->
                                                <!--<el-button type="primary" @click="saveArticleContent(scope.row,scope.$index)">保存</el-button>-->
                                            <!--</span>-->
                                        <!--</el-dialog>-->
                                    </el-button>
                                    <el-input v-else size="mini" placeholder="请输入内容" v-model="master_user.sel[v.field]"></el-input>
                                </span>
                                <span v-else-if="v.field !== 'content'">{{scope.row[v.field]}}</span>
                                <el-popover v-else
                                            :enterable="false"
                                            width="200" style="height: 100px"
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
                        <div slot="append" style="text-align: center;height: 70px;line-height: 70px">
                            <div class="el-table-add-row" style="width: 99.2%;" @click="addMasterUser">
                                <el-tooltip class="item" effect="dark" content="新增文章" placement="top-start">
                                    <span>+ 添加</span>
                                </el-tooltip>
                            </div>
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
    export default {
        name: "issueManage",
        mounted () {
            tinymce.init({})
        },
        components: {Editor},
        data(){
            return {
                tableData: [],
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
                articleDialogFormVisible:false,
                dialogTinymecVisible:false,
                isEdited:false
            }
        },
    }
</script>

<style scoped>

</style>