<template>
    <div>
        <el-table :data="tableData" stripe style="width: 100%" >
            <el-table-column prop="logoUrl" label="logo" >
                <template   slot-scope="scope">
                    <img :src="scope.row.logoUrl"  min-width="50" height="50" />
                </template>
            </el-table-column>
            <el-table-column prop="account" label="账户" >
            </el-table-column>
            <el-table-column prop="name" label="姓名" >
            </el-table-column>
            <el-table-column prop="email" label="邮箱" >
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" >
            </el-table-column>

            <el-table-column prop="orgDesc" label="描述" >
            </el-table-column>
            <el-table-column prop="webSite" label="网站"  >
                <template slot-scope="scope">
                    <el-link type="primary" :href="'http://'+scope.row.webSite"
                             target="_blank">{{scope.row.webSite}}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="tel" label="电话">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                    <el-button @click="deleteOrgById(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="pageSize"
                @current-change = "page">
        </el-pagination>
    </div>

</template>

<script>
	export default {
		name: "org",
        methods: {
		    page(currentPage){
                const _this = this
                axios.get("/organization/page?pageNo="+(currentPage)+"&pageSize=5").then(function(resp){
                    _this.tableData = resp.data.records
                    let data = resp.data
                    console.log(data)
                    for(let i=0; i<resp.data.records.length;i++){
                        _this.tableData[i].logoUrl = axios.defaults.baseURL+'/img/'+_this.tableData[i].logoUrl
                        // _this.tableData[i].webSite = '<el-link href="'+_this.tableData[i].webSite+'" type="primary">'+_this.tableData[i].webSite+'</el-link>'
                    }
                    _this.pageSize =data.size
                    _this.total = data.total
                })
            },
            handleClick(row) {
                this.$message({
                    message: row.name,
                    type: 'success'
                });
            },
            deleteOrgById(row){
                const _this = this
                this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    let data ={"orgId":row.orgId}
                    axios.post("/organization/deleteOrgById",data).then(function (resp) {
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        window.location.reload();
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
		data() {
			return {
			    pageSize:1,
                total:1,
				tableData:null,
				logoUrl:''
			}
		},
		created(){
		    const _this = this
		    axios.get("/organization/page?pageNo=0&pageSize=5").then(function(resp){
		        _this.tableData = resp.data.records
                let data = resp.data
		        for(let i=0; i<resp.data.records.length;i++){
		            _this.tableData[i].logoUrl= axios.defaults.baseURL+_this.tableData[i].logoUrl
		        }
		        _this.pageSize =data.size
                _this.total = data.total
		    })

		}
	}	
</script>

<style>

</style>