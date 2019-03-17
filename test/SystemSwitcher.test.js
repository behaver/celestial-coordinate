const expect = require("chai").expect;
const SystemSwitcher = require('../src/SystemSwitcher');
const HorizontalCoordinate = require('../src/HorizontalCoordinate');
const HourAngleCoordinate = require('../src/HourAngleCoordinate');
const EquinoctialCoordinate = require('../src/EquinoctialCoordinate');
const EclipticCoordinate = require('../src/EclipticCoordinate');
const GalacticCoordinate = require('../src/GalacticCoordinate');
const { JDateRepository } = require('@behaver/jdate');

const Angle = require('@behaver/angle');
const angle = new Angle;

describe('#SystemSwitcher', () => {
  describe('#constructor(coord)', () => {
    it('Called with no error.', () => {
      expect(() => {
        new SystemSwitcher;
        new SystemSwitcher(new EclipticCoordinate({ l: 123.2332 }));
      }).not.to.throw();
    });
  });

  describe('#from(coord)', () => {
    it('The param coord should be an instanceof CelestialCoordinate.', () => {
      expect(() => {
        let SS = new SystemSwitcher();
        SS.from(new EclipticCoordinate({ l: 123.2332 }));
      }).not.to.throw();

      expect(() => {
        let SS = new SystemSwitcher();
        SS.from(123);
      }).to.throw();
    });
  });

  describe('#to(sysCode, options)', () => {
    it('The origin coord should have been given first.', () => {
      expect(() => {
        let SS = new SystemSwitcher();
        SS.from(new EclipticCoordinate({ l: 123.2332, b: 30 }));
        SS.to('eqc');
      }).not.to.throw();

      expect(() => {
        let SS = new SystemSwitcher();
        SS.to('eqc');
      }).to.throw();
    });

    it('The param sysCode should be valid.', () => {
      expect(() => {
        let SS = new SystemSwitcher();
        SS.from(new EclipticCoordinate({ l: 123.2332, b: 30 }));
        SS.to('ccc');
      }).to.throw();
    });
  });

  describe('#Verify', () => {
    it('EQC 2 ECC 《天文算法》12.a', () => {
      let EQC = new EquinoctialCoordinate({
        ra: angle.parseHACString('7h 45m 18.946s').getDegrees(),
        dec: 28.026183,
      });

      let Switcher = new SystemSwitcher(EQC);

      let ECC = Switcher.to('ecc');

      expect(ECC.l.getDegrees()).to.closeTo(113.215630, 0.000001);
      expect(ECC.b.getDegrees()).to.closeTo(6.684170, 0.000011);
    });

    it('EQC 2 HC 《天文算法》12.b', () => {
      let epoch = new JDateRepository(new Date('1987/04/11 03:21:00'), 'date');
      let EQC = new EquinoctialCoordinate({
        ra: angle.parseHACString('23h 09m 16.641s').getDegrees(),
        dec: angle.parseDACString('-6°43′11.61″').getDegrees(),
        epoch: epoch,
        withNutation: true,
        withAnnualAberration: true,
        withGravitationalDeflection: true,
        onFK5: true,
      });

      let Switcher = new SystemSwitcher(EQC);

      let HC = Switcher.to('hc', {
        obTime: epoch,
        obGeoLong: angle.parseDACString('77°03′56″').getDegrees(),
        obGeoLat: angle.parseDACString('38°55′17″').getDegrees(),
      });

      expect(HC.a.getDegrees()).to.closeTo(68.0337, 0.00012);
      expect(HC.h.getDegrees()).to.closeTo(15.1249, 0.0001);
    });

    it('EQC 2 GC 《天文算法》12.练习', () => {
      let epoch = new JDateRepository(1950, 'bepoch');
      let EQC = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
        epoch: epoch,
        // withNutation: true,
      });

      let Switcher = new SystemSwitcher(EQC);

      let GC = Switcher.to('gc', {
        epoch: new JDateRepository(1978, 'bepoch')
      });

      expect(GC.l.getDegrees()).to.closeTo(12.9593, 0.0003);
      expect(GC.b.getDegrees()).to.closeTo(6.0463, 0.00016);
    });

    
  });
})