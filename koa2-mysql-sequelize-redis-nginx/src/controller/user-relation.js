/**
 * @description 用户关系contr
 */

const {
  getUsersByFollower,
  getFollowersByUser,
  addFollower,
  deleteFollower } = require('../services/user-relation')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { addFollowerFailInfo, deleteFollowerFailInfo } = require('../model/ErrorInfo')

/**
 * 根据userId获取粉丝列表
 * @param {number} userId 用户id
 */
async function getFans (userId) {
  // service
  const { count, userList } = await getUsersByFollower(userId)

  // 返回
  return new SuccessModel({
    count,
    fansList: userList
  })
}


/**
 * 获取关注人列表
 * @param {number} userId  用户id
 */
async function getFollowers (userId) {
  const { count, userList } = await getFollowersByUser(userId)
  return new SuccessModel({
    count,
    followersList: userList
  })
}

/**
 * 关注
 * @param {number} userId 当前登录用户id
 * @param {number} curUserId 要被关注的用户id
 */
async function follow (myUserId, curUserId) {
  // service
  try {
    await addFollower(myUserId, curUserId)
    return new SuccessModel()
  } catch (ex) {
    return new ErrorModel(addFollowerFailInfo)
  }
}

/**
 * 取消关注
 * @param {number} userId 当前登录用户id
 * @param {number} curUserId 要被关注的用户id
 */
async function unFollow (myUserId, curUserId) {
  // service
  const result = await deleteFollower(myUserId, curUserId)
  if (result) {
    return new SuccessModel()
  }
  return new ErrorModel(deleteFollowerFailInfo)
}



module.exports = {
  getFans,
  getFollowers,
  follow,
  unFollow
}