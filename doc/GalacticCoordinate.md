# GalacticCoordinate

## 简介

GalacticCoordinate 是用于处理天球银道坐标的组件。

它可以通过便捷地方法，使天球银道坐标于不同的坐标系统参数之间进行切换。也可以将当前任意天球银道坐标转换至其他天球坐标系统。

## 用例

使用 GalacticCoordinate 组件处理天球赤道坐标：

```js
const { GalacticCoordinate } = require('@behaver/celestial-coordinate');
const { JDateRepository } = require('@behaver/jdate');

// 实例化 J2000 分点天球银道坐标
let gc = new GalacticCoordinate({
  l: 123.2343,
  b: -3.3248,
  radius: 1.0324,
});

let jdr = new JDateRepository(1950.0, 'bepoch');

// 转换坐标历元至 B1950
gc.on({
  epoch: jdr,
});

let l = gc.l.getDegrees();

let b = gc.b.getDegrees();

let radius = gc.radius;

let sc = gc.sc;

let epoch = gc.epoch;
```

## API

`constructor(options)`

构造函数

* options.isContinuous 结果坐标值是否连续，默认：false

接受参数如 `from` 方法相同。

`from(options)`

设定起始天球银道坐标。

坐标参数：

* options.sc 球坐标

或

* options.l 银经，单位：度，值域：[0, 360)
* options.b 银纬，单位：度，值域：[-90, 90]
* options.radius 距离半径，值域：[10e-8, +∞)

其他参数：

* options.epoch 坐标历元

`on(options)`

转换当前坐标所基于的系统参数

接受参数：

* options.epoch 坐标历元

`position(options)`

设定当前系统条件下的坐标点位置

坐标参数：

* options.sc 球坐标

或

* options.l 银经，单位：度，值域：[0, 360)
* options.b 银纬，单位：度，值域：[-90, 90]
* options.radius 距离半径，值域：[10e-8, +∞)

`get(options)`

获取指定系统参数的坐标结果

接受参数：

* options.epoch 坐标历元

返回结果对象的属性：

* sc 球坐标
* epoch 坐标历元

`onEpoch(epoch)`

转换坐标至 目标历元

`get sc()`

获取 天球球坐标

`get l()`

获取 银经 角度对象

`get b()`

获取 银纬 角度对象

`get radius()`

获取 距离

`get epoch()`

获取 历元对象

`set epoch(value)`

设置 历元对象

`get isContinuous()`

获取 结果值连续性设定

`set isContinuous(value)`

设置 结果值的连续性

## 许可证书

The MIT license.