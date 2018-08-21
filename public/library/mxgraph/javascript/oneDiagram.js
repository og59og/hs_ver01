

mxGraphDiagram = {
    codeMap: new HashMap(),
    subsMap: new HashMap(),
    mtrMap: new HashMap(),
    dlMap: new HashMap(),
    secMap: new HashMap(),
    swMap: new HashMap(),
    padMap: new HashMap(),
    mtrNodeMap: new HashMap(),
    //park
    grid: null,
    nodeMap: new HashMap(),
    lineMap: new HashMap(),
    directionPerDepth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    mainBranchPath: [],
    autoSwCode: ['CA', 'GA', 'PA', 'PROT_RA', 'RA_GAS_INS', 'OH2'],
    //park end

    subsDB: null,
    dbData: null,

    mtrKeys: null,
    dlKeys: null,

    check: "subs",
    before: null,

    subsId: null,
    mtrId: null,
    dlId: null,
    cbId: null,

    swKindArr: ["ALTS", "ASS", "CA", "CBT_GA", "COS", "DG", "DM", "DNP_MF", "DNP_MF 4", "DNP_MF_FP_4", "GA", "GS", "OH2", "PA", "PCA_GA", "PCA_RC", "PD", "PROT_RA", "RA_gas_ins", "RA_rb", "TR"],
    padArr: ["CNT_PA", "PA", "PCT_GA", "SIX_PAD", "MF_PAD", "MF PAD S", "PAD EX", "SIX PAD EX", "GPS_PAD", "CLS",
        "SMA_PAD", "PROT_GA", "PROT_RC", "ONE_GA", "ONE_RC", "DNP_MF 4", "DNP_MF 5", "DNP_MF 6", "DNP_MF_OP4", "DNP_MF_W4",
        "DNP_MF_W5", "DNP_MF_W6", "MF_OP4_IP", "PD", "SIX_PAD_M", "PAD EX BMS", "PAD BMS", "DNP_MF_HIF", "DER_MF_PAD_6",
        "DER_MF_PAD_5", "DER_MF_PAD_4", "DER_MF", "DNP_MF_FP_4"],
    startSW: null,
    drawSW: [],
    drawSwAuto: [],
    lastDepth: 0,
    lastDepthArr: [],
    swKeys: [],
    secKeys: [],
    swLevel: 1,
    flagDrawZero: 0,
    flagLevel: 1,
    nullParentId: null,

    graph: null,
    loadVisible: false,
    currentVisible: false,
    powerVisible: false,

    load : {
        original : null,
        pqms : null,
        pv : null,
        pqmsMinusPv : null,
        sectionLoad : null
    },
    callAlgorithmList : [],      // 요청 알고리즘 목록
    layerSection : []
};
diagramPosition = {
    x: 10,
    y: 235,
    w: 15,
    h: 15,
    line: 50,
    pad_w: 5,
    pad_h: 5,
    maxX: 0
};

var startGridX = 100, startGridY = 150; //그리드에 최초로 그려질 위치
var RIGHT = 1, LEFT = 2, UP = 4, DOWN = 8, NONE = 0;
var BASIC_DIRECTION = RIGHT;
var GRID_ARRAY_SIZE = 600, CELL_SIZE = 15;
var totalConflictCnt = 0;
var NO_CONFLICT = 0, CONFLICT = 1, ALL_CONFLICT = 10; //ALL_CONFLICT는 모든 방향이 충돌나는 경우임. 노드, 라인 다 지우고 상위로 올라가서 다시 그려야함.
var GRID_INDEX_OVER = -1;
var gridLayoutCallCnt = 0;
var gridMinX = Number.MAX_SAFE_INTEGER, gridMinY = Number.MAX_SAFE_INTEGER,
    gridMaxX = Number.MIN_SAFE_INTEGER, gridMaxY = Number.MIN_SAFE_INTEGER;

var dlArrInMTR = [];
var showDiagram;



/*  메인 오른쪽 상태정보 창에 정보 넣는 함수
 var objInfo = {
 type: "subs",
 value: [id, "SUBSTATION", no, name]
 };
 type은 subs, mtr, dl, sw로 구분
 value는 subs:[id, kind, no, name], mtr:[id, kind, bank_no], dl:[id, kind, no, name, cb, mtr, subs], sw: [id, kind, name, dl, mtr, subs], sec: [id, kind, sw_id_f, sw_id_b] */
var showInfoRightMenu = function (info) {
    if ($("tr[ name=trObjInfo]")) {
        $("tr[ name=trObjInfo]").remove();
    }
    if (!info.value) {
        return;
    }
    if (info.type) {
        $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>ID</td><td id='selected_object_id'>" + info.value[0] + "</td></tr>");
        $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>KIND</td><td id='selected_object_kind'>" + info.value[1] + "</td></tr>");
        if (info.type == "subs") {     // [id, kind, no, name]
            $("#objInfoTitle").text(info.value[3] + " 변전소");
            $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>NO</td><td>" + info.value[2] + "</td></tr>");
            $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>NAME</td><td>" + info.value[3] + "</td></tr>");
        } else if (info.type == "mtr") {     // [id, kind, bank_no]
            $("#objInfoTitle").text(info.value[0] + " 변압기");
            $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>BANK_NO</td><td>" + info.value[2] + "</td></tr>");
        } else if (info.type == "dl") {     // [id, kind, no, name, cb, mtr, subs]
            $("#objInfoTitle").text(info.value[3] + " DL");
            $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>NO</td><td>" + info.value[2] + "</td></tr>");
            $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>NAME</td><td>" + info.value[3] + "</td></tr>");
            $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>CB</td><td>" + info.value[4] + "</td></tr>");
            $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>MTR</td><td>" + info.value[5] + "</td></tr>");
            $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>SUBSTATION</td><td>" + info.value[6] + "</td></tr>");
        } else if (info.type == "sw") {     // [id, kind, dl, mtr, subs]
            $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>DL</td><td id='selected_object_'>" + info.value[2] + "</td></tr>");
            $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>MTR</td><td>" + info.value[3] + "</td></tr>");
            $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>SUBSTATION</td><td>" + info.value[4] + "</td></tr>");
            if(info.value[1] == "DG"){
                if(info.value[5]){
                    $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>세부 종류</td><td>" + info.value[5] + "</td></tr>");
                    $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>발전기 용량</td><td id='selected_object_capacity'>" + info.value[6] + "</td></tr>");
                }else{
                    $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>세부 종류</td><td>PV</td></tr>");
                }
            }
        } else if (info.type == "sec") {     // [id, kind, sw_id_f, sw_id_b]
            $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>FRONT SW</td><td>" + info.value[2] + "</td></tr>");
            $("#objInfoTable > tbody:last").append("<tr name='trObjInfo'><td>BACK SW</td><td>" + info.value[3] + "</td></tr>");
        }
    }
};

// 단선도, 시뮬레이션 모드 구분하는 함수
var separateMode = function(){
    var mode;
    if ($("#modeChange").is(":checked")) {   // true: 시뮬레이션 모드, false: 단선도 모드
        mode = simulator;
    } else {
        mode = mxGraphDiagram;
        if(mxGraphDiagram.check != "dl"){
            return;
        }
    }
    return mode;
};

var applySecFlowAnimation = function (load) {
    var mode = separateMode();
    var color;

    // 대평 dl(43)과 나머지 dl 구분(지금은 대평 dl만 구간 부하를 표현)
    if ((mode.dlId == 43 || mode.dlId == "43") && mode.load.sectionLoad && typeof load == "object"){
        var secLoad = load.load;
        if (secLoad >= 3.0) {
            color = "#FF0000";  // 빨강
        } else if (secLoad >= 1.7 && secLoad < 3.0) {
            color = "#FB8C00";  // 주황
        } else if (secLoad < 1.7) {
            color = "#0054FF"; // 파랑
        }
        var tmpSectionIdMap = {
            1: [1250, 1253, 1254, 1255, 1256, 22339],
            2: [22334, 25792, 1279],
            3: [1257, 1258, 1290, 1315, 1314, 1291, 1293, "1316_A"],
            4: [1259, 9914, 1273, 1268, 1266, 1267, 11500, 25987, 11501],
            5: [1294, 1295, 1297, 25328, 1298, 1300, 1302, 1301, 1310, "1303_A"],
            6: [1311, 1313, 1312, 1325, 25104, 1328, 1332, 25106, 25105, 1329, 1330],
            7: [2275, 2274, 2271, 25111, 2270, 2268, 2266, 25107, 25108, 25112, 25109, 25110, 2319, 2276, 11101]
        };
        if (load.sec === undefined) {
            return;
        }
        flowAnimation(tmpSectionIdMap[load.sec], color);
    }else {
        if(load != "pqms"){
            if (load >= 7000) {
                color = "#FF0000";  // 빨강
            } else if (load >= 5000 && load < 7000) {
                color = "#FB8C00";  // 주황
            } else if (load >= 3000 && load < 5000) {
                color = "#2F9D27"; // 초록
            } else if(load < 3000) {
                color = "#0054FF";  // 파랑
            }
            flowAnimation(mode.lineMap.keys(), color);
        }else{
            // color = "#6E6E6E"
        }

    }
};

var flowAnimation = function(keyArray, color){
    var mode = separateMode();
    var key, mxSec;
    for (var i = 0; i<keyArray.length; i++) {
        key = keyArray[i];
        if(!mode.lineMap.get(key)){
            continue;
        }else{
            mxSec = mode.lineMap.get(key).mxSec;
            state = mode.graph.view.getState(mxSec);
            if (state && state.shape.node.getElementsByTagName('path') && state.shape.node.getElementsByTagName('path')[0]) {
                state.shape.node.getElementsByTagName('path')[0].removeAttribute('visibility');
                state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke-width', '5');
                state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke', color);
                state.shape.node.getElementsByTagName('path')[1].setAttribute('class', 'flow');
            } else {
                if (state)
                    console.log('#############' + state.shape.node.getElementsByTagName('path') ? state.shape.node.getElementsByTagName('path') : '');
            }
        }
    }
};


//##TODO : 차후 알고리즘 등 키가 추가되면 여기서 관련 키에 대한 처리를 진행해줘야 한다.
//sec_load , pv , pqmsPredictOutput pqmsOriginalOutput
var showLoadLabel = function (labelData) {
    var mode = separateMode();
    var cb = mode.nodeMap.get(mode.cbId);

    if (labelData.hasOwnProperty("sec_load")) {
        var load = 0;
        for (var i in labelData["sec_load"]) {
            load += labelData["sec_load"][i].sec_load;
        }
        load = load.toFixed(2);
        const label = "실제 부하: " + load  + "KVA";
        mode.load.original = load;
        if (mxGraphDiagram.nodeMap.keys().length != 0) {
            try {
                if (cb && cb.mxSw) {
                    mode.graph.cellLabelChanged(cb.mxSw, label, false)
                }
            } catch (exception) {
                console.error("label error: ", exception);
            }
            applySecFlowAnimation(load);
        }
    }
    if (labelData.hasOwnProperty("pv")) {
        var output = labelData["pv"][0].data;
        const label = "발전량: " + output + "KVA";
        const pv_id = labelData["pv"][0].pv_id;
        mode.load.pv = output;

        if (mode.nodeMap.get(pv_id)) {
            mode.graph.cellLabelChanged(mode.nodeMap.get(pv_id).mxSw, label, false);
            if (mode.callAlgorithmList.indexOf("pqms") != -1) {
                mode.load.pqmsMinusPv = (mode.load.pqms - output).toFixed(2);
                const cbLabel = "예측부하: " + mode.load.pqms + "\n발전량고려부하: " + mode.load.pqmsMinusPv + "KVA";

                if (cb) {
                    mode.graph.cellLabelChanged(cb.mxSw, cbLabel, false);
                }
            }

            if (mode.callAlgorithmList.indexOf("sectionLoad") != -1) {
                applySecFlowAnimation(mode.load.sectionLoad);
            } else if(mode.callAlgorithmList.indexOf("pqms") != -1){
                applySecFlowAnimation(mode.load.pqmsMinusPv);
            } else {
                applySecFlowAnimation(mode.load.original);
            }
        }
    }

    if (labelData.hasOwnProperty("pqmsOriginalOutput") && labelData.hasOwnProperty("pqmsPredictOutput")) {
        // var orgLoad = labelData["pqmsOriginalOutput"][0].load;
        var prdLoad = labelData["pqmsPredictOutput"][0].load;
        // orgLoad = orgLoad.toFixed(2);
        prdLoad = prdLoad.toFixed(2);
        mode.load.pqms = prdLoad;
        var cbLabel;
        if(mode.callAlgorithmList.indexOf("pv") != -1){
            mode.load.pqmsMinusPv = (prdLoad - mode.load.pv).toFixed(2);
            cbLabel = "예측 부하: " + prdLoad + "\n발전량고려부하: " + mode.load.pqmsMinusPv + "KVA";
        }else{
            cbLabel = "예측 부하: " + prdLoad + "KVA";
        }
        const label = cbLabel;

        if (cb) {
            mode.graph.cellLabelChanged(cb.mxSw, label, false)
        }

        if(mode.callAlgorithmList.indexOf("pv") != -1){
            applySecFlowAnimation(mode.load.pqmsMinusPv);
        }
        /*else{
            applySecFlowAnimation(prdLoad);
        }*/
    }

    // 구간부하 알고리즘 요청
    if (labelData.hasOwnProperty("sec_1")) {
        var load = 0;
        var dl_load = 0;
        mode.load.sectionLoad = labelData;  // 구간부하 임시방편
        var dl_label = "PQMS 예측 부하: ";
        var label =    "구간 부하 합계: ";
        var totalLabel = "";
        for(var key in labelData){
            applySecFlowAnimation(labelData[key][0]);
            if (key.includes("sec")) {
                load += labelData[key][0].load;
            } else if(key == "pqmsPredictOutput"){
                dl_load += labelData[key][0].load;
            }
        }
        load = load.toFixed(4);
        if (dl_load != 0) {
            dl_load = dl_load / 1000;
            dl_load = dl_load.toFixed(4);
            dl_label = dl_label + dl_load + "MVA";
            label = label + load + "MVA";
            totalLabel = dl_label + "\n" + label;
        } else {
            label = label + load + "MVA";
            totalLabel = label;
        }
        //const totalLoadLabel = "전체 부하: " + load + freFix;
        if(cb && cb.mxSw){
            mode.graph.cellLabelChanged(cb.mxSw, totalLabel, false)
        }
        // mode.graph.model.isCellVisible(mode.layerSection);
        mode.graph.addCells(mode.layerSection);
    }
};

function callAnimation() {
    var mode = separateMode();
    var algorithmList = mode.callAlgorithmList;
    var loadData = mode.load;
    if(algorithmList.indexOf("sectionLoad") == -1){
        if(algorithmList.length == 0){
            applySecFlowAnimation(loadData.original);
        }else{
            if(algorithmList.indexOf("pv") != -1) {
                if (algorithmList.indexOf("pqms") != -1) {
                    applySecFlowAnimation(loadData.pqmsMinusPv);
                }
                else{
                    // applySecFlowAnimation("pqms");
                    applySecFlowAnimation(mode.load.original);
                }
            }else if(algorithmList.indexOf("pqms") != -1){
                applySecFlowAnimation(loadData.pqms);
            }else{
                console.log("else algorithm: ", mode.callAlgorithmList[0])
            }
        }
    }else{
        showLoadLabel(loadData.sectionLoad);
    }
}

