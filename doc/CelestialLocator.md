# CelestialLocator

## 简介

CelestialLocator 是天球坐标定位接口组件。

注：本组件为公共接口。

## 用例

```js
const { CelestialLocator } = require('@behaver/celestial-coordinate');

CustomLocator extends CelestialLocator {
  ...
}
```

## API

### 属性

`id` 定位器id

`time` 儒略时间对象

### 方法

`constructor(options)` 

构造函数

`options(options)`

设置定位器计算参数：

* options.id 定位器id
* options.time 定位时间对象

`get(options)`

获取定位结果集

## 许可证书

The ISC license.