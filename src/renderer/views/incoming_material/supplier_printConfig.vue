<template>
  <div class="wrap">
    <!-- 供应商打印配置 -->
    <!-- 表格信息 -->
    <div class="table_wrap">
      <div class="left_table">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
          <el-form-item label>
            <el-input v-model="formInline.name" clearable placeholder="供应商 编号/名称 搜索" @keydown.enter.native="onSubmit"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="pagination">数量：{{total}}</div>
        <el-table
          :data="marchantList"
          border
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
          element-loading-background="rgba(255,255, 255, 0.8)"
          ref="multipleTable"
          height="85vh"
          :cell-style="{padding:'6px 0'}"
          highlight-current-row
          @current-change="handleCurrentChange"
          :row-style="{cursor: 'pointer'}"
        >
          <el-table-column prop label="供应商编号" align="center">
            <template slot-scope="scope">{{scope.row.merchant_code}}</template>
          </el-table-column>
          <el-table-column prop label="供应商名称" align="center" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.merchant_name}}</template>
          </el-table-column>
          <!-- 添加加载插槽 -->
          <template slot="append">
            <p v-loading="add" class="loading">{{loadContext}}</p>
          </template>
        </el-table>
      </div>
      <div class="right_table">
        <div style="text-align:right;margin-bottom:5px">
          <el-button size="mini" type="primary" @click="getImport">导入</el-button>

          <el-button size="mini" type="primary" @click="onDownload('merchant_material')" :loading="exce">导出</el-button>
        </div>
        <el-form :inline="true" :model="rightParams" class="demo-form-inline" size="mini">
          <el-form-item label="供应商">
            <el-input v-model="rightParams.name" disabled placeholder="点击左侧列表"></el-input>
          </el-form-item>
          <el-form-item label>
            <el-input v-model="rightParams.product_id" placeholder="品号" clearable @keydown.enter.native="submitRight"/>
          </el-form-item>
          <el-form-item label>
            <el-input v-model="rightParams.product_name" clearable placeholder="品名" @keydown.enter.native="submitRight"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitRight">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="pagination">数量：{{totalRight}}</div>
        <el-table
          :data="productList"
          border
          ref="multipleRight"
          v-loading="loadingRight"
          element-loading-text="拼命加载中"
          element-loading-background="rgba(255,255, 255, 0.8)"
          height="80vh"
          :cell-style="{padding:'6px 0'}"
        >
          <el-table-column prop label="品号" align="center">
            <template slot-scope="scope">{{scope.row.material_code}}</template>
          </el-table-column>
          <el-table-column prop label="品名">
            <template slot-scope="scope">{{ scope.row.material_name}}</template>
          </el-table-column>
          <el-table-column prop label="修改时间" align="center" width="160">
            <template slot-scope="scope">{{ scope.row.update_time}}</template>
          </el-table-column>
          <el-table-column prop label="包装数" align="center">
            <template slot-scope="scope">{{ scope.row.pack_num}}</template>
          </el-table-column>
          <el-table-column prop label="修改人" align="center">
            <template slot-scope="scope">{{ scope.row.user_name}}</template>
          </el-table-column>
          <el-table-column prop label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click.stop.prevent="clickEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
          <!-- 添加加载插槽 -->
          <template slot="append">
            <p v-loading="addRight" class="loading">{{loadContextRight}}</p>
          </template>
        </el-table>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="供应商信息编辑"
      :visible.sync="dialogFormVisible"
      width="45%"
      center
      :close-on-click-modal="false"
    >
      <el-form size="small" :model="editInfo" label-width="90px" ref="numberValidateForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商编号">
              <el-input v-model="editInfo.merchant_code" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input v-model="editInfo.merchant_name" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="品号">
              <el-input v-model="editInfo.product_id" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品名">
              <el-input v-model="editInfo.material_name" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="包装数"
              prop="num"
              :rules="[
                { required: true, message: '不能为空'},
                { type: 'number', message: '必须为数字值'}
              ]"
            >
              <el-input v-model.number="editInfo.num"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="editConfirm('numberValidateForm')">确 定</el-button>
      </span>
    </el-dialog>
