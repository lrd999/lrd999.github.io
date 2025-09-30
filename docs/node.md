# Node.js

## 安装

推荐使用 nvm（Node Version Manager）管理多个 Node.js 版本。它允许你在同一台计算机上轻松地切换不同版本的 Node.js，以满足不同项目的需求。

- [Linux/macOS](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
- [Windows](https://github.com/coreybutler/nvm-windows)

```bash
# 查看 nvm 版本
nvm -v

# 安装
nvm install 22

# 卸载
nvm uninstall 22.14.0

# 使用指定版本
nvm use 22.14.0

# 查看已安装的版本
nvm list
nvm ls
```

## npm

npm（Node Package Manager） 会随 node.js 捆绑安装，用来管理 node.js 中的第三方依赖，如同 java 中的 maven。

### 配置镜像

npm 的官方镜像源位于国外，下载速度慢，有时会因此下载失败。我们可以将下载地址切换到淘宝的镜像站。

```bash
npm config set registry http://registry.npmmirror.com
```

其它镜像：

- npm：https://registry.npmjs.org/
- yarn：https://registry.yarnpkg.com/
- 腾讯：https://mirrors.cloud.tencent.com/npm/
- 淘宝：https://registry.npmmirror.com/

### nrm 管理镜像

nrm 是一个简单的 npm 镜像源管理工具，它提供了许多的镜像源，可以快速的在他们之间切换。使用 `npm i nrm -g` 来安装它。

```bash
# 查看当前使用的镜像
nrm current

# 查看所有镜像
nrm ls

# 切换镜像
nrm use taobao

# 添加镜像源,适用于企业内部定制的私有镜像
# <registry> 表示镜像名称，<url> 表示镜像地址
nrm add <registry> <url>

# 测试镜像的响应时间
nrm test taobao
```

### 常用命令

```bash
# 初始化，-y 代表跳过 cli，全部使用默认值
npm init
npm init -y

# 根据 package.json 下载依赖
npm i
npm install

# 安装依赖
npm i package-name
npm i package-name@2.5.1 # 指定版本
npm i package-name1 package-name2 package-name3 # 多包安装
npm i package-name -D # 开发阶段依赖
npm i package-name -g # 全局安装

# 卸载依赖
npm un package-name
npm uninstall package-name
```

## 基本使用

Nodejs 中的 js 文件默认使用 CommonJS 模块化规范，如要使用 ESM 规范，需在 package.json 中指定：

```json
{
  "type": "module"
}
```

运行文件

```bash
node index.js
```

导入 json 文件

::: code-group

```js [CommonJS]
const pkg = require('./package.json')
```

```js [ESM]
// ESM 中需要使用 assert 断言（node 16+）
import pkg from './package.json' assert { type: 'json' }
```

:::

## 常用内置模块

### fs 文件系统

`fs` 模块用于对文件系统进行操作。它提供了各种方法，可以用于读取、写入、修改、删除文件，操作目录，以及执行其他与文件系统相关的操作。

> `fs/promises` 是一套使用 Promise 的函数集合

```js
import fs from 'node:fs/promises'

// 读取文件
fs.readFile(path, encoding)

// 创建文件
fs.writeFile(path, data, encoding)

// 追加文件，没有就创建
fs.appendFile(path, data, encoding)

// 获取文件信息，大小、修改时间、类型（目录/文件/快捷方式）等。
fs.stat(path)
```

### path 路径

`path` 模块用于处理文件路径的字符串。它提供了一些方法来处理文件路径，使得在不同操作系统下都可以正确地操作文件路径，包括拼接、解析、规范化等。

```js
import path from 'node:path'

// 将各个路径片段连接起来，形成一个标准的文件路径。
path.join(str1, str2, ...)

// 解析各个路径片段，形成一个绝对路径，可解析 ./ 或 ../ 等。
path.resolve(str1, str2, ...)

// 解析路径，返回包含目录、文件名、扩展名等信息的对象。
path.parse(str)
```

## Express

[Express](https://expressjs.com/zh-cn/) 是一个快速、轻量的 web 服务端框架，经常用于编写临时服务器和 api 接口。

```js
const express = require('express')
const app = express()
const port = 3000 // 指定应用程序运行的端口号

// 定义路由和处理程序
app.get('/', (req, res) => {
  res.send('<h1>Hello, Express!</h1>')
})

// 启动服务器
app.listen(port, () => {
  console.log(`Express应用程序正在监听端口 ${port}`)
})
```

以上是一个最简单的 express 服务器，运行后，在浏览器输入 `http://localhost:3000` 即可看到 `Hello, Express!` 内容。

其它服务端框架：

- [koa2](https://koajs.com/)
- [hono](https://hono.dev/)