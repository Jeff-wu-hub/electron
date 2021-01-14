import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token';
const rules = 'getRules'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 存放登录用户的路由权限
export function setRules(token) {
  console.log('路由存入cookie')
  console.log(token)
  return Cookies.set(rules, JSON.stringify(token))
}

// 获得登录用户的路由权限
export function getRules() {
  return Cookies.get(rules)
}

// 取消登录用户的路由权限
export function removeRules() {
  return Cookies.remove(rules)
}
