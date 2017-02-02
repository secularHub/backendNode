"use strict";
class Member {
    constructor(email, done = false) {
        this.email = email;
        this.completed = done;
        this.joinedDate = new Date();
        this.payments = new Array();
        this.frequency = 12; //frequency of payments in months
        this.needsNametag = true;
        // members.push(this);
        // this.key = members.length;
    }
    delete() {
        this.isActive = false;
    }
    clear() {
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.phone = '';
        this.address = '';
        this.city = '';
        this.state = '';
        this.zip = '';
        this.completed = false;
    }
    ToggleVIP() {
        if (this.isActive === false) {
            this.isActive = true;
            this.memType = "VIP";
        }
        else {
            this.isActive = false;
            this.memType = "Not Active";
        }
    }
}
exports.Member = Member;
//# sourceMappingURL=member.js.map