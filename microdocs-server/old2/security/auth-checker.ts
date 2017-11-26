
import { Action } from "routing-controllers";

export function AuthorizationChecker(action: Action, roles: any[]): Promise<boolean>|boolean{

  // todo: implement auth

  return true;

}