import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/features": resolve(__dirname, "src/features"),
      "@/shared": resolve(__dirname, "src/shared"),
      "@/services": resolve(__dirname, "src/services"),
      "@/app": resolve(__dirname, "src/app"),
    },
  },
});
