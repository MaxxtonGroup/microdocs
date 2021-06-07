import { Project, Problem, ProjectTree } from "@maxxton/microdocs-core/domain";
import { pipe } from "./aggregation/aggregation-pipeline";
import { Injection } from "../injections";
import { postmanSync } from "./aggregation/hooks";

/**
 * @author Steven Hermans
 */
export class AggregationService {

  constructor( private injection: Injection ) {
  }

  reindex( env: string, maxAmount: number = 1 ): ProjectTree {
    return pipe( this.injection, env )
        .takeLatest( maxAmount )
        .preProcess()
        .combineIncludes()
        .resolveRestDependencies()
        .resolveUsesDependencies()
        .buildTags()
        .storeIndex()
        .storeProjects()
        .postAction(postmanSync)
        .asTree();
  }

  reindexAll( env: string ): ProjectTree {
    return pipe( this.injection, env )
        .takeEverything()
        .preProcess()
        .combineIncludes()
        .resolveRestDependencies()
        .resolveUsesDependencies()
        .buildTags()
        .storeIndex()
        .storeProjects()
        .postAction(postmanSync)
        .asTree();
  }

  checkProject( env: string, report: Project ): Array<Problem> {
//    report.info.version = Number.MAX_VALUE + '.0.0';
//    report.info.getVersions().push(report.info.version);
    const problems = pipe( this.injection, env )
        .takeLatest()
        .remove( report.info.title )
        .take( report )
        .preProcess()
        .combineIncludes()
        .resolveRestDependencies( report )
        .resolveUsesDependencies( report )
        .asProblems();
    return problems;
  }

}




