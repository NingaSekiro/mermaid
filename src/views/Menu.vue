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
import { h, computed } from 'vue'
import { HomeOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'

const iconMap = {
  home: HomeOutlined,
  appstore: AppstoreOutlined,
  setting: SettingOutlined,
} as const

const router = useRouter()
const route = useRoute()

const routesForMenu = computed(() =>
  router
    .getRoutes()
    .filter((r) => r.meta && r.meta.title && r.name && r.meta.hidden !== true)
    .sort((a, b) => (Number(a.meta?.order ?? 0) - Number(b.meta?.order ?? 0)))
)

const items = computed(() =>
  routesForMenu.value.map((r) => {
    const IconComp = iconMap[(r.meta?.icon as keyof typeof iconMap) ?? 'home']
    return {
      key: String(r.name),
      icon: () => h(IconComp),
      label: String(r.meta?.title),
      title: String(r.meta?.title),
    }
  })
)

const current = computed(() => [String(route.name ?? '')])

const doMenuClick = ({ key }: { key: string }): void => {
  router.push({ name: key })
}
</script>

<style scoped>
:deep(.ant-menu-dark.ant-menu-horizontal) {
  border-bottom: none;
}
</style>
