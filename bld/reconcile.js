import { recks } from './recks';
//import * as Object from 'object-assign'
/*declare interface ObjectConstructor {
    assign(...objects: Object[]): Object;
}*/
export var reconcile;
(function (reconcile) {
    function recon() {
        let r = new recks();
        r.pullAllData();
        r.processMembers();
    }
    reconcile.recon = recon;
})(reconcile || (reconcile = {}));
//# sourceMappingURL=reconcile.js.map