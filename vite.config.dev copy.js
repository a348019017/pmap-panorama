import { fileURLToPath, URL } from 'node:url'


import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue2 from '@vitejs/plugin-vue2'
//import { imageRequirePlugin } from 'vite-plugin-image-require'
const path = require('path')
import  nodeResolve  from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
    nodeResolve(),
    commonjs()
    // legacy({
    //   targets: ['ie >= 11'],
    //   additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: "9000",//端口
   // host: "localhost",//ip地址例如192.168.1.177
    host:true,
    open: true,//服务启动时自动在浏览器中打开应用
   // 反向代理配置
   proxy: { //配置多个代理
    '/hnlydsj': {
     target: "https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj",//例子:http://192.168.1.177:8080 或测试服务器https://xxxx.com
     changeOrigin: true,///设置访问目标地址允许跨域
     rewrite: (p) => p.replace(/^\/hnlydsj/, '')
    }
   }
  },

})


