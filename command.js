var cradle = require('cradle');
var db = new(cradle.Connection)().database('members');
const fs = require('fs');
var arguments = {
    command: "",
    file: ""
}
if (array.length < 2) {
    console.log('useage for commands takes 2 arguments');
    console.log('current commands are: $node command.js backup filename');
    console.log('current commands are: $node command.js restore filename');
}
process.argv.forEach(function(val, index, array) {
    console.log(index + ': ' + val);
    if (index === 1) {
        arguments.command = val;
    }
    if (index === 2 && val.length > 0) {
        arguments.command = val;
    }
});


if (arguments.command === 'backup') {
    var members = [];
    // let info = db.info();
    // let dbs = db.databases();
    console.log('backupg up to: ' + arguments.file);
    var test = db.all(function(re, rs) {
        var gots = JSON.parse(rs);
        for (i = 0; i < gots.length; i++) {
            db.get(gots[i].id, function(err, doc) {
                members.push(doc);
            })
        }

    })
    fs.writeFile(arguments.file, JSON.stringify(members));
}
if (arguments.command === 'restore') {
    var data = fs.readFile(arguments.file);
    var members = JSON.parse(data);
    for (i = 0; i < members.length; i++) {
        db.save(members[i]._id, JSON.stringify(members[i]));
    }
}