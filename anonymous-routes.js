var express = require('express'),
    quoter = require('./quoter');

var app = module.exports = express.Router();

var cradle = require('cradle');
var db = new(cradle.Connection)().database('members');
//var db = new (cradel.connection)('74.208.129.62').database('members');
app.get('/api/random-quote', function(req, res) {
    res.status(200).send(quoter.getRandomOne());
});

app.get('/couchDataAll', function(req, res) {
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
        res.status(200).send(JSON.stringify(members));
    })

});
app.post('/couchDelete', function(req, res) {
    var id = req.body._id;
    db.remove(req.body._id, req.body._rev, function(err, r) {
        if (err.length > 0) {
            res.status(500).send(err);
            console.log(err);
        } else {
            res.status(200).send(r)
            console.log("deleted "+ id);
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
            console.log(err.json());
            res1.status(500).send(err);
        } else {
            res1.status(200).send(r1);
        }
    });
});