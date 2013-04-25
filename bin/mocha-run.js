#!/usr/bin/env node
require('better-stack-traces')
var mocharun = require('../index.js')
    , argv = require('optimist').argv._
    , glob = require('glob')
    , path = require('path')
    , async = require('async')

glob(argv[0], {nonull:false}, function(err, files){
    if ( err ) throw err
    var testfiles = files.map(function(file){ return path.resolve(file) })
    async.eachSeries(testfiles, mocharun)
})
