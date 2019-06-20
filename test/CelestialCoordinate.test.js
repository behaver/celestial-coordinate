const expect = require("chai").expect;

const { 
  CelestialCoordinate,
  SystemSwitcher, 
  HorizontalCoordinate, 
  HourAngleCoordinate, 
  EquinoctialCoordinate,
  EclipticCoordinate,
  GalacticCoordinate,
} = require('../index');

const { JDateRepository } = require('@behaver/jdate');
const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');

describe('#CelestialCoordinate', () => {
  describe('#constructor', () => {
    it('it should be constructed with no error.', () => {
      expect(() => {
        new CelestialCoordinate;
        new CelestialCoordinate({
          epoch: new JDateRepository,
          withNutation: true,
          enableFK5: false,
        });
      }).not.to.throw();
    });
  });

  describe('#create', () => {
    let CC = new CelestialCoordinate({
      epoch: new JDateRepository(2448976.5),
      withNutation: true,
      enableFK5: false,
    });

    it('The method create should run with no error.', () => {
      expect(() => {
        CC.create('ecc');

        CC.create('ecc', {
          longitude: 120,
          latitude: 35.5,
        });

        CC.create('ecc', {
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
          withNutation: false,
        });

        CC.create('hc', {
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
          obGeoLong: 123,
          obGeoLat: 23,
        })
      }).not.to.throw();
    });

    it('The param of create() is not valid, then throw error.', () => {
      expect(() => {
        CC.create();
      }).to.throw();

      expect(() => {
        CC.create(123);
      }).to.throw();

      expect(() => {
        CC.create('123');
      }).to.throw();

      expect(() => {
        CC.create('hc');
      }).to.throw();
    });

    it('The return of create(\'ecc\') should be an instance of EclipticCoordinate.', () => {
      let ecc = CC.create('ecc', {
        longitude: 120,
        latitude: 35.5,
      });

      expect(ecc).to.be.an.instanceof(EclipticCoordinate);
    });

    it('The return of create(\'eqc\') should be an instance of EquinoctialCoordinate.', () => {
      let eqc = CC.create('eqc', {
        longitude: 120,
        latitude: 35.5,
      });

      expect(eqc).to.be.an.instanceof(EquinoctialCoordinate);
    });

    it('The return of create(\'gc\') should be an instance of GalacticCoordinate.', () => {
      let gc = CC.create('gc', {
        longitude: 120,
        latitude: 35.5,
      });

      expect(gc).to.be.an.instanceof(GalacticCoordinate);
    });

    it('The return of create(\'hc\') should be an instance of HorizontalCoordinate.', () => {
      let hc = CC.create('hc', {
        obGeoLong: 123,
        obGeoLat: 23,
        longitude: 120,
        latitude: 35.5,
      });

      expect(hc).to.be.an.instanceof(HorizontalCoordinate);
    });

    it('The return of create(\'hac\') should be an instance of HourAngleCoordinate.', () => {
      let hac = CC.create('hac', {
        obGeoLong: 123,
        obGeoLat: 23,
        longitude: 120,
        latitude: 35.5,
      });

      expect(hac).to.be.an.instanceof(HourAngleCoordinate);
    });

    let ecc = CC.create('ecc', {
      longitude: 120,
      latitude: 35.5,
    });

    it('The properties of coord created should be equal setting.', () => {
      expect(ecc.longitude.getDegrees()).to.closeTo(120, 1e-10);
      expect(ecc.latitude.getDegrees()).to.equal(35.5);
      expect(ecc.epoch.JD).to.equal(2448976.5);
      expect(ecc.withNutation).to.equal(true);
      expect(ecc.enableFK5).to.equal(false);
    });
  });

  describe('#transform', () => {
    let CC = new CelestialCoordinate({
      epoch: new JDateRepository(2448976.5),
      withNutation: true,
      enableFK5: false,
    });

    let ECC = CC.create('ecc');

    it('The method transform() should run with no error.', () => {
      expect(() => {
        CC.transform(ECC);
      }).not.to.throw();
    });

    let SS = CC.transform(ECC);

    it('The return of transform() should be an instance of SystemSwitcher.', () => {
      expect(SS).to.be.an.instanceof(SystemSwitcher);
    });
  });

  describe('#options', () => {
    expect(() => {
      let CC = new CelestialCoordinate({
        epoch: new JDateRepository(2448976.5),
        withNutation: true,
        enableFK5: false,
      });

      CC.options;
      CC.options = {
        enableNutation: false,
      };
    }).not.to.throw();
  });
});