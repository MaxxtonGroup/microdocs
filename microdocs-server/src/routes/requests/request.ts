import { Project } from "@maxxton/microdocs-core/dist/domain";
/**
 * @author Steven Hermans
 */
export class Request {

  private _tempFolder:string;
  private _files:string[];
  private _microdocsReport:Project;
  private _validateMessage:string;

  constructor( tempFolder:string ) {
    this._tempFolder      = tempFolder;
  }

  get tempFolder():string {
    return this._tempFolder;
  }

  get files():string[] {
    return this._files;
  }

  get microdocsReport():Project {
    return this._microdocsReport;
  }

  get validateMessage():string {
    return this._validateMessage;
  }

  set files( value:string[] ) {
    this._files = value;
  }

  set microdocsReport( value:Project ) {
    this._microdocsReport = value;
  }

  set validateMessage( value:string ) {
    this._validateMessage = value;
  }
}