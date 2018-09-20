const expect = require("chai").expect;
const { JDateRepository } = require('@behaver/jdate');
const { SphericalCoordinate3D } = require('@behaver/coordinate/3d');
const Angle = require('@behaver/angle');
const HourAngleCoordinate = require('../src/HourAngleCoordinate');
const EquinoctialCoordinate = require('../src/EquinoctialCoordinate');

const angle = new Angle;

describe('#HourAngleCoordinate', () => {
  describe('#constructor', () => {
    // 与 form 测试一致
  });

  describe('#from', () => {
    it('The param obTime should exist and be a JDateRepository.', () => {
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
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
          obTime: 112233,
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).to.throw();
    });

    it('The param obGeoLong should exist and be a Number.', () => {
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).to.throw();
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: '120',
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180].', () => {
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: -181,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        })
      }).to.throw();

      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 181,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        })
      }).to.throw();
    });

    it('The param sc if existed should be a SphericalCoordinate3D.', () => {
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: 'asdf',
        });
      }).to.throw();
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).not.to.throw();
    });

    it('The param t if existed should be a Number.', () => {
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
        });
      }).not.to.throw();

      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: '120',
        });
      }).to.throw();
    });

    it('The param t should be in [0, 360).', () => {
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: -1,
          dec: 60,
        });
      }).to.throw();

      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 361,
          dec: 60,
        });
      }).to.throw();
    });

    it('The param dec if existed should be a Number.', () => {
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          dec: 60,
        });
      }).not.to.throw();
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          dec: '60',
        });
      }).to.throw();
    });

    it('The param dec should be in [-90, 90].', () => {
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          dec: -91,
        });
      }).to.throw();

      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          dec: 91,
        });
      }).to.throw();
    });

    it('The param radius if existed should be a Number.', () => {
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          dec: 60,
          radius: 1.23,
        });
      }).not.to.throw();
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          dec: 60,
          radius: '1.23',
        });
      }).to.throw();
    });

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          dec: 60,
          radius: 0,
        });
      }).to.throw();
    });

    it('The param precessionModel should be iau2006, iau2000 or iau1976.', () => {
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          precessionModel: 'iau',
        });
      }).to.throw();

      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          precessionModel: 2006,
        })
      }).to.throw();

      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          precessionModel: 'iau2006',
        })
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          precessionModel: 'IAU2006',
        })
      }).not.to.throw();
    })

    it('The param nutationModel should be iau2000b, lp.', () => {
      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          nutationModel: 'iau',
        })
      }).to.throw();

      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          nutationModel: 2006,
        })
      }).to.throw();

      expect(() => {
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          nutationModel: 'iau2000b',
        })
        new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
          nutationModel: 'lp',
        })
      }).not.to.throw();
    })
  })

  describe('#on', () => {
    it('The param obTime should be a JDateRepository.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obTime: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: -120,
        });
      }).not.to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obTime: 2462088.69,
        });
      }).to.throw();
    });

    it('The param obGeoLong should be a Number.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obTime: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: '120',
        });
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180].', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.on({
          obGeoLong: -181,
        });
      }).to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
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
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 123,
        });

        hc.position({
          sc: 'sdfa',
        });
      }).to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120.123,
        });

        hc.position({
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });
      }).not.to.throw();
    });

    it('The param t if existed should be a Number.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
        });

        hc.position({
          t: 210
        })
      }).not.to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
        });

        hc.position({
          t: '210'
        })
      }).to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
        });

        hc.position({
          dec: 30,
        })
      }).to.throw();
    });

    it('The param t should be in [0, 360).', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
        });

        hc.position({
          t: -1
        })
      }).to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
        });

        hc.position({
          t: 361
        })
      }).to.throw();
    });

    it('The param dec if existed should be a Number.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
        });

        hc.position({
          t: 210,
          dec: 30,
        })
      }).not.to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
        });

        hc.position({
          t: 210,
          dec: '30',
        })
      }).to.throw();
    });

    it('The param dec should be in [-90, 90].', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
        });

        hc.position({
          t: 210,
          dec: -91,
        })
      }).to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
        });

        hc.position({
          t: 210,
          dec: 91,
        })
      }).to.throw();
    });

    it('The param radius if existed should be a Number.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
        });

        hc.position({
          t: 210,
          dec: 30,
          radius: 1.23,
        })
      }).not.to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
        });

        hc.position({
          t: 210,
          dec: 30,
          radius: '1.23',
        })
      }).to.throw();
    });

    it('The param radius should be greater than 10e-8.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          t: 120,
        });

        hc.position({
          t: 210,
          radius: 0,
        })
      }).to.throw();
    });

    it('The property after using position should update.', () => {
      let hc = new HourAngleCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        t: 120,
      });

      hc.position({
        t: 210,
        radius: 1,
      })

      expect(hc.t.getDegrees()).to.equal(210);
      expect(hc.obGeoLong.getDegrees()).to.equal(120);
    });
  })

  describe('#get', () => {
    it('The param obTime should be a JDateRepository.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obTime: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: -120,
        });
      }).not.to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obTime: 2462088.69,
        });
      }).to.throw();
    });

    it('The param obGeoLong should be a Number.', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obTime: new JDateRepository(2462088.69, 'jde'),
          obGeoLong: '120',
        });
      }).to.throw();
    });

    it('The param obGeoLong should be in [-180, 180].', () => {
      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
          obGeoLong: 120,
          sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
        });

        hc.get({
          obGeoLong: -181,
        });
      }).to.throw();

      expect(() => {
        let hc = new HourAngleCoordinate({
          obTime: new JDateRepository(2000.0, 'jepoch'),
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
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      hc.get({
        obTime: new JDateRepository(2050.0, 'jepoch'),
        obGeoLong: -120,
      });

      expect(hc.obTime.JEpoch).to.equal(2000);
      expect(hc.obGeoLong.getDegrees()).to.equal(120);
    });

    it('The return should be a right structure.', () => {
      let hc = new HourAngleCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      let res = hc.get({
        obTime: new JDateRepository(2050.0, 'jepoch'),
        obGeoLong: -120,
      });

      expect(res).to.have.all.key('sc', 'obTime', 'obGeoLong', 'precessionModel', 'nutationModel');
    })
  });

  describe('#to', () => {
    it('The param system should be a String.', () => {
      let hc = new HourAngleCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(() => {
        hc.to(1232);
      }).to.throw();
    })

    it('The param system should be hourangle、equinoctia、ecliptic or galactic.', () => {
      let hc = new HourAngleCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
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

  describe('#toHorizontal', () => {
  });

  describe('#toEquinoctial', () => {
  });

  describe('#toEcliptic', () => {
  });

  describe('#toGalactic', () => {
  });

  describe('#get obTime', () => {
    it('The return should be a JDateRepository.', () => {
      let hac = new HourAngleCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hac.obTime).to.be.instanceof(JDateRepository);
    });
  });

  describe('#get obGeoLong', () => {
    it('The return should be obGeoLong Angle.', () => {
      let hac = new HourAngleCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hac.obGeoLong).to.be.instanceof(Angle);
    })
  });

  describe('#get sc', () => {
    it('The return should be a SphericalCoordinate3D.', () => {
      let hac = new HourAngleCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hac.sc).to.be.instanceof(SphericalCoordinate3D);
    });
  });

  describe('#get t', () => {
    it('The return should be a Angle.', () => {
      let hac = new HourAngleCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hac.t).to.be.instanceof(Angle);
    })
  });

  describe('#get dec', () => {
    it('The return should be a Angle.', () => {
      let hac = new HourAngleCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hac.dec).to.be.instanceof(Angle);
    })
  });

  describe('#get radius', () => {
    it('The return should be a Number.', () => {
      let hac = new HourAngleCoordinate({
        obTime: new JDateRepository(2000.0, 'jepoch'),
        obGeoLong: 120,
        sc: new SphericalCoordinate3D(1, 3.03252, 1.34326),
      });

      expect(hac.radius).to.be.a('Number');
    })
  });
})