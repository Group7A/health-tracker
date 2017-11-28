'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var server = app.start();
// var express = require('express'),
// 	bodyParser = require('body-parser'),
//     morgan = require('morgan'),
//     path = require('path');

// express.use(bodyParser.urlencoded({ extended: true }));
// express.use(bodyParser.json());

// express.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
//   next();
// });

// express.use(morgan('dev'));

// express.use(express.static(__dirname + '/modules'));
// express.listen(3000);
