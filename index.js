'use strict';

const CelestialCoordinate = require('./src/CelestialCoordinate');
const HorizontalCoordinate = require('./src/HorizontalCoordinate');
const HourAngleCoordinate = require('./src/HourAngleCoordinate');
const EquinoctialCoordinate = require('./src/EquinoctialCoordinate');
const EclipticCoordinate = require('./src/EclipticCoordinate');
const GalacticCoordinate = require('./src/GalacticCoordinate');

module.exports = { 
  CelestialCoordinate, 
  HorizontalCoordinate, 
  HourAngleCoordinate, 
  EquinoctialCoordinate,
  EclipticCoordinate,
  GalacticCoordinate,
};
