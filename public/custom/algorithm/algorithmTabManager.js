/*
Need Jquery
 */
var algorithmTabmanager = {
    algoAndObjectMappingMap : {},
    //algorithmTabmanager.showAlgoTable();
    showAlgoTable : function(){
        var kind = $("#selected_object_kind").text();
        //kind == "" == null 전체 배경?
        //kind == empty 알고리즘 없음
        //kind == 그 외 것들은 있으면 있게하고 없으면 없는걸로

        var showIdList = [];
        var hideIdList = [];
        if (kind == "" || kind == "null") {
            kind = "null";
        } else if(kind == "DL") { //DL일때도 CA 인거처럼 알고리즘 보여줌
            kind = "CA";
        }
        if (algorithmTabmanager.algoAndObjectMappingMap.hasOwnProperty(kind)) {
            for (var key in algorithmTabmanager.algoAndObjectMappingMap) {

                const algoList = algorithmTabmanager.algoAndObjectMappingMap[key];
                if (key == kind) {
                    for (var i in algoList) {
                        showIdList.push(algoList[i].algo_tr_id);
                    }
                } else {
                    for (var i in algoList) {
                        hideIdList.push(algoList[i].algo_tr_id);
                    }
                }
            }
        } else {
            //key가 없는경우 empty만 살리고 나머지 다 hide
            for (var key in algorithmTabmanager.algoAndObjectMappingMap) {
                const algoList = algorithmTabmanager.algoAndObjectMappingMap[key];
                if (key == "empty") {
                    for (var i in algoList) {
                        showIdList.push(algoList[i].algo_tr_id);
                    }
                } else {
                    for (var i in algoList) {
                        hideIdList.push(algoList[i].algo_tr_id);
                    }
                }
            }
        }

        for (var i in showIdList) {
            const id = showIdList[i];
            $("#" + id).show();
        }
        for (var i in hideIdList) {
            const id = hideIdList[i];
            $("#" + id).hide();
        }
    },

    //초기 알고리즘 테이블 데이터 가져오고 테이블 만드는 모든 작업
    mainProcess : function(){
        const getAlgoListDataPromise = algorithmTabmanager.getAlgoList();
        getAlgoListDataPromise.then(function(r1){
            const algoMap = algorithmTabmanager.parseAlgoList(r1);
            $("#algorithmListTbody").empty();
            for (var key in algoMap) {
                const algoElement = algorithmTabmanager.makeAlgoElement(algoMap[key]);
                $("#algorithmListTbody").append(algoElement);
            }
            $("#algorithmListTbody").append(algorithmTabmanager.makeEmptyTr());

        });
    },

    //알고리즘 테이블에 넣을 알고리즘 정보 가져오는 함수
    getAlgoList : function(){
        return new Promise(function(resolve, reject){
            $.ajax({
                url: "/algorithm/list",
                type: "POST",
                dataType: 'json',
                success: function (data) {
                    resolve(data);
                }
            })
        });

    },
    //버전별로 나오는 알고리즘 데이터를 알고리즘 카테고리별로 묶어준다.
    parseAlgoList : function(list){
        var parseMap = {};
        for (var i in list) {
            if (parseMap.hasOwnProperty(list[i].algorithm_info_idx)) {
                parseMap[list[i].algorithm_info_idx].push(list[i]);
            } else {
                parseMap[list[i].algorithm_info_idx] = [];
                parseMap[list[i].algorithm_info_idx].push(list[i]);
            }
        }
        return parseMap;
    },
    //Object별로 알고리즘을 다르게 보여주기 위해서 테이블의 TR들을 관리할 수 있게 ID를 저장해둔다.
    registAlgorithm : function(object_code, object_id, algo_tr_id){ //algo_element_ + algorithm_info.algorithm_info_idx
        const map = algorithmTabmanager.algoAndObjectMappingMap;
        if (!map.hasOwnProperty(object_code)) {
            map[object_code] = [];
            map[object_code].push({'algo_tr_id' : algo_tr_id, 'object_id' : object_id});
        } else {
            map[object_code].push({'algo_tr_id' : algo_tr_id, 'object_id' : object_id});
        }
    },
    //각 알고리즘별 Element를 만든다.
    makeAlgoElement : function(dataList){
        const algo_idx = dataList[0].algorithm_info_idx;
        const algo_name = dataList[0].algorithm_name;
        const object_id = dataList[0].object_id;
        const object_code = dataList[0].swkind_code;
        const algo_tr_id = "algo_element_" + dataList[0].algorithm_info_idx;
        algorithmTabmanager.registAlgorithm(object_code, object_id, algo_tr_id);
        var tr = document.createElement("tr");
        $(tr).attr("id", algo_tr_id);
        $(tr).css("display", "none");
        var a_td = $('<td style="text-align: center"><a href="#" onclick="showAlgorithmInfo(' + algo_idx + ',\'' + algo_name + '\')">' + algo_name + '</a></td>');
        var select_td = document.createElement("td");
        var select = document.createElement("select");

        select_td.style.textAlign = "center";
        select_td.style.verticalAlign = "middle";

        $(select).attr("name", "algo_version_" + algo_idx);
        for (var i=0; i<dataList.length; i++) {
            var opt;
            if (i == dataList.length - 1) {
                opt = $('<option selected=selected value="'  + dataList[i].id   + '">' +   dataList[i].version  +  '</option>');
            } else {
                opt = $('<option value="'  + dataList[i].id   + '">' +   dataList[i].version  +  '</option>');
            }
            $(select).append(opt);
        }
        $(select_td).append(select);
        var reqBtnTd = $('<td style="text-align: center; vertical-align: middle;" ><input type="button" onclick="algorithmMainManager.algorithmBtnProcess(' + algo_idx + ')" class="btn btn-default" value="요청"></td>');
        // reqBtnTd.style.verticalAlign = "middle";
        $(tr).append(a_td).append(select_td).append(reqBtnTd);
        return tr;
    },
    makeEmptyTr : function(){
        algorithmTabmanager.registAlgorithm("empty", "empty", "algo_element_empty");
        var emptyTr = $('<tr id="algo_element_empty"><td style="text-align: center; vertical-align: middle;" >현재 알고리즘 없음</td>' +
            '<td style="text-align: center; vertical-align: middle;" ><select><option value="null"> - </option></select></td>' +
            '<td style="text-align: center; vertical-align: middle;" ><input type="button"  class="btn btn-default" value="요청" disabled></td></tr>');
        return emptyTr;
    }

};

$(function(){
    algorithmTabmanager.mainProcess();
});