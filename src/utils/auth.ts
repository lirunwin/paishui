import Cookies from 'js-cookie'

const TokenKey = 'token'

// 获取token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 删除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取username
export function geteSessionStorage(key) {
  return sessionStorage.getItem(key)
}

// 设置username
export function setSessionStorage(key, name) {
  return sessionStorage.setItem(key, name)
}

// 删除username
export function removeSessionStorage(key) {
  return sessionStorage.removeItem(key)
}

