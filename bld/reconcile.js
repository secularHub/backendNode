"use strict";
const recks_1 = require("./recks");
var reconcile;
(function (reconcile) {
    function recon() {
        let r = new recks_1.Recks();
        r.pullAllData();
        r.processMembers();
    }
    reconcile.recon = recon;
})(reconcile = exports.reconcile || (exports.reconcile = {}));
//# sourceMappingURL=reconcile.js.map