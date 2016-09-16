import {Component, Input, ElementRef, SimpleChanges, OnChanges} from "@angular/core";
/**
 * @author Steven Hermans
 */
@Component({
  selector: 'path-highlight',
  templateUrl: 'path-highlight.panel.html'
})
export class PathHighlightPanel implements OnChanges{
  
  constructor(private el:ElementRef){
  }
  
  @Input()
  path:string;

  highlightPath = '';

  ngOnChanges(changes: SimpleChanges){
    this.highlightPath = this.path
      .replace(new RegExp("\{", 'g'), '<span class="highlight">{')
      .replace(new RegExp("\}", 'g'), '}</span>');
  }
  
}