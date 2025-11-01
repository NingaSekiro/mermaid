<template>
  <div>
    <a-checkbox
      v-model:checked="state.checkAll"
      :indeterminate="state.indeterminate"
      @change="onCheckAllChange"
    >
      录制package
    </a-checkbox>
  </div>
  <a-checkbox-group v-model:value="state.checkedList" :options="methodStore.packageNames" />
</template>
<script setup>
import { onMounted, reactive, watch } from 'vue'
import { useMethodStore } from '@/stores/useMethodStore.js'

const methodStore = useMethodStore()
onMounted(async () => {
  await methodStore.getPackageNames()
  state.checkedList = [...methodStore.packageNames]
})

const state = reactive({
  indeterminate: false,
  checkAll: true,
  checkedList: [],
})
const onCheckAllChange = (e) => {
  Object.assign(state, {
    checkedList: e.target.checked ? methodStore.packageNames : [],
    indeterminate: false,
  })
}
watch(
  () => state.checkedList,
  (val) => {
    state.indeterminate = !!val.length && val.length < methodStore.packageNames.length
    state.checkAll = val.length === methodStore.packageNames.length
  },
)
</script>

<style scoped></style>
