#!/usr/bin/env node
var mocharun = require('../index.js')
    , argv = require('optimist').argv._
    , testfile = require('path').resolve(argv[0])


mocharun(testfile)
