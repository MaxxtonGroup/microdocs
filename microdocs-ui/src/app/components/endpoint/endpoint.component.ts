import {Component, Input} from '@angular/core';
import {Path, Schema, Project, Method} from '@maxxton/microdocs-core/domain';

@Component({
  selector: 'endpoint',
  templateUrl: 'endpoint.component.html',
  styleUrls: ['endpoint.component.scss']
})
export class EndpointComponent {

  @Input()
  endpoint: Path;

  @Input()
  path: string;

  @Input()
  schemaList: {[key: string]: Schema};

  getStatusName(statusCode: string) {
    switch (statusCode.trim()) {
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

}
