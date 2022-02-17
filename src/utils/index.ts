
/**
 * 日期格式化
 * @param {(Object|string|number)} time 时间
 * @param {string} cFormat 需要的格式
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * 计算时间
 * @param {number} time 时间
 * @param {string} option  时间格式
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d.getTime()) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 网址解析
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}
/**
 * 把扁平数据转成树形数据
 * @param {array} data
 * @returns {array}
 */
export function treeData(data) {
  const cloneData = JSON.parse(JSON.stringify(data)) // 对源数据深度克隆
  return cloneData.filter(father => {
    const branchArr = cloneData.filter(child => father.id === child.parentId) // 返回每一项的子级数组
    branchArr.length > 0 ? father.children = branchArr : '' // 如果存在子级，则给父级添加一个children属性，并赋值
    return father.parentId === '0' // 返回第一层
  })
}
/** 简化表单类提交批量校验逻辑
 * {condition:?,errmsg:?},逻辑取反标识:inverse
*/
export function verification(items) {
  const _result = { success: true, errmsg: [] }
  items.forEach(element => {
    if (element.condition) {
      _result.success = false
      _result.errmsg.push(element.errmsg)
    }
  })
  return _result
}

// 获取屏幕可视区域的宽高
export function client() {
  if (window.innerHeight !== undefined) {
    return {
      'width': window.innerWidth,
      'height': window.innerHeight
    }
  } else if (document.compatMode === 'CSS1Compat') {
    return {
      'width': document.documentElement.clientWidth,
      'height': document.documentElement.clientHeight
    }
  } else {
    return {
      'width': document.body.clientWidth,
      'height': document.body.clientHeight
    }
  }
}

/**
 * 检查元素是否具有类
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * 向元素添加类
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * 从元素中删除类
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}
/**
 * 金额转换
 * @param {number} num 金额
 * @returns {number}
 */
export function toFixed(num) {
  return (Math.round(num * 100) / 100).toFixed(2)
}

// 防抖
export function _debounce(fn, wait = 200) {
  let timer
  return function() {
    const context = this
    const args = arguments
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}

// 节流
export const _throttle = (fn, wait = 200) => {
  let timer
  return function() {
    if (timer != null) return
    const context = this
    const args = arguments
    fn.apply(context, args)
    timer = setTimeout(() => {
      timer = null
    }, wait)
  }
}
/**
 * 对象类型数组排序
 * @param {string} key 数组元素中的键
 * @param {boolean} isAsc 升降序
 * @returns {array}
 */
export function sortExp(key, isAsc) {
  return function(x, y) {
    if (isNaN(key)) {
      if (x[key] > y[key]) {
        return 1 * (isAsc ? 1 : -1)
      } else if (x[key] < y[key]) {
        return -1 * (isAsc ? 1 : -1)
      } else {
        return 0
      }
    } else {
      return (x[key] - y[key]) * (isAsc ? 1 : -1)
    }
  }
}
// /**
//  * @description 对象转formData
//  */
// export const paramsToFormData(obj) {
//   const formData = new FormData()
//   Object.keys(obj).forEach((key) => {
//     if (obj[key] instanceof Array) {
//       obj[key].forEach((item) => {
//         formData.append(key, item)
//       })
//       return
//     }
//     formData.append(key, obj[key])
//   })
//   return formData
// }

export function removeEmpty(data) {
  const params = Object.keys(data)
    .filter((key) => data[key] !== null && data[key] !== undefined && data[key] !== '' &&
  JSON.stringify(data[key]) !== '{}' && JSON.stringify(data[key]) !== '[]'
    )
    .reduce((acc, key) => ({ ...acc, [key]: data[key] }), {})
  return params
}

/**
 *
 * @param {Array} arrs 树形数据
 * @param {string} childs 树形数据子数据的属性名,常用'children'
 * @param {Array} attrArr 需要提取的公共属性数组(默认是除了childs的全部属性)
 * @returns
 */
export function extractTree(arrs, childs, attrArr) {
  let attrList = []
  if (!Array.isArray(arrs) && !arrs.length) return []
  if (typeof childs !== 'string') return []
  if (!Array.isArray(attrArr) || Array.isArray(attrArr) && !attrArr.length) {
    attrList = Object.keys(arrs[0])
    attrList.splice(attrList.indexOf(childs), 1)
  } else {
    attrList = attrArr
  }
  const list = []
  const getObj = (arr) => {
    arr.forEach(function(row) {
      const obj = {}
      attrList.forEach(item => {
        obj[item] = row[item]
      })
      list.push(obj)
      if (row[childs]) {
        getObj(row[childs])
      }
    })
    return list
  }
  return getObj(arrs)
}
// 多个表单验证
export function validateForms(formRefs) {
  const objectList = []
  const results = formRefs.map(formRef =>
    new Promise((resolve, reject) => {
      formRef.validate((valid, object) => {
        if (valid) {
          resolve({})
        } else {
          objectList.push(object)
          reject({})
        }
      })
    })
  )
  return Promise.all(results).catch(() => {
    return Promise.reject(objectList)
  })
}
// 时间转换
export function formatDuring(mss) {
  if (mss === null) {
    return false
  }
  function fillZero(t) {
    if (t < 10 && t !== 0) {
      return `0${t}`
    }
    return t
  }
  var minutes = parseInt((mss / 60).toString())
  minutes = fillZero(minutes)
  var seconds = mss - minutes * 60
  seconds = fillZero(seconds)

  return minutes + '分' + seconds + '秒'
}
