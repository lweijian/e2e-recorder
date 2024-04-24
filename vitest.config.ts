import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts"
  },
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src")
    }
  }
})
