var LoadManager = (function() {

    var depContainer   = {};
    var fileReady      = [];
    var fileRequested  = [];
    var fileApplicable = [];
    var fileApplied    = [];


    var ifReady = function(files) {
        files.forEach(function(file){
            if (fileReady.indexOf(file) === -1 && fileRequested.indexOf(file) === -1 ) {
                fileRequested.push(file);
                loadScript(file);
            }            
        });

        if (fileApplicable.indexOf(files[files.length-1]) === -1) {
            fileApplicable.push(files[files.length-1]);        
        }

        return {
            run: function(wrapper) {
                depContainer[wrapper] = files;
            }
        };
    };

    var runCode = function(codeToRun) {
        var module  = window[codeToRun];        
        var content = module.toString();
        content     = content.substring(content.indexOf("{") + 1, content.lastIndexOf("}"));

        var myScript = document.createElement("script");
        myScript.setAttribute("type","text/javascript");
        myScript.innerHTML += content;
        document.body.appendChild(myScript);
    };

    var runScrips = function() {
        for (var wrapper in depContainer) {
            var dependencies = depContainer[wrapper];
            var ready = true;
            dependencies.forEach(function(dep){
                if (fileReady.indexOf(dep) === -1) {
                    ready = false;
                } else if (fileApplicable.indexOf(dep) !== -1 && fileApplied.indexOf(dep) === -1 && dep !== dependencies[dependencies.length-1]) {
                    ready = false;
                }     
            }); 

            if (ready) {
                runCode(wrapper);
                fileApplied.push(dependencies[dependencies.length-1]);
                delete depContainer[wrapper];
            };
        }
    };

    var loadScript = function(url) {
        var script    = document.createElement('script');
        script.type   = 'text/javascript';
        script.async  = true;
        script.src    = url;
        script.onload = function() {
            fileReady.push(url);
            runScrips();                        
        };

        document.getElementsByTagName('head')[0].appendChild(script);
    };

    return {
        ifReady : ifReady
    };

}());
