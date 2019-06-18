# CelestialCoordinate

## 简介

CelestialCoordinate 是一个基于 NodeJS 开发的天文学坐标计算工具，主要可被用于天体天球坐标的转换和处理。

其中包含的天球坐标组件分别有：

* [HorizontalCoordinate](./doc/HorizontalCoordinate.md) 天球地平坐标
* [HourAngleCoordinate](./doc/HourAngleCoordinate.md) 天球时角坐标（也称第一赤道坐标）
* [EquinoctialCoordinate](./doc/EquinoctialCoordinate.md) 天球赤道坐标
* [EclipticCoordinate](./doc/EclipticCoordinate.md) 天球黄道坐标
* [GalacticCoordinate](./doc/GalacticCoordinate.md) 天球银道坐标
* [SystemSwitcher](./doc/SystemSwitcher.md)
天球坐标转换组件
* [CelestialLocator](./doc/CelestialLocator.md)
天球坐标定位器接口组件

*点击上述链接，可查看它们的详细文档。*

## 安装

通过 npm 安装，在你的 node 项目目录下执行：

`npm install @behaver/celestial-coordinate`

安装完成后，调用即可：

`const { CelestialCoordinate } = require('@behaver/celestial-coordinate');`

## 用例

```js
const { JDateRepository } = require('@behaver/jdate');
const { CelestialCoordinate } = require('@behaver/celestial-coordinate');

// 构建天球坐标实例
let CC = new CelestialCoordinate({
  withNutation: true,
  withAnnualAberration: true,
});

// 生成黄道坐标对象
let ECC = CC.create('ecc', {
  time: new JDateRepository(2446896),
  longitude: 125.88,
  latitude: 32.45,
});

// 转换至赤道坐标对象
let EQC = CC.transform(ECC).to('eqc');

// 输出赤道经度度数
console.log(EQC.longitude.getDegrees());
```

## API

### 属性

`options` 天球坐标参数项对象

### 方法

`constructor(options)`

构造函数

`create(sys, opts)`

生成天球坐标对象：

* sys 天球系统
* opts 选项参数

`transform(coord, options)`

转换天球坐标：

* coord 起始坐标对象
* options 起始坐标参数选项

## 许可证书

The ISC license.