# 影像/数据

## 影像

Cesium 为用户提供了 `imageryLayerCollection` 类、 `ImageryLayer` 类及相关的 `ImageryProvider` 类来加载不同的
影像图层。

`ImageryLayer` 类用于承载 Cesium 中的影像图层，并利用 `ImageryProvider` 类为其提供的丰富的数据源在场景
中进行展示。而 `ImageryProvider` 类及其子类封装加载各种网络影像图层的接口，可以用于加载 Bing 地图、天
地图、ArcGIS 在线地图、高德地图、OSM 影像、MapBox 影像等数据源。

### OGC 地图服务

OGC 全称为 Open Geospatial Consortium（开放地理空间信息联盟），是一个非营利性的国际标准组织。它制定了数据和服务的一系列标准，GIS 厂商按照这个标准进行开发即可保证空间数据的可互操作性。

- **WMS**：网络地图服务（Web Map Service）将地图定义为地理数据的可视化表现，能够根据用户的请求返回相应的地图如，包括 PNG、GIF、JPEG 等栅格格式，以及 WebCGM 等矢量格式。

  Cesium 提供了 `WebMapServiceImageryProvider` 类来加载由 Web 地图服务服务器托管的切片影像。

- **WMTS**：Web 地图瓦片服务（Web Map Tile Server，WMTS）提供了一种采用预定义土块方法发布数字地图服务的标准化解决方案，并且弥补了 WMS 不能提供分块地图的不足。

  Cesium 提供了 `WebMapTileServiceImageryProvider` 类来加载 WMTS 切片影像。

- **TMS**：切片地图服务（Tile Map Service, TMS）又叫缓冲服务区，它定义了一些操作，而这些操作允许用户按需访问切片地图，不仅访问速度更快，还支持修改坐标系。

  Cesium 提供了 `UrlTempalteImageryProvider` 类，用于通过指定的 URL 来加载地图资源。需要注意的是：要在 TMS 的服务 URL 地址后面加上/{z}/{x}/{y}.png 才能访问切片数据。

### 天地图

[天地图服务](http://lbs.tianditu.gov.cn/server/MapService.html)采用 OGC WMTS 标准，在 Cesium 中，可以通过 [WebMapTileServiceImageryProvider](https://cesium.com/learn/ion-sdk/ref-doc/WebMapTileServiceImageryProvider.html)来加载天地图的服务。

```js
const token = '你的天地图 token'
const layer = 'img'

new Cesium.WebMapTileServiceImageryProvider({
  url: `http://t0.tianditu.gov.cn/${layer}_w/wmts?tk=${token}`,
  layer,
  style: 'default',
  tileMatrixSetID: 'w',
  format: 'tiles',
  maximumLevel: 18,
})
viewer.imageryLayers.addImageryProvider(layerProvider)
```

### TIFF 数据加载

TIFF 格式是图形图像处理中常用的格式之一，虽然该图像格式很复杂，但是由于他对图像信息的存放灵活多变，可以支持多种色彩系统，而且独立于操作统，因此得到了广泛应用，特别是在各种地理信息系统、摄影测量与遥感等行业中。TIFF 格式的应用更为广泛。

Cesium 并不能直接加载本地 TIFF 格式的影像数据，需要在 [Cesium 实验室](http://m.cesiumlab.com/cesiumlab.html) 对其进行切片处理。将常规的高程地形数据(.dem/.tif)数据，切片为 Cesium 地形格式，数据兼容 Cesium 和 UE 场景。

切成瓦片后，使用 [UrlTemplateImageryProvider](https://cesium.com/learn/ion-sdk/ref-doc/UrlTemplateImageryProvider.html) 类指定瓦片文件路径，并通过 xyz 方式加载瓦片数据。

```js
const imagery = new Cesium.UrlTemplateImageryProvider({
  url: './本地数据/{z}/{x}/{y}.png',
  fileExtension: 'png',
})

viewer.imageryLayers.addImageryProvider(imagery)
```

## 数据源

在 Cesium 中，`dataSources` 可以被理解为要可视化的实例集，其强调的是整体、批量的可视化数据，相当于 GIS 中的 layers（即图层集合）。

使用 dataSources 可以加载指定数据格式（如 [GeoJSON](https://cesium.com/learn/ion-sdk/ref-doc/GeoJsonDataSource.html)、[KML](https://cesium.com/learn/ion-sdk/ref-doc/KmlDataSource.html)、[CZML](https://cesium.com/learn/ion-sdk/ref-doc/CzmlDataSource.html) 及[自定义格式](https://cesium.com/learn/ion-sdk/ref-doc/CustomDataSource.html)）的数据。

### 分组管理实体

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

### GeoJSON 数据加载

GeoJSON 是一种对各种地理数据结构进行编码的格式，可以表示特征集合，支持点、线、面、多点、多线、多面和几何集合等类型。

Cesium 针对 JSON 数据源提供了[GeoJSONDataSource](https://cesium.com/learn/ion-sdk/ref-doc/GeoJsonDataSource.html)类，可以通过 load 方法加载 GeoJSON 对象设置相应的填充色、边框颜色、边框宽度、是否贴地等属性。SHP 数据也需要先被转换成 GeoJSON 数据再加载。

```js
const dataSource = await Cesium.GeoJsonDataSource.load('./data.json', {
  stroke: Cesium.Color.HOTPINK,
  fill: Cesium.Color.PINK,
  strokeWidth: 3,
})

viewer.dataSources.add(dataSource)
```

### KML 数据加载

.KML（Keyhole Markup Language）一种基于 XML 语法与格式，用于描述和保存地理信息（如点、线、图像、多边形、和模型等）。

Cesium 提供了 [KmlDataSource]() 类来处理 KML 数据，可以通过 load 方法加载 KML 数据。

```js
const dataSource = await Cesium.KmlDataSource.load('./facilities.kmz', {
  camera: viewer.scene.camera,
  canvas: viewer.scene.canvas,
})

viewer.dataSources.add(dataSource)
```
