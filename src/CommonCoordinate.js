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

    // 初始化私有空间
    this.private = {
      isContinuous: !! options.isContinuous
    };

    this.from(options);
  }

  /**
   * 获取 天球球坐标
   * 
   * @return {SphericalCoordinate3D} 天球球坐标
   */
  get sc() {
    let sc = this.private.sc;

    if (this.private.isContinuous) {
      return new SphericalCoordinate3D(sc.r, sc.theta, sc.phi);
    } else {
      // 角度表达数值范围调整
      let pi2 = 2 * Math.PI,
          phi = (sc.phi >= 0) ? (sc.phi % pi2) : sc.phi % pi2 + pi2,
          theta = sc.theta + Math.ceil((- Math.PI - sc.theta) / pi2) * pi2;

      return new SphericalCoordinate3D(sc.r, theta, phi);
    }
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

  /**
   * 设置 结果值的连续性
   * 
   * @param {Boolean} value 结果值的连续性
   */
  set isContinuous(value) {
    this.private.isContinuous = !!value;
  }

  /**
   * 获取 结果值连续性设定
   * 
   * @return {Boolean} 结果值连续性设定
   */
  get isContinuous() {
    return this.private.isContinuous;
  }
}

module.exports = CommonCoordinate;
