"use strict";
import {Recks} from "./recks";
export namespace reconcile{
    export function  recon(){
        let r = new Recks();
        r.pullAllData();
        r.processMembers();
    }
}