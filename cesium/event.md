# 事件

## 鼠标事件

Cesium 为开发者提供了一套鼠标事件的接口，封装在 [ScreenSpaceEventHandler](https://cesium.com/learn/cesiumjs/ref-doc/ScreenSpaceEventHandler.html) 类中，支持的鼠标事件类型定义在 [ScreenSpaceEventType](https://cesium.com/learn/cesiumjs/ref-doc/global.html#ScreenSpaceEventType) 中。

通过 `setInputAction(action, type, modifier)` 添加事件：

- action：事件处理函数。
- type：事件类型。
- modifier：键盘修饰符。

```js
const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)

// 点击事件
handler.setInputAction((event) => {
  console.log(event) // 事件参数，不同事件类型结果可能不同
  console.log(event.position) // 屏幕坐标
}, Cesium.ScreenSpaceEventType.LEFT_CLICK)

// 取消监听
handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
```

其它鼠标事件：

| 事件名称          | 描述     |
| ----------------- | -------- |
| LEFT_DOWN         | 左键按下 |
| LEFT_UP           | 左键抬起 |
| LEFT_CLICK        | 左键单击 |
| LEFT_DOUBLE_CLICK | 左键双击 |
| RIGHT_DOWN        | 右键按下 |
| RIGHT_UP          | 右键抬起 |
| RIGHT_CLICK       | 右键单击 |
| MIDDLE_DOWN       | 滚轮按下 |
| MIDDLE_UP         | 滚轮抬起 |
| MIDDLE_CLICK      | 滚轮点击 |
| MOUSE_MOVE        | 移动     |
| WHEEL             | 滚轮滚动 |

## 场景事件

Cesium 的场景事件都封装在 Event 类中，有三个相关方法：

- `addEventListener(listener, scope)`：注册事件，可传入 `scope` 当作 `listener` 中的 `this`。返回一个取消监听的函数。
- `raiseEvent(arguments)`：触发事件，可传入任意数量的参数。
- `removeEventListener(listener, scope)`：取消监听事件，返回是否删除的结果（boolean）。

### viewer

```js
// 选中的实体改变时触发
viewer.selectedEntityChange.addEventListener(() => {})

// 追踪的实体改变时触发
viewer.trackedEntityChanged.addEventListener(() => {})
```

### scene

```js
// 场景更新前的事件，每渲染一帧前先更新场景相关数据
viewer.scene.preUpdate.addEventListener(() => {})

// 场景更新完成事件，此时数据已更新完成
viewer.scene.postUpdate.addEventListener(() => {})

// 场景渲染前事件，每渲染一帧之前触发
viewer.scene.preRender.addEventListener(() => {})

// 场景渲染结束事件，每渲染一帧结束时触发
viewer.scene.postRender.addEventListener(() => {})

// 渲染发生错误事件
viewer.scene.renderError.addEventListener(() => {})

// 地形服务提供者改变事件
viewer.scene.terrainProviderChanged.addEventListener(() => {})
```

### camera

```js
// 相机开始移动时触发
viewer.camera.moveStart.addEventListener(() => {})

// 相机移动结束时触发
viewer.camera.moveEnd.addEventListener(() => {})

// 相机变化时触发
viewer.camera.changed.addEventListener(() => {})
```

### clock

```js
// 时钟运行时触发，触发频率和 scene.preRender 相同
viewer.clock.onTick.addEventListener(() => {})

// 时钟暂停时触发
viewer.clock.onStop.addEventListener(() => {})
```
