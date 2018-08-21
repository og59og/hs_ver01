algorithmMainManager = {

    //##TODO : 알고리즘 id를 하드코딩 해놓는 수준인데 어떻게 바꿀 수 있을까? 맘에 너무 안들지만 이 외 방법을 못찾겠다.
    algorithmBtnProcess : function(id){
        if (id ==5) {
            disposeContextPopup();

            // 요청한 알고리즘을 배열로 가지고 있으려고 하는데 이 방법말고 좋은게 있다면 알려주세여.....ㅠ(노주희, 180711)
            if ($("#modeChange").is(":checked")) {   // true: 시뮬레이션 모드, false: 단선도 모드
                simulator.callAlgorithmList.push("pqms");
            }else{
                mxGraphDiagram.callAlgorithmList.push("pqms");
            }

            var treeViewObject = $('#showListDiv').data('treeview');
            var selectedNode = treeViewObject.getSelected();

            if(selectedNode.length > 0){
                // console.log('selectedNode : ', selectedNode);
                $(".modal-body #pqms_equipment_id").val(selectedNode[0].id);
                $(".modal-body #pqms_equipment_name").val(selectedNode[0].text);

                $("#subspqms").modal('show');
                $("#subspqms").draggable({
                    handle: ".modal-header"
                });
            }
            else{
                alert('좌측 설비 리스트에서 DL을 선택해주세요.');
            }
        } else if (id == 12) {
            disposeContextPopup();

            // 요청한 알고리즘을 배열로 가지고 있으려고 하는데 이 방법말고 좋은게 있다면 알려주세여.....ㅠ(노주희, 180711)
            if ($("#modeChange").is(":checked")) {   // true: 시뮬레이션 모드, false: 단선도 모드
                simulator.callAlgorithmList.push("pv");
            }else{
                mxGraphDiagram.callAlgorithmList.push("pv");
            }

            const equipment_name = $("#substnm").val();
            const equipment_id = $("#selected_object_id").text();
            const equipment_capacity = $("#selected_object_capacity").text();

            $(".modal-body #pv_equipment_id").val(equipment_id);
            $(".modal-body #pv_equipment_name").val(equipment_name);
            if(!equipment_capacity){
                $(".modal-body #pv_capacity").val(898);
            }else{
                $(".modal-body #pv_capacity").val(equipment_capacity);
            }

            $("#pvsetting").modal('show');
            $("#pvsetting").draggable({
                handle: ".modal-header"
            });

        } else if (id == 19) {
            disposeContextPopup();

            // 요청한 알고리즘을 배열로 가지고 있으려고 하는데 이 방법말고 좋은게 있다면 알려주세여.....ㅠ(노주희, 180711)
            if ($("#modeChange").is(":checked")) {   // true: 시뮬레이션 모드, false: 단선도 모드
                simulator.callAlgorithmList.push("sectionLoad");
            }else{
                mxGraphDiagram.callAlgorithmList.push("sectionLoad");
            }

            const equipment_name = $("#substnm").val();
            const equipment_id = $("#selected_object_id").text();

            $(".modal-body #sectionLoadEquipmentId").val(equipment_id);
            $(".modal-body #sectionLoadEquipmentName").val(equipment_name);

            $("#sectionLoadSetting").modal("show");
            console.log("modal show");
            $("#sectionLoadSetting").draggable({
                handle: ".modal-header"
            });

        } else {
            return;
        }
    },
};

