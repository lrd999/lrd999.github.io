# DOM 操作

DOM（文档对象模型）操作是指通过 JavaScript 代码来操作网页的结构、内容和样式。DOM 操作使您能够在页面加载后动态地更新、修改和交互网页内容，以实现更丰富的用户体验。

## createDocumentFragment

创建一个新的空白的文档片段，因为文档片段存在于内存中，并不在 DOM 树中，所以将子元素插入到文档片段时不会引起页面[回流](https://developer.mozilla.org/zh-CN/docs/Glossary/Reflow)，所以在插入大量 DOM 元素时会带来更好的性能。

```js
// 3000 个 div 元素
const elements = Array.from({ length: 3000 }, (_, i) => {
  const div = document.createElement('div')
  div.textContent = `Element ${i + 1}`
  return div
})

// 直接加入页面浏览器会不断回流，影响性能
for (const el of elements) {
  document.body.appendChild(el)
}

// 使用 fragment 加入元素
const fragment = document.createDocumentFragment()
for (const el of elements) {
  fragment.appendChild(el)
}
document.body.appendChild(fragment) // 只回流一次
```

## querySelector 和 getElementBy\*\*

浏览器有两种查询 DOM 元素的方式：

- `querySelector` 和 `querySelectorAll`
- `getElementById、getElementsByClassName` 等

两者的区别为：`querySelector` 返回的为静态集合，`getElement**` 返回的是动态集合。例如：

```js
const links = document.querySelectorAll('a')
const links2 = document.getElementsByTagName('a')

// 假设当前页面有 5 个 a 元素
console.log(links.length) // 5
console.log(links2.length) // 5

// 删除一个
document.querySelector('a.home-link').remove()

console.log(links.length) // 5
console.log(links2.length) // 4
```

- `querySelector` 和 `querySelectorAll`：返回的元素集合为 [NodeList](https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList) 类型，是一个静态集合。
- `getElementById、getElementsByClassName` 等：返回的元素集合为 [HTMLCollection](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCollection) 类型，是一个实时集合。

## 元素属性

### 获取属性

元素的属性可以通过 `element.propName` 或 `element.getAttribute('propName') ` 两种方法，例如：

```html
<input value="初始值" />

<script>
  const input = document.querySelector('input')
  console.log(input.value) // "初始值"
  console.log(input.getAttribute('value')) // "初始值"
</script>
```

它们之间有一些重要的区别：

- `element.propName` 返回的是属性的当前值
- `element.getAttribute('propName')` 无论何时都返回的是属性的初始值，即使属性已经通过 js 进行了修改。这是因为 `getAttribute` 仅仅返回 HTML 中指定的属性值，不会反映 DOM 属性的实际状态。

```html
<input value="初始值" />

<script>
  const input = document.querySelector('input')
  console.log(input.value) // "初始值"
  console.log(input.getAttribute('value')) // "初始值"

  input.value = '新的值' // 修改 input 的 value 值

  console.log(input.value) // "新的值"
  console.log(input.getAttribute('value')) // "初始值"
</script>
```

### 自定义属性

为 HTML 元素添加额外的自定义属性，这些信息通常不会影响元素的默认行为，但可以在 JavaScript 中使用。自定义属性使用`data-`前缀，后面跟上自定义的属性名。

```html
<div data-id="123" data-color="blue" class="foo">自定义元素</div>
```

使用 js 访问自定义属性：

```js
const foo = document.querySelector('.foo')

const id = foo.dataset.id // 获取自定义的 id 属性
foo.dataset.color = 'red' // 修改自定义的 color 属性
```

## 元素样式

### style 样式

元素的样式可以通过 `element.style` 或 `getComputedStyle(element)` 两种方法获取，它们的区别如下：

- **`element.style`**：获取元素的内联样式（style 属性），得到样式对象，对象中的所有样式属性均可以被赋值，赋值后会应用到元素的内联样式中
- **`getComputedStyle(element)`**：获取元素的计算样式，得到一个样式对象，该样式对象中的属性是只读的，无法被重新赋值

```js
const div = document.querySelector('div')

div.style.width = 200px

const computedStyle = getComputedStyle(div)
cnosole.log(computedStyle.width)
```

### class 类名

使用元素的 `classList` 属性操作元素的类名，这个属性是一个包含元素的所有类名的 DOMTokenList 对象

常见方法：

- **`add(class1, class2, ...)`**：向元素添加一个或多个类名
- **`remove(class1, class2, ...)`**：从元素中移除一个或多个类名
- **`toggle(class, force)`**：如果元素中包含指定的类名，则移除它；如果不包含，则添加它。如果 `force` 参数为 `true`，则强制添加类名；如果为 `false`，则强制移除类名。
- **`contains(class)`**：检查元素是否包含指定的类名，返回布尔值。
- **`item(index)`**：返回在指定索引位置的类名。
- **`replace(oldClass, newClass)`**：用新类名替换元素中的指定旧类名。

```js
const dom = document.querySelector('div')

dom.classList.add('container', 'current') // 添加两个类名
dom.classList.remove('current') // 删除类名
dom.classList.toggle('current') // 切换类名
dom.classList.contains('current') // 是否包含指定类名
dom.classList.replace('container', 'wrapper') // 将 .container 替换为 .wrapper
```

## 尺寸和位置

### 元素相对于视口的位置

`element.getBoundingClientRect()` 是一个常用的 DOM 方法，用于获取一个元素相对于视口（viewport）的位置和尺寸信息，返回一个 DOMRect 对象，该对象包含以下属性：

- `x`：元素左侧距离视口左侧的像素单位
- `y`：元素顶部距离视口顶部的像素单位
- `top`：同 `y`
- `left`：同 `x`
- `right`：元素右侧距离视口右侧的像素单位
- `bottom`：元素底部距离视口底部的像素单位
- `width`：元素宽度
- `height`：元素高度

<img src="https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect/element-box-diagram.png" style="zoom: 33%;" />

```html
<div style="width:100px;height:100px"></div>

<script>
  const div = document.querySelector('div')
  const rect = div.getBoundingClientRect()

  console.log('right:', rect.right) // 元素右侧距离视口右侧的像素单位
</script>
```

### 元素尺寸

获取元素的尺寸信息有三种方法

- `offsetWidth` 和 `offsetHeight`：返回元素的整体宽度和高度，包括边框、内边距和滚动条（如果存在）
- `clientWidth` 和 `clientHeight`：返回元素的内容框（即不包括边框和滚动条）的宽度和高度
- `element.getBoundingClientRect()`：返回一个包含位置和尺寸信息的 `DOMRect` 对象，可以从中提取宽度和高度。

```js
const div = document.querySelector('div')

const w1 = div.offsetWidth
const h1 = div.offsetHeight

const w2 = div.clientWidth
const h2 = div.clientHeight

const rect = div.getBoundingClientRect()
const w3 = rect.width
const h3 = rect.height
```

这些方法可以根据你的需求来选择：

- 需要考虑元素的整体尺寸（包括边框和滚动条），则使用 `offsetWidth` 和 `offsetHeight`
- 只关心元素的内容尺寸，不包括边框和滚动条，那么使用 `clientWidth` 和 `clientHeight`
- 需要更详细的位置和尺寸信息，包括元素的位置信息，可以使用 `getBoundingClientRect()`

### 视口尺寸

要获取视口的尺寸，可以使用以下方法：

- `document.documentElement.clientWidth` 和 `document.documentElement.clientHeight` ：获取浏览器可视区域的宽度和高度（不包括滚动条）
- `window.innerWidth` 和 `window.innerHeight`：获取浏览器可视区域的宽度和高度（包括滚动条），不包括浏览器窗口的边框、工具栏、菜单栏等浏览器 UI 元素
- `window.outerWidth` 和 `window.outerHeight`：获取浏览器窗口整体的外部宽度，包括浏览器窗口的边框和工具栏、菜单栏等浏览器 UI 元素
- `window.screen.width` 和 `window.screen.height`：获取用户屏幕的宽度和高度。这个属性对于识别用户屏幕大小，以便进行响应式设计或进行特定布局计算非常有用。

```js
console.log(document.documentElement.clientWidth)
console.log(window.innerWidth)
console.log(window.screen.width)
```
