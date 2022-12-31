export {}

// 1.枚举的语法

// 一组数据, Up Down Left Right 对应的值分布式 0 1 2 3 你的类型只能在这组数组中使用其中一个.
/* enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3
} */

// 值从0开始,以此类推
/* enum Direction {
  Up,
  Down,
  Left,
  Right
} */

// 第一个值5开始,从5开始加
/* enum Direction {
  Up = 5,
  Down,
  Left,
  Right
}
 */

// 可以是字符串吗 ?
/* enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
} */

// const changeDirection = (d: Direction) => {
//   console.log('方向值', d)
// }
// changeDirection(Direction.Left)

// 2.枚举的使用场景, 几个小例子

// 男是0 女是1
/* enum Gender {
  Boy,
  Girl
}

const changeGender = (gender: Gender) => {
  if (gender === Gender.Boy) {
    console.log('男')
  }
}
changeGender(Gender.Boy) */

// 待付款1 已付款5   已完成8
/* enum OrderStatus {
  Unpay = 1,
  Payed = 5,
  Complete = 8
}

const changeStatus = (status: OrderStatus) => {
  if (status === OrderStatus.Complete) {
    console.log('订单完成')
  }
}
changeStatus(OrderStatus.Complete)
 */

// 3.业务上的枚举类型

// 问诊类型
export enum ConsultType {
  // 找医生
  Doctor = 1,
  // 快速问诊
  Fast = 2,
  // 开药问诊
  Medication = 3
}

// 问诊时间, 以1自增可以省略
export enum ConsultTime {
  // 一周内
  Week = 1,
  // 一月内
  Month,
  // 半年内
  HalfYear,
  // 半年以上
  More
}
