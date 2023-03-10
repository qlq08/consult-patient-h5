<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { onMounted, onUnmounted, ref } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import type { TimeMessages, Message } from '@/types/room'
import { MsgType, OrderType } from '@/enums'
import type { ConsultOrderItem } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'

const store = useUserStore()
const route = useRoute()
// 1. 建立连接
// 安装 socket.io-client 包
// 组件挂载完毕  建立连接，组件卸载，关闭连接

let socket: Socket
const list = ref<Message[]>([])
onUnmounted(() => {
  socket.close()
})
onMounted(() => {
  socket = io(baseURL, {
    // 身份认证
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    // 订单ID
    query: {
      // 地址栏取出orderId，在建立连接的时候发送给，socket服务器
      orderId: route.query.orderId
    }
  })
  // 连接成功，connect 固定写法
  socket.on('connect', () => {
    console.log('连接成功')
  })
  // 关闭连接
  socket.on('disconnect', () => {
    console.log('断开连接')
  })
  // 发生错误
  socket.on('error', (err) => {
    console.log('发生错误', err)
  })

  // 聊天记录（默认消息）
  // 1. 绑定消息记录事件，后台连接成功主动发消息
  // 2. 拿到消息分组之后，处理成可以的消息列表 Message[]
  // 3. 响应式数据，接收数据，依据数据渲染即可
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // 处理消息：分组的时间自己组织成一条通用消息，items取出来放后面
    const arr: Message[] = []
    data.forEach((item) => {
      arr.push({
        id: item.createTime,
        msgType: MsgType.Notify,
        createTime: item.createTime,
        msg: {
          content: item.createTime
        }
      })
      arr.push(...item.items)
    })
    // 将处理好的数据放置list中
    list.value.unshift(...arr)
    console.log(list.value)
  })
  // 等链接成功之后,注册事件,订单状态变更
  socket.on('statusChange', async () => {
    const res = await getConsultOrderDetail(route.query.orderId as string)
    consult.value = res.data
  })
})

// 接诊状态的控制: (订单详情)
// 1. 组件挂载后,需要找到当前的接诊状态
// 2. 订单状态变更后,需要只知道已经变化,更新当前的接诊状态
// 3. 依赖状态:
// 3.1 状态栏 需要条件渲染,有倒计时
// 3.2 操作栏 需要禁用和启用
const consult = ref<ConsultOrderItem>()
onMounted(async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
})

// 发送文字信息
// 1. 底部操作栏组件，输入信息后需要传递给父组件（index.vue）组件
// 2. 由父组件来发送信息，通过emit发送消息 sendChatMsg
// 3. 接收消息，on receiveChatMsg接收服务器回的消息证明发送成功，追加到消息列表
// 4. 在渲染的时候，区分是自己还是医生
const sendText = (text: string) => {
  // 根据后台约定发送消息:form 发送人  to 接收人  msgType消息类型 msg{content:文字}
  socket.emit('sendChatMsg', {
    form: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: {
      content: text
    }
  })
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status
      :status="consult?.status"
      :countdown="consult?.countdown"
    ></room-status>
    <room-message :list="list"></room-message>
    <room-action
      @send-text="sendText"
      :disabled="consult?.status !== OrderType.ConsultChat"
    ></room-action>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
