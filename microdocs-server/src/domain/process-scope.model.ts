
import { DocumentCacheHelper } from "../helpers/processor/document-cache.helper";
import { DependenciesUsedHelper } from "../helpers/processor/dependencies-used.helper";
import { DependenciesRestHelper } from "../helpers/processor/dependencies-rest.helper";

export interface ProcessContext {

  documentCache?:DocumentCacheHelper;
  dependenciesUsedHelper?:DependenciesUsedHelper;
  dependenciesRestHelper?:DependenciesRestHelper;
  strict?:boolean;

}