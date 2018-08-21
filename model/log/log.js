var database_config = require('../../config/database.js');
var sql_executer = require('../../model/database/sql_executer.js');
var sql_store = require('../../model/database/sql_store.js');


var logManager = {
    makeLog : function(message, func, user_id){
        //message, function, user
        return new Promise(function(resolve, reject){
            const param = [func, message, user_id];
            var addLogPromise = sql_executer.query(database_config.config_sh, log.addLog, param);
            addLogPromise.then(function (result) { // result = [{idx=1}]
                if (result.length == 0) {
                    resolve({"isSuccess" : false});
                } else {
                    resolve({"idx" : result[0].idx, "isSuccess" : true});
                }
            });


        });
    },
    getLogList : function(user_id){
        return new Promise(function(resolve, reject){
            const param = [user_id];
            var addLogPromise = sql_executer.query(database_config.config_sh, log.selectLogList, param);
            addLogPromise.then(function (result) { // result = [{idx=1}]
                if (result.length == 0) {
                    resolve({data : [], "isSuccess" : true}); //data가 없을 수 있어 데이터가 없어도 성공
                } else {
                    resolve({data : result, "isSuccess" : true});
                }
            });
        });
    },
    getLogByIdx : function(idx, user_id){
        return new Promise(function(resolve, reject){
            const param = [idx, user_id];
            var addLogPromise = sql_executer.query(database_config.config_sh, log.selectLogByIdx, param);
            addLogPromise.then(function (result) { // result = [{idx=1}]
                if (result.length == 0) {
                    resolve({data : [], "isSuccess" : true}); //data가 없을 수 있어 데이터가 없어도 성공
                } else {
                    resolve({data : result, "isSuccess" : true});
                }
            });
        });
    },


};

module.exports = logManager;