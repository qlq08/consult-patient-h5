<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  disabled: true
}>()
const emit = defineEmits<{
  (e: 'send-text', text: string): void
}>()
const text = ref('')
const onSendText = () => {
  if (text.value) {
    emit('send-text', text.value)
    text.value = ''
  }
}
</script>

<template>
  <div class="room-action">
    <van-field
      type="text"
      class="input"
      :border="false"
      :disabled="disabled"
      placeholder="问医生"
      v-model="text"
      @keyup.enter="onSendText"
      autocomplete="off"
    ></van-field>
    <!-- 不预览，使用小图标作为上传按钮 -->
    <van-uploader :preview-image="false" :disabled="disabled">
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
