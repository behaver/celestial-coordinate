const expect = require("chai").expect;
const { JDateRepository } = require('@behaver/jdate');
const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const Angle = require('@behaver/angle');
const HorizontalCoordinate = require('../src/HorizontalCoordinate');
const HourAngleCoordinate = require('../src/HourAngleCoordinate');
const EquinoctialCoordinate = require('../src/EquinoctialCoordinate');
const EclipticCoordinate = require('../src/EclipticCoordinate');
const GalacticCoordinate = require('../src/GalacticCoordinate');
const CelestialCoordinate = require('../src/CelestialCoordinate');

const angle = new Angle;

describe('#CelestialCoordinate', () => {
  describe('#static horizontal', () => {
    it('The method should return a CelestialCoordinate and The properties should be same with the params.', () => {
      let hc = CelestialCoordinate.horizontal({
        a: 123.45,
        h: 32.109,
      }, {
        time: new JDateRepository(2462088.69, 'jde'),
        geoLong: 120.3456,
        geoLat: 30.4567,
      });

      expect(hc).to.instanceof(CelestialCoordinate);
      expect(hc.horizontal.a.getDegrees()).to.eql(123.45);
      expect(hc.horizontal.h.getDegrees()).to.eql(32.109);
      expect(hc.obTime.JDE).to.eql(2462088.69);
      expect(hc.obGeoLong.getDegrees()).to.eql(120.3456);
      expect(hc.obGeoLat.getDegrees()).to.eql(30.4567);
    });
  });

  describe('#static hourAngle', () => {
    it('The method should return a CelestialCoordinate and The properties should be same with the params.', () => {
      let hac = CelestialCoordinate.hourAngle({
        t: 123.45,
        dec: 32.109,
      }, {
        time: new JDateRepository(2462088.69, 'jde'),
        geoLong: 120.3456,
        geoLat: 30.4567,
      });

      expect(hac).to.instanceof(CelestialCoordinate);
      expect(hac.hourAngle.t.getDegrees()).to.eql(123.45);
      expect(hac.hourAngle.dec.getDegrees()).to.eql(32.109);
      expect(hac.obTime.JDE).to.eql(2462088.69);
      expect(hac.obGeoLong.getDegrees()).to.eql(120.3456);
      expect(hac.obGeoLat.getDegrees()).to.eql(30.4567);
    });
  });

  describe('#static equinoctial', () => {
    it('The method should return a CelestialCoordinate and The properties should be same with the params.', () => {
      let eqc = CelestialCoordinate.equinoctial({
        ra: 123.45,
        dec: 32.109,
      }, {
        time: new JDateRepository(2462088.69, 'jde'),
        geoLong: 120.3456,
        geoLat: 30.4567,
      });

      expect(eqc).to.instanceof(CelestialCoordinate);
      expect(eqc.equinoctial.ra.getDegrees()).to.eql(123.45);
      expect(eqc.equinoctial.dec.getDegrees()).to.eql(32.109);
      expect(eqc.obTime.JDE).to.eql(2462088.69);
      expect(eqc.obGeoLong.getDegrees()).to.eql(120.3456);
      expect(eqc.obGeoLat.getDegrees()).to.eql(30.4567);
    });
  });

  describe('#static ecliptic', () => {
    it('The method should return a CelestialCoordinate and The properties should be same with the params.', () => {
      let ecc = CelestialCoordinate.ecliptic({
        l: 123.45,
        b: 32.109,
      }, {
        time: new JDateRepository(2462088.69, 'jde'),
        geoLong: 120.3456,
        geoLat: 30.4567,
      });

      expect(ecc).to.instanceof(CelestialCoordinate);
      expect(ecc.ecliptic.l.getDegrees()).to.eql(123.45);
      expect(ecc.ecliptic.b.getDegrees()).to.eql(32.109);
      expect(ecc.obTime.JDE).to.eql(2462088.69);
      expect(ecc.obGeoLong.getDegrees()).to.eql(120.3456);
      expect(ecc.obGeoLat.getDegrees()).to.eql(30.4567);
    });
  });

  describe('#static galactic', () => {
    it('The method should return a CelestialCoordinate and The properties should be same with the params.', () => {
      let gc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      }, {
        time: new JDateRepository(2462088.69, 'jde'),
        geoLong: 120.3456,
        geoLat: 30.4567,
      });

      expect(gc).to.instanceof(CelestialCoordinate);
      expect(gc.galactic.l.getDegrees()).to.eql(123.45);
      expect(gc.galactic.b.getDegrees()).to.eql(32.109);
      expect(gc.obTime.JDE).to.eql(2462088.69);
      expect(gc.obGeoLong.getDegrees()).to.eql(120.3456);
      expect(gc.obGeoLat.getDegrees()).to.eql(30.4567);
    });
  });

  describe('#from', () => {
    it('The param options should be a object.', () => {
      expect(() => {
        let gc = CelestialCoordinate.galactic({
          l: 123.45,
          b: 32.109,
        });

        gc.from(123);
      }).to.throw();

      expect(() => {
        let gc = CelestialCoordinate.galactic({
          l: 123.45,
          b: 32.109,
        });

        gc.from({
          system: 'equinoctial',
          ra: 120,
        });
      }).not.to.throw();
    });

    it('The param options.system should be valid.', () => {
      expect(() => {
        let gc = CelestialCoordinate.galactic({
          l: 123.45,
          b: 32.109,
        });

        gc.from({
          system: 'aa',
          ra: 120,
        });
      }).to.throw();
    });

    it('The properties should be same with the params.', () => {
      let gc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      gc.from({
        system: 'equinoctial',
        ra: 120.123,
        dec: 30,
      });

      expect(gc.equinoctial.ra.getDegrees()).to.closeTo(120.123, 1e-10);
      expect(gc.equinoctial.dec.getDegrees()).to.closeTo(30, 1e-10);
    });
  });

  describe('#changeObserver', () => {
    it('The param options should be exist.', () => {
      expect(() => {
        let gc = CelestialCoordinate.galactic({
          l: 123.45,
          b: 32.109,
        });

        gc.changeObserver();
      }).to.throw();
    });

    it('The param options.time should be a JDateRepository.', () => {
      expect(() => {
        let gc = CelestialCoordinate.galactic({
          l: 123.45,
          b: 32.109,
        });

        gc.changeObserver({
          time: 123,
        });
      }).to.throw();

      expect(() => {
        let gc = CelestialCoordinate.galactic({
          l: 123.45,
          b: 32.109,
        });

        gc.changeObserver({
          time: new JDateRepository(2000, 'jepoch'),
        });
      }).not.to.throw();
    });

    it('The param options.geoLong should be a Number.', () => {
      expect(() => {
        let gc = CelestialCoordinate.galactic({
          l: 123.45,
          b: 32.109,
        });

        gc.changeObserver({
          time: new JDateRepository(2000, 'jepoch'),
          geoLong: 'asd',
        });
      }).to.throw();

      expect(() => {
        let gc = CelestialCoordinate.galactic({
          l: 123.45,
          b: 32.109,
        });

        gc.changeObserver({
          time: new JDateRepository(2000, 'jepoch'),
          geoLong: 120,
        });
      }).not.to.throw();
    });

    it('The param options.geoLong should be in [-180, 180].', () => {
      let gc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      expect(() => {
        gc.changeObserver({
          time: new JDateRepository(2000, 'jepoch'),
          geoLong: -180.1,
        });
      }).to.throw();

      expect(() => {
        gc.changeObserver({
          time: new JDateRepository(2000, 'jepoch'),
          geoLong: 180.1,
        });
      }).to.throw();
    });

    it('The param options.geoLat should be a Number.', () => {
      expect(() => {
        let gc = CelestialCoordinate.galactic({
          l: 123.45,
          b: 32.109,
        });

        gc.changeObserver({
          time: new JDateRepository(2000, 'jepoch'),
          geoLong: 123,
          geoLat: '34',
        });
      }).to.throw();

      expect(() => {
        let gc = CelestialCoordinate.galactic({
          l: 123.45,
          b: 32.109,
        });

        gc.changeObserver({
          time: new JDateRepository(2000, 'jepoch'),
          geoLong: 120,
          geoLat: 34,
        });
      }).not.to.throw();
    });

    it('The param options.geoLat should be in [-90, 90].', () => {
      let gc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      expect(() => {
        gc.changeObserver({
          time: new JDateRepository(2000, 'jepoch'),
          geoLat: -90.1,
        });
      }).to.throw();

      expect(() => {
        gc.changeObserver({
          time: new JDateRepository(2000, 'jepoch'),
          geoLat: 90.1,
        });
      }).to.throw();
    });
  });

  describe('#set horizontal', () => {
    it('The param horizontal should be a HorizontalCoordinate.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      expect(() => {
        cc.horizontal = new HorizontalCoordinate({
          a: 120,
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
        });
      }).not.to.throw();

      expect(() => {
        cc.horizontal = '123';
      }).to.throw();
    });

    it('The properties after setting should be same with the params.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      cc.horizontal = new HorizontalCoordinate({
        a: 120,
        h: 60,
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
      });

      expect(cc.horizontal.a.getDegrees()).to.closeTo(120, 1e-10);
      expect(cc.horizontal.h.getDegrees()).to.closeTo(60, 1e-10);
      expect(cc.obGeoLong.getDegrees()).to.closeTo(120, 1e-10);
      expect(cc.obGeoLat.getDegrees()).to.closeTo(30, 1e-10);
      expect(cc.obTime.JEpoch).to.eql(2000);
    });
  });

  describe('#set hourAngle', () => {
    it('The param hourAngle should be a HourAngleCoordinate.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      expect(() => {
        cc.hourAngle = new HourAngleCoordinate({
          t: 120,
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
        });
      }).not.to.throw();

      expect(() => {
        cc.hourAngle = '123';
      }).to.throw();
    });

    it('The properties after setting should be same with the params.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      cc.hourAngle = new HourAngleCoordinate({
        t: 120,
        dec: 30,
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
      });

      expect(cc.hourAngle.t.getDegrees()).to.closeTo(120, 1e-10);
      expect(cc.hourAngle.dec.getDegrees()).to.closeTo(30, 1e-10);
      expect(cc.obGeoLong.getDegrees()).to.closeTo(120, 1e-10);
      expect(cc.obTime.JEpoch).to.eql(2000);
    });
  });

  describe('#set equinoctial', () => {
    it('The param equinoctial should be a EquinoctialCoordinate.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      expect(() => {
        cc.equinoctial = new EquinoctialCoordinate({
          ra: 120,
        });
      }).not.to.throw();

      expect(() => {
        cc.equinoctial = '123';
      }).to.throw();
    });

    it('The properties after setting should be same with the params.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      cc.equinoctial = new EquinoctialCoordinate({
        ra: 120,
        dec: 30,
      });

      expect(cc.equinoctial.ra.getDegrees()).to.closeTo(120, 1e-10);
      expect(cc.equinoctial.dec.getDegrees()).to.closeTo(30, 1e-10);
    });
  });

  describe('#set ecliptic', () => {
    it('The param ecliptic should be a EclipticCoordinate.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      expect(() => {
        cc.ecliptic = new EclipticCoordinate({
          l: 120,
        });
      }).not.to.throw();

      expect(() => {
        cc.ecliptic = '123';
      }).to.throw();
    });

    it('The properties after setting should be same with the params.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      cc.ecliptic = new EclipticCoordinate({
        l: 120,
        b: 30,
      });

      expect(cc.ecliptic.l.getDegrees()).to.closeTo(120, 1e-10);
      expect(cc.ecliptic.b.getDegrees()).to.closeTo(30, 1e-10);
    });
  });

  describe('#set galactic', () => {
    it('The param galactic should be a GalacticCoordinate.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      expect(() => {
        cc.galactic = new GalacticCoordinate({
          l: 120,
        });
      }).not.to.throw();

      expect(() => {
        cc.galactic = '123';
      }).to.throw();
    });

    it('The properties after setting should be same with the params.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      cc.galactic = new GalacticCoordinate({
        l: 120,
        b: 30,
      });

      expect(cc.galactic.l.getDegrees()).to.closeTo(120, 1e-10);
      expect(cc.galactic.b.getDegrees()).to.closeTo(30, 1e-10);
    });
  });

  describe('#get horizontal', () => {
    it('The return of method should be a HorizontalCoordinate.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      }, {
        time: new JDateRepository(new Date('1992/08/15 08:25:00'), 'date'),
        geoLong: 120,
        geoLat: 30,
      });

      expect(cc.horizontal).to.instanceof(HorizontalCoordinate);
    });

    it('Using get horizontal should set obOptions first.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      expect(() => {
        cc.horizontal;
      }).to.throw()
    });
  });

  describe('#get hourAngle', () => {
    it('The return of method should be a HourAngleCoordinate.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      }, {
        time: new JDateRepository(new Date('1992/08/15 08:25:00'), 'date'),
        geoLong: 120,
      });

      expect(cc.hourAngle).to.instanceof(HourAngleCoordinate);
    });

    it('Using get hourAngle should set obOptions first.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      expect(() => {
        cc.hourAngle;
      }).to.throw()
    });
  });

  describe('#get equinoctial', () => {
    it('The return of method should be a EquinoctialCoordinate.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      }, {
        time: new JDateRepository(new Date('1992/08/15 08:25:00'), 'date'),
        geoLong: 120,
      });

      expect(cc.equinoctial).to.instanceof(EquinoctialCoordinate);
    });

    it('Using get equinoctial should not set obOptions first.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      expect(() => {
        cc.equinoctial;
      }).not.to.throw()
    });
  });

  describe('#get ecliptic', () => {
    it('The return of method should be a EclipticCoordinate.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      }, {
        time: new JDateRepository(new Date('1992/08/15 08:25:00'), 'date'),
        geoLong: 120,
      });

      expect(cc.ecliptic).to.instanceof(EclipticCoordinate);
    });

    it('Using get ecliptic should not set obOptions first.', () => {
      let cc = CelestialCoordinate.galactic({
        l: 123.45,
        b: 32.109,
      });

      expect(() => {
        cc.ecliptic;
      }).not.to.throw();
    });
  });

  describe('#get galactic', () => {
    it('The return of method should be a GalacticCoordinate.', () => {
      let cc = CelestialCoordinate.ecliptic({
        l: 123.45,
        b: 32.109,
      }, {
        time: new JDateRepository(new Date('1992/08/15 08:25:00'), 'date'),
        geoLong: 120,
      });

      expect(cc.galactic).to.instanceof(GalacticCoordinate);
    });

    it('Using get galactic should not set obOptions first.', () => {
      let cc = CelestialCoordinate.ecliptic({
        l: 123.45,
        b: 32.109,
      });

      expect(() => {
        cc.galactic;
      }).not.to.throw();
    });
  });
})