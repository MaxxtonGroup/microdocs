import { Pipe } from "../../pipe";
import { Project } from "@maxxton/microdocs-core/domain/project.model";
import { AggregationPipeline } from "../../aggregation-pipeline";
import { ProjectInfo } from "@maxxton/microdocs-core/domain/common/project-info.model";

export class PipeMock extends Pipe<Pipe<any>> {

  constructor( public _store:{[title:string]:{[version:string]:Project}} ) {
    super( new AggregationPipeline( 'test', null, null, null ) );
  }

  protected run():Pipe<any> {
    return undefined;
  }

  getPrevProject( title:string, version:string ):Project {
    if ( !version ) {
      let sortedVersions = Object.keys( this._store[ title ] ).sort();
      version            = sortedVersions[ sortedVersions.length - 1 ];
    }
    return this._store && this._store[ title ] && this._store[ title ][ version ];
  }

  get projects():ProjectInfo[] {
    let projectInfos:ProjectInfo[] = [];
    for ( let title in this._store ) {
      let sortedVersions = Object.keys( this._store[ title ] ).sort();
      let projectInfo    = new ProjectInfo( title, 'group', sortedVersions[ sortedVersions.length - 1 ], sortedVersions );
      projectInfos.push( projectInfo );
    }
    return projectInfos;
  }

}