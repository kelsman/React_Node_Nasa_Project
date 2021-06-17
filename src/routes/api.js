
const planetRouter = require('./planets/planet.router');
const launchesRouter = require('./launches/launches.router');
const express = require('express');

const api = express.Router()

api.use('/planets', planetRouter);
api.use('/launches', launchesRouter);


module.exports = api;