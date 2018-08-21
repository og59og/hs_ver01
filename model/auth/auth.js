var request = require('request');
var apiManager = require('../../config/api_server');

var database_config = require('../../config/database.js');
var sql_executer = require('../../model/database/sql_executer.js');
var sql_store = require('../../model/database/sql_store.js');

var authApiManager = {
    login : function(param){
        return new Promise(function(resolve, reject){
            const auth_service_key = apiManager.service_api_key.auth_service.key;
            const project_idx = apiManager.service_api_key.auth_service.id;
            const id = param.id;
            const pw = param.pw;
            const url = apiManager.api_server_address + "/user/login";
            const authParam = {
                'api_key' : auth_service_key,
                'project_idx' : project_idx,
                'id' : id,
                'password' : pw
            };

            new Promise(function(resolve, reject){
                request.post({'url': url, form: authParam}, function optionalCallback(error, response, body) {
                    if (error) {
                        console.log("error");
                        resolve({'isSuccess' : false, 'errorMessage' : 'login promise error'});
                    } else {
                        resolve(response.body);
                    }

                });
            }).then(function(result){
                resolve(result);
            });
        });
    },
    join : function(param){
        return new Promise(function(resolve, reject){
            const getSubs_no_promist = sql_executer.query(database_config.daejeon_das_config, sql_store.user.getSubs_no, [param.subs_id]);
            getSubs_no_promist.then(function(subs_no_data){
                const sub_no = subs_no_data[0].subs_no;
                const auth_service_key = apiManager.service_api_key.auth_service.key;
                const project_idx = apiManager.service_api_key.auth_service.id;
                const url = apiManager.api_server_address + "/user/add";
                const authParam = {
                    'api_key' : auth_service_key,
                    'project_idx' : project_idx,
                    'id' : param.id,
                    'password' : param.password,
                    'name' : param.name,
                    'organization' : param.organization,
                    'subs_id' : param.subs_id,
                    'sub_no' : sub_no,
                };

                new Promise(function(resolve, reject){
                    request.post({'url': url, form: authParam}, function optionalCallback(error, response, body) {
                        resolve(response.body)
                    });
                }).then(function(result){
                    resolve(result);
                });
            });


        });
    },
    checkLogin : function(req, res, next){
        console.log("_------------------------------------------______________");
        const url = req.originalUrl;
        const method = req.method;
        if (url === "/users/login" && method === "POST") { //로그인 기능 처리
            var sql = sql_store.login_check_sql;
            var data = [req.body.id, req.body.pw];

            var loginParam = {
                'id' : req.body.id,
                'pw' : req.body.pw
            };
            const loginPromise = authApiManager.login(loginParam);
            loginPromise.then(function(loginPromiseResult){
                var loginResult = JSON.parse(loginPromiseResult);
                console.log(loginResult);
                if (loginResult.isSuccess) {
                    console.log(loginResult);
                    var sess = req.session;
                    sess.project_idx = loginResult.data.project_idx;
                    sess.user_id = loginResult.data.id;
                    sess.name = loginResult.data.name;
                    sess.organization = loginResult.data.organization;
                    sess.subs_id = loginResult.data.subs_id;
                    sess.subs_no = loginResult.data.subs_no;

                    res.json({result : true});
                } else {
                    console.log("잘못된 유저정보로 인한 로그인 실패");
                    res.json({result : false});
                }
            });

        } else if(url === "/users/join" && method === "POST"){ //회원가입 기능 처리
            console.log(req.body);

            const joinParam = {
                'id' : req.body.id,
                'password' : req.body.password,
                'name' : req.body.name,
                'organization' : req.body.organization,
                'subs_id': req.body.subs_id,
                'subs_no': req.body.subs_no
            };

            const joinPromise = authApiManager.join(joinParam);
            joinPromise.then(function(joinPromiseResult){
                res.json(joinPromiseResult);
            });


        }else if(url === "/users/joinSubsList" && method === "POST") {
            // 회원가입 시 변전소 목록 받아오기
            var sql = sql_store.select_subs_list_sql;
            var promise_select = sql_executer.query(database_config.daejeon_das_config, sql, null);
            promise_select.then(function (result) {
                res.send(result);
            });
        }else if(url === "/users/logoff" && method === "GET"){
            req.session.destroy();
            //res.render('user/login');
            res.redirect('/');
            //res.render('user/login');
        } else {
            var sess = req.session;
            var user_id = sess.user_id;
            console.log(user_id);
            if (user_id === null || user_id === undefined) {
                res.render('user/login');
            } else {
                next();
            }
        }
    }



};





module.exports = authApiManager;