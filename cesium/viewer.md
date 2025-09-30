# Viewer

Viewer 类是构建 Cesium 应用程序的入口，我们称其为视图容器，它承载了 Cesium 应用的所有内容。

## Widget 部件

### 默认部件

初始化 Cesium 容器时，默认会显示几个部件：

![Cesium 部件](/imgs/cesium-widgets.png)

1. Geocoder：位置查找工具，查到结果会将相机对准其位置，默认使用微软 Bing 地图。
2. HomeButton：首页按钮，点击之后跳转到默认视角。
3. SceneModePicker：选择视角模式（2D、3D、哥伦布视图）。
4. BaseLayerPicker：图层选择器。
5. NavigationHelpButton：导航帮助按钮。
6. Animation：动画组件，控制视图动画的播放速度。
7. CreditsDisplay：Cesium 版权信息。
8. Timeline：时间轴，显示当前时间，支持跳转。
9. FullscreenButton：全屏组件，点击进入全屏。

隐藏部件：

```js
const viewer = new Cesium.Viewer('cesium-container', {
  geocoder: false,
  homeButton: false,
  sceneModePicker: false,
  baseLayerPicker: false,
  navigationHelpButton: false,
  animation: false,
  // 将版权信息的容器，替换为空 div
  creditContainer: document.createElement('div'),
  timeline: false,
  fullscreenButton: false,
})
```

### 实体信息部件

图中的选择指示器（selectionIndicator）和右上角的信息框（infoBox）也是 Cesium 中的部件。

![Cesium 实体部件](/imgs/cesium-widgets-other.png)

- selectionIndicator：选中实体后，会在实体上生成一个绿色的指示器。
- infoBox：选中实体后，会显示实体的名称（entity.name）和描述（entity.description）。

在初始化 Viewer 时，也可以将 infoBox 隐藏：

```js
const viewer = new Cesium.Viewer('cesium-container', {
  infoBox: false,
})
```

## 环境

### 大气层

大气层由 Cesium 自动创建，挂载在 `viewer.scene.SkyAtmosphere` 上。

```js
const viewer = new Cesium.Viewer('cesium-container')

// 关闭大气层
viewer.scene.SkyAtmosphere = false
```

### 天空盒

Cesium 默认的天空盒是一个星空图，天空盒会随着场景的旋转而旋转。

```js
const viewer = new Cesium.Viewer('cesium-container', {
  skyBox: {
    show: true,
    // 自定义天空盒
    sources: {
      positiveX: 'skybox_px.png',
      negativeX: 'skybox_nx.png',
      positiveY: 'skybox_py.png',
      negativeY: 'skybox_ny.png',
      positiveZ: 'skybox_pz.png',
      negativeZ: 'skybox_nz.png',
    },
  },
})
```

### 太阳

太阳由 Cesium 自动创建，挂载在 `viewer.scene.sun` 上。

```js
const viewer = new Cesium.Viewer('cesium-container')

// 显示太阳
viewer.scene.sun.show = true
// 控制发光系数，值越大，光照越明显
viewer.scene.sun.glowFactor = 1
```

### 月亮

月亮由 Cesium 自动创建，挂载在 `viewer.scene.moon` 上。

```js
const viewer = new Cesium.Viewer('cesium-container')

// 显示月亮
viewer.scene.moon.show = true
// 自定义月亮材质
viewer.scene.moon.textureUrl = 1
// 将太阳作为唯一光源
viewer.scene.moon.onlySunLighting = true
```

## Camera 相机
