
import {ProjectSettings} from 'microdocs-core-ts/dist/domain';

export interface ProjectSettingsRepository{

  getSettings():ProjectSettings;

}