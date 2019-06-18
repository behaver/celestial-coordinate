'use strict';

const CommonCoordinate = require('./CommonCoordinate');
const EquinoctialCoordinate = require('./EquinoctialCoordinate');
const { JDateRepository } = require('@behaver/jdate');
const SiderealTime = require('@behaver/sidereal-time');
const DiurnalParallax = require('@behaver/diurnal-parallax');
const AtmosphericRefraction = require('@behaver/atmospheric-refraction');
const Angle = require('@behaver/angle');

const angle = new Angle;

/**
 * HorizontalCoordinate
 * 
 * 天球地平坐标对象
 *
 * @author 董 三碗 <qianxing@yeah.net>
 */
class HorizontalCoordinate extends CommonCoordinate {

  /**
   * 设定起始天球地平坐标
   * 
   * @param  {JDateRepository}       options.epoch       观测历元
   * @param  {Number}                options.obGeoLong   观测点地理经度，单位：度，值域：[180, 180]
   * @param  {Number}                options.obGeoLat    观测点地理纬度，单位：度，值域：[-90, 90]
   * @param  {Number}                options.obElevation 观测点海拔高度，单位：米，值域：值域：[-12000, 3e7]
   * @param  {SphericalCoordinate3D} options.sc          球坐标
   * @param  {Number}                options.longitude   方位角，单位：度
   * @param  {Number}                options.latitude    地平高度，单位：度
   * @param  {Number}                options.radius      坐标距离半径，值域：[10e-8, +∞)
   * @param  {String}                options.centerMode  中心模式：geocentric（地心坐标）、topocentric（站心坐标）
   * @param  {Boolean}               options.enableAR    大气折射修正启用状态
   * @param  {Boolean}               options.withAR      坐标是否含有大气折射
   * 
   * @return {HorizontalCoordinate}                      返回 this 引用
   */
  from({
    epoch,
    obGeoLong,
    obGeoLat,
    obElevation,
    sc,
    longitude,
    latitude,
    radius,
    centerMode,
    enableAR,
    withAR,
  }) {

    if (!(epoch instanceof JDateRepository)) throw Error('The param epoch should be a JDateRepository.');

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

    if (enableAR === undefined) {
      if (withAR === undefined) enableAR = false;
      else enableAR = true;
    }

    this.SiderealTime = new SiderealTime(epoch, obGeoLong);

    this.private = {
      ...this.private,
      epoch,
      obGeoLong,
      obGeoLat,
      obElevation,
      centerMode,
      enableAR: !! enableAR,
      withAR: !! withAR,
    };

    this.position({
      sc,
      longitude,
      latitude,
      radius,
    });

    return this;
  }

  /**
   * 转换当前坐标的系统参数
   * 
   * @param  {JDateRepository}      options.epoch       观测历元
   * @param  {Number}               options.obGeoLong   观测点地理经度
   * @param  {Number}               options.obGeoLat    观测点地理纬度
   * @param  {Number}               options.obElevation 观测点海拔高度，单位：米，值域：值域：[-12000, 3e7]
   * @param  {String}               options.centerMode  中心模式：geocentric（地心坐标）、topocentric（站心坐标）
   * @param  {Boolean}              options.enableAR    大气折射修正启用状态
   * @param  {Boolean}              options.withAR      坐标是否含有大气折射
   * 
   * @return {HorizontalCoordinate}                      返回 this 引用
   */
  on({
    epoch,
    obGeoLong,
    obGeoLat,
    obElevation,
    centerMode,
    enableAR,
    withAR,
  }) {
    let changeEpoch = false;

    if (epoch === undefined) {
      epoch = this.private.epoch;
      changeEpoch = false;
    } else if (!(epoch instanceof JDateRepository)) throw Error('The param epoch should be a JDateRepository.');
    else changeEpoch = true;

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

    if (enableAR !== undefined) this.enableAR = enableAR;
    if (withAR !== undefined) this.withAR = withAR;

    // 将原始坐标转换成地心坐标
    this.onGeocentric();

    // 将地平球坐标转换至瞬时赤道球坐标
    let sc1 = this.sc
      .inverse('y')
      .rotateY(Math.PI / 2 - angle.setDegrees(this.private.obGeoLat).getRadian())
      .rotateZ(angle.setSeconds(this.SiderealTime.trueVal).getRadian());

    // 保持球坐标值连续性的值更改
    this.private.SCContinuouslyChange(sc1);

    if (changeEpoch) { // 针对观测时间改变的情况，引入赤道坐标对象处理
      let ec = new EquinoctialCoordinate({
        sc: this.sc,
        epoch: this.epoch,
        withNutation: true,
        isContinuous: true,
      });

      this.private.sc = ec.get({ 
        epoch: epoch,
      }).sc;
 
      this.private.epoch = epoch;
    }
      
    // 更新恒星时对象、观测经度、观测纬度
    this.SiderealTime = new SiderealTime(epoch, obGeoLong);

    // 将瞬时赤道坐标转换至地平球坐标
    let sc2 = this.sc
      .rotateZ(- angle.setSeconds(this.SiderealTime.trueVal).getRadian())
      .rotateY(- Math.PI / 2 + angle.setDegrees(obGeoLat).getRadian())
      .inverse('y');

    // 保持球坐标值连续性的值更改
    this.private.SCContinuouslyChange(sc2);

    this.private.obGeoLong = obGeoLong;
    this.private.obGeoLat = obGeoLat;
    this.private.obElevation = obElevation;

    // 转换成新站心坐标以及处理大气折射（如果设定需要的话）
    if (centerMode === 'topocentric') {
      // 转化为新站心坐标
      this.onTopocentric();

      // 添加大气折射
      if (enableAR && withAR) this.patchAR();
    }

    return this;
  }

