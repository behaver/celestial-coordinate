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
  obTime: new JDateRepository(2462088.69, 'jde'),
  obGeoLong: 118.8167,
  obGeoLat: 32.067,
  a: 123.2343,
  h: -3.3248,
  radius: 1.0324,
});

// 转换当前坐标的系统参数
hc.on({
  obGeoLong: 120,
  obGeoLat: 30,
});

// 方位角
let a = hc.a.getDegrees();

// 地平高度
let h = hc.h.getDegrees();

// 天顶角
let z = hc.z.getDegrees();

// 距离
let radius = hc.radius;

// 球坐标
let sc = hc.sc;

// 观测历元
let obTime = hc.obTime;

// 观测点地理经度
let obGeoLong = hc.obGeoLong.getDegrees();

// 观测点地理纬度
let obGeoLat = hc.obGeoLat.getDegrees();
```

使用 HorizontalCoordinate 将天球地平坐标 转换至 其他天球坐标系统：

```js
const { HorizontalCoordinate } = require('@behaver/celestial-coordinate');
const { JDateRepository } = require('@behaver/jdate');

let time = new JDateRepository(new Date('1987/04/11 03:21:00'), 'date');

// 实例化 天球地平坐标
let hc = new HorizontalCoordinate({
  obTime: time,
  obGeoLong: 118.8167,
  obGeoLat: 32.067,
  a: 123.2343,
  h: -3.3248,
  radius: 1.0324,
});

// 转换输出天球时角坐标对象
let hac_obj = hc.toHourAngle();

// 转换输出天球赤道坐标对象
let eqc_obj = hc.toEquinoctial();

// 转换输出天球黄道坐标对象
let ecc_obj = hc.toEcliptic();

// 转换输出天球银道坐标对象
let gc_obj = hc.toGalactic();
```

使用 HorizontalCoordinate 转换获取站心坐标 和 地心坐标，以及考虑大气折射的影响。

```js
const { HorizontalCoordinate } = require('@behaver/celestial-coordinate');
const { JDateRepository } = require('@behaver/jdate');

let time = new JDateRepository(new Date('1987/04/11 03:21:00'), 'date');

// 实例化 天球地平坐标
let hc = new HorizontalCoordinate({
  obTime: time,
  obGeoLong: 118.8167,
  obGeoLat: 32.067,
  obElevation: 1848,
  a: 123.2343,
  h: -3.3248,
  radius: 1.0324,
  centerMode: 'geocentric',
  withAR: false,
});

// 转换为站心坐标
hc.onTopocentric();

// 添加大气折射的影响
hc.withAR();

// 转换为观测视角
hc.onObservedView();

// 去除大气折射的影响
hc.withoutAR();

// 转换为地心坐标
hc.onGeocentric();
```

## API

`constructor(options)`

构造函数，接受参数如 `from` 方法相同。

`from(options)`

设定起始天球地平坐标。

观测参数：

* options.obTime 观测历元
* options.obGeoLong 观测点地理经度，单位：度，值域：[180, 180]
* options.obGeoLat 观测点地理纬度，单位：度，值域：[-90, 90]
* options.obElevation 观测点海拔高度，单位：米

坐标参数：

* options.sc 球坐标

或

* options.h 地平高度，单位：度，值域：[-90, 90]
* options.z 天顶角，单位：度，值域：[0, 180]
* options.a 方位角，单位：度，值域：[0, 360)
* options.radius 坐标距离半径，值域：[10e-8, +∞)

其他参数：

* options.centerMode 中心模式，接受：geocentric(地心坐标)、topocentric(站心坐标)
* options.withAR 是否包含大气折射影响
* options.precessionModel 岁差计算模型，接受：iau2006、iau2000、iau1976
* options.nutationModel 章动计算模型，接受：iau2000b、lp

`on(options)`

转换当前坐标所基于的系统参数

接受参数：

* options.obTime 观测历元
* options.obGeoLong 观测点地理经度，单位：度，值域：[180, 180]
* options.obGeoLat 观测点地理纬度，单位：度，值域：[-90, 90]
* options.obElevation 观测点海拔高度，单位：米
* options.centerMode 中心模式，接受：geocentric(地心坐标)、topocentric(站心坐标)
* options.withAR 是否包含大气折射影响

`position(options)`

设定当前系统条件下的坐标点位置

坐标参数：

* options.sc 球坐标

或

* options.h 地平高度，单位：度，值域：[-90, 90]
* options.z 天顶角，单位：度，值域：[0, 180]
* options.a 方位角，单位：度，值域：[0, 360)
* options.radius 坐标距离半径，值域：[10e-8, +∞)

`get(options)`

获取指定系统参数的坐标结果

接受参数：

* options.obTime 观测历元
* options.obGeoLong 观测点地理经度
* options.obGeoLat 观测点地理纬度

返回结果对象的属性：

* sc 球坐标
* obTime 观测历元
* obGeoLong 观测点地理经度，单位：度，值域：[180, 180]
* obGeoLat 观测点地理纬度，单位：度，值域：[-90, 90]
* obElevation 观测点海拔高度，单位：米
* centerMode 中心模式
* withAR 是否包含大气折射影响
* precessionModel 岁差计算模型
* nutationModel 章动计算模型

`onTopocentric()`

转换坐标至站心坐标

`onGeocentric()`

转换坐标至地心坐标

`onObservedView()`

转换坐标至观测视角坐标

`withAR()`

添加大气折射的影响

`withoutAR()`

去除大气折射的影响

`to(system, options)`

转换当前坐标至目标天球系统

接受参数：

* system 目标系统
* options 系统参数

`toHourAngle()`

转换当前坐标至天球时角系统

`toEquinoctial()`

转换当前坐标至天球赤道系统

`toEcliptic()`

转换当前坐标至天球黄道系统

`toGalactic()`

转换当前坐标至天球银道系统

`get obTime()`

获取 观测历元 儒略时间对象

`get obGeoLong()`

获取 观测经度 角度对象

`get obGeoLat()`

获取 观测纬度 角度对象

`get obElevation()`

获取 观测海拔高度，单位：米

`get withAR()`

获取 是否考虑大气折射影响 设定

`get centerMode()`

获取 中心模式 设定

`get sc()`

获取 天球球坐标

`get a()`

获取 方位角 角度对象

`get h()`

获取 地平高度 角度对象

`get z()`

获取 天顶角 角度对象

`get radius()`

获取 距离

`get precessionModel()`

获取 岁差模型名称

`get nutationModel()`

获取 章动模型名称

## 许可证书

The MIT license.