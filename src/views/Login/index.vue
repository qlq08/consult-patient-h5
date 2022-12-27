<script setup lang="ts">
const fn = () => console.log('组件业务')
</script>
<template>
  <div class="login-page">
    <CpNavBar title="登录" right-text="右侧按钮" @click-right="fn" />
  </div>
</template>
<style lang="scss" scoped></style>
