
import {ProjectSettings, Environments} from '@maxxton/microdocs-core/domain';

export interface ProjectSettingsRepository{
  
  getEnvs(): {[name: string]: Environments};

  getSettings():ProjectSettings;

}