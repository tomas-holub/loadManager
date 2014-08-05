loadManager
===========

Experimental JS dependency loader, which provides parallel js files loading and executes child code when all dependencies are ready.


How to use:

1) wrapp your js code which depends on jquery to function e.g.:

index.js:

var app_index = function() {
    console.log($);
}

2) let LoadManager to do the job:

LoadManager.ifReady(['/jquery.js', '/index.js']).run('app_index');


Syntax explanation:

ifReady()
- accepts depenendency array as parameter
- each element in array specifies path to js file
- last element in depenedency array specifies the child file

run()
- accepts a function name, to take the content from and run when dependency are resolved
