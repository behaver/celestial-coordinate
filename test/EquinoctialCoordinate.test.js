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
    })

    it('The param precessionModel should be iau2006, iau2000 or iau1976.', () => {
      expect(() => {
        new EquinoctialCoordinate({
          ra: 122.3223,
          precessionModel: 'iau',
        });
      }).to.throw();

      expect(() => {
        new EquinoctialCoordinate({
          ra: 122.3223,
          precessionModel: 2006,
        })
      }).to.throw();

      expect(() => {
        new EquinoctialCoordinate({
          ra: 122.3223,
          precessionModel: 'iau2006',
        })
        new EquinoctialCoordinate({
          ra: 122.3223,
          precessionModel: 'IAU2006',
        })
      }).not.to.throw();
    })

    it('The param nutationModel should be iau2000b, lp.', () => {
      expect(() => {
        new EquinoctialCoordinate({
          ra: 122.3223,
          nutationModel: 'iau',
        })
      }).to.throw();

      expect(() => {
        new EquinoctialCoordinate({
          ra: 122.3223,
          nutationModel: 2006,
        })
      }).to.throw();

      expect(() => {
        new EquinoctialCoordinate({
          ra: 122.3223,
          nutationModel: 'iau2000b',
        })
        new EquinoctialCoordinate({
          ra: 122.3223,
          nutationModel: 'lp',
        })
      }).not.to.throw();
    })
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
      });

      ec.get({
        epoch: new JDateRepository(new Date, 'date'),
        withNutation: true,
      });
      expect(ec.epoch.JEpoch).to.equal(2000);
      expect(ec.withNutation).to.equal(false);
    });

    it('The return should be a right structure.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      let res = ec.get({
        epoch: new JDateRepository(new Date, 'date'),
        withNutation: true,
      });

      expect(res).to.have.all.key('sc', 'epoch', 'withNutation', 'precessionModel', 'nutationModel');
    })
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
    })

    it('The return should a right structure.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      let hc_obj = ec.toHorizontal({
        obTime: new JDateRepository(new Date, 'date'),
        obGeoLong: 123,
        obGeoLat: 30.32,
      });

      expect(hc_obj).to.have.all.keys('sc', 'obTime', 'obGeoLong', 'obGeoLat', 'precessionModel', 'nutationModel');
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

      expect(hc_obj).to.have.all.keys('sc', 'obTime', 'obGeoLong', 'precessionModel', 'nutationModel');
    })
  });

  describe('#toEcliptic', () => {
    it('The return should a right structure.', () => {
      let ec = new EquinoctialCoordinate({
        ra: 122.3223,
      });

      let ecc_obj = ec.toEcliptic();

      expect(ecc_obj).to.have.all.keys('sc', 'epoch', 'withNutation', 'precessionModel', 'nutationModel');
    })

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

      expect(gc_obj).to.have.all.keys('sc', 'epoch', 'precessionModel', 'nutationModel');
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

  describe('#nutationPatch', () => {
    it('The property withNutation after nutationPatch should be true.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      eqc.nutationPatch();

      expect(eqc.withNutation).to.equal(true);
    });
  });

  describe('#nutationUnpatch', () => {
    it('The property withNutation after nutationUnpatch should be false.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      eqc.nutationUnpatch();

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

  describe('#get epoch', () => {
    it('The return should be a JDateRepository.', () => {
      let eqc = new EquinoctialCoordinate({
        ra: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        dec: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(eqc.epoch).to.be.instanceof(JDateRepository);
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

  describe('#get precessionModel', () => {

  });

  describe('#get nutationModel', () => {

  });
});