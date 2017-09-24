import { Component, Input } from "@angular/core";

@Component( {
  selector: 'simple-card',
  templateUrl: 'simple-card.component.html',
  styleUrls: [ 'simple-card.component.scss' ]
} )
export class SimpleCardComponent {

  @Input('open')
  private _open: boolean = true;
  @Input()
  private text: string;
  @Input()
  private subTitle:string;
  @Input()
  private paper:boolean;

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
