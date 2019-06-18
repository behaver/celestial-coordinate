'use strict';

const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const { JDateRepository } = require('@behaver/jdate');
const Angle = require('@behaver/angle');

const angle = new Angle;

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
   * @param {Object} options 坐标参数
   */
  constructor(options = {}) {

    // 初始化私有空间
    this.private = {
      sc: new SphericalCoordinate3D(1, 0, 0),
      isContinuous: !! options.isContinuous,
      SCContinuouslyChange: (function(sc) { // 保持数值连续性地更改sc值
        let sc0 = this.private.sc,
            delta_phi = angle.setRadian(sc.phi - sc0.phi).inRound(-180).getRadian(),
            delta_theta = angle.setRadian(sc.theta - sc0.theta).inRound(-180).getRadian();

        this.private.sc = new SphericalCoordinate3D(sc.r, sc0.theta + delta_theta, sc0.phi + delta_phi);
      }).bind(this),
    };

    this.from(options);
  }

  /**
   * 转换坐标至 目标历元
   *
   * 会将当前坐标转化成目标历元平坐标
   * 
   * @param  {JDateRepository}  epoch 目标历元
   * 
   * @return {CommonCoordinate}       返回 this 引用
   */
  onEpoch(value) {
    return this;
  }

  /**
   * 设置 历元对象
   * 
   * @param {JDateRepository} value 目标历元对象
   */
  set epoch(value) {
    this.onEpoch(value);
  }

  /**
   * 获取 历元对象
   * 
   * @return {JDateRepository} 历元对象
   */
  get epoch() {
    return new JDateRepository(this.private.epoch.JD);
  }

  /**
   * 设定当前系统条件下的坐标点位置
   * 
   * @param  {SphericalCoordinate3D} options.sc        球坐标
   * @param  {Number}                options.longitude 黄经，单位：度，值域：[0, 360)
   * @param  {Number}                options.latitude  黄纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius    距离半径，值域：[10e-8, +∞)
   * 
   * @return {CommonCoordinate}                        返回 this 引用
   */
  position({
    sc, 
    longitude,
    latitude,
    radius,
  }) {
    if (longitude !== undefined) this.longitude = longitude;
    if (latitude !== undefined) this.latitude = latitude;
    if (radius !== undefined) this.radius = radius;
    if (sc !== undefined) this.sc = sc;

    return this;
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
    if (!(value instanceof SphericalCoordinate3D)) throw Error('The param value should be a instance of SphericalCoordinate3D.');

    this.private.sc = value;

    // 清空缓存
    if (this.cache) this.cache.clear();
  }

  /**
   * 获取 经度 角度对象
   * 
   * @return {Angle} 经度 角度对象
   */
  get longitude() {
    return new Angle(this.sc.phi, 'r');
  }

  /**
   * 设置 经度
   * 
   * @param {Number} value 经度。单位：°
   */
  set longitude(value) {
    if (typeof(value) !== 'number') throw Error('The param value should be a Number.');

    this.private.sc.phi = angle.setDegrees(value).getRadian();
    
    // 清空缓存
    if (this.cache) this.cache.clear();
  }

  /**
   * 获取 纬度 角度对象
   * 
   * @return {Angle} 纬度 角度对象
   */
  get latitude() {
    return (new Angle(Math.PI / 2 - this.sc.theta, 'r'));
  }

  /**
   * 设置 纬度
   * 
   * @param {Number} value 纬度。单位：°
   */
  set latitude(value) {
    if (typeof(value) !== 'number') throw Error('The param value should be a Number.');
    
    this.private.sc.theta = angle.setDegrees(90 - value).getRadian();
    
    // 清空缓存
    if (this.cache) this.cache.clear();
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
   * 设置 距离
   * 
   * @param {Number} value 距离
   */
  set radius(value) {
    if (typeof(value) !== 'number') throw Error('The param value should be a Number.');
    if (value < 10e-8) throw Error('The param value should be greater than 10e-8.');

    this.private.sc.r = value;

    // 清空缓存
    if (this.cache) this.cache.clear();
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
