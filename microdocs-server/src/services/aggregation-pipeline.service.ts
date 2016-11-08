import { Project, Problem } from "@maxxton/microdocs-core/domain";
import { pipe, defaultPreProcessor } from "./aggregation/aggregation-pipeline";
import { Injection } from "../injections";
/**
 * @author Steven Hermans
 */
export class AggregationPipelineService {

  constructor(private injection:Injection){}

  reindex( env:string, ):ProjectTree {
    return pipe( this.injection, env )
        .setPreProcessor(defaultPreProcessor())
        .takeLatest()
        .combineIncludes()
        .resolveDependencies()
        .storeIndex()
        .storeProjects()
        .asTree();
  }

  reindexAll( env:string ):ProjectTree {
    return pipe( this.injection, env )
        .takeEverything()
        .combineIncludes()
        .resolveDependencies()
        .storeIndex()
        .storeProjects()
        .asTree();
  }

  check( env:string, report:Project ):Problem[] {
    return pipe( this.injection, env )
        .take( report )
        .combineIncludes()
        .resolveDependencies()
        .resolveInvertDependencies()
        .asProblems();
  }

}




