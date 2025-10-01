# Entity 实体

Entity 类可以在 Cesium 中快速绘制各种空间数据，比如广告牌、文本信息、平面图形、几何体、还有能够表达复杂信息的模型（`Model`）等等。还可以和时间关联，实现各种动态的可视化效果。

## 属性

通过传入属性，Cesium 就会帮我们绘制不同的图形，例如：

- `billboard`: 广告牌
- `box`: 盒子
- `corridor`: 走廊
- `cylinder`: 柱（锥）体
- `ellipse`: 椭圆
- `ellipsoid`: 椭球
- `label`: 文本标签
- `model`: 模型
- `path`: 路径
- `plain`: 平面
- `point`: 点
- `polygon`: 多边形
- `polyline`: 线
- `polylineVolume`: 走廊
- `rectangle`: 矩形
- `wall`: 墙

除了上面列出的几种`图形属性`外，Entity 还有一些控制该实体行为的一些属性：

- `id`: 实体的唯一标识，不指定时，Cesium 会自动生成。
- `name`: 实体的名称，会作为 `infoBox` 部件的标题。
- `show`: 控制实体显示与隐藏。
- `description`: 实体的描述信息，会作为 `infoBox` 部件的内容部分，支持 html 字符串。
- `properties`: 实体的属性信息，可以存放业务数据，`Cesium` 会对其进行包装，需通过 `entity.properties.getValue('some-key')` 来获取。
- `position`: 实体的位置信息，接收一个三维笛卡尔坐标系（[Cesium.Cartesian3](https://cesium.com/learn/cesiumjs/ref-doc/Cartesian3.html)）。
- `orientation`: 控制实体的朝向，如果不指定，默认指向东。
- `parent`: 设置实体的父级实体，父级实体若不可见，该实体也不可见。

## 管理

`viewer` 对象的 `entities` 是一个实体的集合，用于管理实体，比如新增、删除实体。

- `add(entity)`：添加实体，返回创建的实体。
- `contains(entity)`：判断集合中是否存在某个实体。
- `getById(id)`：通过实体 id 获取。
- `remove(entity)`：删除实体。
- `removeAll()`：删除集合中所有的实体。
- `removeById(id)`：通过指定 id 删除实体。

要渲染实体，需要通过 `viewer.entities.add()` 方法，将其添加到实体集合中；添加时可以通过 `new` 实例化 `Entity` 类，或使用`字面量`来创建实体。

::: code-group

```js [实例化]
const instance = new Cesium.Entity({
  name: 'Blue box',
  position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
  box: {
    dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
    material: Cesium.Color.BLUE,
  },
})

viewer.entities.add(instance)
```

```js [字面量]
viewer.entities.add({
  name: 'Blue box',
  position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
  box: {
    dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
    material: Cesium.Color.BLUE,
  },
})
```

:::

分组管理场景中的实体，可以创建数据源（DataSource）来添加实体。

例如，使用 `CustomDataSource` 进行管理：

```js
const dataSource = new Cesium.CustomDataSource('图片组')

dataSource.entities.add({
  name: '图片1',
  position: Cesium.Cartesian3.fromDegrees(1, 2, 0),
  billboard: {
    image: 'image1.png',
  },
})
dataSource.entities.add({
  name: '图片2',
  position: Cesium.Cartesian3.fromDegrees(2, 2, 0),
  billboard: {
    image: 'image2.png',
  },
})

viewer.dataSources.add(dataSource)
```

这样，就可以分组管理实体，比如控制某一组的实体的显示与隐藏：

```js
dataSource.show = false
```

## 图形

### billboard 广告牌

参数类型定义：[BillboardGraphics](https://cesium.com/learn/cesiumjs/ref-doc/BillboardGraphics.html#.ConstructorOptions)。广告牌用来创建一个图片，图片始终朝向屏幕。

![Billboard](/imgs/Billboard.png)

- `show`：是否显示。
- `image`：广告牌的图片地址。
- `width`：设置宽度。
- `height`：设置高度。
- `pixelOffset`：像素偏移量，就是距离设置的广告牌的位置偏移的像素，使用 [Cartesian2](https://cesium.com/learn/cesiumjs/ref-doc/Cartesian2.html) 表示。
- `eyeOffset`：坐标偏移量（米），在同一个位置设置多个广告牌时会堆叠在一起，可以调整该值，使广告牌偏移，达到每个都可见的目的。
- `color`：颜色叠加，会将广告牌图片与设置的颜色混合，如 `Cesium.Color.RED`。
- `rotation`：旋转角度，接收一个数字，代表度数。
- `scale`：缩放图片的倍数。
- `scaleByDistance`：按相机至实体的距离设置缩放比例。
  下例中，相机距离实体 100 米时缩放为 1 倍，距离 1000 米时缩放为 0.5 倍
  ```js
  new Cesium.Entity({
    position: position,
    billboard: {
      image: '/image.png',
      scaleByDistance: new Cesium.NearFarScalar(100, 1, 1000, 0.5),
    },
  })
  ```
- `sizeInMeters`：类型 Boolean，设置广告牌的尺寸是否以米为单位，设为 true 后会随场景的缩放而缩放。
- `translucencyByDistance`：按相机至实体距离设置透明度。
  下例中，相机距离实体 100 米时透明的为 1，距离 1000 米时透明的为 0.5。
  ```js
  new Cesium.Entity({
    position: position,
    billboard: {
      image: '/image.png',
      translucencyByDistance: new Cesium.NearFarScalar(100, 1, 1000, 0.5),
    },
  })
  ```
- `distanceDisplayCondition`：按相机至实体的距离设置可见性。
  下例中，相机距离实体 0 ~ 1000 米时显示，否则隐藏。
  ```js
  new Cesium.Entity({
    position: position,
    billboard: {
      image: '/image.png',
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1000),
    },
  })
  ```

### label 文本标签

参数类型定义：[LabelGraphics](https://cesium.com/learn/cesiumjs/ref-doc/LabelGraphics.html#.ConstructorOptions)

![Label](/imgs/Label.png)

- show：是否显示。
- text：文本内容，支持通过 `\n` 换行。
- font：设置 css 字体，包括大小、名称。
  ```js
  new Cesium.Entity({
    label: {
      font: '30px sans-serif',
    },
  })
  ```
- `scale`：缩放倍数。
- `fillColor`：文本颜色。
- `outlineColor`：边框颜色。
- `outlineWidth`：边框宽度，接收一个数字类型。
- `showBackground`：是否显示背景。
- `backgroundColor`：背景颜色，需要先将 `showBackground` 设为 true。
- `backgroundPadding`：背景内边距，使用 [Cartesian2](https://cesium.com/learn/cesiumjs/ref-doc/Cartesian2.html) 表示。
- `pixelOffset`：见 [billboard 广告牌](#billboard-广告牌)。
- `eyeOffset`：见 [billboard 广告牌](#billboard-广告牌)。
- `translucencyByDistance`：见 [billboard 广告牌](#billboard-广告牌)。
- `pixelOffsetScaleByDistance`：见 [billboard 广告牌](#billboard-广告牌)。
- `scaleByDistance`：见 [billboard 广告牌](#billboard-广告牌)。
- `distanceDisplayCondition`：见 [billboard 广告牌](#billboard-广告牌)。

### point 点

参数类型定义：[PointGraphics](https://cesium.com/learn/cesiumjs/ref-doc/PointGraphics.html#.ConstructorOptions)。

![Point](/imgs/Point.png)

- `show`：是否显示。
- `pixelSize`：点的像素大小。
- `outlineColor`：边框颜色。
- `outlineWidth`：边框宽度，接收一个数字类型。
- `pixelOffset`：见 [billboard 广告牌](#billboard-广告牌)。
- `eyeOffset`：见 [billboard 广告牌](#billboard-广告牌)。
- `translucencyByDistance`：见 [billboard 广告牌](#billboard-广告牌)。
- `pixelOffsetScaleByDistance`：见 [billboard 广告牌](#billboard-广告牌)。
- `scaleByDistance`：见 [billboard 广告牌](#billboard-广告牌)。
- `distanceDisplayCondition`：见 [billboard 广告牌](#billboard-广告牌)。

### polyline 线

参数类型定义：[PolylineGraphics](https://cesium.com/learn/cesiumjs/ref-doc/PolylineGraphics.html#.ConstructorOptions)。

![Polyline](/imgs/Polyline.png)

- `show`：是否显示。
- `positions`：线的坐标数组。
- `width`：线的宽度。
- `granularity`：线的粒度，每个几何图形都是由多个小三角绘制而成，粒度决定了小三角的数量，非特殊情况无需修改。
- `material`：材质。

  ```js
  // 虚线材质
  new Cesium.PolylineDashMaterialProperty({ color: Cesium.Color.BLUE })

  // 发光线条
  new Cesium.PolylineGlowMaterialProperty({
    color: Cesium.Color.RED, // 光晕颜色
    glowPower: 0.5, // 光晕强度，占线宽的百分比,
    taperPower: 0.5, // 锥形效果，类似尾迹线效果，占线长的百分比
  })

  // 带箭头的材质
  new Cesium.PolylineArrowMaterialProperty({ color: Cesium.Color.RED })

  // 带边框的材质
  new Cesium.PolylineOutlineMaterialProperty({
    color: Cesium.Color.WHITE, // 线条颜色
    outlineColor: Cesium.Color.RED, // 边框颜色
    outlineWidth: 1, // 边框宽度
  })
  ```

- `depthFailMaterial`：深度材质，被地形遮挡住时的材质。

  下例中，线的正常颜色为红色，被地形遮住的部分为黄色：

  ```js
  new Cesium.Entity({
    polyline: {
      positions: positions,
      material: Cesium.Color.RED,
      depthFailMaterial: Cesium.Color.YELLOW,
    },
  })
  ```

  ![polyline-depth-fail-material.png](/imgs/polyline-depth-fail-material.png)

- `arcType`：顶点连接方式。
- `shadows`：阴影模式

### model 模型

参数类型定义：[ModelGraphics](https://cesium.com/learn/cesiumjs/ref-doc/ModelGraphics.html#.ConstructorOptions)。用于加载 3D 模型，例如：飞机、车辆等。

<img src="/imgs/Model.png" alt="model" style="zoom: 0.7" />

- `show`：是否显示。
- `uri`：模型的地址。
- `scale`：缩放的倍数。
- `maximumScale`：最大缩放比例。
- `minimumPixelSize`：最小像素值。
- `incrementallyLoadTextures`：模型加载完成后，是否加载纹理。默认 true。
- `silhouetteSize`：轮廓宽度，接收一个数字，单位像素。
- `silhouetteColor`：轮廓颜色，给模型添加描边效果。
- `color`：模型颜色，会将模型与颜色进行混合。
- `colorBlendMode`：颜色混合模式（`HIGHLIGHT`、`REPLACE`、`MIX`），默认 `HIGHLIGHT`。
- `colorBlendAmount`：指定颜色混合的强度，0 会显示模型的本色，1 会导致模型为纯色，默认 0.5。
- `lightColor`：光源颜色，默认使用场景光源颜色。
- `distanceDisplayCondition`：指定可见距离，见 [billboard 广告牌](#billboard-广告牌)。

颜色混合可在 [Cesium 沙箱/3D 模型颜色 案例](https://sandcastle.cesium.com/?src=3D%20Models%20Coloring.html) 中在线修改，查看不同模式的效果：

<img src="/imgs/model-color.png" alt="模型颜色混合" style="zoom: 1" />

#### 朝向

加载模型时，如果不指定方向，默认指向东方。可以通过设置 `orientation` 让其指向北方，接收一个 [Quaternion 四元素](https://cesium.com/learn/cesiumjs/ref-doc/Quaternion.html)，一般会通过 [Transforms](https://cesium.com/learn/cesiumjs/ref-doc/Transforms.html) 类将我们熟悉的 [HeadingPitchRoll](https://cesium.com/learn/cesiumjs/ref-doc/HeadingPitchRoll.html) 转为四元素。

::: tip

相机设置 HeadingPitchRoll 时，`heading = 0` 时指向北方，模型中 `heading = 0` 时指向东方。

:::

```js
const position = Cesium.Cartesian3.fromDegrees(116, 40, 100)
const revise = Cesium.HeadingPitchRoll(Cesium.Math.toRadians(-90), 0, 0)

new Cesium.Entity({
  position: position,
  orientation: Cesium.Transforms.headingPitchRollQuaternion(position, revise),
  model: { uri: 'airplane.glb' },
})
```

## 材质

图形的材质类型为 [MaterialProperty](https://cesium.com/learn/cesiumjs/ref-doc/MaterialProperty.html)，这是一个接口定义，不能使用 `new` 实例化。Cesium 提供了很多内置的材质，它们内部都对 `MaterialProperty` 接口进行了实现。

如果要自定义材质也需要实现 `MaterialProperty` 接口。

### Color 颜色

使用 [ColorMaterialProperty](https://cesium.com/learn/cesiumjs/ref-doc/Color.html)设置颜色材质，支持透明度。

```js
new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
  box: {
    dimensions: new Cesium.Cartesian3(500000.0, 300000.0, 400000.0),
    // 使用 ColorMaterialProperty
    material: new Cesium.ColorMaterialProperty(Cesium.color.RED),

    // 使用 Cesium 的预定义颜色
    // Cesium 会自动包装成 ColorMaterialProperty 实例
    material: Cesium.color.RED,

    // 透明度
    material: new Cesium.Color(1, 0, 0, 0.5),

    // 使用 css 颜色
    material: Cesium.Color.fromCssColorString('#ff0000'),

    // 使用 css 透明颜色值
    material: Cesium.Color.fromCssColorString('#ff000080'),
  },
})
```

### Image 图片

[ImageMaterialProperty](https://cesium.com/learn/cesiumjs/ref-doc/ImageMaterialProperty.html) 图像材质，支持常见图片格式，同时也支持 canvas、video 等元素。

```js
new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
  box: {
    dimensions: new Cesium.Cartesian3(500000.0, 300000.0, 400000.0),
    // 使用 ImageMaterialProperty
    material: new Cesium.ImageMaterialProperty({
      image: '/assets/fire.jpeg',
      repeat: new Cesium.Cartesian2(1, 1), // 重复次数
      color: Cesium.Color.WHITE, // 颜色叠加
      transparent: true, // png 使用透明
    }),

    // 直接设置 图片路径 / HTMLImageElement / HTMLCanvasElement / HTMLVideoElement
    // Cesium 会自动包装成 ImageMaterialProperty 实例
    material: '/assets/fire.jpeg',

    // 使用 video 等 HTML 元素
    material: document.querySelector('video#cesium-material'),
  },
})
```

![图像材质](/imgs/mater-image.png)

### Checkerboard 棋盘格

[CheckerboardMaterialProperty](https://cesium.com/learn/cesiumjs/ref-doc/CheckerboardMaterialProperty.html) 棋盘材质，会生成颜色相间的颜色块，默认黑白色。

```js {6}
new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000),
  box: {
    dimensions: Cesium.Cartesian3(50000, 40000, 30000),
    // 配置棋盘
    material: new Cesium.CheckerboardMaterialProperty({
      eventColor: Cesium.Color.WHITE,
      oddColor: Cesium.Color.RED,
      repeat: new Cesium.Cartesian2(5, 5),
    }),
  },
})
```

![棋盘材质](/imgs/material-checkerboard.png)

### Stripe 条纹

[StripeMaterialProperty](https://cesium.com/learn/ion-sdk/ref-doc/StripeMaterialProperty.html) 条纹材质

```js {5}
new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000),
  box: {
    dimensions: Cesium.Cartesian3(50000, 40000, 30000),
    material: new Cesium.StripeMaterialProperty({
      // 水平 HORIZONTAL，垂直 VERTICAL，默认水平
      orientation: Cesium.StripeOrientation.HORIZONTAL,
      eventColor: Cesium.Color.WHITE,
      oddColor: Cesium.Color.RED,
      offset: 0,
      repeat: 5, // 条纹数量
    }),
  },
})
```

![条纹材质](/imgs/material-stripe.png)

### Grid 网格

[GridMaterialProperty](https://cesium.com/learn/ion-sdk/ref-doc/GridMaterialProperty.html) 网格材质。

```js {5}
new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000),
  box: {
    dimensions: Cesium.Cartesian3(50000, 40000, 30000),
    material: new Cesium.GridMaterialProperty({
      color: Cesium.Color.GREEN,
      cellAlpha: 0.2,
      lineCount: new Cesium.Cartesian2(5, 5),
      lineThickness: new Cesium.Cartesian2(2, 2),
    }),
  },
})
```

![网格材质](/imgs/material-grid.png)

### polyline 线条材质

- [PolylineDashMaterialProperty](https://cesium.com/learn/ion-sdk/ref-doc/PolylineDashMaterialProperty.html)：虚线材质。
- [PolylineGlowMaterialProperty](https://cesium.com/learn/ion-sdk/ref-doc/PolylineGlowMaterialProperty.html)：发光线条。
- [PolylineArrowMaterialProperty](https://cesium.com/learn/ion-sdk/ref-doc/PolylineArrowMaterialProperty.html)：带箭头线条。
- [PolylineOutlineMaterialProperty](https://cesium.com/learn/ion-sdk/ref-doc/PolylineOutlineMaterialProperty.html)：带边框线条。

::: code-group

```js [虚线]
viewer.entities.add({
  name: '蓝色虚线',
  polyline: {
    positions: Cesium.Cartesian3.fromDegreesArrayHeights([-75, 45, 500000, -125, 45, 500000]),
    width: 4,
    material: new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.CYAN,
    }),
  },
})
```

```js [发光线条]
viewer.entities.add({
  name: '浅蓝发光线条',
  polyline: {
    positions: Cesium.Cartesian3.fromDegreesArray([-75, 37, -125, 37]),
    width: 10,
    material: new Cesium.PolylineGlowMaterialProperty({
      glowPower: 0.2,
      taperPower: 0.5,
      color: Cesium.Color.CORNFLOWERBLUE,
    }),
  },
})
```

```js [带箭头线条]
viewer.entities.add({
  name: '紫色带箭头线条',
  polyline: {
    positions: Cesium.Cartesian3.fromDegreesArrayHeights([-75, 43, 500000, -125, 43, 500000]),
    width: 10,
    arcType: Cesium.ArcType.NONE,
    material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PURPLE),
  },
})
```

```js [带边框线条]
viewer.entities.add({
  name: '橙色带边框线条',
  polyline: {
    positions: Cesium.Cartesian3.fromDegreesArrayHeights([-75, 39, 250000, -125, 39, 250000]),
    width: 5,
    material: new Cesium.PolylineOutlineMaterialProperty({
      color: Cesium.Color.ORANGE,
      outlineWidth: 2,
      outlineColor: Cesium.Color.BLACK,
    }),
  },
})
```

:::

![线条材质](/imgs/material-polyline.png)
