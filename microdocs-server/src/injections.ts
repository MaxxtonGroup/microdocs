import {ProjectRepository} from "./repositories/project.repo";
import {ProjectSettingsRepository} from "./repositories/project-settings.repo";
import {ReportRepository} from "./repositories/report.repo";
import {ProjectService} from "./services/project.service";
import {AggregationService} from "./services/aggregation.service";
import {ProjectJsonRepository} from "./repositories/json/project-json.repo";
import {ReportJsonRepository} from "./repositories/json/report-json.repo";
import {ProjectSettingsJsonRepository} from "./repositories/json/project-settings-json.repo";
import { AggregationPipeline } from "./services/aggregation/aggregation-pipeline";
import { AggregationService } from "./services/aggregation.service";
/**
 * @author Steven Hermans
 */
export interface InjectionConfig {
  
  projectRepository:new () => ProjectRepository;
  projectSettingsRepository:new () => ProjectSettingsRepository;
  reportRepository:new () => ReportRepository;
  
  projectService:new (projectRepo:ProjectRepository) => ProjectService;
  aggregationService:new (injection:Injection) => AggregationService;
  
}

export class DefaultInjectionConfig implements InjectionConfig{
  
  projectRepository = ProjectJsonRepository;
  projectSettingsRepository = ProjectSettingsJsonRepository;
  reportRepository = ReportJsonRepository;
  projectService = ProjectService;
  aggregationService = AggregationService;
  
}

export class Injection{
  
  constructor(private config:InjectionConfig = new DefaultInjectionConfig()){}
  
  public ProjectRepository():ProjectRepository{
    return new this.config.projectRepository();
  }
  
  public ProjectSettingsRepository():ProjectSettingsRepository{
    return new this.config.projectSettingsRepository();
  }
  
  public ReportRepository():ReportRepository{
    return new this.config.reportRepository();
  }
  
  public ProjectService():ProjectService{
    return new this.config.projectService(
      this.ProjectRepository()
    );
  }
  
  public AggregationService():AggregationService{
    return new this.config.aggregationService(this);
  }
  
}