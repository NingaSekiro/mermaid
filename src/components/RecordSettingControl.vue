<template>
  <a-card
    :bordered="false"
    title="录制设置"
    :style="{
      margin: '16px',
      background: 'linear-gradient(180deg, rgba(36,36,38,1), rgba(24,24,26,1))',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      borderRadius: '14px',
    }"
  >
    <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap">
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap">
        <a-checkbox
          :checked="settingStore.checkAll"
          :indeterminate="settingStore.indeterminate"
          @change="handleCheckAllChange"
        >
          录制package
        </a-checkbox>
        <a-checkbox-group
          :value="settingStore.checkedList"
          :options="settingStore.packageNames"
          @change="settingStore.setCheckedList($event)"
        />
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { useRecordSettingStore } from '@/stores/useRecordSettingStore'

const settingStore = useRecordSettingStore()

const handleCheckAllChange = (event: Event): void => {
  const target = event.target as HTMLInputElement
  settingStore.setCheckAll(target.checked)
}
</script>

<style scoped></style>
