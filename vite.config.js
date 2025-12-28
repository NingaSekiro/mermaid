import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
        AntDesignVueResolver({ importStyle: false })
      ],
      dts: 'src/components.d.ts',
    }),
    vueDevTools(),
    viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 10240 }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 添加基础路径配置
  base: './',
  // build: {
  //   chunkSizeWarningLimit: 1200,
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes('node_modules')) {
  //           if (id.includes('/echarts')) return 'vendor-echarts'
  //           // if (id.includes('/@antv/g6') || id.includes('/@antv/g/')) return 'vendor-graph'
  //           if (id.includes('/ant-design-vue')) return 'vendor-ui'
  //           if (id.includes('/vue-router') || id.includes('/pinia') || id.includes('/vue'))
  //             return 'vendor-vue'
  //           if (id.includes('/axios')) return 'vendor-axios'
  //           return 'vendor'
  //         }
  //       },
  //     },
  //   },
  // },
})
