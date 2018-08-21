simulator = {
    codeMap: new HashMap(),
    subsMap: new HashMap(),
    mtrMap: new HashMap(),
    dlMap: new HashMap(),
    secMap: new HashMap(),
    swMap: new HashMap(),
    padMap: new HashMap(),

    //park
    grid: null,
    nodeMap: new HashMap(),
    lineMap: new HashMap(),
    directionPerDepth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    mainBranchPath: [],
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

    newModalObj: null,
    newModalSecObj1: null,
    newModalSecObj2: null,
    removed: null,

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

addRemoveObj = {};

simulatorPosition = {
    x: 10,
    y: 280,
    w: 20,
    h: 20,
    line: 50,
    pad_w: 5,
    pad_h: 5,
    maxX: 0
};

memory = {
    scale: 1,
    graphBounds: null,
    x: 0,
    y: 0,
    swData: null,
    lineData: null

};

var startGridX = 100, startGridY = 150; //그리드에 최초로 그려질 위치
var RIGHT = 1, LEFT = 2, UP = 4, DOWN = 8, NONE = 0;
var BASIC_DIRECTION = RIGHT;
var GRID_CELL_SIZE = 60;
var GRID_ARRAY_SIZE = 600;
var SAFE_ZONE_SIZE = 3;
var totalConflictCnt = 0;
var LINE_CONFLICT = 1, NODE_CONFLICT = 2;
var NO_CONFLICT = 0, CONFLICT = 1;
ALL_CONFLICT = 10; //ALL_CONFLICT는 모든 방향이 충돌나는 경우임. 노드, 라인 다 지우고 상위로 올라가서 다시 그려야함.
var GRID_INDEX_OVER = -1;
var gridLayoutCallCnt = 0;
var gridMinX = Number.MAX_SAFE_INTEGER, gridMinY = Number.MAX_SAFE_INTEGER,
    gridMaxX = Number.MIN_SAFE_INTEGER, gridMaxY = Number.MIN_SAFE_INTEGER;

var createEditorMenu = function () {
    $("#nav").empty();
    $.post("/electrical_diagram/editorObj/all", function (result) {
        var categoryList = [];
        for (var i = 0; i < result.length; i++) {
            var categoryName = result[i].catogory_name;     // 카테고리 이름
            var filePath = result[i].file_path;              // 이미지 경로
            var imgName = result[i].symbol_name;            // 이미지 한글 이름
            var tableId = "editorMenuTable_" + categoryName;// 테이블 id
            var beforeImgId = filePath.split("/").splice(-1, 1)[0].split(".")[0].trim();// 이미지 경로 문자열을 잘라서....?파싱?????? 이미지 id 만들기
            var imgId = "simulatorDragImg_" + beforeImgId;    // 이미지 id
            if (categoryList.indexOf(categoryName) == -1) {
                categoryList.push(categoryName);
                var addCategoryHtml = "<li class='has_sub' id='openSub'><a href='#'>" + categoryName + "<span class='pull-right' style='width: 30px; height: 30px;'>" +
                    "<i class='fa fa-chevron-right' style='width: 30px; height: 30px; line-height:normal;'></i></span></a><ul>" +
                    "<table class='table' id='" + tableId + "' style='width: 190px; margin-bottom: 0px;'><tbody><tr>" +
                    "<td align='center'><img src='" + filePath + "' style='width: 30px; height: 30px;' id='" + imgId + "' draggable='true' ondragstart='drag(event)'/></td>" +
                    "<td style='vertical-align: middle;'>" + imgName + "</td></tr></tbody>";
                $("#nav").append(addCategoryHtml);
            } else {
                var addTableHtml = "<tr><td align='center'><img src='" + filePath + "' style='width: 30px; height: 30px;' id='" + imgId + "' draggable='true' ondragstart='drag(event)'/></td>" +
                    "<td style='vertical-align: middle;'>" + imgName + "</td></tr>";
                $("#" + tableId + " > tbody:last").append(addTableHtml);
            }
        }
    });
};

// drag and drop
function allowDrop(ev) {
    ev.preventDefault();
    var lines = simulator.lineMap.values();

    var mouse_x = ev.layerX;
    var mouse_y = ev.layerY;
    var dragArea = 20 * simulator.graph.view.scale;

    var state;
    var color = "#FFF20B";
    var originalColor = "#FFFFFF";
    var strokeWidth = 4;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var mxSec = lines[i].mxSec;
        state = simulator.graph.view.getState(mxSec);

        var sw_id_f = line.sw_id_f;
        var sw_id_b = line.sw_id_b;

        var sw_f = simulator.nodeMap.get(sw_id_f);
        var sw_b = simulator.nodeMap.get(sw_id_b);

        if (!line) {
            continue;
        }
        if (state && state.shape.node.getElementsByTagName('path') && state.shape.node.getElementsByTagName('path')[1]) {
            state.shape.node.getElementsByTagName('path')[1].removeAttribute('visibility');
            state.shape.node.getElementsByTagName('path')[1].setAttribute('stroke-width', '1');
            state.shape.node.getElementsByTagName('path')[1].setAttribute('stroke', originalColor);
        }
        if (sw_f && sw_b) {
            // 선로에 연결된 스위치들 중 패드스위치면 해당 스위치의 padNode에 들어있는 mxSw로 계산
            var source = sw_f.padNode ? simulator.graph.view.getState(sw_f.padNode.mxSw) : simulator.graph.view.getState(sw_f.mxSw);
            var target = sw_b.padNode ? simulator.graph.view.getState(sw_b.padNode.mxSw) : simulator.graph.view.getState(sw_b.mxSw);

            if(!source || !target){     // nodeMap에 있는 모든 스위치들이 그려지는게 아니라서 mxSw가 없으면 다음 선로 비교하기
                continue;
            }

            // simulator.lineMap 비교
            if (source.x <= mouse_x && target.x >= mouse_x) {
                if (Math.abs(source.y - mouse_y) < dragArea && Math.abs(target.y - mouse_y) < dragArea) {
                    if (state && state.shape.node.getElementsByTagName('path') && state.shape.node.getElementsByTagName('path')[1]) {
                        state.shape.node.getElementsByTagName('path')[1].removeAttribute('visibility');
                        state.shape.node.getElementsByTagName('path')[1].setAttribute('stroke-width', strokeWidth);
                        state.shape.node.getElementsByTagName('path')[1].setAttribute('stroke', color);
                    }
                }
            } else if (source.x >= mouse_x && target.x <= mouse_x) {
                if (Math.abs(source.y - mouse_y) < dragArea && Math.abs(target.y - mouse_y) < dragArea) {
                    if (state && state.shape.node.getElementsByTagName('path') && state.shape.node.getElementsByTagName('path')[1]) {
                        state.shape.node.getElementsByTagName('path')[1].removeAttribute('visibility');
                        state.shape.node.getElementsByTagName('path')[1].setAttribute('stroke-width', strokeWidth);
                        state.shape.node.getElementsByTagName('path')[1].setAttribute('stroke', color);
                    }
                }
            } else if (source.y <= mouse_y && target.y >= mouse_y) {
                if (Math.abs(source.x - mouse_x) < dragArea && Math.abs(target.x - mouse_x) < dragArea) {
                    if (state && state.shape.node.getElementsByTagName('path') && state.shape.node.getElementsByTagName('path')[1]) {
                        state.shape.node.getElementsByTagName('path')[1].removeAttribute('visibility');
                        state.shape.node.getElementsByTagName('path')[1].setAttribute('stroke-width', strokeWidth);
                        state.shape.node.getElementsByTagName('path')[1].setAttribute('stroke', color);
                    }
                }
            } else if (source.y >= mouse_y && target.y <= mouse_y) {
                if (Math.abs(source.x - mouse_x) < dragArea && Math.abs(target.x - mouse_x) < dragArea) {
                    if (state && state.shape.node.getElementsByTagName('path') && state.shape.node.getElementsByTagName('path')[1]) {
                        state.shape.node.getElementsByTagName('path')[1].removeAttribute('visibility');
                        state.shape.node.getElementsByTagName('path')[1].setAttribute('stroke-width', strokeWidth);
                        state.shape.node.getElementsByTagName('path')[1].setAttribute('stroke', color);
                    }
                }
            } else {
                /*if (state && state.shape.node.getElementsByTagName('path') && state.shape.node.getElementsByTagName('path')[]) {
                    state.shape.node.getElementsByTagName('path')[0].removeAttribute('visibility');
                    state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke-width', '1');
                    state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke', originalColor);
                }*/
            }
        }
    }


}

