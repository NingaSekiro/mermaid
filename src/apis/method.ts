import request from '@/util/http'
import type { 
  MethodChainResponse, 
  MermaidResponse, 
  MethodDetailResponse,
  InitConfigResponse,
  RecordResponse,
  RecordRequest
} from '@/types/api.types.ts'

export const getMethodRecordsAPI = (projectId: string): Promise<{ data: string[] }> => {
  return request({
    url: '/methodRecords',
    method: 'GET',
    params: { projectId },
  })
}

export const getMethodChainsAPI = (record: string): Promise<{ data: MethodChainResponse }> => {
  return request({
    url: '/methodChains',
    method: 'GET',
    params: { record }, // 修正：将参数放在params对象中
  })
}

export const mermaidAPI = (record: string, callChainId: number): Promise<{ data: MermaidResponse }> => {
  return request({
    url: '/mermaid',
    method: 'GET',
    params: { callChainId: callChainId, record: record },
  })
}

export const methodDetailAPI = (id: string, record: string): Promise<{ data: MethodDetailResponse }> => {
  return request({
    url: '/methodDetail',
    method: 'GET',
    params: { id: id, record: record },
  })
}

export const getInitConfig = (projectId: string): Promise<{ data: InitConfigResponse }> => {
  return request({
    url: '/packageNames',
    method: 'GET',
    params: { projectId },
  })
}

export const recordAPI = (params: RecordRequest): Promise<{ data: RecordResponse }> => {
  return request({
    url: '/record',
    method: 'POST',
    data: params,
  })
}