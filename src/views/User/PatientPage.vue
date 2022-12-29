<script setup lang="ts">
import { getPatientList, addPatient, updatePatient } from '@/services/user'
import type { Patient } from '@/types/user'
import { showToast } from 'vant'
import Validator from 'id-validator'
import { onMounted, ref, computed } from 'vue'

// 1.页面初始化加载数据
const list = ref<Patient[]>([])
const getList = async () => {
  const res = await getPatientList()
  list.value = res.data
}
onMounted(() => {
  getList()
})

// 侧边栏的相关逻辑
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]

// 侧边栏的弹出
const show = ref(false)
const showPopup = (item?: Patient) => {
  if (item) {
    // 填充表单
    const { id, idCard, name, gender, defaultFlag } = item
    patient.value = { id, idCard, name, gender, defaultFlag }
  } else {
    // 重置表单
    patient.value = { ...initPatient }
  }
  show.value = true
}

// 表单数据
const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}

const patient = ref<Patient>({ ...initPatient })

// 默认就诊人: 选中是 1 不选中是 0
// 获取值: 判断如果defaultFlag 是 1 绑定的值就是 true 否则是 false
// 设置值:如果复选框的值是 true defaultFlag的值就是1 否则是0
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1
  },
  set(val) {
    patient.value.defaultFlag = val ? 1 : 0
  }
})

// 表单提交
const submit = async () => {
  if (!patient.value.name) return showToast('请输入姓名')
  if (!patient.value.idCard) return showToast('请输入身份证号')
  // 校验身份证号
  const validate = new Validator()
  if (!validate.isValid(patient.value.idCard))
    return showToast('身份证号不正确')
  const info = validate.getInfo(patient.value.idCard)
  if (info.sex !== patient.value.gender) return showToast('性别与身份不符')

  // 添加逻辑 合并 编辑逻辑
  patient.value.id
    ? await updatePatient(patient.value)
    : await addPatient(patient.value)
  // 成功
  show.value = false
  showToast(patient.value.id ? '编辑患者成功' : '添加患者成功')
}

// 编辑操作
// 1. 还是在同一个popup实现，只是改一下标题,填充下表单
// 2. 点击保存的时候,判断下当前是编辑还是添加,发不同请求
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案" />
    <div class="patient-list">
      <div class="patient-item" v-for="item in list" :key="item.id">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '$1******$2')
          }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}</span>
        </div>
        <div class="icon">
          <cp-icon name="user-edit" @click="showPopup(item)" />
        </div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" v-if="list.length < 6" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- 弹出层 -->
    <van-popup v-model:show="show" position="right">
      <cp-nav-bar
        :back="() => (show = false)"
        :title="patient.id ? '编辑患者' : '添加患者'"
        right-text="保存"
        @click-right="submit"
      ></cp-nav-bar>
      <van-form autocomplete="off">
        <van-field
          v-model="patient.name"
          label="真实姓名"
          placeholder="请输入真实姓名"
        />
        <van-field
          v-model="patient.idCard"
          label="身份证号"
          placeholder="请输入身份证号"
        />
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox v-model="defaultFlag" round />
          </template>
        </van-field>
      </van-form>
    </van-popup>
  </div>
</template>
<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transform-origin: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-style: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-style: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
</style>
