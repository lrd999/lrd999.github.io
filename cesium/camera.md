# Camera 相机

[Camera](https://cesium.com/learn/ion-sdk/ref-doc/Camera.html) 主要用于控制场景的视图，相机主要由位置、方向和视锥台定义，可以通过定义相机的位置、方向角、俯仰角及翻滚角来调整视图。

## 方法

### flyTo

将相机飞入新的位置。

```js
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(116, 30, 1300000), // 终点位置
  orientation: { heading: 0, pitch: 0, roll: 0 }, // 朝向
  duration: 1, // 飞行时间（秒），默认根据航班飞行的距离自动生成
})
```

### setView

将相机定位到新的位置，没有动画。

```js
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(116, 30, 1300000), // 终点位置
  orientation: { heading: 0, pitch: 0, roll: 0 }, // 朝向
})
```

### lootAt

将相机定位到新的位置，没有动画，并且会锁定相机视角，不能通过鼠标移动场景。

```js
const position = Cesium.Cartesian3.fromDegrees(116, 30, 1300000)
const offset = new Cesium.Cartesian3(100, 100, 100)

viewer.camera.lootAt(position, offset)
```

### pickEllipsoid

将屏幕坐标转为世界坐标。例如，获取 cesium 容器中心点的世界坐标。

```js
const canvas = viewer.scene.canvas
const center = new Cesium.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight / 2)
// 传入屏幕坐标和椭球体
const position = viewer.camera.pickEllipsoid(center, viewer.scene.ellipsoid)
```

### computeViewRectangle

获取相机的可见范围。

```js
const rectangle = viewer.camera.computeViewRectangle(viewer.scene.ellipsoid)
```