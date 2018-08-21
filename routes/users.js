var express = require('express');
var Promise = require('promise');
var router = express.Router();

var session = require('express-session');

var database_config = require('../config/database.js');
var sql_executer = require('../model/database/sql_executer.js');
var sql_store = require('../model/database/sql_store.js');

//로그인 페이지로 이동
router.get('/login', function(req, res, next) {
    res.render('user/login');
});

//로그아웃
router.get('/logoff', function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
