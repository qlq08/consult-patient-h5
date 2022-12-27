<script setup lang="ts">
// as给组件取别名
import { Button as VanButton, Checkbox as VanCheckbox } from 'vant'
</script>
<template>
  <div class="login-page">
    <van-button>按钮</van-button>
    <van-button type="primary">按钮</van-button>
    <van-checkbox>复选框</van-checkbox>
  </div>
</template>
<style lang="scss" scoped></style>
