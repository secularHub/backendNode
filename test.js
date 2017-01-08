var db = new(cradel.connection)('74.208.129.62:5984').database('members');

var members = [];
// let info = db.info();
// let dbs = db.databases();
console.log('getting data');
var test = db.all(function(re, rs) {
    var gots = JSON.parse(rs);
    for (i = 0; i < gots.length; i++) {
        db.get(gots[i].id, function(err, doc) {
            if (err.length > 0) {
                console.log(err);
            } else {
                members.push(doc);
            }
        })
    }
    console.log(JSON.stringify(members));
})