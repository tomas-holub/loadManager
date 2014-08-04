loadManager
===========

JS dependency loader, which loads js files in parallel, and executes js code when all loading is ready

Example of ussage:

LoadManager.waitFor(['/jquery.js']).toLoad('/index.js').wrappedIn('app_index');


index.js:

var app_index = function() {
    console.log($('body'));
}
