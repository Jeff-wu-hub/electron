import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '../components/layout.vue'
import login from '@/views/login' // 登录页面
import mat_print from '@/views/incoming_material/mat_print' // 供应商打印配置
import welcome from '@/views/welcome' // 欢迎页面
import pur_order_ser from '@/views/incoming_material/pur_order_ser'// 采购单查询
import reprint_mat from '@/views/incoming_material/reprint_mat' // 补料补打记录
import supplier_mana from '@/views/incoming_material/supplier_mana' // 供应商账号管理
import supplier_printConfig from '@/views/incoming_material/supplier_printConfig' //物料打印配置
import newtab from '@/views/charts/NewTab'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name:'login',
    component: login
  },
  {
    path: '/layout',
    name: 'layout',
    component: layout,
    redirect: '/welcome',
    children:[{
      path: '/welcome',
      name: 'welcome',
      component: welcome
    },{
      path: '/incoming_material/mat_print',
      name: 'mat_print',
      component: mat_print
    },{
      path: '/incoming_material/supplier_mana',
      name: 'supplier_mana',
      component: supplier_mana
    },{
      path: '/incoming_material/pur_order_ser',
      name: 'pur_order_ser',
      component: pur_order_ser
    },{
      path: '/incoming_material/supplier_printConfig',
      name: 'supplier_printConfig',
      component: supplier_printConfig
    },{
      path: '/incoming_material/reprint_mat',
      name: 'reprint_mat',
      component: reprint_mat
    },{
      path:'/charts/newtab',
      name:'newtab',
      component: newtab
    }]
  }
]

const router = new VueRouter({
  routes,
})
export default router
