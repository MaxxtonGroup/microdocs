"use strict";
var ProjectInfo = (function () {
    function ProjectInfo(title, group, version, versions, links, description, sourceLink) {
        this.title = title;
        this.group = group;
        this.version = version;
        this.versions = versions;
        this.links = links;
        this.description = description;
        this.sourceLink = sourceLink;
    }
    /**
     * Get the ProjectInfo of different version
     * @param version the new version
     * @return {ProjectInfo,null} new ProjectInfo or null if the version doesn't exists
     */
    ProjectInfo.prototype.getVersion = function (version) {
        if (this.versions.filter(function (v) { return v == version; }).length == 0) {
            return null;
        }
        return new ProjectInfo(this.title, this.group, version, this.versions);
    };
    /**
     * Get the previous version
     * @return {ProjectInfo,null} new ProjectInfo or null if the version doesn't exists
     */
    ProjectInfo.prototype.getPrevVersion = function () {
        var sortedVersions = this.versions.sort();
        var index = sortedVersions.indexOf(this.version);
        index--;
        if (index >= 0 && sortedVersions[index] != undefined) {
            return this.getVersion(sortedVersions[index]);
        }
        return null;
    };
    return ProjectInfo;
}());
exports.ProjectInfo = ProjectInfo;
