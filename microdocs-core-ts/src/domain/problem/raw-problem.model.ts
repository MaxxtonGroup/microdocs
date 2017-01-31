
import { SchemaHelper } from "../../helpers/schema/schema.helper";
import { Problem } from "./problem.model";
import { Project } from "../project.model";
import { Component } from "../component/component.model";
import { Method } from "../component/method.model";
import { ProblemClient } from "./problem-client.model";

export class RawProblem {

  private _level: string;
  private message: string;
  private rootObject: Project;
  private component: Component;
  private method: Method;
  private clientRootObject: Project;
  private clientTitle: string;
  private clientVersion: string;
  private clientComponent: Component;
  private clientMethod: Method;

  constructor( level: string, message: string, rootObject: Project, component?: Component, method?: Method, clientRootObject?: Project, clientTitle?: string, clientVersion?: string, clientComponent?: Component, clientMethod?: Method ) {
    this._level           = level;
    this.message          = message;
    this.rootObject       = rootObject;
    this.component        = component;
    this.method           = method;
    this.clientRootObject = clientRootObject;
    this.clientTitle      = clientTitle;
    this.clientVersion    = clientVersion;
    this.clientComponent  = clientComponent;
    this.clientMethod     = clientMethod;
  }

  get level(): string {
    return this._level;
  }

  get problem(): Problem {
    //console.warn(level + ": " + description);
    var problem: Problem = { level: this._level, message: this.message };

    // log component info
    if ( this.component ) {
      this.component = SchemaHelper.resolveObject( this.component, this.rootObject );
      if ( this.component && this.component.name ) {
        problem.path = this.component.file;
        var fullName = this.component.name;
        var segments = fullName.split( '.' );
        if ( segments.length > 0 ) {
          problem.package   = fullName.substring( 0, fullName.length - segments[ segments.length - 1 ].length - 1 );
          problem.className = segments[ segments.length - 1 ];
        }
      }
    }

    // log method info
    if ( this.method ) {
      this.method = SchemaHelper.resolveObject( this.method, this.rootObject );
    }
    if ( this.method ) {
      problem.lineNumber = this.method.lineNumber;
    }

    // log client info
    if ( this.clientRootObject && this.clientTitle ) {
      var client: ProblemClient = { title: this.clientTitle, version: this.clientVersion };
      client.title              = this.clientTitle;
      client.version            = this.clientVersion;

      // log client component info
      if ( this.clientComponent ) {
        this.clientComponent = SchemaHelper.resolveObject( this.clientComponent, this.clientRootObject );
        if ( this.clientComponent && this.clientComponent.name ) {
          client.path  = this.clientComponent.file;
          var fullName = this.clientComponent.name;
          var segments = fullName.split( '.' );
          if ( segments.length > 0 ) {
            client.package   = fullName.substring( 0, fullName.length - segments[ segments.length - 1 ].length - 1 );
            client.className = segments[ segments.length - 1 ];
          }
        }
      }

      // log client method info
      if ( this.clientMethod ) {
        this.clientMethod = SchemaHelper.resolveObject( this.clientMethod, this.clientRootObject );
      }
      if ( this.clientMethod ) {
        client.lineNumber = this.clientMethod.lineNumber;
        if ( this.clientMethod.sourceLink ) {
          client.sourceLink = this.clientMethod.sourceLink;
        }
      }

      problem.client = client;
    }
    return problem;
  }

  /**
   * Inverse the producer and consumer side
   */
  public inverse(clientRootObject:Project, clientComponent:Component, clientMethod?:Method): RawProblem {
    return new RawProblem(
        this.level,
        this.message,
        clientRootObject,
        clientComponent,
        clientMethod,
        this.rootObject,
        this.rootObject.info.title,
        this.rootObject.info.version,
        this.component,
        this.method );
  }


}