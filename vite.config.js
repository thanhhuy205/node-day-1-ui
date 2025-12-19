import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/day-1-ui/", // Thay "day-1-ui" bằng tên repo GitHub của bạn
});
