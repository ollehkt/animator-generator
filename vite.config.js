import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()],
//   server: {
//     https: {
//       key: fs.readFileSync('./.cert/key.pem'),
//       cert: fs.readFileSync('./.cert/cert.pem'),
//     },
//   },
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url)),
//     },
//   },
// })

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'serve') {
    return {
      plugins: [vue()],
      server: {
        host: 'localhost',
        port: 3000,
        https: {
          key: fs.readFileSync('./.cert/key.pem'),
          cert: fs.readFileSync('./.cert/cert.pem'),
        },
      },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
    }
  } else {
    return {
      plugins: [vue()],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
    }
  }
})
