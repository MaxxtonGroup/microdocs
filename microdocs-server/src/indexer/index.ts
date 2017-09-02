import { App } from '@webscale/boot';
import "reflect-metadata";

// Init app
const app = new App()
  .loadYamlFile(__dirname + "/application.yml")
  .start();