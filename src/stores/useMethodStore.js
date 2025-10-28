import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockActiveMethods } from '@/test/testdata.js'
import { mermaidAPI } from '@/apis/method.js'

export const useMethodStore = defineStore('method', () => {
  const methods = ref(mockActiveMethods)
  const getMethods = async () => {
    const res = await mermaidAPI()
    methods.value = JSON.parse(res.data)
  }
  return { methods, getMethods }
})
