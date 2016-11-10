import { Event } from './event.model';

/**
 * @author Steven Hermans
 */
export interface Exchange {

  type?:string;
  routes?:{[key:string]:Event};

}