
import {Component, Input} from "@angular/core";
import {Problem} from "@maxxton/microdocs-core/domain";


@Component({
  selector: 'problem-box',
  templateUrl: 'problem-box.component.html',
  styleUrls: ['problem-box.component.scss']
})
export class ProblemBoxComponent {

  @Input()
  problems: Array<Problem>;

}
