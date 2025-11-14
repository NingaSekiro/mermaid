<template>
  <a-menu
    v-model:selectedKeys="current"
    mode="horizontal"
    theme="dark"
    :items="items"
    @click="doMenuClick"
    style="background: transparent; border-bottom: none"
  />
</template>
<script setup lang="ts">
import { h, ref } from 'vue'
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const doMenuClick = ({key}: {key: string}): void => {
  router.push({
    path: key,
  })
}

const current = ref<string[]>(['mail'])
const items = ref<{
  key: string
  icon: () => any
  label: string
  title: string
}[]>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '录制程序',
    title: '录制程序',
  },
  {
    key: '/result',
    icon: () => h(AppstoreOutlined),
    label: '录制结果',
    title: '录制结果',
  },
])
</script>

<style scoped>
:deep(.ant-menu-dark.ant-menu-horizontal) {
  border-bottom: none;
}
</style>
