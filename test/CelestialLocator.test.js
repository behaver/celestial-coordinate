const expect = require("chai").expect;

const { CelestialLocator } = require('../index');
const { JDateRepository } = require('@behaver/jdate');

describe('#CelestialLocator', () => {
  describe('#extends', () => {
    it('#大体测试一下接口继承是否正常运行。', () => {
      expect(() => {
        class A extends CelestialLocator {};
        A.id = '腹中有苦果';
        A.time = new JDateRepository;
        A.id;
        A.time;
      }).not.to.throw();

      class A extends CelestialLocator {};
      A.id = '腹中有苦果';

      expect(A.id).to.equal('腹中有苦果');
    });
  });
});
