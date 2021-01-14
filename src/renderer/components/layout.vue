<template>
  <el-container class="container">
    <!-- 布局head -->
    <el-header class="head" height="60px">
      <div class="home_head">
          <img src="@/assets/logo.png" alt="用户头像">
          <span>MES</span>
      </div>
      <el-button type="primary" @click="signout">退出</el-button>
    </el-header>
    <!-- 布局aside -->
    <el-container>
      <el-aside width="185px" class="aside">
    <el-menu
      :default-active="activeName"
      class="el-menu-vertical-demo"
      background-color="#1b263b"
      text-color="#778da9"
      active-text-color="#e0e1dd"
      router
      >
      <el-submenu :index="item.id" v-for="item in menu" :key="item.id">
        <template slot="title">
          <i :class="icon[item.order-1]"></i>
          <span>{{item.authName}}</span>
        </template>
          <el-menu-item :index="'/'+it.path" v-for="it in item.children" :key="it.id" @click="sessionstore">
              <template slot="title">
                  <i class="el-icon-s-opportunity"></i>
                  <span>{{it.authName}}</span>
              </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
      <!-- 定义main页面 -->
      <el-main class="main"><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getInfo()
    this.getActive()
  },
  data () {
    return {
      activeName: '',
      menu: [{
        id:'0',
        path:'#',
        authName:'来料管理',
        order:1,
        children:[{
          id:'1',
          path:'incoming_material/mat_print',
          authName:'物料打印记录',
        },
        {
          id:'2',
          path:'incoming_material/supplier_printConfig',
          authName:'供应商打印配置',
        },
        {
          id:'3',
          path:'incoming_material/supplier_mana',
          authName:'供应商账号管理',
        },{
          id:'4',
          path:'incoming_material/pur_order_ser',
          authName:'采购单查询',
        },{
          id:'5',
          path:'incoming_material/reprint_mat',
          authName:'补料补打记录',
        },
            {
                id:'7',
                path:'charts/newTab',
                authName:'tab',
            }]
      }],
      icon: ['el-icon-s-custom', 'el-icon-coordinate', 'el-icon-shopping-bag-2', 'el-icon-chat-dot-square', 'el-icon-pie-chart']
    }
  },
  methods: {
      // 登录退出按钮
    async signout () {
        const {data:res} = await this.$http.post('logout')
        if(res.code === 0 ){
            this.$message.success('退出成功')
            this.$router.push('/')
            return window.sessionStorage.clear()
        }
    },
    getInfo () {
    },
    sessionstore (e) {
      window.sessionStorage.setItem('active', e.index)
    },
    getActive () {
      this.activeName = window.sessionStorage.getItem('active')
    }
  }
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
  width: 100%;
  height:100%;
    overflow: hidden;
}
.container{
  height: 100%;
}
.head{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left:5px;
    width: 100%;
    background-color: #0d1b2a;
}
.home_head{
    padding-left:20px;
    display:flex;
    align-items: center;
    justify-content: start;
}
.home_head img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.home_head span{
    margin-left: 50px;
    font-size: 1.5em;
    color: white;
}
.aside{
    background-color: #0d1b2a;

}
.aside .el-menu{
  border: none;
}
.main {
    background-color: #f5f3f4;
    height: 100%;
}

    ul.el-menu li{
        overflow: hidden;
        font-size: 13px;
    }
</style>
