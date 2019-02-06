'use strict';

const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const Precession = require('@behaver/precession');
const Nutation = require('@behaver/nutation');
const { JDateRepository, CacheSpaceOnJDate } = require('@behaver/jdate');
const { EarthHECC } = require('@behaver/solar-planets-hecc');
const SiderealTime = require('@behaver/sidereal-time');
const AnnualAberration = require('@behaver/annual-aberration');
const EquinoctialCoordinate = require('./EquinoctialCoordinate');
const GravitationalDeflection = require('@behaver/gravitational-deflection');
const FK5Deflection = require('@behaver/fk5-deflection');
const Angle = require('@behaver/angle');

const angle = new Angle;

/**
 * EclipticCoordinate
 * 
 * EclipticCoordinate 是天球黄道坐标对象
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class EclipticCoordinate {

  /**
   * 构造函数
   * 
   * @param  {SphericalCoordinate3D} options.sc                          球坐标
   * @param  {Number}                options.l                           黄经，单位：度，值域：[0, 360)
   * @param  {Number}                options.b                           黄纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius                      距离半径，值域：[10e-8, +∞)
   * @param  {JDateRepository}       options.epoch                       坐标历元
   * @param  {String}                options.centerMode                  中心模式：geocentric（地心坐标）、heliocentric（日心坐标）
   * @param  {Boolean}               options.withNutation                坐标是否修正了章动
   * @param  {Boolean}               options.withAnnualAberration        坐标是否修正了周年光行差
   * @param  {Boolean}               options.withGravitationalDeflection 坐标是否修正了引力偏转
   * @param  {Boolean}               options.onFK5                       坐标是否进行了 FK5 修正
   */
  constructor(options) {
    this.from(options);
  }

  /**
   * 设定起始天球黄道坐标
   * 
   * @param  {SphericalCoordinate3D} options.sc                          球坐标
   * @param  {Number}                options.l                           黄经，单位：度，值域：[0, 360)
   * @param  {Number}                options.b                           黄纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius                      距离半径，值域：[10e-8, +∞)
   * @param  {JDateRepository}       options.epoch                       坐标历元
   * @param  {String}                options.centerMode                  中心模式：geocentric（地心坐标）、heliocentric（日心坐标）
   * @param  {Boolean}               options.withNutation                坐标是否修正了章动
   * @param  {Boolean}               options.withAnnualAberration        坐标是否修正了周年光行差
   * @param  {Boolean}               options.withGravitationalDeflection 坐标是否修正了引力偏转
   * @param  {Boolean}               options.onFK5                       坐标是否进行了 FK5 修正
   * @return {EclipticCoordinate}                                        返回 this 引用
   */
  from({
    sc, 
    l,
    b,
    radius,
    epoch, 
    centerMode,
    withNutation, 
    withAnnualAberration,
    withGravitationalDeflection,
    onFK5,
  }) {

    if (epoch === undefined) epoch = new JDateRepository(0, 'j2000');
    else if (!(epoch instanceof JDateRepository)) throw Error('The param epoch should be a instance of JDateRepository');
    
    if (centerMode === undefined) centerMode = 'geocentric';
    else if (centerMode !== 'geocentric' && centerMode !== 'heliocentric') throw Error('The param centerMode should just be geocentric or topocentric.');

    withNutation = !! withNutation;
    withAnnualAberration = !! withAnnualAberration;
    withGravitationalDeflection = !!withGravitationalDeflection;
    onFK5 = !! onFK5;

    this.Precession = new Precession({ epoch });
    this.Nutation = new Nutation({ epoch });

    this.private = { 
      epoch, 
      centerMode,
      withNutation, 
      withAnnualAberration,
      withGravitationalDeflection,
      onFK5,
    };

    this.cache = new CacheSpaceOnJDate(epoch);

    this.position({
      sc, 
      l,
      b,
      radius,
    });

    this.earthHECC = new EarthHECC(this.private.epoch);

    return this;
  }

  /**
   * 转换当前坐标的系统参数
   * 
   * @param  {JDateRepository}       options.epoch                       坐标历元
   * @param  {String}                options.centerMode                  中心模式：geocentric（地心坐标）、heliocentric（日心坐标）
   * @param  {Boolean}               options.withNutation                坐标是否修复章动
   * @param  {Boolean}               options.withAnnualAberration        坐标是否修正周年光行差
   * @param  {Boolean}               options.withGravitationalDeflection 坐标是否修正引力偏转
   * @param  {Boolean}               options.onFK5                       坐标是否基于 FK5 系统
   * @return {EclipticCoordinate}                                        返回 this 引用
   */
  on({
    epoch, 
    centerMode,
    withNutation, 
    withAnnualAberration,
    withGravitationalDeflection,
    onFK5,
  }) {
    // 参数预处理
    if (epoch === undefined) epoch = this.private.epoch;
    if (withNutation === undefined) withNutation = this.withNutation;
    if (centerMode === undefined) centerMode = this.private.centerMode;
    if (withAnnualAberration === undefined) withAnnualAberration = this.withAnnualAberration;
    if (withGravitationalDeflection === undefined) withGravitationalDeflection = this.withGravitationalDeflection;
    if (onFK5 === undefined) onFK5 = this.onFK5;

    this.onGeocentric();

    // FK5 修正处理
    if (onFK5) this.patchFK5();
    else this.unpatchFK5();

    // 周年光行差 修正处理
    if (withAnnualAberration) this.patchAnnualAberration();
    else this.unpatchAnnualAberration();

    // 引力偏转 修正处理
    if (withGravitationalDeflection) this.patchGravitationalDeflection();
    else this.unpatchGravitationalDeflection();

    // 历元岁差 修正处理
    this.onEpoch(epoch);

    // 章动 修正处理
    if (withNutation) this.patchNutation();
    else this.unpatchNutation();

    if (centerMode === 'heliocentric') this.onHeliocentric();

    return this;
  }

  /**
   * 设定当前系统条件下的坐标点位置
   * 
   * @param  {SphericalCoordinate3D} options.sc     球坐标
   * @param  {Number}                options.l      黄经，单位：度，值域：[0, 360)
   * @param  {Number}                options.b      黄纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius 距离半径，值域：[10e-8, +∞)
   * @return {EclipticCoordinate}                   返回 this 引用
   */
  position({
    sc, 
    l,
    b,
    radius,
  }) {
    if (sc === undefined) { // 通过参数 l, b, radius 设定坐标值
      if (l === undefined) throw Error('One of the param sc or l should be given.');
      else if (typeof(l) !== 'number') throw Error('The param l should be a Number.');
      else if (l >= 360 || l < 0) throw Error('The param l should be in [0, 360)');
      
      if (b === undefined) b = 0;
      else if (typeof(b) !== 'number') throw Error('The param b should be a Number.');
      else if (b < -90 || b > 90) throw Error('The param b should be in [-90, 90]');
      
      if (radius === undefined) radius = 1;
      else if (typeof(radius) !== 'number') throw Error('The param radius should be a Number.');
      else if (radius < 10e-8) throw Error('The param radius should be gt 10e-8');

      // 生成 球坐标 对象
      let theta = b ? angle.setDegrees(90 - b).getRadian() : Math.PI / 2;
      let phi = angle.setDegrees(l).getRadian();
      
      sc = new SphericalCoordinate3D(radius, theta, phi);
    } else { // 通过参数 sc 设定坐标值
      if (!(sc instanceof SphericalCoordinate3D)) throw Error('The param sc should be a instance of SphericalCoordinate3D.');
    }

    this.private.sc = sc;

    // 清空缓存
    this.cache.clear();

    return this;
  }

  /**
   * 获取指定系统参数的坐标结果
   * 
   * @param  {Object}         options               坐标系统参数
   * @return {Object}                               坐标结果对象
   */
  get(options) {
    if (options === undefined) {
      return {
        sc: this.sc,
        epoch: this.epoch,
        centerMode: this.centerMode,
        withNutation: this.withNutation,
        withAnnualAberration: this.private.withAnnualAberration,
        withGravitationalDeflection: this.private.withGravitationalDeflection,
        onFK5: this.private.onFK5,
      }
    } else {
      // 记录原坐标和条件，输出目标坐标后恢复
      let sc_0 = this.sc,
          epoch_0 = this.epoch,
          withNutation_0 = this.private.withNutation,
          centerMode_0 = this.private.centerMode,
          withAnnualAberration_0 = this.private.withAnnualAberration,
          withGravitationalDeflection_0 = this.private.withGravitationalDeflection,
          onFK5_0 = this.private.onFK5;

      this.on(options);

      // 记录新坐标和条件
      let sc = this.sc,
          epoch = this.epoch,
          withNutation = this.private.withNutation,
          centerMode = this.private.centerMode,
          withAnnualAberration = this.private.withAnnualAberration,
          withGravitationalDeflection = this.private.withGravitationalDeflection,
          onFK5 = this.private.onFK5;

      // 还原为初始坐标和条件
      this.private.sc = sc_0;
      this.private.epoch = epoch_0;
      this.private.withNutation = withNutation_0;
      this.private.centerMode = centerMode_0;
      this.private.withAnnualAberration = withAnnualAberration_0;
      this.private.withGravitationalDeflection = withGravitationalDeflection_0;
      this.private.onFK5 = onFK5_0;

      this.Nutation.epoch = epoch_0;
      this.Precession.epoch = epoch_0;
      this.earthHECC.obTime = epoch_0;
      this.cache = new CacheSpaceOnJDate(epoch_0);

      return { 
        sc, 
        epoch,
        withNutation,
        centerMode,
        withAnnualAberration,
        withGravitationalDeflection,
        onFK5,
      };
    }
  }

  /**
   * 转换当前坐标至目标天球系统
   * 
   * @param  {String} system  目标天球坐标系统
   *                          可选值：horizontal、hourangle、equinoctial、galactic
   * @param  {Object} options 目标天球坐标条件设定对象
   * @return {Object}         目标天球坐标
   */
  to(system, options) {
    if (typeof(system) !== 'string') throw Error('The param system should be a String.');
    
    switch(system.toLowerCase()) {
      case 'horizontal':
        return this.toHorizontal(options);

      case 'hourangle':
        return this.toHourAngle(options);

      case 'equinoctial':
        return this.toEquinoctial(options);

      case 'galactic':
        return this.toGalactic(options);

      default:
        throw Error('The param system should be valid.');
    }
  }

  /**
   * 转换至地平系统
   *
   * 地平坐标为观测坐标，即瞬时天球坐标。
   * 
   * @param  {JDateRepository} options.obTime      观测时间
   * @param  {Number}          options.obGeoLong   观测点地理经度
   *                                               单位：度，值域：[-180, 180]
   * @param  {Number}          options.obGeoLat    观测点地理纬度
   *                                               单位：度，值域：[-90, 90]
   * @param  {Number}          options.obElevation 观测点海拔高度
   * 
   * @return {Object}                              地平坐标对象
   */
  toHorizontal({ obTime, obGeoLong, obGeoLat, obElevation }) {
    let eqc = new EquinoctialCoordinate(this.toEquinoctial());
    return eqc.toHorizontal({ obTime, obGeoLong, obGeoLat, obElevation });
  }

  /**
   * 转换当前坐标至天球时角系统
   *
   * 时角坐标为观测坐标，即瞬时天球坐标。
   * 
   * @param  {JDateRepository} options.obTime    观测时间
   * @param  {Number}          options.obGeoLong 观测点地理经度
   *                                             单位：度
   *                                             
   * @return {Object}                            时角坐标对象
   */
  toHourAngle({ obTime, obGeoLong }) {
    let eqc = new EquinoctialCoordinate(this.toEquinoctial());
    return eqc.toHourAngle({ obTime, obGeoLong });
  }

  /**
   * 转换至 赤道坐标
   * 
   * @return {Object} 赤道坐标对象
   */
  toEquinoctial() {
    let sc = this.get({
      centerMode: 'geocentric',
    }).sc;

    let e0 = angle.setSeconds(this.Precession.epsilon).getRadian();

    if (this.withNutation) { // 真坐标
      let delta_e = angle.setMilliseconds(this.Nutation.obliquity).getRadian();
      sc.rotateX(e0 + delta_e);
    } else { // 平坐标
      sc.rotateX(e0);
    }
    
    return {
      sc,
      epoch: this.epoch,
      withNutation: this.private.withNutation,
      withAnnualAberration: this.private.withAnnualAberration,
      withGravitationalDeflection: this.private.withGravitationalDeflection,
      onFK5: this.private.onFK5,
    };
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
   * 转换坐标历元至 J2000
   *
   * 会将当前坐标转化成 J2000 平坐标
   * 
   * @return {EclipticCoordinate} 返回 this 引用
   */
  onJ2000() {
    let zeta = angle.setSeconds(this.Precession.zeta).getRadian(),
        theta = angle.setSeconds(this.Precession.theta).getRadian(),
        z = angle.setSeconds(this.Precession.z).getRadian(),
        e = angle.setSeconds(this.Precession.epsilon).getRadian(),
        e0 = angle.setSeconds(this.Precession.epsilon0).getRadian();

    if (this.withNutation) { // 逆向章动处理，转换至平坐标
      this.unpatchNutation();
    }

    this.private.sc
      .rotateX(e)
      .rotateZ(-z)
      .rotateY(theta)
      .rotateZ(-zeta)
      .rotateX(-e0);

    let epoch = new JDateRepository(2000, 'jepoch');

    this.private.epoch = epoch;
    this.Precession.epoch = epoch;
    this.Nutation.epoch = epoch;

    this.cache = new CacheSpaceOnJDate(epoch);

    return this;
  }

  /**
   * 转换坐标至 目标历元
   *
   * 会将当前坐标转化成目标历元平坐标
   * 
   * @param  {JDateRepository}    epoch 目标历元
   * @return {EclipticCoordinate}       返回 this 引用
   */
  onEpoch(epoch) {
    if (!(epoch instanceof JDateRepository)) throw Error('The param epoch should be a instance of JDateRepository');

    if (epoch.J2000 !== this.epoch.J2000) { // 进行历元转换
      if (this.epoch.J2000 !== 0) this.onJ2000();

      if (this.withNutation) { // 逆向章动处理，转换至平坐标
        this.unpatchNutation();
      }

      this.private.epoch = epoch;
      this.Precession.epoch = epoch;
      this.Nutation.epoch = epoch;

      this.cache = new CacheSpaceOnJDate(epoch);

      if (epoch.J2000 !== 0) { // 从 J2000 历元 转换至 epoch
        let zeta = angle.setSeconds(this.Precession.zeta).getRadian();
        let theta = angle.setSeconds(this.Precession.theta).getRadian();
        let z = angle.setSeconds(this.Precession.z).getRadian();
        let e = angle.setSeconds(this.Precession.epsilon).getRadian();
        let e0 = angle.setSeconds(this.Precession.epsilon0).getRadian();

        this.private.sc
          .rotateX(e0)
          .rotateZ(zeta)
          .rotateY(-theta)
          .rotateZ(z)
          .rotateX(-e);
      }
    }

    return this;
  }

  /**
   * 修正章动
   *
   * @return {EclipticCoordinate} 返回 this 引用
   */
  patchNutation() {
    if (!this.withNutation) {
      let delta_psi = angle.setMilliseconds(this.Nutation.longitude).getRadian();

      this.private.sc.rotateZ(delta_psi);

      this.private.withNutation = true;
    }

    return this;
  }

  /**
   * 解除章动修正
   * 
   * @return {EclipticCoordinate} 返回 this 引用
   */
  unpatchNutation() {
    if (this.withNutation) {
      let delta_psi = angle.setMilliseconds(this.Nutation.longitude).getRadian();

      this.private.sc.rotateZ(-delta_psi);

      this.private.withNutation = false;
    }

    return this;
  }

  /**
   * 修正周年光行差
   *
   * 修正光行差的坐标状态为：
   *  FK5: done
   *  恒星自行: done
   *  引力偏转: done
   *  周年视差: done
   *  岁差: not done
   *  章动: not done
   * 
   * @return {EquinoctialCoordinate} 返回 this 引用
   */
  patchAnnualAberration() {
    if (!this.private.withAnnualAberration) { // 需要修正周年光行差
      let aa = this.AACorrection;

      this.private.sc.phi = this.private.sc.phi + aa.a;
      this.private.sc.theta = this.private.sc.theta - aa.b;

      this.private.withAnnualAberration = true;
    }

    return this;
  }

  /**
   * 解除周年光行差修正
   * 
   * @return {EquinoctialCoordinate} 返回 this 引用
   */
  unpatchAnnualAberration() {
    if (this.private.withAnnualAberration) {
      let aa = this.AACorrection;

      this.private.sc.phi = this.private.sc.phi - aa.a;
      this.private.sc.theta = this.private.sc.theta + aa.b;

      this.private.withAnnualAberration = false;
    }

    return this;
  }

  /**
   * 修正引力偏转
   * 
   * @return {EquinoctialCoordinate} 返回 this 引用
   */
  patchGravitationalDeflection() {
    if (!this.private.withGravitationalDeflection) {
      let gd = this.GDCorrection;

      this.private.sc.phi = this.private.sc.phi + gd.a;
      this.private.sc.theta = this.private.sc.theta - gd.b;

      this.private.withGravitationalDeflection = true;
    }

    return this;
  }

  /**
   * 解除引力偏转修正
   * 
   * @return {EquinoctialCoordinate} 返回 this 引用
   */
  unpatchGravitationalDeflection() {
    if (this.private.withGravitationalDeflection) {
      let gd = this.GDCorrection;

      this.private.sc.phi = this.private.sc.phi - gd.a;
      this.private.sc.theta = this.private.sc.theta + gd.b;

      this.private.withGravitationalDeflection = false;
    }

    return this;
  }

  /**
   * 修正至 FK5 系统
   * 
   * @return {SphericalCoordinate3D} 天球球坐标
   */
  patchFK5() {
    if (!this.private.onFK5) {
      let fk5 = this.FK5Correction;

      this.private.sc.phi = this.private.sc.phi + fk5.a;
      this.private.sc.theta = this.private.sc.theta - fk5.b;

      this.private.onFK5 = true;
    }

    return this;
  }

  /**
   * 解除 FK5 修正
   * 
   * @return {SphericalCoordinate3D} 天球球坐标
   */
  unpatchFK5() {
    if (this.private.onFK5) {
      let fk5 = this.FK5Correction;

      this.private.sc.phi = this.private.sc.phi - fk5.a;
      this.private.sc.theta = this.private.sc.theta + fk5.b;

      this.private.onFK5 = false;
    }

    return this;
  }

  /**
   * 转换坐标至地心坐标
   * 
   * @return {EclipticCoordinate} 返回 this 引用
   */
  onGeocentric() {
    if (this.private.centerMode === 'heliocentric') {
      let earth_hecc_sc = this.earthHECC.sc;

      if (this.private.withNutation) {
        let delta_psi = angle.setMilliseconds(this.Nutation.longitude).getRadian();

        earth_hecc_sc.rotateZ(-delta_psi);
      }

      let earth_hecc_rc = earth_hecc_sc.toRC();

      this.private.sc.translate(-earth_hecc_rc.x, -earth_hecc_rc.y, -earth_hecc_rc.z);
      this.private.centerMode = 'geocentric';
    }

    return this;
  }

  /**
   * 转换坐标至日心坐标
   * 
   * @return {EclipticCoordinate} 返回 this 引用
   */
  onHeliocentric() {
    if (this.private.centerMode === 'geocentric') {
      let earth_hecc_sc = this.earthHECC.sc;

      if (this.private.withNutation) {
        let delta_psi = angle.setMilliseconds(this.Nutation.longitude).getRadian();

        earth_hecc_sc.rotateZ(-delta_psi);
      }

      let earth_hecc_rc = earth_hecc_sc.toRC();

      this.private.sc.translate(earth_hecc_rc.x, earth_hecc_rc.y, earth_hecc_rc.z);
      this.private.centerMode = 'heliocentric';
    }

    return this;
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
   * 获取 黄经 角度对象
   * 
   * @return {Angle} 黄经 角度对象
   */
  get l() {
    return new Angle(this.sc.phi, 'r');
  }

  /**
   * 获取 黄纬 角度对象
   * 
   * @return {Angle} 黄纬 角度对象
   */
  get b() {
    return (new Angle(Math.PI / 2 - this.sc.theta, 'r')).inRound(-180, 'd');
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
   * 获取 历元对象
   * 
   * @return {JDateRepository} 历元对象
   */
  get epoch() {
    return new JDateRepository(this.private.epoch.JD);
  }

  /**
   * 设置 历元对象
   * 
   * @param  {JDateRepository} value 目标历元对象
   */
  set epoch(value) {
    this.onEpoch(value);
  }

  /**
   * 获取 中心点模式
   * 
   * @return {String} 中心点模式字串
   */
  get centerMode() {
    return this.private.centerMode;
  }

  /**
   * 设置 中心点模式
   * 
   * @param  {String} value 中心点模式字串
   */
  set centerMode(value) {
    if (value === 'heliocentric') this.onHeliocentric();
    else if (value === 'geocentric') this.onGeocentric();
    else throw Error('The param value should be a right string.');
  }

  /**
   * 获取 章动修正状态
   * 
   * @return {Boolean} 是否修正章动
   */
  get withNutation() {
    return this.private.withNutation;
  }

  /**
   * 设置 章动修正状态
   * 
   * @param {Boolean} value 是否修正章动
   */
  set withNutation(value) {
    if (value) this.patchNutation();
    else this.unpatchNutation();
  }

  /**
   * 获取 周年光行差修正状态
   * 
   * @return {Boolean} 周年光行差修正状态
   */
  get withAnnualAberration() {
    return this.private.withAnnualAberration;
  }

  /**
   * 设置 周年光行差修正状态
   * 
   * @param {Boolean} value 周年光行差修正状态
   */
  set withAnnualAberration(value) {
    if (value) this.patchAnnualAberration();
    else this.unpatchAnnualAberration();
  }

  /**
   * 获取 引力偏转修正状态
   * 
   * @return {Boolean} 引力偏转修正状态
   */
  get withGravitationalDeflection() {
    return this.private.withGravitationalDeflection;
  }

  /**
   * 设置 引力偏转修正状态
   * 
   * @param {Boolean} value 引力偏转修正状态
   */
  set withGravitationalDeflection(value) {
    if (value) this.patchGravitationalDeflection();
    else this.unpatchGravitationalDeflection();
  }

  /**
   * 获取 FK5 修正状态
   * 
   * @return {Boolean} FK5 修正状态
   */
  get onFK5() {
    return this.private.onFK5;
  }

  /**
   * 设置 FK5 修正状态
   * 
   * @param {Boolean} value FK5 修正状态
   */
  set onFK5(value) {
    if (value) this.patchFK5();
    else this.unpatchFK5();
  }

  /**
   * 获取 周年光行差修正值
   *
   * @return {Object} 周年光行差修正值对象
   */
  get AACorrection() {
    // 实例化周年光行差对象
    if (!this.cache.has('AACorrection')) {
      let { sc } = this.get({
        epoch: new JDateRepository(0, 'j2000'),
        withNutation: false,
        centerMode: 'geocentric',
      });

      this.AnnualAberration = new AnnualAberration({
        time: this.private.epoch,
        system: 'ecliptic',
        sc,
      });

      this.cache.set('AACorrection', this.AnnualAberration.get());
    }

    return this.cache.get('AACorrection');
  }

  /**
   * 获取 太阳引力偏转修正值
   *
   * @return {Object} 太阳引力偏转修正值对象
   */
  get GDCorrection() {
    if (!this.cache.has('GDCorrection')) {
      let { sc } = this.get({
        epoch: new JDateRepository(0, 'j2000'),
        withNutation: false,
        centerMode: 'geocentric',
      });

      this.GravitationalDeflection = new GravitationalDeflection({
        time: this.private.epoch,
        system: 'ecliptic',
        sc,
      });

      this.cache.set('GDCorrection', this.GravitationalDeflection.get());
    }

    return this.cache.get('GDCorrection');
  }

  /**
   * 获取 FK5 偏转修正值
   *
   * @return {Object} FK5 偏转修正值对象
   */
  get FK5Correction() {
    if (!this.cache.has('FK5Deflection')) {
      let { sc } = this.get({
        epoch: new JDateRepository(0, 'j2000'),
        withNutation: false,
        centerMode: 'geocentric',
      });

      this.FK5Deflection = new FK5Deflection({
        time: this.private.epoch,
        system: 'ecliptic',
        sc,
      });

      this.cache.set('FK5Deflection', this.FK5Deflection.get());
    }

    return this.cache.get('FK5Deflection');
  }
}

module.exports = EclipticCoordinate;
