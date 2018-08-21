var express = require('express');
var Promise = require('promise');
var router = express.Router();

var session = require('express-session');


// 추가 require 파일
var database_config = require('../../config/database.js');
var sql_executer = require('../../model/database/sql_executer.js');
var sql_store = require('../../model/database/sql_store.js');

//var pool = new pg.Pool(db_config.config);
//var myClient;


router.get('/content', function (req, res, next) {
    //원래는 session에서 user_id 가져와서 처리해야하는데 일단은 admin으로 고정

    const user_id = "admin";
    const param = [user_id];

    var promise_select = sql_executer.query(database_config.config_sh, sql_store.log.selectLogList , param);
    promise_select.then(function (result) {
        res.json(result);
    });

});

router.post('/content', function (req, res, next) {
    //원래는 session에서 user_id 가져와서 처리해야하는데 일단은 admin으로 고정
//function, message, user_id, log_type
    const user_id = "admin";
    const func = req.body.func;
    const message = req.body.message;
    const log_type = req.body.log_type;
    const param = [func, message, user_id, log_type];
    var returnObj = {};

    var promise_select = sql_executer.query(database_config.config_sh, sql_store.log.addLog , param);
    promise_select.then(function (result) {
        if (result.length > 0) {
            returnObj.isSuccess = true;
            returnObj.data = result[0];
            res.json(returnObj);
        } else {
            returnObj.isSuccess = false;
            res.json(returnObj);
        }
    });

});


module.exports = router;



