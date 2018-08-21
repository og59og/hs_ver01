var util = require('util');

/* --- util.format ---
%s - String.
%d - Number (both integer and float).
%j - JSON.
% - single percent sign ('%'). This does not consume an argument.
sample   var data = util.format('%d, %s, %j', 10, 'abc', { name: 'node.js'});
 */

/**
 *  @ Title 설비 찾기 util 객체
 *  @ version 1.0.0
 *  @ Author 노상훈
 *  @ New Date   18.05.15
 *  @ Update Date 18.05.15
 *  @ Description
 *  generateSqlForSubs = datatables에서 받은 데이터를 통해 subs 데이터를 가져오기 위한 적절한 sql을 만든다.
 *  parseBody = datatables 에서 받은 데이터를 객체화 한다.
 */
var datatablesUtils = {

    generateSqlForSubs : function(data){
        var select_sql;
        var cnt_sql;

        if (data.serarch_column == null){
            select_sql = util.format("SELECT subs_id, subs_no, subs_name FROM public.subs ORDER BY %s %s LIMIT %s OFFSET %s "
                , data.orderByColName, data.orderByKind, data.dataLength, data.dataStartIndex);
            cnt_sql = "SELECT COUNT(subs_id) FROM public.subs"
        } else {
            console.log(data);
            select_sql = util.format("SELECT subs_id, subs_no, subs_name FROM public.subs WHERE %s::text LIKE %s ORDER BY %s %s LIMIT %s OFFSET %s "
                , data.serarch_column, ("'%" + data.searchText + "%'"), data.orderByColName, data.orderByKind, data.dataLength, data.dataStartIndex);
            cnt_sql = util.format("SELECT COUNT(subs_id) FROM public.subs WHERE %s::text LIKE %s ", data.serarch_column, ("'%" + data.searchText + "%'"));

        }

        return {select_sql : select_sql, cnt_sql : cnt_sql};
    },
    generateSqlForMtrBank : function(data){
        var select_sql;
        var cnt_sql;

        var order_table_name;
        var serarch_column;

        if (data.orderByColName == "subs_name") {
            order_table_name = "s";
        } else {
            order_table_name = "m"
        }

        if (data.serarch_column == "subs_name") {
            serarch_column = "s";
        } else {
            serarch_column = "m"
        }

        if (data.serarch_column == null){
            select_sql = util.format("SELECT m.mtr_id, m.bank_no, s.subs_name FROM public.mtr_bank m, public.subs s WHERE m.subs_id = s.subs_id ORDER BY %s.%s %s LIMIT %s OFFSET %s "
                , order_table_name, data.orderByColName, data.orderByKind, data.dataLength, data.dataStartIndex);
            cnt_sql = "SELECT COUNT(m.mtr_id) FROM public.mtr_bank m, public.subs s WHERE m.subs_id = s.subs_id"
        } else {
            select_sql = util.format("SELECT m.mtr_id, m.bank_no, s.subs_name FROM public.mtr_bank m, public.subs s WHERE m.subs_id = s.subs_id AND %s.%s::text LIKE %s ORDER BY %s.%s %s LIMIT %s OFFSET %s "
                , serarch_column, data.serarch_column, ("'%" + data.searchText + "%'"), order_table_name, data.orderByColName, data.orderByKind, data.dataLength, data.dataStartIndex);
            cnt_sql = util.format("SELECT COUNT(m.mtr_id) FROM public.mtr_bank m, public.subs s WHERE m.subs_id = s.subs_id AND %s.%s::text LIKE %s"
                , serarch_column, data.serarch_column, ("'%" + data.searchText + "%'"));

        }

        return {select_sql : select_sql, cnt_sql : cnt_sql};
    },

    generateSqlForDl : function(data){
        var select_sql;
        var cnt_sql;

        if (data.serarch_column == null){
            select_sql = util.format("SELECT dl_id, dl_name, mtr_id FROM public.dl ORDER BY %s %s LIMIT %s OFFSET %s "
                , data.orderByColName, data.orderByKind, data.dataLength, data.dataStartIndex);
            cnt_sql = "SELECT COUNT(dl_id) FROM public.dl"
        } else {
            select_sql = util.format("SELECT dl_id, dl_name, mtr_id FROM public.dl WHERE %s::text LIKE %s ORDER BY %s %s LIMIT %s OFFSET %s "
                , data.serarch_column, ("'%" + data.searchText + "%'"), data.orderByColName, data.orderByKind, data.dataLength, data.dataStartIndex);
            cnt_sql = util.format("SELECT COUNT(dl_id) FROM public.dl WHERE %s::text LIKE %s", data.serarch_column, ("'%" + data.searchText + "%'"));

        }
        return {select_sql : select_sql, cnt_sql : cnt_sql};
    },


    generateSqlForSw : function(data){
        var select_sql;
        var cnt_sql;

        var order_table_name;
        var serarch_column;

        if (data.orderByColName == "dl_name") {
            order_table_name = "d";
        } else {
            order_table_name = "s"
        }

        if (data.serarch_column == "dl_name") {
            serarch_column = "d";
        } else {
            serarch_column = "s"
        }

        if (data.serarch_column == null){
            select_sql = util.format("SELECT s.sw_id, s.sw_loc, d.dl_name FROM public.sw_frtu s, public.dl d WHERE s.dl_id = d.dl_id ORDER BY %s.%s %s LIMIT %s OFFSET %s "
                , order_table_name, data.orderByColName, data.orderByKind, data.dataLength, data.dataStartIndex);
            cnt_sql = "SELECT COUNT(s.sw_id) FROM public.sw_frtu s, public.dl d WHERE s.dl_id = d.dl_id"
        } else {
            select_sql = util.format("SELECT s.sw_id, s.sw_loc, d.dl_name FROM public.sw_frtu s, public.dl d WHERE s.dl_id = d.dl_id AND %s.%s::text LIKE %s ORDER BY %s.%s %s LIMIT %s OFFSET %s "
                , serarch_column, data.serarch_column, ("'%" + data.searchText + "%'"), order_table_name, data.orderByColName, data.orderByKind, data.dataLength, data.dataStartIndex);
            cnt_sql = util.format("SELECT COUNT(s.sw_id) FROM public.sw_frtu s, public.dl d WHERE s.dl_id = d.dl_id AND %s.%s::text LIKE %s"
                , serarch_column, data.serarch_column, ("'%" + data.searchText + "%'"));

        }

        return {select_sql : select_sql, cnt_sql : cnt_sql};
    },


    parseBody : function(reqBody){

        return {
            dataStartIndex : reqBody['start'],
            dataLength : reqBody['length'],
            draw : reqBody['draw'],
            searchText : reqBody['search[value]'],
            orderByColName : reqBody["columns[" + reqBody["order[0][column]"] + "][data]"],
            orderByKind : reqBody["order[0][dir]"],
            serarch_column : reqBody['search_column'],
        }
    }
}


module.exports = datatablesUtils;