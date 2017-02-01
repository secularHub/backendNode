import * as cradle from 'cradle'

export class recks{
    public addMonths (date: Date, count: number):Date {
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
          nd.setMonth(0,1);
          nd.setFullYear(nd.getFullYear() + 1);
        }
        nd.setMonth(nd.getMonth() + count, 1);
      }

    }
    return nd;
  }


}
export module reconcile{
    
    export function  recon(){
        let r = new recks();
        let tnow = new Date();

        let thist = r.addMonths(tnow, -12);

    }
}