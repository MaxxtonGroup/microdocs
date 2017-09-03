
import { AggregationPipeline } from '../aggregation-pipeline';
import { Injection } from '../../../injections';

/**
 * Action to run after the pipeline has completed
 */
export interface Hook {

  /**
   * Run when the pipeline has completed
   * @param pipeline the aggregation pipeline
   */
  run( pipeline: AggregationPipeline ): void;

}