$(function () {
    // 돌아가기 버튼 클릭, dl 단선도에서 이전 단선도로 이동
    $(document).on("click", "#return", function () {
        sliderManager.sliderToggle(false);
        if (mxGraphDiagram.check == "dl") {
            showDiagram("mtr");
            buttonManager.returnButton(true);
            toggleManager.toggleButton(false);
        } else {
            showDiagram("subs");
            buttonManager.returnButton(false);
            toggleManager.toggleButton(false);
        }
        //알고리즘 예측 결과 확인 버튼 삭제
        algoBtnManager.clearBtnMap();
    });

    // 확대 버튼(단선도/시뮬레이션 모드 구분)
    $("#plusBtn").on("click", function () {
        var mode = separateMode();
        if (!mode || !mode.graph){
            return;
        }
        if (mode.graph.view.scale > 2) {
            return;
        } else {
            mode.graph.zoomIn();
            callAnimation();
        }
    });

    // 축소 버튼(단선도/시뮬레이션 모드 구분)
    $("#minusBtn").on("click", function () {
        var mode = separateMode();
        if (!mode || !mode.graph){
            return;
        }
        if (mode.graph.view.scale <= 0.5) {
            return;
        } else {
            mode.graph.zoomOut();
            callAnimation();
        }
    });

    // ##TODO : 부하, 전류, 전압 라벨 표현하는 함수. 지금(6/23)은 안씀. 나중에 쓸 예정
    // $("input:checkbox[name='diagramInfo']").click(function () {
    //     var checkboxInfo = $(this).val();
    //     if (checkboxInfo == "load") {
    //         mxGraphDiagram.loadVisible = !mxGraphDiagram.loadVisible;
    //     } else if (checkboxInfo == "current") {
    //         mxGraphDiagram.currentVisible = !mxGraphDiagram.currentVisible;
    //     } else if (checkboxInfo == "power") {
    //         mxGraphDiagram.powerVisible = !mxGraphDiagram.powerVisible;
    //     }
    //     mxGraphDiagram.graph.refresh();
    // });


    // dl 그리기 전 초기화
    function valueInitialization(chk) {
        /* $("#return").remove();*/
        mxGraphDiagram.nodeMap.clear();
        mxGraphDiagram.subsMap.clear();
        mxGraphDiagram.mtrMap.clear();
        mxGraphDiagram.dlMap.clear();
        mxGraphDiagram.secMap.clear();
        mxGraphDiagram.swMap.clear();
        mxGraphDiagram.padMap.clear();

        if (chk != "subs" && chk != "mtr") {
            mxGraphDiagram.startSW = null;
            mxGraphDiagram.drawSW = [];
            mxGraphDiagram.drawSwAuto = [];
            mxGraphDiagram.lastDepth = 0;
            mxGraphDiagram.lastDepthArr = [];
            mxGraphDiagram.swKeys = [];
            mxGraphDiagram.secKeys = [];
            mxGraphDiagram.swLevel = 1;
            mxGraphDiagram.flagDrawZero = 0;
            mxGraphDiagram.flagLevel = 1;
            diagramPosition.x = 10;
            diagramPosition.y = 300;
            diagramPosition.maxX = 0;
        }
    }


    function drawDL(dl, isMtr) {
        var parent = mxGraphDiagram.graph.getDefaultParent();
        var width = $('#display').width(); //1125;
        var height = $('#display').height(); //570;

        if(mxGraphDiagram.dlId === 43){
            var sec_1 = mxGraphDiagram.graph.insertVertex(parent, "sec_1", null, 630, 245, 165, 50, "tmpSectionSec1");
            var sec_2 = mxGraphDiagram.graph.insertVertex(parent, "sec_2", null, 692, 290, 80, 50, "tmpSectionSec2");
            var sec_3 = mxGraphDiagram.graph.insertVertex(parent, "sec_3", null, 790, 190, 98, 105, "tmpSectionSec3");
            var sec_4 = mxGraphDiagram.graph.insertVertex(parent, "sec_4", null, 750, 290, 95, 220, "tmpSectionSec4");
            var sec_5 = mxGraphDiagram.graph.insertVertex(parent, "sec_5", null, 885, 200, 115, 140, "tmpSectionSec5");
            var sec_6 = mxGraphDiagram.graph.insertVertex(parent, "sec_6", null, 975, 235, 95, 180, "tmpSectionSec6");
            var sec_7 = mxGraphDiagram.graph.insertVertex(parent, "sec_7", null, 1060, 235, 215, 120, "tmpSectionSec7");
            mxGraphDiagram.layerSection.push(sec_1);
            mxGraphDiagram.layerSection.push(sec_2);
            mxGraphDiagram.layerSection.push(sec_3);
            mxGraphDiagram.layerSection.push(sec_4);
            mxGraphDiagram.layerSection.push(sec_5);
            mxGraphDiagram.layerSection.push(sec_6);
            mxGraphDiagram.layerSection.push(sec_7);
            mxGraphDiagram.graph.removeCells(mxGraphDiagram.layerSection);
        }

        // dl 단선도 그리는 부분
        //for (var i = 0; i < mxGraphDiagram.drawSW.length; i++) {
        for (var key in mxGraphDiagram.nodeMap.map) {
            //마지막 노드를 찾는다.
            var node = mxGraphDiagram.nodeMap.get(key);
            if (node.gridX == -1 || node.gridY == -1)
                continue;

            // 스위치 그리는 부분
            // mxGraphDiagram.graph.insertVertex(parent, 스위치 id , G, R 등 스위치에 보일 글자, x, y, 스위치 너비, 스위치 높이, 스위치 종류);
            //var symbol = mxGraphDiagram.graph.insertVertex(parent, mxGraphDiagram.drawSW[i][0], null, mxGraphDiagram.drawSW[i][1], mxGraphDiagram.drawSW[i][2], diagramPosition.w, diagramPosition.h, mxGraphDiagram.drawSW[i][3]);
            var symbol;
            if (!isMtr) {//dl
                if (node.sw_kind_code == 'DM') {
                    symbol = mxGraphDiagram.graph.insertVertex(parent, node.sw_id, null, node.gridX * CELL_SIZE - (gridMinX * CELL_SIZE) + (width / 2) - ((gridMaxX - gridMinX) * CELL_SIZE / 2) + 5, node.gridY * CELL_SIZE - (gridMinY * CELL_SIZE) + (height / 2) - ((gridMaxY - gridMinY) * CELL_SIZE / 2) + 5, 5, 5, node.sw_kind_code);
                } else {
                    symbol = mxGraphDiagram.graph.insertVertex(parent, node.sw_id, null, node.gridX * CELL_SIZE - (gridMinX * CELL_SIZE) + (width / 2) - ((gridMaxX - gridMinX) * CELL_SIZE / 2), node.gridY * CELL_SIZE - (gridMinY * CELL_SIZE) + (height / 2) - ((gridMaxY - gridMinY) * CELL_SIZE / 2), diagramPosition.w, diagramPosition.h, node.sw_kind_code);
                }
            } else {
                if (node.sw_kind_code == 'DM') {
                    symbol = mxGraphDiagram.graph.insertVertex(parent, node.sw_id, null, node.gridX * CELL_SIZE , node.gridY * CELL_SIZE , 5, 5, node.sw_kind_code);
                } else {
                    symbol = mxGraphDiagram.graph.insertVertex(parent, node.sw_id, null, node.gridX * CELL_SIZE , node.gridY * CELL_SIZE , diagramPosition.w, diagramPosition.h, node.sw_kind_code);
                }
            }
            $(symbol).prop("swId", node.sw_id);
            mxGraphDiagram.nodeMap.get(node.sw_id).mxSw = symbol;

            // 아래 6줄은 심볼 아래 전류, 전압 값을 표현하는 label을 그림
            var swCurrent = mxGraphDiagram.graph.insertVertex(symbol, "current", /*mxGraphDiagram.drawSW[i][0]*/'전류', 1, 1, 0, 0, "symbolInfoStyle", true);
            swCurrent.geometry.offset = new mxPoint(-30, 0);
            $(swCurrent).prop("customId", "current");
            var swPower = mxGraphDiagram.graph.insertVertex(symbol, "power", "power: " + /*mxGraphDiagram.drawSW[i][0]*/'전압', 1, 1, 0, 0, "symbolInfoStyle", true);
            swPower.geometry.offset = new mxPoint(-40, 10);
            $(swPower).prop("customId", "power");

            for (var key in mxGraphDiagram.lineMap.map) {
                var line = mxGraphDiagram.lineMap.get(key);

                //심볼을 node와 동일시하면 된다.
                if (line.sw_id_b == node.sw_id) {//라인의 자식쪽이 그려진 노드와 동일
                    line.mxBack = symbol;
                } else if (line.sw_id_f == node.sw_id) {//라인의 부모쪽이 그려진 노드와 동일
                    line.mxFront = symbol;
                }

                //라인에 부모쪽이 패드스위치인 경우
                if (line.isParentPad) {
                    //log('isParentPad == true line: f:' + line.parentNodePad.sw_id + ', b:' + );
                    //라인의 부모노드의 패드아이디와 현재 그려진 노드가 동일한 경우, 라인의 자식에 지금 그려진 노드를 잇는다.
                    if (line.parentNodePad.sw_id == node.sw_id) //라인의 부모쪽 패드와 그려진 노드가 동일한 경우
                        line.mxFront = symbol;
                    else if (node.isPadParent && node.padChild.hasOwnProperty(line.sw_id_f)) {//그려진 노드는 패드이고 그 안의 노드가 라인의 자식쪽과 일치하는지
                        line.mxFront = symbol;
                    }
                }

                //라인의 자식쪽이 패드스위치인 경우
                if (line.isChildPad) {
                    //라인의 자식노드의 패드아이디와 현재 그려진 노드가 동일한 경우, 라인의 부모쪽에 지금 그려진 노드를 잇는다.
                    if (line.childNodePad.sw_id == node.sw_id)// || mxGraphDiagram.nodeMap.get(line.childNodePad.sw_id).padChild.includes(node.sw_id) )
                        line.mxBack = symbol;
                    else if (node.isPadParent && node.padChild.hasOwnProperty(line.sw_id_b)) {
                        line.mxBack = symbol;
                    }
                }

            }

            // 스위치 연결 선을 그리는 부분
            //for (var i = 0; i < mxGraphDiagram.secKeys.length; i++) {
            for (var key in mxGraphDiagram.lineMap.map) {
                //마지막 노드를 찾는다.
                var line = mxGraphDiagram.lineMap.get(key);
                // mxGraphDiagram.graph.insertEdge(parent, 선로 id, 선로 text:null, 앞 스위치 symbol, 뒤 스위치 symbol, 선로 스타일:"lineStyle");
                //var sec = mxGraphDiagram.graph.insertEdge(parent, mxGraphDiagram.secMap.get(mxGraphDiagram.secKeys[i]).secId, null, mxGraphDiagram.secMap.get(mxGraphDiagram.secKeys[i]).mxFront, mxGraphDiagram.secMap.get(mxGraphDiagram.secKeys[i]).mxBack, "lineStyle");
                var sec = mxGraphDiagram.graph.insertEdge(parent, line.secId, null, line.mxFront, line.mxBack, "lineStyle");
                $(sec).prop("secId", line.secId);
                line.mxSec = sec;

                // 아래 3줄은 선로의 부하값을 표현하는 label을 그림
                var secLoad = mxGraphDiagram.graph.insertVertex(sec, "secLoad", line.secLoad, 1, 1, 0, 0, "childStyle", true);
                secLoad.geometry.offset = new mxPoint(-30, 0);
                $(secLoad).prop("customId", "secLoad");
            }

        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function mxMain2(container, animationFlag) {
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error("Browser is not supported!", 200, false);
        }
        else {
            sliderOnFlag = false;
            mxGraphHandler.prototype.guidesEnabled = true;
            mxGraphHandler.prototype.useGuidesForEvent = function (me) {
                return !mxEvent.isAltDown(me.getEvent());
            };
            if (mxEvent) {
                // mxEvent.disableContextMenu(container);
                mxEvent.disableContextMenu(container);
            } else {
                console.error('mxEvent is null');
            }
            container.style.width = "1372px";
            container.style.height = "690px";

            mxPopupMenu.prototype.submenuImage = "../library/mxgraph/javascript/src/images/menu.svg";

            mxGraphDiagram.graph = new mxGraph(container);

            // -(접기 아이콘) 비활성화
            mxGraphDiagram.graph.isCellFoldable = function (cell) {
                return false;
            };

            // 화면 드래그 가능
            mxGraphDiagram.graph.panningHandler.useLeftButtonForPanning = true;
            //mxGraphDiagram.graph.panningHandler.ignoreCell = false;
            mxGraphDiagram.graph.container.style.cursor = 'pointer';
            // 화면 드래그하면 선로 애니메이션 효과가 사라져서 mouseUp을 이용해서 선로 애니메이션 효과 유지. mouseDown, mouseMove, mouseUp 세개 다 있어야 함
            mxGraphDiagram.graph.addMouseListener({
                mouseDown: function (sender, evt) {
                    mxGraphDiagram.graph.container.style.cursor = 'move';
                },
                mouseMove: function (sender, evt) {
                    //mxGraphDiagram.graph.container.style.cursor = 'move';
                },
                mouseUp: function (sender, evt) {
                    mxGraphDiagram.graph.container.style.cursor = 'crosshair';
                    if (mxGraphDiagram.check == "dl") {
                        callAnimation();
                    }
                }
            });

            mxGraphDiagram.graph.container.style.cursor = "crosshair";
            mxGraphDiagram.graph.setPanning(true);
            mxEdgeHandler.prototype.snapToTerminals = true;

            mxGraphDiagram.graph.setTooltips(false);
            mxGraphDiagram.graph.setConnectable(true);

            mxGraphDiagram.graph.centerZoom = false;

            mxGraphDiagram.graph.setEnabled(true);

            mxGraphDiagram.graph.isCellEditable = function (cell) {
                return false;
            };
            mxGraphDiagram.graph.isCellMovable = function (cell) {
                return false;
            };
            mxGraphDiagram.graph.isCellResizable = function (cell) {
                return false;
            };
            mxGraphDiagram.graph.isCellBendable = function (cell) {
                return false;
            };
            mxGraphDiagram.graph.isLabelMovable = function (cell) {
                return false;
            };
            mxGraphDiagram.graph.isTerminalPointMovable = function (cell) {
                return false;
            };
            mxGraphDiagram.graph.isCellDisconnectable = function (cell) {
                return false;
            };

            mxVertexHandler.prototype.getSelectionColor = function () {
                return "#D9418C";
            };
            mxVertexHandler.prototype.getSelectionStrokeWidth = function () {
                return 2;
            };
            mxEdgeHandler.prototype.getSelectionColor = function () {
                return "#D9418C";
            };
            mxEdgeHandler.prototype.getSelectionStrokeWidth = function () {
                return 2;
            };

            mxGraphDiagram.graph.isCellVisible = function (cell) {
                if (cell.customId == "secLoad") {
                    return !this.model.isVertex(cell) || cell.geometry == null || !cell.geometry.relative
                        || cell.geometry.relative == mxGraphDiagram.loadVisible;
                } else if (cell.customId == "current") {
                    return !this.model.isVertex(cell) || cell.geometry == null || !cell.geometry.relative
                        || cell.geometry.relative == mxGraphDiagram.currentVisible;
                } else if (cell.customId == "power") {
                    return !this.model.isVertex(cell) || cell.geometry == null || !cell.geometry.relative
                        || cell.geometry.relative == mxGraphDiagram.powerVisible;
                } else {
                    return !this.model.isVertex(cell) || cell.geometry == null || !cell.geometry.relative
                        || cell.geometry.relative == true;
                }
            };

            // 팝업메뉴
            mxGraphDiagram.graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
                return click_menu(mxGraphDiagram.graph, menu, cell, evt);
            };

            // scroll bar
            mxGraphDiagram.graph.scrollTileSize = new mxRectangle(0, 0, 400, 400);
            mxGraphDiagram.graph.getPagePadding = function () {
                return new mxPoint(Math.max(0, Math.round(mxGraphDiagram.graph.container.offsetWidth - 34)),
                    Math.max(0, Math.round(mxGraphDiagram.graph.container.offsetHeight - 34)));
            };
            mxGraphDiagram.graph.getPageSize = function () {
                return (this.pageVisible) ? new mxRectangle(0, 0, this.pageFormat.width * this.pageScale,
                    this.pageFormat.height * this.pageScale) : this.scrollTileSize;
            };
            mxGraphDiagram.graph.getPageLayout = function () {
                var size = (this.pageVisible) ? this.getPageSize() : this.scrollTileSize;
                var bounds = this.getGraphBounds();

                if (bounds.width == 0 || bounds.height == 0) {
                    return new mxRectangle(0, 0, 1, 1);
                }
                else {
                    // Computes untransformed graph bounds
                    var x = Math.ceil(bounds.x / this.view.scale - this.view.translate.x);
                    var y = Math.ceil(bounds.y / this.view.scale - this.view.translate.y);
                    var w = Math.floor(bounds.width / this.view.scale);
                    var h = Math.floor(bounds.height / this.view.scale);

                    var x0 = Math.floor(x / size.width);
                    var y0 = Math.floor(y / size.height);
                    var w0 = Math.ceil((x + w) / size.width) - x0;
                    var h0 = Math.ceil((y + h) / size.height) - y0;

                    return new mxRectangle(x0, y0, w0, h0);
                }
            };
            new mxRubberband(mxGraphDiagram.graph);
            configureStylesheet(mxGraphDiagram.graph);
            var parent = mxGraphDiagram.graph.getDefaultParent();
            mxGraphDiagram.graph.getModel().beginUpdate();

            try {
                // DL
                if (mxGraphDiagram.check == 'subs') {
                    // mtr, subs
                    var x = 200;
                    var y = 0;
                    // var y2 = 0;
                    var mtrKey, dlKey;
                    var subsPosition = ((25 * mxGraphDiagram.dlMap.size()) + (20 * mxGraphDiagram.mtrMap.size())) / 2;
                    var substation = mxGraphDiagram.graph.insertVertex(parent, mxGraphDiagram.subsId, 'S/S', 30, subsPosition, 35, 35, 'SUBSTATION');

                    for (var i = 0; i < mxGraphDiagram.mtrKeys.length; i++) {
                        mtrKey = mxGraphDiagram.mtrKeys[i];
                        var dlSize = mxGraphDiagram.mtrMap.get(mtrKey).dlId.length;
                        var tttttttttttt = 25 * dlSize / 2;
                        var mtr = mxGraphDiagram.graph.insertVertex(parent, mtrKey, mtrKey, 100, y + tttttttttttt, 40, 30, 'MTR');
                        mxGraphDiagram.mtrMap.get(mtrKey).mxMtr = mtr;
                        for (var j = 0; j < dlSize; j++) {
                            dlKey = mxGraphDiagram.mtrMap.get(mtrKey).dlId[j];
                            var dl = mxGraphDiagram.graph.insertVertex(parent, dlKey, dlKey, x, y, 25, 25, 'DL');
                            mxGraphDiagram.dlMap.get(dlKey).mxDL = dl;
                            y = y + 25;
                            var mtrDlEdge = mxGraphDiagram.graph.insertEdge(parent, null, null, mxGraphDiagram.mtrMap.get(mtrKey).mxMtr, dl, 'lineStyle');
                        }
                        y = y + 20;
                        var subsMtrEdge = mxGraphDiagram.graph.insertEdge(parent, null, null, substation, mtr, 'lineStyle');
                        x = 200
                    }
                } else if (mxGraphDiagram.check == 'mtr') {
                    var x = 50;
                    var y = 70;
                    var y2 = 0;
                    var mtrKey, dlKey;

                    for (var i = 0; i < mxGraphDiagram.mtrKeys.length; i++) {
                        mtrKey = mxGraphDiagram.mtrKeys[i];
                        var testVertex2 = mxGraphDiagram.graph.insertVertex(parent, mtrKey, mtrKey, x, y, 40, 30, 'MTR');
                        mxGraphDiagram.mtrMap.get(mtrKey).mxMtr = testVertex2;
                        y = y + 100;
                        x = x + 80;
                        for (var j = 0; j < mxGraphDiagram.mtrMap.get(mtrKey).dlId.length; j++) {
                            var dl = mxGraphDiagram.mtrMap.get(mtrKey).dlId[j];
                            var testVertex3 = mxGraphDiagram.graph.insertVertex(parent, dl, dl, x, y2, 30, 30, 'DL');
                            mxGraphDiagram.dlMap.get(dl).mxDL = testVertex3;
                            y2 = y2 + 25;
                            var testEdge2 = mxGraphDiagram.graph.insertEdge(parent, null, null, mxGraphDiagram.mtrMap.get(mtrKey).mxMtr, testVertex3, 'lineStyle');
                        }
                        y2 = y2 + 10;
                        x = x - 80;
                    }
                } else if (mxGraphDiagram.check == 'dl') {
                    drawDL();
                }
                // 노주희
               /* else if (mxGraphDiagram.check == 'dl') {
                    //var v1 = mxGraphDiagram.graph.insertVertex(parent, null,'Hello,', (width/2) - (gridMaxX / 2),   (height/2) - (gridMaxY / 2) ,  (gridMaxX - gridMinX)* 15, (gridMaxY - gridMinY)* 15);
                    //console.log('###### MIN ('+ gridMinX + ',' + gridMinY  + '), MAX ('+gridMaxX+','+gridMaxY+ ')');
                    // dl 단선도 그리는 부분
                    //for (var i = 0; i < mxGraphDiagram.drawSW.length; i++) {
                    for (var key in mxGraphDiagram.nodeMap.map) {
                        //마지막 노드를 찾는다.
                        var node = mxGraphDiagram.nodeMap.get(key);
                        // if (node.gridX == -1 || node.gridY == -1)
                        //     continue;

                        // 스위치 그리는 부분
                        // mxGraphDiagram.graph.insertVertex(parent, 스위치 id , G, R 등 스위치에 보일 글자, x, y, 스위치 너비, 스위치 높이, 스위치 종류);
                        //var symbol = mxGraphDiagram.graph.insertVertex(parent, mxGraphDiagram.drawSW[i][0], null, mxGraphDiagram.drawSW[i][1], mxGraphDiagram.drawSW[i][2], diagramPosition.w, diagramPosition.h, mxGraphDiagram.drawSW[i][3]);
                        var symbol;
                        if (!key.includes("pad")) {
                            if (node.sw_kind_code == 'DM') {
                                symbol = mxGraphDiagram.graph.insertVertex(parent, node.sw_id, null, node.gridX * CELL_SIZE - (gridMinX * CELL_SIZE) + (width / 2) - ((gridMaxX - gridMinX) * CELL_SIZE / 2) + 5, node.gridY * CELL_SIZE - (gridMinY * CELL_SIZE) + (height / 2) - ((gridMaxY - gridMinY) * CELL_SIZE / 2) + 5, 5, 5, node.sw_kind_code);
                                $(symbol).prop("swId", node.sw_id);
                                mxGraphDiagram.nodeMap.get(node.sw_id).mxSw = symbol;
                            } else {
                                // symbol = mxGraphDiagram.graph.insertVertex(parent, node.sw_id, null, node.gridX * CELL_SIZE - (gridMinX * CELL_SIZE) + (width / 2) - ((gridMaxX - gridMinX) * CELL_SIZE / 2), node.gridY * CELL_SIZE - (gridMinY * CELL_SIZE) + (height / 2) - ((gridMaxY - gridMinY) * CELL_SIZE / 2), diagramPosition.w, diagramPosition.h, node.sw_kind_code);

                                if (node.isPadParent || node.isPadChild) {
                                    var padArr = [];
                                    for (var padId in node.padNode.padChild) {
                                        padArr.push(padId);
                                    }

                                    var pad = node.padNode;
                                    var x = pad.gridX * CELL_SIZE - (gridMinX * CELL_SIZE) + (width / 2) - ((gridMaxX - gridMinX) * CELL_SIZE / 2);
                                    var y = pad.gridY * CELL_SIZE - (gridMinY * CELL_SIZE) + (height / 2) - ((gridMaxY - gridMinY) * CELL_SIZE / 2);
                                    var w = diagramPosition.w;
                                    var h = diagramPosition.h;


                                    if(padArr.length == 2){
                                        var sw1 = padArr[0];
                                        var sw2= padArr[1];

                                        symbol = mxGraphDiagram.graph.insertVertex(parent, sw1, "1", x, y, w, h, node.sw_kind_code);
                                        $(symbol).prop("swId", sw1);
                                        mxGraphDiagram.nodeMap.get(sw1).mxSw = symbol;

                                        symbol = mxGraphDiagram.graph.insertVertex(parent, sw2, "2", x + w, y, w, h, node.sw_kind_code);
                                        $(symbol).prop("swId", sw2);
                                        mxGraphDiagram.nodeMap.get(sw2).mxSw = symbol;
                                    } else if(padArr.length == 3){

                                        var sw1 = padArr[0];
                                        var sw2= padArr[1];
                                        var sw3= padArr[2];

                                        symbol = mxGraphDiagram.graph.insertVertex(parent, sw1, "1", x, y, w, h, node.sw_kind_code);
                                        $(symbol).prop("swId", sw1);
                                        mxGraphDiagram.nodeMap.get(sw1).mxSw = symbol;

                                        symbol = mxGraphDiagram.graph.insertVertex(parent, sw2, "2", x + w, y, w, h, node.sw_kind_code);
                                        $(symbol).prop("swId", sw2);
                                        mxGraphDiagram.nodeMap.get(sw2).mxSw = symbol;

                                        symbol = mxGraphDiagram.graph.insertVertex(parent, sw3, "3", x, y + h, w, h, node.sw_kind_code);
                                        $(symbol).prop("swId", sw3);
                                        mxGraphDiagram.nodeMap.get(sw3).mxSw = symbol;

                                    } else if(padArr.length == 4){
                                        var sw1 = padArr[0];
                                        var sw2= padArr[1];
                                        var sw3= padArr[2];
                                        var sw4= padArr[3];

                                        symbol = mxGraphDiagram.graph.insertVertex(parent, sw1, "1", x, y, w, h, node.sw_kind_code);
                                        $(symbol).prop("swId", sw1);
                                        mxGraphDiagram.nodeMap.get(sw1).mxSw = symbol;

                                        symbol = mxGraphDiagram.graph.insertVertex(parent, sw2, "2", x + w, y, w, h, node.sw_kind_code);
                                        $(symbol).prop("swId", sw2);
                                        mxGraphDiagram.nodeMap.get(sw2).mxSw = symbol;

                                        symbol = mxGraphDiagram.graph.insertVertex(parent, sw3, "3", x, y + h, w, h, node.sw_kind_code);
                                        $(symbol).prop("swId", sw3);
                                        mxGraphDiagram.nodeMap.get(sw3).mxSw = symbol;

                                        symbol = mxGraphDiagram.graph.insertVertex(parent, sw4, "4", x + w, y + h, w, h, node.sw_kind_code);
                                        $(symbol).prop("swId", sw4);
                                        mxGraphDiagram.nodeMap.get(sw4).mxSw = symbol;
                                    }

                                } else {
                                    symbol = mxGraphDiagram.graph.insertVertex(parent, node.sw_id, null, node.gridX * CELL_SIZE - (gridMinX * CELL_SIZE) + (width / 2) - ((gridMaxX - gridMinX) * CELL_SIZE / 2), node.gridY * CELL_SIZE - (gridMinY * CELL_SIZE) + (height / 2) - ((gridMaxY - gridMinY) * CELL_SIZE / 2), diagramPosition.w, diagramPosition.h, node.sw_kind_code);
                                    $(symbol).prop("swId", node.sw_id);
                                    mxGraphDiagram.nodeMap.get(node.sw_id).mxSw = symbol;
                                }
                            }
                        } else {
                            continue;
                        }


                        // 아래 6줄은 심볼 아래 전류, 전압 값을 표현하는 label을 그림
                        var swCurrent = mxGraphDiagram.graph.insertVertex(symbol, "current", /!*mxGraphDiagram.drawSW[i][0]*!/'전류', 1, 1, 0, 0, "symbolInfoStyle", true);
                        swCurrent.geometry.offset = new mxPoint(-30, 0);
                        $(swCurrent).prop("customId", "current");
                        var swPower = mxGraphDiagram.graph.insertVertex(symbol, "power", "power: " + /!*mxGraphDiagram.drawSW[i][0]*!/'전압', 1, 1, 0, 0, "symbolInfoStyle", true);
                        swPower.geometry.offset = new mxPoint(-40, 10);
                        $(swPower).prop("customId", "power");
                        log('#### node sw_id:' + node.sw_id);
                        for (var key in mxGraphDiagram.lineMap.map) {
                            var line = mxGraphDiagram.lineMap.get(key);

                            //심볼을 node와 동일시하면 된다.
                            if (line.sw_id_b == node.sw_id) {//라인의 자식쪽이 그려진 노드와 동일
                                line.mxBack = symbol;
                            } else if (line.sw_id_f == node.sw_id) {//라인의 부모쪽이 그려진 노드와 동일
                                line.mxFront = symbol;
                            }

                            //라인에 부모쪽이 패드스위치인 경우
                            if (line.isParentPad) {
                                //log('isParentPad == true line: f:' + line.parentNodePad.sw_id + ', b:' + );
                                //라인의 부모노드의 패드아이디와 현재 그려진 노드가 동일한 경우, 라인의 자식에 지금 그려진 노드를 잇는다.
                                if (line.parentNodePad.sw_id == node.sw_id) //라인의 부모쪽 패드와 그려진 노드가 동일한 경우
                                    line.mxFront = symbol;
                                else if (node.isPadParent && node.padChild.hasOwnProperty(line.sw_id_f)) {//그려진 노드는 패드이고 그 안의 노드가 라인의 자식쪽과 일치하는지
                                    line.mxFront = symbol;
                                }
                            }

                            //라인의 자식쪽이 패드스위치인 경우
                            if (line.isChildPad) {
                                //라인의 자식노드의 패드아이디와 현재 그려진 노드가 동일한 경우, 라인의 부모쪽에 지금 그려진 노드를 잇는다.
                                if (line.childNodePad.sw_id == node.sw_id)// || mxGraphDiagram.nodeMap.get(line.childNodePad.sw_id).padChild.includes(node.sw_id) )
                                    line.mxBack = symbol;
                                else if (node.isPadParent && node.padChild.hasOwnProperty(line.sw_id_b)) {
                                    line.mxBack = symbol;
                                }
                            }
                            // var line = mxGraphDiagram.lineMap.get(key);
                            // if (line.sw_id_b == node.sw_id) {
                            //     line.mxBack = symbol;
                            // }
                            // if (line.sw_id_f == node.sw_id) {
                            //     line.mxFront = symbol;
                            // }
                        }

                    }

                    // 스위치 연결 선을 그리는 부분
                    //for (var i = 0; i < mxGraphDiagram.secKeys.length; i++) {
                    for (var key in mxGraphDiagram.lineMap.map) {
                        //마지막 노드를 찾는다.
                        var line = mxGraphDiagram.lineMap.get(key);
                        // mxGraphDiagram.graph.insertEdge(parent, 선로 id, 선로 text:null, 앞 스위치 symbol, 뒤 스위치 symbol, 선로 스타일:"lineStyle");
                        //var sec = mxGraphDiagram.graph.insertEdge(parent, mxGraphDiagram.secMap.get(mxGraphDiagram.secKeys[i]).secId, null, mxGraphDiagram.secMap.get(mxGraphDiagram.secKeys[i]).mxFront, mxGraphDiagram.secMap.get(mxGraphDiagram.secKeys[i]).mxBack, "lineStyle");
                        var sec = mxGraphDiagram.graph.insertEdge(parent, line.secId, null, line.mxFront, line.mxBack, "lineStyle");
                        $(sec).prop("secId", line.secId);
                        line.mxSec = sec;

                        // 아래 3줄은 선로의 부하값을 표현하는 label을 그림
                        var secLoad = mxGraphDiagram.graph.insertVertex(sec, "secLoad", line.secLoad, 1, 1, 0, 0, "childStyle", true);
                        secLoad.geometry.offset = new mxPoint(-30, 0);
                        $(secLoad).prop("customId", "secLoad");
                    }
                }*/

            }
            finally {
                mxGraphDiagram.graph.getModel().endUpdate();
                // 단선도가 그려지기 전에 부하값표현하는 showLoadLabel() 함수가 호출되어 단선도가 그려진 후에 애니메이션 효과가 바로 적용이 안돼서 사용함
                // 슬라이더를 움직여서 애니메이션 효과가 나타나게 한다.
                sliderOnFlag = true
                await sleep(500);
                var timeSliderVal = $("#timeSlider").slider("option", "value");
                $("#timeSlider").slider("option", "value", timeSliderVal - 1);
                $("#timeSlider").slider("option", "value", timeSliderVal);

            }



            // if (mxGraphDiagram.check == "dl") {
            //     applySecFlowAnimation(9500);
            // }

            // DL 더블 클릭 시 1개 DL 그림으로 변경
            // mxGraphDiagram.graph.addListener(mxEvent.DOUBLE_CLICK, function (sender, evt) {
            //     var cell = evt.getProperty('cell');
            //     if (!cell || !cell.vertex) {
            //         return;
            //     } else if (cell.vertex && cell.style == 'DL') {
            //         $("input:checkbox[name='diagramInfo']").show();
            //         $(".oneDiagramLabel").show();
            //         getDL(cell.id);
            //     } else {
            //         $("#mxGraphModal").modal();
            //         $("#mxGraphInfoTitle").text(cell.id + "의 정보");
            //         $("#tdIdInfo").text(cell.id);
            //
            //         if ($("tr[ name=trObjInfo]")) {
            //             $("tr[ name=trObjInfo]").remove();
            //         }
            //
            //         if (cell.style == "SUBSTATION") {
            //             $("#tdKindInfo").text(cell.style);
            //             $("#tableObjInfo > tbody:last").append("<tr name='trObjInfo'><td>NO</td><td>" + mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsNo + "</td></tr>");
            //             $("#tableObjInfo > tbody:last").append("<tr name='trObjInfo'><td>NAME</td><td>" + mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsName + "</td></tr>");
            //         } else if (cell.style == "MTR") {
            //             $("#tdKindInfo").text(cell.style);
            //             $("#tableObjInfo > tbody:last").append("<tr name='trObjInfo'><td>NO</td><td>" + mxGraphDiagram.mtrMap.get(cell.id).bankNo + "</td></tr>");
            //         } else {
            //             // $("#tdKindInfo").text(mxGraphDiagram.nodeMap.get(cell.id).sw_kind_code);
            //             // $("#tableObjInfo > tbody:last").append("<tr name='trObjInfo'><td>DL</td><td>" + mxGraphDiagram.dlId + "</td></tr>");
            //             // $("#tableObjInfo > tbody:last").append("<tr name='trObjInfo'><td>MTR</td><td>" + mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).mtrId + "</td></tr>");
            //             // $("#tableObjInfo > tbody:last").append("<tr name='trObjInfo'><td>SUBSTATION</td><td>" + mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).subsId + "</td></tr>");
            //             if (!mxGraphDiagram.nodeMap.get(cell.id))
            //                 console.log(1);
            //             var objInfo = {
            //                 type: "sw",
            //                 value: [cell.id, cell.style, mxGraphDiagram.nodeMap.get(cell.id).sw_name, mxGraphDiagram.dlId, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).mtrId, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).subsId]
            //             };
            //             showInfoRightMenu(objInfo);
            //         }
            //     }
            //     evt.consume();
            // });
            mxGraphDiagram.graph.addListener(mxEvent.DOUBLE_CLICK, function (sender, evt) {
                var cell = evt.getProperty("cell");
                var objInfo;
                if (cell && cell.vertex) {
                    if (cell.style == "DL") {
                        sliderManager.sliderToggle(true);
                        $("#selectObjectInfo").text(mxGraphDiagram.dlMap.get(cell.id).dlName);
                        $("#substnm").val(mxGraphDiagram.dlMap.get(cell.id).dlName);
                        mxGraphDiagram.dlId = cell.id;
                        mxGraphDiagram.cbId = mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).cbId;
                        mxGraphDiagram.mtrId = mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).mtrId;
                        mainObj.makeShowValueOptionTable().then(function (resolve) {
                            mainObj.checkShowValueOptionAndSetSlider();
                        });
                        showDiagram(cell.id);
                    } else if (cell.style == "SUBSTATION") {
                        sliderManager.sliderToggle(false);
                        objInfo = {
                            type: "subs",
                            value: [cell.id, cell.style, mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsNo, mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsName]
                        };
                        showInfoRightMenu(objInfo);
                    } else if (cell.style == "MTR") {
                        sliderManager.sliderToggle(false);
                        $("#selectObjectInfo").text(cell.value);
                        $("#substnm").val(cell.value);
                        mxGraphDiagram.mtrId = cell.value;
                        showDiagram("mtr");
                    } else {
                        sliderManager.sliderToggle(false);
                        // $("#substnm").val(cell.value);
                        //sw: [id, kind, dl, mtr, subs]
                        objInfo = {
                            type: "sw",
                            value: [cell.id, cell.style, mxGraphDiagram.dlId, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).mtrId, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).subsId]
                        };
                        showInfoRightMenu(objInfo);
                    }

                } else {
                    return;
                }

                evt.consume();
            });

            // Object click event
            mxGraphDiagram.graph.addListener(mxEvent.CLICK, function (sender, evt) {
                var cell = evt.getProperty("cell");
                var objInfo;
                var dl = mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId);
                if (cell && cell.vertex) {
                    if (cell.style == "DL") {

                        $("#selectObjectInfo").text(mxGraphDiagram.dlMap.get(cell.id).dlName);
                        mxGraphDiagram.dlId = cell.id;
                        mxGraphDiagram.cbId = dl.cbId;
                        mxGraphDiagram.mtrId = dl.mtrId;
                        objInfo = {
                            type: "dl",
                            value: [mxGraphDiagram.dlId, "DL", dl.dlNo, dl.dlName, dl.cbId,
                                dl.mtrId, dl.subsId]
                        };
                        $("#substnm").val(dl.dlName);
                        showInfoRightMenu(objInfo);
                    } else if (cell.style == "SUBSTATION") {
                        objInfo = {
                            type: "subs",
                            value: [cell.id, cell.style, mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsNo, mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsName]
                        };
                        $("#substnm").val(mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsName);
                        showInfoRightMenu(objInfo);
                    } else if (cell.style == "MTR") {
                        mxGraphDiagram.mtrId = cell.value;
                        objInfo = {
                            type: "mtr",
                            value: [cell.value, cell.style, mxGraphDiagram.mtrMap.get(cell.value).bankNo]
                        };
                        $("#substnm").val(cell.value);
                        showInfoRightMenu(objInfo);
                    } else {
                        // sliderManager.sliderToggle(false);
                        if (typeof cell.id === 'string' && cell.id.includes('pad')) {
                            var c = mxGraphDiagram.nodeMap.get(cell.id).padChild;
                            var name = '',isFirst = true;
                            for (var key in c) {
                                var pd = c[key];
                                name += (isFirst  ? '' : ',') + pd.sw_name;
                                isFirst = false;
                            }
                            $("#substnm").val(name);
                        } else {
                            $("#substnm").val(mxGraphDiagram.nodeMap.get(cell.swId).sw_name);
                        }

                        objInfo = {
                            type: "sw",
                            value: [cell.swId, cell.style, mxGraphDiagram.dlId, dl.mtrId, dl.subsId]
                        };

                        showInfoRightMenu(objInfo);
                    }
                    algorithmTabmanager.showAlgoTable();
                } else if (cell && cell.edge) {
                    var front = mxGraphDiagram.nodeMap.get(cell.source.swId);
                    var back = mxGraphDiagram.nodeMap.get(cell.target.swId);
                    //자식(back)이 패드인 경우 라인표시를 위한 로직 (pad가 아닌 실제 스위치의 아이디를 구하기 위함)
                    //부모(front)노드의 childSWMap에서 자식노드의 padChild에 일치하는게 있다면 그게 정확한 노드임. 부모가 패드인지 아닌지는 체크 불필요.
                    var backPadChildId, frontPadChildId;
                    if (back.isPadParent) {
                        for (var key in front.childSWMap) {
                            var f = front.childSWMap[key];
                            for (var key2 in back.padChild) {
                                var b = back.padChild[key2];
                                if (f.sw_id == b.sw_id) {
                                    backPadChildId = b.sw_id;
                                    break;
                                }
                            }
                        }
                        //부모의 패드소속스위치 별로 자식중에  backPadChildId와 일치하는 노드를 찾아서 그 노드를 부모노드로 지정함.
                        for (var key in front.padChild) {
                            var f = front.padChild[key];
                            for (var key2 in f.childSWMap) {
                                var fc = f.childSWMap[key2];
                                if (backPadChildId == fc.sw_id) {
                                    frontPadChildId = f.sw_id;
                                    break;
                                }
                            }
                        }

                        front = mxGraphDiagram.nodeMap.get(frontPadChildId); //pad가 아닌 실제 스위치의 아이디를 구했다.
                        back = mxGraphDiagram.nodeMap.get(backPadChildId);

                    }



                    if (cell.style == "lineStyle") {
                        objInfo = {
                            type: "sec",
                            value: [cell.secId, "SECTION", front.sw_name + "(" + front.sw_id + ")", back.sw_name + "(" + back.sw_id + ")"]
                        };
                        var infoTitle = front.sw_name + " ― " + back.sw_name;
                        $("#substnm").val(infoTitle);
                        showInfoRightMenu(objInfo);
                    }
                } else {
                    objInfo = {
                        type: "backGround",
                        value: ["", ""]
                    };
                    $("#substnm").val("");
                    showInfoRightMenu(objInfo);
                    algorithmTabmanager.showAlgoTable();
                    return;
                }
                evt.consume();
            });
        }
    }

    // var blob = new Blob([''], {type: "text/plain;charset=utf-8"});

    function calculateGraphSize() {
        var grid = mxGraphDiagram.grid;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                if (grid[i][j] == '0') {

                } else {
                    if (grid[i][j].type == 'node') {
                        if (gridMinX > j)
                            gridMinX = j;
                        if (gridMinY > i)
                            gridMinY = i;
                        if (gridMaxX < j)
                            gridMaxX = j;
                        if (gridMaxY < i)
                            gridMaxY = i;
                    }
                }
            }

        }
    }

    function printfGridData() {
        //console.log('[' + gridLayoutCallCnt + ']#### conflict count:' + totalConflictCnt);
        var grid = mxGraphDiagram.grid, nodeCnt = 0;
        var isNullLine = true;
        //단순한 로그
        for (var i = 0; i < grid.length; i++) {
            var line = i;
            isNullLine = true;
            for (var j = 0; j < grid[i].length; j++) {
                if (grid[i][j] != 0)
                    isNullLine = false;
            }
            if (isNullLine)
                continue;
            for (var j = 0; j < grid[i].length; j++) {
                if (grid[i][j] == '0') {
                    line += ' ';
                } else {
                    if (grid[i][j].type == 'node') {
                        if (gridMinX > j)
                            gridMinX = j;
                        if (gridMinY > i)
                            gridMinY = i;
                        if (gridMaxX < j)
                            gridMaxX = j;
                        if (gridMaxY < i)
                            gridMaxY = i;

                        if (grid[i][j].element.isFinalNode == true)
                            line += '●';
                        else {
                            if (grid[i][j].element.branchCnt == 1)
                                line += '○';
                            else
                                line += '□';
                        }

                        nodeCnt++
                    } else if (grid[i][j].type == 'line') {
                        if (!grid[i][j].line_info.shape)
                            console.log(1);
                        line += grid[i][j].line_info.shape;
                    } else {
                        line += '?';
                    }
                }
            }
            console.log(line);
            // blob = new Blob([blob, line + "\n"], {type: "text/plain"});
        }


        console.log('## 노드갯수:' + nodeCnt);
        //아이디 표시 로그
        for (var i = 0; i < grid.length; i++) {
            var line = i;
            isNullLine = true;
            for (var j = 0; j < grid[i].length; j++) {
                if (grid[i][j] != 0)
                    isNullLine = false;
            }
            if (isNullLine)
                continue;
            for (var j = 0; j < grid[i].length; j++) {
                if (grid[i][j] == '0') {
                    line += ' ';
                } else {
                    if (grid[i][j].type == 'node') {
                        if (grid[i][j].element.isFinalNode == true)
                            line += '●[';
                        else {
                            if (grid[i][j].element.branchCnt == 1)
                                line += '○[';
                            else
                                line += '□[';
                        }
                        line += grid[i][j].element.sw_id + ']';
                    } else if (grid[i][j].type == 'line') {
                        if (!grid[i][j].line_info.shape)
                            console.log(1);
                        line += grid[i][j].line_info.shape;
                    } else {
                        line += '?';
                    }
                }
            }
            console.log(line);
            // blob = new Blob([blob, line + "\n"], {type: "text/plain"});
        }

        //좌표 표시 로그
        for (var i = 0; i < grid.length; i++) {
            var line = i;
            isNullLine = true;
            for (var j = 1; j < grid[i].length; j++) {
                if (grid[i][j] != 0)
                    isNullLine = false;
            }
            if (isNullLine)
                continue;
            for (var j = 0; j < grid[i].length; j++) {
                if (grid[i][j] == '0') {
                    line += ' ';
                } else {
                    if (grid[i][j].type == 'node') {
                        if (grid[i][j].element.isFinalNode == true)
                            line += '●[';
                        else {
                            if (grid[i][j].element.branchCnt == 1)
                                line += '○[';
                            else
                                line += '□[';
                        }
                        line += grid[i][j].pos.x + ',' + grid[i][j].pos.y + ']';
                    } else if (grid[i][j].type == 'line') {
                        line += grid[i][j].line_info.shape + '[' + grid[i][j].pos.x + ',' + grid[i][j].pos.y + ']';
                    } else {
                        line += '?';
                    }
                }
            }
            console.log(line);
            //blob = new Blob([blob, line + "\n"], {type: "text/plain"});
        }


    }

    function createCode(r) {
        mxGraphDiagram.codeMap.clear();
        for (var i = 0; i < r.length; i++) {
            mxGraphDiagram.codeMap.put(r[i].sw_kind_code, {
                desc: r[i].swkind_desc,
                id: r[i].swkind_id,
                dptype: r[i].swkind_dptype
            });
        }
    }

    var setSubsData = function () {
        return new Promise(function (resolve, reject) {
            $.post("/electrical_diagram/searchSubs", {subs_id: mxGraphDiagram.subsId}, function (result) {
                mxGraphDiagram.subsDB = result;
                setSubsMap();
                setMTRMap();
                setDLMap();
                mxGraphDiagram.mtrKeys = mxGraphDiagram.mtrMap.keys();
                mxGraphDiagram.dlKeys = mxGraphDiagram.dlMap.keys();
                resolve();
            });
        });
    };

    //모든 노드에 자식 노드의 최대 depth사이즈를 설정한다
    function setChildMaxPath() {
        for (var key in mxGraphDiagram.nodeMap.map) {
            //마지막 노드를 찾는다.
            var node = mxGraphDiagram.nodeMap.get(key);
            if (node.isFinalNode == true) {
                node.maxPathDepth = 0; //finalNode는 maxPathDepth가 0
                setMaxPathDepth(node, 0);

            }
        }

    }

    function setMaxPathDepth(node, depth) {
        depth++;
        for (var key in node.parentSWMap) {
            var parentNode = node.parentSWMap[key];
            if (Object.keys(parentNode.childSWMap).length == 1) {
                parentNode.maxPathDepth = depth;
            } else if (Object.keys(parentNode.childSWMap).length > 1) {
                if (parentNode.maxChildPath < depth) {
                    parentNode.maxChildPath = depth;
                }
            } else {
                console.error('parent인데 childSWNode.length가 0!');
            }
            setMaxPathDepth(parentNode, depth);
        }

    }


    //
    function findMainBranch(rootNode) {
        findBranchPath(rootNode, true);
        //countChildNodes2();
        //1.말단까지 모든 패스를 구한다.
        var path = [], pathList = [], countId = 1;
        searchAllPath(rootNode, path, pathList, countId);
        //2.최장패스를 구한다
        var maxPathIdx = -1;

        pathList.sort(function (a, b) {
            return b.length - a.length;
        });
        /*
        for (var i=0;i<pathList.length;i++) {
            var p = pathList[i];
            if (p.length > maxPathIdx) {
                maxPathIdx = i;
            }
            console.log('PATH:' + p);
        }*/
        var maxPath = pathList[0];//pathList[maxPathIdx];

        //3.최장패스에 플래그를 설정한다.
        for (var i=0; i<maxPath.length;i++) {
            mxGraphDiagram.nodeMap.get(maxPath[i]).totalChildNodeCnt = 100;
        }
    }

    function searchAllPath(node, path, pathList, countId) {
        if (node.isPadChild) {
            var isFinalNode = true;
            if (!node.padNode)
                return;
            for (var key in node.padNode.padChild) {
                var child = node.padNode.padChild[key];

                if (Object.keys(child.childSWMap).length == 0)
                    continue;
                if (node.sw_id == child.sw_id) {//역방향으로 안 가게 동일한건 뺀다.
                    path.push(child.sw_id);
                    searchAllPath(node.childSWMap[Object.keys(node.childSWMap)[0]], path.slice(), pathList, countId);
                    continue;
                }
                if (child.countId == countId)
                    continue;

                child.countId = countId;
                isFinalNode = false;
                path.push(node.sw_id);

                searchAllPath(child, path.slice(), pathList, countId);
            }
            if (isFinalNode) {
                pathList.push(path);
                return;
            }
        } else {
            if (Object.keys(node.childSWMap).length == 0) { //끝단
                pathList.push(path);
                return;
            }
            for (var key in node.childSWMap) {
                var child = node.childSWMap[key];
                if (child.countId == countId)
                    continue;
                child.countId = countId;
                path.push(node.sw_id);

                searchAllPath(child, path.slice(), pathList, countId);
            }
        }
    }


    function sortNodeByTotalChildNodeCnt() {

        for (var key in mxGraphDiagram.nodeMap.map) {
            var node = mxGraphDiagram.nodeMap.get(key);

            if (Object.keys(node.childSWMap).length > 0) {
                var array = [];
                for (c in node.childSWMap) {
                    array.push(node.childSWMap[c])
                }
                array.sort(function (a, b) {

                    if (a.isPadParent && !b.isPadParent) {//a만 패드, b는 스위치
                        return b.totalChildNodeCnt - a.padNode.totalChildNodeCnt;
                    } else if (!a.isPadParent && b.isPadParent) { //a는 스위치, b만 패드
                        return b.padNode.totalChildNodeCnt - a.totalChildNodeCnt;
                    } else if (a.isPadParent && b.isPadParent) { //둘 다 패드
                        return b.padNode.totalChildNodeCnt - a.padNode.totalChildNodeCnt;
                    } else {
                        return b.totalChildNodeCnt - a.totalChildNodeCnt;
                    }

                });
                //array.reverse();
                node['childMapArr'] = array;
            } else {
                node['childMapArr'] = [];
            }
        }
    }


    // 반환값 0: 마지막노드, 1: 자식노드 있음
    function findBranchPath(parentNode, isRoot, path) {
        if (!parentNode)
            return;
        if (parentNode.childSWMap.length == 0)
            return;

        var childMap = parentNode.childSWMap;
        parentNode.branchCnt = Object.keys(childMap).length;
        if (isRoot) {
            path = [];
        }
        //자식이 없는 노드이면 패스를 반환한다
        if (!childMap || parentNode.branchCnt == 0) {
            parentNode.isFinalNode = true;
            path.push(parentNode);
            parentNode.path = path.slice();
            path = [];
            return 1;
        } else { //자식이 있다
            path.push(parentNode);
            parentNode.path = path;
            for (var key in childMap) {
                if (childMap.hasOwnProperty(key)) {
                    var _path = path.slice();
                    if (parentNode.branchCnt > 1) {//가지친 노드이므로 새 브랜치노드로 설정
                        childMap[key].seniorBranchNode = parentNode;
                    } else if (parentNode.branchCnt == 1) {
                        childMap[key].seniorBranchNode = parentNode.seniorBranchNode; //가지 안 치므로 브랜치노드 계승
                    }
                    var r = findBranchPath(childMap[key], false, _path);
                }
            }
        }
    }

    function clearGrid() {
        gridMinX = Number.MAX_SAFE_INTEGER, gridMinY = Number.MAX_SAFE_INTEGER,
            gridMaxX = Number.MIN_SAFE_INTEGER, gridMaxY = Number.MIN_SAFE_INTEGER;
        if (!mxGraphDiagram.grid) {
            mxGraphDiagram.grid = new Array(GRID_ARRAY_SIZE);
            for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
                mxGraphDiagram.grid[i] = new Array(GRID_ARRAY_SIZE);
            }
        }
        for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
            for (var j = 0; j < GRID_ARRAY_SIZE; j++) {
                mxGraphDiagram.grid[i][j] = 0;
            }
        }

    }

    function createGridNode(type, element, pos, line_info) {
        if (type == 'node') {
            element.gridX = pos.x;
            element.gridY = pos.y;
        }

        var gridNode = {
            type: type,
            pos: pos,
            element: element, //node or line
            line_info: line_info
        };

        //console.log('createGridNode : type:' + gridNode.type + ', pos:' + pos.x + ',' + pos.y);
        return gridNode;
    }


    //좌우로 반전시킨 ㄷ자 형으로 도는 경우의 자식브랜치 방향임
    function getNextDirection2(direct, x, y) {
        switch (direct) {
            case UP:
                return LEFT;
            case DOWN:
                return RIGHT;
            case LEFT:
                return DOWN;
            case RIGHT:
                return UP;
        }
    }

    function getNextDirection3(direct, x, y) {
        switch (direct) {
            case UP:
                if (mxGraphDiagram.grid[y + 1][x] == 0)
                    return UP;
                else
                    return getNextDirection3(LEFT, x, y);
                break;
            case DOWN:
                if (mxGraphDiagram.grid[y - 1][x] == 0)
                    return DOWN;
                else
                    return getNextDirection3(RIGHT, x, y);
                break;
            case LEFT:
                if (mxGraphDiagram.grid[y][x - 1] == 0)
                    return LEFT;
                else
                    return getNextDirection3(DOWN, x, y);
                break;
            case RIGHT:
                if (mxGraphDiagram.grid[y][x + 1] == 0)
                    return RIGHT;
                else
                    return getNextDirection3(UP, x, y);
                break;
            default:
                console.error('getNextDirection3 error d:' + direct);
                return RIGHT;
        }
        return '111';
    }

    function getDirectionString(d) {
        switch (d) {
            case UP:
                return 'UP';
            case DOWN:
                return 'DOWN';
            case LEFT:
                return 'LEFT';
            case RIGHT:
                return 'RIGHT';
        }
    }

    /**
     * layoutGrid2에 비해 개선한 점
     * 0. 루트노드에서 말단노드까지 다음과 같은 형식으로 그린다.
     * 1. 브랜치의 경우 그려진 정보를 기억하여 충돌 되는 경우 상위브랜치에서 다른 방향으로 다시 그린다.
     * 2. 1과 같이 다시 그리는 경우 모든 방향에서 실패하면 원래 방향으로 라인을 연장하여 다시 그린다.
     * 3. 충돌 안 날때까지 1,2 반복.
     * 4. 방향순위는 right => up => left => down =>...  반시계방향으로 도는 것임. 모두 실패할 경우 원래 방향으로 라인 연장.
     * 5. 실패할 경우 그리드에 그린 흔적을 브랜치 밑으로 모두 지운다.
     * @param rootNode
     */
    function layoutGrid(rootNode) {
        clearGrid();
        var drawPath = [];
        gridLayoutCallCnt = 0;
        var t1 = new Date().getTime();
        layoutNodeAndLineNEW(rootNode, BASIC_DIRECTION, startGridX, startGridY, drawPath, true);
        //printfGridData();
        calculateGraphSize();
        var t2 = new Date().getTime();
        console.log('########## layout time:' + (t2 - t1) / 1000 + '(sec)');
        // alert('########## layout time:' + (t2 - t1) / 1000 + '(sec)');
        //saveAs(blob,"test.txt");
        //printfGridData();
    }

    function getEmptyDirection(x, y) {
        var dir = [];
        if (mxGraphDiagram.grid[y][x + 1] == 0) {
            dir.push(RIGHT);
        } else if (mxGraphDiagram.grid[y + 1][x] == 0) {
            dir.push(UP);
        } else if (mxGraphDiagram.grid[y][x - 1] == 0) {
            dir.push(LEFT);
        } else if (mxGraphDiagram.grid[y - 1][x] == 0) {
            dir.push(DOWN);
        }
        return dir;
    }


    function log(s) {
        console.log(s);
    }


    /**
     * 1.부모노드를 먼저 그리드에 설정
     * 2. 자식노드를 그리드에 그린다. 방향은 직진이 우선임.
     * 3. 실패한 경우 방향을 바꿔서 시도
     * 4. 모든 방향 실패시 라인 연장
     * RIGHT: 1, UP :2, LEFT :4, DOWN:8 비트연산으로 캐릭터 결정
     * @param parentNode
     * @param x
     * @param y
     * @param drawPath
     * @param isMtrMode mtr레이아웃 그리는건지 플래고. mtr인 경우 DL용 노드맵과는 달리 스위치만 들어있다.
     * @returns {number}
     */
    function layoutNodeAndLineNEW(parentNode, direction, x, y, drawRecord, isRoot, isMtrMode) {
        //log('1. Node[' + parentNode.sw_id + '] line(' + x + ',' + y + ') child cnt:' + Object.keys(parentNode.childSWMap).length + ' Start.');

        gridLayoutCallCnt++;

        var directChar = getDirectChar(direction, [direction]);

        if (!isRoot) {
            //라인을 그린다.
            mxGraphDiagram.grid[y][x] = createGridNode('line', null, {x: x, y: y}, {
                direct: direction,
                shape: directChar
            });
        }


        //노드 그릴 위치를 정한다. (직진)
        var pos = nextXY(direction, x, y);

        //부모노드 그리기
        mxGraphDiagram.grid[pos.y][pos.x] = createGridNode('node', parentNode, {x: pos.x, y: pos.y}, null);

        parentNode.isConnected = true;
        // printfGridData();

        //부모노드에서 뻗어나오는 라인 갯수와 방향에 맞는 특수문자를 찾는다.
        var childMap = parentNode.childSWMap;

        if (Object.keys(childMap).length == 0)
            return NO_CONFLICT;

        var dir = [], newDrawRecord = [];

        //자식노드 루프

        // for (var key in childMap) {

        for (var i = 0; i < parentNode.childMapArr.length; i++) {
            //var childNode = childMap[key];
            var childNode = parentNode.childMapArr[i];
            if (isMtrMode && !childNode.isAutoSwitch)
                continue;
            //여기가 맞을까 이 위가 맞을까?
            if (childNode.isPadChild && childNode.padNode) { //childNode.isPadChild가 참인데 childNode.padNode가 널인 경우는 TR인 경우. TR은 안 그림
                childNode = childNode.padNode;
            } else if (childNode.isPadChild && !childNode.padNode) {
                continue;
            }

            if (childNode.isConnected) {
                continue;
            }

            var direct = direction;
            var i = 0, okCnt = 0;

            // log('Loop childNode[' + childNode.sw_id + '] (' + pos.x + ',' + pos.y + ')');
            //우선 뻗어나갈 수 있는 곳을 찾는다. 여기서 못 찾으면 shift해서라도 그린다.
            while (i < 4) {//var RIGHT = 1, LEFT = 2, UP = 4, DOWN = 8, NONE = 0;
                if (i > 0)
                    direct = getNextDirection2(direct, pos.x, pos.y);

                if (dir.includes(direct) || direct == getOpposite(direction)) {
                    dir.push(direct);
                    // log('Loop i[' + i + '] direct[' + getDirectionString(direct) + '] continue.');
                    i++;
                    continue;
                }
                if (checkLineDrawEnable(direct, pos.x, pos.y)) {
                    // log('Loop i[' + i + '] direct[' + getDirectionString(direct) + '] checkLineDrawEnable is ok.');
                    var pos2 = nextXY(direct, pos.x, pos.y);
                    layoutNodeAndLineNEW(childNode, direct, pos2.x, pos2.y, newDrawRecord);

                    okCnt++;
                    break;
                } else {
                    // log('Loop i[' + i + '] direct[' + getDirectionString(direct) + '] checkLineDrawEnable is BAD.');
                }

                dir.push(direct);
                i++;

            }//while 방향루프

            if (okCnt == 0) {
                //var rpos = revertXY(direction, x, y);//x,y는 부모노드의 라인좌표임
                //log('getNextDirection3 call direct[' + getDirectionString(direct) + '], x[' + x + '], y[' + y + ']');
                var d = getNextDirection3(direct, pos.x, pos.y);
                //log('okCnt is 0. new direct:' + getDirectionString(d) + ']. start Shift.(' + pos.x + ',' + pos.y + ')');
                shiftGrid(d, pos.x, pos.y);
                var rpos = nextXY(d, pos.x, pos.y);
                // log(' call layoutNodeAndLineNEW:' + getDirectionString(d) + '] (' + rpos.x + ',' + rpos.y + ')');
                layoutNodeAndLineNEW(childNode, d, rpos.x, rpos.y, newDrawRecord);
            }
        } //for child node loop

        return NO_CONFLICT;//끝노드
    }

    //해당좌표에서 d방향으로 그릴 수 있는지 확인.(라인이나 노드가 있는지 없는지 확인)
    function checkLineDrawEnable(d, x, y) {
        var p = mxGraphDiagram.grid;
        switch (d) {
            case RIGHT:
                return p[y][x + 2] != undefined && p[y][x + 1] == 0 && p[y][x + 2] == 0;
            case LEFT:
                return p[y][x - 2] != undefined && p[y][x - 1] == 0 && p[y][x - 2] == 0;
            case UP:
                return p[y + 2][x] != undefined && p[y + 1][x] == 0 && p[y + 2][x] == 0;
            case DOWN:
                return p[y - 2][x] != undefined && p[y - 1][x] == 0 && p[y - 2][x] == 0;
            default:
                console.error('checkLineDrawEnable : Invalid direction:' + direction);
        }
        console.error('checkLineDrawEnable error! d:', d, ',x:', x, 'y:', y);
        return false;
    }

    /**
     * grid의 지정된 데이터들을 쉬프트 시킨다.
     * @param direction
     * @param x
     * @param y
     * @returns {{x: *, y: *}}
     */
    function shiftGrid(direction, x, y) {
        var pos = {x: x, y: y}
        switch (direction) {
            case RIGHT:
                //console.log('SHIFT RIGHT x:' + x + ',y:' + y);

                shift_right(x + 1);
                shift_right(x + 1);
                pos.x += 2;
                break;
            case LEFT:
                //console.log('SHIFT LEFT x:' + x + ',y:' + y);

                shift_left(x - 1);
                shift_left(x - 1);
                pos.x -= 2;
                break;
            case UP:
                // console.log('SHIFT UP x:' + x + ',y:' + y);

                shift_up(y + 1);
                shift_up(y + 1);
                pos.y += 2;
                break;
            case DOWN:
                console.log('SHIFT DOWN x:' + x + ',y:' + y);
                shift_down(y - 1);
                shift_down(y - 1);

                //printfGridData();
                pos.y -= 2;
                break;
            default:
            //console.error('shiftGrid : Invalid direction:' + direction);
        }
        return pos;
    }

    function shift_right(pos) {
        for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
            mxGraphDiagram.grid[i].splice(pos, 0, mxGraphDiagram.grid[i][pos]);//위치, 삭제카운트, 추가값
        }
        //node좌표변경
        for (var i = 0; i < GRID_ARRAY_SIZE; i++) { //y
            for (var j = pos + 1; j < GRID_ARRAY_SIZE; j++) {//x
                if (mxGraphDiagram.grid[i][j].type == 'node') {
                    mxGraphDiagram.grid[i][j].element.gridX++;
                }
            }
        }
    }

    function shift_left(pos) {
        if (pos == 0)
            console.warn('shift_left pos = 0!. No change in grid.');
        for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
            mxGraphDiagram.grid[i].splice(pos, 0, mxGraphDiagram.grid[i][pos]);
            mxGraphDiagram.grid[i].shift();
        }

        //node좌표변경
        for (var i = 0; i < GRID_ARRAY_SIZE; i++) { //y
            for (var j = 0; j < pos; j++) {//x
                if (mxGraphDiagram.grid[i][j].type == 'node') {
                    mxGraphDiagram.grid[i][j].element.gridX--;
                }
            }
        }
    }

    //좌표축을 기준으로 다운. 표시상으로는 up임.
    function shift_down(pos) {
        if (pos == 0)
            console.warn('shift_up pos = 0!. No change in grid.');
        for (var i = 0; i < pos; i++) {
            mxGraphDiagram.grid[i] = mxGraphDiagram.grid[i + 1].slice();
        }

        //node좌표변경
        for (var i = 0; i < pos; i++) { //y
            for (var j = 0; j < GRID_ARRAY_SIZE; j++) {//x
                if (mxGraphDiagram.grid[i][j].type == 'node') {
                    mxGraphDiagram.grid[i][j].element.gridY--;
                }
            }
        }
    }

    function shift_up(pos) {
        for (var i = GRID_ARRAY_SIZE - 2; i >= pos; i--) {
            mxGraphDiagram.grid[i + 1] = mxGraphDiagram.grid[i].slice();
        }

        //node좌표변경
        for (var i = pos; i < GRID_ARRAY_SIZE; i++) { //y
            for (var j = 0; j < GRID_ARRAY_SIZE; j++) {//x
                if (mxGraphDiagram.grid[i][j].type == 'node') {
                    mxGraphDiagram.grid[i][j].element.gridY++;
                }
            }
        }
    }

    function getOpposite(direction) {
        switch (direction) {
            case RIGHT:
                return LEFT;
            case LEFT:
                return RIGHT;
            case UP:
                return DOWN;
            case DOWN:
                return UP;
            default:
                console.error('Invalid direction:' + direction);
        }
    }

    function nextXY(direction, x, y) {
        switch (direction) {
            case RIGHT:
                return {x: x + 1, y: y};
            case LEFT:
                return {x: x - 1, y: y};
            case UP:
                return {x: x, y: y + 1};
            case DOWN:
                return {x: x, y: y - 1};
            default:
                console.error('Invalid direction:' + direction);
        }
    }

    function getDirectChar(direction, directArray) {
        if (directArray.length == 3) {
            return '┼';
        } else if (directArray.length == 2) {
            if (direction == RIGHT) {
                if ((directArray[0] == UP && directArray[1] == RIGHT) || (directArray[0] == RIGHT && directArray[1] == UP)) {
                    return '┬';
                } else if ((directArray[0] == DOWN && directArray[1] == RIGHT) || (directArray[0] == RIGHT && directArray[1] == DOWN)) {
                    return '┴';
                } else if ((directArray[0] == DOWN && directArray[1] == UP) || (directArray[0] == UP && directArray[1] == DOWN)) {
                    return '┤';
                }
            } else if (direction == LEFT) {
                if ((directArray[0] == UP && directArray[1] == LEFT) || (directArray[0] == LEFT && directArray[1] == UP)) {
                    return '┬';
                } else if ((directArray[0] == DOWN && directArray[1] == LEFT) || (directArray[0] == LEFT && directArray[1] == DOWN)) {
                    return '┴';
                } else if ((directArray[0] == DOWN && directArray[1] == UP) || (directArray[0] == UP && directArray[1] == DOWN)) {
                    return '├';
                }
            } else if (direction == UP) {
                if ((directArray[0] == UP && directArray[1] == LEFT) || (directArray[0] == LEFT && directArray[1] == UP)) {
                    return '┤';
                } else if ((directArray[0] == UP && directArray[1] == RIGHT) || (directArray[0] == RIGHT && directArray[1] == UP)) {
                    return '├';
                } else if ((directArray[0] == LEFT && directArray[1] == RIGHT) || (directArray[0] == RIGHT && directArray[1] == LEFT)) {
                    return '├';
                }
            } else if (direction == DOWN) {
                if ((directArray[0] == DOWN && directArray[1] == LEFT) || (directArray[0] == LEFT && directArray[1] == DOWN)) {
                    return '┤';
                } else if ((directArray[0] == DOWN && directArray[1] == RIGHT) || (directArray[0] == RIGHT && directArray[1] == DOWN)) {
                    return '├';
                } else if ((directArray[0] == LEFT && directArray[1] == RIGHT) || (directArray[0] == RIGHT && directArray[1] == LEFT)) {
                    return '┬';
                }
            }
        } else if (directArray.length == 1) {
            if (direction == directArray[0]) {
                if (direction == RIGHT || direction == LEFT) {
                    return '─';
                } else if (direction == UP || direction == DOWN) {
                    return '│';
                } else {
                    console.error('child가 하나인데 방향이 꺽이는 경우임.');
                    return 'E';
                }
            }
        } else {
            return 'F';
        }
    }

    function isInGrid(x, y) {
        if (x >= 0 && y >= 0 && GRID_ARRAY_SIZE >= x && GRID_ARRAY_SIZE >= y) {
            return true;
        }
        return false;
    }

    function createSwMap(data) {
        mxGraphDiagram.nodeMap.clear();
        //패드스위치 아닌 경우
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            //if (!mxGraphDiagram.padArr.includes(d.swkind_code)) {
            var node = new Object({
                sw_id: d.sw_id, //sw_frtu.sw_id
                sw_kind_id: d.sw_kind_id, //sw_frtu.sw_frtu
                sw_kind_code: d.swkind_code,
                //swkind_code : d.swkind_code,
                sw_name: d.sw_loc,////sw_frtu.sw_loc
                parentSWMap: {}, //sw_frtu.sw_id
                childSWMap: {}, //sw_frtu.sw_id
                gridX: -1,
                gridY: -1,
                autoSwChildCnt: 0,
                isAutoSwitch: false,
                isPad: false,
                padleId: d.sw_id,//sw_frtu.sw_loc_no
                isPadChild: false, //일반 스위치
                isPadParent: false,//일반 스위치
                isVisible: true,
                isChecke: false,
                isChildChecked: false,
                isFinalNode: false,
                path: [], //마지막노드인 경우에 depth값.
                isMainBranch: false,
                branchCheckFlag: false,
                dl_id: d.dl_id,//sw_frtu.dl_id
                maxChildPath: 0,
                maxPathDepth: 0,
                branchCnt: 0,//childNode갯수
                totalChildNodeCnt: 0,
                seniorBranchNode: null,
                isConnected: false, //부모랑 연결되면 true
                countId: 0, //자식수 카운트할때 식별용. (무한루프 방지용)
                greeting: function () {
                    alert('Hi! I\'m ' + this.name + '.');
                }
            });
            mxGraphDiagram.nodeMap.put(node.sw_id, node);
            //}
        } //for


    }

    function createPadSwMap(data) {
        mxGraphDiagram.padMap.clear();
        //패드스위치
        var insertedLocNoArr = [];
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (d.sw_loc_no != null && mxGraphDiagram.padArr.includes(d.swkind_code)) {
                var padChildArr = {};
                if (insertedLocNoArr.includes(d.sw_loc_no))//이미 만들었던 패드이면 통과
                    continue;
                for (var j = i; j < data.length; j++) { //같은 패드 찾기
                    var d2 = data[j];
                    if (d2.sw_loc_no == d.sw_loc_no) {//소속 패드스위치
                        /*
                         var node = new Object({
                             sw_id: d.sw_id, //sw_frtu.sw_id
                             sw_kind_id: d.sw_kind_id, //sw_frtu.sw_frtu
                             sw_kind_code: d.swkind_code,
                             sw_name: d.sw_loc,////sw_frtu.sw_loc
                             parentSWMap: {}, //sw_frtu.sw_id
                             childSWMap: {}, //sw_frtu.sw_id
                             gridX: -1,
                             gridY: -1,
                             isPadChild: true, //이 노드는 패드스위치다.
                             isPadParent: false, //하지만 부모패드는 아니다.
                             padleId: d.sw_id,//sw_frtu.sw_loc_no
                             isVisible: true,
                             isChecke: false,
                             isChildChecked: false,
                             isFinalNode: false,
                             path: [], //마지막노드인 경우에 depth값.
                             isMainBranch: false,
                             branchCheckFlag: false,
                             dl_id: d.dl_id,//sw_frtu.dl_id
                             maxChildPath: 0,
                             maxPathDepth: 0,
                             branchCnt: 0,//childNode갯수
                             totalChildNodeCnt: 0,
                             seniorBranchNode: null
                         });*/
                        var node = mxGraphDiagram.nodeMap.get(d2.sw_id);
                        node.isPadChild = true;
                        node.isPadParent = false;
                        if (node.sw_kind_code != 'TR' && node.sw_kind_code != 'DM') //TR은 뺀다. 현재로서는 처리 어려움. 이 패드에서 선을 빼서  그려야함.
                            padChildArr[d2.sw_id] = node;
                        if (!insertedLocNoArr.includes(d.sw_loc_no))//처음이면 insertedLocNoArr에 넣는다
                            insertedLocNoArr.push(d.sw_loc_no);
                    }
                }//같은 패드 찾기 끝

                //패드스위치.

                var padNode = new Object({
                    sw_id: 'pad' + i, //sw_frtu.sw_id
                    sw_kind_id: d.sw_kind_id, //sw_frtu.sw_frtu
                    sw_kind_code: d.swkind_code,
                    sw_name: d.sw_name,////sw_frtu.sw_loc
                    parentSWMap: {}, //sw_frtu.sw_id
                    childSWMap: {}, //sw_frtu.sw_id
                    gridX: -1,
                    gridY: -1,
                    isPadChild: false,//소속패드스위치는 아니다.
                    isPadParent: true,//부모패드다
                    padChild: padChildArr,
                    padleId: d.sw_id,//sw_frtu.sw_loc_no
                    isVisible: true,
                    isChecke: false,
                    isChildChecked: false,
                    isFinalNode: false,
                    path: [], //마지막노드인 경우에 depth값.
                    isMainBranch: false,
                    branchCheckFlag: false,
                    dl_id: d.dl_id,//sw_frtu.dl_id
                    maxChildPath: 0,
                    maxPathDepth: 0,
                    branchCnt: 0,//childNode갯수
                    totalChildNodeCnt: 0,
                    seniorBranchNode: null,
                    countId: 0


                });

                //패드의 들어있는 부모 밑 자식노드 정보를 패드에 설정한다.
                var isConnected = false;
                //for (var k=0; k<padChildArr.length;k++) {
                for (var key in padChildArr) {
                    //padChildArr[k].node.padNode = padNode;//소속노드들에게 패드노드정보를 설정한다.
                    var padChild = padChildArr[key];
                    padChild.padNode = padNode;
                    if (!padNode) {
                        console.log('padNode is null');//패드소속인데 실제 패드는 존재 안 하는 경우임
                    }
                    for (var key in padChild.parentSWMap) {
                        var parentNode = padChild.parentSWMap[key];
                        padNode.parentSWMap[parentNode.sw_id] = parentNode;
                        isConnected = true;
                    }
                    for (var key in padChild.childSWMap) {
                        var childNode = padChild.childSWMap[key];
                        padNode.childSWMap[childNode.sw_id] = childNode;
                        isConnected = true;
                    }
                    //if (isConnected  && mxGraphDiagram.nodeMap.containsKey(padChildArr[k].sw_id))
                    //    mxGraphDiagram.nodeMap.remove(padChildArr[k].sw_id);
                }


                mxGraphDiagram.nodeMap.put(padNode.sw_id, padNode);//노드로 취급.

            }//for pad find

        }

        //print node map
        var nodes = mxGraphDiagram.nodeMap.values();
        log('============================================================');
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            log(node);
        }
        log('============================================================');


    }

    function createLineMap(data) {
        mxGraphDiagram.lineMap.clear();
        for (var i = 0; i < data.length; i++) {

            var line = new Object({
                secId: data[i].sec_id,
                sw_id_f: data[i].sw_id_f, //sec.sw_id_f
                sw_id_b: data[i].sw_id_b, //sec.sw_id_b
                secLength: data[i].sec_length,
                secLoad: data[i].sec_load,
                //startX,Y는 parentNode.startX,Y, endX,Y는 childNode.X,Y가 됨.
                parentNode: {},
                childNode: {},
                isParentPad: false,
                isChildPad: false,
                childNodePad: null,
                parentNodePad: null,
                shape: null
            });

            var parentNode = mxGraphDiagram.nodeMap.get(line.sw_id_f);
            var childNode = mxGraphDiagram.nodeMap.get(line.sw_id_b);
            line.parentNode = parentNode;
            line.childNode = childNode;

            //부모노드, 자식노드에 각각 해당 노드의 부모와 자식노드 설정정
            //if (line.sw_id_f)sd
            if (parentNode && childNode && !parentNode.childSWMap.hasOwnProperty(childNode.sw_id))
                parentNode.childSWMap[childNode.sw_id] = childNode;
            if (parentNode && childNode && !childNode.parentSWMap.hasOwnProperty(parentNode.sw_id))
                childNode.parentSWMap[parentNode.sw_id] = parentNode;

            mxGraphDiagram.lineMap.put(line.secId, line);
        }
    }

    function updateLineMapForPad() {
        var lines = mxGraphDiagram.lineMap.values();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            //부모쪽 라인이 패드소속일 경우 패드의 아이디를 설정해놓는다.(그리기 위함)
            if (line.parentNode && line.parentNode.isPadChild && line.parentNode.padNode) {//childNode.isPadChild가 참인데 childNode.padNode가 널인 경우는 TR인 경우. TR은 안 그림
                line.parentNodePad = mxGraphDiagram.nodeMap.get(line.parentNode.padNode.sw_id);
                line.isParentPad = true;
            }

            if (line.childNode && line.childNode.isPadChild && line.childNode.padNode) {
                line.childNodePad = mxGraphDiagram.nodeMap.get(line.childNode.padNode.sw_id);
                line.isChildPad = true;
            }

            // var line = new Object({
            //     secId: data[i].sec_id,
            //     sw_id_f: data[i].sw_id_f, //sec.sw_id_f
            //     sw_id_b: data[i].sw_id_b, //sec.sw_id_b
            //     secLength: data[i].sec_length,
            //     secLoad: data[i].sec_load,
            //     //startX,Y는 parentNode.startX,Y, endX,Y는 childNode.X,Y가 됨.
            //     parentNode: {},
            //     childNode: {},
            //     shape: null
            // });

        }
    }

    var setDlData = function () {
        return new Promise(function (resolve, reject) {
            $.post('/electrical_diagram/kindcode/all', {}, function (result_code) {
                createCode(result_code);
                $.post("/electrical_diagram/dl/sw/all", {dl: mxGraphDiagram.dlId}, function (result_sw) {
                    //setLevel(checkLastDepth());
                    createSwMap(result_sw);

                    $.post("/electrical_diagram/dl/line/all", {dl: mxGraphDiagram.dlId}, function (result) {
                        //2차원배열 100 X 100

                        mxGraphDiagram.secMap.clear();
                        mxGraphDiagram.swMap.clear();
                        mxGraphDiagram.padMap.clear();
                        mxGraphDiagram.startSW = null;
                        mxGraphDiagram.drawSW = [];
                        mxGraphDiagram.drawSwAuto = [];
                        mxGraphDiagram.lastDepth = 0;
                        mxGraphDiagram.lastDepthArr = [];
                        mxGraphDiagram.swKeys = [];
                        mxGraphDiagram.secKeys = [];
                        mxGraphDiagram.swLevel = 1;
                        mxGraphDiagram.flagDrawZero = 0;
                        mxGraphDiagram.flagLevel = 1;
                        diagramPosition.x = 10;
                        diagramPosition.y = 300;
                        mxGraphDiagram.callAlgorithmList = [];
                        mxGraphDiagram.dbData = result;
                        mxGraphDiagram.load.original = null;
                        mxGraphDiagram.load.pqms = null;
                        mxGraphDiagram.load.pv = null;
                        mxGraphDiagram.load.pqmsMinusPv = null;
                        mxGraphDiagram.load.sectionLoad = null;
                        mxGraphDiagram.callAlgorithmList = [];

                        createLineMap(result);
                        createPadSwMap(result_sw);

                        var rootNode = mxGraphDiagram.nodeMap.get(mxGraphDiagram.cbId);

                        findMainBranch(rootNode);

                        setChildMaxPath();

                        sortNodeByTotalChildNodeCnt();

                        updateLineMapForPad();
                        startGridX = 100, startGridY = 150;
                        layoutGrid(rootNode);

                        //위의 처리를 기반으로 그리기
                        mxMain2($("#diagramDiv")[0]);

                        resolve();
                    });
                });
            });
        })
    };

    // chk = subs or mtr or dl_id
    showDiagram = function drawDiagram(chk, objs) {
        /*  $("#return").remove();*/
        mxGraphDiagram.check = chk;
        if (mxGraphDiagram.graph) {
            $("#diagramDiv").empty();
            mxGraphDiagram.graph.removeCells();
            mxGraphDiagram.graph.view.scale = 1;
        }
        valueInitialization(chk);
        if (chk == "subs") {
            /*  var subsData = setSubsData();
             subsData.then(function (resolve) {
             // var objInfo = {
             //     type: "subs",
             //     value: [mxGraphDiagram.subsId, "SUBSTATION", mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsNo, mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsName]
             // };
             // showInfoRightMenu(objInfo);
             $("#selectObjectInfo").text(mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsName);
             mxMain($("#diagramDiv")[0]);
             });*/
            $("#subsPicture").show();
            // $("#mtrPicture").hide();
            $("#diagramDiv").hide();

        } else if (chk == "mtr") {
            /*   var subsData = setSubsData();
               subsData.then(function (resolve) {
                   var addReturnBtnHtml = "<button type='button' class='btn btn-basic' id='return' data-toggle='tooltip' data-placement='bottom' title='돌아가기'  style='width: 60px; height: 35px;margin: 3px'>" +
                       "<span class='glyphicon glyphicon-arrow-left'></span></button>";
                   var subsName = mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsName;
                   $("#plusBtn").before(addReturnBtnHtml);
                   $("#selectObjectInfo").text(subsName + " > " + mxGraphDiagram.mtrId);
                   // var objInfo = {
                   //     type: "mtr",
                   //     value: [mxGraphDiagram.mtrId, "MTR", mxGraphDiagram.mtrMap.get(mxGraphDiagram.mtrId).bankNo]
                   // };
                   // showInfoRightMenu(objInfo);
                   mxMain($("#diagramDiv")[0]);
               });*/
            // $("#mtrPicture").show();
            $("#subsPicture").hide();
            // $("#diagramDiv").hide();
            $("#diagramDiv").show();
            // $.post('/electrical_diagram/kindcode/all', {}, function (result_code) {
            //     createCode(result_code);
            //     mxMain($("#diagramDiv")[0]);
            // });
            var subsData = setSubsData();
            subsData.then(function (resolve) {
                mxMain($("#diagramDiv")[0], objs);
            });
        } else {
            mxGraphDiagram.dlId = chk;
            mxGraphDiagram.check = "dl";
            $("#subsPicture").hide();
            $("#mtrPicture").hide();
            $("#diagramDiv").show();
            var subsData = setSubsData();
            subsData.then(function (resolve) {
                var dlData = setDlData();
                dlData.then(function () {
                    /*var addReturnBtnHtml = "<button type='button' class='btn btn-basic' id='return'  data-toggle='tooltip' data-placement='bottom' title='돌아가기' style='width: 60px; height: 35px;margin: 3px'>" +
                     "<span class='glyphicon glyphicon-arrow-left'></span></button>";*/
                    var subsName = mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsName;
                    var mtrId = mxGraphDiagram.mtrId;

                    /* $("#plusBtn").before(addReturnBtnHtml);*/
                    $("#selectObjectInfo").text(subsName + " > " + mtrId + " > " + mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).dlName);

                    // var objInfo = {
                    //     type: "dl",
                    //     value: [mxGraphDiagram.dlId, "DL", mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).dlNo, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).dlName, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).cbId,
                    //         mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).mtrId, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).subsId]
                    // };
                    // showInfoRightMenu(objInfo);
                    //단선도는 getDL()에서 이미 호출하므로 여기서 호출하면 안됨. 호출하는 경우 드래그시 애니메이션 효과 없어짐.(2번그리는 것이므로 )
//                    mxMain2($("#diagramDiv")[0]);
                });
            });
        }
    };

    function setSubsMap() {
        var subsObj;
        subsObj = {
            subsId: null,
            subsNo: null,
            subsName: null,
            mxSubs: null
        };
        subsObj.subsId = mxGraphDiagram.subsDB[0].subs_id;
        subsObj.subsNo = mxGraphDiagram.subsDB[0].subs_no;
        subsObj.subsName = mxGraphDiagram.subsDB[0].subs_name;
        mxGraphDiagram.subsMap.put(subsObj.subsId, subsObj);
    }

    function setMTRMap() {
        var mtrObj;
        for (var i = 0; i < mxGraphDiagram.subsDB.length; i++) {
            mtrObj = {
                mtrId: null,
                bankNo: null,
                subsId: null,
                subsNo: null,
                subsName: null,
                dlId: null,
                mxMtr: null
            };
            mtrObj.mtrId = mxGraphDiagram.subsDB[i].mtr_id;
            mtrObj.bankNo = mxGraphDiagram.subsDB[i].bank_no;
            mtrObj.subsId = mxGraphDiagram.subsDB[i].subs_id;
            mtrObj.subsNo = mxGraphDiagram.subsDB[i].subs_no;
            mtrObj.subsName = mxGraphDiagram.subsDB[i].subs_name;
            mtrObj.dlId = findDL(mxGraphDiagram.subsDB[i].mtr_id);

            mxGraphDiagram.mtrMap.put(mtrObj.mtrId, mtrObj);
        }
    }


    function findDL(id) {
        var dl = [];
        for (var i = 0; i < mxGraphDiagram.subsDB.length; i++) {
            if (mxGraphDiagram.subsDB[i].mtr_id == id && !dl.includes(mxGraphDiagram.subsDB[i].dl_id)) {
                dl.push(mxGraphDiagram.subsDB[i].dl_id);
            }
        }
        return dl;
    }

    function setDLMap() {
        var dlObj;
        for (var i = 0; i < mxGraphDiagram.subsDB.length; i++) {
            dlObj = {
                dlId: null,
                dlNo: null,
                dlName: null,
                cbId: null,
                mtrId: null,
                subsId: null,
                mxDL: null
            };
            dlObj.dlId = mxGraphDiagram.subsDB[i].dl_id;
            dlObj.dlNo = mxGraphDiagram.subsDB[i].dl_no;
            dlObj.dlName = mxGraphDiagram.subsDB[i].dl_name;
            dlObj.cbId = mxGraphDiagram.subsDB[i].cb_id;
            dlObj.mtrId = mxGraphDiagram.subsDB[i].mtr_id;
            dlObj.subsId = mxGraphDiagram.subsDB[i].subs_id;
            mxGraphDiagram.dlMap.put(dlObj.dlId, dlObj);
        }
    }


    function setSw(id) {
        var swObj;
        for (var i = 0; i < mxGraphDiagram.dbData.length; i++) {
            if (!mxGraphDiagram.swMap.containsKey(mxGraphDiagram.dbData[i].sw_id_b) && mxGraphDiagram.dbData[i].sw_id_f == id && mxGraphDiagram.dbData[i].sw_id_b) {
                swObj = {
                    swId: null,
                    swKindCode: null,
                    dlId: null,
                    parentId: null,
                    childrenId: null,
                    depth: null,
                    level: 0,
                    mxSw: null
                };
                swObj.swId = mxGraphDiagram.dbData[i].sw_id_b;
                swObj.swKindCode = mxGraphDiagram.dbData[i].sw_kind_code_b;
                swObj.dlId = mxGraphDiagram.dlId;
                swObj.parentId = mxGraphDiagram.dbData[i].sw_id_f;
                swObj.childrenId = findChildrenId(mxGraphDiagram.dbData[i].sw_id_b);
                swObj.depth = mxGraphDiagram.swMap.get(id)["depth"] + 1;
                if (swObj.depth > mxGraphDiagram.lastDepth) {
                    mxGraphDiagram.lastDepth = swObj.depth;
                }
                if (swObj.childrenId.length == 0 || (swObj.childrenId.length == 1 && !swObj.childrenId[0]) ||
                    (swObj.childrenId.length == 2 && !swObj.childrenId[0] && !swObj.childrenId[1]) ||
                    (swObj.childrenId.length == 3 && !swObj.childrenId[0] && !swObj.childrenId[1] && !swObj.childrenId[2])) {
                    mxGraphDiagram.lastDepthArr.push(swObj.swId);
                }
                mxGraphDiagram.swMap.put(swObj.swId, swObj);
                setSw(swObj.swId);
            } else {
                continue;
            }
        }
    }

    function findChildrenId(id) {
        var children = [];
        for (var i = 0; i < mxGraphDiagram.dbData.length; i++) {
            if (mxGraphDiagram.dbData[i].sw_id_f == id) {
                children.push(mxGraphDiagram.dbData[i].sw_id_b);
            }
        }
        return children;
    }

    function checkLastDepth() {
        var chkDepth = 0;
        var lastInfo = [];
        if (mxGraphDiagram.lastDepthArr.length == 0)
            return;
        for (var i = 0; i < mxGraphDiagram.lastDepthArr.length; i++) {
            if (chkDepth < mxGraphDiagram.swMap.get(mxGraphDiagram.lastDepthArr[i]).depth) {
                chkDepth = mxGraphDiagram.swMap.get(mxGraphDiagram.lastDepthArr[i]).depth;
                lastInfo[0] = mxGraphDiagram.lastDepthArr[i];
                lastInfo[1] = i;
            }
        }
        mxGraphDiagram.lastDepthArr.splice(lastInfo[1], 1);
        return lastInfo[0];
    }

    function setLevel(id) {
        var pId, gId, sister = "";
        var sisterZero = [];
        var sisterOther = [];
        if (mxGraphDiagram.flagLevel == 1) {
            if (mxGraphDiagram.swMap.get(id).level == 0) {
                mxGraphDiagram.swMap.get(id).level = mxGraphDiagram.swLevel;
                if (mxGraphDiagram.swMap.get(id).parentId) {
                    setLevel(mxGraphDiagram.swMap.get(id).parentId);
                }
            }
            if (mxGraphDiagram.lastDepthArr.length != 0) {
                mxGraphDiagram.flagLevel = 2;
                setLevel(checkLastDepth());
            } else {
                return;
            }
        } else {
            var chkPId = mxGraphDiagram.swMap.get(id).parentId;
            if (mxGraphDiagram.swMap.get(chkPId).level != 0) {
                mxGraphDiagram.swMap.get(id).level = mxGraphDiagram.swMap.get(chkPId).level + 1;
                mxGraphDiagram.flagLevel = 2;
                if (mxGraphDiagram.lastDepthArr.length == 0)
                    return;
                else {
                    setLevel(checkLastDepth());
                }
            } else if (mxGraphDiagram.swMap.get(chkPId).level == 0) {
                parentNull(id);
                pId = mxGraphDiagram.nullParentId;
                gId = mxGraphDiagram.swMap.get(pId).parentId;
                sister = mxGraphDiagram.swMap.get(gId).childrenId;
                for (var i = 0; i < sister.length; i++) {
                    if (sister[i]) {
                        if (pId != sister[i] && mxGraphDiagram.swMap.get(sister[i]).level == 0) {
                            sisterZero.push(sister[i]);
                        } else if (mxGraphDiagram.swMap.get(sister[i]).level > 0) {
                            sisterOther.push(sister[i]);
                        } else {
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
                if (mxGraphDiagram.swMap.get(gId).level == 1) {
                    mxGraphDiagram.swLevel = 2;
                } else if (mxGraphDiagram.swMap.get(gId).level > 1 && sisterZero.length > 0) {
                    mxGraphDiagram.swLevel = mxGraphDiagram.swMap.get(gId).level;
                } else if (mxGraphDiagram.swMap.get(gId).level == mxGraphDiagram.swMap.get(sisterOther[0]).level || mxGraphDiagram.swMap.get(gId).level == mxGraphDiagram.swMap.get(sisterOther[1]).level) {
                    mxGraphDiagram.swLevel = mxGraphDiagram.swMap.get(gId).level + 1;
                } else {
                    return;
                }
                mxGraphDiagram.flagLevel = 1;
                setLevel(id);
            }
        }
    }

    function parentNull(id) {
        var pi = mxGraphDiagram.swMap.get(id).parentId;
        if (pi) {
            if (mxGraphDiagram.swMap.get(pi).level == 0) {
                parentNull(pi);
            } else {
                pi = id;
                mxGraphDiagram.nullParentId = pi;
            }
        } else {
            setLevel(checkLastDepth());
        }
    }


    /**
     * 기존 DL그릴 때와 동일하나 parentNode, childNode가 자동스위치 끼리만 설정되게한다.
     */
    var x1, y1;


    function createAutoSwMap(mtrId, dlArr, i, x, y) {
        if (i > dlArr.length - 1)
            return;
        x1 = x;
        y1 = y;
        var dl = mxGraphDiagram.mtrMap.get(mtrId).dlId[i];
        i++;
        $("#graphContainer").empty();
        mxGraphDiagram.graph.removeCells();
        mxGraphDiagram.dlId = dl;

        mxGraphDiagram.cbId = mxGraphDiagram.dlMap.get(dl).cbId;
        mxGraphDiagram.check = "mtr";

        $.post("/electrical_diagram/dl/sw/all", {dl: mxGraphDiagram.dlId}, function (result_sw) {

            createSwMap(result_sw);

            $.post("/electrical_diagram/dl/line/all", {dl: mxGraphDiagram.dlId}, function (result) {
                //2차원배열 100 X 100
                /*
                 mxGraphDiagram.secMap.clear();
                 mxGraphDiagram.swMap.clear();
                 mxGraphDiagram.padMap.clear();
                 mxGraphDiagram.startSW = null;
                 mxGraphDiagram.drawSW = [];
                 mxGraphDiagram.drawSwAuto = [];
                 mxGraphDiagram.lastDepth = 0;
                 mxGraphDiagram.lastDepthArr = [];
                 mxGraphDiagram.swKeys = [];
                 mxGraphDiagram.secKeys = [];
                 mxGraphDiagram.swLevel = 1;
                 mxGraphDiagram.flagDrawZero = 0;
                 mxGraphDiagram.flagLevel = 1;
                 diagramPosition.x = 10;
                 diagramPosition.y = 300;
                 */
                mxGraphDiagram.dbData = result;

                createLineMap(result);

                var rootNode = mxGraphDiagram.nodeMap.get(mxGraphDiagram.cbId);

                findMainBranch(rootNode);

                scanNodeInMTR(rootNode, mtrId);
                //setChildMaxPath();
                //printDebugString();
                var drawPath = [];
                layoutNodeAndLineNEW(rootNode, RIGHT, x1, y1 + (i * 5), drawPath, true, true);

                //createAutoSwMap(mtrId, dlArr, i, x, y + (i*5))
                //var x = 50;
                //var y = 70;
                var y2 = 0;
                var mtrKey, dlKey;
                mxGraphDiagram.graph.getModel().beginUpdate();
                for (var i = 0; i < mxGraphDiagram.mtrKeys.length; i++) {
                    mtrKey = mxGraphDiagram.mtrKeys[i];
                    var testVertex2 = mxGraphDiagram.graph.insertVertex(parent, mtrKey, mtrKey, x1, y1, 40, 30, 'MTR');
                    mxGraphDiagram.mtrMap.get(mtrKey).mxMtr = testVertex2;
                    y1 = y1 + 100;
                    x1 = x1 + 80
                    for (var j = 0; j < mxGraphDiagram.mtrMap.get(mtrKey).dlId.length; j++) {
                        var dl = mxGraphDiagram.mtrMap.get(mtrKey).dlId[j];
                        var testVertex3 = mxGraphDiagram.graph.insertVertex(parent, dl, dl, x1, y2, 30, 30, 'DL');
                        mxGraphDiagram.dlMap.get(dl).mxDL = testVertex3;
                        y2 = y2 + 25;
                        var testEdge2 = mxGraphDiagram.graph.insertEdge(parent, null, null, mxGraphDiagram.mtrMap.get(mtrKey).mxMtr, testVertex3, 'lineStyle');
                    }
                    y2 = y2 + 10;
                    x = x - 80;
                }
                mxGraphDiagram.graph.getModel().endUpdate();

            });
        });
    }

    /**
     * MTR클릭시의 단선도용
     * 기존 노드 생성 후에 MTR단선도 그리기용 노드맵을 만든다.
     */
    function scanNodeInMTR(parentNode, parentAutoNode) {

        var newParentNode;
        if (mxGraphDiagram.nodeMap.containsKey(parentNode.sw_kind_code)) {
            parentNode.isAutoSwitch = true;
            parentNode.parentNode.push(parentAutoNode);
            parentNode.autoSwChildCnt++;
            newParentNode = parentNode;
            parentAutoNode.childSWMap.push(parentNode);
            mxGraphDiagram.mtrNodeMap.put(parentNode.sw_id, parentNode);
        } else {
            parentNode.isAutoSwitch = false;
            parentNode.parentAutoSwitchId = null;
        }

        var childMap = parentNode.childSWMap;

        //자식노드 루프
        for (var key in childMap) {
            var childNode = childMap[key];
            scanNodeInMTR(childNode, newParentNode ? newParentNode : parentAutoNode);
        } //for child node loop
    }
    var t0, t1;
    function drawDLInMTR(i) {
        var dl = dlArrInMTR[i];
        if (i==0)
            t0 = new Date().getTime();
        if (!dl) {
            t1 = new Date().getTime();
           // alert('time:' + (t1 - t0)/1000);
            console.log('############# draw time : ' + (t1 - t0)/1000);
            if(sf_util.getDiagramMode() == 1){
                $('#loading_modal').modal('hide');
            }
           /* $('#algo_result_show_btn_group').html('단선도 표시가 완료되었습니다.');
            setTimeout(function () {
                $('#algo_result_show_btn_group').html('');
            }, 3000);*/
            return;
        }

        $.post("/electrical_diagram/dl/sw/all", {dl: dl.dl_id}, function (result_sw) {

            createSwMap(result_sw);

            $.post("/electrical_diagram/dl/line/all", {dl: dl.dl_id}, function (result) {

                mxGraphDiagram.secMap.clear();
                mxGraphDiagram.swMap.clear();
                mxGraphDiagram.padMap.clear();
                mxGraphDiagram.startSW = null;
                mxGraphDiagram.drawSW = [];
                mxGraphDiagram.drawSwAuto = [];
                mxGraphDiagram.lastDepth = 0;
                mxGraphDiagram.lastDepthArr = [];
                mxGraphDiagram.swKeys = [];
                mxGraphDiagram.secKeys = [];
                mxGraphDiagram.swLevel = 1;
                mxGraphDiagram.flagDrawZero = 0;
                mxGraphDiagram.flagLevel = 1;
                //diagramPosition.x = dl.x;
                //diagramPosition.y = dl.y;

                mxGraphDiagram.dbData = result;

                createLineMap(result);
                createPadSwMap(result_sw);

                var rootNode = mxGraphDiagram.nodeMap.get(result_sw[0].cb_id);

                findMainBranch(rootNode);

                setChildMaxPath();

                sortNodeByTotalChildNodeCnt();

                updateLineMapForPad();
                startGridX = dl.x/5, startGridY = dl.y/15;
                layoutGrid(rootNode);

                mxGraphDiagram.graph.getModel().beginUpdate();
                drawDL(dl, true);
                mxGraphDiagram.graph.getModel().endUpdate();
                i++;
                drawDLInMTR(i);

            });
        });
    }

    function mxMain(container) {
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error("Browser is not supported!", 200, false);
        }
        else {
            mxGraphHandler.prototype.guidesEnabled = true;
            mxGraphHandler.prototype.useGuidesForEvent = function (me) {
                return !mxEvent.isAltDown(me.getEvent());
            };

            mxEvent.disableContextMenu(container);

            container.style.width = "1372px";
            container.style.height = "690px";
            container.style.margin.auto =
                mxPopupMenu.prototype.submenuImage = "../library/mxgraph/javascript/src/images/menu.svg";

            mxGraphDiagram.graph = new mxGraph(container);

            // -(접기 아이콘) 비활성화
            mxGraphDiagram.graph.isCellFoldable = function (cell) {
                return false;
            };

            // 화면 드래그 가능
            mxGraphDiagram.graph.panningHandler.useLeftButtonForPanning = true;
            //mxGraphDiagram.graph.panningHandler.ignoreCell = false;

            mxGraphDiagram.graph.panningHandler.useLeftButtonForPanning = true;
            mxGraphDiagram.graph.panningHandler.ignoreCell = true;
            mxGraphDiagram.graph.container.style.cursor = 'crosshair';
            mxGraphDiagram.graph.setPanning(true);

            // 화면 드래그하면 선로 애니메이션 효과가 사라져서 mouseUp을 이용해서 선로 애니메이션 효과 유지. mouseDown, mouseMove, mouseUp 세개 다 있어야 함
            // mxGraphDiagram.graph.addMouseListener({
            //     mouseDown: function (sender, evt) {
            //         console.log('1');
            //     },
            //     mouseMove: function (sender, evt) {
            //         console.log('2');
            //     },
            //     mouseUp: function (sender, evt) {
            //         if (mxGraphDiagram.check == "dl") {
            //             applySecFlowAnimation(9500);
            //         }
            //     }
            // });

            mxGraphDiagram.graph.container.style.cursor = "pointer";
            mxGraphDiagram.graph.setPanning(true);
            mxEdgeHandler.prototype.snapToTerminals = true;

            mxGraphDiagram.graph.setTooltips(false);
            mxGraphDiagram.graph.setConnectable(true);
            // zoom in/out
            mxGraphDiagram.graph.centerZoom = false;

            mxGraphDiagram.graph.setEnabled(true);

            mxGraphDiagram.graph.isCellEditable = function (cell) {
                return false;
            };
            mxGraphDiagram.graph.isCellMovable = function (cell) {
                return false;
            };
            mxGraphDiagram.graph.isCellResizable = function (cell) {
                return false;
            };
            mxGraphDiagram.graph.isCellBendable = function (cell) {
                return false;
            };
            mxGraphDiagram.graph.isLabelMovable = function (cell) {
                return false;
            };
            mxGraphDiagram.graph.isTerminalPointMovable = function (cell) {
                return false;
            };
            mxGraphDiagram.graph.isCellDisconnectable = function (cell) {
                return false;
            };

            mxVertexHandler.prototype.getSelectionColor = function () {
                return "#D9418C";
            };
            mxVertexHandler.prototype.getSelectionStrokeWidth = function () {
                return 2;
            };
            mxEdgeHandler.prototype.getSelectionColor = function () {
                return "#D9418C";
            };
            mxEdgeHandler.prototype.getSelectionStrokeWidth = function () {
                return 2;
            };

            mxGraphDiagram.graph.isCellVisible = function (cell) {
                if (cell.customId == "secLoad") {
                    return !this.model.isVertex(cell) || cell.geometry == null || !cell.geometry.relative
                        || cell.geometry.relative == mxGraphDiagram.loadVisible;
                } else if (cell.customId == "current") {
                    return !this.model.isVertex(cell) || cell.geometry == null || !cell.geometry.relative
                        || cell.geometry.relative == mxGraphDiagram.currentVisible;
                } else if (cell.customId == "power") {
                    return !this.model.isVertex(cell) || cell.geometry == null || !cell.geometry.relative
                        || cell.geometry.relative == mxGraphDiagram.powerVisible;
                } else {
                    return !this.model.isVertex(cell) || cell.geometry == null || !cell.geometry.relative
                        || cell.geometry.relative == true;
                }
            };

            // 팝업메뉴
            mxGraphDiagram.graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
                return click_menu(mxGraphDiagram.graph, menu, cell, evt);
            };

            // scroll bar
            mxGraphDiagram.graph.scrollTileSize = new mxRectangle(0, 0, 400, 400);
            mxGraphDiagram.graph.getPagePadding = function () {
                return new mxPoint(Math.max(0, Math.round(mxGraphDiagram.graph.container.offsetWidth - 34)),
                    Math.max(0, Math.round(mxGraphDiagram.graph.container.offsetHeight - 34)));
            };
            mxGraphDiagram.graph.getPageSize = function () {
                return (this.pageVisible) ? new mxRectangle(0, 0, this.pageFormat.width * this.pageScale,
                    this.pageFormat.height * this.pageScale) : this.scrollTileSize;
            };
            mxGraphDiagram.graph.getPageLayout = function () {
                var size = (this.pageVisible) ? this.getPageSize() : this.scrollTileSize;
                var bounds = this.getGraphBounds();

                if (bounds.width == 0 || bounds.height == 0) {
                    return new mxRectangle(0, 0, 1, 1);
                }
                else {
                    // Computes untransformed graph bounds
                    var x = Math.ceil(bounds.x / this.view.scale - this.view.translate.x);
                    var y = Math.ceil(bounds.y / this.view.scale - this.view.translate.y);
                    var w = Math.floor(bounds.width / this.view.scale);
                    var h = Math.floor(bounds.height / this.view.scale);

                    var x0 = Math.floor(x / size.width);
                    var y0 = Math.floor(y / size.height);
                    var w0 = Math.ceil((x + w) / size.width) - x0;
                    var h0 = Math.ceil((y + h) / size.height) - y0;

                    return new mxRectangle(x0, y0, w0, h0);
                }
            };
            new mxRubberband(mxGraphDiagram.graph);
            configureStylesheet(mxGraphDiagram.graph);
            var parent = mxGraphDiagram.graph.getDefaultParent();
            mxGraphDiagram.graph.getModel().beginUpdate();
            sliderOnFlag = false;
            try {
                if (mxGraphDiagram.check == "subs") {
                    var x = 200;
                    var y = 0;
                    var mtrKey, dlKey;
                    var subsPosition = ((25 * mxGraphDiagram.dlMap.size()) + (20 * mxGraphDiagram.mtrMap.size())) / 2;
                    var substation = mxGraphDiagram.graph.insertVertex(parent, mxGraphDiagram.subsId, null, 30, subsPosition, 35, 35, "SUBSTATION");
                    for (var i = 0; i < mxGraphDiagram.mtrKeys.length; i++) {
                        mtrKey = mxGraphDiagram.mtrKeys[i];
                        var dlSize = mxGraphDiagram.mtrMap.get(mtrKey).dlId.length;
                        var subsY = 25 * dlSize / 2;
                        var mtr = mxGraphDiagram.graph.insertVertex(parent, mtrKey, mtrKey, 100, y + subsY, 40, 30, "MTR");
                        mxGraphDiagram.mtrMap.get(mtrKey).mxMtr = mtr;
                        for (var j = 0; j < dlSize; j++) {
                            dlKey = mxGraphDiagram.mtrMap.get(mtrKey).dlId[j];
                            var dlIdName = mxGraphDiagram.dlMap.get(dlKey).dlName + "(" + dlKey + ")";
                            var dl = mxGraphDiagram.graph.insertVertex(parent, dlKey, dlIdName, x, y, 100, 25, "DL");
                            mxGraphDiagram.dlMap.get(dlKey).mxDL = dl;
                            y = y + 25;
                            mxGraphDiagram.graph.insertEdge(parent, null, null, mxGraphDiagram.mtrMap.get(mtrKey).mxMtr, dl, "lineStyle");
                        }
                        y = y + 20;
                        mxGraphDiagram.graph.insertEdge(parent, null, null, substation, mtr, "lineStyle");
                        x = 200
                    }
                } else if (mxGraphDiagram.check == "mtr") {

                    var x = 30;
                    var y = 600;
                    var mtr = mxGraphDiagram.mtrId;
                    var dlSize = mxGraphDiagram.mtrMap.get(mxGraphDiagram.mtrId).dlId.length;
                    var centerChk = (dlSize - 1) * 60;
                    var dlY = 360 - (centerChk / 2);
                    var mtrVertex = mxGraphDiagram.graph.insertVertex(parent, mtr, mtr, x, y, 40, 30, "MTR");
                    mxGraphDiagram.mtrMap.get(mtr).mxMtr = mtrVertex;
                    x = x + 150;
                    dlArrInMTR.length = 0;
                    for (var i = 0; i < dlSize; i++) {
                        var dl = mxGraphDiagram.mtrMap.get(mtr).dlId[i];
                        var dlIdName = mxGraphDiagram.dlMap.get(dl).dlName + "(" + dl + ")";
                        var dlVertex = mxGraphDiagram.graph.insertVertex(parent, dl, dlIdName, x, dlY - 10, 30, 30, "DL");
                        console.assert( x > 0 && x < GRID_ARRAY_SIZE && y > 0 && y < GRID_ARRAY_SIZE, {msg : 'Out of grid!','x' : x, 'y' : y});

                        dlArrInMTR.push({dl_id : dl, x : x - 60, y : dlY});
                        mxGraphDiagram.dlMap.get(dl).mxDL = dlVertex;
                        dlY = dlY + 300;
                        mxGraphDiagram.graph.insertEdge(parent, null, null, mtrVertex, dlVertex, "lineStyle");
                    }

                } else if (mxGraphDiagram.check == "dl") {
                    var symbol;
                    for (var i = 0; i < mxGraphDiagram.drawSW.length; i++) {
                        var sw = mxGraphDiagram.drawSW[i];
                        if (mxGraphDiagram.swKindArr.includes(sw[3])) {
                            // ##TODO : 더미스위치, 변압기 크기 조절하기 위해 조건 걸어줘야 함, 크기를 변경하면 선이 꺾임.
                            // if(mxGraphDiagram.drawSW[i][3]=="DM"){
                            //     symbol = mxGraphDiagram.graph.insertVertex(parent, mxGraphDiagram.drawSW[i][0], null, mxGraphDiagram.drawSW[i][1], mxGraphDiagram.drawSW[i][2], 7, 7, mxGraphDiagram.drawSW[i][3]);
                            // }else{
                            //     symbol = mxGraphDiagram.graph.insertVertex(parent, mxGraphDiagram.drawSW[i][0], null, mxGraphDiagram.drawSW[i][1], mxGraphDiagram.drawSW[i][2], diagramPosition.w, diagramPosition.h, mxGraphDiagram.drawSW[i][3]);
                            // }// 0: id, 1:x, 2:y, 3:kind
                            symbol = mxGraphDiagram.graph.insertVertex(parent, sw[0], null, sw[1], sw[2], diagramPosition.w, diagramPosition.h, sw[3]);
                        } else {
                            symbol = mxGraphDiagram.graph.insertVertex(parent, sw[0], null, sw[1], sw[2], diagramPosition.w, diagramPosition.h, "OBJ_NEW");
                        }
                        mxGraphDiagram.swMap.get(sw[0]).mxSw = symbol;
                        var swCurrent = mxGraphDiagram.graph.insertVertex(symbol, "current", sw[0], 1, 1, 0, 0, "symbolInfoStyle", true);
                        swCurrent.geometry.offset = new mxPoint(-30, 0);
                        $(swCurrent).prop("customId", "current");
                        var swPower = mxGraphDiagram.graph.insertVertex(symbol, "power", "power: " + sw[0], 1, 1, 0, 0, "symbolInfoStyle", true);
                        swPower.geometry.offset = new mxPoint(-40, 10);
                        $(swPower).prop("customId", "power");
                        for (var j = 0; j < mxGraphDiagram.secKeys.length; j++) {
                            if (mxGraphDiagram.secMap.get(mxGraphDiagram.secKeys[j]).swIdFront == sw[0])
                                mxGraphDiagram.secMap.get(mxGraphDiagram.secKeys[j]).mxFront = symbol;
                            if (mxGraphDiagram.secMap.get(mxGraphDiagram.secKeys[j]).swIdBack == sw[0])
                                mxGraphDiagram.secMap.get(mxGraphDiagram.secKeys[j]).mxBack = symbol;
                        }
                    }
                    for (var i = 0; i < mxGraphDiagram.secKeys.length; i++) {
                        var secKey = mxGraphDiagram.secKeys[i];
                        var sec = mxGraphDiagram.graph.insertEdge(parent, mxGraphDiagram.secMap.get(secKey).secId, null, mxGraphDiagram.secMap.get(secKey).mxFront, mxGraphDiagram.secMap.get(secKey).mxBack, "lineStyle");
                        mxGraphDiagram.secMap.get(secKey).mxSec = sec;
                        var secLoad = mxGraphDiagram.graph.insertVertex(sec, "secLoad", mxGraphDiagram.secMap.get(mxGraphDiagram.secKeys[i]).secLoad, 1, 1, 0, 0, "childStyle", true);
                        secLoad.geometry.offset = new mxPoint(-30, 0);
                        $(secLoad).prop("customId", "secLoad");
                    }
                }
            }
            finally {
                mxGraphDiagram.graph.getModel().endUpdate();

            }

            /*
             1. MTR에 소속된 DL데이터(스위치, 라인)를 가져온다.
             2. DL단위로 맵에 담아 그린다.
             */
            clearGrid();
            if (mxGraphDiagram.check == "mtr") {
                try {
                    drawDLInMTR(0);
                } finally {
                    //mxGraphDiagram.graph.centerZoom = true;
                    mxGraphDiagram.graph.zoom(0.5);
                    /*
                    mxGraphDiagram.graph.getModel().beginUpdate();

                    try {
                        var vertices = mxGraphDiagram.graph.getChildVertices(mxGraphDiagram.graph.getDefaultParent());
                        // Resize cells
                        for (var cell in vertices) {
                            var g = cell.getGeometry().clone();
                            var bounds = getView().getState(cell).getLabelBounds();
                            g.setHeight(bounds.getHeight() + 10); //10 is for padding
                            //cellsResized(new Object[] { cell }, new mxRectangle[] { g });
                        }
                    } catch (err) {
                        console.error(err);

                    } finally {
                        mxGraphDiagram.graph.getModel().endUpdate();
                    }
                    */
                    setListener();
                    sliderOnFlag = true;
                }
            } else {
                setListener();
                sliderOnFlag = true;
            }


        }
    };

    function setListener() {
        // Sets initial scrollbar positions
        window.setTimeout(function () {
            var bounds = mxGraphDiagram.graph.getGraphBounds();
            var width = Math.max(bounds.width, mxGraphDiagram.graph.scrollTileSize.width * mxGraphDiagram.graph.view.scale);
            var height = Math.max(bounds.height, mxGraphDiagram.graph.scrollTileSize.height * mxGraphDiagram.graph.view.scale);
            mxGraphDiagram.graph.container.scrollTop = Math.floor(Math.max(0, bounds.y - Math.max(20, (mxGraphDiagram.graph.container.clientHeight - height) / 4)));
            mxGraphDiagram.graph.container.scrollLeft = Math.floor(Math.max(0, bounds.x - Math.max(0, (mxGraphDiagram.graph.container.clientWidth - width) / 2)));
        }, 0);

        // DL 더블 클릭 시 1개 DL 그림으로 변경
        mxGraphDiagram.graph.addListener(mxEvent.DOUBLE_CLICK, function (sender, evt) {
            var cell = evt.getProperty("cell");
            var objInfo;
            if (cell.vertex) {
                if (cell.style == "DL") {
                    sliderManager.sliderToggle(true);
                    $("#selectObjectInfo").text(mxGraphDiagram.dlMap.get(cell.id).dlName);
                    $("#substnm").val(mxGraphDiagram.dlMap.get(cell.id).dlName);
                    mxGraphDiagram.dlId = cell.id;
                    mxGraphDiagram.cbId = mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).cbId;
                    mxGraphDiagram.mtrId = mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).mtrId;
                    mainObj.makeShowValueOptionTable().then(function (resolve) {
                        mainObj.checkShowValueOptionAndSetSlider();
                    });
                    objInfo = {
                        type: "dl",
                        value: [mxGraphDiagram.dlId, "DL", mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).dlNo, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).dlName, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).cbId,
                            mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).mtrId, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).subsId]
                    };
                    showInfoRightMenu(objInfo);
                    showDiagram(cell.id);
                } else if (cell.style == "SUBSTATION") {
                    sliderManager.sliderToggle(false);
                    objInfo = {
                        type: "subs",
                        value: [cell.id, cell.style, mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsNo, mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsName]
                    };
                    showInfoRightMenu(objInfo);
                } else if (cell.style == "MTR") {
                    sliderManager.sliderToggle(false);
                    $("#selectObjectInfo").text(cell.value);
                    $("#substnm").val(cell.value);
                    mxGraphDiagram.mtrId = cell.value;
                    showDiagram("mtr");
                    //console.log('mtr cell: ', cell);
                } else {
                    sliderManager.sliderToggle(false);
                    //sw: [id, kind, dl, mtr, subs]
                    objInfo = {
                        type: "sw",
                        value: [cell.id, cell.style, mxGraphDiagram.dlId, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).mtrId, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).subsId]
                    };
                    showInfoRightMenu(objInfo);
                }

            } else {
                return;
            }

            evt.consume();
        });
    }
