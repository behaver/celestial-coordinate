const expect = require("chai").expect;
const { JDateRepository } = require('@behaver/jdate');
const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const Angle = require('@behaver/angle');
const EclipticCoordinate = require('../src/EclipticCoordinate');
const { VenusHECC } = require('@behaver/solar-planets-hecc');

const angle = new Angle;

describe('#EclipticCoordinate', () => {
  describe('#constructor', () => {
    // 与 form 测试一致
  });

  describe('#from', () => {
    it('The param sc if existed should be a SphericalCoordinate3D.', () => {
      expect(() => {
        new EclipticCoordinate({
          sc: 'asdf'
        });
      }).to.throw();
      expect(() => {
        new EclipticCoordinate({
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326)
        });
      }).not.to.throw();
    });

    it('The param l should be a Number.', () => {
      expect(() => {
        new EclipticCoordinate({
          l: '232'
        })
      }).to.throw();
      expect(() => {
        new EclipticCoordinate({
          l: 123.2332
        });
      }).not.to.throw();
    });

    it('The param l should be in [0, 360).', () => {
      expect(() => {
        new EclipticCoordinate({
          l: -1
        })
      }).to.throw();

      expect(() => {
        new EclipticCoordinate({
          l: 360
        })
      }).to.throw();
    })

    it('The param b should be a Number.', () => {
      expect(() => {
        new EclipticCoordinate({
          l: 132.2332,
          b: '22'
        });
      }).to.throw();
      expect(() => {
        new EclipticCoordinate({
          l: 112.2323,
          b: 23.22
        });
      }).not.to.throw()
    });

    it('The param b should be in [-90, 90].', () => {
      expect(() => {
        new EclipticCoordinate({
          l: 23,
          b: - 90.232
        });
      }).to.throw();

      expect(() => {
        new EclipticCoordinate({
          l: 12.32,
          b: 90.23
        });
      }).to.throw();
    })

    it('The param radius should be a Number.', () => {
      expect(() => {
        new EclipticCoordinate({
          l: 122.3223,
          b: 23.223,
          radius: '233'
        });
      }).to.throw();
      expect(() => {
        new EclipticCoordinate({
          l: 122.3223,
          b: 23.223,
          radius: 1.09382
        });
      }).not.to.throw();
    })

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        new EclipticCoordinate({
          l: 122.3223,
          b: 23.223,
          radius: 0
        });
      }).to.throw();
    });

    it('The param epoch should be a JDateRepository', () => {
      expect(() => {
        new EclipticCoordinate({
          l: 122.3223,
          b: 23.223,
          epoch: '2231232'
        });
      }).to.throw();

      expect(() => {
        new EclipticCoordinate({
          l: 122.3223,
          b: 23.223,
          epoch: new JDateRepository(2000.0, 'jepoch')
        });
      }).not.to.throw();
    })

    it('The param precessionModel should be iau2006, iau2000 or iau1976.', () => {
      expect(() => {
        new EclipticCoordinate({
          l: 122.3223,
          precessionModel: 'iau',
        });
      }).to.throw();

      expect(() => {
        new EclipticCoordinate({
          l: 122.3223,
          precessionModel: 2006,
        })
      }).to.throw();

      expect(() => {
        new EclipticCoordinate({
          l: 122.3223,
          precessionModel: 'iau2006',
        })
        new EclipticCoordinate({
          l: 122.3223,
          precessionModel: 'IAU2006',
        })
      }).not.to.throw();
    })

    it('The param nutationModel should be iau2000b, lp.', () => {
      expect(() => {
        new EclipticCoordinate({
          l: 122.3223,
          nutationModel: 'iau',
        })
      }).to.throw();

      expect(() => {
        new EclipticCoordinate({
          l: 122.3223,
          nutationModel: 2006,
        })
      }).to.throw();

      expect(() => {
        new EclipticCoordinate({
          l: 122.3223,
          nutationModel: 'iau2000b',
        })
        new EclipticCoordinate({
          l: 122.3223,
          nutationModel: 'lp',
        })
      }).not.to.throw();
    })
  });

  describe('#on', () => {
    it('The param epoch should be a JDateRepository', () => {
      expect(() => {
        let ec  = new EclipticCoordinate({
          l: 122.3223,
        });

        ec.on({
          epoch: 2323232,
        });
      }).to.throw();
    });

    it('The param centerMode should be worked.', () => {
      expect(() => {
        let ec  = new EclipticCoordinate({
          l: 122.3223,
        });

        ec.on({
          epoch: new JDateRepository(1643074.5, 'jde'),
          centerMode: 'heliocentric',
        });
      }).not.to.throw();
    })

    it('Verify with Jean Meeus Astronomical algorithms 21.c', () => {
      let ec  = new EclipticCoordinate({
        l: 149.48194,
        b: 1.76549,
      });

      ec.on({
        epoch: new JDateRepository(1643074.5, 'jde'),
      });

      expect(ec.l.getDegrees()).to.closeTo(118.704, 0.001);
      expect(ec.b.getDegrees()).to.closeTo(1.615, 0.001);
    });

    it('Verify 天文算法 32.a', () => {
      let epoch = new JDateRepository(2448976.5, 'jde'),
          epoch2 = new JDateRepository(2448976.5 - 0.0052612, 'jde'),
          venus_hecc = new VenusHECC(epoch2, 'fine'),

          ec = new EclipticCoordinate({
            sc: venus_hecc.sc,
            epoch: epoch,
            centerMode: 'heliocentric',
            withNutation: false,
          });

          ec.earthHECC.accuracy = 'fine'

      ec.on({
        centerMode: 'geocentric',
      });

      expect(ec.l.getDegrees()).to.closeTo(313.08102, 0.0002);
      expect(ec.b.getDegrees()).to.closeTo(-2.08488, 0.00022);
      expect(ec.radius).to.closeTo(0.910947, 0.000002);

      ec.on({
        withNutation: true,
      });

      ec.position({
        l: ec.l.getDegrees() - 0.00413 - 0.00003,
        b: ec.b.getDegrees() - 0.00015 + 0.00001,
        radius: ec.radius,
      });

      expect(ec.l.getDegrees()).to.closeTo(313.08151, 0.0002);

      let eqc = ec.toEquinoctial().sc;

      expect(angle.setRadian(eqc.phi, 'r').getDegrees()).to.closeTo(angle.parseHACString('21h 04m 41.454s').getDegrees(), 0.00002);
      expect(angle.setRadian(Math.PI / 2 - eqc.theta, 'r').getDegrees()).to.closeTo(angle.parseDACString('-18°53′16.84″').getDegrees(), 0.0001);
      expect(eqc.r).to.closeTo(0.91084596, 0.0002);
    });
  });

  describe('#position', () => {
    it('The param sc if existed should be a SphericalCoordinate3D.', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332
        });

        ec.position({
          sc: 'asdf'
        })
      }).to.throw();

      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332
        });

        ec.position({
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326)
        })
      }).not.to.throw();
    });

    it('The param l should be a Number.', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332
        });

        ec.position({
          l: '232'
        })
      }).to.throw();

      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332
        });

        ec.position({
          l: 232
        })
      }).not.to.throw();
    });

    it('The param l should be in [0, 360).', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332
        });

        ec.position({
          l: -1
        })
      }).to.throw();

      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332
        });

        ec.position({
          l: 360
        })
      }).to.throw();
    })

    it('The param b should be a Number.', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332
        });

        ec.position({
          l: 112.2323,
          b: '23.22'
        })
      }).to.throw();

      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332
        });

        ec.position({
          l: 112.2323,
          b: 23.22
        })
      }).not.to.throw()
    });

    it('The param b should be in [-90, 90].', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332
        });

        ec.position({
          l: 112.2323,
          b: -90.232
        })
      }).to.throw();

      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332
        });

        ec.position({
          l: 112.2323,
          b: 90.232
        })
      }).to.throw();
    })

    it('The param radius should be a Number.', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332
        });

        ec.position({
          l: 112.2323,
          b: 23.22,
          radius: '1.09382',
        })
      }).to.throw();

      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332
        });

        ec.position({
          l: 112.2323,
          b: 23.22,
          radius: 1.09382,
        })
      }).not.to.throw();
    })

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332
        });

        ec.position({
          l: 112.2323,
          b: 23.22,
          radius: 0,
        })
      }).to.throw();
    });

    it('The properties after using position should update.', () => {
      let ec = new EclipticCoordinate({
        l: 123.2332
      });

      ec.position({
        l: 112.2323,
        b: 23.22,
        radius: 1,
      })

      expect(ec.l.getDegrees()).to.equal(112.2323);
    });

    it('The param centerMode should be geocentric or heliocentric.', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332,
          centerMode: 'heliocentric',
        });
      }).not.to.throw();

      expect(() => {
        let ec = new EclipticCoordinate({
          l: 123.2332,
          centerMode: 'abc',
        });
      }).to.throw();
    });
  });

  describe('#get', () => {
    it('The param epoch should be a JDateRepository', () => {
      expect(() => {
        let ec  = new EclipticCoordinate({
          l: 122.3223,
        });

        ec.get({
          epoch: 2323232,
        });
      }).to.throw();
    });

    it('The param centerMode should not to throw', () => {
      expect(() => {
        let ec  = new EclipticCoordinate({
          l: 122.3223,
          enterMode: 'heliocentric',
        });

        ec.get({
          centerMode: 'geocentric',
        });
      }).not.to.throw();
    })

    it('This method wont change the origin condition property.', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
        epoch: new JDateRepository(2000.0, 'jepoch'),
        withNutation: false,
      });

      ec.get({
        epoch: new JDateRepository(new Date, 'date'),
        withNutation: true,
      });
      expect(ec.epoch.JEpoch).to.equal(2000);
      expect(ec.withNutation).to.equal(false);
    });

    it('The return should be a right structure.', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      let res = ec.get({
        epoch: new JDateRepository(new Date, 'date'),
        withNutation: true,
      });

      expect(res).to.have.all.key('sc', 'epoch', 'withNutation', 'centerMode', 'precessionModel', 'nutationModel');
    })
  });

  describe('#to', () => {
    it('The param system should be a String.', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        ec.to(1232);
      }).to.throw();
    })

    it('The param system should be horizontal、hourangle、equinoctial or galactic.', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        ec.to('aacc');
      }).to.throw();

      expect(() => {
        ec.to('equinoctial');
      }).not.to.throw();
    })
  });

  describe('#toHorizontal', () => {
    it('The param obTime should be a JDateRepository.', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        ec.toHorizontal({
          obTime: 2232123,
          obGeoLong: 123,
          obGeoLat: 23,
        })
      }).to.throw();

      expect(() => {
        ec.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 123,
          obGeoLat: 23,
        })
      }).not.to.throw();
    });

    it('The param obGeoLong should be a Number.', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        ec.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: '123',
          obGeoLat: 23,
        })
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180]', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        ec.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 180.1,
          obGeoLat: 23,
        })
      }).to.throw();

      expect(() => {
        ec.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: -180.1,
          obGeoLat: 23,
        })
      }).to.throw();

      expect(() => {
        ec.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 0,
          obGeoLat: 23,
        })
      }).not.to.throw();
    })

    it('The param  should be a Number.', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        ec.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 123,
          obGeoLat: '23',
        })
      }).to.throw();
    })

    it('The param  should be in [-90, 90].', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        ec.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 123,
          obGeoLat: 90.1,
        })
      }).to.throw();

      expect(() => {
        ec.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 123,
          obGeoLat: -90.1,
        })
      }).to.throw();
    })

    it('The return should a right structure.', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      let hc_obj = ec.toHorizontal({
        obTime: new JDateRepository(new Date, 'date'),
        obGeoLong: 123,
        obGeoLat: 30.32,
      });

      expect(hc_obj).to.have.all.keys('sc', 'obTime', 'obGeoLong', 'obGeoLat', 'precessionModel', 'nutationModel');
    })
  });

  describe('#toHourAngle', () => {
    it('The param obTime should be a JDateRepository.', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        ec.toHourAngle({
          obTime: 2232123,
          obGeoLong: 123,
        })
      }).to.throw();

      expect(() => {
        ec.toHourAngle({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 123,
        })
      }).not.to.throw();
    });

    it('The param obGeoLong should be a Number.', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        ec.toHourAngle({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: '123',
        })
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180]', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        ec.toHourAngle({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 180.1,
        })
      }).to.throw();

      expect(() => {
        ec.toHourAngle({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: -180.1,
        })
      }).to.throw();
    });

    it('The return should a right structure.', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      let hc_obj = ec.toHourAngle({
        obTime: new JDateRepository(new Date, 'date'),
        obGeoLong: 123,
      });

      expect(hc_obj).to.have.all.keys('sc', 'obTime', 'obGeoLong', 'precessionModel', 'nutationModel');
    })
  });

  describe('#toEquinoctial', () => {
    it('The return should a right structure.', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      let eqc_obj = ec.toEquinoctial();

      expect(eqc_obj).to.have.all.keys('sc', 'epoch', 'withNutation', 'precessionModel', 'nutationModel');
    })

    it('Verify 天文算法 例12.a', () => {
      let ecc = new EclipticCoordinate({
        l: 113.215630,
        b: 6.684170,
      });

      let eqc = ecc.toEquinoctial();
      expect(angle.setRadian(eqc.sc.phi).getDegrees()).to.closeTo(116.328942, 0.00001);
      expect(angle.setRadian(eqc.sc.theta).getDegrees()).to.closeTo(90 - 28.026183, 0.0001);
    });
  });

  describe('#toGalactic', () => {
    it('The return should a right structure.', () => {
      let ec = new EclipticCoordinate({
        l: 122.3223,
      });

      let gc_obj = ec.toGalactic();

      expect(gc_obj).to.have.all.keys('sc', 'epoch', 'precessionModel', 'nutationModel');
    })
  })

  describe('#onJ2000', () => {
    it('The property epoch after onJ2000 should equal J2000.', () => {
      let ecc = new EclipticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
        epoch: new JDateRepository(1950.0, 'bepoch'),
      });

      ecc.onJ2000();

      expect(ecc.epoch.JEpoch).to.equal(2000.0);
    });
  });

  describe('#onEpoch', () => {
    it('The param epoch should be a JDateRepository.', () => {
      expect(() => {
        let ecc = new EclipticCoordinate({
          l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
          b: angle.parseDACString('-14°43′08.2″').getDegrees(),
        });
        
        ecc.onEpoch(2322232);
      }).to.throw();
    });

    it('The property epoch after onEpoch should equal the epoch setted.', () => {
      let eqc = new EclipticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });
      
      let epoch = new JDateRepository(1950.0, 'bepoch');

      eqc.onEpoch(epoch);

      expect(eqc.epoch.BEpoch).to.closeTo(1950, 0.0000000001);
    })

    it('verify.', () => {
      let ec  = new EclipticCoordinate({
        l: 149.48194,
        b: 1.76549,
      });

      ec.onEpoch(new JDateRepository(1643074.5, 'jde'));

      expect(ec.l.getDegrees()).to.closeTo(118.704, 0.001);
      expect(ec.b.getDegrees()).to.closeTo(1.615, 0.001);
    })
  });

  describe('#nutationPatch', () => {
    it('The property withNutation after nutationPatch should be true.', () => {
      let ecc = new EclipticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      ecc.nutationPatch();

      expect(ecc.withNutation).to.equal(true);
    });
  });

  describe('#nutationUnpatch', () => {
    it('The property withNutation after nutationUnpatch should be false.', () => {
      let ecc = new EclipticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      ecc.nutationUnpatch();

      expect(ecc.withNutation).to.equal(false);
    });
  });

  describe('#onGeocentric', () => {
    it('The properties after onGeocentric should be changed.', () => {
      let ec  = new EclipticCoordinate({
        l: 149.48194,
        b: 1.76549,
        centerMode: 'heliocentric',
      });

      ec.onGeocentric();

      expect(ec.centerMode).to.equal('geocentric');
      expect(ec.l.getDegrees()).not.to.equal(149.48194);
      expect(ec.b.getDegrees()).not.to.equal(1.76549);
    });
  });

  describe('#onHeliocentric', () => {
    it('The properties after onHeliocentric should be changed.', () => {
      let ec  = new EclipticCoordinate({
        l: 149.48194,
        b: 1.76549,
        centerMode: 'geocentric',
      });

      ec.onHeliocentric();

      expect(ec.centerMode).to.equal('heliocentric');
      expect(ec.l.getDegrees()).not.to.equal(149.48194);
      expect(ec.b.getDegrees()).not.to.equal(1.76549);
    });
  });

  describe('#get sc', () => {
    it('The return should be a SphericalCoordinate3D.', () => {
      let ecc = new EclipticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(ecc.sc).to.be.instanceof(SphericalCoordinate3D);
    });
  });

  describe('#get l', () => {
    it('The return should be a Angle.', () => {
      let ecc = new EclipticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(ecc.l).to.be.instanceof(Angle);
    })
  });

  describe('#get b', () => {
    it('The return should be a Angle.', () => {
      let ecc = new EclipticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(ecc.b).to.be.instanceof(Angle);
    })
  });

  describe('#get radius', () => {
    it('The return should be a Number.', () => {
      let ecc = new EclipticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(ecc.radius).to.be.a('Number');
    })
  });

  describe('#get epoch', () => {
    it('The return should be a JDateRepository.', () => {
      let ecc = new EclipticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(ecc.epoch).to.be.instanceof(JDateRepository);
    });
  });

  describe('#get withNutation', () => {
    it('The return should be a Boolean.', () => {
      let ecc = new EclipticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(ecc.withNutation).to.be.a('Boolean');
    });
  });

  describe('#get precessionModel', () => {

  });

  describe('#get nutationModel', () => {

  });
});