import { fileURLToPath, URL } from 'node:url'
const path = require('path')
import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue2 from '@vitejs/plugin-vue2'
import dts from 'vite-plugin-dts'
import commonjs from '@rollup/plugin-commonjs';

const test= {
  entry: path.resolve(__dirname, "./src/index2.js"),
  fileName: "index.js",
  formats: ['umd','es'],
  outDir:"dist2"
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    //vue2(),
    dts(),
    //commonjs()
    // legacy({
    //   targets: ['ie >= 11'],
    //   additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    // })
  ],
  server: {
      https: true,
      host:true,
      port:8088,
     },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      ...test,
      name: 'MyLib'
    },
    emptyOutDir: true,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue',"element-ui","axios","ol","cesium","@cesium/engine","@turf/turf","three"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          "three":"THREE",
          vue: 'Vue',
          "@turf/turf":"turf",
          "cesium":"Cesium",
          
        }
      }
    }
  }
})
