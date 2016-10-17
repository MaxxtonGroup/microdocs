
import {ProjectSettings, Environments} from 'microdocs-core-ts/dist/domain';

export interface ProjectSettingsRepository{
  
  getEnvs(): {[name: string]: Environments};

  getSettings():ProjectSettings;

}