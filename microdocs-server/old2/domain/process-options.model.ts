
import { Environment } from "@maxxton/microdocs-core/domain";
import { Project } from "@maxxton/microdocs-core/domain";

export interface ProcessOptions {

  /**
   * environment to process
   */
  env: Environment;

  /**
   * Only process this project
   */
  projectTitle?: string;

  /**
   * Check project reverse
   */
  reverseChecking: boolean;

  /**
   * Only process this document
   */
  documentId?: string;

  /**
   * Strict problem checking
   */
  strict: boolean;

  /**
   * Don't persist result
   */
  dryRun: boolean;

  /**
   * Document to add to the cache
   */
  document?: Project;

}