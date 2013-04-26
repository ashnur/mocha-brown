void function(root){


    var browserify = require('browserify')
        , fs = require('fs')
        , addMochaDiv = ";var mochadiv = document.createElement('div');"+
                        "mochadiv.id = 'mocha';" +
                        "document.body.appendChild(mochadiv);"
        , finished = require('tap-finished')
        , through = require('through')

    function fileToString(path){ return fs.readFileSync(path).toString() }

    module.exports = function(testfile, port, end){

        if ( typeof port == 'function' ) {
            end = port
            port = undefined
        }

        var b = browserify(testfile)
            , browser = require('browser-run')(port)

        browser.pipe(through(function(chunk){
            process.stdout.write(chunk)
            this.queue(chunk)
        })).pipe(finished(function(results){
            browser.stop()
            if (end) end()
        }))

        b.add(testfile)
        browser.write(addMochaDiv+
                fileToString(__dirname+'/mocha.js')+
                fileToString(__dirname+'/tap.js')+
                ";mocha.setup({ui:'bdd',reporter:TAP})")

        b.bundle({debug: true}).on('end', function(){
            browser.end(";mocha.checkLeaks();window.addEventListener('load',function(){mocha.run()});")
        }).pipe(browser, {end:false})

    }

}(this)
