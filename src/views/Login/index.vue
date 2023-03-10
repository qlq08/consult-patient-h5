<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { showToast, type FormInstance } from 'vant'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { loginByCode, loginByPassword, sendMobileCode } from '@/services/user'
const agree = ref(false)
const show = ref(false)

// 表单的数据
const mobile = ref('')
const password = ref('')

const store = useUserStore()
const router = useRouter()
const route = useRoute()
// 同时支持 密码登录 和 短信登录
const login = async () => {
  // 当表单校验成功后触发 submit 事件 触发这个 login 函数
  if (!agree.value) return showToast('请勾选用户协议')

  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByCode(mobile.value, code.value)
  // 成功 :  存储用户信息+跳转地址+成功提示
  store.setUser(res.data)
  // 如果有回跳地址就进行回跳，没有跳转到个人中心
  router.push((route.query.returnUrl as string) || 'user')
  showToast('登录成功')
}

// 短信登录页面切换，添加短信输入框校验
const isPass = ref(true)
const code = ref('')

// 发送短信验证码
// 1. API接口调用函数
// 2. 发送短信验证码: 判断是否正在进行倒计时  校验输入框   调用短信接口
// 3. 接口成功,倒计时,组件销毁要清理定时器
const time = ref(0)
const form = ref<FormInstance | null>(null)
let timeId: number
const send = async () => {
  // 已经倒计时 time的值大于0，不能发送验证码
  if (time.value > 0) return
  // 验证不通过报错,阻止程序继续执行
  await form.value?.validate('mobile')
  // 上面的校验成功发验证码
  await sendMobileCode(mobile.value, 'login')
  time.value = 60
  showToast('发送成功')
  // 开启倒计时
  if (timeId) clearInterval(timeId)
  timeId = setInterval(() => {
    time.value--
    if (time.value <= 0) clearInterval(timeId)
  }, 1000)
}
onUnmounted(() => {
  clearInterval(timeId)
})
</script>
<template>
  <div class="login-page">
    <CpNavBar right-text="注册" @click-right="$router.push('/register')" />
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ isPass ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow" />
      </a>
    </div>
    <!-- form 表单 -->
    <van-form autocomplete="off" @submit="login" ref="form">
      <van-field
        name="mobile"
        v-model="mobile"
        :rules="mobileRules"
        type="text"
        placeholder="请输入手机号"
      />
      <van-field
        v-if="isPass"
        v-model="password"
        :rules="passwordRules"
        :type="show ? 'text' : 'password'"
        placeholder="请输入密码"
      >
        <template #button>
          <cp-icon
            @click="show = !show"
            :name="`login-eye-${show ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </van-field>
      <van-field
        v-else
        v-model="code"
        :rules="codeRules"
        placeholder="请输入验证码"
      >
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">{{
            time > 0 ? `${time}s后发送验证码` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <!-- 设置button组件为原生 submit 类型按钮 -->
        <van-button native-type="submit" block round type="primary"
          >登录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码?</a>
      </div>
    </van-form>

    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
