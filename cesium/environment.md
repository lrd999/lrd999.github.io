

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
