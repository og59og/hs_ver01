var express = require('express');
var router = express.Router();
var request = require('request');

var apiManager = require('../../config/api_server');

// 추가 require 파일
var database_config = require('../../config/database.js');
var sql_executer = require('../../model/database/sql_executer.js');
var sql_store = require('../../model/database/sql_store.js');


router.post('/pv', function(req, res, next) {
    console.log('in requst_pqms_algorithm');

    const capacity = req.body.capacity;
    const date = req.body.date;
    const algoType = req.body.algoType;
    const pv_id = req.body.pv_id;

    const url = apiManager.api_server_address + "/pv";
    const auth_service_key = apiManager.service_api_key.algorithm_service.key;
    const param = {
        'capacity' : capacity,
        'date' : date,
        'algoType' : algoType,
        'pv_id' : pv_id,
        'api_key' : auth_service_key
    };

    var reqInfo = {url: url, form: param};
    var callBackFunction = function optionalCallback(error, response, body) {
        var resultObj = {};
        if (error) {
            console.log(error);
            resultObj.isSuccess = false;
            resultObj.message = "요청 처리 전달중 에러 - deliverAPI-request";
            res.json(resultObj);
        } else {
            resultObj.isSuccess = true;
            resultObj.body = JSON.parse(response.body);

            console.log(resultObj);

            res.json(resultObj);
        }
    };
    request.post(reqInfo, callBackFunction);


});
router.post('/sectionLoad', function(req, res, next) {
    const dl_id = req.body.dl_id;
    const date = req.body.date;
    const algoType = req.body.algoType;

    const url = apiManager.api_server_address + "/sectionLoad";
    const auth_service_key = apiManager.service_api_key.algorithm_service.key;
    const param = {
        'dl_id' : dl_id,
        'date' : date,
        'algoType' : algoType,
        'api_key' : auth_service_key
    };

    var reqInfo = {url: url, form: param};
    var callBackFunction = function optionalCallback(error, response, body) {
        var resultObj = {};
        if (error) {
            console.log(error);
            resultObj.isSuccess = false;
            resultObj.message = "요청 처리 전달중 에러 - deliverAPI-request";
            res.json(resultObj);
        } else {
            resultObj.isSuccess = true;
            resultObj.body = JSON.parse(response.body);

            //console.log(resultObj);

            res.json(resultObj);
        }
    };
    request.post(reqInfo, callBackFunction);


});

router.post('/list', function(req, res, next) {

    var promise_select = sql_executer.query(database_config.config_sh, sql_store.algorithm.selectAll , []);
    promise_select.then(function (result) {
        res.json(result);
    });
});

router.post('/info', function(req, res, next) {
    var param = [req.body.algo_idx];
    var promise_select = sql_executer.query(database_config.config_sh, sql_store.algorithm.select , param);
    promise_select.then(function (result) {
        console.log(result);
        res.json(result);
    });
});

router.get('/version', function (req, res, next) {
    const algo_version_id = req.query.algo_version_id;

    var promise_select = sql_executer.query(database_config.config_sh, sql_store.algorithm.selectAlgoVersionInfo , [algo_version_id]);
    promise_select.then(function (result) {
        console.log(result);
        res.json(result);
    });

});

module.exports = router;