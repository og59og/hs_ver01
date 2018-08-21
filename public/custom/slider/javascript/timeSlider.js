//need jquery

var sliderManager = {

    //dataGetterFuncMap 하단부에 선언 및 정의
    dataMap: {},
    dataList: [], //시간 순서로 들어가야 하는 list
    algoDataMap: {}, // 시간을 키 값으로 각 알고리즘 결과 row를 관리하는 맵
    algoOrgDataMap : {}, // 알고리즘통해 받은 데이터 자체를 저장한다. 새로 요청하면 덮어 씌우도록 해둔다.
    totalDataMap: {},
    totalDataList: [],
    sliderId: "timeSlider",
    controllerTimeObj: null,


    /**
     * 슬라이더에서 사용할 데이터를 불러온다. (알고리즘 데이터 아님)
     * @param dataOptionArr 값 표시 설정에서 설정되어 있는 값의 옵션을 가져온다. 옵션 배열
     * @param pramArr 값 표시 설정에서 설정된 옵션에 대해서 값을 가져오기 위해 필요한 파라미터 배열
     */
    dataLoader: function (dataOptionArr, pramArr) { //기본으로 처음에 한번 실행하고 시간 설정 하거나 관련 옵션이 변경되거나 했을때 실행되는 함수여야함
        // 옵션 같은걸로 select 해올 데이터를 만들어놓고 (check box) 해당 값을 array로 받아서 전달 dl_id랑 같이 전달
        // 서버에서 checkbox option val로 잘 넣어두겠지만 정리한 문서,카탈로그 필요
        // 서버에서 option을 가지고 sql을 여러번 하든 해서 데이터 만들어서 리턴!~!!하면 data {} 에 저장한다.\

        // 적당한 변전소, MTR DL ID가 필요 가수원-50038-7 / 8
        // Subs 가수원 - 2, S502
        // MTR 50038 -  50038 / bonk_no 1

        // var param = {'dl_id' : dl_id, options : dataOptionArr};
        // 각 option에 따른 param은 다 다를 수 있어 SQL과 잘 맞춰야함
        //TODO : 시간도 같이보내서 데이터 데이터 받아올 수 있도록 수정해야합니다.
        var param = {options: dataOptionArr, 'param': pramArr};
        $.ajax({
            url: "/slider/data",
            type: "POST",
            data: JSON.stringify(param), //Server에서 JSON으로 바로 받기 위해서
            contentType: "application/json; charset=UTF-8",
            success: function (data) {
                //console.log(data);


                sliderManager.dataMap = sliderManager.dataTimeSyncProcess(data);
                //sliderManager.dataList = sliderManager.makeDataListByTimeOrder(sliderManager.dataMap);

                //total에 추가
                sliderManager.mergeAndConverListDataMap();
                sliderManager.setSlider(sliderManager.sliderId);
            }
        })

    },
    /**
     *
     * @param dataMap
     * @returns {{}}
     */
    dataTimeSyncProcess: function (dataMap) {
        //가져온 데이터마다 시간이 다를텐데 어떻게 slider에서 보여줄 것인가?
        /*
        1. 빈 값은 그대로 보여주기
        2. 데이터 동기화

        1번 방법의 경우라 하더라도 같은 시간을 가지는 데이터들은 묶어서 보여줘야함 년-월-일 시간-분 으로 계산하고 초단위 밑으로는 잘라서 같은걸로 처리함
        2번의 경우 뭔가 방법을 정해서 48분 49분 50분 이 있으면 분 단위를 정해서 올림이나 반올림 같은걸 해서 같은 시간으로 처리를 해주는데
        문제는 반올림 하면 46분 48분 두 개 데이터가 있으면 둘 다 50분이 되어버림 무시할 것인가?

        전체 시간을 나열하고 같은 시간애들은 묶어주고 만약 45분에 1번 데이터는 있는데 2번 데이터가 없는경우 {time : 45분, data : {1번 : data, 2번 : null}} 이런식으로 만들자.
        혹은 방법은 같은데 데이터 표현을 {45분 : {colname1 : data, colname2 : null}} 요래 할까
         */
        //1. dataMap에 있는 object들을 순회한다.
        //2. 순회된 object의 data에 있는 time을 분단위로 끊어서 (초단위 내림-짜르기) time list or map에 시간을 key값으로 하는 객체를 만들고 안에 column을 키값으로 하면서 data를 넣는다.
        //3.
        var sliderData = {};
        for (var column in dataMap) {
            const dataArr = dataMap[column].data;
            for (var dataIdx in dataArr) {
                if (sliderData[dataArr[dataIdx].time] == null) { //시간 값 자체가 없을 떄
                    sliderData[dataArr[dataIdx].time] = {};
                    sliderData[dataArr[dataIdx].time][column] = [];

                    sliderData[dataArr[dataIdx].time][column].push(dataArr[dataIdx]);
                } else if (sliderData[dataArr[dataIdx].time][column] == null) { //시간으로 다른 column은 넣었었으나 현재 column은 없는 경우
                    sliderData[dataArr[dataIdx].time][column] = [];

                    sliderData[dataArr[dataIdx].time][column].push(dataArr[dataIdx]);
                } else {
                    sliderData[dataArr[dataIdx].time][column].push(dataArr[dataIdx]);
                }
            }
        }
        //console.log(sliderData);
        return sliderData;
    },
    /**
     *
     * @param dataMap
     * @returns {Array}
     */
    makeDataListByTimeOrder: function (dataMap) {
        var dataList = [];
        // sliderManager.dataMap 에서 key값을 다 꺼내가지고 key들을 date로 해서 정렬한다음 그 순서대로 array에 값들을 넣도록 한다.
        const map = dataMap;
        var keyList = [];
        for (var key in map) {
            keyList.push(key);
        }
        keyList.sort(function (a, b) {
            const d1 = new Date(a);
            const d2 = new Date(b);
            return d1 - d2;
        });

        for (var i in keyList) {
            map[keyList[i]].time = keyList[i];
            dataList.push(map[keyList[i]]);
        }
        return dataList;
    },
    getMapKeyCnt: function (map) {
        var count = 0;
        for (var k in map) if (map.hasOwnProperty(k)) ++count;
        return count;
    },
    setSlider: function (id) {
        //sliderManager.data의 시간 갯수 등을 통해서 min, max, 1칸당 값, 1칸당 움질일 값 등을 설정해줘야 한다.
        //값을 꺼내려면 두 가지 방법이 있을꺼 같다.
        const val = sliderManager.totalDataList.length - 1;
        const minVal = 0;
        const maxVal = sliderManager.totalDataList.length - 1;
        sliderManager.sliderInit(id, val, minVal, maxVal);
    },
    getCurrentSliderVal: function () {
        return sliderManager.getMapKeyCnt(sliderManager.dataMap);
    },
    getDataBySliderVal: function (id) {



        //값을 꺼내려면 두 가지 방법이 있을꺼 같다.
        //1. dataMap을 배열로 바꿔서 시간 순서대로 값이 있도록 하거나 시간 순서대로 들어가도록 하면서 시간 값을 가지는 객체같은걸로 바꿔서 넣어줌
        //2. slider value를 가지고 Index계산하고 Map의 키(시간)을 꺼내서 순서대로 정렬하고나서 Index번째 key를 꺼내서 값을 가져오기
        const sliderIdx = $("#" + id).slider("option", "value");

        if (!sliderManager.totalDataList[sliderIdx]) {
            console.log('sliderManager.totalDataList[sliderIdx] is null!');
            return;
        }

        //const currentTickIdx = (sliderManager.getMapKeyCnt(sliderManager.dataMap));
        //const pqmsDataList = pqms_plotly.pqmsDataProcessing(sliderManager.totalDataList, currentTickIdx - 1);
        //const plotDataList = pqms_plotly.pqmsDataToPlotData(pqmsDataList);
        //pqms_plotly.redrawPlot(plotDataList, sliderIdx, currentTickIdx, sliderManager.totalDataList[currentTickIdx - 1]['time']);
        pqms_plotly.redrawPlot(sliderManager.totalDataList[sliderIdx]['time']);

        //PV 차트 관련 코드들 작업중이던거라 수정해야됨 ㄱㅁ니ㅏㅓ인마런ㅇ마호먀ㅕ대홈ㄷㄴ황너허ㅏㅣ
        //const pvDataList = pv_plotly.pvDataProcessing(sliderManager.totalDataList, currentTickIdx - 1);
       // const pvplotDataList = pv_plotly.pvDataToPlotData(pvDataList);
        //pv_plotly.redrawPlot(pvplotDataList, sliderIdx, currentTickIdx, sliderManager.totalDataList[currentTickIdx - 1]['time']);
        pv_plotly.redrawPlot(sliderManager.totalDataList[sliderIdx]['time']);

        // 1번 방법으로 진행하였음 - sliderManager.dataList
        // id값으로 값 값 가지고와서 값가지고 dataList Index 참조해서 데이터 꺼내올 것
        // console.log("data slider get Data Sample");
        // console.log(sliderManager.totalDataList[$("#"+id).slider("option", "value")]);
        var sliderVal = sliderManager.totalDataList[$("#"+id).slider("option", "value")];
        return sliderVal;
    },
    changeSliderFunc : function(id){
        if (!sliderOnFlag)
            return;
        var sliderVal = sliderManager.getDataBySliderVal(id);
        var labelData = {};
        for (var key in sliderVal) {
            if (key != "time") {
                labelData[key] = sliderVal[key];
            }
        }
        showLoadLabel(labelData); //sec_load , pv , pqmsPredictOutput pqmsOriginalOutput
    },
    //##TODO : 차후 단선도에 timeSlider 가지고 그리게 되면 단선도같은 로직을 여기 이벤트에 넣어줘야함
    setSliderChangeEvent: function (id) {
        $("#" + id).slider({
            slide : function(event,ui) {
                sliderManager.changeSliderFunc(id);
                sliderManager.sliderToolTipInit();
            },
            change: function (event, ui) {
                sliderManager.changeSliderFunc(id);
            },
            stop : function(event, ui) {
                sliderManager.sliderToolTipInit();
            }
        });
    },
    /**
     * 알고리즘을 적용하지 않았을 때(기본 데이터) 슬라이더 초기화
     * @param id
     * @param defaultVal
     * @param minVal
     * @param maxVal
     */
    sliderToolTipInit : function(){
        const max = $("#" + sliderManager.sliderId).slider("option", "max");
        const value = $("#" + sliderManager.sliderId).slider("option", "value");
        const spacing = 100 / (max);
        $(".sf-slider-tooltiptext").css("left", (spacing * (value)) + '%').trigger("classChange");
        $(".sf-slider-tooltiptext").text(sliderManager.totalDataList[value].time);
    },
    sliderInit: function (id, defaultVal, minVal, maxVal) { //slider API = http://api.jqueryui.com/slider/#method-value
        $("#" + id).slider({
            precision: 2,
            value: defaultVal,
            min: minVal,
            max: maxVal,
            orientation: "horizontal",
            range: "min",
            animate: true,
        }).each(function() {
            $("label[name=slider_label]").each(function(){
                $(this).remove();
            });
            var opt = $(this).data().uiSlider.options;
            var vals = opt.max - opt.min;

            var startLabel = $('<label>'+(moment(sliderManager.totalDataList[0].time).format("HH:mm"))+'</label>').css('left',(0)+'%').attr("name", "slider_label");
            var endLabel = $('<label>'+(moment(sliderManager.totalDataList[maxVal].time).format("HH:mm"))+'</label>').css('left',((maxVal)/vals*100)+'%').attr("name", "slider_label");
            $("#" + id).append(startLabel);
            $("#" + id).append(endLabel);

        });
        sliderManager.setSliderChangeEvent(sliderManager.sliderId);
        const max = maxVal;
        const spacing = 100 / (maxVal - 1);
        //max로 개수 구하고 spacing 으로 칸 마다 거리 구함
        $("#" + id).find('.ui-slider-tick-mark').remove();
        $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * 0) + '%').appendTo($("#" + id));
        $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * (max - 1)) + '%').appendTo($("#" + id));
        $(".slider-left").css("width", (spacing * (max - 1)) + '%');
        $(".slider-right").css("width", (0) + '%');
        $(".slider-right").css("left", (0) + '%');
        sliderManager.sliderToolTipInit();
        //$(".sf-slider-tooltiptext").css("left", (spacing * (defaultVal - 1)) + '%');
    },
    /**
     * 알고리즘을 적용하였을때 슬라이더 모양 초기화
     * @param id
     * @param minVal
     * @param maxVal
     * @param nowDataNum 현재 시점을 나타내는 기준점
     */
    sliderInitForAlgo: function (id, minVal, maxVal, nowDataNum) {
        $("#" + id).slider({
            value: nowDataNum,
            min: minVal,
            max: maxVal,
            orientation: "horizontal",
            range: "min",
            animate: true,
        }).each(function() {
            $("label[name=slider_label]").each(function(){
                $(this).remove();
            });
            var opt = $(this).data().uiSlider.options;
            var vals = opt.max - opt.min;

            var startLabel = $('<label>'+(moment(sliderManager.totalDataList[0].time).format("HH:mm"))+'</label>').css('left',(0)+'%').attr("name", "slider_label");
            var middleLabel = $('<label>'+(moment(sliderManager.totalDataList[nowDataNum].time).format("HH:mm"))+'</label>').css('left',((nowDataNum)/vals*100)+'%').attr("name", "slider_label");
            var endLabel = $('<label>'+(moment(sliderManager.totalDataList[maxVal].time).format("HH:mm"))+'</label>').css('left',((maxVal)/vals*100)+'%').attr("name", "slider_label");
            $("#" + id).append(startLabel);
            $("#" + id).append(middleLabel);
            $("#" + id).append(endLabel);

        });
        const max = maxVal;
        const spacing = 100 / (maxVal - 1);
        //max로 개수 구하고 spacing 으로 칸 마다 거리 구함
        $("#" + id).find('.ui-slider-tick-mark').remove();
        $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * 0) + '%').appendTo($("#" + id));
        $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * (nowDataNum - 1)) + '%').appendTo($("#" + id));
        $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * (max - 1)) + '%').appendTo($("#" + id));
        $(".slider-left").css("width", (spacing * (nowDataNum - 1)) + '%');
        $(".slider-right").css("width", (100 - (spacing * (nowDataNum - 1))) + '%');
        $(".slider-right").css("left", (spacing * (nowDataNum - 1)) + '%');
        sliderManager.sliderToolTipInit();
    },

    /**
     * 값 표시 설정에서 설정되있는 체크박스 옵션을 가지고 파라미터 만드는 작업 진행
     * @param optionArr 값 표시 설정
     * @returns {{option: Array, data: Array}}
     */
    makeDataLoadParam: function (optionArr) {
        var params = {'option': [], 'data': []};
        for (var i in optionArr) {
            //{'option' : 4, 'data' : ['2018-02-01 15:00:00', 30, 7]}
            params['option'].push(optionArr[i]);
            params['data'].push({'option': optionArr[i], 'data': sliderManager.dataGetterFuncMap[optionArr[i]]()});
        }
        return params;
    },
    //##TODO : 화면에 나타나있는 DL_ID , subs_id 같은 여러 데이터들을 통합적으로 관리해주는 모듈이 필요할꺼같다.
    dataGetterFuncMap: {
        //형태는 optionIdx : function  //  return 형태는 Array // param 순서도 중요함
        4: function () {
            //time, data개수, dl_id 일단 시간은 설정시간에서 가져와야 하지만 일단은 고정, data개수는 default, dl_id는 단선도에서 가져와야되는데 현재는 고정
            //##TODO : 데이터 가져오는 부분을 전체적으로 변경해야함 현재는 일단 고정으로 해서 가져오도록 한다.
            /*
            const time = time.getData; //시간은 dateTimePicker에서 가져오도록 차후 수정
            const dataNum = 30;
            const dl_id = $("#dl_id").val(); //데이터를 가져오는 부분은 뭔가 잘 처리 나중에는
             */

            return [$("#global_setting_time").text(), 48, 7];
        },
    },
    algoDataPostProcessorMap: {
        'pqms': function (dataObj) {
            var predictOutput = dataObj.output;
            var originalOutput = dataObj.realOutput;
            var prd = [];//{'time' : [], 'load' : []};
            var org = [];//{'time' : [], 'load' : []};

            //시간 자르는 코드 yyyy-mm-dd HH:MM:SS ==> yyyy-mm-dd HH:MM 초 자른다. 반올림 하면 좋을꺼 같다.
            //부하값을 반올림한다.
            for (var i in predictOutput) {
                prd.push({'time' : moment(dataObj['time'][i]).format("YYYY-MM-DD HH:mm"), 'load' : parseFloat(predictOutput[i].toFixed(2))});
                //prd[i].time = moment(dataObj['time'][i]).format("YYYY-MM-DD HH:mm");
                //prd[i].load = parseFloat(predictOutput[i].toFixed(2));
                //console.log(predictOutput[i].load.toFixed(2));
            }
            for (var i in originalOutput) {
                org.push({'time' : moment(dataObj['time'][i]).format("YYYY-MM-DD HH:mm"), 'load' : parseFloat(originalOutput[i].toFixed(2))});
                //org[i].time = moment(dataObj['time'][i]).format("YYYY-MM-DD HH:mm");
                //org[i].load = parseFloat(originalOutput[i].toFixed(2));
                //console.log(originalOutput[i].load.toFixed(2));
            }
//배열에 객체형식으로 데이터가 있는걸 통채로 하나의 data로 봄
            var beforeData = {
                'pqmsPredictOutput': {'column': 'pqmsPredictOutput', 'data': prd},
                'pqmsOriginalOutput': {'column': 'pqmsOriginalOutput', 'data': org}
            };
            const dataMap = sliderManager.dataTimeSyncProcess(beforeData);
            //algo map은 그때그때 새로 만드는게 아니라 새로 추가되는 내용과 삭제되는 내용이 있는것이기 때문에 주의해야함
            //위에 선언된 맵에 dataMap의 키 값들을 집어넣어야 할 꺼 같다.
            return dataMap;
        },
        'pv' : function(dataObj){
            const dataArr = dataObj.body;
            var preProcessDataArr = [];
            for(var i in dataArr) {
                preProcessDataArr.push({'data' : parseFloat(parseFloat(dataArr[i].pred).toFixed(2))
                    ,'pv_id' :  dataArr[i].pv_id
                    ,'time' : moment(dataArr[i].time).format("YYYY-MM-DD HH:mm")});
            }
            var beforeTimeSyncData = {
                'pv' : {'column' : 'pv', 'data' : preProcessDataArr}
            };
            const dataMap = sliderManager.dataTimeSyncProcess(beforeTimeSyncData);
            return dataMap;
        },
        'sectionLoad' : function(dataArr){

            for (var key in dataArr) {
                for (var i in dataArr[key]) {
                    dataArr[key][i].time = moment(dataArr[key][i].time).format("YYYY-MM-DD HH:mm");
                }
            }
            var beforeTimeSyncData = sectionManager.testCalcSectionLoadByCurrent(dataArr);

            const dataMap = sliderManager.dataTimeSyncProcess(beforeTimeSyncData);
            return dataMap;
        }
    },
    getPqmsDataProcess : function(subs_id, dl_id, predDate, algoType){
        logContentManager.saveLogContent("algorithm", "pqms 알고리즘 요청", 1);
        progressManager.makeProgressObj("dl_grid_pqms_progress", $("#pqms_equipment_name").val() + " 단선도 PQMS 알고리즘 - 부하예측");
        progressManager.updateProgress("dl_grid_pqms_progress", 30);
        var callPqmsAlgoPromise = algorithmManager.callPQMSAlgorithm(subs_id, dl_id, predDate, algoType);
        callPqmsAlgoPromise.then(function (resolve) {

            //알고리즘 재요청일때 기존 데이터 처리
            sliderManager.cleanReAlgoReqData("pqmsPredictOutput");
            sliderManager.cleanReAlgoReqData("pqmsOriginalOutput");

            //pqms 알고리즘 요청시 해당 결과 데이터를 리스트화 해서 pqms차트 관리 객체에 저장
            const dataMap = sliderManager.algoDataPostProcessorMap['pqms'](resolve);
            sliderManager.algoOrgDataMap['pqms'] = sliderManager.makeDataListByTimeOrder(dataMap);
            pqms_plotly.dataList = sliderManager.algoOrgDataMap['pqms'];

            sliderManager.algoDataMap = sliderManager.mergeDataMap(sliderManager.algoDataMap, dataMap);
            sliderManager.mergeAndConverListDataMap();
            sliderManager.setSlider(sliderManager.sliderId);

            var nowDataNum = 0;
            for (var i in sliderManager.dataMap) {
                nowDataNum += 1;
            }

            const minVal = 0;
            const maxVal = sliderManager.totalDataList.length - 1;
            sliderManager.sliderInitForAlgo(sliderManager.sliderId, minVal, maxVal, nowDataNum);//id, defaultVal, minVal, maxVal, NowDataNum
            progressManager.updateProgress("dl_grid_pqms_progress", 100);
            progressManager.clearProgressMap("dl_grid_pqms_progress", 20);
            logContentManager.saveLogContent("algorithm", "pqms 알고리즘 요청 성공", 1);
            tableManager.initPqmsTableDataSet(dataMap);
            algoBtnManager.makeBtnAndAppend("PQMS결과");
            tableManager.createPQMSTable();
            algoBtnManager.showDraggableModal("pqms_popup_modal");
        }, function(reject){
            logContentManager.saveLogContent("algorithm", "pqms 알고리즘 실패", 1);
            progressManager.failProgress("dl_grid_pqms_progress");
            console.log('[Client] Extent Error Data : ', reject);
            console.log('Ajax Error!');
        });
    },
    getPvDataProcess : function(capacity, date, algoType, pv_id){
        logContentManager.saveLogContent("algorithm", "pv 알고리즘 요청", 1);
        progressManager.makeProgressObj("dl_grid_pv_progress",$("#pv_equipment_name").val() + " 단선도 PV 알고리즘 - 발전량 예측");
        progressManager.updateProgress("dl_grid_pv_progress", 30);
        const reqPVPromise = algorithmManager.callPVAlgorithm(capacity, date, algoType, pv_id);
        reqPVPromise.then(function(pvResolve){
            sliderManager.cleanReAlgoReqData("pv");
            const dataMap = sliderManager.algoDataPostProcessorMap['pv'](pvResolve);
            sliderManager.algoOrgDataMap['pv'] = sliderManager.makeDataListByTimeOrder(dataMap);
            pv_plotly.dataList = sliderManager.algoOrgDataMap['pv'];

            sliderManager.algoDataMap = sliderManager.mergeDataMap(sliderManager.algoDataMap, dataMap);
            sliderManager.mergeAndConverListDataMap();
            sliderManager.setSlider(sliderManager.sliderId);
            var nowDataNum = 0;
            for (var i in sliderManager.dataMap) {
                nowDataNum += 1;
            }
            const minVal = 0;
            const maxVal = sliderManager.totalDataList.length - 1;
            sliderManager.sliderInitForAlgo(sliderManager.sliderId, minVal, maxVal, nowDataNum);//id, defaultVal, minVal, maxVal, NowDataNum
            progressManager.updateProgress("dl_grid_pv_progress", 100);
            progressManager.clearProgressMap("dl_grid_pv_progress", 20);
            logContentManager.saveLogContent("algorithm", "pv 알고리즘 요청 성공", 1);
            tableManager.initPvTableDataSet(dataMap);
            algoBtnManager.makeBtnAndAppend("PV결과");
            tableManager.createPVTable();
            algoBtnManager.showDraggableModal("pv_popup_modal");
        }, function(reject){
            logContentManager.saveLogContent("algorithm", "pv 알고리즘 실패", 1);
            progressManager.failProgress("dl_grid_pv_progress");
            console.log('[Client] Extent Error Data : ', reject);
            console.log('Ajax Error!');
        });
    },
    getSectionLoadDataProcess : function(dl_id, date, algoType){
        logContentManager.saveLogContent("algorithm", "구간부하 알고리즘 요청", 1);
        progressManager.makeProgressObj("dl_grid_sectionLoad_progress",$("#sectionLoadEquipmentName").val() + " DL 구간부하 예측 알고리즘 - 부하 예측");
        progressManager.updateProgress("dl_grid_sectionLoad_progress", 30);
        const reqSectionLoadPromise = algorithmManager.callSectionLoadAlgorithm(dl_id, date, algoType);
        reqSectionLoadPromise.then(function(sectionLoadResolve){

            sliderManager.cleanReAlgoReqData("sectionLoad");
            const dataMap = sliderManager.algoDataPostProcessorMap['sectionLoad'](sectionLoadResolve);
            console.log(dataMap);
            sliderManager.algoOrgDataMap['sectionLoad'] = sliderManager.makeDataListByTimeOrder(dataMap);
            secion_load_plotly.setDataList(sliderManager.algoOrgDataMap['sectionLoad']);
            //secion_load_plotly.dataList = sliderManager.algoOrgDataMap['sectionLoad'];
            secion_load_plotly.redrawPlot();

            sliderManager.algoDataMap = sliderManager.mergeDataMap(sliderManager.algoDataMap, dataMap);
            sliderManager.mergeAndConverListDataMap();
            sliderManager.setSlider(sliderManager.sliderId);
            var nowDataNum = 0;
            for (var i in sliderManager.dataMap) {
                nowDataNum += 1;
            }
            const minVal = 0;
            const maxVal = sliderManager.totalDataList.length - 1;
            sliderManager.sliderInitForAlgo(sliderManager.sliderId, minVal, maxVal, nowDataNum);
            progressManager.updateProgress("dl_grid_sectionLoad_progress", 100);
            progressManager.clearProgressMap("dl_grid_sectionLoad_progress", 20);
            logContentManager.saveLogContent("algorithm", "구간 부하 예측 알고리즘 요청 성공", 1);

            tableManager.initSectionLoadTableDataSet(dataMap);
            // tableManager.initSectionLoadTableDataSet("null");
            algoBtnManager.makeBtnAndAppend("구간부하결과");
            $("#legendOneDiagram").show();
            $("#legendSimulation").hide();
            $("#legendSimulationLoad").show();
            tableManager.createSectionLoadTable();
            algoBtnManager.showDraggableModal("section_load_popup_modal");
        }, function(reject){
            logContentManager.saveLogContent("algorithm", "구간 부하 예측 알고리즘 실패", 1);
            progressManager.failProgress("dl_grid_sectionLoad_progress");
            console.log('[Client] Extent Error Data : ', reject);
            console.log('Ajax Error!');
        });
    },

    cleanReAlgoReqData : function(column){
        for (var key in sliderManager.algoDataMap) { //재요청 경우의 기존 데이터 처리
            if (sliderManager.algoDataMap[key].hasOwnProperty(column)) {
                delete sliderManager.algoDataMap[key][column];
            }
        }
        sliderManager.cleanAlgoDataMap(); //빈 시간 데이터 삭제
    },

    // { 시간 : {속성1 : 값, 속성2 : 값} 이런 형태인데  {시간 : {} }   이렇게 비어있는거 삭제
    cleanAlgoDataMap: function () {
        const obj = sliderManager.algoDataMap;
        for (var key in obj) {
            if (Object.keys(obj[key]).length === 0 && obj[key].constructor === Object) {
                delete obj[key];
            }
        }
    },

    mergeDataMap: function (mainDataMap, targetDataMap) {
        for (var timeKey in targetDataMap) {
            for (var columnKey in targetDataMap[timeKey]) {
                if (mainDataMap.hasOwnProperty(timeKey)) {
                    mainDataMap[timeKey][columnKey] = targetDataMap[timeKey][columnKey];
                } else {
                    mainDataMap[timeKey] = {};
                    mainDataMap[timeKey][columnKey] = targetDataMap[timeKey][columnKey];
                }

            }
        }
        return mainDataMap;
    },
    mergeAndConverListDataMap: function () {
        //키 값이 같은게 있는지 확인하고 없으면 그대로 추가 있으면 키 값 value에 key:value 추가
        //아래 코드 고치기
        //Map 단위에서 merge 한다음에 list로 만들어야된다.************************
        sliderManager.totalDataMap = {};
        var totalMap = sliderManager.totalDataMap;
        const dataMap = sliderManager.dataMap;
        const algoMap = sliderManager.algoDataMap;

        totalMap = sliderManager.mergeDataMap(totalMap, dataMap);
        totalMap = sliderManager.mergeDataMap(totalMap, algoMap);

        sliderManager.totalDataList = sliderManager.makeDataListByTimeOrder(totalMap);
        console.log(sliderManager.totalDataList);
    },
    sliderToggle: function (flag) { // sliderManager.sliderToggle(false);
        if (flag === true) {
            if (!$("#displayGis").is(":visible")) {
                $("#" + sliderManager.sliderId).css("display", "block").trigger("classChange");
                $("#slider-play").css("display", "block").trigger("classChange");
                $("#slider-stop").css("display", "none").trigger("classChange");
                $("#slider-current").css("display", "block").trigger("classChange");
                $("#slider-backward").css("display", "block").trigger("classChange");
                $("#slider-forward").css("display", "block").trigger("classChange");
                $("#PQMS결과").css("display", "block").trigger("classChange");
            }
        } else {
            $("#" + sliderManager.sliderId).css("display", "none").trigger("classChange");
            $("#slider-play").css("display", "none").trigger("classChange");
            $("#slider-stop").css("display", "none").trigger("classChange");
            $("#slider-current").css("display", "none").trigger("classChange");
            $("#slider-backward").css("display", "none").trigger("classChange");
            $("#slider-forward").css("display", "none").trigger("classChange");
            algoBtnManager.deleteBtn("PQMS결과");
            //$("#PQMS결과").css("display", "none").trigger("classChange");
        }
    },

    /**
     * slider 재생 효과
     * @param time 재생을 위한 슬라이더 값 추가 시간
     */
    controllSlderPlay : function(time) {
        const slider = $("#" + sliderManager.sliderId);
        const lastTickVal = $(slider).slider("option", "max");
        const tickVal = $(slider).slider("value");
        if (tickVal < lastTickVal) {
            //+1 하고 1초뒤 이거 함수 다시 실행
            $(slider).slider("value", (tickVal + 1));
            sliderManager.controllerTimeObj= setTimeout(function(){
                sliderManager.controllSlderPlay(time);
            }, time);
        }
        else{
            $("#slider-play").attr('data', "play");
            $("#slider-stop").hide();
            $("#slider-play").show();
        }
    },
    /**
     * 슬라이더 재생 효과 정지
     */
    controllSliderStop : function(){
        if (sliderManager.controllerTimeObj != null) {
            clearTimeout(sliderManager.controllerTimeObj);
        }
    },
    sliderControllSetTickCurrent : function(){
        console.log("slider controller set current tick");
        const currentTickVal = sliderManager.getCurrentSliderVal();
        console.log(currentTickVal);
        $("#" + sliderManager.sliderId).slider("value", currentTickVal);
    },
    sliderControllBackward : function(){
        $("#" + sliderManager.sliderId).slider("value", 0);
    },
    sliderControllForward : function(){
        const slider = $("#" + sliderManager.sliderId);
        $(slider).slider("value", $(slider).slider("option", "max"));
    },
    changePlayButtonStatus : function(){
        if( $("#slider-play").attr('data') === "play"){
            const slider = $("#" + sliderManager.sliderId);
            const lastTickVal = $(slider).slider("option", "max");
            const tickVal = $(slider).slider("value");
            if (tickVal == lastTickVal) {
                $(slider).slider("value", $(slider).slider("option", "min"));
            }
            sliderManager.controllSlderPlay(100);
            $("#slider-play").attr('data', "stop");
            $("#slider-play").hide();
            $("#slider-stop").show();
        }else{
            sliderManager.controllSliderStop();
            $("#slider-play").attr('data', "play");
            $("#slider-stop").hide();
            $("#slider-play").show();
        }

    },
    sliderControllerInit : function(){
        $("#slider-play").on("click", function(){sliderManager.changePlayButtonStatus();});
        $("#slider-stop").on("click", function(){sliderManager.changePlayButtonStatus();});
        $("#slider-current").on("click", function(){sliderManager.sliderControllSetTickCurrent();});
        $("#slider-backward").on("click", function(){sliderManager.sliderControllBackward();});
        $("#slider-forward").on("click", function(){sliderManager.sliderControllForward();});
    },

};
//뒤로가기 버튼
var buttonManager ={
    returnButton: function (flag) { // sliderManager.sliderToggle(false);
        if (flag === true) {
            if (!$("#displayGis").is(":visible")) {//단선도 모드이면 보인다
                    $("#return").css("display", "block").trigger("classChange");
                }
        }
        else { //모드가 아니면 안보인다
            $("#return").css("display", "none").trigger("classChange");
        }
    },
    // $("#refresh"): 시뮬레이션 초기화 버튼
    refreshButton:function(flag){
        if (flag === true) {
            if($("#modeChange").is(":checked")) {
                $("#refresh").css("display", "block").trigger("classChange");
            }
        }
        else {
            if(!$("#modeChange").is(":checked")) {
                $("#refresh").css("display", "none").trigger("classChange");
            }
        }
    }
}

