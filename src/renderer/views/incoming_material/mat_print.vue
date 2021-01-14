<template>
  <div class="wrap">
    <!--物料打印记录 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
      <el-form-item label="供应商">
        <el-input v-model="formInline.name" clearable placeholder="可通过编号/名称 搜索" @keydown.enter.native="onSubmit"/>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="formInline.orderNo" clearable @keydown.enter.native="onSubmit"/>
      </el-form-item>
      <el-form-item label="品号">
        <el-input v-model="formInline.product_id" clearable @keydown.enter.native="onSubmit"/>
      </el-form-item>
      <el-form-item label="品名">
        <el-input v-model="formInline.product_name" clearable @keydown.enter.native="onSubmit"/>
      </el-form-item>
      <el-form-item label="批次号">
        <el-input v-model="formInline.batch_no" clearable @keydown.enter.native="onSubmit"/>
      </el-form-item>
      <el-form-item label="打印时间">
        <el-date-picker v-model="formInline.start_time" type="date" placeholder="开始日期" clearable value-format="yyyy-MM-dd HH:mm:ss" style="width:150px"></el-date-picker>
        <el-date-picker v-model="formInline.end_time" type="date" placeholder="结束日期" clearable size="mini" value-format="yyyy-MM-dd HH:mm:ss" style="width:150px"></el-date-picker></el-form-item>
      <el-form-item>
        <el-button @click="onSubmit">搜索</el-button>
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
      ref="multable"
      height="72vh"
      :cell-style="{padding:'6px 0'}"
    >
      <el-table-column prop label="订单号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.order_no}}</template>
      </el-table-column>
      <el-table-column prop label="供应商编号" align="center">
        <template slot-scope="scope">{{scope.row.merchant_code}}</template>
      </el-table-column>
      <el-table-column prop label="供应商" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.merchant_name}}</template>
      </el-table-column>
      <el-table-column prop label="品号" align="center">
        <template slot-scope="scope">{{ scope.row.material_code}}</template>
      </el-table-column>
      <el-table-column prop label="品名" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.material_name}}</template>
      </el-table-column>
      <el-table-column prop label="批次号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.batch_no}}</template>
      </el-table-column>
      <el-table-column prop label="数量" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.number}}</template>
      </el-table-column>
      <el-table-column prop label="箱号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.box_no}}</template>
      </el-table-column>
      <el-table-column prop label="打印类型" align="center" show-overflow-tooltip>
        <template
          slot-scope="scope"
        >{{ scope.row.type=='self'?'自打': scope.row.type=='proxy'?'代打':'其他'}}</template>
        <!-- self-自打，proxy-代打，other-其它 -->
      </el-table-column>
      <el-table-column prop label="打印说明" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.remark}}</template>
      </el-table-column>
      <el-table-column prop label="打印时间" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.dateline}}</template>
      </el-table-column>

      <!-- 添加加载插槽 -->
      <template slot="append">
        <p v-loading="add" class="loading">{{loadContext}}</p>
      </template>
    </el-table>
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
  name: "matPrint",
  data() {
    return {
      add: false, // 无限滚动加载 标识符,数据显示完，显示表格底部结束提示
      formInline: {
        // 搜索条件
        page: 1,
        limit: 25
      },
      apiComplete: false, // 查询接口回调函数是否完成，不完成禁止再次调用接口
      dataList: [], // 返回的数据
      total: 0, // 返回数据的总条数
      exce: false, // 导出时 加载
      loadContext: "", // 加载完的提示内容
      flag: false, // 标志是否为查询，点击查询按钮，表格滚动条回到顶部
      tableLoading: false // 表格loading
    };
  },
  created() {
    // 初始化数据列表
    this.onSubmit()
  },
  computed: {
  },

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
      const { data : res } = await this.$http.get('/material/query_merchant_qr',{
        params: this.formInline
      })
        if (res.code===0){
          this.total = Number(res.data.count)
          this.dataList = res.data.list
          this.tableLoading = false
        }
      // 接口调用
      this.apiComLeft = false;

    },

    // 导出
    async onDownload() {
      // 加载中
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
          let fileName = "物料打印配置" + ".xlsx";

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


  }
  // mounted() {
  //   // 表格滚动条 无限滚动加载
  //   this.$refs.multable.bodyWrapper.addEventListener(
  //     "scroll", res => { // 使用搜索控制，并让页面滚动到顶部
  //       let height = res.target
  //       if (this.flag) {
  //         height.scrollTop = 0;
  //         this.flag = false;
  //         return;
  //       }
  //       let clientHeight = height.clientHeight; // 表格当前高度
  //       let scrollTop = height.scrollTop; //表格卷动高度
  //       let scrollHeight = height.scrollHeight; // 表格总高度
  //       if (clientHeight + scrollTop + 100 > scrollHeight) {
  //         if (this.formInline.page < Math.ceil(this.total / this.formInline.limit)){
  //           // 判断本次调用数据是否完成，没完成不进行下一个接口请求
  //           if (!this.apiComLeft) {
  //             this.formInline.page++;
  //             this.add = true
  //             // 调接口
  //             this.getData();
  //           }
  //         } else {
  //           this.add = false;
  //           this.loadContext = "没有更多了";
  //         }
  //     }
  //     });
  // }
}
</script>
<style  scoped>
  .wrap{
    height: auto;
  }
.code {
  cursor: pointer;
}
.code:hover {
  color: #00a9ff;
  text-decoration: underline;
}
.loading{
  text-align: center;
}
</style>





