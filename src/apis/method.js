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

export const mermaidAPI = (methodChain) => {
  return request({
    url: '/mermaid',
    method: 'GET',
    params: { methodChain },
  })
}

export const getPackageNamesAPI = (projectId) => {
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
