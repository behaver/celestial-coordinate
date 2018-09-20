# EquinoctialCoordinate

## 简介

EquinoctialCoordinate 是用于处理天球赤道坐标的组件。

它可以通过便捷地方法，使天球赤道坐标于不同的坐标系统参数之间进行切换。也可以将当前任意天球赤道坐标转换至其他天球坐标系统。

## 用例

使用 EquinoctialCoordinate 组件处理天球赤道坐标：

```js
const { EquinoctialCoordinate } = require('@behaver/celestial-coordinate');
const { JDateRepository } = require('@behaver/jdate');

// 实例化 J2000 分点天球平赤道坐标
let ec = new EquinoctialCoordinate({
  ra: 123.2343,
  dec: -3.3248,
  radius: 1.0324,
});

let jdr = new JDateRepository(2446896);

// 设定新坐标条件，分点历元以及进行章动修正
ec.on({
  epoch: jdr,
  withNutation: true,
});

let ra = ec.ra.getDegrees();

let dec = ec.dec.getDegrees();

let radius = ec.radius;

let sc = ec.sc;

let epoch = ec.epoch;

let withNutation = ec.withNutation;
```

使用 EquinoctialCoordinate 将天球赤道坐标 转换至 其他天球坐标系统：

```js
const { EquinoctialCoordinate } = require('@behaver/celestial-coordinate');
const { JDateRepository } = require('@behaver/jdate');

let epoch = new JDateRepository(new Date('1987/04/11 03:21:00'), 'date');
let eqc = new EquinoctialCoordinate({
  ra: 350.1532,
  dec: -6.8721,
  epoch: epoch,
  withNutation: true,
});

// 转换输出天球地平坐标对象
let hc_obj = eqc.toHorizontal({
  // obTime: epoch,
  obGeoLong: 77.0897,
  obGeoLat: 38.9231,
});

// 转换输出天球时角坐标对象
let hac_obj = eqc.toHourAngle({
  // obTime: epoch,
  obGeoLong: 77.0897,
});

// 转换输出天球黄道坐标对象
let ecc_obj = eqc.toEcliptic();

// 转换输出天球银道坐标对象
let gc_obj = eqc.toGalactic();
```

## API

`constructor(options)`

构造函数，接受参数如 `from` 方法相同。

`from(options)`

设定起始天球赤道坐标。

坐标参数：

options.sc 球坐标

或

options.ra 赤经，单位：度，值域：[0, 360)
options.dec 赤纬，单位：度，值域：[-90, 90]
options.radius 距离半径，值域：[10e-8, +∞)

其他参数：

options.epoch 坐标历元
options.withNutation 是否修正了章动
options.precessionModel 岁差计算模型，接受：iau2006、iau2000、iau1976
options.nutationModel 章动计算模型，接受：iau2000b、lp

`on(options)`

转换当前坐标所基于的系统参数

接受参数：

options.epoch 坐标历元
options.withNutation 坐标是否修复章动

`position(options)`

设定当前系统条件下的坐标点位置

坐标参数：

options.sc 球坐标

或

options.ra 赤经，单位：度，值域：[0, 360)
options.dec 赤纬，单位：度，值域：[-90, 90]
options.radius 距离半径，值域：[10e-8, +∞)

`get(options)`

获取指定系统参数的坐标结果

接受参数：

options.epoch 坐标历元
options.withNutation 坐标是否修复章动

返回结果对象的属性：

sc 球坐标
epoch 坐标历元
withNutation 是否修正了章动
precessionModel 岁差计算模型
nutationModel 章动计算模型

`to(system, options)`

转换当前坐标至目标天球系统

接受参数：

system 目标系统
options 系统参数

`toHorizontal(options)`

转换当前坐标至天球地平系统

系统参数：

options.obTime 观测时间
options.obGeoLong 观测点地理经度，单位：度，值域：[-180, 180]
options.obGeoLat  观测点地理纬度，单位：度，值域：[-90, 90]

`toHourAngle(options)`

转换当前坐标至天球时角系统

系统参数：

options.obTime 观测时间
options.obGeoLong 观测点地理经度，单位：度，值域：[-180, 180]

`toEcliptic()`

转换当前坐标至天球黄道系统

`toGalactic()`

转换当前坐标至天球银道系统

`onJ2000()`

转换坐标历元至 J2000

`onEpoch(epoch)`

转换坐标至 目标历元

`nutationPatch()`

修正章动

`nutationUnpatch()`

解除章动修正

`get sc()`

获取 天球球坐标

`get ra()`

获取 赤经 角度对象

`get dec()`

获取 赤纬 角度对象

`get radius()`

获取 距离

`get epoch()`

获取 历元对象

`get withNutation()`

获取 章动修正状态

`get precessionModel()`

获取 岁差模型名称

`get nutationModel()`

获取 章动模型名称

## 许可证书

The MIT license.