function drag(ev) {
    ev.dataTransfer.setData("id", ev.target.id);
    // var chkKind = ["pv", "wt", "ess"];
    var kind = ev.target.id.split("_")[1].trim();
    // console.log("id: ", ev.target.id);
    // console.log("kind: ", kind);

    if(kind == "pv" || kind == "wt" || kind == "ess"){
        // console.log("★ kind:", kind);
        var dragIcon = document.createElement('img');
        dragIcon.src = "library/mxgraph/javascript/src/symbol/draw_dg.svg";
        ev.dataTransfer.setDragImage(dragIcon, 10, 80);       // setDragImage(img, x, y) x, y는 마우스 포인터에서부터 간격???을 말하는거 같음
        // console.log("change!!!", ev.dataTransfer);
    }


/*    for(var i in chkKind){
        if(kind == chkKind[i]){
            console.log("★kind: ", kind.trim());
            // var dragIcon = new Image(10, 10);

        }
    }*/
}

function drop(ev) {
    ev.preventDefault();

    var lines = simulator.lineMap.values();
    var nodes = simulator.nodeMap.values();

    var mouse_x = ev.layerX;
    var mouse_y = ev.layerY;

    var frontSw;
    var backSw;
    var dragArea = 30 * simulator.graph.view.scale;

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var sw_id_f = line.sw_id_f;
        var sw_id_b = line.sw_id_b;
        var sw_f = simulator.nodeMap.get(sw_id_f);
        var sw_b = simulator.nodeMap.get(sw_id_b);

        if (!line) {
            continue;
        }

        if (sw_f && sw_b) {
            // var source = simulator.graph.view.getState(sw_f.mxSw);
            // var target = simulator.graph.view.getState(sw_b.mxSw);

            // 선로에 연결된 스위치들 중 패드스위치면 해당 스위치의 padNode에 들어있는 mxSw로 계산
            var source = sw_f.padNode ? simulator.graph.view.getState(sw_f.padNode.mxSw) : simulator.graph.view.getState(sw_f.mxSw);
            var target = sw_b.padNode ? simulator.graph.view.getState(sw_b.padNode.mxSw) : simulator.graph.view.getState(sw_b.mxSw);

            if(!source || !target){     // nodeMap에 있는 모든 스위치들이 그려지는게 아니라서 mxSw가 없으면 다음 선로 비교하기
                continue;
            }

            // simulator.lineMap 비교
            if (source.x <= mouse_x && target.x >= mouse_x) {
                if (Math.abs(source.y - mouse_y) < dragArea && Math.abs(target.y - mouse_y) < dragArea) {
                    frontSw = sw_id_f;
                    backSw = sw_id_b;
                    break;
                }
            } else if (source.x >= mouse_x && target.x <= mouse_x) {
                if (Math.abs(source.y - mouse_y) < dragArea && Math.abs(target.y - mouse_y) < dragArea) {
                    frontSw = sw_id_f;
                    backSw = sw_id_b;
                    break;
                }
            } else if (source.y <= mouse_y && target.y >= mouse_y) {
                if (Math.abs(source.x - mouse_x) < dragArea && Math.abs(target.x - mouse_x) < dragArea) {
                    frontSw = sw_id_f;
                    backSw = sw_id_b;
                    break;
                }
            } else if (source.y >= mouse_y && target.y <= mouse_y) {
                if (Math.abs(source.x - mouse_x) < dragArea && Math.abs(target.x - mouse_x) < dragArea) {
                    frontSw = sw_id_f;
                    backSw = sw_id_b;
                    break;
                }
            } else {
                // simulator.nodeMap 비교: 선로가 없는 곳에 드롭했을 경우
                for (var j = 0; j < nodes.length; j++) {
                    var nodeState = simulator.graph.view.getState(nodes[j].mxSw);
                    if (!nodes[j].mxSw)
                        continue;
                    if (Math.abs(nodeState.x - ev.layerX) < dragArea && Math.abs(nodeState.y - ev.layerY) < dragArea) {
                        // console.log(nodes[j].sw_id + ' : ' + nodes[j].sw_name);
                        frontSw = nodes[j].sw_id;
                        backSw = null;
                        break;
                    }
                }
            }
        }
    }

    // 차단기에는 추가 안됨
    if (frontSw == Number(simulator.cbId)) {
        return;
    } else {
        var parentChildSize = 0;
        var pKey;
        for (pKey in simulator.nodeMap.get(frontSw).childSWMap) {
            if (map.hasOwnProperty(pKey)) {
                parentChildSize++;
            }
        }
        if (parentChildSize >= 3) {
            return;
        } else {
            $("#addObjFrontSwId").val(frontSw);
            $("#addObjBackSwId").val(backSw);

            var id = ev.dataTransfer.getData("id");
            var objKind = id.split("_")[1].trim();

            if ($("tr[name=temporaryTr]")) {
                $("tr[name=temporaryTr]").remove();
            }

            $("#addObjKind").text(objKind.toUpperCase());
            $("#addObjDlId").text(mxGraphDiagram.dlMap.get(simulator.dlId).dlName + "(" + simulator.dlId + ")");
            $("#addObjMtrId").text(simulator.mtrId);
            $("#addObjSubsName").text(mxGraphDiagram.subsMap.get(simulator.subsId).subsName + "(" + simulator.subsId + ")");
            if (objKind == "pv") {
                var addHtml = "<tr name='temporaryTr'><th scope='row'>발전기 용량</th><td><label><input type='text' class='form-control form-control-sm' id='addObjGeneratorCapacity' style='width:120px' ></label>" +
                    "<span class='pull-right' style='vertical-align: center; height: 29px;'>KVA</span></td></tr>";
                $("#addObjTable > tbody:last").append(addHtml);
            }
            $("#addObjInfoModal").modal();
        }
    }
}

