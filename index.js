'use strict';

const SystemSwitcher = require('./src/SystemSwitcher');
const HorizontalCoordinate = require('./src/HorizontalCoordinate');
const HourAngleCoordinate = require('./src/HourAngleCoordinate');
const EquinoctialCoordinate = require('./src/EquinoctialCoordinate');
const EclipticCoordinate = require('./src/EclipticCoordinate');
const GalacticCoordinate = require('./src/GalacticCoordinate');

module.exports = { 
  SystemSwitcher, 
  HorizontalCoordinate, 
  HourAngleCoordinate, 
  EquinoctialCoordinate,
  EclipticCoordinate,
  GalacticCoordinate,
};
