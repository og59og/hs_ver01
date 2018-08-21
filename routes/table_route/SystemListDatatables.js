var express = require('express');
var router = express.Router();
var apiManager = require('../../config/api_server');

var database_config = require('../../config/database.js');
var sql_executer = require('../../model/database/sql_executer.js');
var sql_store = require('../../model/database/sql_store.js');
var utils = require('../../model/datatables/util.js');
var request = require('request');

/**
 *  @ Title 변전소 데이터 획득
 *  @ version 1.0.0
 *  @ Author 노상훈 주임
 *  @ New Date 2018.05.15
 *  @ Update Date 2018.05.15
 *  @ Param datatables의 테이블 정보 - start / length / search[value] / draw
 *  @ Description
 *  테이블에서 넘겨주는 데이터 시작번호, 그릴 개수, 검색어를 통해서 데이터를 Select하여 반환한다.
 */
router.post('/subs/data', function (req, res, next) {

    var data = req.body;
    data.api_key = apiManager.service_api_key.datatables_service.key;
    const url = apiManager.api_server_address + "/subs/data";

    var reqInfo = {url: url, form: data};
    var callBackFunction = function optionalCallback(error, response, body) {
        var resultObj = {};
        if (error) {
            console.log(error);
            resultObj.isSuccess = false;
            resultObj.message = "요청 처리 전달중 에러 - deliverAPI-request";
            res.json(resultObj);
        } else {
            console.log("SystemListDatatables - subs data req success");
            res.json(JSON.parse(response.body));
        }
    };
    request.post(reqInfo, callBackFunction);

    /* 기존 모놀리틱
    var data = req.body;
    var p = utils.parseBody(data);
    var sql = utils.generateSqlForSubs(p);

    //데이터를 가져오고나서 전체 데이터 개수를 가져온다. 이후 select한 데이터 정리해서 json 형태로 반환
    var promise_select_subs = sql_executer.query(database_config.daejeon_das_config, sql.select_sql, null);
    promise_select_subs.then(function (selectData) {
        var promise_select_subs_cnt = sql_executer.query(database_config.daejeon_das_config, sql.cnt_sql, null);
        promise_select_subs_cnt.then(function (cnt) {
            var return_data = {
                draw : parseInt(p.draw),
                recordsTotal : parseInt(cnt[0].count),
                recordsFiltered : parseInt(cnt[0].count),
                data : selectData,
            };
            res.json(return_data);
        });
    });
    */
});

router.post('/mtr/data', function (req, res, next) {

    var data = req.body;
    data.api_key = apiManager.service_api_key.datatables_service.key;
    const url = apiManager.api_server_address + "/mtr/data";

    var reqInfo = {url: url, form: data};
    var callBackFunction = function optionalCallback(error, response, body) {
        var resultObj = {};
        if (error) {
            console.log(error);
            resultObj.isSuccess = false;
            resultObj.message = "요청 처리 전달중 에러 - deliverAPI-request";
            res.json(resultObj);
        } else {
            console.log("SystemListDatatables - mtr data req success");
            res.json(JSON.parse(response.body));
        }
    };
    request.post(reqInfo, callBackFunction);


    /*
    var data = req.body;

    var p = utils.parseBody(data);
    var sql = utils.generateSqlForMtrBank(p);

    //데이터를 가져오고나서 전체 데이터 개수를 가져온다. 이후 select한 데이터 정리해서 json 형태로 반환
    var promise_select_subs = sql_executer.query(database_config.daejeon_das_config, sql.select_sql, null);
    promise_select_subs.then(function (data) {
        var promise_select_subs_cnt = sql_executer.query(database_config.daejeon_das_config, sql.cnt_sql, null);
        promise_select_subs_cnt.then(function (cnt) {
            var return_data = {
                draw : parseInt(p.draw),
                recordsTotal : parseInt(cnt[0].count),
                recordsFiltered : parseInt(cnt[0].count),
                data : data,
            };
            res.json(return_data);
        });
    });
    */
});

router.post('/dl/data', function (req, res, next) {

    var data = req.body;
    data.api_key = apiManager.service_api_key.datatables_service.key;
    const url = apiManager.api_server_address + "/dl/data";

    var reqInfo = {url: url, form: data};
    var callBackFunction = function optionalCallback(error, response, body) {
        var resultObj = {};
        if (error) {
            console.log(error);
            resultObj.isSuccess = false;
            resultObj.message = "요청 처리 전달중 에러 - deliverAPI-request";
            res.json(resultObj);
        } else {
            console.log("SystemListDatatables - dl data req success");
            res.json(JSON.parse(response.body));
        }
    };
    request.post(reqInfo, callBackFunction);
    /*
    var data = req.body;

    var p = utils.parseBody(data);
    var sql = utils.generateSqlForDl(p);

    //데이터를 가져오고나서 전체 데이터 개수를 가져온다. 이후 select한 데이터 정리해서 json 형태로 반환
    var promise_select_dl = sql_executer.query(database_config.daejeon_das_config, sql.select_sql, null);
    promise_select_dl.then(function (data) {
        var promise_select_dl_cnt = sql_executer.query(database_config.daejeon_das_config, sql.cnt_sql, null);
        promise_select_dl_cnt.then(function (cnt) {
            var return_data = {
                draw : parseInt(p.draw),
                recordsTotal : parseInt(cnt[0].count),
                recordsFiltered : parseInt(cnt[0].count),
                data : data,
            };
            res.json(return_data);
        });
    });
    */
});

router.post('/sw/data', function (req, res, next) {

    var data = req.body;
    data.api_key = apiManager.service_api_key.datatables_service.key;
    const url = apiManager.api_server_address + "/sw/data";

    var reqInfo = {url: url, form: data};
    var callBackFunction = function optionalCallback(error, response, body) {
        var resultObj = {};
        if (error) {
            console.log(error);
            resultObj.isSuccess = false;
            resultObj.message = "요청 처리 전달중 에러 - deliverAPI-request";
            res.json(resultObj);
        } else {
            console.log("SystemListDatatables - dl data req success");
            res.json(JSON.parse(response.body));
        }
    };
    request.post(reqInfo, callBackFunction);
    /*
    var data = req.body;

    var p = utils.parseBody(data);
    var sql = utils.generateSqlForSw(p);

    //데이터를 가져오고나서 전체 데이터 개수를 가져온다. 이후 select한 데이터 정리해서 json 형태로 반환
    var promise_select_sw = sql_executer.query(database_config.daejeon_das_config, sql.select_sql, null);
    promise_select_sw.then(function (data) {
        var promise_select_sw_cnt = sql_executer.query(database_config.daejeon_das_config, sql.cnt_sql, null);
        promise_select_sw_cnt.then(function (cnt) {
            var return_data = {
                draw : parseInt(p.draw),
                recordsTotal : parseInt(cnt[0].count),
                recordsFiltered : parseInt(cnt[0].count),
                data : data,
            };
            res.json(return_data);
        });
    });
    */
});


module.exports = router;