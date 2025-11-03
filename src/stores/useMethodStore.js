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
  const getMermaidCode = async (record, methodChain) => {
    const res = await mermaidAPI(projectId.value, record, methodChain)
    mermaidCode.value = res.data.mermaidCode
  }

  /**
   * 方法详情响应数据引用
   * 存储从 methodDetailAPI 获取的调用记录详情信息
   * 对应后端 CallRecordDo 实体类结构:
   * @typedef {Object} CallRecordDo
   * @property {number} id - 调用记录ID
   * @property {number} callChainId - 调用链ID
   * @property {string} method - 方法名
   * @property {string} args - 方法参数
   * @property {string} returnValue - 返回值
   * @property {string} target - 目标对象
   * @property {string} timestamp - 时间戳
   */
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
    methodDetail,
    getMethodDetail,
    packageNames,
    getPackageNames,
  }
})
