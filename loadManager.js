var LoadManager = (function() {

    var depContainer  = {};

    var depReady      = [];
    var depRequested  = [];
    var codeReady     = [];
    var codeRequested = [];

    var waitFor = function (dependency) {

        dependency.forEach(function(url){
            if (depReady.indexOf(url) === -1 && depRequested.indexOf(url) === -1 ) {
                depRequested.push(url);
                loadScript(url, 'dependency');
            }
        });
        return {
            toLoad : function (code) {
                if (codeReady.indexOf(code) === -1 && codeRequested.indexOf(code) === -1 ) {
                    codeRequested.push(code);
                    loadScript(code, 'code');
                }
                depContainer[code]          = {};
                depContainer[code].dependOn = dependency;
                return {
                    wrappedIn: function(wrapper) {
                        depContainer[code].wrapped  = wrapper;
                    }
                };
            }
        };
    };

    var run =  function(codeToRun) {
        var module  = eval(codeToRun);
        var content = module.toString();
        content     = content.substring(content.indexOf("{") + 1, content.lastIndexOf("}"));
        eval(content);
    };

    var checkDepReady = function(depend) {
        var value = true;
        depend.dependOn.forEach(function(dep) {
            if (depReady.indexOf(dep) === -1) {
                value = false;
            }
        });
        return value;
    };

    var runScrips = function() {
        for (var key in depContainer) {
            if ((checkDepReady(depContainer[key])===true && codeReady.indexOf(key) !== -1)) {
                run(depContainer[key].wrapped);
                delete depContainer[key];
            }
        }
    };

    var loadScript = function(url, type) {
        var script    = document.createElement('script');
        script.type   = 'text/javascript';
        script.async  = true;
        script.src    = url;
        script.onload = function() {
            if (type==='dependency') {
                depReady.push(url);
            } else {
                codeReady.push(url);
            }

            runScrips();
        };

        document.getElementsByTagName('head')[0].appendChild(script);
    };

    return {
        waitFor : waitFor
    };

}());