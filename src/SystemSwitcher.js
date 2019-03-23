'use strict';

const CommonCoordinate = require('./CommonCoordinate');
const HorizontalCoordinate = require('./HorizontalCoordinate');
const HourAngleCoordinate = require('./HourAngleCoordinate');
const EquinoctialCoordinate = require('./EquinoctialCoordinate');
const EclipticCoordinate = require('./EclipticCoordinate');
const GalacticCoordinate = require('./GalacticCoordinate');
const { JDateRepository } = require('@behaver/jdate');
const SiderealTime = require('@behaver/sidereal-time');
const Angle = require('@behaver/angle');
const angle = new Angle;

/**
 * 天球坐标转换函数集合
 * 
 * @type {Object}
 */
const Switchers = {

  /**
   * 地平坐标 转换至 赤道坐标
   * 
   * @param  {HorizontalCoordinate}  coord 地平坐标实例
   * @return {EquinoctialCoordinate}       赤道坐标实例
   */
  HC2EQC: function(coord) {

    // 获取可转换状态下的 地平球坐标
    let sc = coord.get({
      centerMode: 'geocentric',
      withAR: false,
    }).sc;

    // 变换 地平球坐标 至 赤道球坐标
    sc.inverse('y')
      .rotateY(Math.PI / 2 - angle.setDegrees(coord.private.obGeoLat).getRadian())
      .rotateZ(angle.setSeconds(coord.SiderealTime.trueVal).getRadian());

    // 实例化生成对应状态的赤道坐标对象
    let eqc = new EquinoctialCoordinate({
      sc,
      epoch: coord.obTime,
      withNutation: true,
      withAnnualAberration: true,
      withGravitationalDeflection: true,
      onFK5: true,
      isContinuous: coord.isContinuous,
    });

    return eqc;
  },

  /**
   * 时角坐标 转换至 赤道坐标
   * 
   * @param  {HourAngleCoordinate}   coord 时角坐标实例
   * @return {EquinoctialCoordinate}       赤道坐标实例
   */
  HAC2EQC: function(coord) {

    // 获取时角球坐标
    let sc = coord.sc;

    // 变换 时角球坐标 至 赤道球坐标
    sc.inverse('y')
      .rotateZ(angle.setSeconds(coord.SiderealTime.trueVal).getRadian());

    // 实例化生成对应状态的赤道坐标对象
    let eqc = new EquinoctialCoordinate({
      sc,
      epoch: coord.obTime,
      withNutation: true,
      withAnnualAberration: true,
      withGravitationalDeflection: true,
      onFK5: true,
      isContinuous: coord.isContinuous,
    });

    return eqc;
  },

  /**
   * 黄道坐标 转换至 赤道坐标
   * 
   * @param  {EclipticCoordinate}    coord 黄道坐标实例
   * @return {EquinoctialCoordinate}       赤道坐标实例
   */
  ECC2EQC: function(coord) {

    // 获取可转换状态下的 黄道球坐标
    let sc = coord.get({
      centerMode: 'geocentric',
    }).sc;

    // 获取黄赤交角
    let e0 = angle.setSeconds(coord.Precession.epsilon).getRadian();

    // 变换 黄道球坐标 至 赤道球坐标
    if (coord.withNutation) { // 真坐标
      let delta_e = angle.setMilliseconds(coord.Nutation.obliquity).getRadian();
      sc.rotateX(e0 + delta_e);
    } else { // 平坐标
      sc.rotateX(e0);
    }
    
    // 实例化生成对应状态的赤道坐标对象
    let eqc = new EquinoctialCoordinate({
      sc,
      epoch: coord.epoch,
      withNutation: coord.private.withNutation,
      withAnnualAberration: coord.private.withAnnualAberration,
      withGravitationalDeflection: coord.private.withGravitationalDeflection,
      onFK5: coord.private.onFK5,
      isContinuous: coord.isContinuous,
    });

    return eqc;
  },

  /**
   * 银道坐标 转换至 赤道坐标
   * 
   * @param  {GalacticCoordinate}    coord 银道坐标实例
   * @return {EquinoctialCoordinate}       赤道坐标实例
   */
  GC2EQC: function(coord) {

    // 获取银道球坐标
    let sc = coord.sc;

    // 初始 、赤纬
    let nps_ra = coord.npseqc.ra.getRadian(), // 北银极赤经
        nps_dec = coord.npseqc.dec.getRadian(), // 北银极赤纬
        gc_ra = coord.gceqc.ra.getRadian(), // 银心赤经
        gc_dec = coord.gceqc.dec.getRadian(); // 银心赤纬

    // 求银心与升交点夹角 theta
    // 根据 球面三角余弦公式:
    // cos(theta) = cos(a)cos(gc_dec) + sin(a)sin(gc_dec)cos(90°)
    //            = cos(a)cos(gc_dec)
    // 其中 a = 90° - (gc_ra - nps_ra)
    let a = Math.PI / 2 - (gc_ra - nps_ra);
    let theta = Math.acos(Math.cos(a) * Math.cos(gc_dec));


    // 将银道坐标转换为 初始历元下的天球赤道坐标
    sc.rotateZ(-theta)
      .rotateX(Math.PI / 2 - nps_dec)
      .rotateZ(nps_ra + Math.PI / 2);

    // 实例化生成对应状态的赤道坐标对象
    let eqc = new EquinoctialCoordinate({
      sc,
      epoch: coord.epoch,
      withNutation: false,
      withAnnualAberration: false,
      withGravitationalDeflection: false,
      onFK5: true,
      isContinuous: coord.isContinuous,
    });

    return eqc;
  },

  /**
   * 赤道坐标 转换至 时角坐标
   * 
   * @param  {EquinoctialCoordinate} coord 赤道坐标实例
   * @return {HorizontalCoordinate}        地平坐标实例
   */
  EQC2HC: function(coord, options) {

    let { obTime, obGeoLong, obGeoLat, obElevation, withAR, centerMode } = options;

    // 参数预处理
    if (obTime === undefined) obTime = coord.epoch;
    else if (!(obTime instanceof JDateRepository)) throw Error('The param options.obTime should be a instance of JDateRepository');
    
    if (typeof(obGeoLong) !== 'number') throw Error('The param options.obGeoLong should be a Number');
    else if (obGeoLong < -180 || obGeoLong > 180) throw Error('The param options.obGeoLong should be in [-180, 180]');

    if (typeof(obGeoLat) !== 'number') throw Error('The param options.obGeoLat should be a Number');
    else if (obGeoLat < -90 || obGeoLat > 90) throw Error('The param options.obGeoLat should be in [-90, 90]');

    if (obElevation === undefined) obElevation = 0;
    else if (typeof(obElevation) !== 'number') throw Error('The param options.obElevation should be a Number.');

    // 获取可转换状态下的 地平球坐标
    let { sc } = coord.get({ 
      epoch: obTime, 
      withNutation: true,
      withAnnualAberration: true,
      withGravitationalDeflection: true,
      onFK5: true,
    });

    // 获取观测者恒星时
    let ST = new SiderealTime(obTime, obGeoLong);
    
    // 真恒星时
    let trueST = angle.setSeconds(ST.trueVal).getRadian();
    
    // 变换 赤道球坐标 至 地平球坐标
    sc.rotateZ(- trueST)
      .rotateY(- Math.PI / 2 + angle.setDegrees(obGeoLat).getRadian())
      .inverse('y');

    // 实例化生成对应状态的地平坐标对象
    let hc = new HorizontalCoordinate({
      sc, 
      obTime, 
      obGeoLong, 
      obGeoLat, 
      obElevation,
      withAR: false,
      centerMode: 'geocentric',
      isContinuous: coord.isContinuous,
    });

    if (centerMode === 'topocentric') hc.onTopocentric();
    if (withAR) hc.withAR = true;

    return hc;
  },

  /**
   * 赤道坐标 转换至 时角坐标
   * 
   * @param  {EquinoctialCoordinate} coord 赤道坐标实例
   * @return {HourAngleCoordinate}         时角坐标实例
   */
  EQC2HAC: function(coord, options) {

    let { obTime, obGeoLong } = options;

    // 参数预处理
    if (obTime === undefined) obTime = coord.epoch;
    else if (!(obTime instanceof JDateRepository)) throw Error('The param options.epoch should be a instance of JDateRepository');
    
    if (typeof(obGeoLong) !== 'number') throw Error('The param options.obGeoLong should be a Number');

    // 获取可转换状态下的 时角球坐标
    let { sc } = coord.get({ 
      epoch: obTime, 
      withNutation: true,
      withAnnualAberration: true,
      withGravitationalDeflection: true,
      onFK5: false,
    });

    // 获取观测者恒星时
    let ST = new SiderealTime(obTime, obGeoLong);

    // 真恒星时
    let trueST = angle.setSeconds(ST.trueVal).getRadian();

    // 变换 赤道球坐标 至 时角球坐标
    sc.rotateZ(- trueST)
      .inverse('y');

    // 实例化生成对应状态的时角坐标对象
    let hac = HourAngleCoordinate({
      sc, 
      obTime, 
      obGeoLong,
      isContinuous: coord.isContinuous,
    });

    return hac;
  },

  /**
   * 赤道坐标 转换至 黄道坐标
   * 
   * @param  {EquinoctialCoordinate} coord 赤道坐标实例
   * @return {EclipticCoordinate}          黄道坐标实例
   */
  EQC2ECC: function(coord, options) {

    // 获取可转换状态下的 赤道球坐标
    let sc = coord.sc;

    // 获取黄赤交角
    let e0 = angle.setSeconds(coord.Precession.epsilon).getRadian();

    // 变换 赤道球坐标 至 黄道球坐标
    if (coord.private.withNutation) { // 真坐标
      let delta_e = angle.setMilliseconds(coord.Nutation.obliquity).getRadian();
      sc.rotateX(-e0 - delta_e);
    } else { // 平坐标
      sc.rotateX(-e0);
    }

    // 实例化生成对应状态的黄道坐标对象
    let ecc = new EclipticCoordinate({
      sc,
      epoch: coord.epoch,
      withNutation: coord.private.withNutation,
      withAnnualAberration: coord.private.withAnnualAberration,
      withGravitationalDeflection: coord.private.withGravitationalDeflection,
      onFK5: coord.private.onFK5,
      centerMode: 'geocentric',
      isContinuous: coord.isContinuous,
    });

    if (options !== undefined) ecc.on(options);
    
    return ecc;
  },

  /**
   * 赤道坐标 转换至 银道坐标
   * 
   * @param  {EquinoctialCoordinate} coord 赤道坐标实例
   * @return {GalacticCoordinate}          银道坐标实例
   */
  EQC2GC: function(coord, options) {

    // 获取可转换状态下的 赤道球坐标
    let { sc } = coord.get({ 
      epoch: new JDateRepository(0, 'j2000'), 
      withNutation: false,
      withAnnualAberration: false,
      withGravitationalDeflection: false,
      onFK5: false,
    });

    // J2000 北银极赤经、赤纬
    let nps_ra = angle.setDegrees(192.85948).getRadian(), // 北银极赤经
        nps_dec = angle.setDegrees(27.12825).getRadian(), // 北银极赤纬
        gc_ra = angle.setDegrees(266.405).getRadian(), // 银心赤经
        gc_dec = angle.setDegrees(-28.936).getRadian(); // 银心赤纬

    // 求银心与升交点夹角 theta
    // 根据 球面三角余弦公式:
    // cos(theta) = cos(a)cos(gc_dec) + sin(a)sin(gc_dec)cos(90°)
    //            = cos(a)cos(gc_dec)
    // 其中 a = 90° - (gc_ra - nps_ra)
    let a = Math.PI / 2 - (gc_ra - nps_ra);
    let theta = Math.acos(Math.cos(a) * Math.cos(gc_dec));

    // 将赤道坐标 转换为 银道坐标
    sc.rotateZ(- nps_ra - Math.PI / 2)
      .rotateX(- Math.PI / 2 + nps_dec)
      .rotateZ(theta);

    // 实例化生成对应状态的银道坐标对象
    let gc = new GalacticCoordinate({
      sc,
      isContinuous: coord.isContinuous,
    });

    if (options !== undefined) gc.on(options);

    return gc;
  },
};

