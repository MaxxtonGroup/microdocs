import * as projectRepo from '../repositories/json/project-json.repo';
import {ProjectInfo} from "../domain/project-info.model";

class AggregationService {

    public static bootstrap():AggregationService {
        return new AggregationService();
    }

    public reindex():ProjectInfo[] {
        return projectRepo.getProjects();
    }

}

var aggregationService = AggregationService.bootstrap();
export = aggregationService;