//
var sliderOnFlag = true;
var algorithmselected=[];
var objInfo;
var mainObj = {
    checkShowValueOptionAndSetSlider : function(){
        if (!sliderOnFlag)
            return;
        var checkOption = [];
        $("input[name=valueOptionCheckbox]:checked").each(function(){
            checkOption.push($(this).val());
        });
        const paramObj = sliderManager.makeDataLoadParam(checkOption);
        console.log(sliderManager.makeDataLoadParam(checkOption));

        //sliderManager.dataLoader([4], [{'option' : 4, 'data' : ['2018-02-01 15:00:00', 30, 7]}]);
        sliderManager.dataLoader(paramObj.option, paramObj.data);

    },
    makeShowValueOptionTableElement : function(dataObj, idx){

        var tr = document.createElement("tr");

        var td_number = document.createElement("td");
        $(td_number).addClass("value_menu_td_number").text(idx);

        var td_type =  document.createElement("td");
        $(td_type).text(dataObj.type);

        var td_activation = document.createElement("td");
        $(td_activation).addClass("value_menu_td_activation");
        var td_input_activation;

        if (dataObj.check_activation == 1) {
            td_input_activation = "<input type='checkbox' class='custom-control-input' name='valueOptionCheckbox' checked='checked' value='" +  dataObj.label_view_option_idx  + "'/>";
        } else {
            td_input_activation = "<input type='checkbox' class='custom-control-input' name='valueOptionCheckbox' value='" +  dataObj.label_view_option_idx  + "'/>";
        }
        $(td_activation).append(td_input_activation);


        $(tr).append(td_number).append(td_type).append(td_activation);
        return tr;
    },
    makeShowValueOptionTable : function(){

        return new Promise(function(reslove, reject){
            $("#valueTable").empty();

            $.ajax({
                url: "/ui/value",
                type: "POST",
                dataType: 'json',
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        //$('#valueTable').append("<input type=\"checkbox\"  name='valueMenu'  value=" + data[i].label_type_idx + ">" + data[i].type_column + "<br>");
                        $('#valueTable').append(mainObj.makeShowValueOptionTableElement(data[i], (i+1)));
                        reslove();

                    }
                }
            })
        });

    },
    makeShowObjectMenuTableElement : function (objName, objIndex) {
        var tr = document.createElement("tr");

        var td_number = document.createElement("td");
        $(td_number).addClass("value_menu_td_number").text(objIndex);

        var td_name =  document.createElement("td");
        $(td_name).text(objName);

        var td_activation = document.createElement("td");
        $(td_activation).addClass("value_menu_td_activation");

        var td_input_activation;
        td_input_activation = "<input type='checkbox' class='custom-control-input' name='valueCheckbox' value='" +  objIndex  + "'/>";

        $(td_activation).append(td_input_activation);

        $(tr).append(td_number).append(td_name).append(td_activation);

        return tr;

    },
};

