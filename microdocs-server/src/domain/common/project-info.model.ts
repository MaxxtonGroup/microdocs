import {ProjectLink} from "./project-link.model";
export class ProjectInfo {
    constructor(
        public title:string,
        public group:string,
        public version:string,
        public versions:string[],
        public links ?: ProjectLink[],
        public description?:string){}

    /**
     * Get the ProjectInfo of different version
     * @param version the new version
     * @return {ProjectInfo,null} new ProjectInfo or null if the version doesn't exists
     */
    public getVersion(version:string):ProjectInfo {
        if(this.versions.filter(v => v == version).length == 0){
            return null;
        }
        return new ProjectInfo(this.title, this.group, version, this.versions, this.links, this.description);
    }

    /**
     * Get the previous version
     * @return {ProjectInfo,null} new ProjectInfo or null if the version doesn't exists
     */
    public getPrevVersion() : ProjectInfo{
        var sortedVersions = this.versions.sort();
        var index = sortedVersions.indexOf(this.version);
        index--;
        if(index >= 0 && sortedVersions[index] != undefined){
            return this.getVersion(sortedVersions[index]);
        }
        return null;
    }
}