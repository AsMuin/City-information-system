import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import cesium from 'vite-plugin-cesium';
import {resolve} from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), cesium()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@utils': resolve(__dirname, './src/utils')
        }
    },
    server: {
        proxy: {
            '/base': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/base/, '')
            },
            '/geoserver': {
                target: 'http://localhost:8081',
                changeOrigin: true
            }
        }
    }
});
