
import { Hook } from './hook';
import { AggregationPipeline } from '../aggregation-pipeline';
import { Injection } from '../../../injections';
import { PostmanService } from '../../postman.service';

export class PostmanHook implements Hook {

  public run( pipeline: AggregationPipeline, injection: Injection ): void {
    const postmanService = new PostmanService(injection);
    const result = pipeline.result;
    result.getProjects().forEach(title => {
      const version = result.getLatestProjectVersion(title);
      if (version != null) {
        const project = result.getProject(title, version);
        if (project != null) {
          postmanService.syncCollection(project, pipeline.env);
        }
      }
    });
  }

}

export const postmanSync = new PostmanHook();
