(function (document) {
    'use strict';

    var app = document.querySelector('#app');

    app.settings = {};

    app.projects = [];
    app.groups = [];

    // Sets app default base URL
    app.baseUrl = '/';
    if (window.location.port === '') {  // if production

    }

    app.displayInstalledToast = function () {
        // Check to make sure caching is actually enabled—it won't be in the dev environment.
        if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
            Polymer.dom(document).querySelector('#caching-complete').show();
        }
    };

    app.currentProject = null;
    app.currentGroup = null;

    app.setProject = function (name, group) {
        if (name != undefined && group != undefined) {
            this.currentProject = name;
            this.currentGroup = group;
            Polymer.dom(document).querySelector('#mainToolbar .app-name').textContent = name;
            Polymer.dom(document).querySelector('#mainToolbar .bottom-title').textContent = group;
        } else {
            this.currentProject = null;
            this.currentGroup = null;
            Polymer.dom(document).querySelector('#mainToolbar .app-name').textContent = "Microservice Documentation Tool";
            Polymer.dom(document).querySelector('#mainToolbar .bottom-title').textContent = "Automatically documentate your microservice architecture";
        }
    };

    // Listen for template bound event to know when bindings
    // have resolved and content has been stamped to the page
    app.addEventListener('dom-change', function () {
        console.log('Our app is ready to rock!');
    });

    window.addEventListener('WebComponentsReady', function () {

    });

    // Main area's paper-scroll-header-panel custom condensing transformation of
    // the appName in the middle-container and the bottom title in the bottom-container.
    // The appName is moved to top and shrunk on condensing. The bottom sub title
    // is shrunk to nothing on condensing.
    window.addEventListener('paper-header-transform', function (e) {
        var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
        var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
        var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
        var detail = e.detail;
        var heightDiff = detail.height - detail.condensedHeight;
        var yRatio = Math.min(1, detail.y / heightDiff);
        // appName max size when condensed. The smaller the number the smaller the condensed size.
        var maxMiddleScale = 0.50;
        var auxHeight = heightDiff - detail.y;
        var auxScale = heightDiff / (1 - maxMiddleScale);
        var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
        var scaleBottom = 1 - yRatio;

        // Move/translate middleContainer
        Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

        // Scale bottomContainer and bottom sub title to nothing and back
        Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

        // Scale middleContainer appName
        Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
    });

    // Scroll page to top and expand header
    app.scrollPageToTop = function () {
        app.$.headerPanelMain.scrollToTop(true);
    };

    app.closeDrawer = function () {
        app.$.paperDrawerPanel.closeDrawer();
    };

    app.getApiUrl = function (endpoint, params) {
        var url = "/api/" + endpoint + ".php";
        var first = true;
        for (var key in params) {
            if (first) {
                url += "?";
            } else {
                url += "&";
            }
            url += key + "=" + params[key];
        }
        return url;
    };

    app.getProjectUrl = function (endpoint) {
        var params = {};
        if (app.params != undefined && app.params.name != undefined) {
            params = {project: app.params['name']};
        }
        return this.getApiUrl(endpoint, params);
    };

    fetch(app.getApiUrl("settings")).then(function(response){
        return response.json();
    }).then(function(settings){
        for(var key in settings){
            app.settings[key] = settings[key];
        }
    }).catch(function(e){
        console.error(e);
    });

    fetch(app.getApiUrl("projects")).then(function(response){
        return response.json();
    }).then(function(projectsInfo){
        app.projects = projectsInfo.projects;
        app.groups = projectsInfo.groups;
    }).catch(function(e){
        console.error(e);
    });

})(document);
