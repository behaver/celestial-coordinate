# HourAngleCoordinate

## 简介

HourAngleCoordinate 是用于处理天球时角坐标的组件。

它可以通过便捷地方法，使天球时角坐标于不同的坐标系统参数之间进行切换。也可以将当前任意天球时角坐标转换至其他天球坐标系统。

## 用例

使用 HourAngleCoordinate 组件处理天球时角坐标：

```js
const { HourAngleCoordinate } = require('@behaver/celestial-coordinate');
const { JDateRepository } = require('@behaver/jdate');

// 实例化 天球时角坐标
let hac = new HourAngleCoordinate({
  epoch: new JDateRepository(2462088.69, 'jde'),
  obGeoLong: 118.8167,
  longitude: 123.2343,
  latitude: -3.3248,
  radius: 1.0324,
});

// 转换当前坐标的系统参数
hac.on({
  obGeoLong: 120,
});

// 时角
let longitude = hac.longitude.makeHACString();

// 赤纬
let latitude = hac.latitude.getDegrees();

// 距离
let radius = hac.radius;

// 球坐标
let sc = hac.sc;

// 观测历元
let epoch = hac.epoch;

// 观测点地理经度
let obGeoLong = hac.obGeoLong.getDegrees();
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

坐标参数：

* options.sc 球坐标

或

* options.longitude 时角，单位：度
* options.latitude 赤纬，单位：度
* options.radius 坐标距离半径，值域：[10e-8, +∞)

`on(options)`

转换当前坐标所基于的系统参数

接受参数：

* options.epoch 观测历元
* options.obGeoLong 观测点地理经度

`position(options)`

设定当前系统条件下的坐标点位置

坐标参数：

* options.sc 球坐标

或

* options.longitude 时角，单位：度
* options.latitude 赤纬，单位：度
* options.radius 坐标距离半径，值域：[10e-8, +∞)

`get(options)`

获取指定系统参数的坐标结果

接受参数：

* options.epoch 观测历元
* options.obGeoLong 观测点地理经度

返回结果对象的属性：

* sc 球坐标
* epoch 观测历元
* obGeoLong 观测点地理经度

## 许可证书

The ISC license.