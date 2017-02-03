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
                if (err)
                    reject(err);
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
    pullAllData() {
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
    ;
    processMembers() {
        //  at this point members should be populated. Now it's time to run the logic.
        let tnow = new Date();
        let thist = this.addMonths(tnow, -12);
        this.memberlist = this.members;
        for (let res2 of this.memberlist) {
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
            this.db.save(member, function (err, res) {
                if (err)
                    console.log(err);
            });
        }
    }
}
exports.Recks = Recks;
//# sourceMappingURL=recks.js.map