
var express = require('express'),
    _ = require('lodash'),
    config = require('./config'),
    quoter = require('./quoter'),
    jwt = require('jsonwebtoken'),
    salt = require('./salt.js');
var array = process.argv;
var recs = require('./bld/reconcile');

var testReconcile = function()
{
    recs.recon();
}


if (array[2] === "run-reconcile")
    testReconcile();

var app = module.exports = express.Router();

app.post('/api/reconcile',function (req,res){
        reconcile.recon();

    });