/**
 * SystemSwitcher
 * 
 * SystemSwitcher 是一个用于天球坐标系统转换的组件
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class SystemSwitcher {

  /**
   * 构造函数
   * 
   * @param {CommonCoordinate} coord 天球坐标实例
   */
  constructor(coord) {
    // 初始化私有变量空间
    this.private = {};

    if (coord !== undefined) this.from(coord);
  }

  /**
   * 设定转换过程的源坐标
   * 
   * @param  {CommonCoordinate} coord 源天球坐标实例
   * @return {SystemSwitcher}         返回 this 引用
   */
  from(coord) {
    // 参数检验
    if (!(coord instanceof CommonCoordinate)) throw Error('The param coord should be an instance of CommonCoordinate.');

    let EQC;

    // 转换天球坐标 至 赤道坐标系统
    if (coord instanceof EquinoctialCoordinate) {
      EQC = coord;
    } else if (coord instanceof HorizontalCoordinate) {
      EQC = Switchers.HC2EQC(coord);
    } else if (coord instanceof HourAngleCoordinate) {
      EQC = Switchers.HAC2EQC(coord);
    } else if (coord instanceof EclipticCoordinate) {
      EQC = Switchers.ECC2EQC(coord);
    } else if (coord instanceof GalacticCoordinate) {
      EQC = Switchers.GC2EQC(coord);
    } else {
      throw Error('Unknow CommonCoordinate instance be given.');
    }

    this.private.EQC = EQC;

    return this;
  }

  /**
   * 转换至目标坐标系统
   * 
   * @param  {String}           sysCode 目标坐标系统字串标识
   * @param  {Object}           options 目标系统设定参数
   * @return {CommonCoordinate}         转换后的目标天球坐标实例
   */
  to(sysCode, options) {

    // 合法检验
    if (typeof(sysCode) !== 'string') throw Error('The param sysCode should be a String.');
    if (this.private.EQC === undefined) throw Error('The original celetial coordinate should have been setted first.');

    // 转换中间结果赤道坐标至目标系统坐标
    switch(sysCode.toLowerCase()) {
      case 'eqc': // 转换至赤道坐标
        let eqc = this.private.EQC;

        let res = new EquinoctialCoordinate({
          sc: eqc.sc,
          epoch: eqc.epoch, 
          withNutation: eqc.withNutation, 
          withAnnualAberration: eqc.withAnnualAberration,
          withGravitationalDeflection: eqc.withGravitationalDeflection,
          onFK5: eqc.onFK5,
          isContinuous: eqc.isContinuous,
        });
        
        if(options !== undefined) res.on(options);

        return res;
      case 'hc': // 转换至地平坐标
        return Switchers.EQC2HC(this.private.EQC, options);

      case 'hac': // 转换至时角坐标
        return Switchers.EQC2HAC(this.private.EQC, options);

      case 'ecc': // 转换至黄道坐标
        return Switchers.EQC2ECC(this.private.EQC, options);

      case 'gc': // 转换至银道坐标
        return Switchers.EQC2GC(this.private.EQC, options);
      
      default:
        throw Error('The param sysCode is not valid.');
    }
  }
}

module.exports = SystemSwitcher;
