const expect = require("chai").expect;
const { JDateRepository } = require('@behaver/jdate');
const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const Angle = require('@behaver/angle');
const EquinoctialCoordinate = require('../src/EquinoctialCoordinate');

const angle = new Angle;

describe('#EquinoctialCoordinate', () => {
  describe('#constructor', () => {
    // 与 form 测试一致
  });

  describe('#from', () => {
    it('The param sc if existed should be a SphericalCoordinate3D.', () => {
      expect(() => {
        new EquinoctialCoordinate({
          sc: 'asdf'
        });
      }).to.throw();
      expect(() => {
        new EquinoctialCoordinate({
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326)
        });
      }).not.to.throw();
    });

    it('The param ra should be a Number.', () => {
      expect(() => {
        new EquinoctialCoordinate({
          ra: '232'
        })
      }).to.throw();
      expect(() => {
        new EquinoctialCoordinate({
          ra: 123.2332
        });
      }).not.to.throw();
    });

    it('The param ra should be in [0, 360).', () => {
      expect(() => {
        new EquinoctialCoordinate({
          ra: -1
        })
      }).to.throw();

      expect(() => {
        new EquinoctialCoordinate({
          ra: 360
        })
      }).to.throw();
    })

    it('The param dec should be a Number.', () => {
      expect(() => {
        new EquinoctialCoordinate({
          ra: 132.2332,
          dec: '22'
        });
      }).to.throw();
      expect(() => {
        new EquinoctialCoordinate({
          ra: 112.2323,
          dec: 23.22
        });
      }).not.to.throw()
    });

    it('The param dec should be in [-90, 90].', () => {
      expect(() => {
        new EquinoctialCoordinate({
          ra: 23,
          dec: - 90.232
        });
      }).to.throw();

      expect(() => {
        new EquinoctialCoordinate({
          ra: 12.32,
          dec: 90.23
        });
      }).to.throw();
    })

    it('The param radius should be a Number.', () => {
      expect(() => {
        new EquinoctialCoordinate({
          ra: 122.3223,
          dec: 23.223,
          radius: '233'
        });
      }).to.throw();
      expect(() => {
        new EquinoctialCoordinate({
          ra: 122.3223,
          dec: 23.223,
          radius: 1.09382
        });
      }).not.to.throw();
    })

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        new EquinoctialCoordinate({
          ra: 122.3223,
          dec: 23.223,
          radius: 0
        });
      }).to.throw();
    });

    it('The param epoch should be a JDateRepository', () => {
      expect(() => {
        new EquinoctialCoordinate({
          ra: 122.3223,
          dec: 23.223,
          epoch: '2231232'
        });
      }).to.throw();

      expect(() => {
        new EquinoctialCoordinate({
          ra: 122.3223,
          dec: 23.223,
          epoch: new JDateRepository(2000.0, 'jepoch')
        });
      }).not.to.throw();
    });
  });

  describe('#on', () => {
    it('The param epoch should be a JDateRepository', () => {
      expect(() => {
        let ec  = new EquinoctialCoordinate({
          ra: 122.3223,
        });

        ec.on({
          epoch: 2323232,
        });
      }).to.throw();
    });

    it('When absent coordinate terms, run normally.', () => {
      let ec  = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      expect(() => {
        ec.on({
          onFK5: true,
          withGravitationalDeflection: true,
          withAnnualAberration: true,
        });
      }).not.to.throw();
    })

    it('Verify 天文算法 例20.a', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('10h 08m 22.3s').getDegrees(),
        dec: angle.parseDACString('11°58′02″').getDegrees(),
      })

      eqc.on({
        epoch: new JDateRepository(1978.0, 'jepoch')
      })

      expect(eqc.ra.getSeconds() + 22 * 0.0169 * 15).to.closeTo(angle.parseHACString('10h 07m 12.1s').getSeconds(), 1);
      expect(eqc.dec.getSeconds() - 22 * 0.006).to.closeTo(angle.parseDACString('12°04′31″').getSeconds(), 1);
    })

    it('Verify 天文算法 例20.b', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('2h 44m 11.986s').getDegrees(),
        dec: angle.parseDACString('49°13′42.48″').getDegrees(),
      })

      eqc.on({
        epoch: new JDateRepository(2462088.69, 'jde')
      })

      expect(eqc.ra.getSeconds() + 28.86705 * 0.03425 * 15).to.closeTo(angle.parseHACString('2h 46m 11.331s').getSeconds(), 1);
      expect(eqc.dec.getSeconds() - 28.86705 * 0.0895).to.closeTo(angle.parseDACString('49°20′54.54″').getSeconds(), 1);
    })
  });

  describe('#position', () => {
    it('The param sc if existed should be a SphericalCoordinate3D.', () => {
      expect(() => {
        let ec = new EquinoctialCoordinate({
          ra: 123.2332
        });

        ec.position({
          sc: 'asdf'
        })
      }).to.throw();

      expect(() => {
        let ec = new EquinoctialCoordinate({
          ra: 123.2332
        });

        ec.position({
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326)
        })
      }).not.to.throw();
    });

    it('The param ra should be a Number.', () => {
      expect(() => {
        let ec = new EquinoctialCoordinate({
          ra: 123.2332
        });

        ec.position({
          ra: '232'
        })
      }).to.throw();

      expect(() => {
        let ec = new EquinoctialCoordinate({
          ra: 123.2332
        });

        ec.position({
          ra: 232
        })
      }).not.to.throw();
    });

    it('The param ra should be in [0, 360).', () => {
      expect(() => {
        let ec = new EquinoctialCoordinate({
          ra: 123.2332
        });

        ec.position({
          ra: -1
        })
      }).to.throw();

      expect(() => {
        let ec = new EquinoctialCoordinate({
          ra: 123.2332
        });

        ec.position({
          ra: 360
        })
      }).to.throw();
    })

    it('The param dec should be a Number.', () => {
      expect(() => {
        let ec = new EquinoctialCoordinate({
          ra: 123.2332
        });

        ec.position({
          ra: 112.2323,
          dec: '23.22'
        })
      }).to.throw();

      expect(() => {
        let ec = new EquinoctialCoordinate({
          ra: 123.2332
        });

        ec.position({
          ra: 112.2323,
          dec: 23.22
        })
      }).not.to.throw()
    });

    it('The param dec should be in [-90, 90].', () => {
      expect(() => {
        let ec = new EquinoctialCoordinate({
          ra: 123.2332
        });

        ec.position({
          ra: 112.2323,
          dec: -90.232
        })
      }).to.throw();

      expect(() => {
        let ec = new EquinoctialCoordinate({
          ra: 123.2332
        });

        ec.position({
          ra: 112.2323,
          dec: 90.232
        })
      }).to.throw();
    })

    it('The param radius should be a Number.', () => {
      expect(() => {
        let ec = new EquinoctialCoordinate({
          ra: 123.2332
        });

        ec.position({
          ra: 112.2323,
          dec: 23.22,
          radius: '1.09382',
        })
      }).to.throw();

      expect(() => {
        let ec = new EquinoctialCoordinate({
          ra: 123.2332
        });

        ec.position({
          ra: 112.2323,
          dec: 23.22,
          radius: 1.09382,
        })
      }).not.to.throw();
    })

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        let ec = new EquinoctialCoordinate({
          ra: 123.2332
        });

        ec.position({
          ra: 112.2323,
          dec: 23.22,
          radius: 0,
        })
      }).to.throw();
    });

    it('The property after using position should update.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 123.2332
      });

      ec.position({
        ra: 112.2323,
        dec: 23.22,
        radius: 1,
      })

      expect(ec.ra.getDegrees()).to.equal(112.2323);
    });
  });

  describe('#get', () => {
    it('The param epoch should be a JDateRepository', () => {
      expect(() => {
        let ec  = new EquinoctialCoordinate({
          ra: 122.3223,
        });

        ec.get({
          epoch: 2323232,
        });
      }).to.throw();
    });

    it('This method wont change the origin condition property.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
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
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      let res = ec.get({
        epoch: new JDateRepository(new Date, 'date'),
        withNutation: true,
        onFK5: true,
        withAnnualAberration: true,
        withGravitationalDeflection: true,
      });

      expect(res).to.have.all.key('sc', 'epoch', 'withNutation', 'withGravitationalDeflection', 'withAnnualAberration', 'onFK5');
    
      expect(res.withNutation).to.equal(true);
      expect(res.onFK5).to.equal(true);
      expect(res.withAnnualAberration).to.equal(true);
      expect(res.withGravitationalDeflection).to.equal(true);
    });
  });

  describe('#to', () => {
    it('The param system should be a String.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      expect(() => {
        ec.to(1232);
      }).to.throw();
    })

    it('The param system should be horizontal、hourangle、ecliptic or galactic.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      expect(() => {
        ec.to('aacc');
      }).to.throw();

      expect(() => {
        ec.to('ecliptic');
      }).not.to.throw();
    })
  });

  describe('#toHorizontal', () => {
    it('The param obTime should be a JDateRepository.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
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
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
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
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
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

    it('The param obGeoLat should be a Number.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      expect(() => {
        ec.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 123,
          obGeoLat: '23',
        })
      }).to.throw();
    })

    it('The param obGeoLat should be in [-90, 90].', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
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
    });

    it('The param obElevation should be a number, if it existed.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      expect(() => {
        let hc_obj = ec.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 123,
          obGeoLat: 30.32,
          obElevation: 1221,
        });
      }).not.to.throw();

      expect(() => {
        let hc_obj = ec.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 123,
          obGeoLat: 30.32,
          obElevation: '1221',
        });
      }).to.throw();
    });

    it('The return should a right structure.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      let hc_obj = ec.toHorizontal({
        obTime: new JDateRepository(new Date, 'date'),
        obGeoLong: 123,
        obGeoLat: 30.32,
      });

      expect(hc_obj).to.have.all.keys('sc', 'obTime', 'obGeoLong', 'obGeoLat', 'obElevation', 'withAR', 'centerMode');
    })

    it('Verify 天文算法 例12.b', () => {
      let epoch = new JDateRepository(new Date('1987/04/11 03:21:00'), 'date');
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('23h 09m 16.641s').getDegrees(),
        dec: angle.parseDACString('-6°43′11.61″').getDegrees(),
        epoch: epoch,
        withNutation: true,
      });

      let hc = eqc.toHorizontal({
        // obTime: epoch,
        obGeoLong: angle.parseDACString('77°03′56″').getDegrees(),
        obGeoLat: angle.parseDACString('38°55′17″').getDegrees(),
      });

      
      expect(angle.setRadian(hc.sc.phi).getDegrees()).to.closeTo(68.0337, 0.0001);
      expect(angle.setRadian(hc.sc.theta).getDegrees()).to.closeTo(90 - 15.1249, 0.0001);
    });
  });

  describe('#toHourAngle', () => {
    it('The param obTime should be a JDateRepository.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
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
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      expect(() => {
        ec.toHourAngle({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: '123',
        })
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180]', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
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
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      let hc_obj = ec.toHourAngle({
        obTime: new JDateRepository(new Date, 'date'),
        obGeoLong: 123,
      });

      expect(hc_obj).to.have.all.keys('sc', 'obTime', 'obGeoLong');
    })
  });

  describe('#toEcliptic', () => {
    it('The return should a right structure.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      let ecc_obj = ec.toEcliptic();

      expect(ecc_obj).to.have.all.keys('sc', 'epoch', 'withNutation', 'onFK5', 'withAnnualAberration', 'withGravitationalDeflection', 'centerMode');
    });

    it('Verify 天文算法 例12.a', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 116.328942,
        dec: 28.026183,
      });

      let ecc = eqc.toEcliptic();
      expect(angle.setRadian(ecc.sc.phi).getDegrees()).to.closeTo(113.215630, 0.000001);
      expect(angle.setRadian(ecc.sc.theta).getDegrees()).to.closeTo(90 - 6.684170, 0.0001);
    });
  });

  describe('#toGalactic', () => {
    it('The return should a right structure.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      let gc_obj = ec.toGalactic();

      expect(gc_obj).to.have.all.keys('sc', 'epoch');
    })

    it('Verify 天文算法 第12章 P79 练习', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
        epoch: new JDateRepository(1950.0, 'bepoch'),
      });

      let gc = eqc.toGalactic();

      expect(angle.setRadian(gc.sc.phi).getDegrees()).to.closeTo(12.9593, 0.001);
      expect(angle.setRadian(Math.PI / 2 - gc.sc.theta).getDegrees()).to.closeTo(6.0463, 0.0002);
    });
  })

  describe('#onJ2000', () => {
    it('The property epoch after onJ2000 should equal J2000.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
        epoch: new JDateRepository(1950.0, 'bepoch'),
      });

      eqc.onJ2000();

      expect(eqc.epoch.JEpoch).to.equal(2000.0);
    });
  });

  describe('#onEpoch', () => {
    it('The param epoch should be a JDateRepository.', () => {
      expect(() => {
        let eqc = new EquinoctialCoordinate({
          ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
          dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
        });
        
        eqc.onEpoch(2322232);
      }).to.throw();
    });

    it('The property epoch after onEpoch should equal the epoch setted.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });
      
      let epoch = new JDateRepository(1950.0, 'bepoch');

      eqc.onEpoch(epoch);

      expect(eqc.epoch.BEpoch).to.closeTo(1950, 0.0000000001);
    })
  });

  describe('#patchNutation', () => {
    it('The property withNutation after patchNutation should be true.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      eqc.patchNutation();

      expect(eqc.withNutation).to.equal(true);
    });
  });

  describe('#unpatchNutation', () => {
    it('The property withNutation after unpatchNutation should be false.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      eqc.unpatchNutation();

      expect(eqc.withNutation).to.equal(false);
    });
  });

  describe('#get sc', () => {
    it('The return should be a SphericalCoordinate3D.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(eqc.sc).to.be.instanceof(SphericalCoordinate3D);
    });
  });

  describe('#get ra', () => {
    it('The return should be a Angle.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(eqc.ra).to.be.instanceof(Angle);
    })
  });

  describe('#get dec', () => {
    it('The return should be a Angle.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(eqc.dec).to.be.instanceof(Angle);
    })
  });

  describe('#get radius', () => {
    it('The return should be a Number.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(eqc.radius).to.be.a('Number');
    })
  });

  describe('#get FK5Correction', () => {
    it('The return should be a object.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });
      expect(eqc.FK5Correction).to.have.all.keys('a', 'b');
    });
  });

  describe('#get GDCorrection', () => {
    it('The return should be a object.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });
      expect(eqc.GDCorrection).to.have.all.keys('a', 'b');
    });
  });

  describe('#get AACorrection', () => {
    it('The return should be a object.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      expect(eqc.AACorrection).to.have.all.keys('a', 'b');
    });
  });

  describe('#get PrecessionCorrection', () => {
    it('The return should be a object.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      expect(eqc.PrecessionCorrection).to.have.all.keys('zeta', 'theta', 'z');
    });
  });

  describe('#get NutationCorrection', () => {
    it('The return should be a object.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      expect(eqc.NutationCorrection).to.have.all.keys('e0', 'delta_e', 'delta_psi');
    });
  });

  describe('#get epoch', () => {
    it('The return should be a JDateRepository.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(eqc.epoch).to.be.instanceof(JDateRepository);
    });
  });

  describe('#set epoch', () => {
    it('Run normally, throw no error.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 123.45,
        dec: 34.567,
        radius: 2.34,
      });

      expect(() => {
        eqc.epoch = new JDateRepository(12, 'J2000');
      }).not.to.throw();
    });

    it('After set epoch, the properties should be changed.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 123.34,
        dec: 22.34,
        radius: 1.23,
      });

      let epoch0 = eqc.epoch,
          phi0 = eqc.sc.phi,
          theta0 = eqc.sc.theta,
          r0 = eqc.sc.r;

      eqc.epoch = new JDateRepository(1800, 'jepoch');

      expect(epoch0.JD).not.to.equal(eqc.epoch.JD);
      expect(phi0).not.to.equal(eqc.sc.phi);
      expect(theta0).not.to.equal(eqc.sc.theta);
      // expect(r0).not.to.equal(eqc.sc.r);
    });
  });

  describe('#set withNutation', () => {
    it('Run normally, throw no error.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.22,
        dec: 56.2,
        radius: 2.012,
      });

      expect(() => {
        eqc.withNutation = true;
        eqc.withNutation = false;
      }).not.to.throw();
    });

    it('After set withNutation, the property sc should be changed.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 123.32,
        dec: 33.233,
        radius: 1.4332,
      });

      let phi0 = eqc.sc.phi,
          theta0 = eqc.sc.theta,
          r0 = eqc.sc.r;

      eqc.withNutation = true;

      expect(eqc.sc.phi).not.to.equal(phi0);
      expect(eqc.sc.theta).not.to.equal(theta0);
      expect(eqc.sc.r).not.to.equal(r0);
    });
  });

  describe('#get withNutation', () => {
    it('The return should be a Boolean.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(eqc.withNutation).to.be.a('Boolean');
    });
  });

  describe('#set onFK5(value)', () => {
    it('Run normally, no error throw.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });
      expect(() => {
        eqc.onFK5 = true;
        eqc.onFK5 = false;
      }).not.to.throw();
    });

    it('After setting onFK5, the property sc should be change.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      let phi0 = eqc.sc.phi,
          theta0 = eqc.sc.theta,
          r0 = eqc.sc.r;

      eqc.onFK5 = true;

      let phi1 = eqc.sc.phi,
          theta1 = eqc.sc.theta,
          r1 = eqc.sc.r;

      expect(phi0).not.to.equal(phi1);
      expect(theta0).not.to.equal(theta1);
      expect(r0).to.equal(r1);
    });
  });

  describe('#get onFK5()', () => {
    it('Get and set run normally.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      expect(eqc.onFK5).to.equal(false);

      eqc.onFK5 = 1;

      expect(eqc.onFK5).to.equal(true);
    });
  });

  describe('#set withGravitationalDeflection(value)', () => {
    it('Run normally, no error throw.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      expect(() => {
        eqc.withGravitationalDeflection = true;
        eqc.withGravitationalDeflection = false;
      }).not.to.throw();
    });

    it('After setting withGravitationalDeflection, the property sc should be change.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 2.09382
      });

      let phi0 = eqc.sc.phi,
          theta0 = eqc.sc.theta,
          r0 = eqc.sc.r;

      eqc.withGravitationalDeflection = true;

      let phi1 = eqc.sc.phi,
          theta1 = eqc.sc.theta,
          r1 = eqc.sc.r;

      expect(phi0).not.to.equal(phi1);
      expect(theta0).not.to.equal(theta1);
      expect(r0).to.equal(r1);
    });
  });

  describe('#get withGravitationalDeflection()', () => {
    it('Get and set run normally.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      expect(eqc.withGravitationalDeflection).to.equal(false);

      eqc.withGravitationalDeflection = 1;

      expect(eqc.withGravitationalDeflection).to.equal(true);
    });
  });

  describe('#set withAnnualAberration(value)', () => {
    it('Run normally, no error throw.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      expect(() => {
        eqc.withAnnualAberration = true;
        eqc.withAnnualAberration = false;
      }).not.to.throw();
    });

    it('After setting withAnnualAberration, the property sc should be change.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 2.09382
      });

      let phi0 = eqc.sc.phi,
          theta0 = eqc.sc.theta,
          r0 = eqc.sc.r;

      eqc.withAnnualAberration = true;

      let phi1 = eqc.sc.phi,
          theta1 = eqc.sc.theta,
          r1 = eqc.sc.r;

      expect(phi0).not.to.equal(phi1);
      expect(theta0).not.to.equal(theta1);
      expect(r0).to.equal(r1);
    });
  });

  describe('#get withAnnualAberration()', () => {
    it('Get and set run normally.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      expect(eqc.withAnnualAberration).to.equal(false);

      eqc.withAnnualAberration = 1;

      expect(eqc.withAnnualAberration).to.equal(true);
    });
  });

  describe('#patchFK5(), unpatchFK5()', () => {
    it('Run normally, no error throw.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      expect(() => {
        eqc.patchFK5();
      }).not.to.throw();

      expect(() => {
        eqc.unpatchFK5();
      }).not.to.throw();
    });

    it('After patchFK5(), the property sc should be change.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      let phi0 = eqc.sc.phi,
          theta0 = eqc.sc.theta,
          r0 = eqc.sc.r;

      expect(eqc.onFK5).to.equal(false);

      eqc.patchFK5();

      let phi1 = eqc.sc.phi,
          theta1 = eqc.sc.theta,
          r1 = eqc.sc.r;

      expect(phi0).not.to.equal(phi1);
      expect(theta0).not.to.equal(theta1);
      expect(r0).to.equal(r1);

      expect(eqc.onFK5).to.equal(true);

      eqc.unpatchFK5();

      expect(eqc.onFK5).to.equal(false);

      let phi2 = eqc.sc.phi,
          theta2 = eqc.sc.theta,
          r2 = eqc.sc.r;

      expect(phi2).not.to.equal(phi1);
      expect(theta2).not.to.equal(theta1);
      expect(r2).to.equal(r1);

      expect(phi2).to.equal(phi0);
      expect(theta2).to.equal(theta0);
    });
  });

  describe('#patchGravitationalDeflection(), unpatchGravitationalDeflection()', () => {
    it('Run normally, no error throw.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      expect(() => {
        eqc.patchGravitationalDeflection();
      }).not.to.throw();

      expect(() => {
        eqc.unpatchGravitationalDeflection();
      }).not.to.throw();
    });

    it('After patchGravitationalDeflection(), the property sc should be change.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      let phi0 = eqc.sc.phi,
          theta0 = eqc.sc.theta,
          r0 = eqc.sc.r;

      expect(eqc.withGravitationalDeflection).to.equal(false);

      eqc.patchGravitationalDeflection();

      let phi1 = eqc.sc.phi,
          theta1 = eqc.sc.theta,
          r1 = eqc.sc.r;

      expect(phi0).not.to.equal(phi1);
      expect(theta0).not.to.equal(theta1);
      expect(r0).to.equal(r1);

      expect(eqc.withGravitationalDeflection).to.equal(true);

      eqc.unpatchGravitationalDeflection();

      expect(eqc.withGravitationalDeflection).to.equal(false);

      let phi2 = eqc.sc.phi,
          theta2 = eqc.sc.theta,
          r2 = eqc.sc.r;

      expect(phi2).not.to.equal(phi1);
      expect(theta2).not.to.equal(theta1);
      expect(r2).to.equal(r1);

      expect(phi2).to.equal(phi0);
      expect(theta2).to.equal(theta0);
    });
  });

  describe('#patchAnnualAberration(), unpatchAnnualAberration()', () => {
    it('Run normally, no error throw.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      expect(() => {
        eqc.patchAnnualAberration();
      }).not.to.throw();
      
      expect(() => {
        eqc.unpatchAnnualAberration();
      }).not.to.throw();
    });

    it('After patchAnnualAberration(), the property sc should be change.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: 122.3223,
        dec: 23.223,
        radius: 1.09382
      });

      let phi0 = eqc.sc.phi,
          theta0 = eqc.sc.theta,
          r0 = eqc.sc.r;

      expect(eqc.withAnnualAberration).to.equal(false);

      eqc.patchAnnualAberration();

      let phi1 = eqc.sc.phi,
          theta1 = eqc.sc.theta,
          r1 = eqc.sc.r;

      expect(phi0).not.to.equal(phi1);
      expect(theta0).not.to.equal(theta1);
      expect(r0).to.equal(r1);

      expect(eqc.withAnnualAberration).to.equal(true);

      eqc.unpatchAnnualAberration();

      expect(eqc.withAnnualAberration).to.equal(false);

      let phi2 = eqc.sc.phi,
          theta2 = eqc.sc.theta,
          r2 = eqc.sc.r;

      expect(phi2).not.to.equal(phi1);
      expect(theta2).not.to.equal(theta1);
      expect(r2).to.equal(r1);

      expect(phi2).to.equal(phi0);
      expect(theta2).to.equal(theta0);
    });
  });
});