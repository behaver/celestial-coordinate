'use strict';

const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const { PrecessionIAU2006, PrecessionIAU2000, PrecessionIAU1976 } = require('@behaver/precession');
const { NutationIAU2000B, NutationLP } = require('@behaver/nutation');
const { JDateRepository } = require('@behaver/jdate');
const SiderealTime = require('@behaver/sidereal-time');
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
class EquinoctialCoordinate {

  /**
   * 构造函数
   * 
   * @param  {SphericalCoordinate3D} options.sc              球坐标
   * @param  {Number}                options.ra              坐标赤经，单位：度，值域：[0, 360)
   * @param  {Number}                options.dec             坐标赤纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius          坐标距离半径，值域：[10e-8, +∞)
   * @param  {JDateRepository}       options.epoch           坐标历元
   * @param  {Boolean}               options.withNutation    坐标是否修正了章动
   * @param  {String}                options.precessionModel 岁差计算模型
   *                                                         包含：iau2006、iau2000、iau1976
   * @param  {String}                options.nutationModel   章动计算模型
   *                                                         包含：iau2000b、lp
   */
  constructor(options) {
    this.from(options);
  }

  /**
   * 设定起始天球赤道坐标
   * 
   * @param  {SphericalCoordinate3D} options.sc              球坐标
   * @param  {Number}                options.ra              坐标赤经，单位：度，值域：[0, 360)
   * @param  {Number}                options.dec             坐标赤纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius          坐标距离半径，值域：[10e-8, +∞)
   * @param  {JDateRepository}       options.epoch           坐标历元
   * @param  {Boolean}               options.withNutation    坐标是否修正了章动
   * @param  {String}                options.precessionModel 岁差计算模型
   *                                                         包含：iau2006、iau2000、iau1976
   * @param  {String}                options.nutationModel   章动计算模型
   *                                                         包含：iau2000b、lp
   * @return {EquinoctialCoordinate}                         返回 this 引用
   */
  from({
    sc, 
    ra,
    dec,
    radius,
    epoch, 
    withNutation, 
    precessionModel, 
    nutationModel, 
  }) {

    if (epoch === undefined) epoch = new JDateRepository(0, 'j2000');
    else if (!(epoch instanceof JDateRepository)) throw Error('The param epoch should be a instance of JDateRepository');
    
    if (withNutation === undefined) withNutation = false;
    
    if (precessionModel === undefined) precessionModel = 'IAU2006';
    else if (typeof(precessionModel) !== 'string') throw Error('The param precessionModel should be a String.');
    
    if (nutationModel === undefined) nutationModel = 'IAU2000B';
    else if (typeof(nutationModel) !== 'string') throw Error('The param nutationModel should be a String.');

    withNutation = !!withNutation;

    precessionModel = precessionModel.toLowerCase()
    switch(precessionModel) {
      case 'iau2006':
        this.precession = new PrecessionIAU2006(epoch);
        break;
      case 'iau2000':
        this.precession = new PrecessionIAU2000(epoch);
        break;
      case 'iau1976':
        this.precession = new PrecessionIAU1976(epoch);
        break;
      default:
        throw Error('The param precessionModel should be in ["IAU2006", "IAU2000", "IAU1976"]');
    }

    nutationModel = nutationModel.toLowerCase()
    switch(nutationModel) {
      case 'iau2000b':
        this.nutation = new NutationIAU2000B(epoch);
        break;
      case 'lp':
        this.nutation = new NutationLP(epoch);
        break;
      default:
        throw Error('The param nutationModel should be in ["IAU2000B", "LP"]');
    }

    this.private = { 
      epoch, 
      withNutation, 
      precessionModel, 
      nutationModel,
    };

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
   * @param  {JDateRepository}       options.epoch        坐标历元
   * @param  {Boolean}               options.withNutation 坐标是否修复章动
   * @return {EquinoctialCoordinate}                      返回 this 引用
   */
  on({
    epoch, 
    withNutation, 
  }) {
    // 参数预处理
    if (epoch === undefined) epoch = this.private.epoch;
    if (withNutation === undefined) withNutation = this.withNutation;
    withNutation = !!withNutation;

    this.onEpoch(epoch);

    if (withNutation) { // 尝试修正章动
      this.nutationPatch();
    }

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
      else if (ra >= 360 || ra < 0) throw Error('The param ra should be in [0, 360)');
      
      if (dec === undefined) dec = 0;
      else if (typeof(dec) !== 'number') throw Error('The param dec should be a Number.');
      else if (dec < -90 || dec > 90) throw Error('The param dec should be in [-90, 90]');
      
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
        withNutation: this.withNutation,
        precessionModel: this.precessionModel, 
        nutationModel: this.nutationModel,
      }
    } else {
      // 记录原坐标和条件，输出目标坐标后恢复
      let sc_0 = this.sc;
      let epoch_0 = this.epoch;
      let withNutation_0 = this.withNutation;

      this.on(options);

      // 记录新坐标和条件
      let sc = this.sc;
      let epoch = this.epoch;
      let withNutation = this.withNutation;

      // 还原为初始坐标和条件
      this.private.sc = sc_0;
      this.private.epoch = epoch_0;
      this.private.withNutation = withNutation_0;

      this.nutation.on(epoch_0);
      this.precession.on(epoch_0);

      return { 
        sc, 
        epoch,
        withNutation,
        precessionModel: this.precessionModel, 
        nutationModel: this.nutationModel,
      };
    }
  }

  /**
   * 转换当前坐标至目标天球系统
   * 
   * @param  {String} system  目标天球坐标系统
   *                          可选值：horizontal、hourangle、ecliptic、galactic
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
      case 'ecliptic':
        return this.toEcliptic(options);
      case 'galactic':
        return this.toGalactic(options);

      default:
        throw Error('The param system should be in ["horizontal", "hourangle", "ecliptic", "galactic"]');
    }
  }

  /**
   * 转换至地平系统
   *
   * 地平坐标为观测坐标，即瞬时天球坐标。
   * 
   * @param  {JDateRepository}      options.obTime    观测时间
   * @param  {Number}               options.obGeoLong 观测点地理经度
   *                                                  单位：度，值域：[-180, 180]
   * @param  {Number}               options.obGeoLat  观测点地理纬度
   *                                                  单位：度，值域：[-90, 90]
   * @return {Object}                                 地平坐标对象
   */
  toHorizontal({ obTime, obGeoLong, obGeoLat }) {
    // 参数预处理
    if (obTime === undefined) obTime = this.epoch;
    else if (!(obTime instanceof JDateRepository)) throw Error('The param obTime should be a instance of JDateRepository');
    
    if (typeof(obGeoLong) !== 'number') throw Error('The param obGeoLong should be a Number');
    else if (obGeoLong < -180 || obGeoLong > 180) throw Error('The param obGeoLong should be in [-180, 180]');

    if (typeof(obGeoLat) !== 'number') throw Error('The param obGeoLat should be a Number');
    else if (obGeoLat < -90 || obGeoLat > 90) throw Error('The param obGeoLat should be in [-90, 90]');

    // 获取观测者恒星时
    let st = new SiderealTime(obTime, obGeoLong, { 
      precessionModel: this.precessionModel, 
      nutationModel: this.nutationModel,
    });

    // 真恒星时
    let trueST = angle.setSeconds(st.trueVal).getRadian();

    let { sc } = this.get({ epoch: obTime, withNutation: true });
    
    sc.rotateZ(- trueST)
      .rotateY(- Math.PI / 2 + angle.setDegrees(obGeoLat).getRadian())
      .inverse('y');

    return { 
      sc, 
      obTime, 
      obGeoLong, 
      obGeoLat, 
      precessionModel: this.precessionModel, 
      nutationModel: this.nutationModel,
    };
  }

  /**
   * 转换当前坐标至天球时角系统
   *
   * 时角坐标为观测坐标，即瞬时天球坐标。
   * 
   * @param  {JDateRepository} options.obTime    观测时间
   * @param  {Number}          options.obGeoLong 观测点地理经度
   *                                             单位：度
   * @return {Object}                            时角坐标对象
   */
  toHourAngle({ obTime, obGeoLong }) {
    // 参数预处理
    if (obTime === undefined) obTime = this.epoch;
    else if (!(obTime instanceof JDateRepository)) throw Error('The param epoch should be a instance of JDateRepository');
    
    if (typeof(obGeoLong) !== 'number') throw Error('The param obGeoLong should be a Number');

    // 获取观测者恒星时
    let st = new SiderealTime(obTime, obGeoLong, { 
      precessionModel: this.precessionModel, 
      nutationModel: this.nutationModel,
    });

    // 真恒星时
    let trueST = (new Angle(st.trueVal, 's')).getRadian();

    let { sc } = this.get({ epoch: obTime, withNutation: true });

    sc.rotateZ(- trueST)
      .inverse('y');

    return { 
      sc, 
      obTime, 
      obGeoLong,
      precessionModel: this.precessionModel, 
      nutationModel: this.nutationModel,
    };
  }

  /**
   * 转换至 黄道坐标
   * 
   * @return {Object} 黄道坐标对象
   */
  toEcliptic() {
    let sc = this.sc;

    let e0 = angle.setSeconds(this.precession.epsilon).getRadian();

    if (this.withNutation) { // 真坐标
      let delta_e = angle.setMilliseconds(this.nutation.obliquity).getRadian();
      sc.rotateX(-e0 - delta_e);
    } else { // 平坐标
      sc.rotateX(-e0);
    }
    
    return {
      sc,
      epoch: this.epoch,
      withNutation: this.withNutation,
      precessionModel: this.precessionModel, 
      nutationModel: this.nutationModel,
    };
  }

  /**
   * 转换至 银道坐标
   * 
   * @return {Object} 银道坐标对象
   */
  toGalactic() {
    // J2000 北银极赤经、赤纬
    let nps_ra = angle.setDegrees(192.85948).getRadian();
    let nps_dec = angle.setDegrees(27.12825).getRadian();

    // J2000 银心赤经、赤纬
    let gc_ra = angle.setDegrees(266.405).getRadian();
    let gc_dec = angle.setDegrees(-28.936).getRadian();

    // 求银心与升交点夹角 theta
    // 根据 球面三角余弦公式:
    // cos(theta) = cos(a)cos(gc_dec) + sin(a)sin(gc_dec)cos(90°)
    //            = cos(a)cos(gc_dec)
    // 其中 a = 90° - (gc_ra - nps_ra)
    let a = Math.PI / 2 - (gc_ra - nps_ra);
    let theta = Math.acos(Math.cos(a) * Math.cos(gc_dec));
    
    // 切换坐标到 J2000 平坐标
    let epoch = new JDateRepository(0, 'j2000');

    let { sc } = this.get({ epoch, withNutation: false });

    sc.rotateZ(- nps_ra - Math.PI / 2)
      .rotateX(- Math.PI / 2 + nps_dec)
      .rotateZ(theta);

    return {
      sc,
      epoch,
      precessionModel: this.precessionModel, 
      nutationModel: this.nutationModel,
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
    let zeta = angle.setSeconds(this.precession.zeta).getRadian();
    let theta = angle.setSeconds(this.precession.theta).getRadian();
    let z = angle.setSeconds(this.precession.z).getRadian();

    if (this.withNutation) { // 逆向章动处理，转换至平坐标
      this.nutationUnpatch();
    }

    this.private.sc
      .rotateZ(- z)
      .rotateY(theta)
      .rotateZ(- zeta);

    let epoch = new JDateRepository(2000, 'jepoch');
    this.private.epoch = epoch;
    this.precession.on(epoch);
    this.nutation.on(epoch);
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

      if (this.withNutation) { // 逆向章动处理，转换至平坐标
        this.nutationUnpatch();
      }

      this.private.epoch = epoch;
      this.precession.on(epoch);
      this.nutation.on(epoch);

      if (epoch.J2000 !== 0) { // 从 J2000 历元 转换至 epoch
        let zeta = angle.setSeconds(this.precession.zeta).getRadian();
        let theta = angle.setSeconds(this.precession.theta).getRadian();
        let z = angle.setSeconds(this.precession.z).getRadian();

        this.private.sc
          .rotateZ(zeta)
          .rotateY(- theta)
          .rotateZ(z);
      }
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
  nutationPatch() {
    if (this.withNutation) return this;

    let e0 = angle.setSeconds(this.precession.epsilon).getRadian();
    let delta_e = angle.setMilliseconds(this.nutation.obliquity).getRadian();
    let delta_psi = angle.setMilliseconds(this.nutation.longitude).getRadian();

    this.private.sc
      .rotateX(e0)
      .rotateZ(- delta_psi)
      .rotateX(- e0 - delta_e);

    this.private.withNutation = true;

    return this;
  }

  /**
   * 解除章动修正
   * 
   * @return {EquinoctialCoordinate} 返回 this 引用
   */
  nutationUnpatch() {
    if (!this.withNutation) return this;

    let e0 = angle.setSeconds(this.precession.epsilon).getRadian();
    let delta_e = angle.setMilliseconds(this.nutation.obliquity).getRadian();
    let delta_psi = angle.setMilliseconds(this.nutation.longitude).getRadian();

    this.private.sc
      .rotateX(e0 + delta_e)
      .rotateZ(delta_psi)
      .rotateX(- e0);

    this.private.withNutation = false;

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
   * 获取 章动修正状态
   * 
   * @return {Boolean} 是否修正章动
   */
  get withNutation() {
    return this.private.withNutation;
  }

  /**
   * 获取 岁差模型名称
   * 
   * @return {String} 岁差模型名称
   */
  get precessionModel() {
    return this.private.precessionModel;
  }

  /**
   * 获取 章动模型名称
   * 
   * @return {String} 章动模型名称
   */
  get nutationModel() {
    return this.private.nutationModel;
  }
}

module.exports = EquinoctialCoordinate;
