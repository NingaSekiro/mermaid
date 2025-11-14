import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  getMethodChainsAPI, 
  getMethodRecordsAPI, 
  mermaidAPI, 
  methodDetailAPI 
} from '@/apis/method.js'
import type { 
  MethodChainResponse, 
  MethodDetailResponse 
} from '@/types/api.types.ts'

export const useMethodStore = defineStore('method', () => {
  const projectId = ref<string>()
  const setProjectId = (newParams: string): void => {
    projectId.value = newParams
  }

  const methodRecords = ref<string[]>([])
  const getMethodRecords = async (): Promise<void> => {
    const res = await getMethodRecordsAPI(projectId.value!)
    if (Array.isArray(res.data)) {
      methodRecords.value = res.data
    } else {
      methodRecords.value = [res.data as string]
    }
  }

  const methodChains = ref<MethodChainResponse[]>([])
  const getMethodChains = async (record: string): Promise<void> => {
    const res = await getMethodChainsAPI(record)
    if (Array.isArray(res.data)) {
      methodChains.value = res.data
    } else {
      methodChains.value = [res.data]
    }
  }

  const mermaidCode = ref<string>('')
  const getMermaidCode = async (record: string, callChainId: number): Promise<void> => {
    const res = await mermaidAPI(record, callChainId)
    mermaidCode.value = res.data.mermaidCode || res.data.code
  }

  /**
   * 方法详情响应数据引用
   * 存储从 methodDetailAPI 获取的调用记录详情信息
   * 对应后端 CallRecordDo 实体类结构
   */
  const methodDetail = ref<MethodDetailResponse>({})
  const getMethodDetail = async (id: string, record: string): Promise<void> => {
    const res = await methodDetailAPI(id, record)
    methodDetail.value = res.data
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
    methodDetail,
    getMethodDetail,
  }
})