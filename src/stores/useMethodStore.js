import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getMethodChainsAPI,
  getMethodRecordsAPI,
  getPackageNamesAPI,
  mermaidAPI,
} from '@/apis/method.js'

export const useMethodStore = defineStore('method', () => {
  const projectId = ref({})
  const setProjectId = (newParams) => {
    projectId.value = newParams
  }
  const methodRecords = ref([])
  const getMethodRecords = async (projectId) => {
    const res = await getMethodRecordsAPI(projectId)
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

  const packageNames = ref([])
  const getPackageNames = async (projectId) => {
    const res = await getPackageNamesAPI(projectId)
    packageNames.value = res.data
  }

  return {
    projectId,
    setProjectId,
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