$(function () {
    //단선도 표시 값 설정 창 초기 셋팅
    mainObj.makeShowValueOptionTable().then(function(resolve){});

    $("#legendSimulationLoad").hide();
    $("#legendSimulation").hide();
    $("#legendOneDiagram").hide();
    $("#legendGIS").show();
    $('#jh').hide();
    $('#hs').hide();
    $('#subsDiv').show();
    $('#mtrDiv').hide();
    $('#dlDiv').hide();
    $('#swDiv').hide();
    $("#simulatorDiv").hide();
    $("#diagramDiv").show();
    $('#subsinfo').hide();
    $('#objInfoDiv').hide();
    $('#algorithmListSelect').hide();
    $("#subsPicture").hide();
   // $("#mtrPicture").hide();

   /* $('#display')
        .css('border', '5px solid #b4b4c7');*/
    showDistributionList();
    $("#showSimulatorObj").hide();
    function showDistributionList() {
        $.post("/ui/showDistributionList", function (result) {
            var treeData = [{
                text: "서대전 본부",
                id: "seodaejeon",
                type: "ROOT",
                nodes: makeSubsTreeData(result)
            }];

            /*$("#showListDiv").treeview({
                color: "#777777",
                backColor: "#F9F9F9",
                selectedColor: "#777777",
                selectedBackColor: "#E7E7E7",
                onhoverColor: "#E7E7E7",
                expandIcon: "glyphicon glyphicon-chevron-right", //glyphicon glyphicon-plus
                collapseIcon: "glyphicon glyphicon-minus",
                emptyIcon: "glyphicon glyphicon-unchecked",
                showTags: true,
                data: treeData,
                onNodeSelected: function (event, node) {
                    console.log(node);
                    console.log(event);
                    if (node.type == "SUBSTATION") {
                        sliderManager.sliderToggle(false);
                        console.log('SUBS Select', node.id);
                        mxGraphDiagram.subsId = node.id;
                        console.log('SUBS Select', mxGraphDiagram.subsId);
                        objInfo = {
                            type: "subs",
                            value: [node.id, node.type, node.no, node.name]
                        };
                        showInfoRightMenu(objInfo);
                        showDiagram("subs");
                        moveSelectedSubsCoordinate(node.no);
                    } else if (node.type == "MTR") {
                        sliderManager.sliderToggle(false);
                        console.log('MTR Select', node.id);
                        mxGraphDiagram.subsId = node.subsId;
                        mxGraphDiagram.mtrId = node.id;
                        console.log('MTR Select', mxGraphDiagram.subsId);
                        objInfo = {
                            type: "mtr",
                            value: [node.id, node.type, node.bankNo]
                        };
                        showInfoRightMenu(objInfo);
                        showDiagram("mtr");
                    } else if (node.type == 'DL') {
                        sliderManager.sliderToggle(true);
                        console.log('DL Select', node.id);
                        mxGraphDiagram.subsId = node.subsId;
                        mxGraphDiagram.mtrId = node.mtrId;
                        mxGraphDiagram.cbId = node.cbId;
                        mainObj.makeShowValueOptionTable().then(function(resolve){
                            mainObj.checkShowValueOptionAndSetSlider();
                        });
                         objInfo = {
                            type: "dl",
                            value: [node.id, node.type, node.no, node.name, node.cbId, node.mtrId, node.subsId]
                        };
                        showInfoRightMenu(objInfo);
                        showDiagram(node.id)
                    }
                }

                    });*/

            new Promise(function(resolve, reject){
                $("#showListDiv").treeview({
                    color: "#777777",
                    backColor: "#F9F9F9",
                    selectedColor: "#777777",
                    selectedBackColor: "#E7E7E7",
                    onhoverColor: "#E7E7E7",
                    expandIcon: "glyphicon glyphicon-plus", //glyphicon glyphicon-plus
                    collapseIcon: "glyphicon glyphicon-minus",
                    emptyIcon: "glyphicon glyphicon-unchecked",
                    showTags: true,
                    data: treeData,
                    onNodeSelected: function (event, node) {
                        disposeContextPopup();
                        // console.log(node);
                        // console.log(event);
                        if(node.subs_name !== undefined){
                            $('#substnm').val(node.subs_name);
                        }
                        if (node.type == "SUBSTATION") {
                            sliderManager.sliderToggle(false);
                            buttonManager.returnButton(false);
                            $("#modeChange").attr('disabled', 'disabled');
                            mxGraphDiagram.subsId = node.id;
                            var objInfo = {
                                type: "subs",
                                value: [node.id, node.type, node.no, node.name]
                            };
                            //알고리즘 예측 결과 확인 버튼 삭제
                            algoBtnManager.clearBtnMap();
                            $("#substnm").val(node.name);
                            $("#selectObjectInfo").text(node.name);
                            showInfoRightMenu(objInfo);
                            showDiagram("subs");
                            moveSelectedSubsCoordinate(node.no);
                        } else if (node.type == "MTR") {
                            sliderManager.sliderToggle(false);
                            buttonManager.returnButton(true);
                            $("#modeChange").attr('disabled', 'disabled');
                            mxGraphDiagram.subsId = node.subsId;
                            mxGraphDiagram.mtrId = node.id;
                            var objInfo = {
                                type: "mtr",
                                value: [node.id, node.type, node.bankNo]
                            };
                            //알고리즘 예측 결과 확인 버튼 삭제
                            algoBtnManager.clearBtnMap();
                            $("#substnm").val(node.id);
                            $("#selectObjectInfo").text(node.subs_name + " > " + node.id);
                            showInfoRightMenu(objInfo);
                            if(sf_util.getDiagramMode() == 1){      // 단선도 모드인지 확인
                                $("#legendSimulationLoad").hide();
                                $("#legendSimulation").show();
                                $('#loading_modal').modal('show');
                                showDiagram("mtr");
                            }
                        } else if (node.type == 'DL') {
                            sliderManager.sliderToggle(true);
                            buttonManager.returnButton(true);
                            $("#modeChange").removeAttr('disabled');
                            mxGraphDiagram.subsId = node.subsId;
                            mxGraphDiagram.mtrId = node.mtrId;
                            mxGraphDiagram.cbId = node.cbId;
                            mxGraphDiagram.dlId = node.Id;


                            $("#selectObjectInfo").text(node.subs_name + " > "  + node.mtrId + " > " + node.name);


                            var objInfo = {
                                type: "dl",
                                value: [node.id, node.type, node.no, node.name, node.cbId, node.mtrId, node.subsId]
                            };
                            //알고리즘 예측 결과 확인 버튼 삭제
                            algoBtnManager.clearBtnMap();
                            $("#substnm").val(node.name);
                            showInfoRightMenu(objInfo);
                            if(sf_util.getDiagramMode() == 1) {      // 단선도 모드인지 확인
                                $("#legendSimulationLoad").hide();
                                $("#legendSimulation").show();
                                showDiagram(node.id);
                                mainObj.makeShowValueOptionTable().then(function (resolve) {
                                    mainObj.checkShowValueOptionAndSetSlider();
                                    // sliderManager.getPqmsDataProcess(1, 1, 1, 0);
                                });
                            }
                            /*new Promise(function(resolve2, reject2){

                                resolve2();
                            }).then(function(resolve2){
                                mainObj.makeShowValueOptionTable().then(function (showValueResult) {

                                    // sliderManager.getPqmsDataProcess(1, 1, 1, 0);
                                });
                            });*/
                        }
                        algorithmTabmanager.showAlgoTable();
                    },
                    onNodeExpanded:function (evt, node) {
                        // console.log("*** expanded node: ", node);
                    }
                });
                resolve();
            }).then(function(treeEnd){
                const session_subs_no = $("#hidden_subs_no").val();
                if(session_subs_no  === "-1"){
                    setCallObjFlag("TreeView");
                }else{
                    selectTreeViewItem(session_subs_no);
                }

            });



        });
    }

    function makeSubsTreeData(originData) {
        // console.log(originData);
        var subsList = [];
        var mtrList = [];
        var resultList = [];
        for (var i = 0; i < originData.length; i++) {
            var subsId = originData[i].subs_id;
            var mtrId = originData[i].mtr_id;
            var dlId = originData[i].dl_id;
            if (subsList.indexOf(subsId) == -1) {
                subsList.push(subsId);
                var subsMap = {
                    text: originData[i].subs_name + "(SUBS)",
                    id: subsId,
                    no: originData[i].subs_no,
                    name: originData[i].subs_name,
                    subs_name: originData[i].subs_name,
                    type: "SUBSTATION",
                    nodes: []
                };
                resultList.push(subsMap);
            }
            var subsIndex = subsList.indexOf(subsId);
            if (mtrList.indexOf(mtrId) == -1) {
                mtrList.push(mtrId);
                var mtrMap = {
                    text: mtrId + "(MTR)",
                    id: mtrId,
                    bankNo: originData[i].bank_no,
                    subsId: subsId,
                    subs_name: originData[i].subs_name,
                    type: "MTR",
                    nodes: []
                };
                resultList[subsIndex].nodes.push(mtrMap);
            }
            var dlMap = {
                text: originData[i].dl_name + "(DL)",
                id: dlId,
                no: originData[i].dl_no,
                name: originData[i].dl_name,
                subsId: subsId,
                mtrId: mtrId,
                cbId: originData[i].cb_id,
                subs_name: originData[i].subs_name,
                type: "DL"
            };
            for (var j = 0; j < resultList[subsIndex].nodes.length; j++) {
                if (mtrId == resultList[subsIndex].nodes[j].id) {
                    resultList[subsIndex].nodes[j].nodes.push(dlMap);
                }
            }
        }
        return resultList;
    }
});


