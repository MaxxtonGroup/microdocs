import { Settings } from "../domain/settings.model";


export abstract class SettingsRepository {

  public abstract async getSettings(): Promise<Settings>;

}