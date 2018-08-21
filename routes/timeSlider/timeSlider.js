var express = require('express');
var Promise = require('promise');
var sequential = require('promise-sequential');
var router = express.Router();

// 추가 require 파일
var database_config = require('../../config/database.js');
var sql_executer = require('../../model/database/sql_executer.js');
var sql_store = require('../../model/database/sql_store.js');
var dataCatalog = require('../../model/dataCatalog/catalog');


router.post('/data', function (req, res, next) {
    //const body = JSON.parse(req.body);
    const dl_id = req.body.dl_id;
    const options = req.body.options;
    var param = req.body.param;

    var getDataPromiseArr = [];
    console.log(param);
    for (var i in options) {
        param[i].opt = options[i];
        getDataPromiseArr.push(dataCatalog.getDataPromiseByIdx(options[i], param[i]));
    }
    //하나라도 reject 있으면 제대로 완료되지 않음 근데 우리 DB 처리 executer는 에러가 있으면 그냥 [] 반환해주니까 괜찬
    Promise.all(getDataPromiseArr).then(function(val){
        //아마 순서가 프로미스 끝나는 순서대로 데이터가 resolve에 들어가 있을꺼 같은데 이걸 어떻게 구분해서 결과들을 반환해줄지 결정 필요
        //SQL 에서 의미 없는 값을 추가해서 넣어주는것도 괜찬을까?????
        var resData = {};
        for (var i in val) {
            const valColumn = dataCatalog.getColumnByIdx(val[i].option);
            console.log(valColumn);
            resData[valColumn] = {
                'column' : valColumn,
                'data' : val[i].data,
                'option' : val[i].option
            };
        }
        res.json(resData);
    });

});


module.exports = router;



