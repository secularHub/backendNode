
var express = require('express'),
    _ = require('lodash'),
    config = require('./config'),
    quoter = require('./quoter'),
    jwt = require('jsonwebtoken'),
    salt = require('./salt.js');
var array = process.argv;

//import {recs} from './bld/reconcile';
var recs = require('./bld/reconcile');
var testReconcile = function()
{
    recs.reconcile.recon();
}


if (array[2] === "run-reconcile")
    testReconcile();

var app = module.exports = express.Router();

app.post('/api/reconcile',function (req,res){
        recs.reconcile.recon();

    });