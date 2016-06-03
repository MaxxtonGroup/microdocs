(function (document) {
    'use strict';

    var app = document.querySelector('#app');

    app.currentProject = null;
    app.settings = {caching: false};
    app.projects = {};
    app.groups = [];
    app.loading = true;

    // Sets app default base URL
    app.baseUrl = '/';
    app.settings['baseUrl'] = app.baseUrl;
    console.info(window.location.port);
    if (window.location.port === '') {  // if production
        app.baseUrl = "/microdocs/";
    }

    app.displayInstalledToast = function () {
        // Check to make sure caching is actually enabled—it won't be in the dev environment.
        if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
            Polymer.dom(document).querySelector('#caching-complete').show();
        }
    };

    app.updateVersion = function(){
        var version = app.$.mainToolbar.querySelector('#version-list').selected;
        console.info(this.currentProject + " - " + version + " - " + this.currentProject.version);
        if(this.currentProject != null && this.currentProject.version != version) {
            page.redirect(this.baseUrl + this.currentProject.group + "/" + this.currentProject.name + "/" + version);
            // this.setProject(this.currentProject.name, this.currentProject.group, version);
        }
    };

    app.setProject = function (name, group, version) {
        if (name != undefined && group != undefined) {
            if (!this.empty(this.projects[name])) {
                var project = this.projects[name];
                var versions = Object.keys(project).sort();
                var latestVersion = versions[versions.length - 1];
                if (version == undefined || this.empty(project[version])) {
                    version = latestVersion;
                }
                app.currentProject = project[version];
                console.info("go to: " + name + ":" + version);
                if (!app.currentProject.loaded) {
                    app.loadProject(app.currentProject, function (project) {
                        app.currentProject = {};
                        app.currentProject = project;
                    });
                }
            } else if (app.loading) {
                this.currentProject = {name: name, group: group, version: version, loaded: false};
            } else {
                this.currentProject = null;
                this.$.toast.text = 'Can\'t find: project ' + name + '. Redirected you to Home Page';
                this.$.toast.show();
                page.redirect(this.baseUrl);
            }

            // this.currentProject = name;
            // this.currentGroup = group;

            // Polymer.dom(document).querySelector('#mainToolbar .app-name').textContent = name;
            // Polymer.dom(document).querySelector('#mainToolbar .bottom-title').textContent = group;
        } else {
            this.currentProject = null;
            // this.currentGroup = null;
            // Polymer.dom(document).querySelector('#mainToolbar .app-name').textContent = "Microservice Documentation Tool";
            // Polymer.dom(document).querySelector('#mainToolbar .bottom-title').textContent = "Automatically documentate your microservice architecture";
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

    var baseUrl = app.baseUrl;

    app.getApiUrl = function (endpoint, params) {
        var url = baseUrl + "api/" + endpoint + ".php";
        var first = true;
        for (var key in params) {
            if (first) {
                url += "?";
            } else {
                url += "&";
            }
            url += key + "=" + params[key];
            first = false;
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

    fetch(app.getApiUrl("settings")).then(function (response) {
        if (response.status >= 400) {
            response.json().then(function (error) {
                console.error(error.message);
                app.$.toast.text = "Failed to load Settings. " + error.message;
                app.$.toast.show();
            }).catch(function(e){
                console.error(e);
                app.$.toast.text = "Failed to load Settings.";
                app.$.toast.show();
            });;
        } else {
            response.json().then(function (settings) {
                for (var key in settings) {
                    app.settings[key] = settings[key];
                }
                var s = app.settings;
                app.settings = {};
                app.settings = s;
            }).catch(function (e) {
                console.error(e);
                app.$.toast.text = "Failed to load Settings";
                app.$.toast.show();
            });
        }
    }).catch(function (e) {
        console.error(e);
        app.$.toast.text = "Failed to load Settings";
        app.$.toast.show();
    });

    fetch(app.getApiUrl("projects")).then(function (response) {
        if (response.status >= 400) {
            response.json().then(function (error) {
                console.error(error.message);
                app.$.toast.text = "Failed to load projects. " + error.message;
                app.$.toast.show();
            }).catch(function(e){
                console.error(e);
                app.$.toast.text = "Failed to load projects.";
                app.$.toast.show();
            });;
        } else {
            response.json().then(function (projectsInfo) {
                projectsInfo.projects.forEach(function (project) {
                    if (app.empty(app.projects[project.name])) {
                        // app.set(['projects', project.name], {});
                        app.projects[project.name] = {};
                    }
                    project.versions.forEach(function (version) {
                        if (app.empty(app.projects[project.name][version])) {
                            // app.set(['projects', project.name, version], {});
                            app.projects[project.name][version] = {
                                name: project.name,
                                group: project.group,
                                version: version,
                                versions: project.versions,
                                loaded: false
                            };
                        }
                    });

                    var properties = Object.keys(project);
                    properties.forEach(function (property) {
                        // app.set(['projects', project.name, version, property], project[property]);
                        app.projects[project.name][project.version][property] = project[property];
                    });
                    app.projects[project.name][project.version]['loaded'] = false;
                });
                var projects = app.projects;
                app.projects = {};
                app.projects = projects;

                app.groups = projectsInfo.groups;
                app.loading = false;

                if (app.currentProject != null) {
                    app.setProject(app.currentProject.name, app.currentProject.group, app.currentProject.version);
                }
            }).catch(function (e) {
                console.error(e);
                app.$.toast.text = "Failed to load projects";
                app.$.toast.show();
            });
        }
    }).catch(function (e) {
        console.error(e);
        app.$.toast.text = "Failed to load projects";
        app.$.toast.show();
    });

    app.empty = function (obj) {
        if (obj == undefined || obj == null) {
            return true;
        }
        if (obj.length && obj.length == 0) {
            return true;
        }
        return false;
    };

    app.loadProject = function (project, callback) {
        if (project.loaded) {
            return;
        }
        console.info("load project: " + project.name + ":" + project.version);
        fetch(app.getApiUrl("project", {project: project.name, version: project.version})).then(function (response) {
            if(response.status >= 400){
                response.json().then(function (error) {
                    console.error(error.message);
                    app.$.toast.text = "Failed to load project " + project.name + ":" + project.version + ". " + error.message;
                    app.$.toast.show();
                }).catch(function(e){
                    console.error(e);
                    app.$.toast.text = "Failed to load project " + project.name + ":" + project.version;
                    app.$.toast.show();
                });
            }else{
                response.json().then(function(response){
                    var properties = Object.keys(response);
                    for (var i = 0; i < properties.length; i++) {
                        var key = properties[i];
                        if(key != 'name' && key != 'group' && key != 'version' && key != 'versions') {
                            project[key] = response[key];
                        }
                    }
                    project.loaded = true;
                    app.projects[project.name][project.version] = project;
                    project['loadError'] = false;
                    callback(project);
                }).catch(function (e) {
                    console.error(e);
                    project['loadError'] = true;
                    app.$.toast.text = "Failed to load project " + project.name + ":" + project.version;
                    app.$.toast.show();
                });;
            }
        }).catch(function (e) {
            console.error(e);
            project['loadError'] = true;
            app.$.toast.text = "Failed to load project " + project.name + ":" + project.version;
            app.$.toast.show();
        });
    };

})(document);
