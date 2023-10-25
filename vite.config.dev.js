import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue2 from '@vitejs/plugin-vue2'
import eslint from 'vite-plugin-eslint2';
import * as fs from "node:fs"


// import Components from 'unplugin-vue-components/vite'
// import { ElementUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Components({
    //   resolvers: [ElementUiResolver()],
    // }),
    eslint({include: ['src/utils/measureutils.js']}),
    vue2(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    //https: true,
    https: {
      key:fs.readFileSync('./ssl/ponggis.xyz.key'),
      cert:fs.readFileSync('./ssl/ponggis.xyz_bundle.crt')
        },
        proxy: { //配置多个代理
          '/pano': {
           target: "https://222.143.144.54:8121/pano",//例子:http://192.168.1.177:8080 或测试服务器https://xxxx.com
           changeOrigin: true,///设置访问目标地址允许跨域
           secure:false,
           rewrite: (p) => p.replace(/^\/pano/, '')
          }
         }
   },
})

