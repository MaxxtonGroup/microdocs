
import { Project } from "@maxxton/microdocs-core/domain";
import { Injection } from "../injections";
import { PostmanResponseHandler } from "../routes/responses/postman-response.handler";
import { PostmanClient } from "../client/postman.client";

export class PostmanService{

  constructor( private injection:Injection ) {
  }

  public syncCollection(project:Project, env:string):void{
    let settings = this.injection.ProjectSettingsRepository().getSettings();
    let apiKey:string = settings.envs[env].postmanApiKey;
    if(apiKey){
      let collection = new PostmanResponseHandler(this.injection).postman(project);
      let collectionInfo = this.getCollectionInfo(env, project.info.title);
      if(collectionInfo && collectionInfo.postmanId && collectionInfo.collectionId){
        new PostmanClient().updateCollection(collection, collectionInfo, apiKey).then((collectionInfo:{collectionId:string, postmanId:string}) => {
          try {
            console.info("Updated postman collection ", collectionInfo.collectionId);
          }catch(e){
            console.error(e);
          }
        }, (err:any) => console.error(err));
      }else{
        new PostmanClient().createCollection(collection, apiKey).then((collectionInfo) => {
          try {
            this.saveCollectionInfo( env, project.info.title, collectionInfo );
            console.info("Created postman collection ", collectionInfo);
          }catch(e){
            console.error(e);
          }
        }, (err:any) => console.error(err));
      }
    }
  }

  private getCollectionInfo(env:string, projectTitle:string):{collectionId:string, postmanId:string}{
    let metadata = this.injection.ProjectSettingsRepository().getMetadata();
    if(metadata && metadata.envs && metadata.envs[env] && metadata.envs[env].postmanCollections && metadata.envs[env].postmanCollections[projectTitle]){
      return metadata.envs[env].postmanCollections[projectTitle];
    }
    return null;
  }

  private saveCollectionInfo(env:string, projectTitle:string, collectionInfo:{collectionId:string, postmanId:string}){
    let metadata = this.injection.ProjectSettingsRepository().getMetadata();
    if(!metadata.envs){
      metadata.envs = {};
    }
    if(!metadata.envs[env]){
      metadata.envs[env] = {};
    }
    if(!metadata.envs[env].postmanCollections){
      metadata.envs[env].postmanCollections = {};
    }
    metadata.envs[env].postmanCollections[projectTitle] = collectionInfo;
    this.injection.ProjectSettingsRepository().saveMetadata(metadata);
  }
}