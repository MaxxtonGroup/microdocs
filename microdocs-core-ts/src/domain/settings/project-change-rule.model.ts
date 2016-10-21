/**
 * @author Steven Hermans
 */
export class ProjectChangeRule{
  
  public static TYPE_ALTER = 'alter';
  public static TYPE_DELETE = 'delete';
  public static SCOPE_VERSION = 'version';
  public static SCOPE_PROJECT = 'project';
  public static SCOPE_GROUP = 'group';
  
  constructor(public key:string, public type:string, public value:any, public scope:string = ProjectChangeRule.SCOPE_VERSION){
    
  }
  
}