import { App } from '@webscale/boot';
import "reflect-metadata";
import { WebConfig } from "./config/web.config";
import { StorageConfig } from "./config/storage.config";

// Init app
const app = new App()
  .loadYamlFile(__dirname + "/application.yml")
  .config(StorageConfig)
  .config(WebConfig)
  .start();
