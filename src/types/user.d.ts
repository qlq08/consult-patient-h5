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
