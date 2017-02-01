import * as cradle from 'cradle'
import {Member} from './member';

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
  members : Array<Member>;
  db: cradle.Database;
  private getDataAll(gots: any): number
  {
        var rec = 0;
        for (let i = 0; i < gots.length; i++) {
            this.db.get(gots[i].id, function(err, doc) {
                if (err) {
                    console.dir(err);
                } else {
                    this.members.push(doc);
                    rec++;
                }
            });

        }
        return rec;
  }
  public pullAllData(){
        this.db = new(cradle.Connection)("foxjazz.org").database('members');
        var test = this.db.all( function (err, rs) {
                if (err) {
                    console.dir(err);
                } else {
                    var gots = JSON.parse(rs);
                    this.getAllData(gots, function(cb: number){
                        console.log("sending back " + cb);
                            this.DoRec();
                    })
                    
                }
            });
  }

  public processMembers(){
      //at this point members should be populated. Now it's time to run the logic.
        let tnow = new Date();
        let thist = this.addMonths(tnow, -12);
        
  }

}
export module reconcile{
    
    export function  recon(){
        let r = new recks();
        
        r.pullAllData();


    }
}