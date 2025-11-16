import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getInitConfig } from '@/apis/method'

export const useRecordSettingStore = defineStore('recordSetting', () => {
  const packageNames = ref<string[]>([])
  const checkedList = ref<string[]>([])
  const checkAll = ref<boolean>(true)
  const indeterminate = ref<boolean>(false)
  const recordDisabled = ref<boolean>(false)
  const projectId = ref<string>('')
  const customPackages = ref<string[]>([])
  const customCheckedList = ref<string[]>([])

  const calcState = (): void => {
    indeterminate.value = !!checkedList.value.length && checkedList.value.length < packageNames.value.length
    checkAll.value = checkedList.value.length === packageNames.value.length
  }

  const init = async (projectId: string): Promise<void> => {
    projectIdRef(projectId)
    const res = await getInitConfig(projectId)
    packageNames.value = res.data.packageNames || []
    checkedList.value = res.data.packageNames || []
    recordDisabled.value = !res.data.status
    calcState()
    loadCustom()
  }

  const setCheckedList = (list: string[]): void => {
    checkedList.value = list
    calcState()
  }

  const setCheckAll = (checked: boolean): void => {
    checkedList.value = checked ? packageNames.value.slice() : []
    indeterminate.value = false
    calcState()
  }

  const effectiveCheckedList = computed<string[]>(() => {
    const set = new Set<string>(checkedList.value)
    for (const c of customCheckedList.value) set.add(c)
    return Array.from(set)
  })

  const projectIdRef = (pid: string): void => {
    projectId.value = pid
  }

  const loadCustom = (): void => {
    try {
      const raw = localStorage.getItem(`custom-packages:${projectId.value}`)
      if (raw) {
        const obj = JSON.parse(raw) as { packages: string[]; checked: string[] }
        customPackages.value = Array.isArray(obj.packages) ? obj.packages : []
        customCheckedList.value = Array.isArray(obj.checked) ? obj.checked : []
      }
    } catch {}
  }

  const saveCustom = (): void => {
    const obj = { packages: customPackages.value, checked: customCheckedList.value }
    try {
      localStorage.setItem(`custom-packages:${projectId.value}`, JSON.stringify(obj))
    } catch {}
  }

  const addCustomPackage = (name: string): boolean => {
    const n = name.trim()
    if (!n) return false
    if (packageNames.value.includes(n)) return false
    if (customPackages.value.includes(n)) return false
    customPackages.value.push(n)
    if (!customCheckedList.value.includes(n)) {
      customCheckedList.value.push(n)
    }
    saveCustom()
    return true
  }

  const removeCustomPackage = (name: string): void => {
    const idx = customPackages.value.indexOf(name)
    if (idx >= 0) {
      customPackages.value.splice(idx, 1)
    }
    const cidx = customCheckedList.value.indexOf(name)
    if (cidx >= 0) {
      customCheckedList.value.splice(cidx, 1)
    }
    saveCustom()
  }

  const setCustomCheckedList = (list: string[]): void => {
    // 只允许选择存在于 customPackages 中的项
    const valid = list.filter((x) => customPackages.value.includes(x))
    customCheckedList.value = valid
    saveCustom()
  }

  return {
    packageNames,
    checkedList,
    checkAll,
    indeterminate,
    recordDisabled,
    projectId,
    customPackages,
    customCheckedList,
    init,
    setCheckedList,
    setCheckAll,
    effectiveCheckedList,
    addCustomPackage,
    removeCustomPackage,
    setCustomCheckedList,
  }
})