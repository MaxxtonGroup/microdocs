import { Environment } from "../domain/environment.model";
import { App } from '@webscale/boot';
import "reflect-metadata";
import { StorageConfig } from "../config/storage.config";
import { Container } from "typedi";
import { ProcessService } from "../services/process.service";

// Init app
const app = new App()
    .loadYamlFile(__dirname + "/../application.yml")
    .config(StorageConfig)
    .start();

module.exports = function(env:Environment, projectTitle:string, reportId:string, callback:(e:any, arg?:any) => void){
  try{
    let processService = Container.get(ProcessService);
    processService.processAll(env).then(result => {
      callback(null, result);
    }).catch(e => {
      callback(e);
    });
  }catch(e){
    callback(e);
  }
};