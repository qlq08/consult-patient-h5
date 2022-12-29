export type User = {
  id: string // 用户id
  account: string // 用户名
  avatar: string // 用户头像
  mobile: string // 用户手机号
  token: string
}

// 短信验证码类型，登录|注册|修改手机号|忘记密码|绑定手机号
export type CodeType =
  | 'login'
  | 'register'
  | 'changeMobile'
  | 'forgetPassword'
  | 'bindMobile'

// 排出 token 得到对象类型
// 个人中心-用户信息类型
// Omit 可以从一个对象类型中 排除某些属性
// Pick作用?
// 从类型对象中取出指定的属性类型
// Omit 作用?
// 从类型对象中排出指定的属性类型,得到剩余的

// 个人信息
type OmitUser = Omit<User, 'token'>
type UserInfo = OmitUser & {
  /* 关注 */
  likeNumber: number
  /* 收藏 */
  collectionNumber: number
  /* 积分 */
  score: number
  /* 优惠券 */
  couponNumber: number
  orderInfo: {
    /* 待付款 */
    paidNumber: number
    /* 待发货 */
    receivedNumber: number
    /* 待收货 */
    shippedNumber: number
    /* 已完成 */
    finishedNumber: number
  }
}

// 家庭档案-患者信息
type Patient = {
  /* 患者ID */
  id?: string
  /* 患者名称 */
  name: string
  /* 身份证号 */
  idCard: string
  /* 0 不默认 1默认 */
  defaultFlag: 0 | 1
  /* 0 女 1 男 */
  gender: 0 | 1
  /* 性别文字 */
  genderValue?: string
  /* 年龄 */
  age?: number
}
