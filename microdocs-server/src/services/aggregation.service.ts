import { Project, Problem, ProjectTree } from "@maxxton/microdocs-core/domain";
import { pipe, postmanSync } from "../indexer/engine";
import { Environment } from "../domain/environment.model";

/**
 * @author Steven Hermans
 */
export class AggregationService {

  constructor() {
  }

  public

//  reindex( env: Environment, maxAmount: number = 1 ): ProjectTree {
//    return pipe( env )
//        .takeLatest( maxAmount )
//        .preProcess()
//        .combineIncludes()
//        .resolveRestDependencies()
//        .resolveUsesDependencies()
//        .buildTags()
//        .storeIndex()
//        .storeProjects()
//        .postAction( postmanSync )
//        .asTree();
//  }
//
//  reindexAll( env: Environment ): ProjectTree {
//    return pipe( env )
//        .takeEverything()
//        .preProcess()
//        .combineIncludes()
//        .resolveRestDependencies()
//        .resolveUsesDependencies()
//        .buildTags()
//        .storeIndex()
//        .storeProjects()
//        .postAction( postmanSync )
//        .asTree();
//  }
//
//  checkProject( env: Environment, report: Project ): Problem[] {
////    report.info.version = Number.MAX_VALUE + '.0.0';
////    report.info.getVersions().push(report.info.version);
//    let problems = pipe( env )
//        .takeLatest()
//        .remove( report.info.title )
//        .take( report )
//        .preProcess()
//        .combineIncludes()
//        .resolveRestDependencies( report )
//        .resolveUsesDependencies( report )
//        .asProblems();
//    return problems;
//  }

}




