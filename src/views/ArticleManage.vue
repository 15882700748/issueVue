<template>
    <div>
        <div>
            <el-table
                    :data="tableData"
                    style="width: 100%;height: auto"
                    >
                <el-table-column
                        fixed="left"
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        label="日期" prop="realseTime"
                        >
                </el-table-column>
                <el-table-column
                        label="文章标题" prop="title">
                </el-table-column>
                <el-table-column
                        label="内容" prop="content">
                </el-table-column>
                <el-table-column
                        label="举办时间" prop="holdupTime">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="120">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                size="small" @click="deleteArticle(scope.row.articleId)">
                            移除
                        </el-button>
                    </template>
                </el-table-column>
                <div slot="append" style="text-align: center;height: 70px;line-height: 70px">
                    <i class="el-icon-plus"></i>
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
    </div>
</template>

<script>
    export default {
        name: "ArticleManage",
        data(){
            return {
                tableData: [],
                total:0,
                totalPage:0,
                currentPage:0,
                pageSize:0
            }
        },
        methods: {
            isLast(){
              if(this.total < this.pageSize && this.totalPage === this.currentPage){
                  return true
              }
              return false;
            },
            page(pageNo,pageSize=2,){
                const  _this = this
                axios.post("/article/page?pageNo="+pageNo+"&pageSize="+pageSize).then(function (resp) {
                    _this.tableData = resp.data.records
                    // _this.albums = resp.data.records
                    _this.total = resp.data.total
                    _this.totalPage = resp.data.pages
                    _this.currentPage = resp.data.current
                    _this.pageSize = resp.data.size
                })
            },
            deleteArticle(id){
                const  _this = this
               axios.post("/article/deleteArticle",{"articleId":id}).then(function (resp) {
                   let currPage= _this.currentPage
                   if(_this.totalPage === _this.currentPage || _this.total === 1){
                       currPage -= 1
                   }
                   currPage = currPage >=0 ? currPage : 0
                   _this.page(currPage)
               })

            }
        },
        created(){
            this.page(0)
        }
    }
</script>

<style scoped>

</style>