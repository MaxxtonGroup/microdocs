import {ProjectLink} from "./project-link.model";
export class ProjectInfo {

  private versions:string[];

  constructor(public title: string,
              public group: string,
              public version: string,
              versions: string[],
              public links ?: ProjectLink[],
              public description?: string,
              public sourceLink?: string,
              public publishTime?:string,
              public updateTime?:string) {
    this.setVersions(versions);
  }

  public getVersions():string[]{
    return this.versions.sort();
  }

  setVersions(val:string[] ):void{
    this.versions = val;
  }

  /**
   * Get the ProjectInfo of different version
   * @param version the new version
   * @return {ProjectInfo,null} new ProjectInfo or null if the version doesn't exists
   */
  public getVersion(version: string): ProjectInfo {
    if (this.getVersions().filter(v => v == version).length == 0) {
      return null;
    }
    return new ProjectInfo(this.title, this.group, version, this.getVersions());
  }

  /**
   * Get the previous version
   * @return {ProjectInfo,null} new ProjectInfo or null if the version doesn't exists
   */
  public getPrevVersion(): ProjectInfo {
    var sortedVersions = this.getVersions().sort();
    var index = sortedVersions.indexOf(this.version);
    index--;
    if (index >= 0 && sortedVersions[index] != undefined) {
      return this.getVersion(sortedVersions[index]);
    }
    return null;
  }

  public toJson():string{
    let output:any = {
      title: this.title,
      group: this.group,
      version: this.version,
      versions: this.getVersions(),
      description: this.description,
      links: this.links,
      sourceLink: this.sourceLink,
      publishTime: this.publishTime,
      updateTime: this.updateTime
    };
    return JSON.stringify(output);
  }
}