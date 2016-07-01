import {ProjectInfo} from "./project-info.model";
import {Tag} from "./tag.model";
import {Schema} from "./schema/schema.model";
import {ExternalDoc} from "./external-doc.model";

export interface Project{
    swagger:string;
    info:ProjectInfo;
    host?:string;
    basePath?:string;
    schemas?:Array<string>;
    tags?:Array<Tag>;
    securityDefinitions?:{[key:string]:{}};//todo: security object
    externalDocs?:ExternalDoc;
    paths?:{[key:string]:{[key:string]:Path}};
    definitions?:{[key:string]:Schema},
    dependencies?:{[key:string]:Dependency};
    components?:{[key:string]:Component};
    problems?:Array<Problem>;
}