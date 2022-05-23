/* 工具函数 */

export const regPhone = () => /^1[3456789]\d{9}$/ // 手机号码验证
export const regEmail = () => /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/ // 邮箱验证
export const regPassword = () => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%&+-]{8,16}$/ // 密码强度验证
//export const regUserName = () => /^[a-zA-Z0-9_-]{4,16}$/ // 用户姓名正则
export const regUserName = () => /^[A-Za-z0-9]+$/ // 用户姓名正则 限制字符、数字
export const regRealName = () => /^[\u4e00-\u9fa5]{2,6}$/ // 人名正则
export const floatNum = () => /^\d+(\.\d+)?$/ // 浮点数正则
export const naturalNum = () => /^\+?[0-9][0-9]*$/ // 自然数正则
