# SystemSwitcher

## 简介

SystemSwitcher 是一个天球坐标转换组件，它可以操作天球坐标在不同坐标系之间进行转换。可以进行转换的坐标系统包括：

* [HorizontalCoordinate](./HorizontalCoordinate.md) 天球地平坐标
* [HourAngleCoordinate](./HourAngleCoordinate.md) 天球时角坐标（也称第一赤道坐标）
* [EquinoctialCoordinate](./EquinoctialCoordinate.md) 天球赤道坐标
* [EclipticCoordinate](./EclipticCoordinate.md) 天球黄道坐标
* [GalacticCoordinate](./GalacticCoordinate.md) 天球银道坐标

## 用例

```js
const { SystemSwitcher, EquinoctialCoordinate } = require('@behaver/celestial-coordinate');
const { JDateRepository } = require('@behaver/jdate');

// 实例化儒略时间对象
let epoch = new JDateRepository(new Date('1987/04/11 03:21:00'), 'date');

// 实例化赤道坐标对象
let EQC = new EquinoctialCoordinate({
  longitude: angle.parseHACString('23h 09m 16.641s').getDegrees(),
  latitude: angle.parseDACString('-6°43′11.61″').getDegrees(),
  epoch: epoch,
  withNutation: true,
  withAnnualAberration: true,
  withGravitationalDeflection: true,
  onFK5: true,
});

// 实例化坐标转换器
let Switcher = new SystemSwitcher(EQC);

// 转换坐标为地平坐标
let HC = Switcher.to('hc', {
  epoch: epoch,
  obGeoLong: angle.parseDACString('77°03′56″').getDegrees(),
  obGeoLat: angle.parseDACString('38°55′17″').getDegrees(),
});

// 获取地平坐标方位角，单位：°
let A = HC.longitude.getDegrees();

// 获取地平坐标地平角，单位：°
let H = HC.latitude.getDegrees();
```

## API

### 属性

`enableAR` 大气折射功能启用状态

`enableFK5` FK5 修正功能启用状态

`enableGravitationalDeflection` 引力偏转功能启用状态

`enableAnnualAberration` 周年光行差功能启用状态

`enableNutation` 章动修正功能启用状态

### 方法

`constructor(options)`

构造函数：

* options.coord                         天球坐标实例
* options.enableNutation                章动修正功能启用状态
* options.enableAnnualAberration        周年光行差功能启用状态
* options.enableGravitationalDeflection 引力偏转功能启用状态
* options.enableFK5                     FK5 修正功能启用状态
* options.enableAR                      大气折射功能启用状态

`options(options)`

设定当前系统参数：

* options.enableNutation                章动修正功能启用状态
* options.enableAnnualAberration        周年光行差功能启用状态
* options.enableGravitationalDeflection 引力偏转功能启用状态
* options.enableFK5                     FK5 修正功能启用状态
* options.enableAR                      大气折射功能启用状态


`from(coord, options)`

设定转换过程的源坐标：

* coord 源天球坐标实例
* options 对应赤道系统参数设定

`to(sysCode, options)`

转换至目标坐标系统：

* sysCode 目标坐标系统字串标识
* options 目标系统设定参数

## 许可证书

The ISC license.