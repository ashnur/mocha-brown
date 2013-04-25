void function(root){


    var browserify = require('browserify')
        , browser = require('browser-run')()
        , fs = require('fs')
        , addMochaDiv = ";var mochadiv = document.createElement('div');"+
                        "mochadiv.id = 'mocha';" +
                        "document.body.appendChild(mochadiv);"
        , finished = require('tap-finished')
        , through = require('through')

    function fileToString(path){ return fs.readFileSync(path).toString() }

    module.exports = function(testfile){

        var b = browserify(testfile)

        browser.pipe(through(function(chunk){
            process.stdout.write(chunk)
            this.queue(chunk)
        })).pipe(finished(function(results){ browser.stop() }))

        b.add(testfile)
        browser.write(addMochaDiv+
                fileToString(__dirname+'/mocha.js')+
                fileToString(__dirname+'/tap.js')+
                ";mocha.setup({ui:'bdd',reporter:TAP})")

        b.bundle().on('end', function(){
            browser.end(";mocha.checkLeaks();window.addEventListener('load',function(){mocha.run()});")
        }).pipe(browser, {end:false})

    }

}(this)
