<template>
  <RecordControl
    :checkAll="settingStore.checkAll"
    :indeterminate="settingStore.indeterminate"
    :checkedList="settingStore.checkedList"
    :packageNames="settingStore.packageNames"
    :recording="false"
    :recordDisabled="settingStore.recordDisabled"
    :showSettings="true"
    :showSwitch="false"
    @checkAllChange="onCheckAllChange"
    @update:checkedList="settingStore.setCheckedList($event)"
  />
  <a-card
    :bordered="false"
    title="自定义package"
    :style="{
      margin: '16px',
      background: 'linear-gradient(180deg, rgba(36,36,38,1), rgba(24,24,26,1))',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      borderRadius: '14px',
    }"
  >
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
      <a-input v-model:value="customInput" placeholder="输入包名，如 com.example" style="width: 320px" />
      <a-button type="primary" @click="addCustom" :disabled="!customInput.trim()">添加</a-button>
      <a-tooltip v-if="errMsg" :title="errMsg">
        <a-tag color="error">{{ errMsg }}</a-tag>
      </a-tooltip>
    </div>
    <div style="margin-top: 12px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
      <div v-for="p in settingStore.customPackages" :key="p" style="display: flex; gap: 8px; align-items: center">
        <a-checkbox
          :checked="settingStore.customCheckedList.includes(p)"
          @change="(e: any) => toggleCustom(p, e)"
        >{{ p }}</a-checkbox>
        <CloseOutlined style="cursor: pointer; color: rgba(255,255,255,0.65)" @click="removeCustom(p)" />
      </div>
    </div>
  </a-card>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import RecordControl from '@/components/RecordControl.vue'
import { useRecordSettingStore } from '@/stores/useRecordSettingStore'
import { useMethodStore } from '@/stores/useMethodStore'

const methodStore = useMethodStore()
const settingStore = useRecordSettingStore()
const customInput = ref<string>('')
const errMsg = ref<string>('')

onMounted(async () => {
  if (!methodStore.projectId) {
    const urlParams = new URLSearchParams(window.location.search)
    const paramsObject: Record<string, string> = {}
    urlParams.forEach((value, key) => {
      paramsObject[key] = value
    })
    methodStore.setProjectId(paramsObject.projectId || '')
  }
  if (settingStore.packageNames.length === 0) {
    await settingStore.init(methodStore.projectId || '')
  }
})

const onCheckAllChange = (e: Event): void => {
  const target = e.target as HTMLInputElement
  settingStore.setCheckAll(target.checked)
}

const addCustom = (): void => {
  const name = customInput.value.trim()
  errMsg.value = ''
  if (!name) return
  if (settingStore.packageNames.includes(name)) {
    errMsg.value = '与默认package重复'
    return
  }
  if (!settingStore.addCustomPackage(name)) {
    errMsg.value = '重复或非法的package名称'
    return
  }
  customInput.value = ''
}

const removeCustom = (name: string): void => {
  settingStore.removeCustomPackage(name)
}

const toggleCustom = (name: string, e: any): void => {
  const checked = e.target?.checked ?? false
  const list = new Set<string>(settingStore.customCheckedList)
  if (checked) list.add(name)
  else list.delete(name)
  settingStore.setCustomCheckedList(Array.from(list))
}
</script>


<style scoped>

</style>