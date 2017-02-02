"use strict";
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
    getAllMembers(gots) {
        let rec = 0;
        this.members = new Array();
        for (let i = 0; i < gots.length; i++) {
            this.db.get(gots[i].id, function (err, doc) {
                if (err) {
                    console.dir(err);
                }
                else {
                    this.members.push(doc);
                    rec++;
                }
            });
        }
        return rec;
    }
    pullAllData() {
        this.db = new (cradle.Connection)("foxjazz.org").database("members");
        this.db.all(function (err, rs) {
            if (err) {
                console.dir(err);
            }
            else {
                let gots = JSON.parse(rs);
                let cb = this.getAllMembers(gots);
                this.processMembers();
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