var express = require('express');
var router = express.Router();
var request = require('request');

// DB 연결용 require 파일
var database_config = require('../../config/database.js');
var sql_executer = require('../../model/database/sql_executer.js');
var sql_store = require('../../model/database/sql_store.js');
var apiManager = require('../../config/api_server');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/vector-layer', function (req, res, next) {
    res.render('electrical_diagram_gis/vector-layer');
});

router.get('/draw-and-modify-features', function (req, res, next) {
    res.render('draw-and-modify-features');
});

router.get('/electrical_diagram_gis_main', function (req, res, next) {
    res.render('electrical_diagram_gis/gis_main');
});

router.post('/geo_data_result', function (req, res, next) {
    // console.log(req.body);
    var tempMap = JSON.parse(req.body.sendMapData);
    // var tmp = eval(req.body.sendMapData);

    for (var i = 0; i < tempMap.length; i++) {
        // console.log('---------- i : ', i, '------------------');
        // console.log('point: ' + tempMap[i].point);
        // console.log('featureType: ' + tempMap[i].featureType);
        // console.log('xp: ' + tempMap[i].xp);
    }


});

router.post('/geo_data_detail', function(req, res, next) {
    // console.log('in geo_data_detail');
    // console.log(req.body);

    var url= req.body.url;
    // var resultData ;
  /*  // console.log('[Node.js Server] url: ', url);*/


    try{

        var request = require('request');

        request({
            url: url,
        }, function(err, geo_res, html){
            if(err){
                // console.log('[Node.js Server] error : ', err);
                return;
            }
            // console.log('[Node.js Server] success!');
            // console.log('[Node.js Server] geo_res : ', geo_res);
            // console.log('[Node.js Server] html : ', html);

            res.json(geo_res.body);
        });

    }catch (e) {
        // console.log(e);
    }

    /*
    // ajax 호출 시도
    $.ajax({
        type: "POST"
        , url: url
        , success:function(data){
            // console.log('Success Data : ', data);
            // console.log('url : ', url);
            alert('Ajax Success ! ');
            resultData = data;
        }
        , error:function(data) {
            // console.log('Error Data : ', data);
            // console.log('url : ', url);
            alert('Ajax Error!');
        }
    });

    if(resultData){
        res.resultData = {'json_result': resultData};
    }*/
});

router.post('/geo_feature_data_in_extent', function(req, res, next) {
    // console.log('in geo_feature_data_in_extent');
    // console.log(req.body);

    var url = req.body.url;
    // var resultData ;
  /*  // console.log('[Node.js Server] url: ', url);*/

    try{

        var request = require('request');

        request({
            url: url,
        }, function(err, geo_res, html){
            if(err){
                // console.log('[Node.js Server] error : ', err);
                return;
            }
            // console.log('[Node.js Server] success!');
            // console.log('[Node.js Server] geo_res : ', geo_res);
            // console.log('[Node.js Server] html : ', html);

            res.json(geo_res.body);
        });

    }catch (e) {
        // console.log(e);
    }



    /*
    // ajax 호출 시도
    $.ajax({
        type: "POST"
        , url: url
        , success:function(data){
            // console.log('Success Data : ', data);
            // // console.log('url : ', url);
            alert('Ajax Success ! ');
            resultData = data;
        }
        , error:function(data) {
            // console.log('Error Data : ', data);
            // console.log('url : ', url);
            alert('Ajax Error!');
        }
    });

    if(resultData){
        res.resultData = {'json_result': resultData};
    }*/
});

router.post('/request_subst_equipment', function(req, res, next) {
    // select_subst_equipment

    var sql = sql_store.select_subst_equipment;
    var data = [req.body.substid];

    var promise_select = sql_executer.query(database_config.daejeon_das_config, sql, data);
    promise_select.then(function (result) {
        // console.log('request_subst_equipment :', result);
        res.send(result);
    });

});

//## TODO : routes/algorithm 으로 이동해야함
router.post('/requst_pqms_algorithm', function(req, res, next) {
    // console.log('in requst_pqms_algorithm');
    // console.log(req.body);

    const subs_id = req.body.subs_id;
    const dl_id = req.body.dl_id;
    const algo_type = req.body.algo_type;
    const pred_date = req.body.pred_date;

    const url = apiManager.api_server_address + "/pqms";
    const auth_service_key = apiManager.service_api_key.algorithm_service.key;
    const param = {
        'subs_id' : subs_id,
        'dl_id' : dl_id,
        'algo_type' : algo_type,
        'time' : pred_date,
        'api_key' : auth_service_key
    };

    var reqInfo = {url: url, form: param};
    var callBackFunction = function optionalCallback(error, response, body) {
        var resultObj = {};
        if (error) {
            // console.log(error);
            resultObj.isSuccess = false;
            resultObj.message = "요청 처리 전달중 에러 - deliverAPI-request";
            res.json(resultObj);
        } else {
            resultObj.isSuccess = true;
            resultObj.body = JSON.parse(response.body);

            // console.log(resultObj);

            res.json(resultObj);
        }
    };
    request.post(reqInfo, callBackFunction);


});

router.post('/request_subsid_using_substcd', function(req, res, next) {
    // select_subst_equipment

    var sql = sql_store.select_subsid_using_substcd;
    var data = [req.body.substcd];

    var promise_select = sql_executer.query(database_config.daejeon_das_config, sql, data);
    promise_select.then(function (result) {
        // console.log('request_subsid_using_substcd :', result);
        res.send(result);
    });

});

router.post('/selectAlgorithmList', function (req, res, next) {
    var sql = sql_store. select_algorithm_list_sql;
    var data = [];
    var promise_select = sql_executer.query(database_config.config_sh, sql, data);
    promise_select.then(function (result) {
        // console.log(result);
        res.send(result);
    });

});

module.exports = router;
