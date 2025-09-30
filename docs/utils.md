# 工具函数

在开发中，经常会将一些常用的代码块、功能块进行封装，为的是更好的复用。此文章收录一些常用的功能函数，之后遇到的也会加入进来

## 获取随机数

```js
/* 返回 [min, max) 间的随机整数 */
const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min)
```

## 深拷贝

使用递归引用数据类型完成深拷贝，该函数只能对数组和对象进行深拷贝。

```js
/**
 * 深拷贝
 * @param {*} value
 * @return {*}
 */
const deepClone = (value) => {
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

## 阻塞程序运行

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

## 异步等待一段时间

```js
/**
 * 异步等待指定时长
 * @param {Number} [ms=0] 毫秒
 */
const delay = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms))
```

## 防抖/节流

- 防抖函数：多用于 `等待用户操作` 的场景，如文本框输入、窗口 `resize` 等。
- 节流函数：多用于 `限制触发频率` 的场景，如滚动事件、按钮点击等。

::: code-group

```js [防抖]
/**
 * 防抖
 * @param {Function} func 需要防抖的函数
 * @param {Number} delay 延迟时间
 * @returns {Function} 返回防抖后的函数
 */
const debounce = (func, delay) => {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
```

```js [节流]
/**
 * 节流
 * @param {Function} func 需要节流的函数
 * @param {Number} delay 延迟时间
 * @returns {Function} 返回节流后的函数
 */
const throttle = (func, delay) => {
  let timer = null
  return (...args) => {
    func(...args)
    timer = setTimeout(() => {
      timer = null
    }, delay)
  }
}
```

:::

## 格式化尺寸单位

```js
/**
 * 格式化尺寸单位
 * @param {Number} kb
 * @returns {String}
 */
const formatSize = (kb) => {
  const units = ['KB', 'MB', 'GB', 'TB', 'PB']
  let index = 0
  for (; kb >= 1024 && index < units.length - 1; index++) {
    kb /= 1024
  }
  return `${kb.toFixed(2)} ${units[index]}`
}
```

## 格式化日期

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
    case 'date':
      format = 'yyyy-MM-dd'
      break
    case 'time':
      format = 'HH:mm:ss'
      break
    case 'datetime':
      format = 'yyyy-MM-dd HH:mm:ss'
      break
    case 'cdate':
      format = 'yyyy年MM月dd日'
      break
    case 'ctime':
      format = 'HH时mm分ss秒'
      break
    case 'cdatetime':
      format = 'yyyy年MM月dd日 HH时mm分ss秒'
      break
  }
  return format.replace(/(yyyy|MM|dd|HH|mm|ss)/g, (char) => (tactics[char] + '').padStart(2, '0'))
}
```

`format` 格式示例：

- `date`：同 yyyy-MM-dd
- `time`：同 HH:mm:ss
- `datetime`：同 yyyy-MM-dd HH:mm:ss
- `cdate`：同 yyyy 年 MM 月 dd 日
- `ctime`：同 HH 时 mm 分 ss 秒
- `cdatetime`：同 yyyy 年 MM 月 dd 日 HH 时 mm 分 ss 秒
- `t` 或 `timestamp`：返回时间戳

## 数组转树

```js
/**
 * 数组转树
 * @param {Array<{ id, parentId }>} arr 扁平化数组
 * @returns {Object | null}
 */
const arrToTree = (arr) => {
  const map = new Map()
  let root = null
  for (const item of arr) {
    map.set(item.id, { ...item, children: [] })
    if (item.parentId === null) {
      root = map.get(item.id)
    }
  }
  for (const item of arr) {
    const node = map.get(item.id)
    const parent = map.get(item.parentId)
    if (parent) {
      parent.children.push(node)
    }
  }
  return root
}
```

## 将文本下载为 `.txt` 文件

通过使用 `Blob` 对象和创建一个下载链接来实现文件的下载。

```js
/**
 * 将文本下载为文件
 * @param {Object|String} content
 * @param {String} [filename] 文件名
 */
const downloadString = (content, filename = 'file.txt') => {
  if (!content) {
    throw new Error('请检查【content】的内容')
  }
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
```

使用：

```js
downloadString('今天天气不错！') // 调起浏览器下载行为
```

## 控制异步任务并发数量

执行某一些特定任务时（如文件分片上传），会同时触发大量的异步任务请求，这时如果不加以控制，会阻塞其它正常任务执行。

使用异步并发控制器，不会阻塞其它异步任务，减少服务器压力，合理利用带宽资源。

```js
/** 异步任务调度器，控制并发数量 */
export class TaskScheduler {
  constructor(limit) {
    // 并发数量
    this.limit = limit
    // 当前运行的任务数量
    this.runningCount = 0
    // 任务队列
    this.taskQueue = []
  }

  /** 执行任务 */
  run() {
    // 如果当前运行的任务数量达到限制，或者任务队列为空，则不执行任务
    if (this.runningCount >= this.limit) return
    if (!this.taskQueue.length) return
    this.runningCount++
    const task = this.taskQueue.shift()
    // 执行任务，任务完成后，减少当前运行的任务数量，并继续执行下一个任务
    task().finally(() => {
      this.runningCount--
      this.run()
    })
  }

  /**
   * 添加任务
   * @param {Function} task 任务函数，返回一个 Promise
   * @returns {Promise} 任务执行结果的 Promise
   */
  add(task) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push(() => task().then(resolve).catch(reject))
      this.run()
    })
  }
}
```

使用：

```js
import { TaskScheduler } from '@/utils/task-scheduler'

// 限制最大并发数量为 2
const scheduler = new TaskScheduler(2)
// 模拟异步任务
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// 添加任务到调度器
scheduler.add(() => delay(1000).then(() => console.log('Task 1 completed')))
scheduler.add(() => delay(1000).then(() => console.log('Task 2 completed')))
scheduler.add(() => delay(1000).then(() => console.log('Task 3 completed')))
scheduler.add(() => delay(1000).then(() => console.log('Task 4 completed')))

/**
 * 输出结果：
 * 一秒后：完成 Task 1 completed、Task 2 completed
 * 二秒后：完成 Task 3 completed、Task 4 completed
 */
```

## 请求缓存

在某些场景下（如搜索建议、数据字典等），频繁请求同一接口会导致不必要的带宽消耗。此时可以使用请求缓存，避免重复请求。

```js
/**
 * 为请求函数创建一个带缓存的版本
 * @param {Function} fn 请求函数，返回一个 Promise
 * @param {Number} ms 缓存时间，默认 5000 毫秒
 * @returns {Function} 带缓存的请求函数
 */
export const createCacheRequest = (fn, ms = 5000) => {
  const map = {}
  return (...args) => {
    const key = JSON.stringify(args)
    // 如果缓存中有值，直接返回缓存中的 Promise，否则执行函数并缓存结果
    return (map[key] ??= fn(...args).finally(() => {
      // 在指定时间后删除缓存
      setTimeout(() => {
        delete map[key]
      }, ms)
    }))
  }
}
```

使用：

```js
// 模拟请求函数
const getUserInfo = async (id) => {
  const resp = await fetch(`/api/user/${id}`)
  return resp.json()
}

// 创建带缓存的请求函数
const cachedGetUserInfo = createCacheRequest(getUserInfo, 10000) // 缓存 10 秒

const info1 = await cachedGetUserInfo(123)
const info2 = await cachedGetUserInfo(123) // 10 秒内不会重复请求
```

## EventBus

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
    list.forEach((listener) => {
      try {
        listener(...args)
      } catch (error) {
        console.error(`执行【${name}】的监听器时发生错误`)
      }
    })
  }

  /** 执行一次后卸载监听器 */
  once(name, listener) {
    const wrapper = (...args) => {
      listener(...args)
      this.off(name, wrapper)
    }
    this.on(name, wrapper)
  }
}
```

使用：

```js
const bus = new EventBus()

const handler = () => {
  // do something
}

// 注册事件
bus.on('foo', handler)

// 在任意组件或代码中执行 handler
bus.emit('foo')

// 卸载事件
bus.off('foo', handler)
```
