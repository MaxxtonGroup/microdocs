
export interface Metadata{

  envs?:{[env:string]:MetadataEnvironment};

}

export interface MetadataEnvironment{

  postmanCollections?:{[projectTitle:string]:{collectionId:string,postmanId:string}};

}