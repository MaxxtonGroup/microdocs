import { Environment } from "../domain/environment.model";
import { App } from '@webscale/boot';
import "reflect-metadata";
import { StorageConfig } from "../config/storage.config";

// Init app
const app = new App()
    .loadYamlFile(__dirname + "/../application.yml")
    .config(StorageConfig)
    .start();

module.exports = function(env:Environment, projectTitle:string, reportId:string, callback:(e:any, arg?:any) => void){
  try{
    setTimeout(() => {
      callback(null, "done");

    }, 5000);
  }catch(e){
    callback(e);
  }
};