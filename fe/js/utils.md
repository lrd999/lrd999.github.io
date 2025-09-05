# 工具函数

在开发中，经常会将一些常用的代码块、功能块进行封装，为的是更好的复用。此文章收录一些常用的功能函数，之后遇到的也会加入进来

### 获取随机数

```js
/* 返回 [min, max) 间的随机整数 */
const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min)
```

### 深拷贝

使用递归引用数据类型完成深拷贝，该函数只能对数组和对象进行深拷贝。

```js
/* 深拷贝 */
const deepClone = value => {
  if (value === null || typeof value !== 'object') {
    return value
  }
  let result = Array.isArray(value) ? [] : {}
  for (const key in value) {
    result[key] = deepClone(value[key])
  }
  return result
}
```

> 若要使用通用类型的深拷贝函数，可以采用 lodash 库的 [cloneDeep](https://www.lodashjs.com/docs/lodash.cloneDeep)
>
> `pnpm add lodash.cloneDeep`

### 阻塞程序运行

```js
/* 阻止 JS 运行，默认 500 毫秒*/
const delay = (duration = 500) => {
  const start = Date.now()
  while (true) {
    const now = Date.now()
    if (now - start >= duration) {
      break
    }
  }
}
```

### 异步等待一段时间

```js
const delay = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))
```

### 格式化尺寸单位

```js
/**
 * 格式化尺寸单位
 * @param {Number} kb
 * @returns {String}
 */
const formatSize = kb => {
  const units = ['KB', 'MB', 'GB', 'TB', 'PB']
  let index = 0
  for (; kb >= 1024 && index < units.length - 1; index++) {
    kb /= 1024
  }
  return `${kb.toFixed(2)} ${units[index]}`
}
```

### 格式化日期

```js
/**
 * 格式化日期
 * @param {Date|String|Number} [date] 日期对象、时间戳或日期字符串
 * @param {String} [format]
 * @returns {String|Number}
 */
const formatDate = (date = new Date(), format = 'yyyy-MM-dd HH:mm:ss') => {
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) throw new TypeError('`date` 应是一个有效日期')
  if (['t', 'timestamp'].includes(format.toLowerCase())) return d.getTime()
  const tactics = {
    yyyy: d.getFullYear(),
    MM: d.getMonth() + 1,
    dd: d.getDate(),
    HH: d.getHours(),
    mm: d.getMinutes(),
    ss: d.getSeconds(),
  }
  switch (format) {
    case 'date': format = 'yyyy-MM-dd'; break
    case 'time': format = 'HH:mm:ss'; break
    case 'datetime': format = 'yyyy-MM-dd HH:mm:ss'; break
    case 'cdate': format = 'yyyy年MM月dd日'; break
    case 'ctime': format = 'HH时mm分ss秒'; break
    case 'cdatetime': format = 'yyyy年MM月dd日 HH时mm分ss秒'; break
  }
  return format.replace(/(yyyy|MM|dd|HH|mm|ss)/g, char => (tactics[char] + '').padStart(2, '0'))
}
```

`format` 格式示例：

- `date`：同 yyyy-MM-dd
- `time`：同 HH:mm:ss
- `datetime`：同 yyyy-MM-dd HH:mm:ss
- `cdate`：同 yyyy年MM月dd日
- `ctime`：同 HH时mm分ss秒
- `cdatetime`：同 yyyy年MM月dd日 HH时mm分ss秒
- `t | timestamp`：返回时间戳

### 将文本内容下载为文件

通过使用 `Blob` 对象和创建一个下载链接来实现文件的下载。

```js
/**
 * 将文本下载为文件
 * @param {Object|String} content
 * @param {{ filename, ext, mime }} [options]
 * @param {String} options.filename 文件名
 * @param {String} options.ext 后缀名
 * @param {String} options.mime 文件的 MIME 类型
 */
const downloadStringToFile = (content, options = {}) => {
  if (!content) return
  options = Object.assign({ filename: 'file', ext: '.json', mime: 'application/json' }, options)
  if (typeof content === 'object') {
    content = JSON.stringify(content, null, 2)
  }
  if (!options.ext.startsWith('.')) {
    options.ext = '.' + options.ext
  }
  const blob = new Blob([content], { type: options.mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = options.filename
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

// 下载为 txt 文件
downloadStringToFile('今天天气不错', { ext: '.txt', mime: 'text/plain' })

// 下载为 json 文件
downloadStringToFile({ name: 'Tom' }, { ext: '.json', mime: 'application/json' })
```

### 任务分帧执行

```js
/**
 * 将任务分帧执行
 * @param {Array} tasks 任务数组
 * @param {Number} size 每次执行的任务数量
 * @param {Function} executeFn 每次任务执行的回调
 * @param {Function} onComplete 任务全部执行完成的回调
 * @returns {Function} 返回开始执行的函数
 */
const batchExecute = (tasks, size, executeFn, onComplete) => {
  let index = 0
  let rafId = null
  const run = () => {
    if (index >= tasks.length) {
      cancelAnimationFrame(rafId)
      rafId = null // 任务完成
      if (onComplete) onComplete()
      return
    }
    for (let i = 0; i < size && index < tasks.length; i++, index++) {
      executeFn(tasks[index], index)
    }
    rafId = requestAnimationFrame(run)
  }
  return () => {
    if (rafId) cancelAnimationFrame(rafId)
    index = 0
    rafId = requestAnimationFrame(run)
  }
}
```

### EventBus

EventBus 是一种通信机制，基于发布订阅设计模式。它可以在不同模块/组件之间进行通信。

```js
class EventBus {
  constructor() {
    this.store = new Map()
  }

  /** 为事件添加监听器 */
  on(name, listener) {
    if (!this.store.get(name)) this.store.set(name, new Set())
    this.store.get(name).add(listener)
  }

  /** 移除监听器，listener 不传则移除该事件的所有监听器 */
  off(name, listener) {
    if (listener) {
      const list = this.store.get(name)
      list && list.delete(listener)
    } else {
      this.store.delete(name)
    }
  }

  /** 触发事件 */
  emit(name, ...args) {
    const list = this.store.get(name)
    if (!list?.size) return
    list.forEach(listener => {
      try {
        listener(...args)
      } catch (error) {
        console.error(`执行【${name}】的监听器时发生错误`)
      }
    })
  }
}
```

### 树相关

```js
/**
 * 数组转树
 * @param {Array} arr 
 * @param {String|Number} pid 传根节点 id
 * @returns {Array}
 */
const arrToTree = (arr, pid) => {
  return arr
    .filter(item => item.pid === pid)
    .map(item => {
      const children = arrToTree(arr, item.id)
      return children.length ? { ...item, children } : { ...item }
    })
}

/**
 * 树转数组
 * @param {Array} tree 
 * @returns {Array}
 */
const treeToArr = (tree) => {
  return tree.reduce((acc, cur) => {
    acc.push(cur)
    if (cur.children?.length) acc = [...acc, ...treeToArr(cur.children)]
    return acc
  }, [])
}
```
