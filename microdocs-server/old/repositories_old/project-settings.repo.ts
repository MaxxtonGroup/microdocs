
import {ProjectSettings, Environments} from '@maxxton/microdocs-core/domain';
import { Settings } from "../../src/domain/settings.model";
import { Metadata } from "../../src/domain/metadata.model";

export interface ProjectSettingsRepository{
  
  getSettings(): Settings;

  getProjectSettings():ProjectSettings;

  getMetadata(): Metadata;

  saveMetadata(metadata:Metadata):void;



}