$(function () {

    //tab border
    $("#substInfoTab").on("click", function () {
        $("#selectObject")
            .css('border', '1px solid #ddd');
        $("#selectAlgo")
            .css('border', '0px solid  #ddd');
    });
    $("#algoInfoTab").on("click", function () {
        $("#selectAlgo")
            .css('border', '1px solid #ddd');
        $("#selectObject")
            .css('border', '0px solid  #ddd');
    });

    $('#algorithmListSelect').on('click', function () {

        $("input[name=algorithmList]:checked").each(function () {
            algorithmselected = [];

            algorithmselected.push({
                select_algorithm: $(this).val(),
                select_object: objInfo.value
            });

        });
        console.log(algorithmselected)
    });


    //모드 변경 부분
    $("#modeChange").off().change(function () {
        if ($("#modeChange").is(":checked")) {
            var checkDiagramMod = mxGraphDiagram.check;
            //##TODO : 현재 시뮬레이션은 dl 단선도에서만 사용하므로 mtr, subs 단선도일 경우에는 모드가 변경되지않도록 함. 차후 mtr, subs 단선도에서 시뮬레이션 기능이 들어간다면 조건문 없애면 됨.
            if(checkDiagramMod === "dl"){
                $('#editor').off("click").on("click", function () {
                });

                /*  $('#display')
                      .css('border', '5px solid #b5d4ff' );*/
                $('#main_head_title').text(" 단선도 (시뮬레이션) ");
                $("#diagramDiv").hide();
                $("#simulatorDiv").show();
                if ($("#simulatorDlId").val() != mxGraphDiagram.dlId) {
                    $("#simulatorDlId").val(mxGraphDiagram.dlId).trigger("change");
                }
                $('#showListTree').hide();
                $("#showSimulatorObj").show();

                buttonManager.returnButton(false);
                buttonManager.refreshButton(true);
                createEditorMenu();
                algoBtnManager.clearBtnMap();
                mainObj.makeShowValueOptionTable().then(function (resolve) {
                    mainObj.checkShowValueOptionAndSetSlider();
                    // sliderManager.getPqmsDataProcess(1, 1, 1, 0);
                });
            } else {
                return;
            }
        } else {
            console.log("N");
            $("#editor").unbind("click");

            /*   $('#display')
                   .css('border', '5px solid #b4b4c7');*/

            $('#main_head_title').text(" 단선도 ");
            $("#simulatorDiv").hide();
            $("#diagramDiv").show();
            // $('#graphContainer').css("display", "none");
            /*     $("#legendOneDiagram").show();
                 $("#legendSimulation").hide();*/
            $('#showListTree').show();
            $("#showSimulatorObj").hide();
            sliderManager.sliderToggle(true);
            buttonManager.returnButton(true);
            buttonManager.refreshButton(false);
        }
    });

    //GIS 이동 모드 변경 부분
    /*    $("#gisMoveModeChange").off().change(function () {
            if (isToggleButtonChecked("gisMoveModeChange")) {

                $('#display')
                    .css('border', '5px solid #b5d4ff' );

            } else {

                $('#display')
                    .css('border', '5px solid #b4b4c7');

            }
        });*/

    $("#gis").off().on("click", function () {
        sf_util.diagramModeCahnge(0);

        //알고리즘 예측 결과 확인 버튼 삭제
        algoBtnManager.clearBtnMap();

        $("#legendSimulation").hide();
        $("#legendOneDiagram").hide();
        $("#legendSimulationLoad").hide();
        $("#legendGIS").show();

        $("#hs").show();
        $("#displayModeValue").val("GIS");
        $('#display').css('background-color', '#ebeff9');

        $("#modeChange").bootstrapToggle('off');
        $("#modeChange").bootstrapToggle('disable');
        $("#gisMoveModeChange").bootstrapToggle('enable');
        $('#main_head_title').text(" GIS ");

        $('#displayGis').show();
        $('#displayBackground').hide();
        $('#jh').hide();
        $('#subsinfo').show();

        $('#plusBtn').hide();
        $('#minusBtn').hide();
        sliderManager.sliderToggle(false);
        buttonManager.returnButton(false);

        $("#substInfoTab").click();

        $('#substnm').val('');

        /*알고리즘 리스트 보이기/ 숨김 처리*/
        $('#pqmsRow').hide();
        $('#pvRow').hide();
        $('#sectionRow').hide();
        $('#gisTemp01_Row').show();
        $('#gisTemp02_Row').show();

    });


    $("#oneLineDiagram").off().on("click", function () {
        sf_util.diagramModeCahnge(1);
        disposeContextPopup();
        $('#main_head_title').text(" 단선도 ");
        $("#gisMoveModeChange").bootstrapToggle('off');
        $("#modeChange").bootstrapToggle('enable');
        $("#gisMoveModeChange").bootstrapToggle('disable');
        $('#hs').hide();
        $("#displayModeValue").val("ED");
        $('#display').css('background-color', 'black');
        $('#displayBackground').show();
        $('#displayGis').hide();
        $("#jh").show();

        $("#legendSimulation").show();
        $("#legendOneDiagram").show();
        $("#legendSimulationLoad").hide();
        $("#legendGIS").hide();

        $('#plusBtn').show();
        $('#minusBtn').show();

        $('#algorithmListSelect').hide();

        /*알고리즘 리스트 보이기/ 숨김 처리*/
        $('#pqmsRow').show();
        $('#pvRow').show();
        $('#sectionRow').show();
        $('#gisTemp01_Row').hide();
        $('#gisTemp02_Row').hide();

        var selectedNodeList = $('#showListDiv').data('treeview').getSelected();

        if (selectedNodeList.length > 0) {
            if( selectedNodeList[0].type === "MTR" && sf_util.getDiagramMode() == 1){      // 단선도 모드인지 확인
                $('#loading_modal').modal('show');
                showDiagram("mtr");
            }else if(selectedNodeList[0].type === "DL" && sf_util.getDiagramMode() == 1) {      // 단선도 모드인지 확인
                showDiagram(selectedNodeList[0].id);
                mainObj.makeShowValueOptionTable().then(function (resolve) {
                    mainObj.checkShowValueOptionAndSetSlider();
                    // sliderManager.getPqmsDataProcess(1, 1, 1, 0);
                });
            }
        }

        if (($("#modeChange").is(":checked"))) {
            buttonManager.returnButton(false);
        }
        else {
            buttonManager.returnButton(true);
        }


        /* $("#diagram_submenu").css('display', 'none');*/


        if (selectedNodeList.length > 0) {
            if (selectedNodeList[0].type === "DL") {
                sliderManager.sliderToggle(true);
            }
            else {
                sliderManager.sliderToggle(false);
            }
        } else {
            sliderManager.sliderToggle(false);
        }

        if (selectedNodeList.length > 0) {
            if (selectedNodeList[0].type === "DL" || selectedNodeList[0].type === "MTR") {
                buttonManager.returnButton(true);
            }
            else {
                buttonManager.returnButton(false);
            }
        } else {
            buttonManager.returnButton(false);
        }

    });

    //Layer 단위 설정
    $("select#team").on("change", function (value) {
        var This = $(this);
        var selected = $(this).val();

        $('#layerSave').off("click").on("click", function () {
            console.log(selected);
            //alert(selected);
        });

    });


    //아이콘 버튼
    $('#drag').off("click").on("click", function () {
        alert("drag click");
    });
    $('#calendar').off("click").on("click", function () {
        alert("click calendar")
    });
    /*
        <tr>
            <td class="value_menu_td_number">1</td>
            <td>Ravi Kumar</td>
            <td class="value_menu_td_check"><span class="label label-success">Active</span></td>
            <td class="value_menu_td_activation">
                <input type="checkbox" class="custom-control-input" name="valueCheckbox" value="1"/>
            </td>
        </tr>
     */

    //값표시 설정
    $("#showValueOptionModalBtn").off("click").on("click", function () {
        mainObj.makeShowValueOptionTable();
    });


    //표현object설정
    $("#object").off("click").on("click", function () {
        $("#objectTable").empty();

        $.ajax({
            url: "/ui/object",
            type: "POST",
            dataType: 'json',
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    // $('#objectTable').append("<input type='checkbox' name='objectMenu' value=" + data[i].object_type_idx + ">" + data[i].object_type_name + "<br> ");
                    $('#objectTable').append(mainObj.makeShowObjectMenuTableElement(data[i].object_type_name, data[i].object_type_idx));
                }
            }
        })
    });


    //알고리즘 추가 및 적용
    /*    $("#algo").off("click").on("click", function () {
            $("#algoTable").empty();

            $.ajax({
                url: "/ui/algorithm",
                type: "POST",
                dataType: 'json',
                success: function (data) {

                    for (var i = 0; i < data.length; i++) {
                        $('#algoTable').append("<tr><td><input type=\"checkbox\" name='algorithmMenu' value="+ data[i].algorithm_info_idx +"></td><td>" + data[i].algorithm_info_idx + "</td><td>" + data[i].algorithm_name + "</td></tr>");
                    }
                }
            })
        });*/


    //값표시 설정 저장버튼 클릭
    $('#ValueMenu').off("click").on("click", function () {

        var valueArr = [];

        $("input:checkbox[name='valueCheckbox']").each(function () {

                if (this.checked == true) {
                    valueArr.push({
                        label_type_idx: $(this).val(),
                        check_activation: 1
                    });
                }
                else {
                    valueArr.push({
                        label_type_idx: $(this).val(),
                        check_activation: 0
                    });
                }
            }
        );
        var jsonMap = JSON.stringify(valueArr);

        //$.ajaxSettings.traditional = true;
        console.log(jsonMap);
        $.ajax({
            url: "/ui/val",
            type: "POST",
            data: jsonMap,
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (result) {
                //console.log(result);
                mainObj.checkShowValueOptionAndSetSlider();

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("에러 발생 \n" + textStatus + " : " + errorThrown);
            }


        });
    });


    //표현 Object 설정 저장버튼 클릭
    $('#ObjectSave').off("click").on("click", function () {

        var objectArr = [];

        $("input:checkbox[name='objectMenu']").each(function () {

                if (this.checked == true) {
                    objectArr.push({
                        object_type_idx: $(this).val(),
                        check_activation: 1
                    });
                }
                else {
                    objectArr.push({
                        object_type_idx: $(this).val(),
                        check_activation: 0
                    });
                }
            }
        );


        var jsonMap = JSON.stringify(objectArr);

        $.ajaxSettings.traditional = true;
        console.log(jsonMap);
        $.ajax({
            url: "/ui/obj",
            type: "POST",
            data: jsonMap,
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (result) {

                console.log(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("에러 발생 \n" + textStatus + " : " + errorThrown);
            }


        });
    });


    //알고리즘 설정 저장버튼 클릭
    $('#AlgorithmSave').off("click").on("click", function () {

        var algorithmArr = [];

        $("input:checkbox[name='algorithmMenu']").each(function () {

                if (this.checked == true) {
                    algorithmArr.push({
                        algorithm_info_idx: $(this).val(),
                        check_activation: 1
                    });
                }
                else {
                    algorithmArr.push({
                        algorithm_info_idx: $(this).val(),
                        check_activation: 0
                    });
                }
            }
        );

        var jsonMap = JSON.stringify(algorithmArr);

        $.ajaxSettings.traditional = true;

        console.log(jsonMap);
        $.ajax({
            url: "/ui/algo",
            type: "POST",
            data: jsonMap,
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (result) {

                console.log(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("에러 발생 \n" + textStatus + " : " + errorThrown);
            }


        });
    });


    var editorCategoryTable = function () {
        $("#editorCategoryTable").empty();
        $.post("/UI/editorCategory", function (result) {
            var count = 1;
            for (var i = 0; i < result.length; i++) {
                var categoryName = result[i].name; // 카테고리 이름
                var dateLong = result[i].reg_date;// 등록일 var beforeImgId = filePath.split("/").splice(-1, 1)[0].split(".")[0].trim();
                var id = result[i].id;
                var editorcategoryupdateInputid = "editorcategoryupdateInputid" + (i + 1);
                var editorcategoryupdateInputidbtn = "editorcategoryupdateInputidbtn" + (i + 1);
                var editorcategoryupdateeditorid = "editorcategoryupdateeditorid" + (i + 1);
                var editorcategoryupdatepid = "editorcategoryupdatepid" + (i + 1);
                var hiddenid = "hiddenid" + (i + 1);
                var modifiedid = "modifiedid" + (i + 1);
                var countid = "countid" + (i + 1);
                var modifieddeleteid = "modifieddeleteid" + (i + 1);
                var deletebutton = "deletebutton" + (i + 1);

                var date = dateLong.substring(0, 10)
                var addCategoryHtml =
                    "<tr>" +
                    "<td id=" + hiddenid + " name='hiddenname' hidden>nomal</td>" +
                    "<td align='center' id=" + countid + ">" + count + "</td>" +
                    "<td align='center' name='editorname' id=" + editorcategoryupdateeditorid + ">" + "<input type='text' size=15  id=" + editorcategoryupdateInputid + " name='updateInput' hidden> <p id=" + editorcategoryupdatepid + ">" + categoryName + "</p> </td><td align='center'>" + date + " </td>" +
                    "<td align='center'>" + "<button class='btn btn-xs btn-warning' id=" + editorcategoryupdateInputidbtn + " name='updateEdi' value=" + id + "><i class='fa fa-pencil'></i></button>" + "<button class='btn btn-xs btn-danger' id="+ deletebutton +" name='deleteEdi' value=" + id + " ><i class='fa fa-times'></i></button>" +
                    "<button class='btn btn-xs btn-warning' id=" + modifiedid + " style='display: none'><i class='fa fa-check'></i></button>" + "<button class='btn btn-xs btn-success' id=" + modifieddeleteid + " style='display: none'><i class='fa fa-times'></i></button>" +
                    " </td>"
                "</tr>";
                $("#editorCategoryTable").append(addCategoryHtml);
                count++
            }
        });
    };


    var editorImageTable = function () {
        $("#editorImageTable").empty();
        $.post("/UI/editorImage", function (result) {
            var count = 1;
            for (var i = 0; i < result.length; i++) {
                var imgName = result[i].name;
                var filePath = result[i].file_path;
                var dateLong = result[i].reg_date;
                var id = result[i].id;
                var date = dateLong.substring(0, 10);

                var editorImageUpdateInputId = "editorImageUpdateInputId" + (i + 1);
                var editorImageUpdateInputIdBtn = "editorImageUpdateInputIdBtn" + (i + 1);
                var editorImageUpdateEditorId = "editorImageUpdateEditorId" + (i + 1);
                var editorImageUpdateId = "editorImageUpdateId" + (i + 1);

                var editorImagemodifiedId = "editorImagemodifiedId" + (i + 1);
                var editorImageCountId = "editorImageCountId" + (i + 1);
                var editorImageModifiedDeleteId = "editorImageModifiedDeleteId" + (i + 1);
                var deleteimagebutton = "deleteimagebutton" + (i + 1);

                var addCategoryHtml =
                    "<tr>" +
                    "<td align='center' id=" + editorImageCountId + ">" + count + "</td>" +
                    "<td align='center' name='imageName' id=" + editorImageUpdateEditorId + "> " + "<input type='text' size=10  id=" + editorImageUpdateInputId + " name='updateInput' hidden><p id=" + editorImageUpdateId + ">" + imgName + "</p></td><td align='center'><img src='" + filePath + "' style='width: 30px; height: 30px;'/></td>+" +
                    "<td align='center'>" + date + " </td>" +
                    "<td align='center'>" + "<button class='btn btn-xs btn-warning'  id=" + editorImageUpdateInputIdBtn + " name='updateImage' value=" + id + "><i class='fa fa-pencil'></i></button>" + "<button class='btn btn-xs btn-danger' id="+deleteimagebutton+" name='deleteimg' value=" + id + " ><i class='fa fa-times'></i></button>" +
                    "<button class='btn btn-xs btn-warning' id=" + editorImagemodifiedId + " style='display: none'><i class='fa fa-check'></i>" + "<button class='btn btn-xs btn-success' id=" + editorImageModifiedDeleteId + " style='display: none'><i class='fa fa-times'></i></button>" +
                    "</td>"
                "</tr>";
                $("#editorImageTable").append(addCategoryHtml);
                count++
            }
        });
    };


    $(document).on("click", "button[name=deleteEdi]", function () {

        var deleteCategory = $(this).val();


        var jsonMap = JSON.stringify(deleteCategory);

        $.ajax({
            url: "/ui/deleteEditorCategory",
            type: "POST",
            data: {'categorydelete': jsonMap},
            dataType: 'json',
            success: function (result) {
                editorCategoryTable();
                createEditorMenu();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("에러 발생 \n" + textStatus + " : " + errorThrown);
            }


        });

    });

    $(document).on("click", "button[name=deleteimg]", function () {

        var deleteimage = $(this).val();


        var jsonMap = JSON.stringify(deleteimage);

        console.log("결고ㅏ:", deleteimage)
        $.ajax({
            url: "/ui/deleteEditorImage",
            type: "POST",
            data: {'imagedelete': jsonMap},
            dataType: 'json',
            success: function (result) {
                editorImageTable();

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("에러 발생 \n" + textStatus + " : " + errorThrown);
            }


        });

    });


    $(document).on("click", "button[name=updateEdi]", function () { //카테고리 업데이트
        $(this).attr("id");
        var text01 = $(this).attr("id").substring(30, 31);
        console.log(text01);
        $("#modifiedid" + text01).show();
        $("#modifieddeleteid" + text01).show();
        $("#deletebutton" + text01).hide();
        $("#editorcategoryupdateInputidbtn" + text01).hide();



        $("#hiddenid" + text01).text("modified")

        $("#editorcategoryupdateInputid" + text01).val($("#editorcategoryupdateeditorid" + text01).text());
        $("#editorcategoryupdatepid" + text01).hide();
        $("#editorcategoryupdateInputid" + text01).show();


        $("#modifiedid" + text01).on("click", function () {
            var editArr = [];

            editArr.push(
                $("#countid" + text01).text(),
                $("#editorcategoryupdateInputid" + text01).val()
            );

            var jsonMap = JSON.stringify(editArr);

            console.log(jsonMap)

            $.ajax({
                url: "/ui/updateEditorCategory",
                type: "POST",
                data: {'update': jsonMap},
                dataType: 'json',
                success: function (result) {
                    editorCategoryTable();
                    createEditorMenu();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("에러 발생 \n" + textStatus + " : " + errorThrown);
                }
            });

        });

        $("#modifieddeleteid" + text01).on("click", function () {
            $("#editorcategoryupdatepid" + text01).show();
            $("#editorcategoryupdateInputid" + text01).hide();
            $("#deletebutton" + text01).show();
            $("#editorcategoryupdateInputidbtn" + text01).show();

            $("#modifiedid" + text01).hide();
            $("#modifieddeleteid" + text01).hide();
        });

    });




    $(document).on("click", "button[name=updateImage]", function () { //이미지 업데이트
        $(this).attr("id");
        var text01 = $(this).attr("id").substring(27, 29);
        console.log(text01);
        $("#editorImagemodifiedId" + text01).show();
        $("#editorImageModifiedDeleteId" + text01).show();
        $("#editorImageUpdateInputIdBtn" + text01).hide();
        $("#deleteimagebutton" + text01).hide();


        $("#editorImageUpdateInputId" + text01).val($("#editorImageUpdateId" + text01).text());
        $("#editorImageUpdateId" + text01).hide();
        $("#editorImageUpdateInputId" + text01).show();


        $("#editorImagemodifiedId" + text01).on("click", function () {
            var editImageArr = [];

            editImageArr.push(
                $("#editorImageCountId" + text01).text(),
                $("#editorImageUpdateInputId" + text01).val()
            );

            var jsonMap = JSON.stringify(editImageArr);

            console.log(jsonMap)

            $.ajax({
                url: "/ui/updateEditorImage",
                type: "POST",
                data: {'updateeditor': jsonMap},
                dataType: 'json',
                success: function (result) {
                    editorImageTable();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("에러 발생 \n" + textStatus + " : " + errorThrown);
                }
            });

        });

        $("#editorImageModifiedDeleteId" + text01).on("click", function () {
            $("#editorImageUpdateId" + text01).show();
            $("#editorImageUpdateInputIdBtn" + text01).show();
            $("#deleteimagebutton" + text01).show();
            $("#editorImageUpdateInputId" + text01).hide();

            $("#editorImagemodifiedId" + text01).hide();
            $("#editorImageModifiedDeleteId" + text01).hide();
        });

    });







    $("#editorSave").off("click").on("click", function () {
            var editorArr = [];

            editorArr.push(
                $("#countText").val(),
                $("#nameText").val(),
                $("#dateText").val()
            );

            var jsonMap = JSON.stringify(editorArr);


            $.ajax({
                url: "/ui/editorCategorys",
                type: "POST",
                data: {'editor': jsonMap},
                dataType: 'json',
                success: function (result) {
                    editorCategoryTable();
                    createEditorMenu();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("에러 발생 \n" + textStatus + " : " + errorThrown);
                }
            });
        });

/*        else{
            var editArr = [];

            editArr.push(
                $("#countText").val(),
                $("#editorcategoryupdateInputid" + text01).val,
                $("#dateText").val()
            );

            var jsonMap = JSON.stringify(editArr);

            console.log(jsonMap)

            $.ajax({
                url: "/ui/editorCategorys",
                type: "POST",
                data:  { 'update' : jsonMap},
                dataType: 'json',
                success: function (result) {
                    editorCategoryTable();
                    createEditorMenu();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("에러 발생 \n" + textStatus + " : " + errorThrown);
                }
            });



        }*/





    $("#addImageSave").off("click").on("click", function () {

        var imageArr = [];

        imageArr.push(
            $("#countText").val(),
            $("#filename").val(),
            $("#file").val(),
            $("#dateText").val()

        );

        var jsonMap = JSON.stringify(imageArr);

        $.ajax({
            url: "/ui/addEditorImage",
            type: "POST",
            data:  { 'Image' : jsonMap},
            dataType: 'json',
            success: function (result) {
                editorImageTable();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("에러 발생 \n" + textStatus + " : " + errorThrown);
            }
        });
    });



    $("#addeditorimage").on("click", function (){
        $("#addImage").modal('show');
    });

    $("#editorImageMenu").on("click", function (){
        editorImageTable();
    });

    $("#editorCategoryMenu").on("click", function (){
        editorCategoryTable();

    });


    $("#userInfo").off("click").on("click", function () {
        $("#info").empty();

        $.ajax({
            url: "/ui/userInfo",
            type: "POST",
            dataType: 'json',
            success: function (data) {
                $('#info').append("<span class='badge badge-warning' style='font-size: large';>아이디 : " +  data[0].id + "</span>"+
                    " <span class='badge badge-warning' style='font-size: large';> 이름 : " +  data[0].name + "</span>"+
                     " <span class='badge badge-warning' style='font-size: large';> 소속 : " +  data[0].organization + "</span>");
            }
        })
    });


    $("#algoTimeSetClickPick").datetimepicker({
        format: "yyyy-mm-dd hh:ii",
        autoclose: true,
        todayBtn: true,
        todayHighlight: true,
        minuteStep: 10,
    });

    $("#algoTimeSetClickPick").click(function () {
        $("#algoTimeSetClickPick").datetimepicker('show');
    });

    $("#algoTimeSetClickPick").datetimepicker().on('hide', function(){
        var selectedDate = $("#algoTimeSetClickPick").datetimepicker().data().date;
        $("#global_setting_time").text(selectedDate);
    });
    //

    $("#gis").trigger("click");
    $('#plusBtn').hide();
    $('#minusBtn').hide();
});

