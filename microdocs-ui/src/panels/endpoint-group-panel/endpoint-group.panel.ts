import {Component, Input} from "@angular/core";
import {FILTERS} from "@maxxton/components/filters/index";
import {SortByHttpMethod} from "../../pipes/sort-by-http-method.pipe";
import {EndpointPanel} from "../endpoint-panel/endpoint.panel";
import {COMPONENTS} from "@maxxton/components/components/index";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {PathHighlightPanel} from "../path-highlight-panel/path-highlight.panel";

/**
 * @author Steven Hermans
 */
@Component({
  selector: 'endpoint-group',
  templateUrl: 'endpoint-group.panel.html',
  directives: [ROUTER_DIRECTIVES, COMPONENTS, EndpointPanel, PathHighlightPanel],
  pipes: [FILTERS, SortByHttpMethod]
})
export class EndpointGroupPanel{
  
  @Input()
  endpointGroup:any;
  
  hidden = true;
  
}