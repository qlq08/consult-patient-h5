// 用户相关的接口请求函数都在这里

import type { User, CodeType, UserInfo, Patient } from '@/types/user'
import { request } from '@/utils/request'

// 密码登录
export const loginByPassword = (mobile: string, password: string) =>
  request<User>('login/password', 'POST', { mobile, password })

// 发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) =>
  request('/code', 'GET', { mobile, type })

// 短信登录
export const loginByCode = (mobile: string, code: string) =>
  request<User>('login', 'POST', { mobile, code })

// 获取个人信息
export const getUserInfo = () => request<UserInfo>('/patient/myUser')

// 获取患者信息列表
export const getPatientList = () => request<Patient[]>('patient/mylist')
