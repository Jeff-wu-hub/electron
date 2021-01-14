import menuList from "@/components/base";
import { getRules } from '@/utils/auth'

function getRouters() {
  console.log('菜单过滤')
  console.log('初始的菜单')
  console.log(menuList)
  let routerName = getRules() ? JSON.parse(getRules()) : []
  menuList.forEach(firstMenu => { // 一级菜单
    // 菜单过滤之前将所有菜单的hidden值，初始化;防止影响不同角色登录菜单不变
    firstMenu.hidden = true

    // 过滤路由 hidden：false
    //   isShow(firstMenu, routerName, "");
    if (firstMenu.children) { //二级菜单
      firstMenu.children.forEach(second => {
        // 菜单过滤之前将所有菜单的hidden值，初始化;防止影响不同角色登录菜单不变
        second.hidden = true
        // 过滤路由 hidden：false
        isShow(second, routerName, firstMenu);
        /*  if (second.children) { // 三级菜单

           second.children.forEach(end => {
             // 菜单过滤之前将所有菜单的hidden值，初始化;防止影响不同角色登录菜单不变
             end.hidden = true
          console.log('三级菜单')
             console.log(end)
             // 过滤路由 hidden：false
             isShow(end, routerName, second);
           })
         } */
      })
    }
  })
  console.log(menuList)
  return menuList
}

// 过滤路由
function filterRouter(id, routerName) {
  //  console.log('过滤路由')
  //   console.log(routerName)
  // console.log(routerName.length)
  return routerName.includes(id)
}

// 是否显示
function isShow(menu, routerName, parent) {
  // console.log('是否显示')
  //  console.log(menu)
  //  console.log(parent)
  let flag = filterRouter(menu.name, routerName)
  // console.log('过滤路由详情')
  //  console.log(flag)
  //  console.log(menu.meta)

  if (flag) { // 显示该角色拥有的权限
    menu.hidden = false
    //  console.log(parent)
    if (parent) { // 存在子节点，则父节点显示
      parent.hidden = false
    }
  }
  //  console.log(menu)
  //  console.log(parent)
}

export default getRouters