  /**
   * 转换坐标至站心坐标
   * 
   * @return {HorizontalCoordinate} 返回 this 引用
   */
  onTopocentric() {
    if (this.private.centerMode === 'geocentric') {
      // 在原有地心坐标的基础上进行转换
      let dp = new DiurnalParallax({
        gc: this.sc,
        siderealTime: this.SiderealTime,
        obGeoLat: this.private.obGeoLat,
        obElevation: this.private.obElevation,
        system: 'horizontal',
      });

      // 保持球坐标值连续性的值更改
      this.private.SCContinuouslyChange(dp.TC);

      this.private.centerMode = 'topocentric';
    }

    return this;
  }

  /**
   * 转换坐标至地心坐标
   * 
   * @return {HorizontalCoordinate} 返回 this 引用
   */
  onGeocentric() {
    if (this.private.centerMode === 'topocentric') {
      if (this.enableAR) this.unpatchAR();

      let dp = new DiurnalParallax({
        tc: this.sc,
        siderealTime: this.SiderealTime,
        obGeoLat: this.private.obGeoLat,
        obElevation: this.private.obElevation,
        system: 'horizontal',
      });

      // 保持球坐标值连续性的值更改
      this.private.SCContinuouslyChange(dp.GC);

      this.private.centerMode = 'geocentric';
    }

    return this;
  }

  /**
   * 添加大气折射的影响
   * 
   * @return {HorizontalCoordinate} 返回 this 引用
   */
  patchAR() {
    if (this.enableAR && !this.private.withAR) {
      let h = angle.setRadian(Math.PI / 2 - this.private.sc.theta).getDegrees();
      
      if (h > 0) {
        let ar = new AtmosphericRefraction({
          trueH: h,
        });

        let sc = this.sc;

        // 修正后的球坐标
        sc.theta = Math.PI / 2 - angle.setDegrees(ar.apparentH).getRadian();

        // 保持球坐标值连续性的值更改
        this.private.SCContinuouslyChange(sc);
      }

      this.private.withAR = true;
    }

    return this;
  }

  /**
   * 去除大气折射的影响
   * 
   * @return {HorizontalCoordinate} 返回 this 引用
   */
  unpatchAR() {
    if (this.enableAR && this.private.withAR) {
      let h = angle.setRadian(Math.PI / 2 - this.private.sc.theta).getDegrees();
      
      if (h > 0) {
        let ar = new AtmosphericRefraction({
          apparentH: h,
        });

        let sc = this.sc;

        // 修正后的球坐标
        sc.theta = Math.PI / 2 - angle.setDegrees(ar.trueH).getRadian();
      
        // 保持球坐标值连续性的值更改
        this.private.SCContinuouslyChange(sc);
      }

      this.private.withAR = false;
    }

    return this;
  }

  /**
   * 转换坐标至观测视角坐标
   * 
   * @return {HorizontalCoordinate} 返回 this 引用
   */
  onObservedView() {
    return this.onTopocentric().patchAR();
  }

