<script setup lang="ts">
import router from '@/router'
import {
  getConsultOrderPre,
  createConsultOrder,
  getConsultOrderPayUrl
} from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import { useConsultStore } from '@/stores/consult'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { showToast, showDialog } from 'vant'
import { onMounted, ref } from 'vue'

import { onBeforeRouteLeave } from 'vue-router'
// 获取订单相关信息
const store = useConsultStore()
const payInfo = ref<ConsultOrderPreData>()
const loadPayInfo = async () => {
  const res = await getConsultOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  payInfo.value = res.data
  // 存储优惠券信息
  store.setCoupon(res.data.couponId)
}

// 获取患者信息
const patient = ref<Patient>()
const loadPatient = async () => {
  if (store.consult.patientId) {
    const res = await getPatientDetail(store.consult.patientId)
    patient.value = res.data
  }
}
onMounted(() => {
  // 判断是否没有了问诊信息 (已经生成了订单,本地清空了)
  if (
    !store.consult.type ||
    !store.consult.illnessType ||
    !store.consult.depId ||
    !store.consult.patientId
  ) {
    return showDialog({
      title: '温馨提示',
      message:
        '问诊信息不完整请重新填写,如有未支付的问诊订单可在问诊记录中继续支付',
      closeOnPopstate: false
    }).then(() => {
      router.push('/')
    })
  }
  loadPayInfo()
  loadPatient()
})

// 生成订单,展示支付方式抽屉
const agree = ref(false)
const show = ref(false)
const paymentMethod = ref<0 | 1>()
const orderId = ref<string>()
const loading = ref(false)
const openSheet = async () => {
  if (!agree.value) return showToast('请勾选用户支付协议')
  loading.value = true
  // 生成订单
  const res = await createConsultOrder(store.consult)
  orderId.value = res.data.id
  store.clear()
  loading.value = false

  // 展示抽屉
  show.value = true
}

// 进行支付
// 1. 隐藏抽屉的关闭按钮
// 2. 再关闭的时候,确认框提示,仍要关闭 问诊记录  继续支付  关闭确认框。
// 3. 如果已经生成订单了回退的时候拦截
// 4. 生成支付地址然后跳转:调用后台的接口
// 5. 刷新页面的时候,判断是否问诊记录是否存在,不存在就alert提示,确认之后回到首页。
const onClose = () => {
  return showDialog({
    title: '温馨提示',
    message: '取消支付将无法获得医生回复,医生接诊名额有限,是否确认关闭？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付',
    confirmButtonColor: 'var(--cp-primary)'
  })
    .then(() => {
      // 不想关闭抽屉
      return false
    })
    .catch(() => {
      // 防止有orderId后,onBeforeRouteLeave 会拦截跳转
      orderId.value = ''
      router.push('/user/consult')
      return true
    })
}
onBeforeRouteLeave(() => {
  // 离开当前路由
  if (orderId.value) return false
})

const pay = async () => {
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  showToast('跳转支付')
  if (orderId.value) {
    const res = await getConsultOrderPayUrl({
      paymentMethod: paymentMethod.value,
      orderId: orderId.value,
      payCallback: 'http://localhost:5173/room'
    })
    location.href = res.data.payUrl
  }
}
</script>

<template>
  <div class="consult-pay-page" v-if="payInfo && patient">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊{{ payInfo.payment }}元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" alt="" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-￥${payInfo.couponDeduction}`" />
      <van-cell title="积分折扣" :value="`-￥${payInfo.pointDeduction}`" />
      <van-cell
        title="实付款"
        :value="`￥${payInfo.actualPayment.toFixed(2)}`"
        class="pay-price"
      />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} | ${patient.genderValue} | ${patient.age}岁`"
      />
      <van-cell title="病情描述" :label="store.consult.illnessDesc" />
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree"
        >我已同意<span class="text">支付协议</span></van-checkbox
      >
    </div>
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      @click="openSheet"
      :loading="loading"
    />
    <!-- 支付方式抽屉 -->
    <van-action-sheet
      v-model:show="show"
      title="选择支付方式"
      :closeable="false"
      :before-close="onClose"
      :close-on-popstate="false"
    >
      <div class="pay-type">
        <p class="amount">￥{{ payInfo.actualPayment.toFixed(2) }}</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra
              ><van-checkbox :checked="paymentMethod === 0"
            /></template>
          </van-cell>
          <van-cell title="支付宝支付" @click="paymentMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra
              ><van-checkbox :checked="paymentMethod === 1"
            /></template>
          </van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button type="primary" round block @click="pay"
            >立即支付</van-button
          >
        </div>
      </div>
    </van-action-sheet>
  </div>
  <div class="consult-pay-page" v-else>
    <van-skeleton title :row="4" />
    <van-skeleton title :row="5" />
    <van-skeleton title :row="3" />
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .van-cell__title {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
