import {Component, Input} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute, Router} from "@angular/router";

import {COMPONENTS} from "angular-frontend-mxt/dist/components";
import {FILTERS} from "angular-frontend-mxt/dist/filters";
import {Path, Schema, Project} from 'microdocs-core-ts/dist/domain';
import {SchemaHelper} from "microdocs-core-ts/dist/helpers/schema/schema.helper";

import {BodyRenderPanel} from '../body-render/body-render.panel';

@Component({
  selector: 'endpoint',
  templateUrl: 'endpoint.panel.html',
  directives: [ROUTER_DIRECTIVES, COMPONENTS, BodyRenderPanel],
  pipes: [FILTERS]
})
export class EndpointPanel {

  @Input()
  private endpoint:Path;
  @Input()
  private path:string;
  @Input()
  private schemaList:{[key:string]:Schema};
  @Input()
  private project:Project;

  getStatusName(statusCode : string){
    switch(statusCode.trim()){
      case '200': return 'OK';
      case '201': return 'CREATED';
      case '204': return 'NO CONTENT';
      case '400': return 'BAD REQUEST';
      case '401': return 'UNAUTHORIZED';
      case '403': return 'FORBIDDEN';
      case '404': return 'NOT FOUND';
      case '405': return 'METHOD NOT ALLOWED';
      case '409': return 'CONFLICT';
      case '500': return 'INTERNAL SERVER ERROR';
      case '503': return 'SERVICE UNAVAILABLE';
      default: return '';
    }
  }

  getSourceLink(endpoint:Path){
    var link : string = null;
    var sourceLink = SchemaHelper.resolveReference("info.sourceLink", this.project);
    if(sourceLink != null){
      sourceLink = SchemaHelper.resolveString(sourceLink, this.project);
      if(endpoint.controller != undefined){
        var controller = endpoint.controller;
        if(controller['$ref'] != undefined){
          controller = SchemaHelper.resolveReference(controller['$ref'], this.project);
        }
        if(controller != undefined) {
          var controllerSettings = {
            component: {
              type: controller.type,
              name: controller.name,
              path: controller.name.replace(new RegExp('\\.', 'g'), '/')
            }
          };
          sourceLink = SchemaHelper.resolveString(sourceLink, controllerSettings);
        }
      }
    }
    return sourceLink;
  }

}