var algoBtnManager = {

    btnMap : {}, // { column : 1

    /**
     * id에 해당하는 모달을 켜져있으면 끄고 꺼져있으면 킨다. 토글 그넫 드래그에이블 넣어놓음
     * @param id
     */
    showDraggableModal : function(id){
        $("#" + id).modal("show");
        $("#" + id).draggable({
            handle: ".modal-header"
        });
    },
    makeBtnAndAppend : function(column){
        if(algoBtnManager.btnMap.hasOwnProperty(column)) {
            return;
        } else {
            //모든 알고리즘 기본 버튼 동작
            var btn = $("<input type='button' class='btn btn-success' value='" + column + "'/>");
            $(btn).attr("id", column);
            algoBtnManager.btnMap[column] = 1; //##TODO : 차후에 뭔가 넣어주면 좋을게 생긴다면 넣어주자

            // 알고리즘 별 개별 함수 등록
            if (column == "PQMS결과") {

                $(btn).on("click", function(){
                    $("#pqms_popup_modal").modal("toggle");
                    $("#pqms_popup_modal").draggable({
                        handle: ".modal-header"
                    });
                });
            } else if(column == "PV결과") {
                $(btn).on("click", function(){
                    $("#pv_popup_modal").modal("toggle");
                    $("#pv_popup_modal").draggable({
                        handle: ".modal-header"
                    });
                });
            } else if(column == "구간부하결과") {
                $(btn).on("click", function(){
                    $("#section_load_popup_modal").modal("toggle");
                    $("#section_load_popup_modal").draggable({
                        handle: ".modal-header"
                    });
                });
            }

            $("#algo_result_show_btn_group").append(btn).trigger("classChange");
            $(btn).trigger("classChange");



        }
    },
    deleteBtn : function(column) {
        if(algoBtnManager.btnMap.hasOwnProperty(column)) {
            $("#" + column).remove();
            delete algoBtnManager.btnMap[column];
        }
    },
    clearBtnMap : function(){
        for (var key in algoBtnManager.btnMap) {
            //알고리즘 내용도 삭제하고 슬라이더도 초기화하고 하면 될 것 같다.
            sliderManager.algoDataMap = {};
            sliderManager.mergeAndConverListDataMap();
            sliderManager.setSlider(sliderManager.sliderId);
            algoBtnManager.deleteBtn(key);
        }
    }
};
algoBtnManager.clearBtnMap();

//초기화 작업
$(function(){

    sliderManager.sliderControllerInit();
    //pqms 알고리즘 결과 보여주는 모달안의 차트 초기화
     pqms_plotly.initPlot();
     pv_plotly.initPlot();
    secion_load_plotly.initPlot();




});


