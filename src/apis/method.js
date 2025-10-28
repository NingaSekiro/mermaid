import request from '@/util/http'

export const mermaidAPI = () => {
  return request({
    url: '/mermaid',
    method: 'GET'
  })
}