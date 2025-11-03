import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getMethodChainsAPI,
  getMethodRecordsAPI,
  getPackageNamesAPI,
  mermaidAPI, methodDetailAPI
} from '@/apis/method.js'

export const useMethodStore = defineStore('method', () => {
  const projectId = ref()
  const setProjectId = (newParams) => {
    projectId.value = newParams
  }

  const checked=ref(false)
  const setChecked = (newParams) => {
    checked.value = newParams
  }

  const methodRecords = ref([])
  const getMethodRecords = async () => {
    const res = await getMethodRecordsAPI(projectId.value)
    methodRecords.value = res.data
  }

  const methodChains = ref([])
  const getMethodChains = async (record) => {
    const res = await getMethodChainsAPI(record)
    methodChains.value = res.data
  }

  const mermaidCode = ref('')
  const getMermaidCode = async (methodChain) => {
    const res = await mermaidAPI(projectId.value, methodChain)
    mermaidCode.value = res.data.mermaidCode
  }

  const methodDetail = ref({})
  const getMethodDetail = async (id, record) => {
    const res = await methodDetailAPI(id, record)
    methodDetail.value = res.data
  }

  const packageNames = ref([])
  const getPackageNames = async () => {
    const res = await getPackageNamesAPI(projectId.value)
    packageNames.value = res.data
  }

  return {
    projectId,
    setProjectId,
    checked,
    setChecked,
    mermaidCode,
    getMermaidCode,
    methodRecords,
    getMethodRecords,
    methodChains,
    getMethodChains,
    packageNames,
    getPackageNames,
  }
})
