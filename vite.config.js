import { defineConfig } from 'vite';
import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import json from './src/data/pagedata.json';
import liveReload from 'vite-plugin-live-reload';

const inputHtmlArray = globSync(['src/**/*.html'], { ignore: ['node_modules/**'] }).map((file) => {
    return [path.relative('src', file.slice(0, file.length - path.extname(file).length)), fileURLToPath(new URL(file, import.meta.url))];
});
const inputObj = Object.fromEntries(inputHtmlArray);

export default defineConfig({
    root: './src',
    base: './',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        minify: false,
        cssCodeSplit: false,
        rollupOptions: {
            input: inputObj,
            output: {
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.name.split('.')[1];
                    //Webフォントファイルの振り分け
                    if (/ttf|otf|eot|woff|woff2/i.test(extType)) {
                        extType = 'fonts';
                    }
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        extType = 'images';
                    }
                    //ビルド時のCSS名を明記してコントロールする
                    if (extType === 'css') {
                        return `assets/css/style.css`;
                    }
                    return `assets/${extType}/[name][extname]`;
                },
                chunkFileNames: 'assets/js/[name].js',
                entryFileNames: 'assets/js/[name].js',
            },
        },
    },
    plugins: [liveReload(['components/*.ejs']), ViteEjsPlugin(json)],
});
