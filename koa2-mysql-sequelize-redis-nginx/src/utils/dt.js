/**
 * @description 时间相关的工具函数
 */
const { format } = require('date-fns')

/**
 * 格式化事件 
 * @param {string} str 时间字符串
 */
function timeFormat (str) {
  return format(new Date(str), 'MM.dd HH:mm')
}

module.exports = {
  timeFormat
}