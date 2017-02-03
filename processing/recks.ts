"use strict";

import * as cradle from "cradle";
import {Member} from "./member";
import {rules} from "./rules";

export class Recks{
    public addMonths (date: Date, count: number): Date {
    if(date == null)
      return new Date();
    let nd: Date;
    if (date && count) {
      nd = new Date(date);

      if(count === 12) {
        nd.setFullYear(nd.getFullYear() + 1);
      }
      else {
        if(nd.getMonth() === 11)
        {
          nd.setMonth(0, 1);
          nd.setFullYear(nd.getFullYear() + 1);
        }
        nd.setMonth(nd.getMonth() + count, 1);
      }

    }
    return nd;
  }
  public members: Array<Member>;
  public memberlist: Array<Member>;
  public db: cradle.Database;

  private popMember(got: any): Promise<void>
  {
      return new Promise<void>((resolve,reject)=>{
        this.db.get(got.id,(err: any,doc: any) => {
            if(err)
                    reject(err);
                else{
                    this.members.push(doc);
                    resolve();
                }
        });
      });
  }
  public async getAllMembers(gots: any)
  {
        let rec = 0;
        this.members = new Array<Member>();
        for (let i = 0; i < gots.length; i++) {
            await this.popMember(gots[i]);
            console.log("l:" + i + "-" + gots.length);
            if(i == gots.length - 1)
                this.processMembers();
        }
        return rec;
  }
  public pullAllData(){
        this.db = new(cradle.Connection)("foxjazz.org").database("members");
        this.db.all( (err: any, rs: any) => {
            if (err) {
                console.dir(err);
            } else {
                let gots = JSON.parse(rs);
                let cb = this.getAllMembers(gots);
                
              }
            });
        };
  private payloop: Array<Member>;
  private forloop: Array<Member>;
  private elseloop: Array<Member>;

  public processMembers(){
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
                if(mypay.receivedDate != undefined) {
                    if (new Date(mypay.receivedDate) > thist)
                    total = total + mypay.amount;
                }
                }
                for (let r of rules) {
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
        this.db.save(member, function(err: any, res: any){
            if(err)
                console.log(err);
        });
      }
  }

}