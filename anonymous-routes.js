var express = require('express'),
    _ = require('lodash'),
    config = require('./config'),
    quoter = require('./quoter'),
    jwt = require('jsonwebtoken'),
    salt = require('./salt.js');

var app = module.exports = express.Router();

var cradle = require('cradle');
var db = new(cradle.Connection)().database('members');
var cradle = require('cradle');
var dbd = new(cradle.Connection)().database('docs');

var user = {
    id: 1,
    username: 'gonto',
    password: 'gonto'
};

function validate(u, p) {
    dbd.get('users', function(err, doc) {
        if (err)
            console.log(err);
        else {
            for (i = 0; i < doc.users.length; i++) {
                if (doc.users[i].username === u && doc.users[i].password === p) {
                    return true;
                }
            }
            return false;
        }
    });
}
//"aedd762379ee6235"
function createToken(user) {
    return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 60 * 5 });
}

app.post('/api/login', function(req, res) {
    console.log("create with: " + req.body.login);
    var pw = salt.salt(req.body.password).passwordHash;
    var u = req.body.login;
    user.password = pw;
    user.username = u;
    if (!u || !pw) {
        return res.status(400).send("You must send the username and the password");
    }
    try {
        dbd.get('users', function(err, doc) {
            if (err)
                console.log(err);
            else {
                for (i = 0; i < doc.users.length; i++) {
                    if (doc.users[i].username === u && doc.users[i].password === pw) {
                        console.log('good pw on signin returning 201');
                        return res.status(201).send({
                            id_token: createToken(user)
                        });
                    }
                }

                console.log('valid didn not match a user and pw');
                return res.status(401).send("The username or password don't match");
            }
        });

    } catch (error) {
        console.log(error);
    }
});

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
//var db = new (cradel.connection)('74.208.129.62').database('members');
app.get('/api/random-quote', function(req, res) {
    res.status(200).send(quoter.getRandomOne());
});

var getAllData  = function(members, gots, callback)
{
    var rec = 0;
        for (i = 0; i < gots.length; i++) {
            db.get(gots[i].id, function(err, doc) {
                if (err) {
                    console.dir(err);
                } else {
                    members.push(doc);
                    rec++;
                }
            });

        }
        callback(rec);

}
app.get('/couchDataAll', function(req, res) {
    var members = [];

    //var verifiedJwt = nJwt.verify(req.query.jwt,config.secret);
    //var testtoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODUxMzkwMTksImV4cCI6MTQ4NTE1NzAxOX0.Zauliu_g5qS8UTbQMV2t6mZiWudbRdvhc1e0GsYLdYY";
    var verifiedJwt = jwt.verify(req.query.jwt, config.secret, function(err, decode) {
        if (err)
            res.status(401).send("bad bearer token");
        else {
            console.log('getting data');
            var test = db.all(function(err, rs) {
                if (err) {
                    console.dir(err);
                } else {
                    var gots = JSON.parse(rs);
                    getAllData(members,gots, function(cb){
                        console.log("sending back " + cb);
                            res.status(200).send(JSON.stringify(members));
                    })

                    
                }
            });
        }
    });
});
app.post('/couchDelete', function(req, res) {
    var id = req.body._id;
    db.remove(req.body._id, req.body._rev, function(err, r) {
        if (err) {
            console.dir(err);
            res.status(500).send(err);

        } else {
            res.status(200).send(r)
            console.log("deleted " + id);
        }
    });
});
app.get('/couchGet', function(req, res) {
    db.get(req.query.id, function(err, doc) {
        res.status(200).send(doc);
    });
});
app.post('/couchSave', function(req, res1) {

    console.log('saving ' + req.body);
    db.save(req.body._id, req.body, function(err, r1) {
        if (err) {
            console.dir(err);
            res1.status(500).send(err);
        } else {
            res1.status(200).send(r1);
        }
    });
});