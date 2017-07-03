
import { Hook } from './hook';
import { AggregationPipeline } from '../aggregation-pipeline';
import { Injection } from '../../../injections';
import { PostmanService } from '../../postman.service'

export class PostmanHook implements Hook {

  public run( pipeline:AggregationPipeline, injection: Injection ):void {
    let postmanService = new PostmanService(injection);
    let result = pipeline.result;
    result.getProjects().forEach(title => {
      let version = result.getLatestProjectVersion(title);
      if(version != null){
        let project = result.getProject(title, version);
        if(project != null){
          postmanService.syncCollection(project, pipeline.env);
        }
      }
    });
  }

}

export const postmanSync = new PostmanHook();