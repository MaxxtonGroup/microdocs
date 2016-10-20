"use strict";
var schema_helper_1 = require("../schema/schema.helper");
/**
 * Helper for applying custom settings
 * @author Steven Hermans
 */
var MicroDocsPreProcessor = (function () {
    function MicroDocsPreProcessor() {
    }
    /**
     * Resolve project on different levels: global, env, group and project
     * @param settings
     * @param project
     * @param env
     * @returns {Project}
     */
    MicroDocsPreProcessor.processProject = function (settings, project, env) {
        // load variables
        var variables = {};
        if (settings.global && settings.global['_variables']) {
            Object.assign(variables, settings.global['_variables']);
            delete settings.global['_variables'];
        }
        if (settings.environments && settings.environments[env] && settings.environments[env]['_variables']) {
            Object.assign(variables, settings.environments[env]['_variables']);
            delete settings.environments[env]['_variables'];
        }
        if (project.info && project.info.group && settings.groups && settings.groups[project.info.group] && settings.groups[project.info.group]['_variables']) {
            Object.assign(variables, settings.groups[project.info.group]['_variables']);
            delete settings.groups[project.info.group]['_variables'];
        }
        if (project.info && project.info.title && settings.projects && settings.projects[project.info.title] && settings.projects[project.info.title]['_variables']) {
            Object.assign(variables, settings.projects[project.info.title]['_variables']);
            delete settings.projects[project.info.title]['_variables'];
        }
        console.error(variables);
        // process project
        if (settings.global) {
            project = MicroDocsPreProcessor.process(project, settings.global, variables);
        }
        if (settings.environments && settings.environments[env]) {
            project = MicroDocsPreProcessor.process(project, settings.environments[env], variables);
        }
        if (project.info && project.info.group && settings.groups && settings.groups[project.info.group]) {
            project = MicroDocsPreProcessor.process(project, settings.groups[project.info.group], variables);
        }
        if (project.info && project.info.title && settings.projects && settings.projects[project.info.title]) {
            project = MicroDocsPreProcessor.process(project, settings.projects[project.info.title], variables);
        }
        return project;
    };
    /**
     * Resolve project with given settings
     * @param project
     * @param settings
     * @param projectScope
     * @param settingsScope
     * @param variables
     * @returns {any}
     */
    MicroDocsPreProcessor.process = function (project, settings, variables, projectScope, settingsScope) {
        if (variables === void 0) { variables = {}; }
        if (settingsScope === undefined) {
            settingsScope = settings;
        }
        if (projectScope === undefined) {
            projectScope = project;
        }
        variables['project'] = project;
        variables['scope'] = projectScope;
        variables['settingsScope'] = settingsScope;
        variables['settings'] = settings;
        if (Array.isArray(settingsScope)) {
            if (projectScope == null) {
                projectScope = [];
            }
            if (Array.isArray(projectScope)) {
                for (var i = 0; i < settingsScope.length; i++) {
                    projectScope.push(MicroDocsPreProcessor.process(project, settings, variables, null, settingsScope[i]));
                }
            }
            else {
                console.warn('Could not process array when it is not one');
            }
        }
        else if (typeof (settingsScope) == "object") {
            if (projectScope == null || typeof (projectScope) !== 'object') {
                projectScope = {};
            }
            for (var key in settingsScope) {
                var newSettingsScope = settingsScope[key];
                if (!newSettingsScope) {
                    newSettingsScope = {};
                }
                var resolvedKey = schema_helper_1.SchemaHelper.resolveString(key, variables);
                if (resolvedKey) {
                    if (resolvedKey.indexOf('{') == 0 && resolvedKey.indexOf('}') == resolvedKey.length - 1) {
                        var variableName = resolvedKey.substring(1, resolvedKey.length - 1);
                        var oldVarValue = variables[variableName];
                        if (Array.isArray(projectScope)) {
                            var newProjectScopes = [];
                            for (var existingKey = 0; existingKey < projectScope.length; existingKey++) {
                                variables[variableName] = existingKey;
                                var newProjectScope = projectScope[existingKey];
                                if (!newProjectScope) {
                                    newProjectScope = null;
                                }
                                newProjectScope = MicroDocsPreProcessor.process(project, settings, variables, newProjectScope, newSettingsScope);
                                newProjectScopes.push(newProjectScope);
                                // clean up
                                if (oldVarValue) {
                                    variables[variableName] = oldVarValue;
                                }
                                else {
                                    delete variables[variableName];
                                }
                            }
                        }
                        else {
                            var newProjectScopes = {};
                            for (var existingKey in projectScope) {
                                variables[variableName] = existingKey;
                                var newProjectScope = projectScope[existingKey];
                                if (!newProjectScope) {
                                    newProjectScope = null;
                                }
                                newProjectScope = MicroDocsPreProcessor.process(project, settings, variables, newProjectScope, newSettingsScope);
                                newProjectScopes[existingKey] = newProjectScope;
                                // clean up
                                if (oldVarValue) {
                                    variables[variableName] = oldVarValue;
                                }
                                else {
                                    delete variables[variableName];
                                }
                            }
                        }
                        projectScope = newProjectScopes;
                    }
                    else {
                        if (Array.isArray(projectScope)) {
                            console.warn("Could process array as object");
                        }
                        else {
                            var newProjectScope = projectScope[resolvedKey];
                            if (!newProjectScope) {
                                newProjectScope = null;
                            }
                            newProjectScope = MicroDocsPreProcessor.process(project, settings, variables, newProjectScope, newSettingsScope);
                            if (newProjectScope != undefined) {
                                projectScope[resolvedKey] = newProjectScope;
                            }
                        }
                    }
                }
            }
        }
        else if (typeof (settingsScope) === 'string') {
            var resolvedValue = schema_helper_1.SchemaHelper.resolveString(settingsScope, variables);
            if (resolvedValue != undefined) {
                projectScope = resolvedValue;
            }
        }
        else {
            projectScope = settingsScope;
        }
        return projectScope;
    };
    return MicroDocsPreProcessor;
}());
exports.MicroDocsPreProcessor = MicroDocsPreProcessor;
