var cradle = require('cradle');
var db = new(cradle.Connection)("foxjazz.org").database('members');
var email = require('emailjs');
var server = email.server.connect({
    user: "username",
    password: "password",
    host: "smtp.your-email.com",
    ssl: true
});

var sendEmail = function(message, address) {
    server.send({
        text: message,
        from: "you <username@your-email.com>",
        to: address,
        cc: "else <else@your-email.com>",
        subject: "secular report receit"
    }, function(err, message) { console.log(err || message); });
}

array = process.argv;
var runreport = function() {
    var members = [];
    var test = db.all(function(err, rs) {
        if (err) {
            console.dir(err);
        } else {
            var gots = JSON.parse(rs);
            for (i = 0; i < gots.length; i++) {
                db.get(gots[i].id, function(err, doc) {
                    if (err) {
                        console.dir(err);
                    } else {
                        members.push(doc);
                        for (i = 0; i < doc.payments.length; i++) {
                            var pm = doc.payments[i];
                            var total = 0;
                            if (pm.receivedDate.getFullYear === new Date().getFullYear)
                                total += pm.amount;
                        }
                        sendEmail("you have paied $" + total + " for this year.", doc.email);
                    }
                });
            }


        }
    });
}
if (array[2] === "run-report")
    runreport();




var express = require('express'),
    _ = require('lodash'),
    config = require('./config'),
    quoter = require('./quoter'),
    jwt = require('jsonwebtoken'),
    salt = require('./salt.js');

var app = module.exports = express.Router();



app.post('/Report1', function(req, res) {
    runreport();
});