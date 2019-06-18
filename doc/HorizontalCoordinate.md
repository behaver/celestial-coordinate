# HorizontalCoordinate

## 简介

HorizontalCoordinate 是用于处理天球地平坐标的组件。

它可以通过便捷地方法，使天球地平坐标于不同的坐标系统参数之间进行切换。也可以将当前任意天球地平坐标转换至其他天球坐标系统。

## 用例

使用 HorizontalCoordinate 组件处理天球地平坐标：

```js
const { HorizontalCoordinate } = require('@behaver/celestial-coordinate');
const { JDateRepository } = require('@behaver/jdate');

// 实例化 天球地平坐标
let hc = new HorizontalCoordinate({
  epoch: new JDateRepository(2462088.69, 'jde'),
  obGeoLong: 118.8167,
  obGeoLat: 32.067,
  longitude: 123.2343,
  latitude: -3.3248,
  radius: 1.0324,
});

// 转换当前坐标的系统参数
hc.on({
  obGeoLong: 120,
  obGeoLat: 30,
});

// 方位角
let longitude = hc.longitude.getDegrees();

// 地平高度
let latitude = hc.latitude.getDegrees();

// 距离
let radius = hc.radius;

// 球坐标
let sc = hc.sc;

// 观测历元
let epoch = hc.epoch;

// 观测点地理经度
let obGeoLong = hc.obGeoLong.getDegrees();

// 观测点地理纬度
let obGeoLat = hc.obGeoLat.getDegrees();
```

使用 HorizontalCoordinate 转换获取站心坐标 和 地心坐标，以及考虑大气折射的影响。

```js
const { HorizontalCoordinate } = require('@behaver/celestial-coordinate');
const { JDateRepository } = require('@behaver/jdate');

let time = new JDateRepository(new Date('1987/04/11 03:21:00'), 'date');

// 实例化 天球地平坐标
let hc = new HorizontalCoordinate({
  epoch: time,
  obGeoLong: 118.8167,
  obGeoLat: 32.067,
  obElevation: 1848,
  longitude: 123.2343,
  latitude: -3.3248,
  radius: 1.0324,
  centerMode: 'geocentric',
  withAR: false,
});

// 转换为站心坐标
hc.onTopocentric();

// 添加大气折射的影响
hc.patchAR();

// 转换为观测视角
hc.onObservedView();

// 去除大气折射的影响
hc.unpatchAR();

// 转换为地心坐标
hc.onGeocentric();
```

## API

### 属性

`epoch` 观测历元

`sc` 天球球坐标

`longitude` 经度

`latitude` 纬度

`radius` 中心距离

`isContinuous` 结果值连续性

`obGeoLong` 观测经度

`obGeoLat` 观测纬度

`obElevation` 观测海拔高度。单位：米

`centerMode` 中心模式

`enableAR` 大气折射功能启用状态

`withAR` 是否考虑大气折射影响

### 方法

`constructor(options)`

构造函数

* options.isContinuous 结果坐标值是否连续，默认：false

接受参数如 `from` 方法相同。

`from(options)`

设定起始天球地平坐标。

观测参数：

* options.epoch 观测历元
* options.obGeoLong 观测点地理经度，单位：度，值域：[180, 180]
* options.obGeoLat 观测点地理纬度，单位：度，值域：[-90, 90]
* options.obElevation 观测点海拔高度，单位：米
* options.centerMode 中心模式，接受：geocentric(地心坐标)、topocentric(站心坐标)

坐标参数：

* options.sc 球坐标

或

* options.longitude 方位角，单位：度
* options.latitude 地平高度，单位：度
* options.radius 坐标距离半径，值域：[10e-8, +∞)

修正参数：

* options.enableAR 大气折射修正启用状态
* options.withAR 是否包含大气折射影响

`on(options)`

转换当前坐标所基于的系统参数

观测参数：

* options.epoch 观测历元
* options.obGeoLong 观测点地理经度，单位：度，值域：[180, 180]
* options.obGeoLat 观测点地理纬度，单位：度，值域：[-90, 90]
* options.obElevation 观测点海拔高度，单位：米
* options.centerMode 中心模式，接受：geocentric(地心坐标)、topocentric(站心坐标)

修正参数：

* options.enableAR 大气折射修正启用状态
* options.withAR 是否包含大气折射影响

`position(options)`

设定当前系统条件下的坐标点位置

坐标参数：

* options.sc 球坐标

或

* options.longitude 方位角，单位：度
* options.latitude 地平高度，单位：度
* options.radius 坐标距离半径，值域：[10e-8, +∞)

`get(options)`

获取指定系统参数的坐标结果

接受参数：

* options.epoch 观测历元
* options.obGeoLong 观测点地理经度，单位：度，值域：[180, 180]
* options.obGeoLat 观测点地理纬度，单位：度，值域：[-90, 90]
* options.obElevation 观测点海拔高度，单位：米
* options.centerMode 中心模式，接受：geocentric(地心坐标)、topocentric(站心坐标)

修正参数：

* options.enableAR 大气折射修正启用状态
* options.withAR 是否包含大气折射影响

返回结果对象的属性：

* sc 球坐标
* epoch 观测历元
* obGeoLong 观测点地理经度，单位：度，值域：[180, 180]
* obGeoLat 观测点地理纬度，单位：度，值域：[-90, 90]
* obElevation 观测点海拔高度，单位：米
* centerMode 中心模式
* enableAR 大气折射修正启用状态
* withAR 是否包含大气折射影响

`onEpoch(epoch)`

转换坐标至 目标历元

`onTopocentric()`

转换坐标至站心坐标

`onGeocentric()`

转换坐标至地心坐标

`onObservedView()`

转换坐标至观测视角坐标

`patchAR()`

添加大气折射的影响

`unpatchAR()`

去除大气折射的影响

## 许可证书

The ISC license.