<template>
  <a-card
    :bordered="false"
    :title="cardTitle"
    :style="{
      margin: '16px',
      background: 'linear-gradient(180deg, rgba(36,36,38,1), rgba(24,24,26,1))',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      borderRadius: '14px',
    }"
  >
    <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap">
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap">
        <template v-if="showSettings">
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
        </template>
        <template v-if="showSwitch">
          <a-tooltip :title="recordDisabled ? '请先在录制设置页启用状态' : ''">
            <a-switch
              :checked="recording"
              @change="$emit('update:recording', $event)"
              checked-children="录制中"
              un-checked-children="未录制"
              :disabled="recordDisabled"
            />
          </a-tooltip>
        </template>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  checkAll: boolean
  indeterminate: boolean
  checkedList: string[]
  packageNames: string[]
  recording: boolean
  recordDisabled: boolean
  showSettings?: boolean
  showSwitch?: boolean
}>()

defineEmits<{
  checkAllChange: [event: Event]
  'update:checkedList': [value: string[]]
  'update:recording': [value: boolean]
}>()

const showSettings = props.showSettings ?? true
const showSwitch = props.showSwitch ?? true

const cardTitle = computed(() => (showSettings ? '录制设置' : '录制控制'))

</script>

<style scoped></style>