const expect = require("chai").expect;
const { JDateRepository } = require('@behaver/jdate');
const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const Angle = require('@behaver/angle');
const HorizontalCoordinate = require('../src/HorizontalCoordinate');
const EquinoctialCoordinate = require('../src/EquinoctialCoordinate');
const SiderealTime = require('@behaver/sidereal-time');
const DiurnalParallax = require('@behaver/diurnal-parallax');

const angle = new Angle;

describe('#HorizontalCoordinate', () => {
  describe('#constructor', () => {
    // 与 form 测试一致
  });

  describe('#from', () => {
    it('The param obTime should exist and be a JDateRepository.', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).not.to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obTime: 112233,
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).to.throw();
    });

    it('The param obGeoLong should exist and be a Number.', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: '120',
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180].', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: -181,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        })
      }).to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 181,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        })
      }).to.throw();
    });

    it('The param obGeoLat should exist and be a Number.', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: '30',
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).to.throw();
    });

    it('The param obGeoLat should be in [-90, 90].', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: -91,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        })
      }).to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 91,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        })
      }).to.throw();
    });

    it('The param sc if existed should be a SphericalCoordinate3D.', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: 'asdf',
        });
      }).to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).not.to.throw();
    });

    it('The param a if existed should be a Number.', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });
      }).not.to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: '120',
          h: 60,
        });
      }).to.throw();
    });

    it('The param a should be in [0, 360).', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: -1,
          h: 60,
        });
      }).to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 361,
          h: 60,
        });
      }).to.throw();
    });

    it('The param h if existed should be a Number.', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
          h: 60,
        });
      }).not.to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
          h: '60',
        });
      }).to.throw();
    });

    it('The param h should be in [-90, 90].', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
          h: -91,
        });
      }).to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
          h: 91,
        });
      }).to.throw();
    });

    it('The param z if existed should be a Number.', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
          z: 60,
        });
      }).not.to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
          z: '60',
        });
      }).to.throw();
    });

    it('The param z should be in [0, 180].', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
          z: -1,
        });
      }).to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
          z: 181,
        });
      }).to.throw();
    });

    it('The param radius if existed should be a Number.', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
          z: 60,
          radius: 1.23,
        });
      }).not.to.throw();

      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
          z: 60,
          radius: '1.23',
        });
      }).to.throw();
    });

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
          z: 60,
          radius: 0,
        });
      }).to.throw();
    });
  })

  describe('#on', () => {
    it('The param obTime should be a JDateRepository.', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obTime: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: -120,
          obGeoLat: -30,
        });
      }).not.to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obTime: 2462088.69,
        });
      }).to.throw();
    });

    it('The param obGeoLong should be a Number.', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obTime: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: '120',
          obGeoLat: -30,
        });
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180].', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obGeoLong: -181,
        });
      }).to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obGeoLong: 181,
          obGeoLat: -30,
        });
      }).to.throw();
    });

    it('The param obGeoLat should be a Number.', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obTime: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: 120,
          obGeoLat: '30',
        });
      }).to.throw();
    });

    it('The param obGeoLat should be in [-90, 90].', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obGeoLat: -91,
        });
      }).to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obGeoLat: 91,
        });
      }).to.throw();
    });

    it('Verify', () => {

    });
  });

  describe('#position', () => {
    it('The param sc if existed should be a SphericalCoordinate3D.', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 123,
        });

        hc.position({
          sc: 'sdfa',
        });
      }).to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120.123,
        });

        hc.position({
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).not.to.throw();
    });

    it('The param a if existed should be a Number.', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: 210
        })
      }).not.to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: '210'
        })
      }).to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          z: 30,
        })
      }).to.throw();
    });

    it('The param a should be in [0, 360).', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: -1
        })
      }).to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: 361
        })
      }).to.throw();
    });

    it('The param h if existed should be a Number.', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: 210,
          h: 30,
        })
      }).not.to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: 210,
          h: '30',
        })
      }).to.throw();
    });

    it('The param h should be in [-90, 90].', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: 210,
          h: -91,
        })
      }).to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: 210,
          h: 91,
        })
      }).to.throw();
    });

    it('The param z if existed should be a Number.', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: 210,
          z: 60,
        })
      }).not.to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: 210,
          z: '60',
        })
      }).to.throw();
    });

    it('The param z should be in [0, 180].', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: 210,
          z: -1,
        })
      }).to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: 210,
          z: 181, 
        })
      }).to.throw();
    });

    it('The param radius if existed should be a Number.', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: 210,
          z: 30,
          radius: 1.23,
        })
      }).not.to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: 210,
          z: 30,
          radius: '1.23',
        })
      }).to.throw();
    });

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          a: 120,
        });

        hc.position({
          a: 210,
          radius: 0,
        })
      }).to.throw();
    });

    it('The property after using position should update.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        a: 120,
      });

      hc.position({
        a: 210,
        radius: 1,
      })

      expect(hc.a.getDegrees()).to.equal(210);
      expect(hc.obGeoLong.getDegrees()).to.equal(120);
    });
  })

  describe('#get', () => {
    it('The param obTime should be a JDateRepository.', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obTime: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: -120,
          obGeoLat: -30,
        });
      }).not.to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obTime: 2462088.69,
        });
      }).to.throw();
    });

    it('The param obGeoLong should be a Number.', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obTime: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: '120',
          obGeoLat: -30,
        });
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180].', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obGeoLong: -181,
        });
      }).to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obGeoLong: 181,
          obGeoLat: -30,
        });
      }).to.throw();
    });

    it('The param obGeoLat should be a Number.', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obTime: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: 120,
          obGeoLat: '30',
        });
      }).to.throw();
    });

    it('The param obGeoLat should be in [-90, 90].', () => {
      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obGeoLat: -91,
        });
      }).to.throw();

      expect(() => {
        let hc = new HorizontalCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          obGeoLat: 30,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obGeoLat: 91,
        });
      }).to.throw();
    });

    it('This method wont change the origin condition property.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      hc.get({
        obTime: new JDateRepository(2050.0, 'jepoch'),
        obGeoLong: -120,
        obGeoLat: -30,
      });

      expect(hc.obTime.JEpoch).to.equal(2000);
      expect(hc.obGeoLong.getDegrees()).to.equal(120);
      expect(hc.obGeoLat.getDegrees()).to.equal(30);
    });

    it('The return should be a right structure.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      let res = hc.get({
        obTime: new JDateRepository(2050.0, 'jepoch'),
        obGeoLong: -120,
        obGeoLat: -30,
      });

      expect(res).to.have.all.key('sc', 'obTime', 'obGeoLong', 'obGeoLat', 'obElevation', 'centerMode', 'withAR');
    })
  });

  describe('#on', () => {
    it('#天文算法 例39.a', () => {
      let date = new Date('2003/08/28 11:17:00');
      let jdate = new JDateRepository(date, 'date');
      let obGeoLong = angle.parseDACString('116°51′50″').getDegrees();
      let obGeoLat = angle.parseDACString('33°21′21″').getDegrees();
      let obElevation = 1713;

      let siderealTime = new SiderealTime(jdate, obGeoLong);

      let r = 0.37276;
      let theta = angle.setDegrees(90 + 15.771083).getRadian();
      let phi = angle.setDegrees(339.530208).getRadian();
      let egc = new SphericalCoordinate3D(r, theta, phi);

      let ec = new EquinoctialCoordinate({
        sc: egc,
        epoch: jdate,
        withNutation: true,
      });

      // 地平地心坐标
      let hgc = ec.toHorizontal({
        obGeoLong,
        obGeoLat,
      }).sc;

      let hdp = new DiurnalParallax({
        gc: hgc,
        siderealTime: siderealTime,
        obGeoLat: obGeoLat,
        obElevation: 1713,
        system: 'horizontal',
      });

      let htc = hdp.TC;

      let hc = new HorizontalCoordinate({
        sc: hgc,
        obTime: jdate,
        obGeoLong,
        obGeoLat,
        obElevation: 1713,
        centerMode: 'geocentric',
      });

      hc.on({
        centerMode: 'topocentric',
      });

      expect(htc.r).to.closeTo(hc.radius, 1e-12);
      expect(htc.theta).to.equal(hc.z.getRadian());
      expect(htc.phi).to.equal(hc.a.getRadian());

      hc.on({
        centerMode: 'geocentric',
      });

      expect(hgc.r).to.closeTo(hc.radius, 0.000001);
      expect(hgc.theta).to.equal(hc.z.getRadian());
      expect(hgc.phi).to.closeTo(hc.a.getRadian(), 10e-10);

      hc.onTopocentric();

      expect(htc.r).to.closeTo(hc.radius, 0.000001);
      expect(htc.theta).to.equal(hc.z.getRadian());
      expect(htc.phi).to.closeTo(hc.a.getRadian(), 10e-10);

      let egc2 = hc.toEquinoctial().sc;

      expect(egc.r).to.closeTo(egc2.r, 0.000001);
      expect(egc.theta).to.closeTo(egc2.theta, 1e-10);
      expect(egc.phi).to.closeTo(egc2.phi, 1e-10);
    });
  });

  describe('#onTopocentric', () => {
    it('Running with no error.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        centerMode: 'geocentric',
      });

      expect(() => {
        hc.onTopocentric();
      }).not.to.throw();
    });

    it('After calling onTopocentric, The properties should be changed autolly.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        centerMode: 'geocentric',
      });

      let phi0 = hc.sc.phi,
          theta0 = hc.sc.theta,
          r0 = hc.sc.r;

      hc.onTopocentric();

      expect(phi0).not.to.equal(hc.sc.phi);
      expect(theta0).not.to.equal(hc.sc.theta);
      expect(r0).not.to.equal(hc.sc.r);

      expect(hc.centerMode).to.equal('topocentric');
    });
  });

  describe('#onGeocentric', () => {
    it('Running with no error.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        centerMode: 'topocentric',
      });

      expect(() => {
        hc.onGeocentric();
      }).not.to.throw();
    });

    it('After calling onGeocentric, The properties should be changed autolly.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        centerMode: 'topocentric',
      });

      let phi0 = hc.sc.phi,
          theta0 = hc.sc.theta,
          r0 = hc.sc.r;

      hc.onGeocentric();

      expect(phi0).not.to.equal(hc.sc.phi);
      expect(theta0).not.to.equal(hc.sc.theta);
      expect(r0).not.to.equal(hc.sc.r);

      expect(hc.centerMode).to.equal('geocentric');
    });
  });

  describe('#onObservedView', () => {
    it('Running with no error.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        centerMode: 'geocentric',
      });

      expect(() => {
        hc.onObservedView();
      }).not.to.throw();
    });

    it('After calling onObservedView, The properties should be changed autolly.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        centerMode: 'geocentric',
        withAR: false,
      });

      let phi0 = hc.sc.phi,
          theta0 = hc.sc.theta,
          r0 = hc.sc.r;

      hc.onObservedView();

      expect(phi0).not.to.equal(hc.sc.phi);
      expect(theta0).not.to.equal(hc.sc.theta);
      expect(r0).not.to.equal(hc.sc.r);

      expect(hc.centerMode).to.equal('topocentric');
      expect(hc.withAR).to.equal(true);
    });
  });

  describe('#patchAR', () => {
    it('Running with no error.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        centerMode: 'geocentric',
        withAR: false,
      });

      expect(() => {
        hc.patchAR();
      }).not.to.throw();
    });

    it('After calling patchAR, The properties should be changed autolly.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 1.3, 1.34326),
        centerMode: 'geocentric',
        withAR: false,
      });

      let theta0 = hc.sc.theta;

      hc.patchAR();

      expect(theta0).not.to.equal(hc.sc.theta);

      expect(hc.withAR).to.equal(true);
    });
  });

  describe('#unpatchAR', () => {
    it('Running with no error.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        centerMode: 'geocentric',
        withAR: true,
      });

      expect(() => {
        hc.unpatchAR();
      }).not.to.throw();
    });

    it('After calling unpatchAR, The properties should be changed autolly.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 1.2, 1.34326),
        centerMode: 'geocentric',
        withAR: true,
      });

      let theta0 = hc.sc.theta;

      hc.unpatchAR();

      expect(theta0).not.to.equal(hc.sc.theta);

      expect(hc.withAR).to.equal(false);
    });
  });

  describe('#to', () => {
    it('The param system should be a String.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(() => {
        hc.to(1232);
      }).to.throw();
    })

    it('The param system should be horizontal、equinoctial、ecliptic or galactic.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(() => {
        hc.to('aacc');
      }).to.throw();

      expect(() => {
        hc.to('ecliptic');
      }).not.to.throw();
    })
  });

  describe('#toHourAngle', () => {
    it('Verify with verified module Equinoctial and 天文算法 例12.b', () => {
      let epoch = new JDateRepository(new Date('1987/04/11 03:21:00'), 'date');
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('23h 09m 16.641s').getDegrees(),
        dec: angle.parseDACString('-6°43′11.61″').getDegrees(),
        epoch: epoch,
        withNutation: true,
      });

      let eqc2hac = eqc.toHourAngle({
        obGeoLong: angle.parseDACString('77°03′56″').getDegrees(),
      });

      let hc = new HorizontalCoordinate({
        obTime: epoch,
        obGeoLong: angle.parseDACString('77°03′56″').getDegrees(),
        obGeoLat: angle.parseDACString('38°55′17″').getDegrees(),
        a: 68.0337,
        h: 15.1249,
      });

      let hc2hac = hc.toHourAngle();

      expect(angle.setRadian(eqc2hac.sc.phi).getDegrees()).to.closeTo(angle.setRadian(hc2hac.sc.phi).getDegrees(), 0.0002);
      expect(angle.setRadian(eqc2hac.sc.theta).getDegrees()).to.closeTo(angle.setRadian(hc2hac.sc.theta).getDegrees(), 0.0001);
    });

    it('The return should be a right structure.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      let hac_obj = hc.toHourAngle({
        obTime: new JDateRepository(new Date, 'date'),
        obGeoLong: 123,
      });

      expect(hac_obj).to.have.all.keys('sc', 'obTime', 'obGeoLong');
    });
  });

  describe('#toEquinoctial', () => {
    it('The return should be a right structure.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      let eqc_obj = hc.toEquinoctial();

      expect(eqc_obj).to.have.all.keys('sc', 'epoch', 'withNutation', 'withAnnualAberration', 'withGravitationalDeflection', 'onFK5');
    });

    it('Verify 天文算法 例12.b', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(new Date('1987/04/11 03:21:00'), 'date'),
        obGeoLong: angle.parseDACString('77°03′56″').getDegrees(),
        obGeoLat: angle.parseDACString('38°55′17″').getDegrees(),
        a: 68.0337,
        h: 15.1249,
      });

      let eqc_obj = hc.toEquinoctial();

      expect(angle.setRadian(eqc_obj.sc.phi).getDegrees()).to.closeTo(angle.parseHACString('23h 09m 16.641s').getDegrees(), 0.0002);
      expect(angle.setRadian(eqc_obj.sc.theta).getDegrees()).to.closeTo(90 - angle.parseDACString('-6°43′11.61″').getDegrees(), 0.0001);
    });
  });

  describe('#toEcliptic', () => {
    it('The return should be a right structure.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      let ecc_obj = hc.toEcliptic();

      expect(ecc_obj).to.have.all.keys('sc', 'epoch', 'withNutation', 'withAnnualAberration', 'withGravitationalDeflection', 'onFK5', 'centerMode');
    });

    it('Verify with verified module Equinoctial and 天文算法 例12.b', () => {
      let epoch = new JDateRepository(new Date('1987/04/11 03:21:00'), 'date');
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('23h 09m 16.641s').getDegrees(),
        dec: angle.parseDACString('-6°43′11.61″').getDegrees(),
        epoch: epoch,
        withNutation: true,
      });

      let eqc2ecc = eqc.toEcliptic();

      let hc = new HorizontalCoordinate({
        obTime: epoch,
        obGeoLong: angle.parseDACString('77°03′56″').getDegrees(),
        obGeoLat: angle.parseDACString('38°55′17″').getDegrees(),
        a: 68.0337,
        h: 15.1249,
      });

      let hc2ecc = hc.toEcliptic();

      expect(angle.setRadian(eqc2ecc.sc.phi).getDegrees()).to.closeTo(angle.setRadian(hc2ecc.sc.phi).getDegrees(), 0.0001);
      expect(angle.setRadian(eqc2ecc.sc.theta).getDegrees()).to.closeTo(angle.setRadian(hc2ecc.sc.theta).getDegrees(), 0.0001);
    });
  });

  describe('#toGalactic', () => {
    it('The return should be a right structure.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      let gc_obj = hc.toGalactic();

      expect(gc_obj).to.have.all.keys('sc', 'epoch');
    });

    it('Verify with verified module Equinoctial and 天文算法 例12.b', () => {
      let epoch = new JDateRepository(new Date('1987/04/11 03:21:00'), 'date');
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('23h 09m 16.641s').getDegrees(),
        dec: angle.parseDACString('-6°43′11.61″').getDegrees(),
        epoch: epoch,
        withNutation: true,
      });

      let eqc2gc = eqc.toGalactic();

      let hc = new HorizontalCoordinate({
        obTime: epoch,
        obGeoLong: angle.parseDACString('77°03′56″').getDegrees(),
        obGeoLat: angle.parseDACString('38°55′17″').getDegrees(),
        a: 68.0337,
        h: 15.1249,
      });

      let hc2gc = hc.toGalactic();

      expect(angle.setRadian(eqc2gc.sc.phi).getDegrees()).to.closeTo(angle.setRadian(hc2gc.sc.phi).getDegrees(), 0.0002);
      expect(angle.setRadian(eqc2gc.sc.theta).getDegrees()).to.closeTo(angle.setRadian(hc2gc.sc.theta).getDegrees(), 0.0001);
    });
  });

  describe('#get obTime', () => {
    it('The return should be a JDateRepository.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hc.obTime).to.be.instanceof(JDateRepository);
    });
  });

  describe('#get obGeoLong', () => {
    it('The return should be obGeoLong Angle.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hc.obGeoLong).to.be.instanceof(Angle);
    })
  });

  describe('#get obGeoLat', () => {
    it('The return should be obGeoLat Angle.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hc.obGeoLat).to.be.instanceof(Angle);
    })
  });

  describe('#get obElevation', () => {
    it('The return should be a Number.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        obElevation: 1224,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hc.obElevation).to.be.a('number');
    });
  });

  describe('#get withAR', () => {
    it('The return should be a boolean.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        obElevation: 1224,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hc.withAR).to.be.a('boolean');
    });
  });

  describe('#set withAR(value)', () => {
    it('After setting withAR, the properties should be changed.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 1.2, 1.34326),
        centerMode: 'geocentric',
        withAR: false,
      });

      let phi0 = hc.sc.phi,
          theta0 = hc.sc.theta,
          r0 = hc.sc.r;

      expect(() => {
        hc.withAR = true;
      }).not.to.throw();

      hc.withAR = true;

      expect(theta0).not.to.equal(hc.sc.theta);

      expect(hc.withAR).to.equal(true);
    });
  });

  describe('#get centerMode', () => {
    it('The return should be a right string.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        obElevation: 1224,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        centerMode: 'geocentric',
      });

      expect(hc.centerMode).to.equal('geocentric');
    });
  });

  describe('#set centerMode(value)', () => {
    it('The param value should be a right string.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        centerMode: 'geocentric',
        withAR: false,
      });

      expect(() => {
        hc.centerMode = 'topocentric';
        hc.centerMode = 'geocentric';
      }).not.to.throw();

      expect(() => {
        hc.centerMode = 'error';
      }).to.throw();
    });

    it('After setting centerMode, the properties should be changed.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        centerMode: 'geocentric',
        withAR: false,
      });

      let phi0 = hc.sc.phi,
          theta0 = hc.sc.theta,
          r0 = hc.sc.r;

      expect(() => {
        hc.centerMode = 'topocentric';
      }).not.to.throw();

      hc.centerMode = 'topocentric';

      expect(phi0).not.to.equal(hc.sc.phi);
      expect(theta0).not.to.equal(hc.sc.theta);
      expect(r0).not.to.equal(hc.sc.r);

      expect(hc.centerMode).to.equal('topocentric');
    });
  });

  describe('#get sc', () => {
    it('The return should be a SphericalCoordinate3D.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hc.sc).to.be.instanceof(SphericalCoordinate3D);
    });
  });

  describe('#get a', () => {
    it('The return should be a Angle.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hc.a).to.be.instanceof(Angle);
    })
  });

  describe('#get h', () => {
    it('The return should be a Angle.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hc.h).to.be.instanceof(Angle);
    })
  });

  describe('#get z', () => {
    it('The return should be a Angle.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hc.z).to.be.instanceof(Angle);
    })
  });

  describe('#get radius', () => {
    it('The return should be a Number.', () => {
      let hc = new HorizontalCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        obGeoLat: 30,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hc.radius).to.be.a('Number');
    })
  });
})