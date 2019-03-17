'use strict';

const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');

/**
 * 坐标公共继承类
 *
 * 定义各系统坐标的公共方法，供子类继承。
 *
 * @private
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class CommonCoordinate {

  /**
   * 构造函数
   * 
   * @param  {Object} options 坐标参数
   */
  constructor(options) {
    this.from(options);
  }

  /**
   * 获取 天球球坐标
   * 
   * @return {SphericalCoordinate3D} 天球球坐标
   */
  get sc() {
    let sc = this.private.sc;
    return new SphericalCoordinate3D(sc.r, sc.theta, sc.phi);
  }

  /**
   * 设置 天球球坐标
   * 
   * @param {SphericalCoordinate3D} value 天球球坐标
   */
  set sc(value) {
    this.position({
      sc: value
    });
  }

  /**
   * 获取 距离
   * 
   * @return {Number} 距离数值
   */
  get radius() {
    return this.sc.r;
  }
}

module.exports = CommonCoordinate;