<!--    导入页面-->
    <el-dialog title="上传文件" :visible.sync="upload" width="40%">
      <el-form  :model="formInline" class="demo-form-inline">
        <el-form-item label='导入模板样式  :'>
          <el-button size="small" style="margin-left: 10%" type="success" @click="downModel" :loading="modelLoading">点击下载</el-button>
        </el-form-item>
        <el-form-item label="上传Excel : ">
<!--         上传excel -->
          <div style="width: 50%;height: 50%;margin-top: 5%;margin-left: 45%;transform: translate(-50%)">
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    :limit="limitNum"
                    :auto-upload="false"
                    :before-upload="beforeUpload"
                    :on-change="handleChange"
                    :on-remove="handleRemove"
                    :on-exceed="handleExceed"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :file-list="fileList"
                    drag
                    action="#"
                    show-file-list
                    accept=".xlsx,.xls"
                    multiple
                    name="file"
                    style="width: 100%;height: 100%">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </div>
        </el-form-item>
          <div style="margin-left: 60%">
          <el-button @click="upload = false">取 消</el-button>
          <el-button type="primary" @click="upLoadBtn">开始导入</el-button>
            <div/>
          </div>
      </el-form>

</el-dialog>
  </div>
</template>
<script>
export default {
  name: "sPrintConfig",
  data() {
    return {
      add: false, // 无限滚动加载 标识符,数据显示完，显示表格底部结束提示
      form:{file:{}, type:"merchant_material " },// 上传data属性
      modelLoading: false, // 下载模板按钮是否加载
      fileList: [], // 文件列表
      limitNum: 3, // 文件上传个数
      upload: false, // 上传页面
      formInline: {
        // 供应商列表  搜索条件
        page: 1,
        limit: 25
      },
      rightParams: {
        page: 1,
        limit: 25
      },
      apiComLeft: false, // 查询接口回调函数是否完成，不完成禁止再次调用接口
      apiComRight: false, // 查询接口回调函数是否完成，不完成禁止再次调用接口
      marchantList: [], // 供应商列表
      productList: [], // 物料列表
      total: 0, // 返回数据的总条数
      exce: false, // 导出时 加载
      loadContext: "", // 加载完的提示内容
      flag: false, // 标志是否为查询
      flagRight: false, // 标志是否为查询
      tableLoading: false, // 表格loading
      dialogFormVisible: false, // 编辑弹窗显示
      editInfo: {}, // 供应商信息
      loadingRight: false, // 右侧表格加载时loading
      totalRight: 0, // 右侧表格列表总数
      loadContextRight: "", // 加载完的提示内容
      addRight: false // 无限滚动加载 标识符,数据显示完，显示表格底部结束提示
    };
  },
  created() {
    // 初始化数据列表
    this.onSubmit();

    // 回车键实现查询
  },

  methods: {
    // 按条件查询
    onSubmit() {
      this.flag = true; // 表示查询

      this.formInline.page = 1;
      this.loadContext = "";

      this.tableLoading = true; // 表格loading

      // 清空数据列表
      this.marchantList = [];
      // 滚动加载的loading停止
      this.add = false;
      this.getData() // 使用接口获取左侧表格数据


    },
    // 获取接口数据  左侧列表
    async getData() {
      this.apiComLeft = true; // 加载中
      // 显示条数
      const { data: res } = await this.$http.get('material/merchant_product_list',
              {
                params:{
                  name: this.formInline.name,
                  page:this.formInline.page,
                  limit: this.formInline.limit
                }}).catch(event)
      if (res.code === 0) {
        this.total = res.data.count
        this.marchantList = this.marchantList.concat(res.data.list)
        this.apiComLeft = false // 加载完成判定
      }
       this.apiComLeft = false; // 加载完成判定

      this.tableLoading = false; // 表格loading
    },

    // 显示供应商编辑弹窗
    clickEdit(row) {
      let obj = {
        merchant_code: row.merchant_code,
        merchant_name: row.merchant_name,
        product_id: row.material_code,
        material_name: row.material_name,
        num: row.pack_num
      };
      this.editInfo = obj;
      this.dialogFormVisible = true;
    },
    // 提交修改供应商信息
    async editConfirm() {
      const { data: res } = await this.$http.get('material/update_merchant_product_info',{
        params:{
          product_id: this.editInfo.product_id,
          num: this.editInfo.num,
          merchant_code:this.rightParams.name
        }
      }).catch(e => console.log(e))
      if (res.code===0) {
        this.onSubmit();
        this.dialogFormVisible = false
        this.submitRight()
        return this.$message.success('修改成功！')
      }
      return this.$message.error('修改失败！')
    },

    // 供应商列表单选
    handleCurrentChange(val) {
      this.rightParams.name = val.merchant_code;
      // 获取列表
      this.submitRight();
    },

    // 右侧搜索条件
    submitRight() {
      this.flagRight = true; // 表示查询
      this.rightParams.page = 1; // 右侧表单页码
      this.loadContextRight = ""; //加载时显示的文字
      this.loadingRight  = true; // 表格loading
      // 清空数据列表
      this.productList = [];
      // 滚动加载的loading停止
      this.addRight = false;

      this.getDataRight();
      this.flagRight = false // 查询结束
    },

    // 获取接口数据  右侧列表
    async getDataRight () {
      this.apiComRight = true
      const { data: res } =await this.$http.get('material/query_merchant_info',{
        params:{
          name: this.rightParams.name,
          product_name: this.rightParams.product_name,
          product_id:this.rightParams.product_id,
          page: this.rightParams.page,
          limit:this.rightParams.limit
        }
      }).catch(event)
      if (res.code === 0){
        this.totalRight = res.data.count
        this.productList = this.productList.concat(res.data.list)
        this.loadingRight = false

      }
      return this.apiComRight = false
    },

    // 点击导入
    getImport() {
     this.upload = true
    },

    // 导出
    async onDownload() {
      this.exce = true; // 加载中
      const { data : res } = await this.$http.get('/file_handle/export_excel',{
        params:{type:'merchant_material' },
        responseType: "arraybuffer",
        headers: {'Content-Type': 'application/json,charset=utf-8'}
      })
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel"
          });
          // 文件名
          let fileName = "供应商打印配置" + ".xlsx";

          // 加载结束
          this.exce = false;
          // 判断是否为ie浏览器
          if (this.isIE()) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            // 兼容不同浏览器的URL对象
            const url = window.URL || window.webkitURL || window.moxURL;
            // 创建链接
            const link = document.createElement("a");
            link.style = "display: none";
            link.href = url.createObjectURL(blob);
            link.download = fileName; // 这里填保存成的文件名
            document.body.appendChild(link);
            link.click();
            // 延时删除  兼容火狐浏览器
            setTimeout(function() {
              document.body.removeChild(link);
              url.revokeObjectURL(link.href);
            }, 100);
          }

        return this.$message.success('导出成功!')
    },
    //判断是否IE浏览器
    isIE() {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true;
      } else {
        return false;
      }
    },
     async downModel () {
       this.modelLoading = true; // 加载中
      const { data : res } = await this.$http.get('/file_handle/export_excel',{
        params:{type:'merchant' },
        responseType: "arraybuffer",
        headers: {'Content-Type': 'application/json,charset=utf-8'}
      })
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel"
          });
          // 文件名
          let fileName = "模板" + ".xlsx";

          // 加载结束
          this.modelLoading = false;
          // 判断是否为ie浏览器
          if (this.isIE()) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            // 兼容不同浏览器的URL对象
            const url = window.URL || window.webkitURL || window.moxURL;
            // 创建链接
            const link = document.createElement("a");
            link.style = "display: none";
            link.href = url.createObjectURL(blob);
            link.download = fileName; // 这里填保存成的文件名
            document.body.appendChild(link);
            link.click();
            // 延时删除  兼容火狐浏览器
            setTimeout(function() {
              document.body.removeChild(link);
              url.revokeObjectURL(link.href);
            }, 100);
          }

        return this.$message.success('下载成功!')
    },
    beforeUpload(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== "xlsx") {
        this.$message.warning("只能上传后缀是.xlsx的文件");
      }
      if (size > 10) {
        this.$message.warning("文件大小不得超过10M");
      }
    },
    // 文件状态改变
    handleChange(file, fileList) {
      if (file) {
        this.fileList = fileList.slice(-3);
      }
    },
    // 删除文件
    handleRemove() {
      this.fileList = [];
    },
    // 文件超出个数限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `只能选择3个文件，当前共选择了 ${files.length + fileList.length} 个`
      );
    },
    // 文件上传成功
    handleSuccess() {
      this.$message.success("文件上传成功");
    },
    // 文件上传失败
    handleError() {
      this.$message.error("文件上传失败");
    },
    // 上传按钮
    async upLoadBtn() {
      if (this.fileList.length === 0) {
        this.$message.info('请先上传文件')
      } else {
        this.$message.warning('开始导入')
        const file = this.$refs.upload.fileList[0].raw
        //上传axios-api调用
        let fd = new FormData()
        fd.append('file', file);
        fd.append('type','merchant');
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        this.$http.post('/file_handle/import_excel', fd,config).then( res => {
          console.log(res)
          this.$message.success('导入完成')
          return this.upload = false
        }).catch( res => {console.log(res.data)})
      }
    }
  },
  mounted() {

    //左侧 表格滚动条 无限滚动加载
    this.$refs.multipleTable.bodyWrapper.addEventListener(
      "scroll", res => { // 使用搜索控制，并让页面滚动到顶部
        let height = res.target
        if (this.flag) {
          height.scrollTop = 0;
          this.flag = false;
          return;
        }

        let clientHeight = height.clientHeight; // 表格当前高度
        let scrollTop = height.scrollTop; //表格卷动高度
        let scrollHeight = height.scrollHeight; // 表格总高度
        if (clientHeight + scrollTop + 500 > scrollHeight) {
          if (this.formInline.page < Math.ceil(this.total / this.formInline.limit)){
            // 判断本次调用数据是否完成，没完成不进行下一个接口请求
            if (!this.apiComLeft) {
              this.formInline.page++;
              this.add = true
              // 调接口
              this.getData();
            }
          } else {
            this.add = false;
            this.loadContext = "没有更多了";
          }
      }
      });
    //右侧 表格滚动条 无限滚动加载
    this.$refs.multipleRight.bodyWrapper.addEventListener(
      "scroll",
      res => {
        console.log("右侧");
        let height = res.target;

        if (this.flagRight) {
          // 查询时，让滚动条回到顶部
          //   console.log("现在是查询");
          //    console.log(this.flag);
          height.scrollTop = 0;
          this.flagRight = false;
          return;
        }

        let clientHeight = height.clientHeight;
        let scrollTop = height.scrollTop;
        let scrollHeight = height.scrollHeight;

        if (clientHeight + scrollTop + 500 > scrollHeight) {
          if (this.rightParams.page < Math.ceil(this.totalRight / this.rightParams.limit)) {
            // 判断本次调用数据是否完成，没完成不进行下一个接口请求
            if (!this.apiComRight) {
              this.rightParams.page++;
              this.addRight = true;
              // 调接口
              this.getDataRight();
            }
          } else {
            this.addRight = false;
            this.loadContextRight = "到底了！！";
          }
        }
      },
      true
    );
  }
};
</script>
<style  scoped>
  .wrap{
    height: 100%;
  }
.table_wrap {
  width: 100%;
  flex: 1;
  display: flex;
  height: 100%;
  justify-content: space-between;
}
.left_table {
  width: 30%;
  height: 100%;
  border-right: 1px solid #cecece;
}
.right_table {
  width: 69%;
  height: 100%;
}
  .loading{
   text-align: center;
  }
</style>





