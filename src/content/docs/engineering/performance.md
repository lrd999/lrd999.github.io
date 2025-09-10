---
title: 性能优化
---

## 开发环境

### 自动导入

配置 Vue、Element Plus 等库的 API 和组件按需自动导入，无需手动编写大量的 import 语句，从而提高开发效率。

安装 [unplugin-auto-import](https://www.npmjs.com/package/unplugin-auto-import)（自动导入 API）和 [unplugin-vue-components](https://www.npmjs.com/package/unplugin-vue-components)（自动导入组件）插件。

```bash
pnpm add unplugin-auto-import unplugin-vue-components -D
```

在 vite.config.js 中添加配置

```js
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default {
  plugins: [
    vue(),
    AutoImport({
      // 自动导入 vue、vue-router、pinia 的 api
      imports: ['vue', 'vue-router', 'pinia'],
      // 自动导入 element-plus 的 api
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      // 自动导入 element-plus 的组件
      resolvers: [ElementPlusResolver()],
    }),
  ],
}
```

### 依赖预构建

Vite 启动时会将 `optimizeDeps.include` 里的模块，编译成 esm 格式并缓存到 `node_modules/.vite/deps` 文件夹。如果没有缓存，Vite 会认为它是一个新的依赖包会重新加载并强制刷新页面。

但样式文件不会进行预构建，这就导致使用了组件自动导入时，需要重新构建其样式，导致页面强制刷新。所以我们将组件样式加入 Vite 预构建中，即可解决：

```js
export default {
  optimizeDeps: {
    include: ['element-plus/es/components/**/style/css'],
  },
}
```

## 生产环境

### 打包结果分析

打包后的结果分析可以帮助我们理解打包的优化情况、文件分布、体积、以及潜在的性能瓶颈。

[rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer) 是一个非常常用的工具，它可以生成一个直观的图表，帮助你分析打包文件的大小、依赖关系等。

```js
import { visualizer } from 'rollup-plugin-visualizer'

export default {
  plugins: [visualizer({ open: true })],
}
```

配置项可以自定义分析页面：

- `open`：打完包后自动打开分析页面。
- `title`：分析页面的标题。
- `gzipSize`：显示 gzip 压缩之后的体积。
- `brotliSize`：显示 br 压缩之后的体积。
- `template`：图表类型：
  - `treemap`：默认值，树图。
  - `sunburst`：旭日图。
  - `network`：网络图。
  - `raw-data`：原始数据格式。
  - `list`：列表。
  - `flamegraph`：火焰图。

### 分包策略

默认的分包策略下，打包结果会有两种情况：

1. 将从入口文件收集到的依赖分到一个 `chunk` 中。
2. 将项目中动态导入的模块（`import()`）进行单独分包。

由于第三方依赖变动频率低，所以我们可以对第三方依赖单独打包，和业务代码区分开来，浏览器可以有效缓存这些第三方依赖文件，而无需每次都重新下载。

如果没有分包，任何一次业务代码的更新都会导致整个打包文件的更新，从而使得缓存失效。

```js
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor' // 把所有的第三方依赖放到 vendor chunk
          }
        },
      },
    },
  },
}
```

也可以只将一些具体的依赖进行单独打包：

```js
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vender: ['vue', 'vue-router'], // 只将 vue、vue-router 放到 vendor chunk
        },
      },
    },
  },
}
```

### CDN 加速

使用 CDN，可以让用户从最近的服务器请求资源，能够大大的提高资源的请求获取的速度。特别是一些第三方资源库，放在 CDN 上不但可以提高资源请求速度，而且也能大大降低我们打包体积和打包速度。

首先需要在页面中引入对应的 CDN 资源，例如 jQuery。

```html {4}
<!-- /index.html -->
<body>
  <div id="app"></div>
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
  <script type="module" src="/src/main.js"></script>
</body>
```

使用 [rollup-plugin-external-globals](https://www.npmjs.com/package/rollup-plugin-external-globals) 插件告诉 rollup 指定的依赖对应的全局变量。

```js {9,12}
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ExternalGlobals from 'rollup-plugin-external-globals'

export default {
  plugins: [vue()],
  build: {
    rollupOptions: {
      external: ['jquery'], // 无需打包的库
      plugins: [
        ExternalGlobals({
          jquery: '$', // 告诉 rollup， jquery 模块的全局变量为 $
        }),
      ],
    },
  },
}
```

### 摇树优化

摇树优化（Tree shaking）指移除 JavaScript 上下文中未被使用的模块。依赖 ES Module 语法（import/export）。这个概念是由 [rollup](https://cn.rollupjs.org/introduction/#tree-shaking) 普及起来的。它是构建工具自动完成的，不需要额外配置。

摇树并不是完美的，它会在删除代码时保持保守，以确保正确运行。如果导入的模块有副作用，摇树行为不会发生。

日常开发中，我们应尽量使用 ES Module 模块化的依赖。如：使用 `lodash-es` 而不是 `lodash`。而且在使用子模块时，应使用如下写法：

```js
// ✅ 使用
import debounce from 'lodash-es/debounce'

// ❌ 而不是
import { debounce } from 'lodash-es'
```

### 代码压缩

Vite 默认使用 `esbuild`，可以配置其使用 `terser` 进行压缩。

```bash
pnpm add terser -D
```

配置 vite.config.js：

```js
export default {
  build: {
    minify: 'terser', // 启用 terser 压缩
    terserOptions: {
      compress: {
        // 移除 console 和 debugger 语句
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
}
```

`terser` 比 `esbuild` 压缩率高 1% ~ 2%；但速度比 `esbuild` 慢 20 ~ 40 倍。使用哪种来压缩，可自行斟酌决定。

#### gzip/br

使用插件 [vite-plugin-compression2](https://www.npmjs.com/package/vite-plugin-compression2) 即可完成压缩：

```js
import { compression } from 'vite-plugin-compression2'

export default {
  plugins: [
    compression({
      algorithm: 'brotliCompress', // 压缩算法，默认gzip
      include: [/\.(js)$/, /\.(css)$/], // 匹配要压缩的文件
      threshold: 10240, // 压缩超过此大小的文件,以字节为单位
      deleteOriginalAssets: true, // 是否删除源文件，只保留压缩文件
    }),
  ],
}
```
