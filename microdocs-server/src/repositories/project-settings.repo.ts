
import {ProjectSettings, Environments} from '@maxxton/microdocs-core/domain';
import { Settings } from "../domain/settings.model";
import { Metadata } from "../domain/metadata.model";

export interface ProjectSettingsRepository {

  getSettings(): Settings;

  getProjectSettings(): ProjectSettings;

  getMetadata(): Metadata;

  saveMetadata(metadata: Metadata): void;



}
