import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockActiveMethods } from '@/test/testdata.js'

export const useMethodStore = defineStore('method', () => {
  const methods = ref(mockActiveMethods)
  const getMethods = async () => {
    // const res = await getMethodsAPI()
    // methods.value = res
  }
  return { methods, getMethods }
})
