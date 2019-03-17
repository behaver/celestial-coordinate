# EquinoctialCoordinate

## 简介

EquinoctialCoordinate 是用于处理天球赤道坐标的组件。

它可以通过便捷地方法，使天球赤道坐标于不同的坐标系统参数之间进行切换。也可以将当前任意天球赤道坐标转换至其他天球坐标系统。

赤道坐标修正项包括有：

* 章动
* 岁差

二次修正项：

* FK5
* 周年光行差
* 太阳引力偏转

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

// 设定新坐标条件，分点历元以及进行章动、光行差修正
ec.on({
  epoch: jdr,
  withNutation: true,
  withAnnualAberration: true,
});

let ra = ec.ra.getDegrees();

let dec = ec.dec.getDegrees();

let radius = ec.radius;

let sc = ec.sc;

let epoch = ec.epoch;

let withNutation = ec.withNutation;

let withAnnualAberration = ec.withAnnualAberration;
```

## API

`constructor(options)`

构造函数，接受参数和 `from` 方法相同。

`from(options)`

设定起始天球赤道坐标。

坐标参数：

* options.sc 球坐标

或

* options.ra 赤经，单位：度，值域：[0, 360)
* options.dec 赤纬，单位：度，值域：[-90, 90]
* options.radius 距离半径，值域：[10e-8, +∞)

其他参数：

* options.epoch 坐标历元
* options.withNutation 是否修正了章动
* options.withAnnualAberration 是否修正周年光行差
* options.withGravitationalDeflection 是否修正太阳引力偏转
* options.onFK5 是否修正 FK5

`on(options)`

转换当前坐标所基于的系统参数

接受参数：

* options.epoch 坐标历元
* options.withNutation 坐标是否修复章动

`position(options)`

设定当前系统条件下的坐标点位置

坐标参数：

* options.sc 球坐标

或

* options.ra 赤经，单位：度，值域：[0, 360)
* options.dec 赤纬，单位：度，值域：[-90, 90]
* options.radius 距离半径，值域：[10e-8, +∞)

`get(options)`

获取指定系统参数的坐标结果

接受参数：

* options.epoch 坐标历元
* options.withNutation 坐标是否修复章动
* options.withAnnualAberration 是否修正周年光行差
* options.withGravitationalDeflection 是否修正太阳引力偏转
* options.onFK5 是否修正 FK5

返回结果对象的属性：

* sc 球坐标
* epoch 坐标历元
* withNutation 是否修正了章动
* withAnnualAberration 是否修正周年光行差
* withGravitationalDeflection 是否修正太阳引力偏转
* onFK5 是否修正 FK5

`onJ2000()`

转换坐标历元至 J2000

`onEpoch(epoch)`

转换坐标至 目标历元

`patchNutation()`

修正章动

`unpatchNutation()`

解除章动修正

`patchAnnualAberration()`

修正周年光行差

`unpatchAnnualAberration()`

解除周年光行差修正

`patchGravitationalDeflection()`

修正引力偏转

`unpatchGravitationalDeflection()`

解除引力偏转修正

`patchFK5()`

修正至 FK5 系统

`unpatchFK5()`

解除 FK5 修正

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

`set epoch(value)`

设置 历元对象

`get withNutation()`

获取 章动修正状态

`set withNutation(value)`

设置 章动修正状态

`get withAnnualAberration()`

获取 周年光行差修正状态

`set withAnnualAberration(value)`

设置 周年光行差修正状态

`get withGravitationalDeflection()`

获取 引力偏转修正状态

`set withGravitationalDeflection(value)`

设置 引力偏转修正状态

`get onFK5()`

获取 FK5 修正状态

`set onFK5(value)`

设置 FK5 修正状态

`get PrecessionCorrection()`

获取 岁差 偏转修正值

`get NutationCorrection()`

获取 章动 偏转修正值

`get AACorrection()`

获取 周年光行差修正值

`get GDCorrection()`

获取 太阳引力偏转修正值

`get FK5Correction()`

获取 FK5 偏转修正值

## 许可证书

The MIT license.