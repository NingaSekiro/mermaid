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
      <a-checkbox
        :checked="checkAll"
        :indeterminate="indeterminate"
        @change="$emit('checkAllChange', $event)"
      >
        录制package
      </a-checkbox>
      <a-checkbox-group
        :value="checkedList"
        :options="packageNames"
        @change="$emit('update:checkedList', $event)"
      />
      <a-switch
        :checked="recording"
        @change="$emit('update:recording', $event)"
        checked-children="录制中"
        un-checked-children="未录制"
        :disabled="recordDisabled"
      />
    </div>
  </a-card>
</template>

<script setup lang="ts">
defineProps<{
  checkAll: boolean
  indeterminate: boolean
  checkedList: string[]
  packageNames: string[]
  recording: boolean
  recordDisabled: boolean
}>()

defineEmits<{
  checkAllChange: [event: Event]
  'update:checkedList': [value: string[]]
  'update:recording': [value: boolean]
}>()
</script>

<style scoped></style>