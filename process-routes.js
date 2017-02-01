
var express = require('express'),
    _ = require('lodash'),
    config = require('./config'),
    quoter = require('./quoter'),
    jwt = require('jsonwebtoken'),
    salt = require('./salt.js');
var array = process.argv;
var reconcile = require('./processing/reconcile')

testReconcile()
{
    reconcile.recon();
}


if (array[2] === "run-reconcile")
    testReconcile();

var app = module.exports = express.Router();

app.post('/api/reconcile',function (req,res){
        reconcile.recon();

    });