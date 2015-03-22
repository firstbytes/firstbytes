// JSHINT

var Code = function() {
    var buildSrcSimple, buildSrc, analyze, size = 500;
    buildSrcSimple = function(src) {
        // don't require defining draw/setup functions
        // think we always want to require the namespacing for now
        // this may change if we seek interoperability with KA sketches
        // src = 'FB.draw = function() {' + src + '\n;};';
        return buildSrc(src);
    };
    buildSrc = function(src) {
        src = 'var FB = new Processing(canvas, function(FB){' +
            '_fb_init(FB, ' + size + ');' +
            'with(FB){' +
                src + '\n;' +
            '}' +
        '}); kill = function(){FB.exit();}';
        return src;
    };
    analyze = function(src) {
        // var props = Object.getOwnPropertyNames(new Processing());
        // var hintDirective = '/* global ';
        //     hintDirective += props.map(function(p) { return p + ':false'; }).join(', ');
        //     hintDirective += '*/';

        var hintDirective = '';
        JSHINT(hintDirective + src); // yucky global state
        // console.log(JSHINT.data(), JSHINT.errors);
        return JSHINT.data();
    };
    return {
        prep: function(src) {
            // super hacky check to decide how to build the source uri
            // should consider something like structeredjs for inspecting source code
            var build = (src.indexOf('draw') === -1) ? buildSrcSimple : buildSrc;
            var analysis = analyze(src); // if errors, don't build
            if (analysis.errors && analysis.errors.length) return false;
            return build(src);
        }
    };
};