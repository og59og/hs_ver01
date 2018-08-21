var express = require('express');
var Promise = require('promise');
var router = express.Router();

var session = require('express-session');

var pg = require('pg');
var format = require('pg-format');

// 추가 require 파일
var database_config = require('../config/database.js');
var sql_executer = require('../model/database/sql_executer.js');
var sql_store = require('../model/database/sql_store.js');

//var pool = new pg.Pool(db_config.config);
//var myClient;

/**
 *  @ version 1.0.0
 *  @ Description
 *  Index Page route
 */
router.get('/', function (req, res, next) {
    var sess = req.session;
    const subs_id = sess.subs_id;
    const subs_no = sess.subs_no;
    const user_name = sess.name;
    console.log(subs_id);
    console.log(subs_no);
    res.render('index', { 'subs_id': subs_id,  'subs_no' : subs_no , 'user_name' : user_name});
});
router.get('/ui', function (req, res, next) {
    res.render('UI/main');
});


router.post('/ui/value', function (req, res, next) {
    var sql = sql_store.label_sql;
    var data = [];


    var promise_select = sql_executer.query(database_config.config_sh, sql, data);
    promise_select.then(function (result) {
        console.log(result);
        res.send(result);
    });

});

router.post('/ui/object', function (req, res, next) {
    var sql = sql_store.object_sql;
    var data = [];
    var promise_select = sql_executer.query(database_config.config_sh, sql, data);
    promise_select.then(function (result) {
        console.log(result);
        res.send(result);
    });

});
router.post('/ui/algorithm', function (req, res, next) {
    var sql = sql_store.algorithm_sql;
    var data = [];
    var promise_select = sql_executer.query(database_config.config_sh, sql, data);
    promise_select.then(function (result) {
        console.log(result);
        res.send(result);
    });

});


router.post('/ui/userInfo', function (req, res, next) {
    var sql = sql_store.user_info_sql;
    sess = req.session;

    var data = [sess.user_id];

    var promise_select = sql_executer.query(database_config.login_sh, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });

});


router.post('/ui/val', function (req, res, next) {
    var sql = sql_store.label_check_sql;

    //##TODO : 세션에서 값을 받아올 수 있도록 해야하며 차후에는 유저 정보가 어떻게 될지 모르겠으나 현 시점에서는 user_id 및 project_id를 저장하며 user_id를 이용해야한다.
    //sess = req.session;
    //var idx = sess.user_idx;
    var idx = -1;
    var data = req.body;

    var updateDataShowOptionPromiseArr = [];
    for(var i = 0; i < data.length; i++ ){
        const value = [data[i].check_activation, idx, data[i].label_type_idx  ];
        updateDataShowOptionPromiseArr.push(sql_executer.query(database_config.config_sh, sql, value));
    }

    //##TODO 1 : 만약 update하려는 개수와 결과 개수가 틀리면 update에 실패한게 있다는건데 원래 데이터로 롤백해줘야함
    //##TODO 2 : 롤백 하려면 기존의 데이터가 있어야 하는데 update 하기전에 select 부터 해야 하는가?
    Promise.all(updateDataShowOptionPromiseArr).then(function(result){
        console.log(result);
        res.send(result);
    });


})


router.post('/ui/obj', function (req, res, next) {
    var sql = sql_store.object_check_sql;

    //##TODO : 세션에서 값을 받아올 수 있도록 해야하며 차후에는 유저 정보가 어떻게 될지 모르겠으나 현 시점에서는 user_id 및 project_id를 저장하며 user_id를 이용해야한다.
    //sess = req.session;
    //var idx = sess.user_idx;
    var idx = -1;

    var tmp = JSON.parse(req.body);

    var updateObjectShowOptionPromiseArr = [];
    for(var i = 0; i < tmp.length; i++ ){
        const value = [tmp[i].check_activation, idx, tmp[i].object_type_idx  ];
        updateObjectShowOptionPromiseArr.push(sql_executer.query(database_config.config_sh, sql, value));
    }

    //##TODO 1 : 만약 update하려는 개수와 결과 개수가 틀리면 update에 실패한게 있다는건데 원래 데이터로 롤백해줘야함
    //##TODO 2 : 롤백 하려면 기존의 데이터가 있어야 하는데 update 하기전에 select 부터 해야 하는가?
    Promise.all(updateObjectShowOptionPromiseArr).then(function(result){
        console.log(result);
        res.send(result);
    });


});


