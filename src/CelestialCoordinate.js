'use strict';

const { JDateRepository } = require('@behaver/jdate');
const Angle = require('@behaver/angle');

const HorizontalCoordinate = require('./HorizontalCoordinate');
const HourAngleCoordinate = require('./HourAngleCoordinate');
const EquinoctialCoordinate = require('./EquinoctialCoordinate');
const EclipticCoordinate = require('./EclipticCoordinate');
const GalacticCoordinate = require('./GalacticCoordinate');

/**
 * CelestialCoordinate
 *
 * CelestialCoordinate 是一个基于 NodeJS 开发的天文学坐标计算工具，主要可被用于天体天球坐标的转换和处理。
 *
 * todo: 各坐标数据的协同一致
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class CelestialCoordinate {

  /**
   * 基于地平系统实例化天球坐标
   *
   * @static
   * @param  {Object} options      坐标系统参数
   * @param  {Object} ob_options   观测参数
   * @return {CelestialCoordinate} 天球坐标实例
   */
  static horizontal(options, ob_options) {
    options.system = 'horizontal';
    return new CelestialCoordinate(options, ob_options);
  }

  /**
   * 基于时角系统实例化天球坐标
   *
   * @static
   * @param  {Object} options      坐标系统参数
   * @param  {Object} ob_options   观测参数
   * @return {CelestialCoordinate} 天球坐标实例
   */
  static hourAngle(options, ob_options) {
    options.system = 'hourangle';
    return new CelestialCoordinate(options, ob_options);
  }

  /**
   * 基于赤道系统实例化天球坐标
   *
   * @static
   * @param  {Object} options      坐标系统参数
   * @param  {Object} ob_options   观测参数
   * @return {CelestialCoordinate} 天球坐标实例
   */
  static equinoctial(options, ob_options) {
    options.system = 'equinoctial';
    return new CelestialCoordinate(options, ob_options);
  }

  /**
   * 基于黄道系统实例化天球坐标
   *
   * @static
   * @param  {Object} options      坐标系统参数
   * @param  {Object} ob_options   观测参数
   * @return {CelestialCoordinate} 天球坐标实例
   */
  static ecliptic(options, ob_options) {
    options.system = 'ecliptic';
    return new CelestialCoordinate(options, ob_options);
  }

  /**
   * 基于银道系统实例化天球坐标
   *
   * @static
   * @param  {Object} options      坐标系统参数
   * @param  {Object} ob_options   观测参数
   * @return {CelestialCoordinate} 天球坐标实例
   */
  static galactic(options, ob_options) {
    options.system = 'galactic';
    return new CelestialCoordinate(options, ob_options);
  }

  /**
   * 构造函数
   * 
   * @param {Object} options    坐标系统参数
   * @param {Object} ob_options 观测参数
   */
  constructor(options, ob_options) {
    // 初始化属性空间
    this.private = {};
    this.instances = {};
    this.obOptions = {};

    this.from(options, ob_options);
  }

  /**
   * 设定起始天球坐标
   * 
   * @param  {Object} options      坐标系统参数
   * @param  {Object} ob_options   观测参数
   * @return {CelestialCoordinate} 当前对象 this 引用
   */
  from(options, ob_options) {
    if (typeof(options) !== 'object') throw Error('The param options should be a Object.');

    if (options.system === undefined) this.private.system = 'equinoctial';
    else if (typeof(options.system) !== 'string') throw Error('The param options.system should be a Srring.');
    else this.private.system = options.system.toLowerCase();

    this.instances = {};

    if (ob_options !== undefined) {
      // 设置天球坐标观测参数
      this.changeObserver(ob_options);
    }

    switch(this.private.system) {
      case 'horizontal': 
        if (typeof(ob_options) !== 'object') throw Error('To construct a HorizontalCoordinate, the param ob_options should be a Object.');
        
        // 初始化补全 地平坐标 参数
        options.obTime = ob_options.time;
        options.obGeoLong = ob_options.geoLong;
        options.obGeoLat = ob_options.geoLat;

        this.instances.horizontal = new HorizontalCoordinate(options);

        // this.instances.horizontal.afterChange(() => {
        //   this.clearCache();
        // }.bind(this));
        break;

      case 'hourangle':
        if (typeof(ob_options) !== 'object') throw Error('To construct a HourAngleCoordinate, the param ob_options should be a Object.');
        
        // 初始化补全 时角坐标 参数
        options.obTime = ob_options.time;
        options.obGeoLong = ob_options.geoLong;

        this.instances.hourangle = new HourAngleCoordinate(options);
        break;

      case 'equinoctial':
        this.instances.equinoctial = new EquinoctialCoordinate(options);
        break;

      case 'ecliptic':
        this.instances.ecliptic = new EclipticCoordinate(options);
        break;

      case 'galactic':
        this.instances.galactic = new GalacticCoordinate(options);
        break;

      default:
        throw Error('The param options.system should be valid.');
    }

    return this;
  }

  /**
   * 设置观测参数
   * 
   * @param  {JDateRepository}     options.time    观测历元
   * @param  {Number}              options.geoLong 观测点地理经度
   * @param  {Number}              options.geoLat  观测点地理纬度
   * @return {CelestialCoordinate}                 返回 this 引用
   */
  changeObserver({
    time,
    geoLong,
    geoLat,
  }) {
    // 参数验证与预处理
    if (time === undefined) time = this.obOptions.time;
    else if (!(time instanceof JDateRepository)) throw Error('The param time should be a instance of JDateRepository');
    
    if (geoLong === undefined) geoLong = this.obOptions.geoLong === undefined ? 0 : this.obOptions.geoLong
    else if (typeof(geoLong) !== 'number') throw Error('The param geoLong should be a Number');
    else if (geoLong < -180 || geoLong > 180) throw Error('The param geoLong should be in [-180, 180]');

    if (geoLat === undefined) geoLat = this.obOptions.geoLat === undefined ? 0 : this.obOptions.geoLat;
    else if (typeof(geoLat) !== 'number') throw Error('The param geoLat should be a Number');
    else if (geoLat < -90 || geoLat > 90) throw Error('The param geoLat should be in [-90, 90]');
    
    // 类观测属性赋值
    this.obOptions.time = time;
    this.obOptions.geoLong = geoLong;
    this.obOptions.geoLat = geoLat;

    // 根据新的观测参数，更新坐标实例
    if (this.private.system === 'horizontal') {
      this.instances = {
        horizontal: this.instances.horizontal,
      }
    } else if (this.private.system === 'hourangle') {
      this.instances = {
        hourangle: this.instances.hourangle,
      }
    }

    if (this.instances.horizontal !== undefined) this.instances.horizontal.on({
      obTime: time,
      obGeoLong: geoLong,
      obGeoLat: geoLat,
    });

    if (this.instances.hourangle !== undefined) this.instances.hourangle.on({
      obTime: time,
      obGeoLong: geoLong,
    });

    return this;
  }

  /**
   * 设定 天球地平坐标对象
   * 
   * @param  {HorizontalCoordinate} horizontal 天球地平坐标对象
   */
  set horizontal(horizontal) {
    // 参数验证
    if (!(horizontal instanceof HorizontalCoordinate)) throw Error('The param horizontal should be a HorizontalCoordinate.');

    this.private.system = 'horizontal';
    this.instances = { horizontal };

    // 设定观测参数
    this.obOptions.time = horizontal.obTime;
    this.obOptions.geoLong = horizontal.obGeoLong.getDegrees();
    this.obOptions.geoLat = horizontal.obGeoLat.getDegrees();
  }

  /**
   * 获取 天球地平坐标对象
   * 
   * @return {HorizontalCoordinate} 天球地平坐标对象
   */
  get horizontal() {
    if (this.instances.horizontal === undefined) {
      let hc_obj = this.instances[this.private.system].toHorizontal({
        obTime: this.obOptions.Time,
        obGeoLong: this.obOptions.geoLong,
        obGeoLat: this.obOptions.geoLat,
      });

      this.instances.horizontal = new HorizontalCoordinate(hc_obj);

      // this.instances.horizontal.afterChange(() => {

      // }.bind(this));
    }

    return this.instances.horizontal;
  }

  /**
   * 设定 天球时角坐标对象
   * 
   * @param  {HourAngleCoordinate} hourangle 天球时角坐标对象
   */
  set hourAngle(hourangle) {
    // 参数验证
    if (!(hourangle instanceof HourAngleCoordinate)) throw Error('The param hourangle should be a HourAngleCoordinate.');

    this.private.system = 'hourangle';
    this.instances = { hourangle };

    // 设定观测参数
    this.obOptions.time = hourangle.obTime;
    this.obOptions.geoLong = hourangle.obGeoLong.getDegrees();
  }

  /**
   * 获取 天球时角坐标对象
   * 
   * @return {HourAngleCoordinate} 天球时角坐标对象
   */
  get hourAngle() {
    if (this.instances.hourangle === undefined) {
      let hac_obj = this.instances[this.private.system].toHourAngle({
        obTime: this.obOptions.Time,
        obGeoLong: this.obOptions.geoLong,
      });
      this.instances.hourangle = new HourAngleCoordinate(hac_obj);
    }

    return this.instances.hourangle;
  }

  /**
   * 设定 天球赤道坐标对象
   * 
   * @param  {EquinoctialCoordinate} equinoctial 天球赤道坐标对象
   */
  set equinoctial(equinoctial) {
    // 参数验证
    if (!(equinoctial instanceof EquinoctialCoordinate)) throw Error('The param equinoctial should be a EquinoctialCoordinate.');

    this.private.system = 'equinoctial';
    this.instances = { equinoctial };
    this.obOptions = {};
  }

  /**
   * 获取 天球黄道坐标对象
   * 
   * @return {EquinoctialCoordinate} 天球黄道坐标对象
   */
  get equinoctial() {
    if (this.instances.equinoctial === undefined) {
      let eqc_obj = this.instances[this.private.system].toEquinoctial();
      this.instances.equinoctial = new EquinoctialCoordinate(eqc_obj);
    }

    return this.instances.equinoctial;
  }

  /**
   * 设定 天球黄道坐标对象
   * 
   * @param  {EclipticCoordinate} ecliptic 天球黄道坐标对象
   */
  set ecliptic(ecliptic) {
    // 参数验证
    if (!(ecliptic instanceof EclipticCoordinate)) throw Error('The param ecliptic should be a EclipticCoordinate.');

    this.private.system = 'ecliptic';
    this.instances = { ecliptic };
    this.obOptions = {};
  }

  /**
   * 获取 天球黄道坐标对象
   * 
   * @return {EclipticCoordinate} 天球黄道坐标对象
   */
  get ecliptic() {
    if (this.instances.ecliptic === undefined) {
      let ecc_obj = this.instances[this.private.system].toEcliptic();
      this.instances.ecliptic = new EclipticCoordinate(ecc_obj);
    }

    return this.instances.ecliptic;
  }

  /**
   * 设定 天球银道坐标对象
   * 
   * @param  {GalacticCoordinate} galactic 天球银道坐标对象
   */
  set galactic(galactic) {
    // 参数验证
    if (!(galactic instanceof GalacticCoordinate)) throw Error('The param galactic should be a GalacticCoordinate.');

    this.private.system = 'galactic';
    this.instances = { galactic };
    this.obOptions = {};
  }

  /**
   * 获取 天球银道坐标对象
   * 
   * @return {EclipticCoordinate} 天球银道坐标对象
   */
  get galactic() {
    if (this.instances.galactic === undefined) {
      let gc_obj = this.instances[this.private.system].toGalactic();
      this.instances.galactic = new GalacticCoordinate(gc_obj);
    }

    return this.instances.galactic;
  }

  /**
   * 获取 观测时间
   * 
   * @return {JDateRepository} 观测时间
   */
  get obTime() {
    return new JDateRepository(this.obOptions.time.JD);
  }

  /**
   * 获取 观测点地理经度
   * 
   * @return {Angle} 观测点地理经度
   */
  get obGeoLong() {
    return new Angle(this.obOptions.geoLong, 'd');
  }

  /**
   * 获取 观测点地理纬度
   * 
   * @return {Angle} 观测点地理纬度
   */
  get obGeoLat() {
    return new Angle(this.obOptions.geoLat, 'd');
  }

  /**
   * 清除坐标实例缓存
   * 
   * @return {CelestialCoordinate} 返回 this 引用
   */
  clearCache() {
    this.instances = {
      [this.private.system]: this.instances[this.private.system]
    };

    return this;
  }
}

module.exports = CelestialCoordinate;
