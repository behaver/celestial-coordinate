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
  obTime: new JDateRepository(2462088.69, 'jde'),
  obGeoLong: 118.8167,
  t: 123.2343,
  dec: -3.3248,
  radius: 1.0324,
});

// 转换当前坐标的系统参数
hac.on({
  obGeoLong: 120,
});

// 时角
let t = hac.t.makeHACString();

// 赤纬
let dec = hac.dec.getDegrees();

// 距离
let radius = hac.radius;

// 球坐标
let sc = hac.sc;

// 观测历元
let obTime = hac.obTime;

// 观测点地理经度
let obGeoLong = hac.obGeoLong.getDegrees();
```

## API

`constructor(options)`

构造函数

* options.isContinuous 结果坐标值是否连续，默认：false

接受参数如 `from` 方法相同。

`from(options)`

设定起始天球地平坐标。

观测参数：

* options.obTime 观测历元
* options.obGeoLong 观测点地理经度，单位：度，值域：[180, 180]

坐标参数：

* options.sc 球坐标

或

* options.t 时角，单位：度，值域：[0, 360)
* options.dec 赤纬，单位：度，值域：[-90, 90]
* options.radius 坐标距离半径，值域：[10e-8, +∞)

`on(options)`

转换当前坐标所基于的系统参数

接受参数：

* options.obTime 观测历元
* options.obGeoLong 观测点地理经度

`position(options)`

设定当前系统条件下的坐标点位置

坐标参数：

* options.sc 球坐标

或

* options.t 时角，单位：度，值域：[0, 360)
* options.dec 赤纬，单位：度，值域：[-90, 90]
* options.radius 坐标距离半径，值域：[10e-8, +∞)

`get(options)`

获取指定系统参数的坐标结果

接受参数：

* options.obTime 观测历元
* options.obGeoLong 观测点地理经度

返回结果对象的属性：

* sc 球坐标
* obTime 观测历元
* obGeoLong 观测点地理经度

`get obTime()`

获取 观测历元 儒略时间对象

`get obGeoLong()`

获取 观测经度 角度对象

`get sc()`

获取 天球球坐标

`get t()`

获取 时角 角度对象

`get dec()`

获取 赤纬 角度对象

`get radius()`

获取 距离

`get isContinuous()`

获取 结果值连续性设定

`set isContinuous(value)`

设置 结果值的连续性

## 许可证书

The MIT license.