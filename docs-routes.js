var express = require('express');


var app = module.exports = express.Router();

var cradle = require('cradle');
var db = new(cradle.Connection)().database('docs');

app.get('/docsGet', function(req, res) {
    db.get(req.query.id, function(err, doc) {
        res.status(200).send(doc);
    });
});
app.post('/docsSave', function(req, res1) {

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