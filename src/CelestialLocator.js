'use strict';

const { JDateRepository } = require('@behaver/jdate');

/**
 * 天球坐标定位器
 * 
 * 公共接口
 *
 * @private
 * @author 董 三碗 <qianxing@yeah.net>
 */
class CelestialLocator {

  /**
   * 构造函数
   * 
   * @param {Object} options 定位器计算参数
   */
  constructor(options = {}) {
    this.private = {};
  }

  /**
   * 设置定位器计算参数
   * 
   * @param  {Object}           options 定位器计算参数
   * 
   * @return {CelestialLocator}         返回 this 引用
   */
  options({
    id,
    time,
  } = {}) {
    return this;
  }

  /**
   * 获取定位结果集
   *
   * 结果集中包含了基本项：
   *  name: 位置点名称
   *  time: 时间
   *  coord: 天球坐标对象
   * 此外，还含有不同的差异项。
   *
   * @param  {Object} options 定位器计算参数
   * 
   * @return {Object}         定位结果集         
   */
  get(options = {}) {
    return;
  }

  /**
   * 设定 位置id
   * 
   * @param {String} value 位置id
   */
  set id(value) {
    if (typeof(value) !== 'string') throw Error('The param value should be a String.');
    
    this.private.id = value;
  }

  /**
   * 获取 位置id
   * 
   * @return {String} 位置id
   */
  get id() {
    return this.private.id;
  }

  /**
   * 设置 儒略时间对象
   * 
   * @param {JDateRepository} value 儒略时间对象
   */
  set time(value) {
    if (!(value instanceof JDateRepository)) throw Error('The param value should be an instance of JDateRepository.');

    this.private.time = value;
  }

  /**
   * 获取 儒略时间对象
   * 
   * @return {JDateRepository} 儒略时间对象
   */
  get time() {
    return this.private.time;
  }
}

module.exports = CelestialLocator;
