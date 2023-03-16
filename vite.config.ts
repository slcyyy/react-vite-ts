import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import gzipPlugin from 'rollup-plugin-gzip';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // vite默认不加载.env文件的，因为这些文件需要在执行完 Vite 配置后才能确定加载哪一个
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: Number(env.VITE_DEV_PORT),
    },
    resolve: {
      alias: {
        assets: resolve(__dirname, 'src/assets'),
        pages: resolve(__dirname, 'src/pages'),
        styles: resolve(__dirname, 'src/styles'),
        store: resolve(__dirname, 'src/store'),
        components: resolve(__dirname, 'src/components'),
        utils: resolve(__dirname, 'src/utils'),
        services: resolve(__dirname, 'src/services'),
        routes: resolve(__dirname, 'src/routes'),
        lib: resolve(__dirname, 'src/lib'),
        layouts: resolve(__dirname, 'src/layouts'),
        enums: resolve(__dirname, 'src/enums'),
      },
    },
    build: {
      rollupOptions: {
        // 开启gzip
        plugins: [gzipPlugin()],
      },
    },
  };
});
