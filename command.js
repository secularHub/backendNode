//"use strict";
var cradle = require('cradle');
var salt = require('./salt.js');

var db = new(cradle.Connection)().database('members');
var backup = new(cradle.Connection)().database('backup');
var docs = new(cradle.Connection)().database('docs');

const fs = require('fs');
var arguments = {
    command: "",
    file: ""
}
array = process.argv;
var users = {
    _id: "users",
    users: [{
        _id: 'admin',
        username: 'admin',
        password: salt.salt('snowsnake').salt
    }]
}

if (array.length < 3) {
    console.log('useage for commands takes 2 arguments');
    console.log('current commands are: $node command.js backup-to-file filename');
    console.log('current commands are: $node command.js restore-from-file filename');
    console.log('current commands are: $node command.js set-admin-password password');
}
var myargs = {
    command: "",
    file: ""
}

array.forEach(function(val, index, array) {
    console.log(index + ': ' + val);
    if (index === 2) {
        myargs.command = val;
    }
    if (index === 3 && val.length > 0) {
        myargs.file = val;
    }
});
//"4f8028abdc119d3a42f3f157ed4243e68ed67181ce8454f008c155f4e555a3c1fa3548f1c0765a3b7ccd9a4cd2855ba1faa0ccd0b297deac69b03dc4d549a2ec"

if (myargs.command === 'set-admin-password') {
    myargs.file = salt.salt(myargs.file).passwordHash;
    docs.get('users', function(err, data) {
        if (err) {
            //users.username = "password";
            //users.password = myargs.file; //second argument should be the password

            docs.save('users', users, function(err, res) {
                if (err)
                    console.log(err);
                else
                    console.log(JSON.stringify(res));
            })

        } else {
            for (i = 0; i < data.users.length; i++) {
                if (data.users[i].username === 'admin')
                    data.users[i].password = myargs.file;
            }
            if (data.password.length > 0)
                data.password = "";
            docs.save(data._id, data, function(err, res) {
                if (err)
                    console.log(JSON.stringify(err));
                else
                    console.log(JSON.stringify(res));
            });
        }

    })
    return;
}

if (myargs.command === 'backup-to-file') {
    var members = [];
    // let info = db.info();
    // let dbs = db.databases();
    console.log('backupg up to: ' + myargs.file);
    var test = db.all(function(re, rs) {
        var gots = JSON.parse(rs);
        for (i = 0; i < gots.length; i++) {
            db.get(gots[i].id, function(err, doc) {
                members.push(doc);
            })
        }

    })
    fs.writeFile(myargs.file, JSON.stringify(members));
}
if (myargs.command === 'restore-from-file') {
    var data = fs.readFile(myargs.file);
    var members = JSON.parse(data);
    for (i = 0; i < members.length; i++) {
        db.save(members[i]._id, JSON.stringify(members[i]));
    }
}