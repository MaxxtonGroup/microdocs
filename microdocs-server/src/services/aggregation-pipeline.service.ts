import { Project, Problem, ProjectTree } from "@maxxton/microdocs-core/domain";
import { pipe } from "./aggregation/aggregation-pipeline";
import { Injection } from "../injections";
/**
 * @author Steven Hermans
 */
export class AggregationPipelineService {

  constructor( private injection:Injection ) {
  }

  reindex( env:string, maxAmount:number = 1 ):ProjectTree {
    return pipe( this.injection, env )
        .takeLatest( maxAmount )
        .preProcess()
        .combineIncludes()
        .resolveRestDependencies()
        .buildTags()
        .storeIndex()
        .storeProjects()
        .asTree();
  }

  reindexAll( env:string ):ProjectTree {
    return pipe( this.injection, env )
        .takeEverything()
        .preProcess()
        .combineIncludes()
        .resolveRestDependencies()
        .buildTags()
        .storeIndex()
        .storeProjects()
        .asTree();
  }

  checkProject( env:string, report:Project ):Problem[] {
    let problems        = pipe( this.injection, env )
        .take( report )
        .preProcess()
        .combineIncludes()
        .resolveRestDependencies( report )
        .asProblems();
    let reverseProblems = pipe( this.injection, env )
        .takeLatest()
        .preProcess()
        .combineIncludes()
        .resolveRestDependencies( report )
        .asProblems();
    return problems.concat( reverseProblems );
  }

}




