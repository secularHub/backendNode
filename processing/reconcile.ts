"use strict";
import {Recks} from "./recks";
export namespace reconcile{
    export function  recon(){
        let r = new Recks();
        r.reconcileAll();
        
    }
}

export namespace helper{
    export function getOne(sid: string, res: any)
    {
        let r = new Recks();
        r.getOne(sid,res);
    }
    export function  getall(res: any){
        let r = new Recks();
        r.pullAll(res);

    }
}