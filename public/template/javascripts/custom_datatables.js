/**
 * need jquery
 */

/**
 *  @ Title Element 생성 객체
 *  @ version 1.0.0
 *  @ Author 노상훈
 *  @ New Date  18.05.15
 *  @ Update Date 18.05.15
 *  @ Description - DOM 객체를 만드는 코드를 함수화
 *  makeSelectBox = ID를 받아서 ID를 가지는 Select 태그 생성
 *  makeOptionForSelectBox = value와 text를 받아서 해당 값을 가지는 option 태그 생성 (select 태그에 append시키기 위함)
 */
var custom_datatables = {
    makeSelectBox : function(id){
        var selectBox = document.createElement("select");
        $(selectBox).attr("id", id);
        return selectBox;
    },
    makeOptionForSelectBox : function(val, text){
        var option = document.createElement("option");
        $(option).val(val).text(text);
        return option;
    },
    makeSubsTable : function(){

        $('#listTableSub').DataTable( {
            "processing": true,
            "serverSide": true, //페이징, 정렬, 검색을 서버에서 진행할 수 있도록 설정한다.
            "dom": '<"toolbar_subs">frtip', // 커스텀 Element를 추가시킬 수 있다. 아래의 div.toolbar에 직접 만든 Element를 추가한다.
            "ajax": {
                "url": "/system/subs/data",
                "type": "POST",
                "data" : function(data){ //datatables에서 전달하는 데이터 외 개발자가 추가적으로 전송하려는 데이터가 있다면 이곳에 추가
                    data.search_column = $("#subs_cols").val();
                }
            },
            "columns": [ //테이블에서 보여주려고 하는 컬럼을 지정한다. response 받은 data 객체에서 해당 컬럼을 확인하여 데이터를 표현한다.
                { data: "subs_id" },
                { data: "subs_no" },
                { data: "subs_name" }
            ],
        } );
        //검색에서 컬럼을 지정하기 위한 셀렉트박스 추가
        var selectForSearchColumn = custom_datatables.makeSelectBox("subs_cols");
        $(selectForSearchColumn).on('change', function(){
            $('#listTableSub').DataTable().ajax.reload();
        });
        $(selectForSearchColumn).append(custom_datatables.makeOptionForSelectBox("subs_id", "subs_id"))
            .append(custom_datatables.makeOptionForSelectBox("subs_no", "subs_no"))
            .append(custom_datatables.makeOptionForSelectBox("subs_name", "subs_name"));

        $("div.toolbar_subs").html("");
        $("div.toolbar_subs").append(selectForSearchColumn);
    },
    makeMtrTable : function(){

        $('#listTableMtr').DataTable( {
            "processing": true,
            "serverSide": true, //페이징, 정렬, 검색을 서버에서 진행할 수 있도록 설정한다.
            "dom": '<"toolbar_mtr">frtip', // 커스텀 Element를 추가시킬 수 있다. 아래의 div.toolbar에 직접 만든 Element를 추가한다.
            "ajax": {
                "url": "/system/mtr/data",
                "type": "POST",
                "data" : function(data){ //datatables에서 전달하는 데이터 외 개발자가 추가적으로 전송하려는 데이터가 있다면 이곳에 추가
                    data.search_column = $("#mtr_cols").val();
                }
            },
            "columns": [ //테이블에서 보여주려고 하는 컬럼을 지정한다. response 받은 data 객체에서 해당 컬럼을 확인하여 데이터를 표현한다.
                { data: "mtr_id" },
                { data: "bank_no" },
                { data: "subs_name" }
            ],
        } );
        //검색에서 컬럼을 지정하기 위한 셀렉트박스 추가
        var selectForSearchColumn = custom_datatables.makeSelectBox("mtr_cols");
        $(selectForSearchColumn).on('change', function(){
            $('#listTableMtr').DataTable().ajax.reload();
        });
        $(selectForSearchColumn).append(custom_datatables.makeOptionForSelectBox("mtr_id", "mtr_id"))
            .append(custom_datatables.makeOptionForSelectBox("bank_no", "bank_no"))
            .append(custom_datatables.makeOptionForSelectBox("subs_name", "subs_name"));

        $("div.toolbar_mtr").html("");
        $("div.toolbar_mtr").append(selectForSearchColumn);
    },

    makeDlTable : function(){

        $('#listTableDl').DataTable( {
            "processing": true,
            "serverSide": true, //페이징, 정렬, 검색을 서버에서 진행할 수 있도록 설정한다.
            "dom": '<"toolbar_dl">frtip', // 커스텀 Element를 추가시킬 수 있다. 아래의 div.toolbar에 직접 만든 Element를 추가한다.
            "ajax": {
                "url": "/system/dl/data",
                "type": "POST",
                "data" : function(data){ //datatables에서 전달하는 데이터 외 개발자가 추가적으로 전송하려는 데이터가 있다면 이곳에 추가
                    data.search_column = $("#dl_cols").val();
                }
            },
            "columns": [ //테이블에서 보여주려고 하는 컬럼을 지정한다. response 받은 data 객체에서 해당 컬럼을 확인하여 데이터를 표현한다.
                { data: "dl_id" },
                { data: "dl_name" },
                { data: "mtr_id" }
            ],
        } );
        //검색에서 컬럼을 지정하기 위한 셀렉트박스 추가
        var selectForSearchColumn = custom_datatables.makeSelectBox("dl_cols");
        $(selectForSearchColumn).on('change', function(){
            $('#listTableDl').DataTable().ajax.reload();
        });
        $(selectForSearchColumn).append(custom_datatables.makeOptionForSelectBox("dl_id", "dl_id"))
            .append(custom_datatables.makeOptionForSelectBox("dl_name", "dl_name"))
            .append(custom_datatables.makeOptionForSelectBox("mtr_id", "mtr_id"));

        $("div.toolbar_dl").html("");
        $("div.toolbar_dl").append(selectForSearchColumn);
    },
    makeSwTable : function(){

        $('#listTableSw').DataTable( {
            "processing": true,
            "serverSide": true, //페이징, 정렬, 검색을 서버에서 진행할 수 있도록 설정한다.
            "dom": '<"toolbar_sw">frtip', // 커스텀 Element를 추가시킬 수 있다. 아래의 div.toolbar에 직접 만든 Element를 추가한다.
            "ajax": {
                "url": "/system/sw/data",
                "type": "POST",
                "data" : function(data){ //datatables에서 전달하는 데이터 외 개발자가 추가적으로 전송하려는 데이터가 있다면 이곳에 추가
                    data.search_column = $("#sw_cols").val();
                }
            },
            "columns": [ //테이블에서 보여주려고 하는 컬럼을 지정한다. response 받은 data 객체에서 해당 컬럼을 확인하여 데이터를 표현한다.
                { data: "sw_id" },
                { data: "sw_loc" },
                { data: "dl_name" }
            ],
        } );
        //검색에서 컬럼을 지정하기 위한 셀렉트박스 추가
        var selectForSearchColumn = custom_datatables.makeSelectBox("sw_cols");
        $(selectForSearchColumn).on('change', function(){
            $('#listTableSw').DataTable().ajax.reload();
        });
        $(selectForSearchColumn).append(custom_datatables.makeOptionForSelectBox("sw_id", "sw_id"))
            .append(custom_datatables.makeOptionForSelectBox("sw_loc", "sw_loc"))
            .append(custom_datatables.makeOptionForSelectBox("dl_name", "dl_name"));

        $("div.toolbar_sw").html("");
        $("div.toolbar_sw").append(selectForSearchColumn);
    }


}
/*

$(function(){
    //기본 테이블
    custom_datatables.makeSubsTable();
    custom_datatables.makeMtrTable();
    custom_datatables.makeDlTable();
    custom_datatables.makeSwTable();


    //아래부터 탭 버튼 클릭에 따른 테이블 생성
    $('#listTabSub').off("click").on("click", function () {

        $('#subsDiv').show();

        $('#mtrDiv').hide();
        $('#dlDiv').hide();
        $('#swDiv').hide();
    });

    $('#listTabMtr').off("click").on("click", function () {

        $('#mtrDiv').show();


        $('#subsDiv').hide();
        $('#dlDiv').hide();
        $('#swDiv').hide();
    });

    $('#listTabDl').off("click").on("click", function () {

        $('#dlDiv').show();


        $('#subsDiv').hide();
        $('#mtrDiv').hide();
        $('#swDiv').hide();
    });

    $('#listTabSw').off("click").on("click", function () {

        $('#swDiv').show();


        $('#subsDiv').hide();
        $('#mtrDiv').hide();
        $('#dlDiv').hide();
    });

})
*/
