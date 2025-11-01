<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="doMenuClick" />
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
    key: '/mermaid',
    icon: () => h(AppstoreOutlined),
    label: '录制结果',
    title: '录制结果',
  },
  {
    key: 'sub1',
    icon: () => h(SettingOutlined),
    label: 'Navigation Three - Submenu',
    title: 'Navigation Three - Submenu',
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          {
            label: 'Option 1',
            key: 'setting:1',
          },
          {
            label: 'Option 2',
            key: 'setting:2',
          },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          {
            label: 'Option 3',
            key: 'setting:3',
          },
          {
            label: 'Option 4',
            key: 'setting:4',
          },
        ],
      },
    ],
  },
  {
    key: 'alipay',
    label: h(
      'a',
      {
        href: 'https://antdv.com',
        target: '_blank',
      },
      'Navigation Four - Link',
    ),
    title: 'Navigation Four - Link',
  },
])
</script>

<style scoped></style>
