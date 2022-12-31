import type { ConsultTime, ConsultType } from '@/enums'

// 文章类型
export type KnowledgeType = 'like' | 'recommend' | 'fatReduction' | 'food'

// 文章信息
export type Knowledge = {
  id: string
  title: string
  coverUrl: string[]
  topics: string[]
  collectionNumber: number
  commentNumber: number
  creatorName: string
  creatorAvatar: string
  creatorHospatalName: string
  likeFlag: 0 | 1
  content: string
  creatorDep: string
  creatorTitles: string
  creatorId: string
}

// 文章列表
export type KnowledgeList = Knowledge[]

// 分页文章
export type KnowledgePage = {
  pageTotal: number
  total: number
  rows: KnowledgeList
}

// 通用的分页查询参数
export type PageParams = {
  current: number
  pageSize: number
}
// 文章列表查询参数
export type KnowledgeParams = PageParams & {
  type: KnowledgeType
}

// 医生卡片
export type Doctor = {
  id: string
  name: string
  avatar: string
  hospitalName: string
  gradeName: string
  depName: string
  positionTitles: string
  likeFlag: 0 | 1
  serviceFee: number
  consultationNum: number
  score: number
  major: string
}

// 医生列表
export type DoctorList = Doctor[]

// 医生分页
export type DoctorPage = {
  pageTotal: number
  total: number
  rows: DoctorList
}

// 关注的类型
export type FollowType = 'topic' | 'knowledge' | 'doc' | 'disease'

// 问诊订单 (记录) 类型
// 图片列表
export type Image = {
  // 图片ID
  id: string
  // 图片地址
  url: string
}

// 问诊记录
export type Consult = {
  // 问诊记录ID
  id: string
  // 问诊类型
  type: ConsultType
  // 优惠券ID
  couponId: string
  // 快速问诊类型, 0 普通 1 三甲
  illnessType: 0 | 1
  // 患者ID
  patientId: string
  // 科室ID
  depId: string
  // 疾病描述
  illnessDesc: string
  // 疾病持续时间
  illnessTime: ConsultTime
  // 是否就诊过, 0 未就诊过  1 就诊过
  consultFlag: 0 | 1
  // 图片数组
  pictures: Image[]
}

// 发现在一步一步问诊的时候,是一个值一个值加上去的,所以最好是都可选属性
// Partial 把对象类型的属性全部转换为可选属性
// 问诊记录-全部可选
export type PartialConsult = Partial<Consult>
// Required 把对象的全部属性转换为必选属性
// type Obj = {
//   name?: string
//   age?: number
// }

// type RequiredObj = Required<Obj>

// 二级科室
export type SubDep = {
  id: string
  name: string
}

// 一级科室
export type TopDep = SubDep & {
  child: SubDep[]
}

export type ConsultIllness = Pick<
  PartialConsult,
  'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'
>
