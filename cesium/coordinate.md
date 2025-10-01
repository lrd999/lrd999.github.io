# 坐标系

## WGS84 坐标系

WGS84 坐标系（World Geodetic System 1984）是一种**大地坐标系**，即用**经度、纬度、高度**描述位置，是 GPS 使用的全球标准。

WGS84 坐标系的单位为**度**，在 Cesium 中用 [Cartographic](https://cesium.com/learn/cesiumjs/ref-doc/Cartographic.html) 类表示，由经度、纬度、高度三个分量表示，经纬和纬度的单位是弧度，高度的单位是米。

```js
new Cesium.Cartographic(longitude, latitude, height)
```

## 二维笛卡尔坐标系

数学上最常见的直角坐标系，只考虑**平面**，即**屏幕坐标**。在 Cesium 中用 [Cartesian2](https://cesium.com/learn/cesiumjs/ref-doc/Cartesian2.html) 来表示，坐标原点在 Cesium 容器（canvas）的左上角，向右为 x 轴正方形，向下为 y 轴正方向。

![二维笛卡尔坐标系](/imgs/Cartesian2.svg)

## 三维笛卡尔坐标系

空间中的直角坐标系，通常以地球质心为原点，z轴指向地球自转轴（北极），x轴穿过本初子午线与赤道交点，y轴垂直于x、z形成右手系。Cesium 中使用 [Cartesian3](https://cesium.com/learn/cesiumjs/ref-doc/Cartesian3.html) 来表示。

![三维笛卡尔坐标系](/imgs/Cartesian3.png)

## 坐标转换

### 弧度/度

WGS84 的经纬度单位是**度**，Cesium 中的经纬度单位是**弧度**，所以就需要弧度与度之间的互转。

**弧度 → 度**

```js
Cesium.Math.toDegrees(radians)
```

**度 → 弧度**

```js
Cesium.Math.toRadians(degrees)
```

### 经纬度/三维笛卡尔坐标系

经纬度转为三维笛卡尔

```js
// 度 → 笛卡尔
Cesium.Cartesian3.fromDegrees(longitude, latitude, height)

// 弧度 → 笛卡尔
Cesium.Cartesian3.fromRadians(longitude, latitude, height)
```

三维笛卡尔转为经纬度

```js
// 笛卡尔 → 弧度
Cesium.Cartographic.fromCartesian(cartesian)

// 笛卡尔 → 度，先转为弧度，再由弧度转为度
const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
const lon = Cesium.Math.toDegrees(cartographic.longitude) // 经
const lat = Cesium.Math.toDegrees(cartographic.latitude) // 纬
const alt = cartographic.height // 高
```