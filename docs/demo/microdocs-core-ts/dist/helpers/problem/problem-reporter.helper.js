"use strict";
var schema_helper_1 = require("../schema/schema.helper");
var ProblemReporter = (function () {
    function ProblemReporter(rootObject) {
        this.rootObject = rootObject;
        this.problems = [];
    }
    ProblemReporter.prototype.report = function (level, description, component, method, clientRootObject, clientTitle, clientVersion, clientComponent, clientMethod) {
        var problem = { level: level, message: description };
        // log component info
        if (component != undefined) {
            component = schema_helper_1.SchemaHelper.resolveObject(component, this.rootObject);
            if (component != null && component != undefined && component.name != undefined && component.name != null) {
                problem.path = component.file;
                var fullName = component.name;
                var segments = fullName.split('.');
                if (segments.length > 0) {
                    problem.package = fullName.substring(0, fullName.length - segments[segments.length - 1].length - 1);
                    problem.className = segments[segments.length - 1];
                }
            }
        }
        // log method info
        if (method != undefined) {
            method = schema_helper_1.SchemaHelper.resolveObject(method, this.rootObject);
        }
        if (method != null) {
            problem.lineNumber = method.lineNumber;
        }
        // log client info
        if (clientRootObject != undefined && clientTitle != undefined) {
            var client = { title: clientTitle, version: clientVersion };
            client.title = clientTitle;
            client.version = clientVersion;
            // log client component info
            if (clientComponent != undefined) {
                clientComponent = schema_helper_1.SchemaHelper.resolveObject(clientComponent, clientRootObject);
                if (clientComponent != null && clientComponent != undefined && clientComponent.name != undefined && clientComponent.name != null) {
                    client.path = clientComponent.file;
                    var fullName = clientComponent.name;
                    var segments = fullName.split('.');
                    if (segments.length > 0) {
                        client.package = fullName.substring(0, fullName.length - segments[segments.length - 1].length - 1);
                        client.className = segments[segments.length - 1];
                    }
                }
            }
            // log client method info
            if (clientMethod != undefined) {
                clientMethod = schema_helper_1.SchemaHelper.resolveObject(clientMethod, clientRootObject);
            }
            if (clientMethod != null) {
                client.lineNumber = clientMethod.lineNumber;
                if (clientMethod['sourceLink']) {
                    client.sourceLink = clientMethod['sourceLink'];
                }
            }
            problem.client = client;
        }
        this.problems.push(problem);
    };
    ProblemReporter.prototype.hasProblems = function () {
        return this.problems.length > 0;
    };
    /**
     * Publish the problem report to the corresponding object and increase the problem count
     * @param object corresponding object
     * @param project object which holds the problemCount
     */
    ProblemReporter.prototype.publish = function (object, project) {
        if (object.problems == undefined || object.problems == null) {
            object.problems = [];
        }
        this.problems.forEach(function (problem) { return object.problems.push(problem); });
        if (project.problemCount == undefined || project.problemCount == null) {
            project.problemCount = this.problems.length;
        }
        else {
            project.problemCount += this.problems.length;
        }
    };
    ProblemReporter.prototype.getProblems = function () {
        return this.problems;
    };
    return ProblemReporter;
}());
exports.ProblemReporter = ProblemReporter;
