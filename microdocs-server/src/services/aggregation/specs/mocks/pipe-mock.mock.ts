import { Pipe } from "../../pipe";
import { Project } from "@maxxton/microdocs-core/dist/domain/project.model";
import { AggregationPipeline } from "../../aggregation-pipeline";
import { ProjectInfo } from "@maxxton/microdocs-core/dist/domain/common/project-info.model";

export class PipeMock extends Pipe<Pipe<any>> {

  constructor( public _store: {[title: string]: {[version: string]: Project}} ) {
    super( new AggregationPipeline( 'test', null, null, null, null ) );
  }

  protected run(): Pipe<any> {
    return undefined;
  }

  getPrevProject( title: string, version: string ): Project {
    if ( !version ) {
      const sortedVersions = Object.keys( this._store[ title ] ).sort();
      version            = sortedVersions[ sortedVersions.length - 1 ];
    }
    return this._store && this._store[ title ] && this._store[ title ][ version ];
  }

  get projects(): Array<ProjectInfo> {
    const projectInfos: Array<ProjectInfo> = [];
    for ( const title in this._store ) {
      const sortedVersions = Object.keys( this._store[ title ] ).sort();
      const projectInfo    = new ProjectInfo( title, 'group', sortedVersions[ sortedVersions.length - 1 ], sortedVersions );
      projectInfos.push( projectInfo );
    }
    return projectInfos;
  }

}
