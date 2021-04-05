# numeric-DRC
'use strict';
const {provinces} = require('./numDRC').main;
const _provinces = provinces('nk'); // options {herTerritories, hisPolygonesPoints}
console.log(_provinces)
