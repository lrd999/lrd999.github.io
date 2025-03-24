# CSS 工程化

## Less/Sass

CSS 预处理器（如 Less 和 SASS）极大地增强了 CSS 的功能，使样式编写更加模块化、可维护、复用性更强。

扩展了原声 css 的语法，如：变量、嵌套语法、mixin、运算等。提高了开发者编写样式的效率。

使用时需要配合编译器将其转为原生 css 代码。

## CSS Modules

CSS Modules 是一种让 CSS 具有局部作用域的方案，每个样式类名默认只作用于当前组件，而不会影响全局。CSS Modules 约定文件名以 .module.css 结尾：

```css
/* style.module.css */
.button {
  padding: 10px;
  border-radius: 5px;
}
```

在框架中使用：

::: code-group

```vue [Vue]
<template>
  <div :class="$style.title">Hello Vue</div>
</template>

<style module>
.title {
  color: red;
}
</style>
```

```jsx [React]
import styles from './style.module.css'

function App() {
  return <h1 className={styles.title}>Hello World</h1>
}

export default App
```

:::

## CSS in JS

CSS-in-JS 是一种将 CSS 样式直接编写在 JavaScript 代码中 的技术，通常用于 React 框架开发中。

由于使用 JS 编写，无需担心 CSS 选择器冲突，不影响全局。

[styled-components](https://www.npmjs.com/package/styled-components) 是 CSS-in-JS 方案中最流行的库之一。

```jsx
import styled from 'styled-components'

const Button = styled.button`
  padding: 10px;
  border-radius: 5px;
  &:hover {
    background-color: darkblue;
  }
`

function App() {
  return <Button>Click Me</Button>
}

export default App
```

## Tailwind CSS

## PostCSS

## StyleLint
