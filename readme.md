# CelestialCoordinate

## 简介

CelestialCoordinate 是一个基于 NodeJS 开发的天文学坐标计算工具，主要可被用于天体天球坐标的转换和处理。

其中包含的天球坐标组件分别有：

* [HorizontalCoordinate](./doc/HorizontalCoordinate.md) 天球地平坐标
* [HourAngleCoordinate](./doc/HourAngleCoordinate.md) 天球时角坐标（也称第一赤道坐标）
* [EquinoctialCoordinate](./doc/EquinoctialCoordinate.md) 天球赤道坐标
* [EclipticCoordinate](./doc/EclipticCoordinate.md) 天球黄道坐标
* [GalacticCoordinate](./doc/GalacticCoordinate.md) 天球银道坐标

*点击上述链接，可查看它们的详细文档。*

## 安装

通过 npm 安装，在你的 node 项目目录下执行：

`npm install @behaver/celestial-coordinate`

安装完成后，调用即可：

`const { EquinoctialCoordinate } = require('@behaver/celestial-coordinate');`

## 用例

```js
const { JDateRepository } = require('@behaver/jdate');
const { EquinoctialCoordinate } = require('@behaver/celestial-coordinate');

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

// 获取赤经度数
let ra = ec.ra.getDegrees();

// 获取赤纬度数
let dec = ec.dec.getDegrees();

// 获取赤道坐标半径
let radius = ec.radius;

// 获取赤道球坐标对象
let sc = ec.sc;
```

## 许可证书

The ISC license.