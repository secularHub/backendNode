"use strict";

export interface IPayment {
  receivedDate: Date;
  //receivedDateString: string;
  amount: number;
  type: string;
  active: boolean;
  targetDate: Date;
  receivedDateNumeric: number;
}

export class Payment implements IPayment{
  constructor(){
    this.type = 'cash';
    this.amount = 0;
    this.receivedDate = new Date();
  }
  receivedDate: Date;
  receivedDateNumeric: number;
  //receivedDateString: string;
  amount: number;
  type: string;
  active: boolean;
  targetDate: Date;
}
