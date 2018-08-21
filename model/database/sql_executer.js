var pg = require('pg');
var format = require('pg-format');
var Promise = require('promise');

var executer = {



    /**
     *  @ version 1.10
     *  @ Author 노상훈
     *  @ New Date  2018-04-27
     *  @ Update Date 2018.05.23
     *  @ Param
     *  - db_conf : 디비 연결 정보
     *  - sql : query 문자열
     *  - data : data를 가지는 object
     *  @ Description : Database에 query를 통해서 요청하는 부분의 간략화
     *  @ Update1 : Select 결과가 없어서 result가 undefined인 경우 예외 처리
     */
    query : function (pool, sql, data) {
        return new Promise(function (resolved, rejected) {

            try {
                pool.connect(function (err, client, done) {
                    if (err) {
                        console.log("***query sql_executer connection error***");
                        console.log(err);
                        resolved([]);
                        return;
                    }
                    var query = {
                        text: sql,
                        values: data
                    };
                    client.query(query, function (err2, result){
                        done();
                        if (err2) {
                            console.log(err2);
                            resolved([]);
                            return;
                        }
                        if (result != undefined) {
                            resolved(result.rows);
                        } else {
                            resolved([]);
                        }

                    })
                })
            } catch (error) {
                console.log(error);
                resolved([]);
            }
        });
    },
    /**
     *  @ version 1.10
     *  @ Author 노상훈
     *  @ New Date  2018-04-27
     *  @ Update Date 2018.05.23
     *  @ Delete Date 2018.06.23
     *  @ Param
     *  - db_conf : 디비 연결 정보
     *  - sql : query 문자열
     *  - data : data를 가지는 object
     *  @ Description : Database에 query를 통해서 요청하는 부분의 간략화
     *  @ Update1 : Select 결과가 없어서 result가 undefined인 경우 예외 처리
     *  @ Delete : 여러 sql을 실행시켜야 하는경우 executer.query 함수를 통해 promise를 여러개 받고 Primise.all을 통해서 처리하는 방법으로 변경
     */
/*    queries : function (pool, query_info) {
        return new Promise(function (resolved, rejected) {
            try {
                pool.connect(function (err, client, done) {

                    for (var i=0; i < query_info['data'].length; i++) {
                        var query = {
                            text: query_info.sql,
                            values: query_info['data'][i]
                        };
                        client.query(query, function (err, result) {
                            done();
                            if (err) {
                                rejected(Error("postgreSQL select error"));
                            }
                            if (result != undefined) {
                                resolved(result.rows);
                            } else {
                                resolved([]);
                            }
                        })
                    }

                })
            } catch (error) {
                rejected(Error("postgreSQL select error"));
            }
        });
    }*/
}

module.exports = executer;