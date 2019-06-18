'use strict';

const CommonCoordinate = require('./CommonCoordinate');
const EquinoctialCoordinate = require('./EquinoctialCoordinate');
const { JDateRepository } = require('@behaver/jdate');
const SiderealTime = require('@behaver/sidereal-time');
const Angle = require('@behaver/angle');

const angle = new Angle;

/**
 * HourAngleCoordinate
 * 
 * 天球时角坐标对象
 *
 * @author 董 三碗 <qianxing@yeah.net>
 */
class HourAngleCoordinate extends CommonCoordinate {

  /**
   * 设定起始天球时角坐标
   * 
   * @param  {JDateRepository}       options.epoch     观测历元
   * @param  {Number}                options.obGeoLong 观测点地理经度，单位：度，值域：[180, 180]
   * @param  {SphericalCoordinate3D} options.sc        球坐标
   * @param  {Number}                options.longitude 时角，单位：度，值域：[0, 360)
   * @param  {Number}                options.latitude  赤纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius    坐标距离半径，值域：[10e-8, +∞)
   * 
   * @return {HourAngleCoordinate}                     返回 this 引用
   */
  from({
    epoch,
    obGeoLong,
    sc,
    longitude,
    latitude,
    radius,
  }) {

    if (!(epoch instanceof JDateRepository)) throw Error('The param epoch should be a JDateRepository.');

    if (typeof(obGeoLong) !== 'number') throw Error('The param obGeoLong should be a Number.');
    else if (obGeoLong < -180 || obGeoLong > 180) throw Error('The param obGeoLong should be in [-180, 180]');

    this.SiderealTime = new SiderealTime(epoch, obGeoLong);

    this.private = {
      ...this.private,
      epoch,
      obGeoLong,
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
   * @param  {JDateRepository}     options.epoch     观测历元
   * @param  {Number}              options.obGeoLong 观测点地理经度
   * 
   * @return {HourAngleCoordinate}                   返回 this 引用
   */
  on({
    epoch,
    obGeoLong,
  }) {
    let changeEpoch = false;

    if (epoch === undefined) {
      epoch = this.private.epoch;
      changeEpoch = true;
    } else if (!(epoch instanceof JDateRepository)) throw Error('The param epoch should be a JDateRepository.');
    
    if (obGeoLong === undefined) obGeoLong = this.private.obGeoLong;
    else if (typeof(obGeoLong) !== 'number') throw Error('The param obGeoLong should be a Number');
    else if (obGeoLong < -180 || obGeoLong > 180) throw Error('The param obGeoLong should be in [-180, 180]');

    // 将时角球坐标转换至瞬时赤道球坐标
    let sc1 = this.sc
      .inverse('y')
      .rotateZ(angle.setSeconds(this.SiderealTime.trueVal).getRadian());

    // 保持球坐标值连续性的值更改
    this.private.SCContinuouslyChange(sc1);

    if (changeEpoch) { // 针对观测时间改变的情况，引入赤道坐标对象处理
      let ec = new EquinoctialCoordinate({
        sc: this.sc,
        epoch: this.epoch,
        withNutation: true,
        withAnnualAberration: true,
        withGravitationalDeflection: true,
        onFK5: true,
        isContinuous: true,
      });

      this.private.sc = ec.get({ 
        epoch: epoch,
      }).sc;

      this.private.epoch = epoch;
    }

    // 更新恒星时对象、观测经度、观测纬度
    this.SiderealTime = new SiderealTime(epoch, obGeoLong);
    this.private.obGeoLong = obGeoLong;

    // 将瞬时赤道坐标转换至时角球坐标
    let sc2 = this.sc
      .rotateZ(- angle.setSeconds(this.SiderealTime.trueVal).getRadian())
      .inverse('y');

    // 保持球坐标值连续性的值更改
    this.private.SCContinuouslyChange(sc2);

    return this;
  }

  /**
   * 获取指定系统参数的坐标结果
   * 
   * @param  {JDateRepository} options.epoch     观测历元
   * @param  {Number}          options.obGeoLong 观测点地理经度
   * 
   * @return {Object}                            坐标结果对象
   */
  get(options) {
    if (options == undefined) {
      return { 
        sc: this.sc, 
        epoch: this.epoch, 
        obGeoLong: this.obGeoLong, 
      };
    } else {
      // 记录原坐标和条件，输出目标坐标后恢复
      let sc_0 = this.sc;
      let epoch_0 = this.epoch;
      let obGeoLong_0 = this.obGeoLong;

      this.on(options);

      // 记录新坐标和条件
      let sc = this.sc;
      let epoch = this.epoch;
      let obGeoLong = this.obGeoLong.getDegrees();

      // 还原为初始坐标和条件
      this.private.sc = sc_0;
      this.private.epoch = epoch_0;
      this.private.obGeoLong = obGeoLong_0.getDegrees();

      this.SiderealTime = new SiderealTime(epoch_0, obGeoLong_0.getDegrees());

      return {
        sc, 
        epoch, 
        obGeoLong, 
      }
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
}

module.exports = HourAngleCoordinate;
