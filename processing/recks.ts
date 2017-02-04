"use strict";

import * as cradle from "cradle";
import {Member} from "./member";
import {rules} from "./rules";
import {Payment} from "./payment";

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
      return new Promise<void>((resolve, reject) => {
        this.db.get(got.id,(err: any,doc: any) => {
            if(err) {
                reject(err);
                console.log(err);
            }
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
//            console.log("l:" + i + "-" + gots.length);
            if(i == gots.length - 1)
                this.processMembers();
        }
        return rec;
  }

    public async sendAllMembers(gots: any, res: any)
    {
        let rec = 0;
        this.members = new Array<Member>();
        for (let i = 0; i < gots.length; i++) {
            await this.popMember(gots[i]);
//            console.log("l:" + i + "-" + gots.length);
            if(i === gots.length - 1)
                res.status(200).send(JSON.stringify(this.members));
        }
        return rec;
    }

  public pullAll(res: any ){
      this.db = new(cradle.Connection)().database("members");
      this.db.all( (err: any, rs: any) => {
          if (err) {
              console.dir(err);
          } else {
              let gots = JSON.parse(rs);
              this.sendAllMembers(gots, res);
          }
      });
  }
  public reconcileAll(){
        this.db = new(cradle.Connection)().database("members");
        this.db.all( (err: any, rs: any) => {
            if (err) {
                console.dir(err);
            } else {
                let gots = JSON.parse(rs);
                let cb = this.getAllMembers(gots);
              }
        });
  }
  private payloop: Array<Member>;
  private forloop: Array<Member>;
  private elseloop: Array<Member>;

  private getLastPayment(p: Array<Payment>): Payment{
      let rp = p[p.length - 1];
      for(let i = 0; i < p.length; i++){
          if(rp.receivedDate < p[i].receivedDate)
              rp = p[i];
      }
      return rp;
  }
  public processMembers(){
      this.forloop = new Array<Member>();
      this.payloop = new Array<Member>();
      this.elseloop = new Array<Member>();
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
            member.memType = "Not Active";
            if (member.payments != null && member.payments.length > 0) {
                let total = 1;
                // lets determin when and what was the last payment.
            /*    let pay = this.getLastPayment(member.payments);
                // now find rule that it applies to
                for (let r of rules) {
                    if(r.TermInMonths > 0) {
                        thist = this.addMonths(tnow, r.TermInMonths * -1)
                        let rd = new Date(pay.receivedDate);
                        if (new Date(r.expDate) > rd && r.Amount <= pay.amount && rd > thist) {
                            //this is the rule we should use.
                            member.memType = r.MembershipType;
                            member.isActive = true;
                        }
                    }
                }*/
                     this.payloop.push(member);
                    for (let mypay of member.payments) {
                        thist = this.addMonths(tnow, r.TermInMonths * -1)
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
                if (member.memType === "Not Active")
                    member.isActive = false;
                }
            }

            console.log("saving:" + member.firstName + " active:" + member.isActive);
            this.db.save(member,(err,res)=>{
                if(err)
                    console.log("error: mid:" + member._id + " " + err);
                else {
                    console.log("saving:" + member.firstName + " active:" + member.isActive + " typ:" + member.memType);
                }
            });
        }
    }
    getOne(n: string, res: any){
        this.db = new(cradle.Connection)().database("members");
        this.db.get(n,(err, doc) => {
            if(err) {
                console.log(" get error:" + err);
                res.status(409).send(err);
            }
            else
                res.status(200).send(JSON.stringify(doc));
        });

    }
/*    private async putMember(m: Member){
      await this.saveMember(m);
    }
    private saveMember(member: Member): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.save(member,(err: any,res: any) => {
                if(err) {
                    reject(err);
                    console.log(err);
                }
                else{
                    console.log("rev:" + res._rev);
                    resolve();
                }
            });
        });
    }*/
}