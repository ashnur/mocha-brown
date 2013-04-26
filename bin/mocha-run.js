#!/usr/bin/env node

function next(){ if(stack.length) stack.shift()() }

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

var mocharun = require('../index.js')
    , argv = require('optimist').argv
    , glob = require('glob')
    , path = require('path')
    , testfiles = getFiles(argv._)
    , port = argv.port
    , stack = testfiles.map(function(file){
        return port ? function(){ mocharun(file, port, next) }
                    : function(){ mocharun(file, next) }
    })

next()