$(function(){

    /*PQMS Algorithm*/
    $("#subspqms").on('show.bs.modal', function (){
        // alert('PQMS Modal Create!');
        // console.log(d3.select("#subsPqmsDiv").text());
        // var chartWidth = 400, chartHeight = 400;
        //remove_span_group
        $('#subspqms').focus();

        if(event.toElement.getAttribute('id') == "remove_pqms_span" || event.toElement.getAttribute('id') == "calendar_pqms_span" ||
            event.toElement.getAttribute('id') == "remove_pqms_span_group" || event.toElement.getAttribute('id') == "calendar_pqms_span_group"
            || event.toElement.getAttribute('class') == "today"
            || event.toElement.getAttribute('class') == "minute active" || event.toElement.getAttribute('class') == "minute"){
            return;
        }
        $('#subs_pqms_dateTimePickerDiv').datetimepicker({
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayBtn: true,
            todayHighlight: true,
            minuteStep: 10,
        });

        $('#predPqmsDateInput').val("");
        $('.selectpicker').each(function(){
            if($(this).attr('id') == "pqms_algo_type"){
                $(this).val('default');
            }
        });
    });

    $("#subspqms").on('hide.bs.modal', function (){
        if(event.toElement.getAttribute('id') == "remove_pqms_span" || event.toElement.getAttribute('id') == "calendar_pqms_span" ||
            event.toElement.getAttribute('id') == "remove_pqms_span_group" || event.toElement.getAttribute('id') == "calendar_pqms_span_group"
            || event.toElement.getAttribute('class') == "today"
            || event.toElement.getAttribute('class') == "minute active" || event.toElement.getAttribute('class') == "minute"){
            return;
        }
        $(".modal-body #pqms_equipment_id").val("");
        $(".modal-body #pqms_equipment_name").val("");
    });

    $("#predictPQMSBtn").on('click', function(){

        //var pred_date = $("#predPqmsDateInput").val(), algo_type = '';
        var pred_date = $("#global_setting_time").text();
        var pqms_equipment_id;
        var algo_version_id = $("select[name=algo_version_5]").val();

        $('.selectpicker').each(function(){
            if($(this).attr('id') == "pqms_algo_type"){
                algo_type =  $(this).val();
            }
        });
        if(algo_type == "default"){
            alert('알고리즘 유형을 선택해주세요.');
            return;
        }

        pqms_equipment_id = $("#pqms_equipment_id").val();
        // dl_id = $("#dl_id").val();
        //알고리즘 버전별 정보 먼저 그리고 알고리즘 요청해서 결과 가져와서 그린다음 처리
        const algoVersionTablePromise = tableManager.createAlgoVersionInfoTable(algo_version_id, "pqmsAlgoInfoNameTd", "pqmsAlgoInfoVersionTd", "pqmsAlgoInfoMachine_learning_kindTd", "pqmsAlgoInfoAccuracyTd");
        algoVersionTablePromise.then(function(resolve){
//pqmsAlgoInfoNameTd pqmsAlgoInfoVersionTd pqmsAlgoInfoMachine_learning_kindTd pqmsAlgoInfoAccuracyTd
            sliderManager.getPqmsDataProcess(1, 1, pred_date, algo_type);
            $("#pqmsModalCloseButton").click();
        });

        // sliderManager.getPqmsDataProcess(subs_id, dl_id, pred_date, algo_type);

        $("#pqmsModalCloseButton").click();
    });

    /*PV Algorithm*/

    $("#pvsetting").on('show.bs.modal', function (){

        $('#pvsetting').focus();
        /*        if(event.toElement.getAttribute('id') == "remove_pv_span" || event.toElement.getAttribute('id') == "calendar_pv_span" ||
                    event.toElement.getAttribute('id') == "remove_pv_span_group" || event.toElement.getAttribute('id') == "calendar_pv_span_group"
                    || event.toElement.getAttribute('class') == "today"
                    || event.toElement.getAttribute('class') == "minute active" || event.toElement.getAttribute('class') == "minute"){
                    return;
                }*/
        $('#subs_pv_dateTimePickerDiv').datetimepicker({
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayBtn: true,
            todayHighlight: true,
            minuteStep: 10,
        });

        $('#pv_predDateInput').val("");
        $('.selectpicker').each(function(){
            if($(this).attr('id') == "pv_algo_type"){
                $(this).val('default');
            }
        });
    });


    $("#pvsetting").on('hide.bs.modal', function (){
        /*        if(event.toElement.getAttribute('id') == "remove_pv_span" || event.toElement.getAttribute('id') == "calendar_pv_span" ||
                    event.toElement.getAttribute('id') == "remove_pv_span_group" || event.toElement.getAttribute('id') == "calendar_pv_span_group"
                    || event.toElement.getAttribute('class') == "today"
                    || event.toElement.getAttribute('class') == "minute active" || event.toElement.getAttribute('class') == "minute"){
                    return;
                }*/
        $(".modal-body #pv_equipment_id").val("");
        $(".modal-body #pv_equipment_name").val("");
    });

    $("#predictPVBtn").on('click', function(){

        // var pred_date = $("#pv_predDateInput").val(), algo_type = '';
        var pred_date = $("#global_setting_time").text();
        var pv_equipment_id;
        var capacity = $("#pv_capacity").val();
        var algo_version_id = $("select[name=algo_version_12]").val();

        $('.selectpicker').each(function(){
            if($(this).attr('id') == "pv_algo_type"){
                algo_type =  $(this).val();
            }
        });

        if(algo_type == "default"){
            alert('알고리즘 유형을 선택해주세요.');
            return;
        }

        pv_equipment_id = $("#pv_equipment_id").val();

        //알고리즘 버전별 정보 먼저 그리고 알고리즘 요청해서 결과 가져와서 그린다음 처리
        const algoVersionTablePromise = tableManager.createAlgoVersionInfoTable(algo_version_id, "pvAlgoInfoNameTd", "pvAlgoInfoVersionTd", "pvAlgoInfoMachine_learning_kindTd", "pvAlgoInfoAccuracyTd");
        algoVersionTablePromise.then(function(resolve){
            // sliderManager.getPqmsDataProcess(subs_id, dl_id, pred_date, algo_type);
            sliderManager.getPvDataProcess(capacity, pred_date, algo_type, pv_equipment_id);
            $("#pvModalCloseButton").click();
        });



    });



    /* Section Load Algorithm */
    $("#sectionLoadSetting").on('show.bs.modal', function (){
        $('#sectionLoadSetting').focus();
        $('#subs_pv_dateTimePickerDiv').datetimepicker({
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayBtn: true,
            todayHighlight: true,
            minuteStep: 10
        });
        // $('#pv_predDateInput').val("");         없어도 되는건가?
        $('.selectpicker').each(function(){
            if($(this).attr('id') == "sectionLoadAlgoType"){
                $(this).val('default');
            }
        });
    });

    $("#sectionLoadSetting").on('hide.bs.modal', function (){
        $(".modal-body #sectionLoadEquipmentId").val("");
        $(".modal-body #sectionLoadEquipmentName").val("");
    });

    $("#predictSectionBtn").on('click', function(){
        // var pred_date = $("#pv_predDateInput").val(), algo_type = '';
        var pred_date = $("#global_setting_time").text();
        var dl_id = $("#selected_object_dl").text();
        // var capacity = $("#pv_capacity").val();
        var algo_version_id = $("select[name=algo_version_19]").val();

        $('.selectpicker').each(function(){
            if($(this).attr('id') == "sectionLoadAlgoType"){
                algo_type =  $(this).val();
            }
        });

        if(algo_type == "default"){
            alert('알고리즘 유형을 선택해주세요.');
            return;
        }
        //알고리즘 버전별 정보 먼저 그리고 알고리즘 요청해서 결과 가져와서 그린다음 처리
        const algoVersionTablePromise = tableManager.createAlgoVersionInfoTable(algo_version_id, "sectionLoadAlgoInfoNameTd", "sectionLoadAlgoInfoVersionTd", "sectionLoadAlgoInfoMachine_learning_kindTd", "sectionLoadAlgoInfoAccuracyTd");
        algoVersionTablePromise.then(function(resolve){
            // sliderManager.getPqmsDataProcess(subs_id, dl_id, pred_date, algo_type);
            sliderManager.getSectionLoadDataProcess(dl_id, pred_date, algo_type);
            $("#sectionLoadModalCloseBtn").click();
        });
    });

    /* Section Load Algorithm */

});

