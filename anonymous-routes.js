var express = require('express'),
    quoter = require('./quoter');

var app = module.exports = express.Router();

var cradle = require('cradle');

var db = new(cradle.Connection)().database('members');

app.get('/api/random-quote', function(req, res) {
    res.status(200).send(quoter.getRandomOne());
});

app.get('/couchDataAll', function(req, res) {
    var members = [];
    // let info = db.info();
    // let dbs = db.databases();
    var test = db.all(function(re, rs) {
        var gots = JSON.parse(rs);
        for (i = 0; i < gots.length; i++) {
            db.get(gots[i].id, function(err, doc) {
                members.push(doc);
            })
        }
        res.status(200).send(JSON.stringify(members));
    })

});
app.get('/couchGet', function(req, res) {
    db.get(req.query.id, function(err, doc) {
        res.status(200).send(doc);
    });
});
app.post('/couchSave', function(req, res1) {

    db.save(req.body._id, req.body, function(err, r1) {
        if (err) {
            console.log(err.json());
            res1.status(500).send(err);
        } else {
            res1.status(200).send(r1);
        }
    });
});