function isToggleButtonChecked(btnId){
    return $("#" + btnId).is(":checked");
}

function makeTableAlgorithmInfo(data) {

    $("#algorithmInfoTbody").empty();
    insertAlgoDatatoTable(data, "algorithmInfoTbody");
};

function  showAlgorithmInfo(algo_idx, algo_name) {
    console.log(algo_idx);
    if(algo_idx < 0){
        return;
    }
    var param = {
        'algo_idx' : algo_idx
    };
    $.ajax({
        url: "/algorithm/info",
        data : param,
        type: "POST",
        dataType: 'json',
        success: function (data) {
            //modal setting

            makeTableAlgorithmInfo(data);
            $("#algo_name").val(algo_name);
            $("#algoInfoModal").modal("show");
            $("#algoInfoModal").draggable({
                handle: ".modal-header"
            });
        }
    });
}
function requestAlgoInfoData() {
    var resultData;

    resultData = [];

    var tempDataMap1 = new Map(), tempDataMap2 =  new Map();

    tempDataMap1.set("version", "v0.1");
    tempDataMap1.set("mltype", "RNN");
    tempDataMap1.set("data", "Training : DAS Time Load\n" +
        "2017-06-03 ~ 2018-08-03\n" +
        "Test : DAS Time Load\n" +
        "2018-04-03 ~ 2018-07-04");
    tempDataMap1.set("result", "Test Set 예측 : 93.27%");

    tempDataMap2.set("version", "v0.5");
    tempDataMap2.set("mltype", "LSTM");
    tempDataMap2.set("data", "Training : DAS Time Load\n" +
        "2017-06-03 ~ 2018-08-03\n" +
        "Test : DAS Time Load\n" +
        "2018-04-03 ~ 2018-07-04");
    tempDataMap2.set("result", "Test Set 예측 : 95.27%");

    resultData.push(tempDataMap1);
    resultData.push(tempDataMap2);

    return resultData;
}

