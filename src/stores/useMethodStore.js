import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMethodChainsAPI, getMethodRecordsAPI, mermaidAPI } from '@/apis/method.js'

export const useMethodStore = defineStore('method', () => {
  const methodRecords = ref([])
  const getMethodRecords = async () => {
    const res = await getMethodRecordsAPI()
    methodRecords.value = res.data
  }

  const methodChains = ref([])
  const getMethodChains = async (record) => {
    const res = await getMethodChainsAPI(record)
    methodChains.value = res.data
  }

  const mermaidCode = ref('')
  const getMermaidCode = async (methodChain) => {
    const res = await mermaidAPI(methodChain)
    mermaidCode.value = res.data.mermaidCode
  }

  return { mermaidCode, getMermaidCode, methodRecords, getMethodRecords, methodChains, getMethodChains }
})
