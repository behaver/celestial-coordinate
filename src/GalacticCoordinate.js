'use strict';

const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const { JDateRepository } = require('@behaver/jdate');
const Angle = require('@behaver/angle');
const EquinoctialCoordinate = require('./EquinoctialCoordinate');
const CommonCoordinate = require('./CommonCoordinate');
const angle = new Angle;

/**
 * GalacticCoordinate
 *
 * GalacticCoordinate 是天球银道坐标对象
 * 
 * 1958年以前﹐采用银道升交点作为银道坐标系的主点﹐过该点的银经圈就是这一坐标系的主圈。
 * 在1958年以前，天文界定银道与天赤道的交角为62°，这也是银轴与地轴的交角，亦是银极与天极的角距离；
 *
 * 1958年国际天文学联合会第十届大会规定北银极的赤纬为27°24ˊ，赤经为12h49m（192°15ˊ）。
 * 该方向在旧坐标系中的坐标l'=327.69°,b'=-1.40°(1958年以前银经自银道对天赤道的升交点量起)
 * 现在银道与天赤道的交角被修正为63°26ˊ（约63.5°）
 * 
 * 换算成2000.0历元的坐标，北银极位于赤经12h 51m 26.282s，赤纬+27° 07′ 42.01″（2000.0历元），银经0度的位置角是122.932°
 * 北银极的赤道坐标：(alphaGP,deltaGP)=(192.85948, 27.12825)单位是度
 * 银心方向l=0,b=0。对应的赤道坐标(alpha,delta)=(266.405, -28.936)。 银经不从升交点量起,而取银河中心方向（人马座）为银经的起算点
 * 北天极的银经 lCP=122.932。
 *
 * TODO：1958年以前的银河坐标处理
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class GalacticCoordinate extends CommonCoordinate {

  /**
   * 设定起始天球银道坐标
   * 
   * @param  {SphericalCoordinate3D} options.sc              球坐标
   * @param  {Number}                options.l               银经，单位：度，值域：[0, 360)
   * @param  {Number}                options.b               银纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius          距离半径，值域：[10e-8, +∞)
   * @param  {JDateRepository}       options.epoch           坐标历元
   * 
   * @return {GalacticCoordinate}                            返回 this 引用
   */
  from({
    sc,
    l,
    b,
    radius,
    epoch,
  }) {
    if (epoch === undefined) epoch = new JDateRepository(0, 'j2000');
    else if (!(epoch instanceof JDateRepository)) throw Error('The param epoch should be a instance of JDateRepository');

    // 北银极点赤道坐标
    this.npseqc = new EquinoctialCoordinate({
      ra: 192.85948,
      dec: 27.12825,
    });

    // 银心赤道坐标
    this.gceqc = new EquinoctialCoordinate({
      ra: 266.405,
      dec: -28.936,
    });

    // 将北银极、银心坐标从 J2000 历元 转换至 目标历元
    this.npseqc.on({ epoch });
    this.gceqc.on({ epoch });
    
    this.private = {
      ...this.private,
      epoch,
    };

    this.position({
      sc,
      l,
      b,
      radius,
    });

    return this;
  }

  /**
   * 转换当前坐标的系统参数
   * 
   * @param  {JDateRepository}    options.epoch 坐标历元
   * @return {GalacticCoordinate}               返回 this 引用
   */
  on({
    epoch,
  }) {
    this.onEpoch(epoch);

    return this;
  }

  /**
   * 转换坐标至 目标历元
   *
   * 会将当前坐标转化成目标历元平坐标
   * 
   * @param  {JDateRepository}    epoch 目标历元
   * @return {GalacticCoordinate}       返回 this 引用
   */
  onEpoch(epoch) {
    if (!(epoch instanceof JDateRepository)) throw Error('The param epoch should be a instance of JDateRepository');

    if (epoch.J2000 !== this.epoch.J2000) { // 进行历元转换
      // 初始 北银极赤经、赤纬
      let nps_ra0 = this.npseqc.ra.getRadian(),
          nps_dec0 = this.npseqc.dec.getRadian(),
          gc_ra0 = this.gceqc.ra.getRadian(),
          gc_dec0 = this.gceqc.dec.getRadian(),
          a0 = Math.PI / 2 - (gc_ra0 - nps_ra0),
          theta0 = Math.acos(Math.cos(a0) * Math.cos(gc_dec0)),
          sc0 = this.sc;

      // 将银道坐标转换为 初始历元下的天球赤道坐标
      sc0.rotateZ(-theta0)
        .rotateX(Math.PI / 2 - nps_dec0)
        .rotateZ(nps_ra0 + Math.PI / 2);

      let eqc = new EquinoctialCoordinate({
        sc: sc0,
        epoch: this.epoch,
      });

      // 获取目标历元天球赤道球坐标
      let sc = eqc.on({ epoch }).sc;

      this.npseqc.on({ epoch });
      this.gceqc.on({ epoch });

      // 目标 北银极赤经、赤纬
      let nps_ra = this.npseqc.ra.getRadian(),
          nps_dec = this.npseqc.dec.getRadian(),
          gc_ra = this.gceqc.ra.getRadian(),
          gc_dec = this.gceqc.dec.getRadian(),
          a = Math.PI / 2 - (gc_ra - nps_ra),
          theta = Math.acos(Math.cos(a) * Math.cos(gc_dec));

      sc.rotateZ(- nps_ra - Math.PI / 2)
        .rotateX(- Math.PI / 2 + nps_dec)
        .rotateZ(theta);

      this.private.sc = sc;
      this.private.epoch = epoch;

      return this;
    }
  }

  /**
   * 设定当前系统条件下的坐标点位置
   * 
   * @param  {SphericalCoordinate3D} options.sc     球坐标
   * @param  {Number}                options.l      银经，单位：度，值域：[0, 360)
   * @param  {Number}                options.b      银纬，单位：度，值域：[-90, 90]
   * @param  {Number}                options.radius 距离半径，值域：[10e-8, +∞)
   * @return {GalacticCoordinate}                   返回 this 引用
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
      // else if (l >= 360 || l < 0) throw Error('The param l should be in [0, 360)');
      
      if (b === undefined) b = 0;
      else if (typeof(b) !== 'number') throw Error('The param b should be a Number.');
      // else if (b < -90 || b > 90) throw Error('The param b should be in [-90, 90]');
      
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

    return this;
  }

  /**
   * 获取指定系统参数的坐标结果
   * 
   * @param  {Object} options 坐标系统参数
   * @return {Object}         坐标结果对象
   */
  get(options) {
    if (options === undefined) {
      return {
        sc: this.sc,
        epoch: this.epoch,
      }
    } else {
      // 记录原坐标和条件，输出目标坐标后恢复
      let sc_0 = this.sc;
      let epoch_0 = this.epoch;

      this.on(options);

      // 记录新坐标和条件
      let sc = this.sc;
      let epoch = this.epoch;

      // 还原为初始坐标和条件
      this.private.sc = sc_0;
      this.private.epoch = epoch_0;

      this.npseqc.on({ epoch_0 });
      this.gceqc.on({ epoch_0 });

      return { 
        sc, 
        epoch,
      };
    }
  }

  /**
   * 获取 银经 角度对象
   * 
   * @return {Angle} 银经 角度对象
   */
  get l() {
    return new Angle(this.sc.phi, 'r');
  }

  /**
   * 获取 银纬 角度对象
   * 
   * @return {Angle} 银纬 角度对象
   */
  get b() {
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
}

module.exports = GalacticCoordinate;