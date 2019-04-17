'use strict';

const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const Precession = require('@behaver/precession');
const Nutation = require('@behaver/nutation');
const { JDateRepository, CacheSpaceOnJDate } = require('@behaver/jdate');
const AnnualAberration = require('@behaver/annual-aberration');
const GravitationalDeflection = require('@behaver/gravitational-deflection');
const FK5Deflection = require('@behaver/fk5-deflection');
const CommonCoordinate = require('./CommonCoordinate');
const Angle = require('@behaver/angle');

const angle = new Angle;

/**
 * EquinoctialCoordinate
 * 
 * EquinoctialCoordinate 是天球赤道坐标对象
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class EquinoctialCoordinate extends CommonCoordinate {

  /**
   * 设定起始天球赤道坐标
   * 
   * @param  {SphericalCoordinate3D} options.sc                            球坐标
   * @param  {Number}                options.ra                            坐标赤经，单位：度，值域：[0, 360)
   * @param  {Number}                options.dec                           坐标赤纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius                        坐标距离半径，值域：[10e-8, +∞)
   * @param  {JDateRepository}       options.epoch                         坐标历元
   * @param  {Boolean}               options.enableNutation                章动修正启用状态
   * @param  {Boolean}               options.withNutation                  坐标是否含有章动修正
   * @param  {Boolean}               options.enableAnnualAberration        周年光行差修正启用状态
   * @param  {Boolean}               options.withAnnualAberration          坐标是否含有周年光行差
   * @param  {Boolean}               options.enableGravitationalDeflection 引力偏转修正启用状态
   * @param  {Boolean}               options.withGravitationalDeflection   坐标是否含有引力偏转
   * @param  {Boolean}               options.enableFK5                     FK5 修正启用状态
   * @param  {Boolean}               options.onFK5                         坐标是否含有 FK5 修正
   * 
   * @return {EquinoctialCoordinate}                                       返回 this 引用
   */
  from({
    sc, 
    ra,
    dec,
    radius,
    epoch, 
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
      ra,
      dec,
      radius,
    });

    return this;
  }

  /**
   * 转换当前坐标的系统参数
   * 
   * @param  {JDateRepository}       options.epoch                         坐标历元
   * @param  {Boolean}               options.enableNutation                章动修正启用状态
   * @param  {Boolean}               options.withNutation                  坐标是否含有章动修正
   * @param  {Boolean}               options.enableAnnualAberration        周年光行差修正启用状态
   * @param  {Boolean}               options.withAnnualAberration          坐标是否含有周年光行差
   * @param  {Boolean}               options.enableGravitationalDeflection 引力偏转修正启用状态
   * @param  {Boolean}               options.withGravitationalDeflection   坐标是否含有引力偏转
   * @param  {Boolean}               options.enableFK5                     FK5 修正启用状态
   * @param  {Boolean}               options.onFK5                         坐标是否基于 FK5 系统
   * 
   * @return {EquinoctialCoordinate}                                       返回 this 引用
   */
  on({
    epoch, 
    enableNutation,
    withNutation, 
    enableAnnualAberration,
    withAnnualAberration,
    enableGravitationalDeflection,
    withGravitationalDeflection,
    enableFK5,
    onFK5,
  }) {
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

    return this;
  }

  /**
   * 设定当前系统条件下的坐标点位置
   * 
   * @param  {SphericalCoordinate3D} options.sc     球坐标
   * @param  {Number}                options.ra     赤经，单位：度，值域：[0, 360)
   * @param  {Number}                options.dec    赤纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius 距离半径，值域：[10e-8, +∞)
   * @return {EquinoctialCoordinate}                返回 this 引用
   */
  position({
    sc, 
    ra,
    dec,
    radius,
  }) {
    if (sc === undefined) { // 通过参数 ra, dec, radius 设定坐标值
      if (ra === undefined) throw Error('One of the param sc or ra should be given.');
      else if (typeof(ra) !== 'number') throw Error('The param ra should be a Number.');
      // else if (ra >= 360 || ra < 0) throw Error('The param ra should be in [0, 360)');
      
      if (dec === undefined) dec = 0;
      else if (typeof(dec) !== 'number') throw Error('The param dec should be a Number.');
      // else if (dec < -90 || dec > 90) throw Error('The param dec should be in [-90, 90]');
      
      if (radius === undefined) radius = 1;
      else if (typeof(radius) !== 'number') throw Error('The param radius should be a Number.');
      else if (radius < 10e-8) throw Error('The param radius should be gt 10e-8');

      // 生成 球坐标 对象
      let theta = dec ? angle.setDegrees(90 - dec).getRadian() : Math.PI / 2;
      let phi = angle.setDegrees(ra).getRadian();
      
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
        sc: this.private.sc,
        epoch: this.private.epoch,
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
      if (this.AnnualAberration !== undefined) this.AnnualAberration.time = epoch_0;

      this.cache = new CacheSpaceOnJDate(epoch_0);

      return { 
        sc, 
        epoch,
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
   * @return {EquinoctialCoordinate} 返回 this 引用
   */
  onJ2000() {
    if (this.epoch.J2000 !== 0) {
      // 获取初始 岁差 偏转量
      let { zeta, theta, z } = this.PrecessionCorrection;

      // 记录原始修正状态
      let withNutation_0 = this.private.withNutation;

      // 解除修正，转换至平坐标
      if (this.enableNutation && withNutation_0) this.unpatchNutation();
      
      let sc = this.sc
        .rotateZ(- z)
        .rotateY(theta)
        .rotateZ(- zeta);

      // 保持球坐标值连续性的值更改
      this.private.SCContinuouslyChange(sc);

      let epoch = new JDateRepository(2000, 'jepoch');
      
      this.Precession.epoch = epoch;
      this.Nutation.epoch = epoch;
      this.private.epoch = epoch;

      this.cache = new CacheSpaceOnJDate(epoch);

      // 恢复修正处理
      if (this.enableNutation && withNutation_0) this.patchNutation();
    }

    return this;
  }

  /**
   * 转换坐标至 目标历元
   *
   * 会将当前坐标转化成目标历元平坐标
   * 
   * @param  {JDateRepository}       epoch 目标历元
   * @return {EquinoctialCoordinate} 返回 this 引用
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

      // 重新创建基于历元的缓存
      this.cache = new CacheSpaceOnJDate(epoch);

      if (epoch.J2000 !== 0) { // 从 J2000 历元 转换至 epoch
        let { zeta, theta, z } = this.PrecessionCorrection;

        let sc = this.sc
          .rotateZ(zeta)
          .rotateY(- theta)
          .rotateZ(z);

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
   * 章动矩阵：N(ti) = R1(-ε0-Δε) * R3(-ΔΨ) * R1(ε0)
   *
   * @return {EquinoctialCoordinate} 返回 this 引用
   */
  patchNutation() {
    if (this.enableNutation && !this.private.withNutation) {
      let { e0, delta_e, delta_psi } = this.NutationCorrection;

      let sc = this.sc
        .rotateX(-e0)
        .rotateZ(delta_psi)
        .rotateX(e0 + delta_e);

      // 保持球坐标值连续性的值更改
      this.private.SCContinuouslyChange(sc);

      this.private.withNutation = true;
    }

    return this;
  }

  /**
   * 解除章动修正
   * 
   * @return {EquinoctialCoordinate} 返回 this 引用
   */
  unpatchNutation() {
    if (this.enableNutation && this.private.withNutation) {
      let { e0, delta_e, delta_psi } = this.NutationCorrection;

      let sc = this.sc
        .rotateX(- e0 - delta_e)
        .rotateZ(- delta_psi)
        .rotateX(e0);

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
   * @return {EquinoctialCoordinate} 返回 this 引用
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
   * @return {EquinoctialCoordinate} 返回 this 引用
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
   * @return {EquinoctialCoordinate} 返回 this 引用
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
   * @return {EquinoctialCoordinate} 返回 this 引用
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
   * @return {SphericalCoordinate3D} 天球球坐标
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
   * @return {SphericalCoordinate3D} 天球球坐标
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
   * 获取 赤经 角度对象
   * 
   * @return {Angle} 赤经 角度对象
   */
  get ra() {
    return new Angle(this.sc.phi, 'r');
  }

  /**
   * 获取 赤纬 角度对象
   * 
   * @return {Angle} 赤纬 角度对象
   */
  get dec() {
    return (new Angle(Math.PI / 2 - this.sc.theta, 'r'));
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
   * 获取 岁差 偏转修正值
   *
   * @return {Object} 岁差偏转值对象
   */
  get PrecessionCorrection() {
    if (!this.cache.has('PrecessionCorrection')) {
      let zeta = angle.setSeconds(this.Precession.zeta).getRadian(),
          theta = angle.setSeconds(this.Precession.theta).getRadian(),
          z = angle.setSeconds(this.Precession.z).getRadian();

      this.cache.set('PrecessionCorrection', {
        zeta, theta, z
      });
    }

    return this.cache.get('PrecessionCorrection');
  }

  /**
   * 获取 章动 偏转修正值
   *
   * @return {Object} 章动偏转值对象
   */
  get NutationCorrection() {
    if (!this.cache.has('NutationCorrection')) {
      let e0 = angle.setSeconds(this.Precession.epsilon).getRadian(),
          delta_e = angle.setMilliseconds(this.Nutation.obliquity).getRadian(),
          delta_psi = angle.setMilliseconds(this.Nutation.longitude).getRadian();

      this.cache.set('NutationCorrection', {
        e0, delta_e, delta_psi
      });
    }

    return this.cache.get('NutationCorrection');
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
      });

      this.AnnualAberration = new AnnualAberration({
        time: this.private.epoch,
        system: 'equinoctial',
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
      });

      this.GravitationalDeflection = new GravitationalDeflection({
        time: this.private.epoch,
        system: 'equinoctial',
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
      });

      this.FK5Deflection = new FK5Deflection({
        time: this.private.epoch,
        system: 'equinoctial',
        sc,
      });

      this.cache.set('FK5Deflection', this.FK5Deflection.get());
    }

    return this.cache.get('FK5Deflection');
  }
}

module.exports = EquinoctialCoordinate;