  /**
   * 获取指定系统参数的坐标结果
   * 
   * @param  {JDateRepository} options.epoch       观测历元
   * @param  {Number}          options.obGeoLong   观测点地理经度
   * @param  {Number}          options.obGeoLat    观测点地理纬度
   * @param  {Number}          options.obElevation 观测点海拔高度，单位：米，值域：值域：[-12000, 3e7]
   * @param  {String}          options.centerMode  中心模式：geocentric（地心坐标）、topocentric（站心坐标）
   * @param  {Boolean}         options.enableAR    大气折射修正启用状态
   * @param  {Boolean}         options.withAR      坐标是否含有大气折射
   * 
   * @return {Object}                              坐标结果对象
   */
  get(options) {
    if (options == undefined) {
      return { 
        sc: this.sc, 
        epoch: this.epoch, 
        obGeoLong: this.obGeoLong, 
        obGeoLat: this.obGeoLat, 
        obElevation: this.obElevation,
        centerMode: this.centerMode,
        enableAR: this.enableAR,
        withAR: this.withAR,
      };
    } else {
      // 记录原坐标和条件，输出目标坐标后恢复
      let sc_0 = this.sc,
          epoch_0 = this.epoch,
          obGeoLong_0 = this.obGeoLong,
          obGeoLat_0 = this.obGeoLat,
          obElevation_0 = this.obElevation,
          centerMode_0 = this.centerMode,
          enableAR_0 = this.enableAR,
          withAR_0 = this.withAR;

      this.on(options);

      // 记录新坐标和条件
      let res = {
        sc: this.sc,
        epoch: this.epoch,
        obGeoLong: this.obGeoLong.getDegrees(),
        obGeoLat: this.obGeoLat.getDegrees(),
        obElevation: this.obElevation,
        centerMode: this.centerMode,
        enableAR: this.enableAR,
        withAR: this.withAR,
      };

      // 还原为初始坐标和条件
      this.private.sc = sc_0;
      this.private.epoch = epoch_0;
      this.private.obGeoLong = obGeoLong_0.getDegrees();
      this.private.obGeoLat = obGeoLat_0.getDegrees();
      this.private.obElevation = obElevation_0;
      this.private.centerMode = centerMode_0;
      this.private.enableAR = enableAR_0;
      this.private.withAR = withAR_0;
      this.SiderealTime = new SiderealTime(epoch_0, obGeoLong_0.getDegrees());

      return res;
    }
  }

  /**
   * 转换坐标至目标历元
   * 
   * @param  {JDateRepository}      epoch 目标历元
   * 
   * @return {HorizontalCoordinate}       返回 this 引用
   */
  onEpoch(value) {
    return this.on({
      epoch: value,
    });
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
   * 设置 观测经度 角度对象
   * 
   * @param {Angle} value 观测经度 角度对象
   */
  set obGeoLong(value) {
    this.on({
      obGeoLong: value
    });
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
   * 设置 观测纬度 角度对象
   * 
   * @param {Angle} value 观测纬度 角度对象
   */
  set obGeoLat(value) {
    this.on({
      obGeoLat: value
    });
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
   * 设置 观测海拔高度，单位：米
   * 
   * @param {Number} value 观测海拔高度，单位：米
   */
  set obElevation(value) {
    this.on({
      obElevation: value
    });
  }

  /**
   * 获取 大气折射功能启用状态
   * 
   * @return {Boolean} 大气折射功能启用状态
   */
  get enableAR() {
    return this.private.enableAR;
  }

  /**
   * 设置 大气折射功能启用状态
   * 
   * @param {Boolean} value 大气折射功能启用状态
   */
  set enableAR(value) {
    this.private.enableAR = !! value;
  }

  /**
   * 获取 当前坐标是否含有大气折射修正
   * 
   * @return {Boolean} 当前坐标是否含有大气折射修正
   */
  get withAR() {
    return this.private.withAR;
  }

  /**
   * 设置 当前坐标是否含有大气折射修正
   * 
   * @param {Boolean} value 当前坐标是否含有大气折射修正
   */
  set withAR(value) {
    if (this.enableAR) { 
      if (value) this.patchAR();
      else this.unpatchAR();
    } else this.private.withAR = !! value;
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
}

module.exports = HorizontalCoordinate;
