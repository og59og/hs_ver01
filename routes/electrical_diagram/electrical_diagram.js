var express = require('express');
var Promise = require('promise');
var router = express.Router();
var pg = require('pg');
var format = require('pg-format');
var ajax = require('ajax');

var databaseConfig = require('../../config/database.js');
var sqlExecuter = require('../../model/database/sql_executer.js');
var sqlStore = require('../../model/database/sql_store.js');

//특정 DL의 스위치 모두 가져오기
router.post('/dl/sw/all', function (req, res, next) {

    if (!req.body || !req.body.dl)
        res.json({});
    //test data 응답
    var promise_select = sqlExecuter.query(databaseConfig.daejeon_das_config, sqlStore.select_sw_list_in_dl_sql, [req.body.dl]);
    promise_select.then(function (result) {

        res.json(result);

    });
});

//라인 가져오기
router.post('/dl/line/all', function (req, res, next) {
    var sql = sqlStore.select_line_list_in_dl_sql;
    var data = [req.body.dl];

    var promise_select = sqlExecuter.query(databaseConfig.daejeon_das_config, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});

router.post('/mtr/sw/all', function (req, res, next) {

    if (!req.body || !req.body.mtr)
        res.json({});
    //test data 응답
    var promise_select = sqlExecuter.query(databaseConfig.daejeon_das_config, sqlStore.select_sw_list_in_mtr_sql, [req.body.mtr]);
    promise_select.then(function (result) {
        res.json(result);
    });
});

//라인 가져오기
router.post('/mtr/line/all', function (req, res, next) {
    if (!req.body || !req.body.mtr)
        res.json({});
    var promise_select = sqlExecuter.query(databaseConfig.daejeon_das_config, sqlStore.select_line_list_in_mtr_sql, [req.body.mtr]);
    promise_select.then(function (result) {
        res.send(result);
    });
});

//스위치 코드 가져오기
router.post('/kindcode/all', function (req, res, next) {

    var promise_select = sqlExecuter.query(databaseConfig.daejeon_das_config, sqlStore.select_kind_code, []);
    promise_select.then(function (result) {
        res.json(result);
    });
});

/**
 *  @ version 1.0.0
 *  @ Author 노주희
 *  @ New Date 2018-05-08
 *  @ Update Date
 *  @ Description - DB에서 DL ID에 해당 데이터를 ajax로 통신
 */
router.post('/searchDL', function (req, res, next) {
    var sql = sqlStore.select_dl_diagram_sql;
    var data = [req.body.dl, req.body.dl];

    var promise_select = sqlExecuter.query(databaseConfig.daejeon_das_config, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});

/**
 *  @ version 1.0.0
 *  @ Author 노주희
 *  @ New Date  2018-06-09
 *  @ Update Date 
 *  @ Param 
 *  @ Description  - 변전소-변압기 정보
 */
router.post('/searchSubs', function (req, res, next) {
    var sql = sqlStore.select_subs_diagram_sql;
    var data = [req.body.subs_id, req.body.subs_id];

    var promise_select = sqlExecuter.query(databaseConfig.daejeon_das_config, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});

/**
 *  @ version 1.0.0
 *  @ Author 노주희
 *  @ New Date  2018-06-01
 *  @ Update Date
 *  @ Param
 *  @ Description  - 시뮬레이션모드에서 Object 추가 시 개폐기 id 중복 체크
 */
router.post('/checkSwId', function (req, res, next) {
    var sql = sqlStore.check_sw_id_sql;
    var data = [req.body.id];

    var promise_select = sqlExecuter.query(databaseConfig.daejeon_das_config, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});

router.post('/selectSubs', function (req, res, next) {
    var sql = sqlStore.select_subs_id;
    var data = [];

    var promise_select = sqlExecuter.query(databaseConfig.daejeon_das_config, sql, data);
    promise_select.then(function (result) {
        res.json(result);
    });
});

/**
 *  @ version 1.0.0
 *  @ Author 노주희
 *  @ New Date  2018-06-12
 *  @ Update Date
 *  @ Param
 *  @ Description  - 다회로 개폐기 그룹 조회
 */
router.post('/searchPadGroup', function (req, res, next) {
    var sql = sqlStore.select_pad_group_sql;
    var data = [req.body.id];

    var promise_select = sqlExecuter.query(databaseConfig.das_config, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});

/**
 *  @ version 1.0.0
 *  @ Author 노주희
 *  @ New Date  2018-07-02
 *  @ Update Date
 *  @ Param
 *  @ Description  - 시뮬레이션 모드로 변경 시 에디터 영역에 추가 할 오브젝트 목록 가져오기
 */
router.post('/editorObj/all', function (req, res, next) {
    var sql = sqlStore.select_editorObj_list_sql;

    var promise_select = sqlExecuter.query(databaseConfig.config_sh, sql, null);
    promise_select.then(function (result) {
        res.send(result);
    });
});

/**
 *  @ version 1.0.0
 *  @ Author 노주희
 *  @ New Date  2018-06-21
 *  @ Update Date
 *  @ Param
 *  @ Description  - mxGraph 예제 테스트
 */
router.get('/mxgraph', function (req, res, next) {
    res.render("electrical_diagram/mxGraph_svg");
});

/**
 *  @ version 1.0.0
 *  @ Author 노주희
 *  @ New Date  2018-07-03
 *  @ Update Date
 *  @ Param
 *  @ Description  - 시뮬레이션모드에서 Object 추가 시 현재 dl에 id가 존재하는지 확인
 */
router.post('/checkSwId/dl', function (req, res, next) {
    var sql = sqlStore.check_dl_sw_id_sql;
    var data = [req.body.dl, req.body.id];

    var promise_select = sqlExecuter.query(databaseConfig.daejeon_das_config, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});

module.exports = router;
