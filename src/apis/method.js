import request from '@/util/http'

export const getMethodRecordsAPI = (projectId) => {
  return request({
    url: '/methodRecords',
    method: 'GET',
    params: { projectId },
  })
}

export const getMethodChainsAPI = (record) => {
  return request({
    url: '/methodChains',
    method: 'GET',
    params: { record }, // 修正：将参数放在params对象中
  })
}

export const mermaidAPI = (record, callChainId) => {
  return request({
    url: '/mermaid',
    method: 'GET',
    params: { callChainId: callChainId, record: record },
  })
}

export const methodDetailAPI = (id, record) => {
  return request({
    url: '/methodDetail',
    method: 'GET',
    params: { id: id, record: record },
  })
}

export const getInitConfig = (projectId) => {
  return request({
    url: '/packageNames',
    method: 'GET',
    params: { projectId },
  })
}

export const recordAPI = (params) => {
  return request({
    url: '/record',
    method: 'POST',
    data: params,
  })
}
