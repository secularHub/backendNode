var express = require('express'),
    _ = require('lodash'),
    config = require('./config'),
    jwt = require('jsonwebtoken'),
    salt = require('./salt.js');

var app = module.exports = express.Router();

var cradle = require('cradle');
var db = new(cradle.Connection)().database('docs');

function validate(u, p) {
    db.get('users', function(err, doc) {
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

function createToken(user) {
    return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 60 * 5 });
}

// app.post('/sessions/signin', function(req, res) {
//     console.log("create with: " + req.body.login);
//     var pw = salt.saltHashPassword(req.body.password).salt;
//     if (!req.body.login || !pw) {
//         return res.status(400).send("You must send the username and the password");
//     }
//     try {
//         isuser = jdb.getData("/" + req.body.login);
//         if (isuser.password === req.body.password) {
//             console.log('good pw on signin returning 201');
//             return res.status(201).send(iuser);
//         }

//     } catch (error) {
//         console.log(error);
//     }



//     var profile = _.pick(req.body, 'login', 'password', 'email');

//     users.login = profile.login;
//     users.password = profile.password;
//     users.email = profile.email;
//     jdb.push("/" + users.login, users);
//     return res.status(201).send({
//         id_token: token
//     });

// });

app.post('/sessions/test', function(req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send("You must send the username and the password");
    }

    return res.status(201).send({
        id_token: createToken(user)

    })

    return res.status(401).send("The username or password don't match");

});
app.post('/sessions/login', function(req, res) {
    console.log("create with: " + req.body.login);
    var pw = salt.salt(req.body.password).passwordHash;
    //var pw = salt.saltHashPassword(req.body.password).salt;
    if (req.body.username == null || pw == null) {
        return res.status(400).send("You must send the username and the password");
    }
    try {
        validate(req.body.username, pw, function(req, validRes) {
            if (validRes == true) {
                console.log('good pw on signin returning 201');
                return res.status(201).send({
                    id_token: createToken(req.body.login)
                });
            } else {
                console.log('valid didn not match a user and pw');
                return res.status(401).send("The username or password don't match");
            }
        })
    } catch (error) {
        console.log(error);
    }
});
//return res.status(401).send("The username or password don't match");