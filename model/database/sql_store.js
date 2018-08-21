var store = {
    login_check_sql: "SELECT user_idx, id, pw, name, authority, date FROM public.user WHERE id=$1 AND pw=$2",
    object_sql: "SELECT * FROM  object_type ORDER BY object_type_idx ASC",
    algorithm_sql: "SELECT * FROM algorithm_info ORDER BY algorithm_info_idx ASC",
    label_sql: "SELECT vo.label_view_option_idx, vo.label_type_idx, ot.type, vo.check_activation " +
    "FROM public.legacy_label_view_option vo, public.legacy_label_option_type ot " +
    "WHERE vo.label_type_idx=ot.label_option_type_idx " +
    "ORDER BY vo.label_type_idx ASC ",
    user_info_sql: "SELECT id,name FROM public.user WHERE user_idx=$1",
    object_check_sql: "UPDATE public.object_view_option SET check_activation=$1 WHERE user_idx=$2 AND object_type_idx=$3 RETURNING object_view_option_idx",
    label_check_sql: "UPDATE public.legacy_label_view_option SET check_activation=$1 WHERE user_idx=$2 AND label_view_option_idx=$3 RETURNING label_view_option_idx",
    algo_check_sql: "UPDATE public.algorithm_option SET check_activation=$1 WHERE user_idx=$2 AND algorithm_info_idx=$3 RETURNING algorithm_option_idx",
    select_subs_diagram_sql: "SELECT sub.subs_id, subs_no, subs_name, mtr.mtr_id, mtr.bank_no, dl.dl_id, dl.dl_no, dl.dl_name, dl.cb_id " +
    "FROM subs as sub, mtr_bank as mtr, dl as dl " +
    "WHERE (sub.subs_no = $1 or sub.subs_id = $2) AND sub.subs_id = mtr.subs_id AND dl.mtr_id = mtr.mtr_id order by dl.dl_id",
    select_dl_diagram_sql:"SELECT DISTINCT s.sec_id, s.sw_id_f, s.sw_id_b, s.sec_load, s.sec_length, f.sw_loc_no AS sw_loc_no_f, b.sw_loc_no as sw_loc_no_b, " +
    "(SELECT swkind_code FROM swkind_code WHERE swkind_id =f.sw_kind_id) AS sw_kind_code_f, " +
    "(SELECT swkind_code FROM swkind_code WHERE swkind_id =b.sw_kind_id) AS sw_kind_code_b " +
    "FROM sec s LEFT JOIN sw_frtu f ON s.sw_id_f = f.sw_id LEFT JOIN sw_frtu AS b ON s.sw_id_b = b.sw_id " +
    "WHERE f.dl_id = $1 OR b.dl_id = $2",
    select_subs_list_sql: "SELECT * FROM public.subs ",
    select_mtr_list_sql: "SELECT * FROM public.mtr_bank",
    select_dl_list_sql: "SELECT * FROM public.dl",
    select_sw_list_sql: "SELECT * FROM public.sw_frtu",
    //park
    select_sw_list_in_dl_sql: "select a.sw_id, a.sw_loc, a.sw_loc_no, a.dl_id, a.sw_kind_id, a.sw_i_stat, a.cb_id, b.swkind_code from sw_frtu a, swkind_code b "
    + "where a.sw_kind_id = b.swkind_id and a.cb_id::varchar = (select cb_id from dl where dl_id = $1) ",

    select_line_list_in_dl_sql : "SELECT DISTINCT s.sec_id, s.sw_id_f, s.sw_id_b, s.sec_load, s.sec_length, f.dl_id, f.cb_id " +
    "FROM sec s, sw_frtu f " +
    "WHERE (f.sw_id = s.sw_id_f or f.sw_id = s.sw_id_b) and f.cb_id::varchar = (select cb_id from dl where dl_id = $1) ",

    select_kind_code : "select * from swkind_code",

    select_sw_list_in_mtr_sql : "select a.sw_id, a.sw_loc, a.sw_loc_no, a.dl_id, a.sw_kind_id, a.sw_i_stat, a.cb_id, b.swkind_code "
    + "from sw_frtu a, swkind_code b "
    + " where a.sw_kind_id = b.swkind_id and "
    + " a.cb_id::varchar in (select cb_id from dl where mtr_id = $1) "
    + " order by  a.cb_id",

    select_line_list_in_mtr_sql : "SELECT DISTINCT s.sec_id, s.sw_id_f, s.sw_id_b, s.sec_load, s.sec_length, f.dl_id, f.cb_id "
    + " FROM sec s, sw_frtu f "
    + " WHERE (f.sw_id = s.sw_id_f or f.sw_id = s.sw_id_b) and f.cb_id::varchar in (select cb_id from dl where mtr_id = $1) "
    + " order by  f.cb_id",
    //park end

    check_sw_id_sql: "SELECT sw_id FROM sw_frtu WHERE sw_id = $1",
    select_subst_equipment: "SELECT SUBS_ID, MTR_ID, MTR_COUNT_TABLE.CNT_MTR_VALUE, DL_ID, DL_NO, DL_NAME  " +
    "FROM DL" +
    ", (SELECT MTR_ID AS CNT_MTR_ID, COUNT(MTR_ID) AS CNT_MTR_VALUE FROM DL GROUP BY CNT_MTR_ID) AS MTR_COUNT_TABLE " +
    ", (SELECT SUBS_ID FROM SUBS WHERE SUBS_NO = $1) AS SUB_ID" +
    "WHERE MTR_ID IN (SELECT MTR_ID FROM MTR_BANK WHERE SUBS_ID = SUB_ID.SUBS_ID)  " +
    "AND MTR_ID = MTR_COUNT_TABLE.CNT_MTR_ID  " +
    "ORDER BY MTR_ID, DL_ID",
    select_subs_id : "SELECT subs_id, subs_name FROM public.subs ORDER BY subs_id ASC",
    select_pad_group_sql:"SELECT sw_id, sw_loc, sw_loc_no, dl_id FROM sw_frtu WHERE sw_loc_no = $1",
    log : {
        addLog : "INSERT INTO public.log (function, message, user_id, log_type) VALUES($1, $2, $3, $4) RETURNING idx",
        //selectLogList : "SELECT idx, user_id, function, message, date, log_type FROM public.log WHERE user_id = $1 AND log_type=1",
        selectLogList : "SELECT l.idx, l.user_id, l.function, l.message, l.date, lt.log_name as type " +
        "FROM public.log l, public.log_type lt " +
        "WHERE l.user_id = $1 AND l.log_type=1 AND l.log_type=lt.log_id ORDER BY date desc LIMIT 5",
    },
    slider : {
        getSecLoad : "SELECT sl.sec_id, sl.sw_id_b, to_char(sl.time, 'YYYY-MM-DD HH24:MI') as time, sl.sec_load " +
        "FROM temp_sec_history_10minute sl, sec s, sw_frtu sw, dl d " +
        "WHERE sl.sec_id=s.sec_id AND s.sw_id_f=sw.sw_id AND sw.dl_id=d.dl_id AND d.dl_id=$3 AND time <= $1 " +
        "GROUP BY sl.sec_id, sl.sw_id_b, sl.time, sl.sec_load " +
        "ORDER BY time desc LIMIT ($2 * (SELECT COUNT(DISTINCT sl.sec_id) " +
            "FROM temp_sec_history_10minute sl, sec s, sw_frtu sw, dl d " +
            "WHERE sl.sec_id=s.sec_id AND s.sw_id_f=sw.sw_id AND sw.dl_id=d.dl_id AND d.dl_id=$3))",

    },
    algorithm : {
        selectAll : "SELECT ai.algorithm_info_idx, ai.algorithm_name, ai.object_id, avi.id, avi.version, est.swkind_code " +
        "FROM public.algorithm_info ai, public.algorithm_version_info avi, public.sf_editor_system_template est " +
        "WHERE avi.algorithm_info_idx=ai.algorithm_info_idx AND est.id=ai.object_id",
        select : "SELECT id, algorithm_info_idx, version, machine_learning_kind, data_description, accuracy, description " +
        "FROM algorithm_version_info " +
        "WHERE algorithm_info_idx=$1",
        selectAlgoVersionInfo : "SELECT avi.id, ai.algorithm_name, avi.version, avi.machine_learning_kind, avi.data_description, avi.accuracy " +
        "FROM algorithm_version_info avi, algorithm_info ai " +
        "WHERE id=$1 AND avi.algorithm_info_idx=ai.algorithm_info_idx",
    },
    user : {
        getSubs_no : "SELECT subs_no FROM subs WHERE subs_id=$1"
    },
    select_all_list_sql:"SELECT s.subs_id, s.subs_no, s.subs_name, m.mtr_id, m.bank_no, d.dl_id, d.dl_name, d.dl_no, d.cb_id " +
    "FROM subs AS s, mtr_bank AS m, dl AS d " +
    "WHERE d.mtr_id = m.mtr_id AND m.subs_id = s.subs_id ORDER BY s.subs_id, m.bank_no, d.dl_id ASC",
    select_subsid_using_substcd:"SELECT SUBS_ID FROM SUBS WHERE SUBS_NO = $1",

    select_algorithm_list_sql:"SELECT * FROM algorithm_option LEFT JOIN algorithm_info ON algorithm_option.algorithm_info_idx = algorithm_info.algorithm_info_idx",
    select_editorObj_list_sql:"select s.id AS symbol_id, s.name AS symbol_name, s.file_path, t.category_id, c.name AS catogory_name " +
    "FROM sf_editor_symbol s, sf_editor_system_template t, sf_editor_category c " +
    "WHERE t.activate = 1 AND s.id = t.symbol_id AND t.category_id = c.id ORDER BY t.id",
    check_dl_sw_id_sql: "SELECT sw_id FROM sw_frtu WHERE dl_id = $1 AND sw_id = $2",

    select_editor_category :"SELECT id,name,reg_date FROM public.sf_editor_category ORDER BY id ASC",
    select_editor_image :"SELECT id,name,file_path,reg_date FROM public.sf_editor_symbol ORDER BY id ASC",

    insert_editor_category :"INSERT INTO sf_editor_category  VALUES ($1, $2, DEFAULT, $3) ",
    insert_editor_image_category :"INSERT INTO sf_editor_symbol  VALUES ($1, $2, $3, $4, $5) ",

    delete_editor_category : "DELETE FROM sf_editor_category WHERE id=$1",
    delete_editor_image : "DELETE FROM sf_editor_symbol WHERE id=$1",

    update_editor_category :"UPDATE public.sf_editor_category SET name=$2 WHERE id=$1",
    update_editor_image :"UPDATE public.sf_editor_symbol SET name=$2 WHERE id=$1",

    user_info_sql:'SELECT id,name,organization FROM public."user" WHERE id=$1',

};

module.exports = store;