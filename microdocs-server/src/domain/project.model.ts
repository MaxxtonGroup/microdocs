import {ProjectInfo} from "./common/project-info.model";
import {Tag} from "./common/tag.model";
import {Schema} from "./schema/schema.model";
import {ExternalDoc} from "./common/external-doc.model";
import {Dependency} from "./depenency/dependency.model";
import {Component} from "./component/component.model";
import {Path} from "./path/path.model";

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
    // problems?:Array<Problem>;
}