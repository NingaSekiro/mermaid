<template>
  <a-card
    :bordered="false"
    title="录制控制"
    :style="{
      margin: '16px',
      background: 'linear-gradient(180deg, rgba(36,36,38,1), rgba(24,24,26,1))',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      borderRadius: '14px',
    }"
  >
    <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap">
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap">
        <a-tooltip :title="recordDisabled ? '请先在录制设置页启用状态' : ''">
          <a-switch
            :checked="recording"
            @change="$emit('update:recording', $event)"
            checked-children="录制中"
            un-checked-children="未录制"
            :disabled="recordDisabled"
          />
        </a-tooltip>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  recording: boolean
  recordDisabled: boolean
}>()

defineEmits<{
  'update:recording': [value: boolean]
}>()
</script>

<style scoped></style>