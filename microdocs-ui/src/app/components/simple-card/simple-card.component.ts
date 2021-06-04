import { Component, Input } from "@angular/core";

@Component( {
  selector: 'simple-card',
  templateUrl: 'simple-card.component.html',
  styleUrls: [ 'simple-card.component.scss' ]
} )
export class SimpleCardComponent {

  @Input('open')
  _open: boolean = true;
  @Input()
  text: string;
  @Input()
  subTitle: string;
  @Input()
  paper: boolean;

  constructor() {
  }

  public toggle(): void {
    this._open = !this._open;
  }

  public open(): void {
    this._open = true;
  }

  public close(): void {
    this._open = true;
  }

  public isOpened(): boolean {
    return this._open;
  }

  public isClosed(): boolean {
    return !this._open;
  }

}
