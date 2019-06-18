const expect = require("chai").expect;
const { JDateRepository } = require('@behaver/jdate');
const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const Angle = require('@behaver/angle');
const HourAngleCoordinate = require('../src/HourAngleCoordinate');

const angle = new Angle;

describe('#HourAngleCoordinate', () => {
  describe('#constructor', () => {
    // 与 form 测试一致
  });

  describe('#from', () => {
    it('The param epoch should exist and be a JDateRepository.', () => {
      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).not.to.throw();

      expect(() => {
        new HourAngleCoordinate({
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).to.throw();

      expect(() => {
        new HourAngleCoordinate({
          epoch: 112233,
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).to.throw();
    });

    it('The param obGeoLong should exist and be a Number.', () => {
      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).to.throw();

      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: '120',
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180].', () => {
      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: -181,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        })
      }).to.throw();

      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 181,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        })
      }).to.throw();
    });

    it('The param sc if existed should be a SphericalCoordinate3D.', () => {
      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: 'asdf',
        });
      }).to.throw();

      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).not.to.throw();
    });

    it('The param longitude if existed should be a Number.', () => {
      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120,
        });
      }).not.to.throw();

      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: '120',
        });
      }).to.throw();
    });

    it('The param latitude if existed should be a Number.', () => {
      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120,
          latitude: 60,
        });
      }).not.to.throw();
      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120,
          latitude: '60',
        });
      }).to.throw();
    });

    it('The param radius if existed should be a Number.', () => {
      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120,
          latitude: 60,
          radius: 1.23,
        });
      }).not.to.throw();
      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120,
          latitude: 60,
          radius: '1.23',
        });
      }).to.throw();
    });

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120,
          latitude: 60,
          radius: 0,
        });
      }).to.throw();
    });
  })

  describe('#on', () => {
    it('The param epoch should be a JDateRepository.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          epoch: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: -120,
        });
      }).not.to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          epoch: 2462088.69,
        });
      }).to.throw();
    });

    it('The param obGeoLong should be a Number.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          epoch: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: '120',
        });
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180].', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obGeoLong: -181,
        });
      }).to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obGeoLong: 181,
        });
      }).to.throw();
    });
  });

  describe('#position', () => {
    it('The param sc if existed should be a SphericalCoordinate3D.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 123,
        });

        hc.position({
          sc: 'sdfa',
        });
      }).to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120.123,
        });

        hc.position({
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).not.to.throw();
    });

    it('The param longitude if existed should be a Number.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120,
        });

        hc.position({
          longitude: 210
        })
      }).not.to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120,
        });

        hc.position({
          longitude: '210'
        })
      }).to.throw();
    });

    it('The param latitude if existed should be a Number.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120,
        });

        hc.position({
          longitude: 210,
          latitude: 30,
        })
      }).not.to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120,
        });

        hc.position({
          longitude: 210,
          latitude: '30',
        })
      }).to.throw();
    });

    it('The param radius if existed should be a Number.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120,
        });

        hc.position({
          longitude: 210,
          latitude: 30,
          radius: 1.23,
        })
      }).not.to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120,
        });

        hc.position({
          longitude: 210,
          latitude: 30,
          radius: '1.23',
        })
      }).to.throw();
    });

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          longitude: 120,
        });

        hc.position({
          longitude: 210,
          radius: 0,
        })
      }).to.throw();
    });

    it('The property after using position should update.', () => {
      let hc = new HourAngleCoordinate({
        epoch: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        longitude: 120,
      });

      hc.position({
        longitude: 210,
        radius: 1,
      })

      expect(hc.longitude.getDegrees()).to.equal(210);
      expect(hc.obGeoLong.getDegrees()).to.equal(120);
    });
  })

  describe('#get', () => {
    it('The param epoch should be a JDateRepository.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          epoch: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: -120,
        });
      }).not.to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          epoch: 2462088.69,
        });
      }).to.throw();
    });

    it('The param obGeoLong should be a Number.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          epoch: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: '120',
        });
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180].', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obGeoLong: -181,
        });
      }).to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          epoch: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obGeoLong: 181,
        });
      }).to.throw();
    });

    it('This method wont change the origin condition property.', () => {
      let hc = new HourAngleCoordinate({
        epoch: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      hc.get({
        epoch: new JDateRepository(2050.0, 'jepoch'),
        obGeoLong: -120,
      });

      expect(hc.epoch.JEpoch).to.equal(2000);
      expect(hc.obGeoLong.getDegrees()).to.equal(120);
    });

    it('The return should be a right structure.', () => {
      let hc = new HourAngleCoordinate({
        epoch: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      let res = hc.get({
        epoch: new JDateRepository(2050.0, 'jepoch'),
        obGeoLong: -120,
      });

      expect(res).to.have.all.key('sc', 'epoch', 'obGeoLong');
    })
  });

  describe('#get epoch', () => {
    it('The return should be a JDateRepository.', () => {
      let hac = new HourAngleCoordinate({
        epoch: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hac.epoch).to.be.instanceof(JDateRepository);
    });
  });

  describe('#get obGeoLong', () => {
    it('The return should be obGeoLong Angle.', () => {
      let hac = new HourAngleCoordinate({
        epoch: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hac.obGeoLong).to.be.instanceof(Angle);
    })
  });

  describe('#get sc', () => {
    it('The return should be a SphericalCoordinate3D.', () => {
      let hac = new HourAngleCoordinate({
        epoch: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hac.sc).to.be.instanceof(SphericalCoordinate3D);
    });
  });

  describe('#get longitude', () => {
    it('The return should be a Angle.', () => {
      let hac = new HourAngleCoordinate({
        epoch: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hac.longitude).to.be.instanceof(Angle);
    })
  });

  describe('#get latitude', () => {
    it('The return should be a Angle.', () => {
      let hac = new HourAngleCoordinate({
        epoch: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hac.latitude).to.be.instanceof(Angle);
    })
  });

  describe('#get radius', () => {
    it('The return should be a Number.', () => {
      let hac = new HourAngleCoordinate({
        epoch: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hac.radius).to.be.a('Number');
    })
  });
})