router.post('/ui/algo', function (req, res, next) {
    var sql = sql_store.algo_check_sql;

    //##TODO : 세션에서 값을 받아올 수 있도록 해야하며 차후에는 유저 정보가 어떻게 될지 모르겠으나 현 시점에서는 user_id 및 project_id를 저장하며 user_id를 이용해야한다.
    //sess = req.session;
    //var idx = sess.user_idx;
    var idx = -1;

    var tmp = JSON.parse(req.body);

    var updateAlgoShowOptionPromiseArr = [];
    for(var i = 0; i < tmp.length; i++ ){
        const algo = [tmp[i].check_activation, idx, tmp[i].algorithm_info_idx  ];
        updateAlgoShowOptionPromiseArr.push(sql_executer.query(database_config.config_sh, sql, algo));
    }

    //##TODO 1 : 만약 update하려는 개수와 결과 개수가 틀리면 update에 실패한게 있다는건데 원래 데이터로 롤백해줘야함
    //##TODO 2 : 롤백 하려면 기존의 데이터가 있어야 하는데 update 하기전에 select 부터 해야 하는가?
    Promise.all(updateAlgoShowOptionPromiseArr).then(function(result){
        console.log(result);
        res.send(result);
    });

})

// 노주희 추가
router.post('/ui/showDistributionList', function (req, res, next) {
    var sql = sql_store.select_all_list_sql;
    var data = [];
    var promise_select = sql_executer.query(database_config.daejeon_das_config, sql, data);
    promise_select.then(function (result) {
        // console.log(result);
        res.send(result);
    });
});


router.post('/ui/editorCategory', function (req, res, next) {
    var sql = sql_store.select_editor_category;
    var data = [];
    var promise_select = sql_executer.query(database_config.config_sh, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});

router.post('/ui/editorImage', function (req, res, next) {
    var sql = sql_store.select_editor_image;
    var data = [];
    var promise_select = sql_executer.query(database_config.config_sh, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});


router.post('/ui/editorCategorys', function (req, res, next) {
    var sql = sql_store.insert_editor_category;

    var tmp = JSON.parse(req.body.editor)
    var data=[tmp[0],tmp[1],-1];

    var promise_select = sql_executer.query(database_config.config_sh, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});

router.post('/ui/addEditorImage', function (req, res, next) {
    var sql = sql_store.insert_editor_image_category ;

    var tmp = JSON.parse(req.body.Image)
    var data=[tmp[0],tmp[1],tmp[2],tmp[3],-1];

    var promise_select = sql_executer.query(database_config.config_sh, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});

router.post('/ui/deleteEditorCategory', function (req, res, next) {
    var sql = sql_store.delete_editor_category ;
    var tmp = JSON.parse(req.body.categorydelete);
    console.log(tmp);
    var data=[tmp[0]];

    var promise_select = sql_executer.query(database_config.config_sh, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});

router.post('/ui/deleteEditorImage', function (req, res, next) {
    var sql = sql_store.delete_editor_image ;
    var tmp = JSON.parse(req.body.imagedelete);
    console.log(tmp);
    var data=[tmp[0]];

    var promise_select = sql_executer.query(database_config.config_sh, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});


router.post('/ui/updateEditorCategory', function (req, res, next) {
    var sql = sql_store.update_editor_category ;
    var tmp = JSON.parse(req.body.update);
    console.log(tmp);
    var data=[tmp[0],tmp[1]];


    var promise_select = sql_executer.query(database_config.config_sh, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});


router.post('/ui/updateEditorImage', function (req, res, next) {
    var sql = sql_store.update_editor_image ;
    var tmp = JSON.parse(req.body.updateeditor);
    console.log(tmp);
    var data=[tmp[0],tmp[1]];


    var promise_select = sql_executer.query(database_config.config_sh, sql, data);
    promise_select.then(function (result) {
        res.send(result);
    });
});


module.exports = router;



