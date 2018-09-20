const expect = require("chai").expect;
const { JDateRepository } = require('@behaver/jdate');
const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const Angle = require('@behaver/angle');
const GalacticCoordinate = require('../src/GalacticCoordinate');
const EquinoctialCoordinate = require('../src/EquinoctialCoordinate');

const angle = new Angle;

describe('#GalacticCoordinate', () => {
  describe('#constructor', () => {
    // 与 form 测试一致
  });

  describe('#from', () => {
    it('The param sc if existed should be a SphericalCoordinate3D.', () => {
      expect(() => {
        new GalacticCoordinate({
          sc: 'asdf'
        });
      }).to.throw();
      expect(() => {
        new GalacticCoordinate({
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326)
        });
      }).not.to.throw();
    });

    it('The param l should be a Number.', () => {
      expect(() => {
        new GalacticCoordinate({
          l: '232'
        })
      }).to.throw();
      expect(() => {
        new GalacticCoordinate({
          l: 123.2332
        });
      }).not.to.throw();
    });

    it('The param l should be in [0, 360).', () => {
      expect(() => {
        new GalacticCoordinate({
          l: -1
        })
      }).to.throw();

      expect(() => {
        new GalacticCoordinate({
          l: 360
        })
      }).to.throw();
    })

    it('The param b should be a Number.', () => {
      expect(() => {
        new GalacticCoordinate({
          l: 132.2332,
          b: '22'
        });
      }).to.throw();
      expect(() => {
        new GalacticCoordinate({
          l: 112.2323,
          b: 23.22
        });
      }).not.to.throw()
    });

    it('The param b should be in [-90, 90].', () => {
      expect(() => {
        new GalacticCoordinate({
          l: 23,
          b: - 90.232
        });
      }).to.throw();

      expect(() => {
        new GalacticCoordinate({
          l: 12.32,
          b: 90.23
        });
      }).to.throw();
    })

    it('The param radius should be a Number.', () => {
      expect(() => {
        new GalacticCoordinate({
          l: 122.3223,
          b: 23.223,
          radius: '233'
        });
      }).to.throw();
      expect(() => {
        new GalacticCoordinate({
          l: 122.3223,
          b: 23.223,
          radius: 1.09382
        });
      }).not.to.throw();
    })

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        new GalacticCoordinate({
          l: 122.3223,
          b: 23.223,
          radius: 0
        });
      }).to.throw();
    });

    it('The param epoch should be a JDateRepository', () => {
      expect(() => {
        new GalacticCoordinate({
          l: 122.3223,
          b: 23.223,
          epoch: '2231232'
        });
      }).to.throw();

      expect(() => {
        new GalacticCoordinate({
          l: 122.3223,
          b: 23.223,
          epoch: new JDateRepository(2000.0, 'jepoch')
        });
      }).not.to.throw();
    })

    it('The param precessionModel should be iau2006, iau2000 or iau1976.', () => {
      expect(() => {
        new GalacticCoordinate({
          l: 122.3223,
          precessionModel: 'iau',
        });
      }).to.throw();

      expect(() => {
        new GalacticCoordinate({
          l: 122.3223,
          precessionModel: 2006,
        })
      }).to.throw();

      expect(() => {
        new GalacticCoordinate({
          l: 122.3223,
          precessionModel: 'iau2006',
        })
        new GalacticCoordinate({
          l: 122.3223,
          precessionModel: 'IAU2006',
        })
      }).not.to.throw();
    })

    it('The param nutationModel should be iau2000b, lp.', () => {
      expect(() => {
        new GalacticCoordinate({
          l: 122.3223,
          nutationModel: 'iau',
        })
      }).to.throw();

      expect(() => {
        new GalacticCoordinate({
          l: 122.3223,
          nutationModel: 2006,
        })
      }).to.throw();

      expect(() => {
        new GalacticCoordinate({
          l: 122.3223,
          nutationModel: 'iau2000b',
        })
        new GalacticCoordinate({
          l: 122.3223,
          nutationModel: 'lp',
        })
      }).not.to.throw();
    })
  });

  describe('#on', () => {
    it('The param epoch should be a JDateRepository', () => {
      expect(() => {
        let gc  = new GalacticCoordinate({
          ra: 122.3223,
        });

        gc.on({
          epoch: 2323232,
        });
      }).to.throw();
    });

    it('Verify', () => {
      
    })
  });

  describe('#position', () => {
    it('The param sc if existed should be a SphericalCoordinate3D.', () => {
      expect(() => {
        let gc = new GalacticCoordinate({
          l: 123.2332
        });

        gc.position({
          sc: 'asdf'
        })
      }).to.throw();

      expect(() => {
        let gc = new GalacticCoordinate({
          l: 123.2332
        });

        gc.position({
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326)
        })
      }).not.to.throw();
    });

    it('The param l should be a Number.', () => {
      expect(() => {
        let gc = new GalacticCoordinate({
          l: 123.2332
        });

        gc.position({
          l: '232'
        })
      }).to.throw();

      expect(() => {
        let gc = new GalacticCoordinate({
          l: 123.2332
        });

        gc.position({
          l: 232
        })
      }).not.to.throw();
    });

    it('The param l should be in [0, 360).', () => {
      expect(() => {
        let gc = new GalacticCoordinate({
          l: 123.2332
        });

        gc.position({
          l: -1
        })
      }).to.throw();

      expect(() => {
        let gc = new GalacticCoordinate({
          l: 123.2332
        });

        gc.position({
          l: 360
        })
      }).to.throw();
    })

    it('The param b should be a Number.', () => {
      expect(() => {
        let gc = new GalacticCoordinate({
          l: 123.2332
        });

        gc.position({
          l: 112.2323,
          b: '23.22'
        })
      }).to.throw();

      expect(() => {
        let gc = new GalacticCoordinate({
          l: 123.2332
        });

        gc.position({
          l: 112.2323,
          b: 23.22
        })
      }).not.to.throw()
    });

    it('The param b should be in [-90, 90].', () => {
      expect(() => {
        let gc = new GalacticCoordinate({
          l: 123.2332
        });

        gc.position({
          l: 112.2323,
          b: -90.232
        })
      }).to.throw();

      expect(() => {
        let gc = new GalacticCoordinate({
          l: 123.2332
        });

        gc.position({
          l: 112.2323,
          b: 90.232
        })
      }).to.throw();
    })

    it('The param radius should be a Number.', () => {
      expect(() => {
        let gc = new GalacticCoordinate({
          l: 123.2332
        });

        gc.position({
          l: 112.2323,
          b: 23.22,
          radius: '1.09382',
        })
      }).to.throw();

      expect(() => {
        let gc = new GalacticCoordinate({
          l: 123.2332
        });

        gc.position({
          l: 112.2323,
          b: 23.22,
          radius: 1.09382,
        })
      }).not.to.throw();
    })

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        let gc = new GalacticCoordinate({
          l: 123.2332
        });

        gc.position({
          l: 112.2323,
          b: 23.22,
          radius: 0,
        })
      }).to.throw();
    });

    it('The property after using position should update.', () => {
      let gc = new GalacticCoordinate({
        l: 123.2332
      });

      gc.position({
        l: 112.2323,
        b: 23.22,
        radius: 1,
      })

      expect(gc.l.getDegrees()).to.equal(112.2323);
    });
  });

  describe('#get', () => {
    it('The param epoch should be a JDateRepository', () => {
      expect(() => {
        let gc  = new GalacticCoordinate({
          l: 122.3223,
        });

        gc.get({
          epoch: 2323232,
        });
      }).to.throw();
    });

    it('This method wont change the origin condition property.', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
        epoch: new JDateRepository(2000.0, 'jepoch'),
      });

      gc.get({
        epoch: new JDateRepository(1950.0, 'jepoch'),
      });

      expect(gc.epoch.JEpoch).to.equal(2000);
    });

    it('The return should be a right structure.', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      let res = gc.get({
        epoch: new JDateRepository(1950.0, 'jepoch'),
      });

      expect(res).to.have.all.key('sc', 'epoch', 'precessionModel', 'nutationModel');
    })
  });

  describe('#to', () => {
    it('The param system should be a String.', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        gc.to(1232);
      }).to.throw();
    })

    it('The param system should be horizontal、hourangle、ecliptic or galactic.', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        gc.to('aacc');
      }).to.throw();

      expect(() => {
        gc.to('ecliptic');
      }).not.to.throw();
    })
  });

  describe('#toHorizontal', () => {
    it('The param obTime should be a JDateRepository.', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        gc.toHorizontal({
          obTime: 2232123,
          obGeoLong: 123,
          obGeoLat: 23,
        })
      }).to.throw();

      expect(() => {
        gc.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 123,
          obGeoLat: 23,
        })
      }).not.to.throw();
    });

    it('The param obGeoLong should be a Number.', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        gc.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: '123',
          obGeoLat: 23,
        })
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180]', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        gc.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 180.1,
          obGeoLat: 23,
        })
      }).to.throw();

      expect(() => {
        gc.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: -180.1,
          obGeoLat: 23,
        })
      }).to.throw();

      expect(() => {
        gc.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 0,
          obGeoLat: 23,
        })
      }).not.to.throw();
    })

    it('The param obGeoLat should be a Number.', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        gc.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 123,
          obGeoLat: '23',
        })
      }).to.throw();
    })

    it('The param obGeoLat should be in [-90, 90].', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        gc.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 123,
          obGeoLat: 90.1,
        })
      }).to.throw();

      expect(() => {
        gc.toHorizontal({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 123,
          obGeoLat: -90.1,
        })
      }).to.throw();
    })

    it('The return should a right structure.', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      let hc_obj = gc.toHorizontal({
        obTime: new JDateRepository(new Date, 'date'),
        obGeoLong: 123,
        obGeoLat: 30.32,
      });

      expect(hc_obj).to.have.all.keys('sc', 'obTime', 'obGeoLong', 'obGeoLat', 'precessionModel', 'nutationModel');
    })
  });

  describe('#toHourAngle', () => {
    it('The param obTime should be a JDateRepository.', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        gc.toHourAngle({
          obTime: 2232123,
          obGeoLong: 123,
        })
      }).to.throw();

      expect(() => {
        gc.toHourAngle({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 123,
        })
      }).not.to.throw();
    });

    it('The param obGeoLong should be a Number.', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        gc.toHourAngle({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: '123',
        })
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180]', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      expect(() => {
        gc.toHourAngle({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: 180.1,
        })
      }).to.throw();

      expect(() => {
        gc.toHourAngle({
          obTime: new JDateRepository(new Date, 'date'),
          obGeoLong: -180.1,
        })
      }).to.throw();
    });

    it('The return should a right structure.', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      let hc_obj = gc.toHourAngle({
        obTime: new JDateRepository(new Date, 'date'),
        obGeoLong: 123,
      });

      expect(hc_obj).to.have.all.keys('sc', 'obTime', 'obGeoLong', 'precessionModel', 'nutationModel');
    })
  });

  describe('#toEquinoctial', () => {
    it('Verify 天文算法 例12.b', () => {
      let gc = new GalacticCoordinate({
        l: 12.9593,
        b: 6.0463,
        epoch: new JDateRepository(1950.0, 'bepoch'),
      })

      let eqc_obj = gc.toEquinoctial();

      expect(angle.setRadian(eqc_obj.sc.phi).getDegrees()).to.closeTo(angle.parseHACString('17h 48m 59.74s').getDegrees(), 0.0003);
      expect(angle.setRadian(eqc_obj.sc.theta).getDegrees()).to.closeTo(90 - angle.parseDACString('-14°43′08.2″').getDegrees(), 0.0003);
    })
  });

  describe('#toEcliptic', () => {
    it('The return should a right structure.', () => {
      let gc = new GalacticCoordinate({
        l: 122.3223,
      });

      let ecc_obj = gc.toEcliptic();

      expect(ecc_obj).to.have.all.keys('sc', 'epoch', 'withNutation', 'precessionModel', 'nutationModel');
    })
  });

  describe('#onEpoch', () => {
    it('The param epoch should be a JDateRepository.', () => {
      expect(() => {
        let gc = new GalacticCoordinate({
          l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
          b: angle.parseDACString('-14°43′08.2″').getDegrees(),
        });
        
        gc.onEpoch(2322232);
      }).to.throw();
    });

    it('The property epoch after onEpoch should equal the epoch setted.', () => {
      let gc = new GalacticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });
      
      let epoch = new JDateRepository(1950.0, 'bepoch');

      gc.onEpoch(epoch);

      expect(gc.epoch.BEpoch).to.closeTo(1950, 0.0000000001);
    })
  });

  describe('#get sc', () => {
    it('The return should be a SphericalCoordinate3D.', () => {
      let gc = new GalacticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(gc.sc).to.be.instanceof(SphericalCoordinate3D);
    });
  });

  describe('#get l', () => {
    it('The return should be a Angle.', () => {
      let gc = new GalacticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(gc.l).to.be.instanceof(Angle);
    })
  });

  describe('#get b', () => {
    it('The return should be a Angle.', () => {
      let gc = new GalacticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(gc.b).to.be.instanceof(Angle);
    })
  });

  describe('#get radius', () => {
    it('The return should be a Number.', () => {
      let gc = new GalacticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(gc.radius).to.be.a('Number');
    })
  });

  describe('#get epoch', () => {
    it('The return should be a JDateRepository.', () => {
      let gc = new GalacticCoordinate({
        l: angle.parseHACString('17h 48m 59.74s').getDegrees(),
        b: angle.parseDACString('-14°43′08.2″').getDegrees(),
      });

      expect(gc.epoch).to.be.instanceof(JDateRepository);
    });
  });

  describe('#get precessionModel', () => {

  });

  describe('#get nutationModel', () => {

  });
});