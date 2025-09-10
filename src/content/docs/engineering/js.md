---
title: JS 工程化
---

## 兼容性

随着 ECMAScript 的不断更新，js 的功能越来越强大，而有些客户的浏览器版本十分老旧，无法支持一些 js 的新特性，而开发者往往想使用新特性进行开发，这时就需要对代码进行兼容性处理，使代码可以运行在较旧版本的浏览器中。

常用的工具有 babel 和 core-js。

### 转译器（Transpilers）

转译器是一种可以将源码转译成另一种源码的特殊的软件。它可以解析现代代码，并使用旧的语法结构对其进行重写，进而使其也可以在旧的引擎中工作。

```js
// 在运行转译器之前
const username = serverData.name ?? '游客'

// 在运行转译器之后
const username = serverData.name !== undefined && serverData.name !== null ? serverData.name : '游客'
```

[babel](https://www.babeljs.cn/) 是最著名的转译器之一。

### 垫片（Polyfills）

新的语言特性可能不仅包括语法结构和运算符，还可能包括内建函数。

由于我们谈论的是新函数，而不是语法更改，因此无需在此处转译任何内容。我们只需要声明缺失的函数。

更新/添加新函数的脚本被称为“polyfill”。它“填补”了空白并添加了缺失的实现。

```js
// 如果没有这个函数
if (!Math.trunc) {
  // 实现它
  Math.trunc = function (number) {
    return number < 0 ? Math.ceil(number) : Math.floor(number)
  }
}
```

[core-js](https://www.npmjs.com/package/core-js) 是一个流行的 polyfill 库。

### browserslist

`browserslist` 是一个工具，用来指定需要兼容的浏览器范围，一些常用的工具都会读取它的配置。[查看语法及浏览器兼容范围](https://browsersl.ist/)。

需要在 `package.json` 中指定：

```json
"browserslist": [
  "defaults and fully supports es6-module",
]
```

或者在根目录中添加 `.browserslistrc` 配置文件：

```
# Browsers that we support

defaults and fully supports es6-module
```

## 质量

## 风格
