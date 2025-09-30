# Entity 实体

Entity 类可以在 Cesium 中快速绘制各种空间数据，比如广告牌、文本信息、平面图形、几何体、还有能够表达复杂信息的模型（`Model`）等等。还可以和时间关联，实现各种动态的可视化效果。

## 属性

通过传入属性，Cesium 就会帮我们绘制不同的图形，例如：

- billboard: 广告牌
- box: 盒子
- corridor: 走廊
- cylinder: 柱（锥）体
- ellipse: 椭圆
- ellipsoid: 椭球
- label: 文本标签
- model: 模型
- path: 路径
- plain: 平面
- point: 点
- polygon: 多边形
- polyline: 线
- polylineVolume: 走廊
- rectangle: 矩形
- wall: 墙

除了上面列出的几种`图形属性`外，Entity 还有一些控制该实体行为的一些属性：

- id: 实体的唯一标识，不指定时，Cesium 会自动生成。
- name: 实体的名称，会作为 `infoBox` 部件的标题。
- show: 控制实体显示与隐藏。
- description: 实体的描述信息，会作为 `infoBox` 部件的内容部分，支持 html 字符串。
- properties: 实体的属性信息，可以存放业务数据，`Cesium` 会对其进行包装，需通过 `entity.properties.getValue('some-key')` 来获取。
- position: 实体的位置信息，接收一个三维笛卡尔坐标系（Cesium.Cartesian3）。
- orientation: 控制实体的朝向，如果不指定，默认指向东。
- parent: 设置实体的父级实体，父级实体若不可见，该实体也不可见。

## 创建方式

通过 `new` 实例化 `Entity` 类，或使用`字面量`来创建实体。

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

要渲染实体，需要通过 `viewer.entities.add()` 方法，将其添加到实体集合中。

## 管理

`viewer` 对象的 `entities` 是一个实体的集合，用于管理实体，比如新增、删除实体。

- `add(entity)`：添加实体，返回创建的实体。
- `contains(entity)`：判断集合中是否存在某个实体。
- `getById(id)`：通过实体 id 获取。
- `remove(entity)`：删除实体。
- `removeAll()`：删除集合中所有的实体。
- `removeById(id)`：通过指定 id 删除实体。

想要分类管理场景中的实体对象时，可以使用数据源（DataSource）来分组 管理场景中的实体。DataSource 是一个接口定义，不能直接使用，可以使用 `CustomDataSource` 进行管理。

```js
const dataSource = new Cesium.CustomDataSource('customGroup')

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
