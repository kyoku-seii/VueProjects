/**
 * @description 微博首页controller
 */
const xss = require('xss')
const { createBlog, getFollowersBlogList } = require('../services/blog')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { createBlogFailInfo } = require('../model/ErrorInfo')
const { PAGE_SIZE, REG_FOR_AT_WHO } = require('../conf/constant')
const { getUserInfo } = require('../services/user')
const { createAtRelation } = require('../services/at-relation')

/**
  * 创建微博
  * @param {string} userId 用户名
  * @param {string} content 内容
  * @param {string} image 图片
  */
async function create ({ userId, content, image }) {
  // 分析并收集content 中的@用户
  const atUserNameList = []
  content = content.replace(
    REG_FOR_AT_WHO,
    (matchStr, nickName, userName) => {
      // 目的不是replace 而是获取userName
      atUserNameList.push(userName)
      return matchStr  // 替换不生效，预期
    }
  )
  // 根据@用户名查询用户信息
  const atUserList = await Promise.all(
    atUserNameList.map(userName => getUserInfo(userName))
  )

  // 根据用户信息，获取用户id
  const atUserIdList = atUserList.map(user => user.id)


  // service 
  try {
    // 创建微博
    const blog = await createBlog({
      userId,
      content: xss(content),
      image
    })

    // 创建@关系
    // blog.id 
    // service
    await Promise.all(atUserIdList.map(
      userId => createAtRelation(blog.id, userId)
    ))

    // 返回
    return new SuccessModel(blog)
  } catch (ex) {
    return new ErrorModel(createBlogFailInfo)
  }
}

/**
 * 获取首页微博列表
 * @param {number} userId userId
 * @param {number} pageIndex pageIndex
 */
async function getHomeBlogList (userId, pageIndex = 0) {
  // service
  const result = await getFollowersBlogList({
    userId,
    pageIndex,
    pageSize: PAGE_SIZE
  })
  const { count, blogList } = result
  return new SuccessModel({
    isEmpty: blogList.length === 0,
    blogList,
    pageSize: PAGE_SIZE,
    pageIndex,
    count
  })
}

module.exports = {
  create,
  getHomeBlogList
}