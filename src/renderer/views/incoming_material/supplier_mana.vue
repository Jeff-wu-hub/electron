<template>
  <div class="wrap">
    <!-- 供应商账号管理 -->
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
      size="mini"
      @submit.native.prevent
    >
      <el-form-item label="供应商">
        <el-input v-model="formInline.name" clearable placeholder="可通过供应商编号/名字 搜索" @keydown.enter.native="onSubmit"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getImport">导入</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onDownload" :loading="exce">导出</el-button>
      </el-form-item>
    </el-form>
    <div class="pagination">数量：{{total}}</div>
    <el-table
      :data="dataList"
      border
      stripe
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(255,255, 255, 0.8)"
      ref="multipleTable"
      height="75vh"
      :cell-style="{padding:'6px 0'}"
    >
      <el-table-column prop label="供应商编号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.code}}</template>
      </el-table-column>
      <el-table-column prop label="供应商名称" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name}}</template>
      </el-table-column>
      <el-table-column prop label="供应商全称" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.full_name}}</template>
      </el-table-column>
      <el-table-column prop label="账号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.account_no}}</template>
      </el-table-column>
      <el-table-column prop label="密码" align="center">
        <template slot-scope="scope">{{ scope.row.password}}</template>
      </el-table-column>
      <el-table-column prop label="联系人" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.call_user}}</template>
      </el-table-column>
      <el-table-column prop label="详细地址" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.call_addr}}</template>
      </el-table-column>
      <el-table-column prop label="详细信息" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.remark}}</template>
      </el-table-column>
      <el-table-column prop label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.stop.prevent="clickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <!-- 添加加载插槽 -->
      <template slot="append">
        <p v-loading="add" class="loading">{{loadContext}}</p>
      </template>
    </el-table>
    <!-- 编辑弹窗 -->
    <el-dialog
      title="供应商信息编辑"
      :visible.sync="dialogFormVisible"
      width="45%"
      center
      :close-on-click-modal="false"
    >
      <el-form size="small" :model="editInfo" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商编号">
              <el-input v-model="editInfo.code" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input v-model="editInfo.name" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账号">
              <el-input v-model="editInfo.account_no" @keydown.enter.native="editConfirm"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码">
              <el-input v-model="editInfo.password" @keydown.enter.native="editConfirm"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="详细信息">
              <el-input v-model="editInfo.remark" @keydown.enter.native="editConfirm"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>
<!--    上传页面-->
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
    <div style="margin: 1% 0 0 50%;transform: translate(-50%)">
      <el-pagination
              background
              @size-change="getData"
              @current-change="getData"
              :current-page.sync="formInline.page"
              :page-size.sync="formInline.limit"
              :page-sizes="[20,30,50]"
              layout="sizes, prev, pager, next, jumper"
              :total="total" />
    </div>
  </div>
</template>
<script>
export default {
  name: "supplierMana",
  data() {
    return {
      form: {
        file: {},
        type: "merchant"
      },
      modelLoading: false
      ,
      fileList: [], // 文件列表
      limitNum: 3, // 文件上传个数
      upload: false, // 上传页面
      add: false, // 无限滚动加载 标识符,数据显示完，显示表格底部结束提示
      formInline: {
        // 搜索条件
        page: 1,
        limit: 20,
      },
      apiComplete: false, // 查询接口回调函数是否完成，不完成禁止再次调用接口
      dataList: [], // 返回的数据
      total: 0, // 返回数据的总条数
      exce: false, // 数据导出时 loading加载，标识符
      loadContext: "", // 表格数据，加载完的提示内容
      flag: false, // 标志是否为查询，点击查询按钮，表格滚动条回到顶部
      tableLoading: false, // 表格loading
      dialogFormVisible: false, // 编辑弹窗显示
      editInfo: {}, // 供应商信息
    };
  },
  mounted() {
    // 初始化数据列表
    this.onSubmit();
  },
  computed: {},

  methods: {
    // 按条件查询
    onSubmit() {
      this.flag = true; // 表示查询

      this.formInline.page = 1;
      this.loadContext = "";

      this.tableLoading = true; // 表格loading

      // 清空数据列表
      this.dataList = [];
      // 滚动加载的loading停止
      this.add = false;
      // 调接口
      this.getData();
      this.flag = false; // 表示查询

    },
    // 获取接口数据
    async getData() {
      this.apiComplete = true; // 接口调用开始
      // 显示条数
      const {data: res} = await this.$http.get('/material/merchant_list', {
        params: this.formInline
      })
      if (res.code === 0) {
        this.total = Number(res.data.count)
        this.dataList = res.data.list
        this.tableLoading = false
      }
      // 接口调用
      this.apiComLeft = false;

    },

    // 点击导入
    getImport() {
      this.upload = true // 显示上传页面
    },

    // 显示供应商编辑弹窗
    clickEdit(e) {
      this.dialogFormVisible = true
      this.editInfo = e
    },
    // 提交修改供应商信息
    async editConfirm() {
      //接口调用
      const {data: res} = await this.$http.get('/material/update_merchant', {
        params: this.editInfo
      })
      if (res.code === 0) {
        this.dialogFormVisible = false
        return this.$message.success('修改成功！')
      }
    },
    // 导出
    async onDownload() {
      // 加载中
      this.exce = true; // 加载中
      const {data: res} = await this.$http.get('/file_handle/export_excel', {
        params: {type: 'merchant'},
        responseType: "arraybuffer",
        headers: {'Content-Type': 'application/json,charset=utf-8'}
      })
      let blob = new Blob([res], {
        type: "application/vnd.ms-excel"
      });
      // 文件名
      let fileName = "供应商账号" + ".xlsx";

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
        setTimeout(function () {
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
    // 下载模板
    async downModel() {
      this.modelLoading = true; // 加载中
      const {data: res} = await this.$http.get('/file_handle/export_excel', {
        params: {type: 'merchant'},
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
        setTimeout(function () {
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
    handleExceed() {
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
        fd.append('type', 'merchant');
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.$http.post('/file_handle/import_excel', fd, config).then(res => {
          console.log(res)
          this.upload = false
          return this.$message.success('导入完成')
        }).catch(res => {
          console.log(res.data)
        })
      }
    },

  }
}
</script>
<style>
  .loading{
    text-align: center;
  }
</style>




