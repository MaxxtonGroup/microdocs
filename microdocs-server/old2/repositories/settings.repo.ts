import { Settings } from "@maxxton/microdocs-core/domain";


export abstract class SettingsRepository {

  public abstract async getSettings(): Promise<Settings>;

}