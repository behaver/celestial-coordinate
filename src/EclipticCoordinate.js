'use strict';

const CommonCoordinate = require('./CommonCoordinate');
const Precession = require('@behaver/precession');
const Nutation = require('@behaver/nutation');
const { JDateRepository, CacheSpaceOnJDate } = require('@behaver/jdate');
const { EarthHECC } = require('@behaver/solar-planets-hecc');
const AnnualAberration = require('@behaver/annual-aberration');
const GravitationalDeflection = require('@behaver/gravitational-deflection');
const FK5Deflection = require('@behaver/fk5-deflection');
const Angle = require('@behaver/angle');

const angle = new Angle;

/**
 * EclipticCoordinate
 * 
 * 天球黄道坐标对象
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class EclipticCoordinate extends CommonCoordinate {

  /**
   * 设定起始天球黄道坐标
   * 
   * @param  {SphericalCoordinate3D} options.sc                            球坐标
   * @param  {Number}                options.longitude                     黄经，单位：度
   * @param  {Number}                options.latitude                      黄纬，单位：度
   * @param  {Number}                options.radius                        距离半径，值域：[10e-8, +∞)
   * @param  {JDateRepository}       options.epoch                         坐标历元
   * @param  {String}                options.centerMode                    中心模式：geocentric（地心坐标）、heliocentric（日心坐标）
   * @param  {Boolean}               options.enableNutation                章动修正启用状态
   * @param  {Boolean}               options.withNutation                  坐标是否含有章动修正
   * @param  {Boolean}               options.enableAnnualAberration        周年光行差修正启用状态
   * @param  {Boolean}               options.withAnnualAberration          坐标是否含有周年光行差
   * @param  {Boolean}               options.enableGravitationalDeflection 引力偏转修正启用状态
   * @param  {Boolean}               options.withGravitationalDeflection   坐标是否含有引力偏转
   * @param  {Boolean}               options.enableFK5                     FK5 修正启用状态
   * @param  {Boolean}               options.onFK5                         坐标是否含有 FK5 修正
   * 
   * @return {EclipticCoordinate}                                          返回 this 引用
   */
  from({
    sc, 
    longitude,
    latitude,
    radius,
    epoch, 
    centerMode,
    enableNutation,
    withNutation, 
    enableAnnualAberration,
    withAnnualAberration,
    enableGravitationalDeflection,
    withGravitationalDeflection,
    enableFK5,
    onFK5,
  }) {

    if (epoch === undefined) epoch = new JDateRepository(0, 'j2000');
    else if (!(epoch instanceof JDateRepository)) throw Error('The param epoch should be a instance of JDateRepository');
    
    if (centerMode === undefined) centerMode = 'geocentric';
    else if (centerMode !== 'geocentric' && centerMode !== 'heliocentric') throw Error('The param centerMode should just be geocentric or topocentric.');

    if (enableNutation === undefined) {
      if (withNutation === undefined) enableNutation = false;
      else enableNutation = true;
    }

    if (enableAnnualAberration === undefined) {
      if (withAnnualAberration === undefined) enableAnnualAberration = false;
      else enableAnnualAberration = true;
    }

    if (enableGravitationalDeflection === undefined) {
      if (withGravitationalDeflection === undefined) enableGravitationalDeflection = false;
      else enableGravitationalDeflection = true;
    }

    if (enableFK5 === undefined) {
      if (onFK5 === undefined) enableFK5 = false;
      else enableFK5 = true;
    }

    this.Precession = new Precession({ epoch });
    this.Nutation = new Nutation({ epoch });
    
    this.private = { 
      ...this.private,
      epoch, 
      centerMode,
      enableNutation: !! enableNutation,
      withNutation: !! withNutation, 
      enableAnnualAberration: !! enableAnnualAberration,
      withAnnualAberration: !! withAnnualAberration,
      enableGravitationalDeflection: !! enableGravitationalDeflection,
      withGravitationalDeflection: !! withGravitationalDeflection,
      enableFK5: !! enableFK5,
      onFK5: !! onFK5,
    };

    this.cache = new CacheSpaceOnJDate(epoch);

    this.position({
      sc, 
      longitude,
      latitude,
      radius,
    });

    this.earthHECC = new EarthHECC(this.private.epoch);

    return this;
  }

  /**
   * 转换当前坐标的系统参数
   * 
   * @param  {JDateRepository}       options.epoch                         坐标历元
   * @param  {String}                options.centerMode                    中心模式：geocentric（地心坐标）、heliocentric（日心坐标）
   * @param  {Boolean}               options.enableNutation                章动修正启用状态
   * @param  {Boolean}               options.withNutation                  坐标是否含有章动修正
   * @param  {Boolean}               options.enableAnnualAberration        周年光行差修正启用状态
   * @param  {Boolean}               options.withAnnualAberration          坐标是否含有周年光行差
   * @param  {Boolean}               options.enableGravitationalDeflection 引力偏转修正启用状态
   * @param  {Boolean}               options.withGravitationalDeflection   坐标是否含有引力偏转
   * @param  {Boolean}               options.enableFK5                     FK5 修正启用状态
   * @param  {Boolean}               options.onFK5                         坐标是否基于 FK5 系统
   * 
   * @return {EclipticCoordinate}                                          返回 this 引用
   */
  on({
    epoch, 
    centerMode,
    enableNutation,
    withNutation, 
    enableAnnualAberration,
    withAnnualAberration,
    enableGravitationalDeflection,
    withGravitationalDeflection,
    enableFK5,
    onFK5,
  }) {
    // 参数预处理
    if (centerMode === undefined) centerMode = this.private.centerMode;

    this.onGeocentric();

    // 历元岁差 修正处理
    if (epoch !== undefined) this.onEpoch(epoch);

    // FK5 修正处理
    if (enableFK5 !== undefined) this.enableFK5 = enableFK5;
    if (onFK5 !== undefined) this.onFK5 = onFK5;

    // 周年光行差 修正处理
    if (enableAnnualAberration !== undefined) this.enableAnnualAberration = enableAnnualAberration;
    if (withAnnualAberration !== undefined) this.withAnnualAberration = withAnnualAberration;

    // 引力偏转 修正处理
    if (enableGravitationalDeflection !== undefined) this.enableGravitationalDeflection = enableGravitationalDeflection;
    if (withGravitationalDeflection !== undefined) this.withGravitationalDeflection = withGravitationalDeflection;

    // 章动 修正处理
    if (enableNutation !== undefined) this.enableNutation = enableNutation;
    if (withNutation !== undefined) this.withNutation = withNutation;

    if (centerMode === 'heliocentric') this.onHeliocentric();

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
        enableNutation: this.enableNutation,
        withNutation: this.withNutation,
        enableAnnualAberration: this.enableAnnualAberration,
        withAnnualAberration: this.withAnnualAberration,
        enableGravitationalDeflection: this.enableGravitationalDeflection,
        withGravitationalDeflection: this.withGravitationalDeflection,
        enableFK5: this.enableFK5,
        onFK5: this.onFK5,
      }
    } else {
      // 记录原坐标和条件，输出目标坐标后恢复
      let sc_0 = this.sc,
          epoch_0 = this.epoch,
          centerMode_0 = this.private.centerMode,
          enableNutation_0 = this.private.enableNutation,
          withNutation_0 = this.private.withNutation,
          enableAnnualAberration_0 = this.private.enableAnnualAberration,
          withAnnualAberration_0 = this.private.withAnnualAberration,
          enableGravitationalDeflection_0 = this.private.enableGravitationalDeflection,
          withGravitationalDeflection_0 = this.private.withGravitationalDeflection,
          enableFK5_0 = this.private.enableFK5,
          onFK5_0 = this.private.onFK5;

      this.on(options);

      // 记录新坐标和条件
      let sc = this.sc,
          epoch = this.epoch,
          centerMode = this.private.centerMode,
          enableNutation = this.private.enableNutation,
          withNutation = this.private.withNutation,
          enableAnnualAberration = this.private.enableAnnualAberration,
          withAnnualAberration = this.private.withAnnualAberration,
          enableGravitationalDeflection = this.private.enableGravitationalDeflection,
          withGravitationalDeflection = this.private.withGravitationalDeflection,
          enableFK5 = this.private.enableFK5,
          onFK5 = this.private.onFK5;

      // 还原为初始坐标和条件
      this.private.sc = sc_0;
      this.private.epoch = epoch_0;
      this.private.centerMode = centerMode_0;
      this.private.enableNutation = enableNutation_0;
      this.private.withNutation = withNutation_0;
      this.private.enableAnnualAberration = enableAnnualAberration_0;
      this.private.withAnnualAberration = withAnnualAberration_0;
      this.private.enableGravitationalDeflection = enableGravitationalDeflection_0;
      this.private.withGravitationalDeflection = withGravitationalDeflection_0;
      this.private.enableFK5 = enableFK5_0;
      this.private.onFK5 = onFK5_0;

      this.Nutation.epoch = epoch_0;
      this.Precession.epoch = epoch_0;
      this.earthHECC.obTime = epoch_0;
      this.cache = new CacheSpaceOnJDate(epoch_0);

      return { 
        sc, 
        epoch,
        centerMode,
        enableNutation,
        withNutation,
        enableAnnualAberration,
        withAnnualAberration,
        enableGravitationalDeflection,
        withGravitationalDeflection,
        enableFK5,
        onFK5,
      };
    }
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

    // 记录原始修正状态
    let withNutation_0 = this.private.withNutation;

    // 解除修正，转换至平坐标
    if (this.enableNutation && withNutation_0) this.unpatchNutation();

    let sc = this.sc
      .rotateX(e)
      .rotateZ(-z)
      .rotateY(theta)
      .rotateZ(-zeta)
      .rotateX(-e0);

    // 保持球坐标值连续性的值更改
    this.private.SCContinuouslyChange(sc);

    let epoch = new JDateRepository(2000, 'jepoch');

    this.private.epoch = epoch;
    this.Precession.epoch = epoch;
    this.Nutation.epoch = epoch;

    this.cache = new CacheSpaceOnJDate(epoch);

    // 恢复修正处理
    if (this.enableNutation && withNutation_0) this.patchNutation();

    return this;
  }

  /**
   * 转换坐标至 目标历元
   *
   * 会将当前坐标转化成目标历元平坐标
   * 
   * @param  {JDateRepository}    epoch 目标历元
   * 
   * @return {EclipticCoordinate}       返回 this 引用
   */
  onEpoch(epoch) {
    if (!(epoch instanceof JDateRepository)) throw Error('The param epoch should be a instance of JDateRepository');

    if (epoch.J2000 !== this.epoch.J2000) { // 进行历元转换
      if (this.epoch.J2000 !== 0) this.onJ2000();

      // 记录原始修正状态
      let withNutation_0 = this.private.withNutation;

      // 解除修正，转换至平坐标
      if (this.enableNutation && withNutation_0) this.unpatchNutation();

      this.private.epoch = epoch;
      this.Precession.epoch = epoch;
      this.Nutation.epoch = epoch;

      this.cache = new CacheSpaceOnJDate(epoch);

      if (epoch.J2000 !== 0) { // 从 J2000 历元 转换至 epoch
        let zeta = angle.setSeconds(this.Precession.zeta).getRadian(),
            theta = angle.setSeconds(this.Precession.theta).getRadian(),
            z = angle.setSeconds(this.Precession.z).getRadian(),
            e = angle.setSeconds(this.Precession.epsilon).getRadian(),
            e0 = angle.setSeconds(this.Precession.epsilon0).getRadian();

        let sc = this.sc
          .rotateX(e0)
          .rotateZ(zeta)
          .rotateY(-theta)
          .rotateZ(z)
          .rotateX(-e);

        // 保持球坐标值连续性的值更改
        this.private.SCContinuouslyChange(sc);
      }

      // 恢复修正处理
      if (this.enableNutation && withNutation_0) this.patchNutation();
    }

    return this;
  }

  /**
   * 修正章动
   *
   * @return {EclipticCoordinate} 返回 this 引用
   */
  patchNutation() {
    if (this.enableNutation && !this.private.withNutation) {
      let delta_psi = angle.setMilliseconds(this.Nutation.longitude).getRadian();

      let sc = this.sc.rotateZ(delta_psi);

      // 保持球坐标值连续性的值更改
      this.private.SCContinuouslyChange(sc);

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
    if (this.enableNutation && this.private.withNutation) {
      let delta_psi = angle.setMilliseconds(this.Nutation.longitude).getRadian();

      let sc = this.sc.rotateZ(-delta_psi);

      // 保持球坐标值连续性的值更改
      this.private.SCContinuouslyChange(sc);

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
   * @return {EclipticCoordinate} 返回 this 引用
   */
  patchAnnualAberration() {
    if (this.enableAnnualAberration && !this.private.withAnnualAberration) { // 需要修正周年光行差
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
   * @return {EclipticCoordinate} 返回 this 引用
   */
  unpatchAnnualAberration() {
    if (this.enableAnnualAberration && this.private.withAnnualAberration) {
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
   * @return {EclipticCoordinate} 返回 this 引用
   */
  patchGravitationalDeflection() {
    if (this.enableGravitationalDeflection && !this.private.withGravitationalDeflection) {
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
   * @return {EclipticCoordinate} 返回 this 引用
   */
  unpatchGravitationalDeflection() {
    if (this.enableGravitationalDeflection && this.private.withGravitationalDeflection) {
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
   * @return {EclipticCoordinate} 返回 this 引用
   */
  patchFK5() {
    if (this.enableFK5 && !this.private.onFK5) {
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
   * @return {EclipticCoordinate} 返回 this 引用
   */
  unpatchFK5() {
    if (this.enableFK5 && this.private.onFK5) {
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

      if (this.enableNutation && this.private.withNutation) {
        let delta_psi = angle.setMilliseconds(this.Nutation.longitude).getRadian();

        earth_hecc_sc.rotateZ(-delta_psi);
      }

      let earth_hecc_rc = earth_hecc_sc.toRC();

      let sc = this.sc.translate(-earth_hecc_rc.x, -earth_hecc_rc.y, -earth_hecc_rc.z);
      
      // 保持球坐标值连续性的值更改
      this.private.SCContinuouslyChange(sc);

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

      if (this.enableNutation && this.private.withNutation) {
        let delta_psi = angle.setMilliseconds(this.Nutation.longitude).getRadian();

        earth_hecc_sc.rotateZ(-delta_psi);
      }

      let earth_hecc_rc = earth_hecc_sc.toRC();

      let sc = this.sc.translate(earth_hecc_rc.x, earth_hecc_rc.y, earth_hecc_rc.z);
      
      // 保持球坐标值连续性的值更改
      this.private.SCContinuouslyChange(sc);
      
      this.private.centerMode = 'heliocentric';
    }

    return this;
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
   * 获取 章动修正功能启用状态
   * 
   * @return {Boolean} 章动修正功能启用状态
   */
  get enableNutation() {
    return this.private.enableNutation;
  }

  /**
   * 设置 章动修正功能启用状态
   * 
   * @param {Boolean} value 章动修正功能启用状态
   */
  set enableNutation(value) {
    this.private.enableNutation = !! value;
  }

  /**
   * 获取 当前坐标是否含有章动修正
   * 
   * @return {Boolean} 当前坐标是否含有章动修正
   */
  get withNutation() {
    return this.private.withNutation;
  }

  /**
   * 设置 当前坐标是否含有章动修正
   * 
   * @param {Boolean} value 当前坐标是否含有章动修正
   */
  set withNutation(value) {
    if (this.enableNutation) { 
      if (value) this.patchNutation();
      else this.unpatchNutation();
    } else this.private.withNutation = !! value;
  }

  /**
   * 获取 周年光行差功能启用状态
   * 
   * @return {Boolean} 周年光行差功能启用状态
   */
  get enableAnnualAberration() {
    return this.private.enableAnnualAberration;
  }

  /**
   * 设置 周年光行差功能启用状态
   * 
   * @param {Boolean} value 周年光行差功能启用状态
   */
  set enableAnnualAberration(value) {
    this.private.enableAnnualAberration = !! value;
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
    if (this.enableAnnualAberration) { 
      if (value) this.patchAnnualAberration();
      else this.unpatchAnnualAberration();
    } else this.private.withAnnualAberration = !! value;
  }

  /**
   * 获取 引力偏转功能启用状态
   * 
   * @return {Boolean} 引力偏转功能启用状态
   */
  get enableGravitationalDeflection() {
    return this.private.enableGravitationalDeflection;
  }

  /**
   * 设置 引力偏转功能启用状态
   * 
   * @param {Boolean} value 引力偏转功能启用状态
   */
  set enableGravitationalDeflection(value) {
    this.private.enableGravitationalDeflection = !! value;
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
    if (this.enableGravitationalDeflection) { 
      if (value) this.patchGravitationalDeflection();
      else this.unpatchGravitationalDeflection();
    } else this.private.withGravitationalDeflection = !! value;
  }

  /**
   * 获取 FK5 修正功能启用状态
   * 
   * @return {Boolean} FK5 修正功能启用状态
   */
  get enableFK5() {
    return this.private.enableFK5;
  }

  /**
   * 设置 FK5 修正功能启用状态
   * 
   * @param {Boolean} value FK5 修正功能启用状态
   */
  set enableFK5(value) {
    this.private.enableFK5 = !! value;
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
    if (this.enableFK5) { 
      if (value) this.patchFK5();
      else this.unpatchFK5();
    } else this.private.onFK5 = !! value;
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
