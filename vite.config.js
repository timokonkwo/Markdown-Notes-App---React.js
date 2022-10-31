import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   mode: "development",
//   build: {
//     minify: false,
//     minifySyntax: false
//   }
// })

export default defineConfig({
  plugins: [reactRefresh()],
  mode: "development",
  build: {
    minify: false,
  }
});
