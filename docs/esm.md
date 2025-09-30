# ES Module

模块化是为了解决在大型、复杂的应用程序中代码组织、维护和重用的问题。ESM（ECMAScript Module）是 ECMAScript 在语言层面实现的模块化标准。

### 导出（export）

通过 `export` 关键字导出一个变量（如变量、函数、类等）

```js
// user.js
export const name = '张三'

export const sayHello = () => {
  alert('你好，我是张三')
}
```

也可以将他们放在一个对象中在进行导出，两种方式的效果都是一样的，二者都是很常见的导出方式

```js
// user.js
const name = '张三'
const sayHello = () => {
  alert('你好，我是张三')
}

export { name, sayHello } // 通过对象导出
```

### 导入（import）

使用 `import` 关键字可以加载 `export` 导出的变量等

```js
import { name, sayhello } from './user.js' // 导入 user.js 中导出的 name 变量
```

**重命名导入的模块：** 使用 as 关键字可以为导入的变量重新命名，如：

```js
import { name as customName } from './user.js'
```

**提升效果：** import 导入语句会提升到整个模块的头部，首先执行。

```js
console.log(name) // '张三'
import { name } from './user.js'
```

**加载模块：** import 会将加载的模块执行一次，所以当只需要执行某个模块时，可以：

```js
import './init.js' // 将 init.js 执行一次
```

**整体导入：** 导入时，使用 `*` 指定一个对象，该模块的导出值都会加载在这个对象上

```js
import * as user from './user'

console.log(user.name)
user.sayHello()
```

### 默认导出

使用 `export default` 将一个模块进行默认导出，一个模块只能有一个默认导出

```js
// foo.js
export default function () {
  console.log('foo模块')
}
```

导入时，需要自定义一个名称接收默认导出的模块

```js
import foo from './foo.js'

foo() // 'foo模块'
```

想使用默认导出的同时，使用其它导出的变量，可以：

```js
import _, { cloneDeep, isEqual } from 'lodash'
```

### 复合写法

在一个模块中，导出另一个模块的内容，可以简写为：

```js
export { cloneDeep, isEqual } from 'lodash'
```

需要注意的是：`cloneDeep`和`isEqual`实际上并没有被导入当前模块，所以当前模块不能直接使用`cloneDeep`和`isEqual`。

**复合写法的默认导出**

```js
// 将 lodash 的默认导出向外导出为 _ 变量
export { default as _ } from 'lodash'

// 当前模块的默认导出为 lodash 的 cloneDeep 模块
export { cloneDeep as default } from 'lodash'
```

### 动态加载模块

使用 `import()` 函数动态加载模块，他返回一个 Promise

```js
// 根据条件选择需要加载哪个模块
if (Math.random() > 0.5) {
  import('./foo.js')
    .then((module) => {
      // Load Success
    })
    .catch((err) => {
      // Load Fail
    })
}
```

为了代码的清晰，建议使用 `async/await` 的形式接收 Promise

```js
const module = await import('./foo.js')
```

### import.meta

返回当前模块的元信息对象，该对象的各种属性就是当前运行的脚本的元信息。具体包含哪些属性，标准没有规定，由各个运行环境自行决定。

**import.meta.url：** 是一个只读的字符串属性，包含了当前模块文件的 URL 路径

```js
console.log(import.meta.url)
```

Node.js 环境中，`import.meta.url`返回的总是本地路径，即`file:URL`协议的字符串，比如`file:///d:/Code/foo.mjs`。

## 环境

### 浏览器

使用 `<script>` 标签引入加载 js 时，默认是同步加载，即遇到 `<script>` 标签，浏览器就停止渲染，将当前的 js 文件下载完并运行后，再继续渲染。

```html
<script src="./foo.js"></script>
```

此外，还有两种异步加载的方式：`defer` 和 `async`，浏览器遇到这两个属性的`<script>`时，就会下载文件，但不会等待它下载完成和执行，而是继续渲染

```html
<script src="./foo.js" defer></script>
<script src="./foo.js" async></script>
```

- **defer：** 等到整个页面的 DOM 结构完全生成，以及其他脚本执行完成，才会执行

- **async：** 下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染

`defer`是**渲染完再执行**，`async`是**下载完就执行**。如果有多个`defer`脚本，会按照它们在页面出现的顺序加载，而多个`async`脚本是不能保证加载顺序的。

**加载 ES Module 模块**

需要将 `<script>` 标签添加 `type="module"` 属性

```html
<script type="module">
  import foo from './foo.js'
</script>
```

对于带有`type="module"`的`<script>`，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了`<script>`标签的`defer`属性。

也可以为 ES Module 模块开启 `async` 属性，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染。使用了`async`属性，模块就不会按照在页面出现的顺序执行

### Node.js

CommonJS 模块是 Node.js 专用的模块化标准，与 ES Module 模块不兼容。

从 Node.js v13.2 版本开始，Node.js 开始支持 ESM，它要求 ES Module 模块采用 `.mjs` 文件后缀名

```js
// foo.mjs
export const name = 'Tom'
```

也可以指定 `package.json` 中的 `type` 字段

```json
{
  "type": "module"
}
```

- 设置为 `module` 后，该项目的 JS 脚本，就被解释成 ES Module 模块，而无需设置 `.mjs` 文件后缀名。

  此时，如果要使用 CommonJS 标准，需要将文件后缀名改为 `.cjs`

- 设置为 `commonjs` 或不设置 `type` 字段，该项目的 JS 脚本，就被解释成 CommonJS 模块
