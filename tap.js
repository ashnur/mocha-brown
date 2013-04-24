;void function(root){

    function TAP(runner) {

      var self = this
        , stats = this.stats
        , n = 1
        , passes = 0
        , failures = 0;

      runner.on('start', function(){
        var total = runner.grepTotal(runner.suite);
        console.log( 1+'..'+total);
      });

      runner.on('test end', function(){
        ++n;
      });

      runner.on('pending', function(test){
        console.log('ok '+n+' '+title(test)+' # SKIP -' );
      });

      runner.on('pass', function(test){
        passes++;
        console.log('ok '+n+' '+title(test) );
      });

      runner.on('fail', function(test, err){
        failures++;
        console.log('not ok '+n+' '+title(test));
        if (err.stack) console.log(err.stack.replace(/^/gm, '  '));
      });

      runner.on('end', function(){
        console.log('# tests ' + (passes + failures));
        console.log('# pass ' + passes);
        console.log('# fail ' + failures);
      });

    }

    function title(test) {
      return test.fullTitle().replace(/#/g, '');
    }

    if (typeof define === "function" && define.amd) {
      define([""], function factory() { return TAP })
    } else {
      root.TAP = TAP
    }
}(this)
