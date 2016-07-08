import {Component, Input} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute, Router} from "@angular/router";

import {COMPONENTS, ModalComponent} from "angular-frontend-mxt/dist/components";
import {Path, Schema} from 'microdocs-core-ts/dist/domain';

import {NotEmptyPipe} from '../../filters/not-empty.pipe';
import {ObjectIteratorPipe} from '../../filters/object-iterator.pipe';
import {FilterByFieldPipe} from '../../filters/filter-by-field.pipe';
import {BodyRenderPanel} from '../body-render/body-render.panel';

@Component({
  selector: 'endpoint',
  templateUrl: 'endpoint.panel.html',
  directives: [ROUTER_DIRECTIVES, COMPONENTS, BodyRenderPanel],
  pipes: [NotEmptyPipe, ObjectIteratorPipe, FilterByFieldPipe]
})
export class EndpointPanel {

  @Input()
  private endpoint:Path;
  @Input()
  private path:string;
  @Input()
  private schemaList:{[key:string]:Schema};

}