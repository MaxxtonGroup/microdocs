import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dialog-base',
  templateUrl: 'dialog-base.component.html',
  styleUrls: ['dialog-base.component.scss']
})
export class DialogBaseComponent {

  show: boolean = false;

  constructor() { }

  public close() {
    this.show = false;

  }

  public open() {
    this.show = true;
  }

  public toggle() {
    this.show = !this.show;
  }

}
