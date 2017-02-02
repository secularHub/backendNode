"use strict";

import {IPayment} from "./payment";
export class Member {

  index: number;
  _id: string;
  _rev: string;
  parentID: string;
  parentName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  createdAt: number;
  joinedDate: Date;
  completed: boolean;
  isActive: boolean;
  needsNametag: boolean;
/*  set active(b:boolean){
    if (b === true) {
      this.memType="VIP";
    }
    else 
        this.memType="Regular";
    this.isActive=b;
  }
  get active(){return this.isActive;}
*/  
  frequency: number;
  skills: string;
  durationmonths: number;
  targetDate: Date;
  Description: string;
  Notes: string;
  isFamily: boolean;
  memType: string;
  //ExtendedMembers: Array<ExtendedMember>;
  payments: Array<IPayment>;

  constructor(email: string, done = false) {
    this.email = email;
    this.completed = done;
    this.joinedDate = new Date();
    this.payments = new Array<IPayment>();
    this.frequency = 12;  //frequency of payments in months
    this.needsNametag = true;
    // members.push(this);
    // this.key = members.length;
  }
  public delete(){
    this.isActive = false;

  }

  public clear() {
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
      this.memType = "VIP"
    }
    else {
      this.isActive = false;
      this.memType = "Not Active"
    }
  }

}


