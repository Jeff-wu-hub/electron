import { getRules } from '@/utils/auth'

/*根据权限 判断是否有解绑操作 */

// 判断后台返回的权限列表中是否含有解绑操作的权限，如果没有就隐藏绑码列表中的解绑操作


function isUnbind() {
  console.log('路由')
  let routerName = getRules() ? JSON.parse(getRules()) : []
  // console.log(routerName)
  // 是否含有解绑操作  unbind可以当参数传递过来
  return routerName.find(item => item == 'unbind')
}


export default isUnbind
