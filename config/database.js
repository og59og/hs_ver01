var pg = require('pg');
// var ip = 'localhost';
var ip = '192.168.0.14';

var config = {
    local_ip : 'localhost',
    sh_ip : ip,
    config_sh: {
        host: ip,
        //host: 'localhost',
        user: 'postgres',
        password: '1234',
        database: 'simulation',
        port: '5432',
        max : 3
    },
    das_config: {
        host: ip,
        //host: 'localhost',
        user: 'postgres',
        password: '1234',
        database: 'das',
        port: '5432',
        max : 3
    },
    daejeon_das_config: {
        host: ip,
        //host: 'localhost',
        user: 'postgres',
        password: '1234',
        database: 'das_yuseong',
        port: '5432',
        max : 3
    },
    das_config_dj: {
        host: ip,
        //host: 'localhost',
        user: 'postgres',
        password: '1234',
        database: 'das_yuseong',
        port: '5432',
        max : 3
    },
    login_sh: {
        host: ip,
        //host: 'localhost',
        user: 'postgres',
        password: '1234',
        database: 'auth_server',
        port: '5432',
        max : 3
    },
    setHost : function(ip){
        config.config_sh.host = ip;
        config.das_config.host = ip;
        config.daejeon_das_config.host = ip;
        config.das_config_dj.host = ip
        config.login_sh.host = ip;
    },
};
config.setHost(config.sh_ip); //local_ip


var connectionTable = {
    config_sh : null,
    das_config : null,
    daejeon_das_config : null,
    das_config_dj : null,
    login_sh : null
};
var connection_init = function(){
    connectionTable.config_sh = new pg.Pool(config.config_sh);
    connectionTable.das_config = new pg.Pool(config.das_config);
    connectionTable.daejeon_das_config = new pg.Pool(config.daejeon_das_config);
    connectionTable.das_config_dj = new pg.Pool(config.das_config_dj);
    connectionTable.login_sh = new pg.Pool(config.login_sh);
};
connection_init();

module.exports = connectionTable;
