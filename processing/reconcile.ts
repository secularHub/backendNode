import * as cradle from 'cradle'
import {Member} from './member';
import {rules} from './rules';
import {recks} from './recks';
//import * as Object from 'object-assign'
/*declare interface ObjectConstructor {
    assign(...objects: Object[]): Object;
}*/


export module reconcile{
    
    export function  recon(){
        let r = new recks();
        
        r.pullAllData();
        r.processMembers();


    }
}