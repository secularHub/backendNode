"use strict";
import {Recks} from "./recks";
export namespace reconcile{
    export function  recon(){
        let r = new Recks();
        r.reconcileAll();
        
    }
}

export namespace helper{
    export function  getall(res: any){
        let r = new Recks();
        r.pullAll(res);

    }
}