$(function () {
    // 시뮬레이터 다시 그리는 함수
    function redrawSimulator() {
        $("#simulatorDrawDiv").empty();
        simulator.graph.removeCells();
        var rootNode = simulator.nodeMap.get(simulator.cbId);
        for (var key in simulator.nodeMap.map) {
            simulator.nodeMap.get(key).countId = 0;
            simulator.nodeMap.get(key).isConnected = false;
        }
        findMainBranch(rootNode);
        setChildMaxPath();
        sortNodeByTotalChildNodeCnt();
        updateLineMapForPad();
        layoutGrid(rootNode);
        mxMain2($("#simulatorDrawDiv")[0]);
        // callAnimation();
        mainObj.makeShowValueOptionTable().then(function (resolve) {
            mainObj.checkShowValueOptionAndSetSlider();
            // sliderManager.getPqmsDataProcess(1, 1, 1, 0);
        });
    }

    // $("#refresh"): 초기화 버튼 클릭 이벤트: hash map 깊은 복사가 어려워 db data를 이용해 nodeMap, lineMap을 새로 생성
    $("#refresh").on("click", function () {
        if ($("#modeChange").is(":checked")) {   // true: 시뮬레이션 모드
            simulator.nodeMap.clear();
            simulator.lineMap.clear();
            memory.scale = 1;
            memory.x = 0;
            memory.y = 0;
            createSwMap(memory.swData);
            createLineMap(memory.lineData);
            createPadSwMap(memory.swData);
            redrawSimulator();  // 시뮬레이터 다시 그리기 위한 함수
        }
    });

    // 에디터 영역 펼쳐기 가능하게
    $(document).on("click", "#openSub > a", function (e) {
        e.preventDefault();
        var menu_li = $(this).parent("li");
        var menu_ul = $(this).next("ul");

        if (menu_li.hasClass("open")) {
            menu_ul.slideUp(350);
            menu_li.removeClass("open")
        } else {
            $("#nav > li > ul").slideUp(350);
            $("#nav > li").removeClass("open");
            menu_ul.slideDown(350);
            menu_li.addClass("open");
        }
    });

    // modal 움직일 수 있게
    $("#addObjInfoModal").draggable({
        handle: ".modal-header"
    });

    // modal close event
    $("#addObjInfoModal").on("hidden.bs.modal", function () {
        $("#addObjInfoForm")[0].reset();
        $("#checkAddInfo").text("");
        $("#checkAddInfo").attr("class", "text-primary");
        callAnimation();
       /* var lines = simulator.lineMap.values();
        for (var i = 0; i < lines.length; i++) {
            var mxSec = lines[i].mxSec;
            state = simulator.graph.view.getState(mxSec);
            var state;
            if (state && state.shape.node.getElementsByTagName('path') && state.shape.node.getElementsByTagName('path')[0]) {
                state.shape.node.getElementsByTagName('path')[0].removeAttribute('visibility');
                state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke-width', '1');
                state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke', "#FFFFFF");
            }
        }*/
    });

    // Object 추가-확인 버튼 클릭 이벤트
    $("#addObjSubmit").on("click", function () {
        var checkAddInfo = $("#checkAddInfo").attr("class");
        var addObjId = $("#addObjId").val();
        var addObjLoc = $("#addObjLoc").val();
        var addObjKind = $("#addObjKind").text();
        var addObjFrontSwId = $("#addObjFrontSwId").val();
        var addObjBackSwId = $("#addObjBackSwId").val();
        var addObjFrontSecLength = $("#addObjFrontSecLength").val();
        var addObjBackSecLength = $("#addObjBackSecLength").val();

        if (checkAddInfo == "text-danger") {
            return;
        } else {
            if (!addObjId) {
                $("#checkAddInfo").text("ID를 입력하세요.");
                $("#addObjId").focus();
                return false;
            } else if (!addObjFrontSwId) {
                $("#checkAddInfo").text("앞 스위치 ID를 입력하세요.");
                $("#addObjFrontSwId").focus();
                return false;
            } else if (!addObjFrontSecLength) {
                $("#checkAddInfo").text("앞 선로 길이를 입력하세요.");
                $("#addObjFrontSecLength").focus();
                return false;
            } else if (addObjBackSwId && !addObjBackSecLength) {
                $("#checkAddInfo").text("뒤 선로 길이를 입력하세요.");
                $("#addObjBackSecLength").focus();
                return false;
            } else {
                var addObj = {
                    sw_id: addObjId,
                    kind: addObjKind,
                    sw_loc: addObjLoc,
                    sw_id_f: addObjFrontSwId,
                    sw_id_b: addObjBackSwId,
                    sec_length_f: addObjFrontSecLength,
                    sec_length_b: addObjBackSecLength
                };
                changeNodeMap(addObj);
                changeSecMap(addObj);

                // 시뮬레이션 추가, 삭제 시 축척과 위치 변경 안되도록 저장
                memory.scale = simulator.graph.view.scale;
                memory.x = simulator.graph.view.translate.x;
                memory.y = simulator.graph.view.translate.y;

                redrawSimulator();
            }
        }
    });

    var pvDetail = {
        generatorCapacity: null,
        kind : "PV"
    };

    // nodeMap에 node 추가하고 앞,뒤 node 변경하기
    function changeNodeMap(obj) {
        var sw_id = obj.sw_id;
        var kind = obj.kind;
        var sw_loc = obj.sw_loc;
        var sw_id_f = obj.sw_id_f;
        var sw_id_b = obj.sw_id_b;
        var parentSWMap = simulator.nodeMap.get(sw_id_f);
        var childSWMap = simulator.nodeMap.get(sw_id_b);

        var node = new Object({
            sw_id: sw_id,
            sw_kind_id: null,
            sw_kind_code: '',
            sw_name: sw_loc,
            parentSWMap: {},
            childSWMap: {},
            gridX: -1,
            gridY: -1,
            autoSwChildCnt: 0,          // 추가
            isAutoSwitch: false,
            isPad: false,
            padleId: sw_id,//sw_frtu.sw_loc_no
            isPadChild: false, //일반 스위치
            isPadParent: false,//일반 스위치
            isVisible: true,
            isChecke: false,
            isChildChecked: false,
            isFinalNode: false,
            path: [], //마지막노드인 경우에 depth값.
            isMainBranch: false,
            branchCheckFlag: false,
            dl_id: simulator.dlId,//sw_frtu.dl_id
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

        if (kind == "PV") {
            node.sw_kind_code = "DG";
            node["detail"] = pvDetail;
            var generatorCapacity = $("#addObjGeneratorCapacity").val();
            node.detail.generatorCapacity = generatorCapacity;
        } else {
            node.sw_kind_code = kind;
        }

        simulator.nodeMap.put(sw_id, node);
        simulator.nodeMap.get(sw_id).parentSWMap[sw_id_f] = parentSWMap;


        if (childSWMap) { // sw_id_f, sw_id_b 둘 다 있을 때
            simulator.nodeMap.get(sw_id).childSWMap[sw_id_b] = childSWMap;
            delete simulator.nodeMap.get(sw_id_f).childSWMap[sw_id_b];
            simulator.nodeMap.get(sw_id_f).childSWMap[sw_id] = simulator.nodeMap.get(sw_id);
            delete simulator.nodeMap.get(sw_id_b).parentSWMap[sw_id_f];
            simulator.nodeMap.get(sw_id_b).parentSWMap[sw_id] = simulator.nodeMap.get(sw_id);
        } else {  // sw_id_f 만 있을 때
            simulator.nodeMap.get(sw_id).parentSWMap[sw_id_f] = parentSWMap;
            simulator.nodeMap.get(sw_id_f).childSWMap[sw_id] = simulator.nodeMap.get(sw_id);
        }
    }

    function changeSecMap(obj) {
        var sw_id = obj.sw_id;
        var sw_id_f = obj.sw_id_f;
        var sw_id_b = obj.sw_id_b;
        var sec_length_f = obj.sec_length_f;
        var sec_length_b = obj.sec_length_b;
        var secId = findSecId(sw_id_f, sw_id_b);
        var sec_f = simulator.lineMap.get(secId);
        var sec_b = simulator.lineMap.get(secId);
        if (sec_b) {
            var line_f = new Object({
                secId: secId + "_A",
                sw_id_f: sec_f.sw_id_f,
                sw_id_b: sw_id,
                secLength: sec_length_f,
                secLoad: sec_f.secLoad,
                parentNode: simulator.nodeMap.get(sec_f.sw_id_f),
                childNode: simulator.nodeMap.get(sw_id),
                shape: null
            });
            var line_b = new Object({
                secId: secId + "_B",
                sw_id_f: sw_id,
                sw_id_b: sec_b.sw_id_b,
                secLength: sec_length_b,
                secLoad: sec_b.secLoad,
                parentNode: simulator.nodeMap.get(sw_id),
                childNode: simulator.nodeMap.get(sec_b.sw_id_b),
                shape: null
            });
            simulator.lineMap.put(line_f.secId, line_f);
            simulator.lineMap.put(line_b.secId, line_b);
            simulator.lineMap.remove(secId);
        } else {
            var line = new Object({
                secId: sw_id_f + "_" + sw_id,
                sw_id_f: sw_id_f,
                sw_id_b: sw_id,
                secLength: sec_length_f,
                secLoad: 0,
                parentNode: simulator.nodeMap.get(sw_id_f),
                childNode: simulator.nodeMap.get(sw_id),
                shape: null
            });
            simulator.lineMap.put(line.secId, line);
        }
    }

    // sec id 찾기
    function findSecId(id_f, id_b) {
        var lineKey = simulator.lineMap.keys();
        var lineMap = simulator.lineMap;
        for (var i = 0; i < lineKey.length; i++) {
            var key = lineKey[i];
            if (id_b && (lineMap.get(key).sw_id_f == id_f && lineMap.get(key).sw_id_b == id_b)) {
                return key;
            } else if (!id_b) {
                if (lineMap.get(key).sw_id_f == id_f) {
                    return key;
                }
            }
        }
    }

    function findSecIdInPad(id_f, id_b) {
        var lineKey = simulator.lineMap.keys();
        var lineMap = simulator.lineMap;
        for (var i = 0; i < lineKey.length; i++) {
            var key = lineKey[i];
            if (id_b && (lineMap.get(key).sw_id_f == id_f && lineMap.get(key).sw_id_b == id_b)) {
                return key;
            } else if (!id_b) {
                if (lineMap.get(key).sw_id_f == id_f) {
                    return key;
                }
            }
        }
    }

    // 추가하는 Object ID 존재 유무
    $("#addObjId").keyup(function () {
        var sw_id = $(this).val();
        var regNumber = /^[0-9]*$/;
        if (!regNumber.test(sw_id)) {
            $("#checkAddInfo").attr("class", "text-danger");
            $("#checkAddInfo").text("숫자만 입력하세요.");
            return;
        } else {
            $.post("/electrical_diagram/checkSwId", {id: sw_id}, function (result) {
                if (result.length > 0) {
                    $("#checkAddInfo").attr("class", "text-danger");
                    $("#checkAddInfo").text("존재하는 ID입니다.");
                    return;
                } else {
                    $("#checkAddInfo").attr("class", "text-primary");
                    $("#checkAddInfo").text("사용 가능한 ID입니다.");
                }
            });
        }
    });

    // 앞 스위치 존재 유무
    $("#addObjFrontSwId").keyup(function () {
        var nodeKeys = simulator.nodeMap.keys();
        var id;
        var sw_id_f = $(this).val();
        for (id in nodeKeys) {
            if (sw_id_f == nodeKeys[id]) {
                $("#checkAddInfo").attr("class", "text-primary");
                $("#checkAddInfo").text("사용 가능한 ID입니다.");
            } else {
                $("#checkAddInfo").attr("class", "text-danger");
                $("#checkAddInfo").text("존재하지않는 ID입니다.");
                return;
            }
        }
    });

    // 뒤 스위치 존재 유무
    $("#addObjBackSwId").keyup(function () {
        var sw_id_b = $(this).val();
        if (sw_id_b) {
            var nodeKeys = simulator.nodeMap.keys();
            var id;
            for (id in nodeKeys) {
                if (sw_id_b == nodeKeys[id]) {
                    $("#checkAddInfo").attr("class", "text-primary");
                    $("#checkAddInfo").text("사용 가능한 ID입니다.");
                } else if (sw_id_b == $("#addObjFrontSwId").val()) {
                    $("#checkAddInfo").attr("class", "text-danger");
                    $("#checkAddInfo").text("앞 스위치와 같은 아이디는 입력할 수 없습니다.");
                    return;
                } else {
                    $("#checkAddInfo").attr("class", "text-danger");
                    $("#checkAddInfo").text("존재하지않는 ID입니다.");
                    return;
                }
            }
        }
    });

    $("#addObjId").focusout(function () {
        if ($("#checkAddInfo").attr("class") == "text-danger") {
            $("#addObjId").focus();
            return;
        } else {
            $("#checkAddInfo").text("");
        }
    });
    $("#addObjFrontSwId").focusout(function () {
        if ($("#checkAddInfo").attr("class") == "text-danger") {
            return;
        } else {
            $("#checkAddInfo").text("");
        }
    });
    $("#addObjBackSwId").focusout(function () {
        if ($("#checkAddInfo").attr("class") == "text-danger") {
            return;
        } else {
            $("#checkAddInfo").text("");
        }
    });

    // 스위치 우측 클릭 이벤트
    function rightClickMenu(graph, menu, cell, evt) {
        if (!cell && !cell.vertex) {
            return;
        } else {
            menu.addSeparator();
            menu.addItem("삭제", null, function () {
                memory.scale = simulator.graph.view.scale;
                memory.x = simulator.graph.view.translate.x;
                memory.y = simulator.graph.view.translate.y;
                deleteNode(cell);   // 스위치 삭제 함수
                redrawSimulator();
            })
        }
    }

    // 스위치 삭제
    function deleteNode(cell) {
        var sw_id = cell.swId;
        var node = simulator.nodeMap.get(sw_id);
        var parentNode = node.parentSWMap;
        var childNode = node.childSWMap;
        var parentId = [];
        var key;

        for (key in parentNode) {
            parentId.push(key);
        }

        //pad노드인 경우의 삭제
        if (node.isPadParent && Object.keys(node.childSWMap).length > 0) {

            node.removeLines();
            simulator.nodeMap.remove(sw_id);
            for (var key in node.padChild) {
                simulator.nodeMap.remove(key);
                var pd = node.padChild[key];
               // delete pd;
            }
            //delete node;
            return;
        }

        if (parentId.length == 1) {
            var childSize = findNodeSize(childNode);
            if (childSize == 0) {
                delete simulator.nodeMap.get(parentId[0]).childSWMap[sw_id];
                var secId = findSecId(parentId[0], sw_id);
                simulator.lineMap.remove(secId);
                simulator.nodeMap.remove(sw_id);
            } else if (childSize >= 1 && childSize <= 3) {
                var childKeys = [];
                var cKey;
                for (cKey in childNode) {
                    childKeys.push(cKey);
                }
                var pId = parentId[0];
                var sec_id_f = findSecId(pId, sw_id);
                var sec_f = simulator.lineMap.get(sec_id_f);
                var removeSecId = [];
                removeSecId.push(sec_id_f);
                for (var i = 0; i < childKeys.length; i++) {
                    if (simulator.nodeMap.get(pId).childSWMap[sw_id]) {
                        delete simulator.nodeMap.get(pId).childSWMap[sw_id];
                    }
                    simulator.nodeMap.get(pId).childSWMap[childKeys[i]] = childNode[childKeys[i]];

                    delete simulator.nodeMap.get(childKeys[i]).parentSWMap[sw_id];
                    simulator.nodeMap.get(childKeys[i]).parentSWMap[pId] = parentNode[pId];

                    var sec_id_b = findSecId(sw_id, childKeys[i]);
                    var sec_b = simulator.lineMap.get(sec_id_b);

                    var line = new Object({
                        secId: sec_id_f + "_" + sec_id_b,
                        sw_id_f: pId,
                        sw_id_b: childKeys[i],
                        secLength: sec_f.secLength + sec_b.secLength,
                        secLoad: 0,
                        parentNode: parentNode,
                        childNode: childNode[i],
                        shape: null
                    });
                    simulator.lineMap.put(line.secId, line);
                    if (removeSecId.indexOf(sec_id_b) == -1) {
                        removeSecId.push(sec_id_b);
                    }
                }
                for (var i = 0; i < removeSecId.length; i++) {
                    simulator.lineMap.remove(removeSecId[i]);
                }
                simulator.nodeMap.remove(sw_id);
            } else {
                console.log("delete Node, childNode size: ", childSize);
            }
        } else {
            console.error("delete Node, parentNode가 1개 이상인 경우:  ", sw_id);
        }
    }

    // node key 개수 구하기
    function findNodeSize(map) {
        var size = 0;
        var key;
        for (key in map) {
            if (map.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    }

    $("#simulatorDlId").on("change", function () {
        if (simulator.graph) {
            $("#simulatorDrawDiv").empty();
            simulator.graph.removeCells();
        }
        simulator.dlId = $("#simulatorDlId").val();
        simulator.cbId = mxGraphDiagram.cbId;
        simulator.mtrId = mxGraphDiagram.mtrId;
        simulator.subsId = mxGraphDiagram.subsId;
        memory.scale = 1;
        memory.x = 0;
        memory.y = 0;

        // $.post("/electrical_diagram/searchDL", {dl: simulator.dlId}, function (result) {
        //     simulator.dbData = result;
        //     simulatorDraw();
        // });
        $.post('/electrical_diagram/kindcode/all', {}, function (result_code) {
            createCode(result_code);
            $.post("/electrical_diagram/dl/sw/all", {dl: simulator.dlId}, function (result_sw) {
                //setLevel(checkLastDepth());
                memory.swData = result_sw;
                createSwMap(result_sw);

                $.post("/electrical_diagram/dl/line/all", {dl: simulator.dlId}, function (result) {
                    //2차원배열 100 X 100
                    memory.lineData = result;

                    simulator.secMap.clear();
                    simulator.swMap.clear();
                    simulator.padMap.clear();
                    simulator.startSW = null;
                    simulator.drawSW = [];
                    simulator.drawSwAuto = [];
                    simulator.lastDepth = 0;
                    simulator.lastDepthArr = [];
                    simulator.swKeys = [];
                    simulator.secKeys = [];
                    simulator.swLevel = 1;
                    simulator.flagDrawZero = 0;
                    simulator.flagLevel = 1;
                    diagramPosition.x = 10;
                    diagramPosition.y = 300;
                    simulator.load.original = null;
                    simulator.load.pqms = null;
                    simulator.load.pv = null;
                    simulator.load.pqmsMinusPv = null;
                    simulator.load.sectionLoad = null;
                    simulator.callAlgorithmList = [];

                    simulator.dbData = result;

                    createLineMap(result);
                    createPadSwMap(result_sw);

                    var rootNode = simulator.nodeMap.get(mxGraphDiagram.cbId);

                    findMainBranch(rootNode);

                    setChildMaxPath();

                    sortNodeByTotalChildNodeCnt();

                    updateLineMapForPad();

                    layoutGrid(rootNode);

                    //위의 처리를 기반으로 그리기
                    mxMain2($("#simulatorDrawDiv")[0]);
                    //simulatorDraw();

                });
            });
        });
    });

    function mxMain2(container) {
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error("Browser is not supported!", 200, false);
        }
        else {

            mxGraphHandler.prototype.guidesEnabled = true;
            mxGraphHandler.prototype.useGuidesForEvent = function (me) {
                return !mxEvent.isAltDown(me.getEvent());
            };
            if (mxEvent) {
                mxEvent.disableContextMenu(container);
            } else {
                console.error('mxEvent is null');
            }
            container.style.width = "1372px";
            container.style.height = "690px";

            mxPopupMenu.prototype.submenuImage = "../library/mxgraph/javascript/src/images/menu.svg";

            simulator.graph = new mxGraph(container);

            // -(접기 아이콘) 비활성화
            simulator.graph.isCellFoldable = function (cell) {
                return false;
            };

            // 화면 드래그 가능
            simulator.graph.panningHandler.useLeftButtonForPanning = true;
            simulator.graph.panningHandler.ignoreCell = true;


            // simulator.graph.container.style.cursor = "crosshair";
            simulator.graph.setPanning(true);
            mxEdgeHandler.prototype.snapToTerminals = true;

            simulator.graph.addMouseListener({
                mouseDown: function (sender, evt) {
                    simulator.graph.container.style.cursor = 'move';
                },
                mouseMove: function (sender, evt) {

                    if (evt.state) {
                        // console.log("sender", sender);
                        // console.log("evt: ", evt);
                        // evt.state.style.strokeColor ="#0054FF";
                    }

                },
                mouseUp: function (sender, evt) {
                    simulator.graph.container.style.cursor = 'crosshair';
                    callAnimation();
                   /* if (simulator.callAlgorithmList.length == 0 || (simulator.callAlgorithmList.length == 1 && simulator.callAlgorithmList[0] == "pv")) {
                        applySecFlowAnimation(simulator.load.original);
                    } else if(simulator.callAlgorithmList.length == 2){
                        applySecFlowAnimation(simulator.load.pqmsMinusPv);
                    } else{
                        applySecFlowAnimation(simulator.load.pqms);
                    }*/
                }
            });

            simulator.graph.view.scaleAndTranslate(memory.scale, memory.x, memory.y);

            simulator.graph.setTooltips(false);
            simulator.graph.setConnectable(true);

            simulator.graph.centerZoom = true;

            simulator.graph.setEnabled(true);

            simulator.graph.isCellEditable = function (cell) {
                return false;
            };
            simulator.graph.isCellMovable = function (cell) {
                return false;
            };
            simulator.graph.isCellResizable = function (cell) {
                return false;
            };
            simulator.graph.isCellBendable = function (cell) {
                return false;
            };
            simulator.graph.isLabelMovable = function (cell) {
                return false;
            };
            simulator.graph.isTerminalPointMovable = function (cell) {
                return false;
            };
            simulator.graph.isCellDisconnectable = function (cell) {
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

            // 팝업메뉴
            simulator.graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
                if (cell.vertex) {
                    var sw_id = cell.swId;
                    var node = simulator.nodeMap.get(sw_id);
                    var parentChildMap;
                    var key;
                    for (key in node.parentSWMap) {
                        parentChildMap = node.parentSWMap[key].childSWMap;
                    }
                    var parentSize = findNodeSize(parentChildMap);
                    var childSize = findNodeSize(node.childSWMap);
                    if ((parentSize + childSize) > 4 || sw_id == simulator.cbId) {
                        return;
                    } else if(node.parentSWMap[simulator.cbId]){
                        return;
                    } else {
                        return rightClickMenu(simulator.graph, menu, cell, evt);
                    }
                } else {
                    return;
                }
            };

            // scroll bar
            simulator.graph.scrollTileSize = new mxRectangle(0, 0, 400, 400);
            simulator.graph.getPagePadding = function () {
                return new mxPoint(Math.max(0, Math.round(simulator.graph.container.offsetWidth - 34)),
                    Math.max(0, Math.round(simulator.graph.container.offsetHeight - 34)));
            };
            simulator.graph.getPageSize = function () {
                return (this.pageVisible) ? new mxRectangle(0, 0, this.pageFormat.width * this.pageScale,
                    this.pageFormat.height * this.pageScale) : this.scrollTileSize;
            };
            simulator.graph.getPageLayout = function () {
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
            new mxRubberband(simulator.graph);
            configureStylesheet(simulator.graph);
            var parent = simulator.graph.getDefaultParent();
            simulator.graph.getModel().beginUpdate();
            var width = $('#display').width(); //1125;
            var height = $('#display').height(); //570;
            try {

                if(simulator.dlId === 43){
                    var sec_1 = simulator.graph.insertVertex(parent, "sec_1", null, 630, 245, 165, 50, "tmpSectionSec1");
                    var sec_2 = simulator.graph.insertVertex(parent, "sec_2", null, 692, 290, 80, 50, "tmpSectionSec2");
                    var sec_3 = simulator.graph.insertVertex(parent, "sec_3", null, 790, 190, 98, 105, "tmpSectionSec3");
                    var sec_4 = simulator.graph.insertVertex(parent, "sec_4", null, 750, 290, 95, 220, "tmpSectionSec4");
                    var sec_5 = simulator.graph.insertVertex(parent, "sec_5", null, 885, 200, 115, 140, "tmpSectionSec5");
                    var sec_6 = simulator.graph.insertVertex(parent, "sec_6", null, 975, 235, 95, 180, "tmpSectionSec6");
                    var sec_7 = simulator.graph.insertVertex(parent, "sec_7", null, 1060, 235, 215, 120, "tmpSectionSec7");
                    simulator.layerSection.push(sec_1);
                    simulator.layerSection.push(sec_2);
                    simulator.layerSection.push(sec_3);
                    simulator.layerSection.push(sec_4);
                    simulator.layerSection.push(sec_5);
                    simulator.layerSection.push(sec_6);
                    simulator.layerSection.push(sec_7);
                    simulator.graph.removeCells(simulator.layerSection);
                }

                //var v1 = simulator.graph.insertVertex(parent, null,'Hello,', (width/2) - (gridMaxX / 2),   (height/2) - (gridMaxY / 2) ,  (gridMaxX - gridMinX)* 15, (gridMaxY - gridMinY)* 15);
                //console.log('###### MIN ('+ gridMinX + ',' + gridMinY  + '), MAX ('+gridMaxX+','+gridMaxY+ ')');
                // dl 단선도 그리는 부분
                //for (var i = 0; i < simulator.drawSW.length; i++) {
                for (var key in simulator.nodeMap.map) {
                    //마지막 노드를 찾는다.
                    var node = simulator.nodeMap.get(key);
                    if (node.gridX == -1 || node.gridY == -1)
                        continue;

                    // 스위치 연결 선을 그리기 위해 secMap의 swIdFront, swIdBack에 symbol(mxGraph 정보)을 저장
                    // for (var key in simulator.lineMap.map) {
                    //     //마지막 노드를 찾는다.
                    //     var line = simulator.lineMap.get(key);
                    //     if (line.sw_id_b == node.sw_id) {
                    //         node.sw_kind_code_b = line.sw_kind_code_b;
                    //     }
                    //     if (line.sw_id_f == node.sw_id) {
                    //         node.sw_kind_code_f = line.sw_kind_code_f;
                    //     }
                    // }

                    // 스위치 그리는 부분
                    // simulator.graph.insertVertex(parent, 스위치 id , G, R 등 스위치에 보일 글자, x, y, 스위치 너비, 스위치 높이, 스위치 종류);
                    //var symbol = simulator.graph.insertVertex(parent, simulator.drawSW[i][0], null, simulator.drawSW[i][1], simulator.drawSW[i][2], diagramPosition.w, diagramPosition.h, simulator.drawSW[i][3]);
                    var symbol;
                    if (node.sw_kind_code == 'DM') {
                        symbol = simulator.graph.insertVertex(parent, node.sw_id, null, node.gridX * CELL_SIZE - (gridMinX * CELL_SIZE) + (width / 2) - ((gridMaxX - gridMinX) * CELL_SIZE / 2) + 5, node.gridY * CELL_SIZE - (gridMinY * CELL_SIZE) + (height / 2) - ((gridMaxY - gridMinY) * CELL_SIZE / 2) + 5, 5, 5, node.sw_kind_code);
                    } else {
                        symbol = simulator.graph.insertVertex(parent, node.sw_id, null, node.gridX * CELL_SIZE - (gridMinX * CELL_SIZE) + (width / 2) - ((gridMaxX - gridMinX) * CELL_SIZE / 2), node.gridY * CELL_SIZE - (gridMinY * CELL_SIZE) + (height / 2) - ((gridMaxY - gridMinY) * CELL_SIZE / 2), diagramPosition.w, diagramPosition.h, node.sw_kind_code);
                    }
                    $(symbol).prop("swId", node.sw_id);
                    simulator.nodeMap.get(node.sw_id).mxSw = symbol;

                    for (var key in simulator.lineMap.map) {
                        var line = simulator.lineMap.get(key);

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
                            if (line.parentNodePad && line.parentNodePad.sw_id == node.sw_id) //라인의 부모쪽 패드와 그려진 노드가 동일한 경우
                                line.mxFront = symbol;
                            else if (node.isPadParent && node.padChild.hasOwnProperty(line.sw_id_f)) {//그려진 노드는 패드이고 그 안의 노드가 라인의 자식쪽과 일치하는지
                                line.mxFront = symbol;
                            }
                        }

                        //라인의 자식쪽이 패드스위치인 경우
                        if (line.isChildPad) {
                            //라인의 자식노드의 패드아이디와 현재 그려진 노드가 동일한 경우, 라인의 부모쪽에 지금 그려진 노드를 잇는다.
                            if (!line.childNodePad) { //이 부분은 다시 확인해봐야함. 땜빵
                                continue;
                            }
                            if (line.childNodePad && line.childNodePad.sw_id == node.sw_id)// || mxGraphDiagram.nodeMap.get(line.childNodePad.sw_id).padChild.includes(node.sw_id) )
                                line.mxBack = symbol;
                            else if (node.isPadParent && node.padChild.hasOwnProperty(line.sw_id_b)) {
                                line.mxBack = symbol;
                            }
                        }
                    }//lineMap
                }//nodeMap loop

                // 스위치 연결 선을 그리는 부분
                //for (var i = 0; i < simulator.secKeys.length; i++) {
                for (var key in simulator.lineMap.map) {
                    //마지막 노드를 찾는다.
                    var line = simulator.lineMap.get(key);
                    // simulator.graph.insertEdge(parent, 선로 id, 선로 text:null, 앞 스위치 symbol, 뒤 스위치 symbol, 선로 스타일:"lineStyle");
                    //var sec = simulator.graph.insertEdge(parent, simulator.secMap.get(simulator.secKeys[i]).secId, null, simulator.secMap.get(simulator.secKeys[i]).mxFront, simulator.secMap.get(simulator.secKeys[i]).mxBack, "lineStyle");
                    var sec = simulator.graph.insertEdge(parent, line.secId, null, line.mxFront, line.mxBack, "lineStyle");
                    $(sec).prop("secId", line.secId);
                    line.mxSec = sec;
                }
            }//try
            finally {
                simulator.graph.getModel().endUpdate();
            }

            // Object click event
            simulator.graph.addListener(mxEvent.CLICK, function (sender, evt) {
                var cell = evt.getProperty("cell");
                var objInfo;
                // console.log(cell);
                if (cell && cell.vertex) {
                    var sw = simulator.nodeMap.get(cell.swId);
                    if (cell.style == "DG" && sw.detail) {
                        objInfo = {
                            type: "sw",
                            value: [cell.swId, cell.style, simulator.dlId, simulator.mtrId, simulator.subsId, sw.detail.kind, sw.detail.generatorCapacity]
                        };
                    } else {
                        objInfo = {
                            type: "sw",
                            value: [cell.swId, cell.style, simulator.dlId, simulator.mtrId, simulator.subsId]
                        };
                    }
                    if (typeof cell.id === 'string' && cell.id.includes('pad')) {
                        var c = mxGraphDiagram.nodeMap.get(cell.id).padChild;
                        var name = '', isFirst = true;
                        for (var key in c) {
                            var pd = c[key];
                            name += (isFirst ? '' : ',') + pd.sw_name;
                            isFirst = false;
                        }
                        $("#substnm").val(name);
                    } else {
                        $("#substnm").val(sw.sw_name);
                    }


                    showInfoRightMenu(objInfo);
                    algorithmTabmanager.showAlgoTable();
                } else if (cell && cell.edge) {
                    var front = simulator.nodeMap.get(cell.source.swId);
                    var back = simulator.nodeMap.get(cell.target.swId);

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
                    return;
                }
                evt.consume();
            });
        }
    }       // mxMain2 end

    function calculateGraphSize() {
        var grid = simulator.grid;
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
        if (gridLayoutCallCnt == 13)
            console.log(1);
        console.log('[' + gridLayoutCallCnt + ']#### conflict count:' + totalConflictCnt);
        var grid = simulator.grid, nodeCnt = 0;
        gridMinX = Number.MAX_SAFE_INTEGER, gridMinY = Number.MAX_SAFE_INTEGER, gridMaxX = Number.MIN_SAFE_INTEGER, gridMaxY = Number.MIN_SAFE_INTEGER;
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
            //blob = new Blob([blob, line + "\n"], {type: "text/plain"});
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
            // blob = new Blob([blob, line + "\n"], {type: "text/plain"});
        }


    }

    function createCode(r) {
        simulator.codeMap.clear();
        for (var i = 0; i < r.length; i++) {
            simulator.codeMap.put(r[i].sw_kind_code, {
                desc: r[i].swkind_desc,
                id: r[i].swkind_id,
                dptype: r[i].swkind_dptype
            });
        }
    }

    //모든 노드에 자식 노드의 최대 depth사이즈를 설정한다
    function setChildMaxPath() {
        for (var key in simulator.nodeMap.map) {
            //마지막 노드를 찾는다.
            var node = simulator.nodeMap.get(key);
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
        for (var i = 0; i < maxPath.length; i++) {
            simulator.nodeMap.get(maxPath[i]).totalChildNodeCnt = 100;
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

        for (var key in simulator.nodeMap.map) {
            var node = simulator.nodeMap.get(key);
            if (!node || !node.childSWMap)
                console.log();
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
        if (!simulator.grid) {
            simulator.grid = new Array(GRID_ARRAY_SIZE);
            for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
                simulator.grid[i] = new Array(GRID_ARRAY_SIZE);
            }
        }
        for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
            for (var j = 0; j < GRID_ARRAY_SIZE; j++) {
                simulator.grid[i][j] = 0;
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

        console.log('createGridNode : type:' + gridNode.type + ', pos:' + pos.x + ',' + pos.y);
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
                if (simulator.grid[y + 1][x] == 0)
                    return UP;
                else
                    return getNextDirection3(LEFT, x, y);
                break;
            case DOWN:
                if (simulator.grid[y - 1][x] == 0)
                    return DOWN;
                else
                    return getNextDirection3(RIGHT, x, y);
                break;
            case LEFT:
                if (simulator.grid[y][x - 1] == 0)
                    return LEFT;
                else
                    return getNextDirection3(DOWN, x, y);
                break;
            case RIGHT:
                if (simulator.grid[y][x + 1] == 0)
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
        layoutNodeAndLineNEWS(rootNode, BASIC_DIRECTION, startGridX, startGridY, drawPath, true);
        calculateGraphSize();
        var t2 = new Date().getTime();
        console.log('layout time:' + (t2 - t1) / 1000 + '(sec)');

        //printfGridData();
    }

    function getEmptyDirection(x, y) {
        var dir = [];
        if (simulator.grid[y][x + 1] == 0) {
            dir.push(RIGHT);
        } else if (simulator.grid[y + 1][x] == 0) {
            dir.push(UP);
        } else if (simulator.grid[y][x - 1] == 0) {
            dir.push(LEFT);
        } else if (simulator.grid[y - 1][x] == 0) {
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
    function layoutNodeAndLineNEWS(parentNode, direction, x, y, drawRecord, isRoot, isMtrMode) {
        log('1. Node[' + parentNode.sw_id + '] line(' + x + ',' + y + ') child cnt:' + Object.keys(parentNode.childSWMap).length + ' Start.');
        if (parentNode.sw_id == 'pad84')
            console.log();
        gridLayoutCallCnt++;

        var directChar = getDirectChar(direction, [direction]);

        if (!isRoot) {
            //라인을 그린다.
            simulator.grid[y][x] = createGridNode('line', null, {x: x, y: y}, {
                direct: direction,
                shape: directChar
            });
        }


        //노드 그릴 위치를 정한다. (직진)
        var pos = nextXY(direction, x, y);

        //부모노드 그리기
        simulator.grid[pos.y][pos.x] = createGridNode('node', parentNode, {x: pos.x, y: pos.y}, null);
        log('1. Node[' + parentNode.sw_id + '] node(' + x + ',' + y + ')');
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

            //log('Loop childNode[' + childNode.sw_id + '] (' + pos.x + ',' + pos.y + ')');
            //우선 뻗어나갈 수 있는 곳을 찾는다. 여기서 못 찾으면 shift해서라도 그린다.
            while (i < 4) {//var RIGHT = 1, LEFT = 2, UP = 4, DOWN = 8, NONE = 0;
                if (i > 0)
                    direct = getNextDirection2(direct, pos.x, pos.y);

                if (dir.includes(direct) || direct == getOpposite(direction)) {
                    dir.push(direct);
                    //log('Loop i[' + i + '] direct[' + getDirectionString(direct) + '] continue.');
                    i++;
                    continue;
                }
                if (checkLineDrawEnable(direct, pos.x, pos.y)) {
                    //log('Loop i[' + i + '] direct[' + getDirectionString(direct) + '] checkLineDrawEnable is ok.');
                    var pos2 = nextXY(direct, pos.x, pos.y);
                    layoutNodeAndLineNEWS(childNode, direct, pos2.x, pos2.y, newDrawRecord);

                    okCnt++;
                    break;
                } else {
                    //log('Loop i[' + i + '] direct[' + getDirectionString(direct) + '] checkLineDrawEnable is BAD.');
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
                //log(' call layoutNodeAndLineNEWS:' + getDirectionString(d) + '] (' + rpos.x + ',' + rpos.y + ')');
                layoutNodeAndLineNEWS(childNode, d, rpos.x, rpos.y, newDrawRecord);
            }
        } //for child node loop

        return NO_CONFLICT;//끝노드
    }


    //해당좌표에서 d방향으로 그릴 수 있는지 확인.(라인이나 노드가 있는지 없는지 확인)
    function checkLineDrawEnable(d, x, y) {
        var p = simulator.grid;
        switch (d) {
            case RIGHT:
                return p[y][x + 2] != undefined && p[y][x + 1] == 0 && p[y][x + 2] == 0;
            case LEFT:
                return p[y][x - 2] != undefined && p[y][x - 1] == 0 && p[y][x - 2] == 0;
            case UP:
                if (p[y + 2] == undefined || p[y + 2][x] == undefined)
                    console.log();
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
        var pos = {x: x, y: y};
        switch (direction) {
            case RIGHT:
                //   console.log('SHIFT RIGHT x:' + x + ',y:' + y);

                shift_right(x + 1);
                shift_right(x + 1);
                pos.x += 2;
                break;
            case LEFT:
                //   console.log('SHIFT LEFT x:' + x + ',y:' + y);

                shift_left(x - 1);
                shift_left(x - 1);
                pos.x -= 2;
                break;
            case UP:
                //   console.log('SHIFT UP x:' + x + ',y:' + y);

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
            //   console.error('shiftGrid : Invalid direction:' + direction);
        }
        return pos;
    }

    function shift_right(pos) {
        for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
            simulator.grid[i].splice(pos, 0, simulator.grid[i][pos]);//위치, 삭제카운트, 추가값
        }
        //node좌표변경
        for (var i = 0; i < GRID_ARRAY_SIZE; i++) { //y
            for (var j = pos + 1; j < GRID_ARRAY_SIZE; j++) {//x
                if (simulator.grid[i][j].type == 'node') {
                    simulator.grid[i][j].element.gridX++;
                }
            }
        }
    }

    function shift_left(pos) {
        if (pos == 0)
            console.warn('shift_left pos = 0!. No change in grid.');
        for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
            simulator.grid[i].splice(pos, 0, simulator.grid[i][pos]);
            simulator.grid[i].shift();
        }

        //node좌표변경
        for (var i = 0; i < GRID_ARRAY_SIZE; i++) { //y
            for (var j = 0; j < pos; j++) {//x
                if (simulator.grid[i][j].type == 'node') {
                    simulator.grid[i][j].element.gridX--;
                }
            }
        }
    }

    //좌표축을 기준으로 다운. 표시상으로는 up임.
    function shift_down(pos) {
        if (pos == 0)
            console.warn('shift_up pos = 0!. No change in grid.');
        for (var i = 0; i < pos; i++) {
            simulator.grid[i] = simulator.grid[i + 1].slice();
        }

        //node좌표변경
        for (var i = 0; i < pos; i++) { //y
            for (var j = 0; j < GRID_ARRAY_SIZE; j++) {//x
                if (simulator.grid[i][j].type == 'node') {
                    simulator.grid[i][j].element.gridY--;
                }
            }
        }
    }

    function shift_up(pos) {
        for (var i = GRID_ARRAY_SIZE - 2; i >= pos; i--) {
            simulator.grid[i + 1] = simulator.grid[i].slice();
        }

        //node좌표변경
        for (var i = pos; i < GRID_ARRAY_SIZE; i++) { //y
            for (var j = 0; j < GRID_ARRAY_SIZE; j++) {//x
                if (simulator.grid[i][j].type == 'node') {
                    simulator.grid[i][j].element.gridY++;
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
        simulator.nodeMap.clear();
        //패드스위치 아닌 경우
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            //           if (!d.swkind_code.includes('PAD')) {
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
            simulator.nodeMap.put(node.sw_id, node);
        }
    } //for


    function createPadSwMap(data) {
        simulator.padMap.clear();
        //패드스위치
        var insertedLocNoArr = [];
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (d.sw_loc_no != null && simulator.padArr.includes(d.swkind_code)) {
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
                        var node = simulator.nodeMap.get(d2.sw_id);
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
					countId: 0,
                    removeLines : function() {
                        for (var key in this.parentSWMap) {
                            for (var key2 in this.padChild) {
                                var secId = findSecId(key, this.padChild[key2].sw_id);
                                simulator.lineMap.remove(secId);
                            }
                        }

                        for (var key in this.childSWMap) {
                            for (var key2 in this.padChild) {
                                var secId = findSecId(this.padChild[key2].sw_id, key);
                                simulator.lineMap.remove(secId);
                            }

                        }
                    }
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
                    //if (isConnected  && simulator.nodeMap.containsKey(padChildArr[k].sw_id))
                    //    simulator.nodeMap.remove(padChildArr[k].sw_id);
                }


                simulator.nodeMap.put(padNode.sw_id, padNode);//노드로 취급.

            }//for pad find

        }

        //print node map
        var nodes = simulator.nodeMap.values();
        log('============================================================');
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            log(node);
        }
        log('============================================================');


    }

    function createLineMap(data) {
        simulator.lineMap.clear();
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

            var parentNode = simulator.nodeMap.get(line.sw_id_f);
            var childNode = simulator.nodeMap.get(line.sw_id_b);
            line.parentNode = parentNode;
            line.childNode = childNode;

            //부모노드, 자식노드에 각각 해당 노드의 부모와 자식노드 설정정
            //if (line.sw_id_f)sd
            if (parentNode && childNode && !parentNode.childSWMap.hasOwnProperty(childNode.sw_id))
                parentNode.childSWMap[childNode.sw_id] = childNode;
            if (parentNode && childNode && !childNode.parentSWMap.hasOwnProperty(parentNode.sw_id))
                childNode.parentSWMap[parentNode.sw_id] = parentNode;

            simulator.lineMap.put(line.secId, line);
        }
    }

    function updateLineMapForPad() {
        var lines = simulator.lineMap.values();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            //부모쪽 라인이 패드소속일 경우 패드의 아이디를 설정해놓는다.(그리기 위함)
            if (line.parentNode && line.parentNode.isPadChild && line.parentNode.padNode) {//childNode.isPadChild가 참인데 childNode.padNode가 널인 경우는 TR인 경우. TR은 안 그림
                line.parentNodePad = simulator.nodeMap.get(line.parentNode.padNode.sw_id);
                line.isParentPad = true;
            }

            if (line.childNode && line.childNode.isPadChild && line.childNode.padNode) {
                line.childNodePad = simulator.nodeMap.get(line.childNode.padNode.sw_id);
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

});   // end