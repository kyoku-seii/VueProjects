/**
 * @description json schema 验证中间件
 */

const { ErrorModel } = require('../model/ResModel')
const { jsonSchemaFileInfo } = require('../model/ErrorInfo')

/**
  * 生成json schema验证的中间件
  * @param {function} validateFn 验证函数
  */
function genValidator (validateFn) {
  async function validator (ctx, next) {
    const data = ctx.request.body
    const error = validateFn(data)
    if (error) {
      // 验证失败
      ctx.body = new ErrorModel(jsonSchemaFileInfo)
      return
    }
    await next()
  }
  // 验证成功继续
  return validator
}

module.exports = {
  genValidator
}