function insertAlgoDatatoTable(algoInfoDataList, tableBodyId) {
    var tableBody = $("#" + tableBodyId);

    console.log(algoInfoDataList);

    for(var i=0; i< algoInfoDataList.length; i++){
        var insertRow = document.createElement("tr");
        var insertDescriptionRow = document.createElement("tr");

        var verCell = document.createElement("td");
        var mlTypeCell = document.createElement("td");
        var dataCell = document.createElement("td");
        var resultCell = document.createElement("td");

        var descriptionHeaderCell = document.createElement("td");
        var descriptionValueCell= document.createElement("td");

        var verCellData = algoInfoDataList[i].version;
        var mlTypeCellData = algoInfoDataList[i].machine_learning_kind;
        var dataCellData = changeNewLineCharToNewLineTag(algoInfoDataList[i].data_description);
        // var dataCellData = algoInfoDataList[i].get('data');
        var resultCellData = algoInfoDataList[i].accuracy;

        var descriptionValueData = algoInfoDataList[i].description;

        $(verCell).text(verCellData);
        $(mlTypeCell).text(mlTypeCellData);
        $(dataCell).append(dataCellData);
        $(resultCell).text(resultCellData + "%");

        $(descriptionHeaderCell).text("[ 설명 ]");
        $(descriptionValueCell).text(descriptionValueData);

        verCell.style.textAlign = "center";
        mlTypeCell.style.textAlign = "center";
        dataCell.style.textAlign = "left";
        resultCell.style.textAlign = "center";
        descriptionHeaderCell.style.textAlign = "center";
        descriptionValueCell.style.textAlign = "left";

        verCell.style.verticalAlign = "middle";
        mlTypeCell.style.verticalAlign = "middle";
        dataCell.style.verticalAlign = "middle";
        resultCell.style.verticalAlign = "middle";
        descriptionHeaderCell.style.verticalAlign = "middle";
        descriptionValueCell.style.verticalAlign = "middle";

        descriptionHeaderCell.style.fontWeight  = "900";
        descriptionValueCell.colSpan = "3";

        $(insertRow).append(verCell);
        $(insertRow).append(mlTypeCell);
        $(insertRow).append(dataCell);
        $(insertRow).append(resultCell);

        $(insertDescriptionRow).append(descriptionHeaderCell);
        $(insertDescriptionRow).append(descriptionValueCell);

        $(tableBody).append(insertRow);
        $(tableBody).append(insertDescriptionRow);
    }
}

function changeNewLineCharToNewLineTag(originData){
    var chgResult = "";
    var tempArr = originData.split("\\n");
    console.log(tempArr);
    for(var i=0; i< tempArr.length; i++){
        var tempString = "<p>" + tempArr[i] + "</p>";
        chgResult += tempString;
    }

    return chgResult;
}