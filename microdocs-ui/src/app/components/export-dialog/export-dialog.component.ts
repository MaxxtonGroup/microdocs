import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'export-dialog',
  templateUrl: 'export-dialog.component.html',
  styleUrls: ['export-dialog.component.scss']
})
export class ExportDialogComponent {

  @Input( "project" )
  defaultProject: string = null;
  @Input( "version" )
  defaultVersion: string = null;

  constructor() { }



}
