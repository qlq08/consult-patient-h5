<script setup lang="ts">
import type { Message } from '@/types/room'
import { ConsultTime, MsgType } from '@/enums'
import { illnessTimeOptions, consultFlagOptions } from '@/services/constants'
import type { Image } from '@/types/consult'

import { ImagePreview } from 'vant'

defineProps<{
  list: Message[]
}>()

// 获取患病时间文字
const getIllnessTimeText = (time?: ConsultTime) => {
  return illnessTimeOptions.find((item) => item.value === time)?.label
}

// 获取是否就诊文字
const getConsultFlagText = (flag?: 0 | 1) => {
  return consultFlagOptions.find((item) => item.value === flag)?.label
}

// 预览图片
const onPreviewImage = (pictures?: Image[]) => {
  if (pictures && pictures.length) {
    // string[]
    ImagePreview(pictures.map((item) => item.url))
  }
}
</script>

<template>
  <!-- 病情描述 -->
  <template v-for="{ msgType, id, msg } in list" :key="id">
    <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom">
        <p>
          {{ msg.consultRecord?.patientInfo.name }}
          {{ msg.consultRecord?.patientInfo.genderValue }}
          {{ msg.consultRecord?.patientInfo.age }}岁
        </p>
        <p>
          {{ getIllnessTimeText(msg.consultRecord?.illnessTime) }} |
          {{ getConsultFlagText(msg.consultRecord?.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="onPreviewImage(msg.consultRecord?.pictures)"
          >点击查看</van-col
        >
      </van-row>
    </div>
    <!-- 温馨提示-通知 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 通知 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.Notify">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 发消息-文字 -->
    <div class="msg msg-to">
      <div class="content">
        <div class="time">20:12</div>
        <div class="pao">大夫你好？</div>
      </div>
      <van-image
        src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
      />
    </div>
    <!-- 发消息-图片 -->
    <div class="msg msg-to">
      <div class="content">
        <div class="time">20:12</div>
        <van-image
          fit="contain"
          src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
        />
      </div>
      <van-image
        src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
      />
    </div>
    <!-- 收消息-文字 -->
    <div class="msg msg-from">
      <van-image
        src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
      />
      <div class="content">
        <div class="time">20:12</div>
        <div class="pao">哪里不舒服</div>
      </div>
    </div>
    <!-- 收消息-图片 -->
    <div class="msg msg-from">
      <van-image
        src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
      />
      <div class="content">
        <div class="time">20:12</div>
        <van-image
          fit="contain"
          src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
        />
      </div>
    </div>
    <!-- 处方消息 -->
    <div class="msg msg-recipe">
      <div class="content">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p>原始处方 <van-icon name="arrow"></van-icon></p>
          </div>
          <p>李富贵 男 31岁 血管性头痛</p>
          <p>开方时间：2022-01-15 14:21:42</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="i in 2" :key="i">
            <div class="durg">
              <p>优赛明 维生素E乳</p>
              <p>口服，每次1袋，每天3次，用药3天</p>
            </div>
            <div class="num">x1</div>
          </div>
        </div>
        <div class="foot"><span>购买药品</span></div>
      </div>
    </div>
  </template>

  <!-- 订单取消 -->
  <div class="msg msg-tip msg-tip-cancel">
    <div class="content">
      <span>订单取消</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
