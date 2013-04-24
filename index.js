void function(root){
    //start listener
    var argv = require('optimist').argv._
        , browserify = require('browserify')
        , b = browserify(argv[0])
        , run = require('browser-run')
        , browser = run()
        , fs = require('fs')
        , addMochaDiv = ";var mochadiv = document.createElement('div');"+
                        "mochadiv.id = 'mocha';" +
                        "document.body.appendChild(mochadiv);"
        , through = require('through')

    function fileToString(path){
        return fs.readFileSync(path).toString()
    }

    browser.pipe(through(function(buf){
            this.queue(buf)
            if(buf.toString().indexOf('# fail') === 0 ) {
                browser.stop()
            }
        }, function(){ this.queue(null);})).pipe(process.stdout)

    b.add(argv[0])
    browser.write(addMochaDiv+
            fileToString(__dirname+'/mocha.js')+
            fileToString(__dirname+'/tap.js')+
            ";mocha.setup({ui:'bdd',reporter:TAP})"
            )

    b.bundle().on('end', function(){
        browser.end(";mocha.checkLeaks();window.addEventListener('load',function(){mocha.run()});")
    }).pipe(browser, {end:false})



}(this)
