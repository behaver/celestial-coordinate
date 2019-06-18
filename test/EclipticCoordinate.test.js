const expect = require("chai").expect;
const { JDateRepository } = require('@behaver/jdate');
const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const Angle = require('@behaver/angle');
const EclipticCoordinate = require('../src/EclipticCoordinate');
const SystemSwitcher = require('../src/SystemSwitcher');
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

    it('The param longitude should be a Number.', () => {
      expect(() => {
        new EclipticCoordinate({
          longitude: '232'
        })
      }).to.throw();
      expect(() => {
        new EclipticCoordinate({
          longitude: 123.2332
        });
      }).not.to.throw();
    });

    it('The param latitude should be a Number.', () => {
      expect(() => {
        new EclipticCoordinate({
          longitude: 132.2332,
          latitude: '22'
        });
      }).to.throw();
      expect(() => {
        new EclipticCoordinate({
          longitude: 112.2323,
          latitude: 23.22
        });
      }).not.to.throw()
    });

    it('The param radius should be a Number.', () => {
      expect(() => {
        new EclipticCoordinate({
          longitude: 122.3223,
          latitude: 23.223,
          radius: '233'
        });
      }).to.throw();
      expect(() => {
        new EclipticCoordinate({
          longitude: 122.3223,
          latitude: 23.223,
          radius: 1.09382
        });
      }).not.to.throw();
    })

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        new EclipticCoordinate({
          longitude: 122.3223,
          latitude: 23.223,
          radius: 0
        });
      }).to.throw();
    });

    it('The param epoch should be a JDateRepository', () => {
      expect(() => {
        new EclipticCoordinate({
          longitude: 122.3223,
          latitude: 23.223,
          epoch: '2231232'
        });
      }).to.throw();

      expect(() => {
        new EclipticCoordinate({
          longitude: 122.3223,
          latitude: 23.223,
          epoch: new JDateRepository(2000.0, 'jepoch')
        });
      }).not.to.throw();
    })

    it('The param centerMode should be geocentric or heliocentric.', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          longitude: 123.2332,
          centerMode: 'heliocentric',
        });
      }).not.to.throw();

      expect(() => {
        let ec = new EclipticCoordinate({
          longitude: 123.2332,
          centerMode: 'abc',
        });
      }).to.throw();
    });
  });

  describe('#on', () => {
    it('The param epoch should be a JDateRepository', () => {
      expect(() => {
        let ec  = new EclipticCoordinate({
          longitude: 122.3223,
        });

        ec.on({
          epoch: 2323232,
        });
      }).to.throw();
    });

    it('The param centerMode should be worked.', () => {
      expect(() => {
        let ec  = new EclipticCoordinate({
          longitude: 122.3223,
        });

        ec.on({
          epoch: new JDateRepository(1643074.5, 'jde'),
          centerMode: 'heliocentric',
        });
      }).not.to.throw();
    })

    it('When absent coordinate terms, run normally.', () => {
      let ec  = new EclipticCoordinate({
        longitude: 122.3223,
      });

      expect(() => {
        ec.on({
          onFK5: true,
          withGravitationalDeflection: true,
          withAnnualAberration: true,
        });
      }).not.to.throw();
    })

    it('Verify with Jean Meeus Astronomical algorithms 21.c', () => {
      let ec  = new EclipticCoordinate({
        longitude: 149.48194,
        latitude: 1.76549,
      });

      ec.on({
        epoch: new JDateRepository(1643074.5, 'jde'),
      });

      expect(ec.longitude.getDegrees()).to.closeTo(118.704, 0.001);
      expect(ec.latitude.getDegrees()).to.closeTo(1.615, 0.001);
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

      expect(ec.longitude.getDegrees()).to.closeTo(313.08102, 0.0002);
      expect(ec.latitude.getDegrees()).to.closeTo(-2.08488, 0.00022);
      expect(ec.radius).to.closeTo(0.910947, 0.000002);

      ec.on({
        withNutation: true,
      });

      ec.position({
        longitude: ec.longitude.getDegrees() - 0.00413 - 0.00003,
        latitude: ec.latitude.getDegrees() - 0.00015 + 0.00001,
        radius: ec.radius,
      });

      expect(ec.longitude.getDegrees()).to.closeTo(313.08151, 0.0002);

      let SS = new SystemSwitcher;

      let eqc = SS.from(ec).to('eqc').sc;

      expect(angle.setRadian(eqc.phi, 'r').getDegrees()).to.closeTo(angle.parseHACString('21h 04m 41.454s').getDegrees(), 0.00002);
      expect(angle.setRadian(Math.PI / 2 - eqc.theta, 'r').getDegrees()).to.closeTo(angle.parseDACString('-18°53′16.84″').getDegrees(), 0.0001);
      expect(eqc.r).to.closeTo(0.91084596, 0.0002);
    });
  });

  describe('#position', () => {
    it('The param sc if existed should be a SphericalCoordinate3D.', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          longitude: 123.2332
        });

        ec.position({
          sc: 'asdf'
        })
      }).to.throw();

      expect(() => {
        let ec = new EclipticCoordinate({
          longitude: 123.2332
        });

        ec.position({
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326)
        })
      }).not.to.throw();
    });

    it('The param longitude should be a Number.', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          longitude: 123.2332
        });

        ec.position({
          longitude: '232'
        })
      }).to.throw();

      expect(() => {
        let ec = new EclipticCoordinate({
          longitude: 123.2332
        });

        ec.position({
          longitude: 232
        })
      }).not.to.throw();
    });

    it('The param latitude should be a Number.', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          longitude: 123.2332
        });

        ec.position({
          longitude: 112.2323,
          latitude: '23.22'
        })
      }).to.throw();

      expect(() => {
        let ec = new EclipticCoordinate({
          longitude: 123.2332
        });

        ec.position({
          longitude: 112.2323,
          latitude: 23.22
        })
      }).not.to.throw()
    });

    it('The param radius should be a Number.', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          longitude: 123.2332
        });

        ec.position({
          longitude: 112.2323,
          latitude: 23.22,
          radius: '1.09382',
        })
      }).to.throw();

      expect(() => {
        let ec = new EclipticCoordinate({
          longitude: 123.2332
        });

        ec.position({
          longitude: 112.2323,
          latitude: 23.22,
          radius: 1.09382,
        })
      }).not.to.throw();
    })

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        let ec = new EclipticCoordinate({
          longitude: 123.2332
        });

        ec.position({
          longitude: 112.2323,
          latitude: 23.22,
          radius: 0,
        })
      }).to.throw();
    });

    it('The properties after using position should update.', () => {
      let ec = new EclipticCoordinate({
        longitude: 123.2332
      });

      ec.position({
        longitude: 112.2323,
        latitude: 23.22,
        radius: 1,
      })

      expect(ec.longitude.getDegrees()).to.equal(112.2323);
    });

    it('set methods.', () => {
      let ec = new EclipticCoordinate({
        longitude: 123.2332
      });

      ec.longitude = 90;
      ec.latitude = 30;
      ec.radius = 2;

      expect(ec.longitude.getDegrees()).to.equal(90);
      expect(ec.latitude.getDegrees()).to.closeTo(30, 1e-10);
      expect(ec.radius).to.equal(2);
    });
  });

  describe('#get', () => {
    it('The param epoch should be a JDateRepository', () => {
      expect(() => {
        let ec  = new EclipticCoordinate({
          longitude: 122.3223,
        });

        ec.get({
          epoch: 2323232,
        });
      }).to.throw();
    });

    it('The param centerMode should not to throw', () => {
      expect(() => {
        let ec  = new EclipticCoordinate({
          longitude: 122.3223,
          enterMode: 'heliocentric',
        });

        ec.get({
          centerMode: 'geocentric',
        });
      }).not.to.throw();
    })

    it('This method wont change the origin condition property.', () => {
      let ec = new EclipticCoordinate({
        longitude: 122.3223,
        epoch: new JDateRepository(2000.0, 'jepoch'),
        withNutation: false,
        onFK5: false,
        withAnnualAberration: true,
        withGravitationalDeflection: true,
      });

      ec.get({
        epoch: new JDateRepository(new Date, 'date'),
        withNutation: true,
        onFK5: true,
        withAnnualAberration: false,
        withGravitationalDeflection: false,
      });

      expect(ec.epoch.JEpoch).to.equal(2000);
      expect(ec.withNutation).to.equal(false);
      expect(ec.onFK5).to.equal(false);
      expect(ec.withAnnualAberration).to.equal(true);
      expect(ec.withGravitationalDeflection).to.equal(true);
    });

    it('The return should be a right structure.', () => {
      let ec = new EclipticCoordinate({
        longitude: 122.3223,
      });

      let res = ec.get({
        epoch: new JDateRepository(new Date, 'date'),
        withNutation: true,
        onFK5: true,
        withAnnualAberration: true,
        withGravitationalDeflection: true,
        centerMode: 'heliocentric',
      });

      expect(res).to.have.all.key(
        'sc', 
        'epoch', 
        'centerMode', 
        'enableNutation',
        'withNutation', 
        'enableFK5',
        'onFK5', 
        'enableAnnualAberration',
        'withAnnualAberration', 
        'enableGravitationalDeflection',
        'withGravitationalDeflection',
      );
    
      expect(res.withNutation).to.equal(true);
      expect(res.onFK5).to.equal(true);
      expect(res.withAnnualAberration).to.equal(true);
      expect(res.withGravitationalDeflection).to.equal(true);
      expect(res.centerMode).to.equal('heliocentric');
    })
  });

  describe('#onJ2000', () => {
    it('The property epoch after onJ2000 should equal J2000.', () => {
      let ecc = new EclipticCoordinate({
        longitude: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        latitude: angle.parseDACString('-14°43′08.2″').getDegrees(),
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
          longitude: angle.parseHACString('17h 48m 59.74s').getDegrees(),
          latitude: angle.parseDACString('-14°43′08.2″').getDegrees(),
        });
        
        ecc.onEpoch(2322232);
      }).to.throw();
    });

    it('The property epoch after onEpoch should equal the epoch setted.', () => {
      let eqc = new EclipticCoordinate({
        longitude: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        latitude: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });
      
      let epoch = new JDateRepository(1950.0, 'bepoch');

      eqc.onEpoch(epoch);

      expect(eqc.epoch.BEpoch).to.closeTo(1950, 0.0000000001);
    })

    it('verify.', () => {
      let ec  = new EclipticCoordinate({
        longitude: 149.48194,
        latitude: 1.76549,
      });

      ec.onEpoch(new JDateRepository(1643074.5, 'jde'));

      expect(ec.longitude.getDegrees()).to.closeTo(118.704, 0.001);
      expect(ec.latitude.getDegrees()).to.closeTo(1.615, 0.001);
    })
  });

  describe('#patchNutation', () => {
    it('The property withNutation after patchNutation should be true.', () => {
      let ecc = new EclipticCoordinate({
        longitude: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        latitude: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      ecc.enableNutation = true;
      ecc.patchNutation();

      expect(ecc.withNutation).to.equal(true);
    });
  });

  describe('#unpatchNutation', () => {
    it('The property withNutation after unpatchNutation should be false.', () => {
      let ecc = new EclipticCoordinate({
        longitude: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        latitude: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      ecc.unpatchNutation();

      expect(ecc.withNutation).to.equal(false);
    });
  });

  describe('#onGeocentric', () => {
    it('The properties after onGeocentric should be changed.', () => {
      let ec  = new EclipticCoordinate({
        longitude: 149.48194,
        latitude: 1.76549,
        centerMode: 'heliocentric',
      });

      ec.onGeocentric();

      expect(ec.centerMode).to.equal('geocentric');
      expect(ec.longitude.getDegrees()).not.to.equal(149.48194);
      expect(ec.latitude.getDegrees()).not.to.equal(1.76549);
    });
  });

  describe('#onHeliocentric', () => {
    it('The properties after onHeliocentric should be changed.', () => {
      let ec  = new EclipticCoordinate({
        longitude: 149.48194,
        latitude: 1.76549,
        centerMode: 'geocentric',
      });

      ec.onHeliocentric();

      expect(ec.centerMode).to.equal('heliocentric');
      expect(ec.longitude.getDegrees()).not.to.equal(149.48194);
      expect(ec.latitude.getDegrees()).not.to.equal(1.76549);
    });
  });

  describe('#get sc', () => {
    it('The return should be a SphericalCoordinate3D.', () => {
      let ecc = new EclipticCoordinate({
        longitude: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        latitude: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(ecc.sc).to.be.instanceof(SphericalCoordinate3D);
    });
  });

  describe('#get longitude', () => {
    it('The return should be a Angle.', () => {
      let ecc = new EclipticCoordinate({
        longitude: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        latitude: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(ecc.longitude).to.be.instanceof(Angle);
    })
  });

  describe('#get latitude', () => {
    it('The return should be a Angle.', () => {
      let ecc = new EclipticCoordinate({
        longitude: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        latitude: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(ecc.latitude).to.be.instanceof(Angle);
    })
  });

  describe('#get radius', () => {
    it('The return should be a Number.', () => {
      let ecc = new EclipticCoordinate({
        longitude: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        latitude: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(ecc.radius).to.be.a('Number');
    })
  });

  describe('#get epoch', () => {
    it('The return should be a JDateRepository.', () => {
      let ecc = new EclipticCoordinate({
        longitude: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        latitude: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(ecc.epoch).to.be.instanceof(JDateRepository);
    });
  });

  describe('#set epoch', () => {
    it('Run normally, throw no error.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 123.45,
        latitude: 34.567,
        radius: 2.34,
      });

      expect(() => {
        ecc.epoch = new JDateRepository(12, 'J2000');
      }).not.to.throw();
    });

    it('After set epoch, the properties should be changed.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 123.34,
        latitude: 22.34,
        radius: 1.23,
      });

      let epoch0 = ecc.epoch,
          phi0 = ecc.sc.phi,
          theta0 = ecc.sc.theta,
          r0 = ecc.sc.r;

      ecc.epoch = new JDateRepository(12, 'J2000');

      expect(epoch0.JD).not.to.equal(ecc.epoch.JD);
      expect(phi0).not.to.equal(ecc.sc.phi);
      expect(theta0).not.to.equal(ecc.sc.theta);
      // expect(r0).not.to.equal(ecc.sc.r);
    });
  });

  describe('#get withNutation', () => {
    it('The return should be a Boolean.', () => {
      let ecc = new EclipticCoordinate({
        longitude: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        latitude: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(ecc.withNutation).to.be.a('Boolean');
    });
  });

  describe('#set withNutation', () => {
    it('Run normally, throw no error.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.22,
        latitude: 56.2,
        radius: 2.012,
      });

      expect(() => {
        ecc.withNutation = true;
        ecc.withNutation = false;
      }).not.to.throw();
    });

    it('After set withNutation, the property sc should be changed.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 123.32,
        latitude: 33.233,
        radius: 1.4332,
        withNutation: false,
      });

      let phi0 = ecc.sc.phi;

      ecc.withNutation = true;

      expect(ecc.sc.phi).not.to.equal(phi0);
    });
  });

  describe('#set onFK5(value)', () => {
    it('Run normally, no error throw.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382
      });
      expect(() => {
        ecc.onFK5 = true;
        ecc.onFK5 = false;
      }).not.to.throw();
    });

    it('After setting onFK5, the property sc should be change.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382,
        onFK5: false,
      });

      let phi0 = ecc.sc.phi,
          theta0 = ecc.sc.theta,
          r0 = ecc.sc.r;

      ecc.onFK5 = true;

      let phi1 = ecc.sc.phi,
          theta1 = ecc.sc.theta,
          r1 = ecc.sc.r;

      expect(phi0).not.to.equal(phi1);
      expect(theta0).not.to.equal(theta1);
      expect(r0).to.equal(r1);
    });
  });

  describe('#get onFK5()', () => {
    it('Get and set run normally.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382
      });

      expect(ecc.onFK5).to.equal(false);

      ecc.onFK5 = 1;

      expect(ecc.onFK5).to.equal(true);
    });
  });

  describe('#set withGravitationalDeflection(value)', () => {
    it('Run normally, no error throw.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382
      });

      expect(() => {
        ecc.withGravitationalDeflection = true;
        ecc.withGravitationalDeflection = false;
      }).not.to.throw();
    });

    it('After setting withGravitationalDeflection, the property sc should be change.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 2.09382,
        withGravitationalDeflection: false,
      });

      let phi0 = ecc.sc.phi,
          theta0 = ecc.sc.theta,
          r0 = ecc.sc.r;

      ecc.withGravitationalDeflection = true;

      let phi1 = ecc.sc.phi,
          theta1 = ecc.sc.theta,
          r1 = ecc.sc.r;

      expect(phi0).not.to.equal(phi1);
      expect(theta0).not.to.equal(theta1);
      expect(r0).to.equal(r1);
    });
  });

  describe('#get withGravitationalDeflection()', () => {
    it('Get and set run normally.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382
      });

      expect(ecc.withGravitationalDeflection).to.equal(false);

      ecc.withGravitationalDeflection = 1;

      expect(ecc.withGravitationalDeflection).to.equal(true);
    });
  });

  describe('#set withAnnualAberration(value)', () => {
    it('Run normally, no error throw.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382
      });

      expect(() => {
        ecc.withAnnualAberration = true;
        ecc.withAnnualAberration = false;
      }).not.to.throw();
    });

    it('After setting withAnnualAberration, the property sc should be change.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 2.09382,
        withAnnualAberration: false,
      });

      let phi0 = ecc.sc.phi,
          theta0 = ecc.sc.theta,
          r0 = ecc.sc.r;

      ecc.withAnnualAberration = true;

      let phi1 = ecc.sc.phi,
          theta1 = ecc.sc.theta,
          r1 = ecc.sc.r;

      expect(phi0).not.to.equal(phi1);
      expect(theta0).not.to.equal(theta1);
      expect(r0).to.equal(r1);
    });
  });

  describe('#get withAnnualAberration()', () => {
    it('Get and set run normally.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382
      });

      expect(ecc.withAnnualAberration).to.equal(false);

      ecc.withAnnualAberration = 1;

      expect(ecc.withAnnualAberration).to.equal(true);
    });
  });

  describe('#patchFK5(), unpatchFK5()', () => {
    it('Run normally, no error throw.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382
      });

      expect(() => {
        ecc.patchFK5();
      }).not.to.throw();

      expect(() => {
        ecc.unpatchFK5();
      }).not.to.throw();
    });

    it('After patchFK5(), the property sc should be change.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382,
        onFK5: false,
      });

      let phi0 = ecc.sc.phi,
          theta0 = ecc.sc.theta,
          r0 = ecc.sc.r;

      expect(ecc.onFK5).to.equal(false);

      ecc.patchFK5();

      let phi1 = ecc.sc.phi,
          theta1 = ecc.sc.theta,
          r1 = ecc.sc.r;

      expect(phi0).not.to.equal(phi1);
      expect(theta0).not.to.equal(theta1);
      expect(r0).to.equal(r1);

      expect(ecc.onFK5).to.equal(true);

      ecc.unpatchFK5();

      expect(ecc.onFK5).to.equal(false);

      let phi2 = ecc.sc.phi,
          theta2 = ecc.sc.theta,
          r2 = ecc.sc.r;

      expect(phi2).not.to.equal(phi1);
      expect(theta2).not.to.equal(theta1);
      expect(r2).to.equal(r1);

      expect(phi2).to.equal(phi0);
      expect(theta2).to.equal(theta0);
    });
  });

  describe('#patchGravitationalDeflection(), unpatchGravitationalDeflection()', () => {
    it('Run normally, no error throw.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382
      });

      expect(() => {
        ecc.patchGravitationalDeflection();
      }).not.to.throw();

      expect(() => {
        ecc.unpatchGravitationalDeflection();
      }).not.to.throw();
    });

    it('After patchGravitationalDeflection(), the property sc should be change.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382,
        withGravitationalDeflection: false,
      });

      let phi0 = ecc.sc.phi,
          theta0 = ecc.sc.theta,
          r0 = ecc.sc.r;

      expect(ecc.withGravitationalDeflection).to.equal(false);

      ecc.patchGravitationalDeflection();

      let phi1 = ecc.sc.phi,
          theta1 = ecc.sc.theta,
          r1 = ecc.sc.r;

      expect(phi0).not.to.equal(phi1);
      expect(theta0).not.to.equal(theta1);
      expect(r0).to.equal(r1);

      expect(ecc.withGravitationalDeflection).to.equal(true);

      ecc.unpatchGravitationalDeflection();

      expect(ecc.withGravitationalDeflection).to.equal(false);

      let phi2 = ecc.sc.phi,
          theta2 = ecc.sc.theta,
          r2 = ecc.sc.r;

      expect(phi2).not.to.equal(phi1);
      expect(theta2).not.to.equal(theta1);
      expect(r2).to.equal(r1);

      expect(phi2).to.equal(phi0);
      expect(theta2).to.equal(theta0);
    });
  });

  describe('#patchAnnualAberration(), unpatchAnnualAberration()', () => {
    it('Run normally, no error throw.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382
      });

      expect(() => {
        ecc.patchAnnualAberration();
      }).not.to.throw();
      
      expect(() => {
        ecc.unpatchAnnualAberration();
      }).not.to.throw();
    });

    it('After patchAnnualAberration(), the property sc should be change.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382,
        withAnnualAberration: false,
      });

      let phi0 = ecc.sc.phi,
          theta0 = ecc.sc.theta,
          r0 = ecc.sc.r;

      expect(ecc.withAnnualAberration).to.equal(false);

      ecc.patchAnnualAberration();

      let phi1 = ecc.sc.phi,
          theta1 = ecc.sc.theta,
          r1 = ecc.sc.r;

      expect(phi0).not.to.equal(phi1);
      expect(theta0).not.to.equal(theta1);
      expect(r0).to.equal(r1);

      expect(ecc.withAnnualAberration).to.equal(true);

      ecc.unpatchAnnualAberration();

      expect(ecc.withAnnualAberration).to.equal(false);

      let phi2 = ecc.sc.phi,
          theta2 = ecc.sc.theta,
          r2 = ecc.sc.r;

      expect(phi2).not.to.equal(phi1);
      expect(theta2).not.to.equal(theta1);
      expect(r2).to.equal(r1);

      expect(phi2).to.equal(phi0);
      expect(theta2).to.equal(theta0);
    });
  });

  describe('#get FK5Correction', () => {
    it('The return should be a object.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382
      });
      expect(ecc.FK5Correction).to.have.all.keys('a', 'b');
    });
  });

  describe('#get GDCorrection', () => {
    it('The return should be a object.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382
      });
      expect(ecc.GDCorrection).to.have.all.keys('a', 'b');
    });
  });

  describe('#get AACorrection', () => {
    it('The return should be a object.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382
      });
      expect(ecc.AACorrection).to.have.all.keys('a', 'b');
    });
  });

  describe('#overall', () => {
    it('Three method to change coord correction should be equal.', () => {
      let ecc = new EclipticCoordinate({
        longitude: 122.3223,
        latitude: 23.223,
        radius: 1.09382
      });
    });
  });
});