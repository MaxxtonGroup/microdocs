import { Component, ElementRef, Input, Renderer } from "@angular/core";
import { StringUtil } from "../../helpers/string.util";

@Component( {
  selector: 'icon-generator',
  templateUrl: 'icon-generator.component.html',
  styleUrls: [ 'icon-generator.component.scss' ]
} )
export class IconGeneratorComponent {

  @Input( "text" )
  private text: string;

  @Input( "color" )
  private color: string;
  @Input()
  private small:boolean = false;

  private initials: string;

  constructor( private el: ElementRef, private renderer: Renderer ) {
  }

  ngOnChanges() {
    if ( !this.text ) {
      this.initials = null;
      return;
    }
    let first     = this.text.substr( 0, 1 );
    let second    = this.text.substr( 1, 1 );
    this.initials = first.toUpperCase() + second.toLowerCase();

    if ( !this.color ) {
      this.color = StringUtil.getColorCodeFromString( this.text );

      if ( !this.color ) {
        this.color = 'blue-grey';
      }
    }
//    this.renderer.setElementAttribute( this.el.nativeElement.querySelector('.icon-generator'), 'class', selectedColor );
  }

}
