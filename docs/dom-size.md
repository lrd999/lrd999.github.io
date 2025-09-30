# DOM 的尺寸和位置

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