// 마우스 오른쪽 클릭 팝업 메뉴
    function click_menu(graph, menu, cell, evt) {
        if (!cell)
            return;
        if (cell.style == "DL") {
            // submenu test
            menu.addSeparator();
            var submenu1 = menu.addItem("알고리즘", null, null);
            menu.addItem("PQMS", null, function () {
                $(".modal-body #subs_id").val(mxGraphDiagram.dlMap.get(cell.id).subsId);
                $(".modal-body #dl_id").val(cell.id);
                $(".modal-body #dl_name").val(mxGraphDiagram.dlMap.get(cell.id).dlName);
                $("#subspqms").modal();
            }, submenu1);
            menu.addItem("기타_01", null, function () {
                alert("기타_01");
            }, submenu1);
            menu.addItem("기타_02", null, function () {
                alert("기타_02");
            }, submenu1);
            menu.addItem("단선도 보기", null, function () {
                $("#selectObjectInfo").text(mxGraphDiagram.dlMap.get(cell.id).dlName);
                showDiagram(cell.id);
            });
            menu.addItem("속성 확인", null, function () {
                var objInfo = {
                    type: "dl",
                    value: [cell.id, cell.style, mxGraphDiagram.dlMap.get(cell.id).dlNo, mxGraphDiagram.dlMap.get(cell.id).dlName, mxGraphDiagram.dlMap.get(cell.id).cbId,
                        mxGraphDiagram.dlMap.get(cell.id).mtrId, mxGraphDiagram.dlMap.get(cell.id).subsId]
                };
                showInfoRightMenu(objInfo);
            });
        } else {
            menu.addItem("속성 확인", null, function () {
                var objInfo;
                if (cell.style == "SUBSTATION") {
                    objInfo = {
                        type: "subs",
                        value: [cell.id, cell.style, mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsNo, mxGraphDiagram.subsMap.get(mxGraphDiagram.subsId).subsName]
                    };
                } else if (cell.style == "MTR") {
                    objInfo = {
                        type: "mtr",
                        value: [cell.id, cell.style, mxGraphDiagram.mtrMap.get(cell.id).bankNo]
                    };
                } else {
                    objInfo = {
                        type: "sw",
                        value: [cell.id, cell.style, mxGraphDiagram.nodeMap.get(cell.id).sw_name, mxGraphDiagram.dlId, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).mtrId, mxGraphDiagram.dlMap.get(mxGraphDiagram.dlId).subsId]
                    };
                }
                showInfoRightMenu(objInfo);
            });
        }
    }

});     // end