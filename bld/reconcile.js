"use strict";
const recks_1 = require("./recks");
var reconcile;
(function (reconcile) {
    function recon() {
        let r = new recks_1.Recks();
        r.reconcileAll();
    }
    reconcile.recon = recon;
})(reconcile = exports.reconcile || (exports.reconcile = {}));
var helper;
(function (helper) {
    function getOne(sid, res) {
        let r = new recks_1.Recks();
        r.getOne(sid, res);
    }
    helper.getOne = getOne;
    function getall(res) {
        let r = new recks_1.Recks();
        r.pullAll(res);
    }
    helper.getall = getall;
})(helper = exports.helper || (exports.helper = {}));
//# sourceMappingURL=reconcile.js.map