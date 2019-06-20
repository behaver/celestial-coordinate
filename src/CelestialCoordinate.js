'use strict';

const SystemSwitcher = require('./SystemSwitcher');
const HorizontalCoordinate = require('./HorizontalCoordinate');
const HourAngleCoordinate = require('./HourAngleCoordinate');
const EquinoctialCoordinate = require('./EquinoctialCoordinate');
const EclipticCoordinate = require('./EclipticCoordinate');
const GalacticCoordinate = require('./GalacticCoordinate');

/**
 * CelestialCoordinate
 *
 * 天球坐标
 *
 * @author 董 三碗 <qianxing@yeah.net>
 */
class CelestialCoordinate {

  /**
   * 构造函数
   * 
   * @param {Object} options 天球系统参数项
   */
  constructor(options = {}) {
    // 初始化私有空间
    this.private = {};

    // 设定缺省参数项
    this.options = options;
  }

  /**
   * 生成天球坐标对象
   * 
   * @param  {String}           sys  天球系统
   * @param  {Object}           opts 选项参数
   * 
   * @return {CommonCoordinate}      天球坐标对象
   */
  create(sys, opts = {}) {

    // 参数检验
    if (typeof(sys) !== 'string') throw Error('The param sys should be a String.');
    if (typeof(opts) !== 'object') throw Error('The param opts should be an Object.');

    let options = {
      ...this.options,
      ...opts,
    };

    switch(sys.toLowerCase()) {
      case 'hc':
        return new HorizontalCoordinate(options);

      case 'hac':
        return new HourAngleCoordinate(options);

      case 'eqc':
        return new EquinoctialCoordinate(options);

      case 'ecc':
        return new EclipticCoordinate(options);

      case 'gc':
        return new GalacticCoordinate(options);

      default:
        throw Error('The param sys should be valid.');
    }
  }

  /**
   * 转换天球坐标
   * 
   * @param  {CommonCoordinate} coord   起始坐标对象
   * @param  {Object}           options 起始坐标参数选项
   * 
   * @return {SystemSwitcher}           天球坐标系统转换器
   */
  transform(coord, options = {}) {
    let SS = new SystemSwitcher(this.options);
    return SS.from(coord, options);
  }

  /**
   * 获取 参数项对象
   * 
   * @return {Object} 参数项对象
   */
  get options() {
    return this.private.options;
  }

  /**
   * 设置 参数项对象
   * 
   * @param {Object} value 参数项对象
   */
  set options(value) {
    if (typeof(value) !== 'object') throw Error('The param value should be an object');
    this.private.options = value;
  }
}

module.exports = CelestialCoordinate;
