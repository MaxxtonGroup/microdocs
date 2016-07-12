import {Component, Input} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute, Router} from "@angular/router";

import {COMPONENTS} from "angular-frontend-mxt/dist/components";
import {FILTERS} from "angular-frontend-mxt/dist/filters";
import {Path, Schema} from 'microdocs-core-ts/dist/domain';

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

}