"use strict";
/**
 * @author Steven Hermans
 */
var TreeNode = (function () {
    function TreeNode(parent, dependencies, group, version, versions, problems, reference, tags) {
        if (parent === void 0) { parent = null; }
        if (dependencies === void 0) { dependencies = {}; }
        this.parent = parent;
        this.dependencies = dependencies;
        this.group = group;
        this.version = version;
        this.versions = versions;
        this.problems = problems;
        this.reference = reference;
        this.tags = tags;
    }
    TreeNode.prototype.getRoot = function () {
        if (this.parent != null) {
            return this.parent.getRoot();
        }
        return this;
    };
    TreeNode.prototype.findNodePath = function (title, version) {
        for (var key in this.dependencies) {
            if (key == title && this.dependencies[key].version == version) {
                return "/dependencies/" + title;
            }
            var path = this.dependencies[key].findNodePath(title, version);
            if (path != null) {
                return "/dependencies/" + title + path;
            }
        }
        return null;
    };
    TreeNode.prototype.unlink = function (root) {
        if (root === void 0) { root = true; }
        var dependencies = {};
        for (var key in this.dependencies) {
            var child = this.dependencies[key];
            dependencies[key] = child.unlink(false);
        }
        if (root) {
            return dependencies;
        }
        var node = {};
        if (Object.keys(dependencies).length > 0) {
            node['dependencies'] = dependencies;
        }
        if (this.group != null || this.group != undefined) {
            node['group'] = this.group;
        }
        if (this.version != null || this.version != undefined) {
            node['version'] = this.version;
        }
        if (this.versions != null || this.versions != undefined) {
            node['versions'] = this.versions;
        }
        if (this.problems != null || this.problems != undefined) {
            node['problems'] = this.problems;
        }
        if (this.reference != null || this.reference != undefined) {
            node['$ref'] = "#" + this.reference.substring("#/dependencies".length);
        }
        if (this.tags != null || this.tags != undefined) {
            node['tags'] = this.tags;
        }
        return node;
    };
    TreeNode.link = function (unlinkedNode, root) {
        if (root === void 0) { root = true; }
        var node = new TreeNode();
        var dependencyNode = (root ? unlinkedNode : unlinkedNode['dependencies']);
        if (dependencyNode != undefined) {
            for (var key in dependencyNode) {
                node.dependencies[key] = TreeNode.link(dependencyNode[key], false);
                node.dependencies[key].parent = node;
            }
        }
        if (!root) {
            if (unlinkedNode['group'] != undefined) {
                node.group = unlinkedNode['group'];
            }
            if (unlinkedNode['version'] != undefined) {
                node.version = unlinkedNode['version'];
            }
            if (unlinkedNode['versions'] != undefined) {
                node.versions = unlinkedNode['versions'];
            }
            if (unlinkedNode['problems'] != undefined) {
                node.problems = unlinkedNode['problems'];
            }
            if (unlinkedNode['$ref'] != undefined) {
                node.reference = "#/dependencies" + unlinkedNode['$ref'].substring(1);
            }
            if (unlinkedNode['tags'] != undefined) {
                node.tags = unlinkedNode['tags'];
            }
        }
        return node;
    };
    return TreeNode;
}());
exports.TreeNode = TreeNode;
