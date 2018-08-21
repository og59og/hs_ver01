var express = require('express');
var router = express.Router();

var database_config = require('../../config/database.js');
var sql_executer = require('../../model/database/sql_executer.js');
var sql_store = require('../../model/database/sql_store.js');


/* GET users listing. */
router.get('/subs/column', function (req, res, next) {
    //test column 응답

    res.json([
        {name: "subs_id", title: "ID"},
        {name: "subs_no", title: "Number"},
        {name: "subs_name", title: "Name"}
    ]);
});

router.get('/subs/rows', function (req, res, next) {
    //test data 응답
       var promise_select = sql_executer.query(database_config.das_config, sql_store.select_subs_list_sql, null);
       promise_select.then(function (result) {
           res.json(result);
       });
});



/* GET users listing. */
router.get('/mtr/column', function (req, res, next) {
    //test column 응답

    res.json([
        {name: "mtr_id", title: "ID"},
        {name: "subs_id", title: "Subs_ID"},
        {name: "bank_no", title: "Bank_Number"}
    ]);
});

router.get('/mtr/rows', function (req, res, next) {

    //test data 응답
    var promise_select = sql_executer.query(database_config.das_config, sql_store.select_mtr_list_sql, null);
    promise_select.then(function (result) {

        res.json(result);

    });
});



/* GET users listing. */
router.get('/dl/column', function (req, res, next) {
    //test column 응답

    res.json([
        {name: "dl_id", title: "ID"},
        {name: "dl_no", title: "Number"},
        {name: "dl_name", title: "Name"},
        {name: "mtr_id", title: "Mtr_ID"}
    ]);

});

router.get('/dl/rows', function (req, res, next) {

    //test data 응답
    var promise_select = sql_executer.query(database_config.das_config, sql_store.select_dl_list_sql, null);
    promise_select.then(function (result) {

        res.json(result);

    });
});




/* GET users listing. */
router.get('/sw/column', function (req, res, next) {
    //test column 응답

    res.json([
        {name: "sw_id", title: "ID"},
        {name: "sw_loc", title: "개폐기 위치 정보"},
        {name: "dl_id", title: "DL_ID"},
        {name: "sw_kind_id", title: "스위치 종류 ID"},
        {name: "sw_loc_no", title: "개폐기 위치 정보 ID"}
    ]);
});

router.get('/sw/rows', function (req, res, next) {

    //test data 응답
    var promise_select = sql_executer.query(database_config.das_config, sql_store.select_sw_list_sql, null);
    promise_select.then(function (result) {

        res.json(result);

    });
});


module.exports = router;









/*
table 사용 예쩨
cols 에서 name은 해당 테이블 내부적으로 사용하는 거 같고 title은 보여줄 값인거 같고 그 외에 것은 뭔가 스타일 관련된 것 같으며 date같은경우 format을 정할 수 있는거 같다.
[
  {"name":"id","title":"ID","breakpoints":"xs sm","type":"number","style":{"width":80,"maxWidth":80}},
  {"name":"firstName","title":"First Name"},
  {"name":"lastName","title":"Last Name"},
  {"name":"something","title":"Never seen but always around","visible":false,"filterable":false},
  {"name":"jobTitle","title":"Job Title","breakpoints":"xs sm","style":{"maxWidth":200,"overflow":"hidden","textOverflow":"ellipsis","wordBreak":"keep-all","whiteSpace":"nowrap"}},
  {"name":"started","title":"Started On","type":"date","breakpoints":"xs sm md","formatString":"MMM YYYY"},
  {"name":"dob","title":"Date of Birth","type":"date","breakpoints":"xs sm md","formatString":"DD MMM YYYY"},
  {"name":"status","title":"Status"}
]
값을 불러오는걸로 보이며 name로 사용한 key값에 맞춰서 데이터를 넣어줘야 하는걸로 보인다.
date 같은경우 long형으로 보내면 알아서 format에 맞춰서 처리해주는걸로 보인다.
[
  {"id":1,"firstName":"Annemarie","lastName":"Bruening","something":1381105566987,"jobTitle":"Cloak Room Attendant","started":1367700388909,"dob":122365714987,"status":"Suspended"},
  {"id":2,"firstName":"Nelly","lastName":"Lusher","something":1267237540208,"jobTitle":"Broadcast Maintenance Engineer","started":1382739570973,"dob":183768652128,"status":"Disabled"},
  {"id":3,"firstName":"Lorraine","lastName":"Kyger","something":1263216405811,"jobTitle":"Geophysicist","started":1265199486212,"dob":414197000409,"status":"Active"},
  {"id":4,"firstName":"Maire","lastName":"Vanatta","something":1317652005631,"jobTitle":"Gaming Cage Cashier","started":1359190254082,"dob":381574699574,"status":"Disabled"},
  {"id":5,"firstName":"Whiney","lastName":"Keasler","something":1297738568550,"jobTitle":"High School Librarian","started":1377538533615,"dob":-11216050657,"status":"Active"},
  {"id":6,"firstName":"Nikia","lastName":"Badgett","something":1283192889859,"jobTitle":"Clown","started":1348067291754,"dob":-236655382175,"status":"Active"},
  {"id":7,"firstName":"Renea","lastName":"Stever","something":1289586239969,"jobTitle":"Work Ticket Distributor","started":1312738712940,"dob":483475202947,"status":"Disabled"},
]
 */