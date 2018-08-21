// 추가 require 파일
var Promise = require('promise');
var database_config = require('../../config/database.js');
var sql_executer = require('../../model/database/sql_executer.js');
var sql_store = require('../../model/database/sql_store.js');


//불러오려는 데이터와 이를 숫자 value로 맵핑시켜주자.
//일단은 이런식으로 만들어서 돌아가게는 하겠는데 실제로 서비스할때는 동적으로 이뤄져야 하 ㄹ수 있는데 그럼 어떻게함?
//GUI에서 추가,제거 할 수 있는 manager/admin 페이지가 있어야할꺼같고 그런 정보를 DB에 저장해야하는데
//문제는 column, table, where 조건 등 여러가지를 다 설정받아놔야함 지금 생각해둔거 외에도 더 추가해야할 수 있음

var catalog = {

    //map 을 두개둬서 처리?
    //if문을 그냥 엄청 많이 만들어?
    idxKeyMap : {}, //idx : {column, table, where}
    columnKeymap : {}, //column : idx

    //##TODO : 차후에는 DB 같은 정보를 불러와서 초기화 할 수 있도록 수정해야함
    //##TODO : DB SQL에서 slider의 기준이 되는 시간값의 column은 반드시 time이 되도록 반환을 해줘야한다.
    initKeyMap : function(){
        catalog.idxKeyMap[4] = {'column' : 'sec_load', 'db_conf' : database_config.daejeon_das_config, 'sql' : sql_store.slider.getSecLoad};
        catalog.columnKeymap['sec_load'] = 4;
    },

    getIdxByColumn : function(column){
        return catalog.columnKeymap[column];
    },
    getColumnByIdx : function(idx){
        return catalog.idxKeyMap[idx].column;
    },

    getDataPromiseByIdx : function(idx, param) {
        return new Promise(function (resolve, reject) {
            const db_conf = catalog.idxKeyMap[idx].db_conf;
            const sql = catalog.idxKeyMap[idx].sql;
            var getDataPromise = sql_executer.query(db_conf, sql, param.data);
            getDataPromise.then(function (returnData) {
                const returnObj = {option : param.opt, data : returnData};
                resolve(returnObj);
            });
        });
    },
    getDataPromiseByColumn : function(column, param){
        return catalog.getDataPromiseByIdx(catalog.getIdxByColumn(column), param);

    },

    
};
catalog.initKeyMap();
module.exports = catalog;