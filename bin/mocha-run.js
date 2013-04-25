#!/usr/bin/env node
var mocharun = require('../index.js')
    , argv = require('optimist').argv._
    , glob = require('glob')
    , path = require('path')
    , async = require('async')


function getFiles(list){
    var files = []
    list.forEach(function(pattern){
        glob(pattern, {nonull:false, sync:true}, function(err, matches){
            if ( err ) throw err
            files = files.concat(matches.map(function(m){
                return path.resolve(m)
            }))
        })
    })
    return files
}

var testfiles = getFiles(argv)

async.eachSeries(testfiles, mocharun)
