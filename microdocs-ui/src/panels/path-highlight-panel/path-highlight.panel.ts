import {Component, Input, ElementRef} from "@angular/core";
/**
 * @author Steven Hermans
 */
@Component({
  selector: 'path-highlight',
  template: ''
})
export class PathHighlightPanel{
  
  constructor(private el:ElementRef){
    
  }
  
  @Input()
  private path:string;
  
  ngOnChanges(){
    var hightlightPath = this.path
      .replace(new RegExp("\{", 'g'), '<span class="highlight">')
      .replace(new RegExp("\}", 'g'), '</span>');
   this.el.nativeElement.innerHtml(hightlightPath);
  }
  
}