/**
 * System configuration for Angular 2 clients
 */
(function (global) {

    // map tells the System loader where to look for things
    var map = {
        'rxjs': 'rxjs',
        'angular2-google-maps': 'angular2-google-maps',
        '@angular': '@angular'
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app': {main: 'main.js', defaultExtension: 'js'},
        'rxjs': {defaultExtension: 'js'},
        'components': {defaultExtension: 'js'},
        'routes': {defaultExtension: 'js'},
        'services': {defaultExtension: 'js'},
        'panels': {defaultExtension: 'js'},
        'filters': {defaultExtension: 'js'},
        'config': {defaultExtension: 'js'},
        'pipes': {defaultExtension: 'js'},

        '@maxxton/components': {defaultExtension: 'js'},
        '@maxxton/components/dist/helpers': {main: 'index.js', defaultExtension: 'js'},
        '@maxxton/components/dist/components': {main: 'index.js', defaultExtension: 'js'},
        '@maxxton/components/dist/services': {main: 'index.js', defaultExtension: 'js'},
        '@maxxton/components/dist/filters': {main: 'index.js', defaultExtension: 'js'},

        'microdocs-core-ts': {defaultExtension: 'js'},
        'microdocs-core-ts/dist/domain': {main: 'index.js', defaultExtension: 'js'},
        'microdocs-core-ts/dist/helpers': {main: 'index.js', defaultExtension: 'js'},

        'angular2-prettyjson': {main: 'index.js', defaultExtension: 'js'},
        'd3': {main: 'd3.min.js', defaultExtension: 'js'},

        'angular2-google-maps/core': {main: 'core.umd.js', defaultExtension: 'js'},
        '@angular/router': {main: 'index.js', defaultExtension: "js"}
    };

    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'router-deprecated'
    ];


    // Individual files (~300 requests):
    function packIndex(pkgName) {
        packages['@angular/' + pkgName] = {main: 'index.js', defaultExtension: 'js'};
    }

    // Bundled (~40 requests):
    function packUmd(pkgName) {
        packages['@angular/' + pkgName] = {main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js'};
    }

    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;

    ngPackageNames.forEach(setPackageConfig);

    var config = {
        map: map,
        packages: packages
    };

    System.config(config);

})(this);