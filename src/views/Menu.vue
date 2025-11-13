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
<script setup>
import { h, ref } from 'vue'
import { HomeOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const doMenuClick = ({key}) => {
  router.push({
    path: key,
  })
}

const current = ref(['mail'])
const items = ref([
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
