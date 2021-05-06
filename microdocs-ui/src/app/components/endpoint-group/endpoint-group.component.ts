import {Component, Input} from "@angular/core";
import { Schema } from "@maxxton/microdocs-core/dist/domain";

/**
 * @author Steven Hermans
 */
@Component({
  selector: 'endpoint-group',
  templateUrl: 'endpoint-group.component.html',
  styleUrls: ['endpoint-group.component.scss']
})
export class EndpointGroupComponent {

  @Input()
  endpointGroup:any;
  @Input()
  schemaList:{[key:string]:Schema};

  hidden = true;

}
