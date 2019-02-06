'use strict';

const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const { JDateRepository } = require('@behaver/jdate');
const SiderealTime = require('@behaver/sidereal-time');
const Angle = require('@behaver/angle');
const EquinoctialCoordinate = require('./EquinoctialCoordinate');

const angle = new Angle;

/**
 * HourAngleCoordinate
 * 
 * HourAngleCoordinate 是天球时角坐标对象
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class HourAngleCoordinate {

  /**
   * 构造函数
   * 
   * @param  {JDateRepository}       options.obTime          观测历元
   * @param  {Number}                options.obGeoLong       观测点地理经度，单位：度，值域：[180, 180]
   * @param  {SphericalCoordinate3D} options.sc              球坐标
   * @param  {Number}                options.t               时角，单位：度，值域：[0, 360)
   * @param  {Number}                options.dec             赤纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius          坐标距离半径，值域：[10e-8, +∞)
   */
  constructor(options) {
    this.from(options);
  }

  /**
   * 设定起始天球时角坐标
   * 
   * @param  {JDateRepository}       options.obTime          观测历元
   * @param  {Number}                options.obGeoLong       观测点地理经度，单位：度，值域：[180, 180]
   * @param  {SphericalCoordinate3D} options.sc              球坐标
   * @param  {Number}                options.t               时角，单位：度，值域：[0, 360)
   * @param  {Number}                options.dec             赤纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius          坐标距离半径，值域：[10e-8, +∞)
   * 
   * @return {EquinoctialCoordinate}                         返回 this 引用
   */
  from({
    obTime,
    obGeoLong,
    sc,
    t,
    dec,
    radius,
  }) {

    if (!(obTime instanceof JDateRepository)) throw Error('The param obTime should be a JDateRepository.');

    if (typeof(obGeoLong) !== 'number') throw Error('The param obGeoLong should be a Number.');
    else if (obGeoLong < -180 || obGeoLong > 180) throw Error('The param obGeoLong should be in [-180, 180]');

    this.SiderealTime = new SiderealTime(obTime, obGeoLong);

    this.private = {
      obTime,
      obGeoLong,
    };

    this.position({
      sc,
      t,
      dec,
      radius,
    });

    return this;
  }

  /**
   * 转换当前坐标的系统参数
   * 
   * @param  {JDateRepository}       options.obTime    观测历元
   * @param  {Number}                options.obGeoLong 观测点地理经度
   * @return {EquinoctialCoordinate}                   返回 this 引用
   */
  on({
    obTime,
    obGeoLong,
  }) {
    let changeObTime = false;

    if (obTime === undefined) {
      obTime = this.private.obTime;
      changeObTime = true;
    } else if (!(obTime instanceof JDateRepository)) throw Error('The param obTime should be a JDateRepository.');
    
    if (obGeoLong === undefined) obGeoLong = this.private.obGeoLong;
    else if (typeof(obGeoLong) !== 'number') throw Error('The param obGeoLong should be a Number');
    else if (obGeoLong < -180 || obGeoLong > 180) throw Error('The param obGeoLong should be in [-180, 180]');

    if (changeObTime) { // 针对观测时间改变的情况，引入赤道坐标对象处理
      let ec = new EquinoctialCoordinate(this.toEquinoctial());
      let hc_obj = ec.toHorizontal({
        obTime, 
        obGeoLong, 
      });

      // 更新坐标及系统条件
      this.private.sc = hc_obj.sc;
      this.private.obTime = obTime;
      this.private.obGeoLong = obGeoLong;
    } else {
      // 将时角球坐标转换至瞬时赤道球坐标
      this.private.sc
        .inverse('y')
        .rotateZ(angle.setSeconds(this.SiderealTime.trueVal).getRadian());

      // 更新恒星时对象、观测经度、观测纬度
      this.SiderealTime = new SiderealTime(obTime, obGeoLong);
      this.private.obGeoLong = obGeoLong;

      // 将瞬时赤道坐标转换至时角球坐标
      this.private.sc
        .rotateZ(- angle.setSeconds(this.SiderealTime.trueVal).getRadian())
        .inverse('y');
    }

    return this;
  }

  /**
   * 设定当前系统条件下的坐标点位置
   * 
   * @param  {SphericalCoordinate3D} options.sc     球坐标
   * @param  {Number}                options.t      时角，单位：度，值域：[0, 360)
   * @param  {Number}                options.dec    赤纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius 坐标距离半径，值域：[10e-8, +∞)
   * @return {EquinoctialCoordinate}                返回 this 引用
   */
  position({
    sc,
    t,
    dec,
    radius,
  }) {
    if (sc === undefined) { // 通过参数 dec, t, radius 设定坐标值
      if (t === undefined) throw Error('One of the param t or sc should be given.');
      else if (typeof(t) !== 'number') throw Error('The param t should be a Number.');
      else if (t < 0 || t >= 360) throw Error('The param t should be in [0, 360).');

      if (dec === undefined) dec = 0;
      else if (typeof(dec) !== 'number') throw Error('The param dec should be a Number.');
      else if (dec < -90 || dec > 90) throw Error('The param dec should be in [-90, 90].');

      if (radius === undefined) radius = 1;
      else if (typeof(radius) !== 'number') throw Error('The param radius should be a Number.');
      else if (radius < 10e-8) throw Error('The param radius should be greater than 10e-8.');

      let theta = angle.setDegrees(90 - dec).getRadian();
      let phi = angle.setDegrees(t).getRadian();

      sc = new SphericalCoordinate3D(radius, theta, phi);
    } else { // 通过参数 sc 设定坐标值
      if (!(sc instanceof SphericalCoordinate3D)) throw Error('The param sc should be a SphericalCoordinate3D.');
    }

    this.private.sc = sc;

    return this;
  }

  /**
   * 获取指定系统参数的坐标结果
   * 
   * @param  {Object} options 坐标系统参数
   * @return {Object}         坐标结果对象
   */
  get(options) {
    if (options == undefined) {
      return { 
        sc: this.sc, 
        obTime: this.obTime, 
        obGeoLong: this.obGeoLong, 
      };
    } else {
      // 记录原坐标和条件，输出目标坐标后恢复
      let sc_0 = this.sc;
      let obTime_0 = this.obTime;
      let obGeoLong_0 = this.obGeoLong;

      this.on(options);

      // 记录新坐标和条件
      let sc = this.sc;
      let obTime = this.obTime;
      let obGeoLong = this.obGeoLong.getDegrees();

      // 还原为初始坐标和条件
      this.private.sc = sc_0;
      this.private.obTime = obTime_0;
      this.private.obGeoLong = obGeoLong_0.getDegrees();

      this.SiderealTime = new SiderealTime(obTime_0, obGeoLong_0.getDegrees());

      return {
        sc, 
        obTime, 
        obGeoLong, 
      }
    }
  }

  /**
   * 转换当前坐标至目标天球系统
   * 
   * @param  {String} system  目标天球坐标系统
   *                          可选值：horizontal、equinoctial、ecliptic、galactic
   * @param  {Object} options 目标天球坐标条件设定对象
   * 
   * @return {Object}         目标天球坐标
   */
  to(system, options) {
    if (typeof(system) !== 'string') throw Error('The param system should be a String.');

    switch(system.toLowerCase()) {
      case 'horizontal':
        return this.toHorizontal(options);

      case 'equinoctial':
        return this.toEquinoctial(options);

      case 'ecliptic':
        return this.toEcliptic(options);

      case 'galactic':
        return this.toGalactic(options);

      default:
        throw Error('The param system should be valid.');
    }
  }

  /**
   * 转换至 地平坐标
   *
   * @param  {Number} options.obGeoLat    观测点地理纬度
   *                                      单位：度，值域：[-90, 90]
   * @param  {Number} options.obElevation 观测点海拔高度
   * 
   * @return {Object}                     地平坐标对象
   */
  toHorizontal({ obGeoLat, obElevation }) {
    if (typeof(obGeoLat) !== 'number') throw Error('The param obGeoLat should be a Number');
    else if (obGeoLat < -90 || obGeoLat > 90) throw Error('The param obGeoLat should be in [-90, 90]');

    if (obElevation === undefined) obElevation = 0;
    else if (typeof(obElevation) !== 'number') throw Error('The param obElevation should be a Number.');

    let sc = this.sc;

    sc.rotateY(-Math.PI / 2 + angle.setDegrees(obGeoLat).getRadian());

    return {
      sc,
      obGeoLat,
      obTime: this.obTime, 
      obGeoLong: this.obGeoLong.getDegrees(),
      obElevation,
      withAR: false,
      centerMode: 'geocentric',
    }
  }

  /**
   * 转换至 赤道坐标
   * 
   * @return {Object} 赤道坐标对象
   */
  toEquinoctial() {
    let sc = this.sc;

    sc.inverse('y')
      .rotateZ(angle.setSeconds(this.SiderealTime.trueVal).getRadian());

    return {
      sc,
      epoch: this.obTime,
      withNutation: true,
      withAnnualAberration: true,
      withGravitationalDeflection: true,
      onFK5: false,
    }
  }

  /**
   * 转换至 黄道坐标
   * 
   * @return {Object} 黄道坐标对象
   */
  toEcliptic() {
    let eqc = new EquinoctialCoordinate(this.toEquinoctial());
    return eqc.toEcliptic();
  }

  /**
   * 转换至 银道坐标
   * 
   * @return {Object} 银道坐标对象
   */
  toGalactic() {
    let eqc = new EquinoctialCoordinate(this.toEquinoctial());
    return eqc.toGalactic();
  }

  /**
   * 获取 观测历元 儒略时间对象
   * 
   * @return {JDateRepository} 观测历元 儒略时间对象
   */
  get obTime() {
    return new JDateRepository(this.private.obTime.JD);
  }

  /**
   * 获取 观测经度 角度对象
   * 
   * @return {Angle} 观测经度 角度对象
   */
  get obGeoLong() {
    return new Angle(this.private.obGeoLong, 'd');
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
   * 获取 赤纬 角度对象
   * 
   * @return {Angle} 赤纬 角度对象
   */
  get dec() {
    return new Angle(Math.PI / 2 - this.sc.theta, 'r').inRound(-180, 'd');
  }

  /**
   * 获取 时角 角度对象
   * 
   * @return {Angle} 时角 角度对象
   */
  get t() {
    return new Angle(this.sc.phi, 'r');
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

module.exports = HourAngleCoordinate;
