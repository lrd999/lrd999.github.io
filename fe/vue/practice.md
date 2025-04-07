# 实践场景

## VueUse

[VueUse](https://www.vueusejs.com/) 是一款基于组合式 API 的函数集合。

- `useStorage`：响应式的 LocalStorage/SessionStorage。
- `useWindowSize`：响应式获取窗口尺寸。
- `useClipboard`：提供剪切、复制和粘贴与异步读写系统剪贴板的能力，读取剪切板内容需要授权。
- `useCssVar`：操作 css 变量。
- `useDark`：响应式暗黑模式。
- `useEventListener`：在挂载时使用 addEventListener 注册，在卸载时自动使用 removeEventListener 。
- `useFavicon`：响应式操作页面的 favicon 图标。
- `useFullscreen`：操作网页进入/退出全屏模式。
- `onClickOutside`：监听元素外部的点击事件，对模态框和下拉菜单很有用。
- `onLongPress`：监听元素的长按事件。
- `useRefHistory`：跟踪 ref 的更改历史，提供撤消和重做功能。
- `watchThrottled`：节流 watch。
- `watchDebounced`：防抖 watch。
- ...

## 组件二次封装

有时组件提供的接口并不一定满足我们的需求，这时我们可以通过对组件库组件的二次封装，来满足我们特殊的需求。

对于封装组件有一个大原则就是我们应该尽量保持原有组件的接口，除了我们需要封装的功能外，也保持原有组件提供的接口不变，如 props、events、slots。

可以使用 Vue 提供的一些 api 实现透传，即传递过来的属性、事件等原封不动的传递到原组件中。

**Props、Events 等**

- 模板中使用 `$attrs` 获取所有未接收的属性（指未显示声明的 props）和事件。
- script 中使用 `useAttrs`。

```vue
<template>
  <!-- 将所有属性透传给 el-input -->
  <el-input v-bind="$attrs" />
</template>
```

**插槽**

- 模板中使用 `$slots` 获取所有的插槽，它是一个对象，属性名为插槽名，属性值为插槽函数。
- script 中使用 `useSlots` 获取。

```vue
<template>
  <!-- 循环所有的插槽，并传递给 el-input -->
  <el-input>
    <template v-for="(, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
  </el-input>
</template>
```

**实例方法**

通常使用 ref 获取实例时，是想使用其方法，定义一个对象，将实例暴露的属性循环添加进对象中，再将此对象对外暴露即可。

```vue
<template>
  <!-- 为 el-input 添加阴影 -->
  <ElInput ref="inputRef" />
</template>

<script setup>
import { onMounted, reactive, useTemplateRef } from 'vue'

const inputRef = useTemplateRef('inputRef')
const inputExpose = reactive({})

onMounted(() => {
  for (const key in inputRef.value) {
    inputExpose[key] = inputRef.value[key]
  }
})

defineExpose(inputExpose)
</script>
```

综上，封装组件即可实现属性、事件、插槽透传。以下是一个二次封装 `el-input` 的例子。

```vue
<template>
  <!-- 绑定 ref，透传属性和事件 -->
  <el-input ref="inputRef" v-bind="$attrs" style="box-shadow: 0 0 12px #ccc">
    <!-- 传递插槽 -->
    <template v-for="(, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
  </el-input>
</template>

<script setup>
import { onMounted, reactive, useTemplateRef } from 'vue'

const inputRef = useTemplateRef('inputRef')
const inputExpose = reactive({})

onMounted(() => {
  // 获取 el-input 实例中暴露的属性
  for (const key in inputRef.value) {
    inputExpose[key] = inputRef.value[key]
  }
})

// 暴露方法
defineExpose(inputExpose)
</script>
```

## nProgress

[nProgress](https://ricostacruz.com/nprogress/) 是一款轻量级的页面加载进度条库，在 Vue 中，通常与 VueRouter 结合使用。

```js
import { createRouter, createWebHistory } from 'vue-router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 关闭右上角圆环加载器
nProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHistory(),
  routes: [],
})

router.beforeEach((to, from) => {
  nProgress.start() // 进度条开始加载
})

router.afterEach((to, from) => {
  nProgress.done() // 进度条结束加载
})

export default router
```

## Axios 配置

[Axios](https://www.axios-http.cn/) 是一个用于网络请求的库，它基于 Promise 对于 XMLHttpRequest 进行了封装，可以在浏览器和 Node.js 环境使用。

在 Vue 中，常常会使用它的[拦截器](https://www.axios-http.cn/docs/interceptors)，来对整个项目的网络请求进行封装，例如：请求时携带 token、响应时处理错误等。

```js
import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL, // 基本请求路径
  timeout: 5000, // 请求超时时间
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      // Authorization 为自定义的请求头，开发时需以自己项目来决定
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error),
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 此 res 为后端手动封装的消息格式，开发时需以自己项目决定
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.msg ?? '请求失败！')
      return Promise.reject(res)
    }
    return res
  },
  error => {
    ElMessage.error(error.msg ?? '请求失败！')
    return Promise.reject(error)
  },
)

export default instance
```

## ElementPlus 动态修改主题色

ElementPlus 主题色是由一个主色和几个辅色组成，辅色用于元素 hover、active、disabled 等效果。在控制台可以看到它们的 css 变量名和值。

```css
:root {
  --el-color-primary: #409eff;
  --el-color-primary-light-3: #79bbff;
  --el-color-primary-light-5: #a0cfff;
  --el-color-primary-light-7: #c6e2ff;
  --el-color-primary-light-8: #d9ecff;
  --el-color-primary-light-9: #ecf5ff;
  --el-color-primary-dark-2: #337ecc;
}
```

通过设置 css 变量改变主题色，用函数生成辅色变量，即可完成修改主题色。

其中，辅色中 light 代表与白色混合，dark 代表与黑色混合，后面的数字就代表需要混合的比率。

按比率混合颜色的函数：

```js
/**
 * 按比率混合两种颜色，类似 sass 的 mix 函数
 * @param {String} color1 十六进制颜色
 * @param {String} color2 十六进制颜色
 * @param {Number} ratio 比例 0-1
 * @returns {String} 混合后的十六进制颜色
 */
export const blendColors = (color1, color2, ratio) => {
  ratio = Math.max(0, Math.min(1, ratio))
  const hex = c => {
    const hex = c.toString(16)
    return hex.length == 1 ? '0' + hex : hex
  }
  const r = Math.ceil(parseInt(color1.substring(1, 3), 16) * ratio + parseInt(color2.substring(1, 3), 16) * (1 - ratio))
  const g = Math.ceil(parseInt(color1.substring(3, 5), 16) * ratio + parseInt(color2.substring(3, 5), 16) * (1 - ratio))
  const b = Math.ceil(parseInt(color1.substring(5, 7), 16) * ratio + parseInt(color2.substring(5, 7), 16) * (1 - ratio))
  return `#${hex(r)}${hex(g)}${hex(b)}`
}
```

示例代码：

```vue
<template>
  <el-color-picker v-model="primaryColor" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { blendColors } from '@/utils'

const primaryColor = ref('#409eff') // 默认项目主题色

watch(primaryColor, color => {
  // 修改主题色，将变量修改到 body 上，优先级大于 :root 选择器，ElementPlus 组件就会使用 body 中的变量
  document.body.style.setProperty('--el-color-primary', color)
  // 修改 dark 辅色
  document.body.style.setProperty('--el-color-primary-dark-2', blendColors('#000000', color, 0.2))
  // 循环修改剩余的 light 辅色
  ;[3, 5, 7, 8, 9].forEach(level => {
    const computedColor = blendColors('#ffffff', color, level / 10)
    document.body.style.setProperty('--el-color-primary-light-' + level, computedColor)
  })
})
</script>
```