/* 각 알고리즘 모달 페이지 뜰떼 시작 위치 조정   */
$(function(){
    $("#section_load_popup_modal").on("shown.bs.modal", function(){
        var x = $("#diagramDiv").offset().left + $("#diagramDiv").width() - $("#section_load_popup_modal").width();
        var y = $("#diagramDiv").offset().top;
        $("#section_load_popup_modal").offset({'left' : x, 'top' : y});
    });
    $("#pv_popup_modal").on("shown.bs.modal", function(){
        var x = $("#diagramDiv").offset().left + $("#diagramDiv").width() - $("#pv_popup_modal").width();
        var y = $("#diagramDiv").offset().top;
        $("#pv_popup_modal").offset({'left' : x, 'top' : y});
        $("#pv_popup_modal").offset({'left' :($("#diagramDiv").offset().left + $("#diagramDiv").width() - $("#pv_popup_modal").width()), 'top' : $("#diagramDiv").offset().top});

    });
    $("#pqms_popup_modal").on("shown.bs.modal", function(){
        var x = $("#diagramDiv").offset().left + $("#diagramDiv").width() - $("#pqms_popup_modal").width();
        var y = $("#diagramDiv").offset().top;
        $("#pqms_popup_modal").offset({'left' : x, 'top' : y});
    });

    $("#loading_modal_test_btn").on("click", function(){

       /*var x =  $("#displayBackground").offset().left + $("#displayBackground").width() - $("#loading_modal").width();
        var y = $("#displayBackground").offset().top;
        $('#loading_modal').offset({'left' : x, 'top' : y});*/
         $('#loading_modal').modal('show');
        // setTimeout(function () {
        //     $('#loading_modal').modal('hide');
        // }, 60000);
    })

});