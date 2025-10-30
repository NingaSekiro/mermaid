import request from '@/util/http'

export const getMethodRecordsAPI = () => {
  return request({
    url: '/methodRecords',
    method: 'GET'
  })
}

export const getMethodChainsAPI = (record) => {
  return request({
    url: '/methodChains',
    method: 'GET',
    params: { record } // 修正：将参数放在params对象中
  })
}

export const mermaidAPI = (methodChain) => {
  return request({
    url: '/mermaid',
    method: 'GET',
    params: { methodChain }
  })
}