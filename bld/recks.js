"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const cradle = require("cradle");
const rules_1 = require("./rules");
class Recks {
    addMonths(date, count) {
        if (date == null)
            return new Date();
        let nd;
        if (date && count) {
            nd = new Date(date);
            if (count === 12) {
                nd.setFullYear(nd.getFullYear() + 1);
            }
            else {
                if (nd.getMonth() === 11) {
                    nd.setMonth(0, 1);
                    nd.setFullYear(nd.getFullYear() + 1);
                }
                nd.setMonth(nd.getMonth() + count, 1);
            }
        }
        return nd;
    }
    popMember(got) {
        return new Promise((resolve, reject) => {
            this.db.get(got.id, (err, doc) => {
                if (err) {
                    reject(err);
                    console.log(err);
                }
                else {
                    this.members.push(doc);
                    resolve();
                }
            });
        });
    }
    getAllMembers(gots) {
        return __awaiter(this, void 0, void 0, function* () {
            let rec = 0;
            this.members = new Array();
            for (let i = 0; i < gots.length; i++) {
                yield this.popMember(gots[i]);
                console.log("l:" + i + "-" + gots.length);
                if (i == gots.length - 1)
                    this.processMembers();
            }
            return rec;
        });
    }
    sendAllMembers(gots, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let rec = 0;
            this.members = new Array();
            for (let i = 0; i < gots.length; i++) {
                yield this.popMember(gots[i]);
                console.log("l:" + i + "-" + gots.length);
                if (i === gots.length - 1)
                    res.status(200).send(JSON.stringify(this.members));
            }
            return rec;
        });
    }
    pullAll(res) {
        this.db = new (cradle.Connection)("foxjazz.org").database("members");
        this.db.all((err, rs) => {
            if (err) {
                console.dir(err);
            }
            else {
                let gots = JSON.parse(rs);
                this.sendAllMembers(gots, res);
            }
        });
    }
    reconcileAll() {
        this.db = new (cradle.Connection)("foxjazz.org").database("members");
        this.db.all((err, rs) => {
            if (err) {
                console.dir(err);
            }
            else {
                let gots = JSON.parse(rs);
                let cb = this.getAllMembers(gots);
            }
        });
    }
    processMembers() {
        this.forloop = new Array();
        this.payloop = new Array();
        this.elseloop = new Array();
        //  at this point members should be populated. Now it's time to run the logic.
        console.log("in processMembers - length: " + this.members.length);
        let tnow = new Date();
        let thist = this.addMonths(tnow, -12);
        for (let res2 of this.members) {
            console.log(res2.firstName);
            this.forloop.push(res2);
            let member = Object.assign({}, res2);
            if (member.memType === "VIP") {
                member.isActive = true;
            }
            else {
                member.isActive = false;
                if (member.payments != null && member.payments.length > 0) {
                    let total = 1;
                    this.payloop.push(member);
                    for (let mypay of member.payments) {
                        if (mypay.receivedDate != undefined) {
                            if (new Date(mypay.receivedDate) > thist)
                                total = total + mypay.amount;
                        }
                    }
                    for (let r of rules_1.rules) {
                        if (total > r.Amount) {
                            member.isActive = true;
                            this.elseloop.push(member);
                            member.memType = r.MembershipType;
                        }
                    }
                    if (member.memType === "Not Active")
                        member.isActive = false;
                }
            }
            console.log("saving:" + member.firstName + " active:" + member.isActive);
            this.putMember(member);
        }
    }
    putMember(m) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveMember(m);
        });
    }
    saveMember(member) {
        return new Promise((resolve, reject) => {
            this.db.save(member, (err, res) => {
                if (err) {
                    reject(err);
                    console.log(err);
                }
                else {
                    console.log("rev:" + res._rev);
                    resolve();
                }
            });
        });
    }
}
exports.Recks = Recks;
//# sourceMappingURL=recks.js.map