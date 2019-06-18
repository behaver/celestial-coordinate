'use strict';

const CelestialCoordinate = require('./src/CelestialCoordinate');
const CelestialLocator = require('./src/CelestialLocator');
const SystemSwitcher = require('./src/SystemSwitcher');
const HorizontalCoordinate = require('./src/HorizontalCoordinate');
const HourAngleCoordinate = require('./src/HourAngleCoordinate');
const EquinoctialCoordinate = require('./src/EquinoctialCoordinate');
const EclipticCoordinate = require('./src/EclipticCoordinate');
const GalacticCoordinate = require('./src/GalacticCoordinate');

module.exports = { 
  CelestialCoordinate,
  CelestialLocator,
  SystemSwitcher, 
  HorizontalCoordinate, 
  HourAngleCoordinate, 
  EquinoctialCoordinate,
  EclipticCoordinate,
  GalacticCoordinate,
};
