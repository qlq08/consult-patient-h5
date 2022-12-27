<script setup lang="ts">
const onClickLeft = () => {
  // 实现返回
}
const onClickRight = () => {
  // 点击右侧的文字按钮,执行的逻辑
}
</script>
<template>
  <van-nav-bar
    left-arrow
    @click="onClickLeft"
    title="标题"
    right-text="按钮"
    @click-right="onClickRight"
  />
</template>

<style lang="scss" scoped>
::v-deep() {
  // van-nav-bar_arrow {}
  // van-nav-bar_text {}
  // & 是连接符,连接上一级和下一级选择器,合并一个选择器
  .van-nav-bar {
    &_arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &_text {
      font-size: 15px;
    }
  }
}
</style>
