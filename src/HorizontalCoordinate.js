'use strict';

const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const { JDateRepository } = require('@behaver/jdate');
const SiderealTime = require('@behaver/sidereal-time');
const Angle = require('@behaver/angle');
const DiurnalParallax = require('@behaver/diurnal-parallax');
const AtmosphericRefraction = require('@behaver/atmospheric-refraction');
const EquinoctialCoordinate = require('./EquinoctialCoordinate');
const CommonCoordinate = require('./CommonCoordinate');

const angle = new Angle;

/**
 * HorizontalCoordinate
 * 
 * HorizontalCoordinate 是天球地平坐标对象
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class HorizontalCoordinate extends CommonCoordinate {

  /**
   * 设定起始天球地平坐标
   * 
   * @param  {JDateRepository}       options.obTime          观测历元
   * @param  {Number}                options.obGeoLong       观测点地理经度，单位：度，值域：[180, 180]
   * @param  {Number}                options.obGeoLat        观测点地理纬度，单位：度，值域：[-90, 90]
   * @param  {Number}                options.obElevation     观测点海拔高度，单位：米，值域：值域：[-12000, 3e7]
   * @param  {SphericalCoordinate3D} options.sc              球坐标
   * @param  {Number}                options.h               地平高度，单位：度，值域：[-90, 90]
   * @param  {Number}                options.z               天顶角，单位：度，值域：[0, 180]
   * @param  {Number}                options.a               方位角，单位：度，值域：[0, 360)
   * @param  {Number}                options.radius          坐标距离半径，值域：[10e-8, +∞)
   * @param  {String}                options.centerMode      中心模式：geocentric（地心坐标）、topocentric（站心坐标）
   * @param  {Boolean}               options.withAR          是否已经过大气折射
   * 
   * @return {EquinoctialCoordinate}                         返回 this 引用
   */
  from({
    obTime,
    obGeoLong,
    obGeoLat,
    obElevation,
    sc,
    a,
    h,
    z,
    radius,
    centerMode,
    withAR,
  }) {

    if (!(obTime instanceof JDateRepository)) throw Error('The param obTime should be a JDateRepository.');

    if (typeof(obGeoLong) !== 'number') throw Error('The param obGeoLong should be a Number.');
    else if (obGeoLong < -180 || obGeoLong > 180) throw Error('The param obGeoLong should be in [-180, 180]');

    if (typeof(obGeoLat) !== 'number') throw Error('The param obGeoLat should be a Number.');
    else if (obGeoLat < -90 || obGeoLat > 90) throw Error('The param obGeoLat should be in [-90, 90]');

    if (obElevation === undefined) obElevation = 0;
    else if (typeof(obElevation) !== 'number') throw Error('The param obElevation should be a Number.');
    else if (obElevation > 3e7 || obElevation < -12000) throw Error('The param obElevation should be in (-12000, 3e7).');

    if (centerMode === undefined) centerMode = 'geocentric';
    else if (centerMode !== 'geocentric' && centerMode !== 'topocentric') {
      throw Error(centerMode);
      throw Error('The param centerMode should just be geocentric or topocentric.');
    }

    if (withAR === undefined) withAR = false;
    else withAR = !!withAR;

    this.SiderealTime = new SiderealTime(obTime, obGeoLong);

    this.private = {
      ...this.private,
      obTime,
      obGeoLong,
      obGeoLat,
      obElevation,
      centerMode,
      withAR,
    };

    this.position({
      sc,
      a,
      h,
      z,
      radius,
    });

    return this;
  }

  /**
   * 转换当前坐标的系统参数
   * 
   * @param  {JDateRepository}       options.obTime      观测历元
   * @param  {Number}                options.obGeoLong   观测点地理经度
   * @param  {Number}                options.obGeoLat    观测点地理纬度
   * @param  {Number}                options.obElevation 观测点海拔高度，单位：米，值域：值域：[-12000, 3e7]
   * @param  {String}                options.centerMode  中心模式：geocentric（地心坐标）、topocentric（站心坐标）
   * @param  {Boolean}               options.withAR      是否已经过大气折射
   * 
   * @return {EquinoctialCoordinate}                     返回 this 引用
   */
  on({
    obTime,
    obGeoLong,
    obGeoLat,
    obElevation,
    centerMode,
    withAR,
  }) {
    let changeObTime = false;

    if (obTime === undefined) {
      obTime = this.private.obTime;
      changeObTime = false;
    } else if (!(obTime instanceof JDateRepository)) throw Error('The param obTime should be a JDateRepository.');
    else changeObTime = true;

    if (obGeoLong === undefined) obGeoLong = this.private.obGeoLong;
    else if (typeof(obGeoLong) !== 'number') throw Error('The param obGeoLong should be a Number');
    else if (obGeoLong < -180 || obGeoLong > 180) throw Error('The param obGeoLong should be in [-180, 180]');
    
    if (obGeoLat === undefined) obGeoLat = this.private.obGeoLat;
    else if (typeof(obGeoLat) !== 'number') throw Error('The param obGeoLat should be a Number.');
    else if (obGeoLat < -90 || obGeoLat > 90) throw Error('The param obGeoLat should be in [-90, 90]');

    if (obElevation === undefined) obElevation = this.private.obElevation;
    else if (typeof(obElevation) !== 'number') throw Error('The param obElevation should be a Number.');
    else if (obElevation > 3e7 || obElevation < -12000) throw Error('The param obElevation should be in (-12000, 3e7).');

    if (centerMode === undefined) centerMode = this.private.centerMode;
    else if (centerMode !== 'geocentric' && centerMode !== 'topocentric') throw Error('The param centerMode should just be geocentric or topocentric.');

    if (withAR === undefined) withAR = this.private.withAR;
    else withAR = !!withAR;

    // 将原始坐标转换成地心坐标
    this.onGeocentric();

    // 将地平球坐标转换至瞬时赤道球坐标
    this.private.sc
      .inverse('y')
      .rotateY(Math.PI / 2 - angle.setDegrees(this.private.obGeoLat).getRadian())
      .rotateZ(angle.setSeconds(this.SiderealTime.trueVal).getRadian());

    if (changeObTime) { // 针对观测时间改变的情况，引入赤道坐标对象处理
      let ec = new EquinoctialCoordinate({
        sc: this.sc,
        epoch: this.obTime,
        withNutation: true,
        withAnnualAberration: true,
        withGravitationalDeflection: true,
        onFK5: true,
      });

      this.private.sc = ec.get({ 
        epoch: obTime,
      }).sc;
 
      this.private.obTime = obTime;
    }
      
    // 更新恒星时对象、观测经度、观测纬度
    this.SiderealTime = new SiderealTime(obTime, obGeoLong);

    // 将瞬时赤道坐标转换至地平球坐标
    this.private.sc
      .rotateZ(- angle.setSeconds(this.SiderealTime.trueVal).getRadian())
      .rotateY(- Math.PI / 2 + angle.setDegrees(obGeoLat).getRadian())
      .inverse('y');

    this.private.obGeoLong = obGeoLong;
    this.private.obGeoLat = obGeoLat;
    this.private.obElevation = obElevation;

    // 转换成新站心坐标以及处理大气折射（如果设定需要的话）
    if (centerMode === 'topocentric') {
      // 转化为新站心坐标
      this.onTopocentric();

      // 添加大气折射
      if (withAR) this.patchAR();
    }

    return this;
  }

  /**
   * 转换坐标至站心坐标
   * 
   * @return {EquinoctialCoordinate} 返回 this 引用
   */
  onTopocentric() {
    if (this.private.centerMode === 'geocentric') {
      // 在原有地心坐标的基础上进行转换
      let dp = new DiurnalParallax({
        gc: this.private.sc,
        siderealTime: this.SiderealTime,
        obGeoLat: this.private.obGeoLat,
        obElevation: this.private.obElevation,
        system: 'horizontal',
      });

      // 获取站心球坐标（由地心坐标转化的）
      this.private.sc = dp.TC;

      this.private.centerMode = 'topocentric';
    }

    return this;
  }

  /**
   * 转换坐标至地心坐标
   * 
   * @return {EquinoctialCoordinate} 返回 this 引用
   */
  onGeocentric() {
    if (this.private.centerMode === 'topocentric') {
      this.unpatchAR();

      let dp = new DiurnalParallax({
        tc: this.private.sc,
        siderealTime: this.SiderealTime,
        obGeoLat: this.private.obGeoLat,
        obElevation: this.private.obElevation,
        system: 'horizontal',
      });

      // 获取地心球坐标（由站心坐标转化的）
      this.private.sc = dp.GC;

      this.private.centerMode = 'geocentric';
    }

    return this;
  }

  /**
   * 添加大气折射的影响
   * 
   * @return {EquinoctialCoordinate} 返回 this 引用
   */
  patchAR() {
    if (!this.private.withAR) {
      let h = angle.setRadian(Math.PI / 2 - this.private.sc.theta).getDegrees();
      
      if (h > 0) {
        let ar = new AtmosphericRefraction({
          trueH: h,
        });

        // 更新修正后的球坐标
        this.private.sc.theta = Math.PI / 2 - angle.setDegrees(ar.apparentH).getRadian();
      }

      this.private.withAR = true;
    }

    return this;
  }

  /**
   * 去除大气折射的影响
   * 
   * @return {EquinoctialCoordinate} 返回 this 引用
   */
  unpatchAR() {
    if (this.private.withAR) {
      let h = angle.setRadian(Math.PI / 2 - this.private.sc.theta).getDegrees();
      
      if (h > 0) {
        let ar = new AtmosphericRefraction({
          apparentH: h,
        });

        // 更新修正后的球坐标
        this.private.sc.theta = Math.PI / 2 - angle.setDegrees(ar.trueH).getRadian();
      }

      this.private.withAR = false;
    }

    return this;
  }

  /**
   * 转换坐标至观测视角坐标
   * 
   * @return {EquinoctialCoordinate} 返回 this 引用
   */
  onObservedView() {
    return this.onTopocentric().patchAR();
  }

  /**
   * 设定当前系统条件下的坐标点位置
   * 
   * @param  {SphericalCoordinate3D} options.sc     球坐标
   * @param  {Number}                options.h      地平高度，单位：度，值域：[-90, 90]
   * @param  {Number}                options.z      天顶角，单位：度，值域：[0, 180]
   * @param  {Number}                options.a      方位角，单位：度，值域：[0, 360)
   * @param  {Number}                options.radius 坐标距离半径，值域：[10e-8, +∞)
   * @return {EquinoctialCoordinate}                返回 this 引用
   */
  position({
    sc,
    a,
    h,
    z,
    radius,
  }) {
    if (sc === undefined) { // 通过参数 h, z, a, radius 设定坐标值
      if (a === undefined) throw Error('One of the param a or sc should be given.');
      else if (typeof(a) !== 'number') throw Error('The param a should be a Number.');
      // else if (a < 0 || a >= 360) throw Error('The param a should be in [0, 360).');

      if (h !== undefined) {
        if (typeof(h) !== 'number') throw Error('The param h should be a Number.');
        // else if (h < -90 || h > 90) throw Error('The param h should be in [-90, 90].');
        z = 90 - h;
      }

      if (z === undefined) z = 90; // 缺省默认 天顶角 为 90°
      else if (typeof(z) !== 'number') throw Error('The param z should be a Number.');
      // else if (z < 0 || z > 180) throw Error('The param z should be in [0, 180].');

      if (radius === undefined) radius = 1;
      else if (typeof(radius) !== 'number') throw Error('The param radius should be a Number.');
      else if (radius < 10e-8) throw Error('The param radius should be greater than 10e-8.');

      let theta = angle.setDegrees(z).getRadian();
      let phi = angle.setDegrees(a).getRadian();

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
        obGeoLat: this.obGeoLat, 
        obElevation: this.obElevation,
        centerMode: this.centerMode,
        withAR: this.withAR,
      };
    } else {
      // 记录原坐标和条件，输出目标坐标后恢复
      let sc_0 = this.sc;
      let obTime_0 = this.obTime;
      let obGeoLong_0 = this.obGeoLong;
      let obGeoLat_0 = this.obGeoLat;
      let obElevation_0 = this.obElevation;
      let centerMode_0 = this.centerMode;
      let withAR_0 = this.withAR;

      this.on(options);

      // 记录新坐标和条件
      let res = {
        sc: this.sc,
        obTime: this.obTime,
        obGeoLong: this.obGeoLong.getDegrees(),
        obGeoLat: this.obGeoLat.getDegrees(),
        obElevation: this.obElevation,
        centerMode: this.centerMode,
        withAR: this.withAR,
      };

      // 还原为初始坐标和条件
      this.private.sc = sc_0;
      this.private.obTime = obTime_0;
      this.private.obGeoLong = obGeoLong_0.getDegrees();
      this.private.obGeoLat = obGeoLat_0.getDegrees();
      this.private.obElevation = obElevation_0;
      this.private.centerMode = centerMode_0;
      this.private.withAR = withAR_0;
      this.SiderealTime = new SiderealTime(obTime_0, obGeoLong_0.getDegrees());

      return res;
    }
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
   * 获取 观测纬度 角度对象
   * 
   * @return {Angle} 观测纬度 角度对象
   */
  get obGeoLat() {
    return new Angle(this.private.obGeoLat, 'd');
  }

  /**
   * 获取 观测海拔高度，单位：米
   * 
   * @return {Number} 观测海拔高度
   */
  get obElevation() {
    return this.private.obElevation;
  }

  /**
   * 获取 是否考虑大气折射影响 设定
   * 
   * @return {Boolean} 是否考虑大气折射影响 设定
   */
  get withAR() {
    return this.private.withAR;
  }

  /**
   * 设置 是否考虑大气折射影响 设定
   * 
   * @param {Boolean} value 是否考虑大气折射影响 设定
   */
  set withAR(value) {
    if (value) this.patchAR();
    else this.unpatchAR();
  }

  /**
   * 获取 中心模式 设定
   * 
   * @return {String} 中心模式 设定
   */
  get centerMode() {
    return this.private.centerMode;
  }

  /**
   * 设置 中心点模式 设定
   * 
   * @param  {String} value 中心点模式字串
   */
  set centerMode(value) {
    if (value === 'topocentric') this.onTopocentric();
    else if (value === 'geocentric') this.onGeocentric();
    else throw Error('The param value should be a right string.');
  }

  /**
   * 获取 地平高度 角度对象
   * 
   * @return {Angle} 地平高度 角度对象
   */
  get h() {
    return new Angle(Math.PI / 2 - this.sc.theta, 'r');
  }

  /**
   * 获取 天顶角 角度对象
   * 
   * @return {Angle} 天顶角 角度对象
   */
  get z() {
    return new Angle(this.sc.theta, 'r');
  }

  /**
   * 获取 方位角 角度对象
   * 
   * @return {Angle} 方位角 角度对象
   */
  get a() {
    return new Angle(this.sc.phi, 'r');
  }
}

module.exports = HorizontalCoordinate;
