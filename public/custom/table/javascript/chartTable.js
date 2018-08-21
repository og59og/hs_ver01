var tableManager = {
    pqmsPredictData : new Map(),
    pvPredictData : new Map(),
    sectionPredictDate : new Map(),

    /*PQMS*/
    initPqmsTableDataSet : function(originalDataSet){
        console.log("효선 : ", originalDataSet);
        var timeData = [], realData = [], predictData = [], rmseData  = [];

        var keyList = [];
        for (var key in originalDataSet) {
            keyList.push(key);
        }
        keyList.sort(function (a, b) {
            const d1 = new Date(a);
            const d2 = new Date(b);
            return d1 - d2;
        });

        for (var i in keyList) {
            timeData.push(keyList[i]);
            realData.push(originalDataSet[keyList[i]].pqmsOriginalOutput[0].load);
            predictData.push(originalDataSet[keyList[i]].pqmsPredictOutput[0].load);

            var rmseCalcResult = tableManager.calcRMSE(originalDataSet[keyList[i]].pqmsOriginalOutput[0].load, originalDataSet[keyList[i]].pqmsPredictOutput[0].load);
            rmseData.push(rmseCalcResult);

        }

        tableManager.pqmsPredictData.set('timeData', timeData);
        tableManager.pqmsPredictData.set('realData', realData);
        tableManager.pqmsPredictData.set('predictData', predictData);
        tableManager.pqmsPredictData.set('rmseData', rmseData);
    },
    calcRMSE : function(realData, predictData){
        var result;
        var denominator, numerator;
        /*
        denominator = Math.pow(realData - predictData, 2);
        numerator = realData + predictData;


        result = Math.sqrt((denominator / numerator) * 2);
        */

        /*
        denominator = realData - predictData;
        numerator = realData;

        result = (1- (denominator / numerator)) * 100;
        */


        denominator = Math.pow(realData - predictData, 2);
        numerator = realData;

        result = ( 1 - ( Math.sqrt(denominator) / numerator ) ) * 100;

        return result.toFixed(2);
    },
    createPQMSTable : function(){
        var tableItem = $("#pqmsDataTableDiv")[0];
        var tableBody = $("#pqmsDataTableBody")[0];

        $(tableBody).empty();

        //style="overflow-x:auto;overflow-y:hidden;"
        $("#pqmsDataTableDiv").css({
            width:'550px', //probably not needed
            height:'150px' //probably not needed
        });
        $("#pqmsDataTableBody").css({
            width:'550px', //probably not needed
            height:'100px', //probably not needed
            'overflow-x' : 'scroll',
            'overflow-y' : 'hidden',
            position: 'fixed'
        });

        var columnCount =  tableManager.pqmsPredictData.get('timeData').length;

        var timeRow = tableItem.insertRow(0);
        var realDataRow = tableItem.insertRow(1);
        var predictDataRow = tableItem.insertRow(2);
        var rmseDataRow = tableItem.insertRow(3);

        var timeHeaderCell = document.createElement("td");
        var realDataHeaderCell = document.createElement("td");
        var predictDataHeaderCell = document.createElement("td");
        var rmseDataHeaderCell = document.createElement("td");

        $(timeHeaderCell).text("시간");
        //$(realDataHeaderCell).text("실제값");
        $(predictDataHeaderCell).text("예측값");
        //$(rmseDataHeaderCell).text("정확도");

        $(timeRow).append(timeHeaderCell);
        //$(realDataRow).append(realDataHeaderCell);
        $(predictDataRow).append(predictDataHeaderCell);
        //$(rmseDataRow).append(rmseDataHeaderCell);


        for(var i=0; i< columnCount; i++){
            var td_time = document.createElement("td");
            //var td_real = document.createElement("td");
            var td_pred = document.createElement("td");
            //var td_rmse = document.createElement("td");

            var splitDateAndTimeValue = tableManager.pqmsPredictData.get('timeData')[i].split(" ");
            var dateItem = splitDateAndTimeValue[0].split("-").pop();
            var timeItem = splitDateAndTimeValue[1].split(":")[0];
            var tb_time_value = dateItem + "일 " + timeItem + "시";

            $(td_time).text(tb_time_value);
            //$(td_real).text(tableManager.pqmsPredictData.get('realData')[i]);
            $(td_pred).text(tableManager.pqmsPredictData.get('predictData')[i]);
            //$(td_rmse).text(tableManager.pqmsPredictData.get('rmseData')[i] + "%");

            $(timeRow).append(td_time);
            //$(realDataRow).append(td_real);
            $(predictDataRow).append(td_pred);
            //$(rmseDataRow).append(td_rmse);

        }

        tableBody.append(timeRow);
        //tableBody.append(realDataRow);
        tableBody.append(predictDataRow);
        //tableBody.append(rmseDataRow);

        $("#pqmsDataTableBody").trigger('classChange');
    },
    /*PV start*/
    initPvTableDataSet : function(originalDataSet){
        console.log("효선 : ", originalDataSet);
        var timeData = [], predictData = [];

        var keyList = [];
        for (var key in originalDataSet) {
            keyList.push(key);
        }
        keyList.sort(function (a, b) {
            const d1 = new Date(a);
            const d2 = new Date(b);
            return d1 - d2;
        });

        for (var i in keyList) {
            timeData.push(keyList[i]);
            predictData.push(originalDataSet[keyList[i]].pv[0].data);

           /* var rmseCalcResult = tableManager.calcRMSE(originalDataSet[i].pqmsOriginalOutput[0].load, originalDataSet[i].pqmsPredictOutput[0].load);
            rmseData.push(rmseCalcResult);*/

        }
        tableManager.pvPredictData.set('timeData', timeData);
        tableManager.pvPredictData.set('predictData', predictData);
    },
    createPVTable : function(){
        var tableItem = $("#pvDataTableDiv")[0];
        var tableBody = $("#pvDataTableBody")[0];

        $(tableBody).empty();

        //style="overflow-x:auto;overflow-y:hidden;"
        $("#pvDataTableDiv").css({
            width:'550px', //probably not needed
            height:'150px' //probably not needed
        });
        $("#pvDataTableBody").css({
            width:'550px', //probably not needed
            height:'150px', //probably not needed
            'overflow-x' : 'scroll',
            'overflow-y' : 'hidden',
            position: 'fixed'
        });

        var columnCount =  tableManager.pvPredictData.get('timeData').length;

        var timeRow = tableItem.insertRow(0);
        var predictDataRow = tableItem.insertRow(1);


        var timeHeaderCell = document.createElement("td");
        var predictDataHeaderCell = document.createElement("td");

        $(timeHeaderCell).text("");
        $(predictDataHeaderCell).text("예측값");

        $(timeRow).append(timeHeaderCell);
        $(predictDataRow).append(predictDataHeaderCell);


        for(var i=0; i< columnCount; i++){
            var td_time = document.createElement("td");
            var td_pred = document.createElement("td");

            var splitDateAndTimeValue = tableManager.pvPredictData.get('timeData')[i].split(" ");
            var dateItem = splitDateAndTimeValue[0].split("-").pop();
            var timeItem = splitDateAndTimeValue[1].split(":")[0];
            var tb_time_value = dateItem + "일 " + timeItem + "시";

            $(td_time).text(tb_time_value);
            // $(td_time).text(tableManager.pvPredictData.get('timeData')[i].split(" ")[1]);
            $(td_pred).text(tableManager.pvPredictData.get('predictData')[i]);

            $(timeRow).append(td_time);
            $(predictDataRow).append(td_pred);

        }

        tableBody.append(timeRow);
        tableBody.append(predictDataRow);

        $("#pvDataTableBody").trigger('classChange');
    },
    /* pv end */

    /* section load start */
    initSectionLoadTableDataSet : function(originalDataSet){
        // var timeData = [], predictData = [];

        if(originalDataSet == "null"){
            originalDataSet = tableManager.createTempSectionData();
        }

        var timeData = [];
        var keyList = [];
        for (var key in originalDataSet) {
            keyList.push(key);
        }
        keyList.sort(function (a, b) {
            const d1 = new Date(a);
            const d2 = new Date(b);
            return d1 - d2;
        });

        for (var i in keyList) {
            var valueMap = new Map();
            var sectionList = [], loadList = [];

            var subDataMap = originalDataSet[keyList[i]];

            timeData.push(subDataMap.time);

            for(var item in subDataMap){
                sectionList.push(subDataMap[item][0].sec);
                loadList.push(subDataMap[item][0].load);
            }
/*            for(var j=0; j < sectionDataMapList.length; j++){
                sectionList.push(sectionDataMapList[j].sec_id);
                loadList.push(sectionDataMapList[j].load);
            }*/

            valueMap.set("sectionList", sectionList);
            valueMap.set("loadList", loadList);

            tableManager.sectionPredictDate.set(keyList[i], valueMap);
            /*
            timeData.push(keyList[i]);
            predictData.push(originalDataSet[keyList[i]].pqmsPredictOutput[0].load);
            */
        }
        tableManager.sectionPredictDate.set("timeData", timeData);


    },

    createSectionLoadTable : function(){
        var tableItem = $("#section_loadDataTableDiv")[0];
        var tableBody = $("#section_loadDataTableBody")[0];

        $(tableBody).empty();

        //style="overflow-x:auto;overflow-y:hidden;"
        $("#section_loadDataTableDiv").css({
            width:'550px', //probably not needed
            height:'150px' //probably not needed
        });
        $("#section_loadDataTableBody").css({
            width:'550px', //probably not needed
            height:'150px', //probably not needed
            'overflow-x' : 'scroll',
            'overflow-y' : 'scroll',
            position: 'fixed'
        });


        var timeRow = tableItem.insertRow(0);
        // var predictDataRow = tableItem.insertRow(1);
        var sectionRowList = [];

        var timeHeaderCell = document.createElement("td");
        // var predictDataHeaderCell = document.createElement("td");

        $(timeHeaderCell).text("시간");
        // $(predictDataHeaderCell).text("예측값");

        $(timeRow).append(timeHeaderCell);
        // $(predictDataRow).append(predictDataHeaderCell);

        for(var i=0; i< tableManager.sectionPredictDate.get('timeData').length; i++){
            var td_time = document.createElement("td");

            var originTimeData = tableManager.sectionPredictDate.get('timeData')[i];
            var splitDateAndTimeValue = originTimeData.split(" ");
            var dateItem = splitDateAndTimeValue[0].split("-").pop();
            var timeItem = splitDateAndTimeValue[1].split(":")[0];
            var tb_time_value = dateItem + "일 " + timeItem + "시";

            $(td_time).text(tb_time_value);
            $(timeRow).append(td_time);
            if(i == 0){
                for(var j=0; j< tableManager.sectionPredictDate.get(originTimeData).get('sectionList').length; j++){
                    var sectionRow = tableItem.insertRow(j + 1);
                    var sectionHeaderCell = document.createElement("td");
                    $(sectionHeaderCell).text(tableManager.sectionPredictDate.get(originTimeData).get('sectionList')[j]);
                    // $(predictDataHeaderCell).text("예측값");

                    $(sectionRow).append(sectionHeaderCell);
                    sectionRowList.push(sectionRow);
                }
            }

            for(var j=0; j< tableManager.sectionPredictDate.get(originTimeData).get('loadList').length; j++){
                var sectionValueCell = document.createElement("td");
                $(sectionValueCell).text(tableManager.sectionPredictDate.get(originTimeData).get('loadList')[j]);

                $(sectionRowList[j]).append(sectionValueCell);
            }
        }

        tableBody.append(timeRow);

        for(var j=0; j< tableManager.sectionPredictDate.get(tableManager.sectionPredictDate.get('timeData')[0]).get('sectionList').length; j++){
            tableBody.append(sectionRowList[j]);
        }

        $("#section_loadDataTableBody").trigger('classChange');
    },


    /* section load end */

    createAlgoVersionInfoTable : function(algo_version_id, nameTrId, versionTrId, learningKindTrId, accuracyTrId) {
        //값 받아와서 넣도록 할까 아니면 여기서 ajax 까지 하는걸로 할까 일단은 promise 반환하는걸로 해서 진행하자
        return new Promise(function(resolve, reject){
            var param = {'algo_version_id': algo_version_id};
            $.ajax({
                url: "/algorithm/version",
                type: "GET",
                data: param,
                success: function (data) {
                    const r = data[0];
                    $("#" + nameTrId).text(r.algorithm_name);
                    $("#" + versionTrId).text(r.version);
                    $("#" + learningKindTrId).text(r.achine_learning_kind);
                    $("#" + accuracyTrId).text(r.accuracy + "%");
                    resolve();
                }
            })
        });
    },

    createTempSectionData : function(){
        var returnMap = {
            "2018-01-30 01:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 10
                    },
                    {
                        sec_id: 2,
                        load: 15
                    },
                    {
                        sec_id: 3,
                        load: 12
                    },
                    {
                        sec_id: 4,
                        load: 16
                    },
                    {
                        sec_id: 5,
                        load: 18
                    },
                    {
                        sec_id: 6,
                        load: 19
                    },
                    {
                        sec_id: 7,
                        load: 100
                    },
                    {
                        sec_id: 8,
                        load: 122
                    },
                    {
                        sec_id: 9,
                        load: 13
                    },
                ],
                time: "2018-01-30 01:00"
            },
            "2018-01-30 02:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 30
                    },
                    {
                        sec_id: 2,
                        load: 30
                    },
                    {
                        sec_id: 3,
                        load: 30
                    },
                    {
                        sec_id: 4,
                        load: 38
                    },
                    {
                        sec_id: 5,
                        load: 70
                    },
                    {
                        sec_id: 6,
                        load: 100
                    },
                    {
                        sec_id: 7,
                        load: 150
                    },
                    {
                        sec_id: 8,
                        load: 122
                    },
                    {
                        sec_id: 9,
                        load: 13
                    },
                ],
                time: "2018-01-30 02:00"
            },
            "2018-01-30 03:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 150
                    },
                    {
                        sec_id: 2,
                        load: 10
                    },
                    {
                        sec_id: 3,
                        load: 120
                    },
                    {
                        sec_id: 4,
                        load: 160
                    },
                    {
                        sec_id: 5,
                        load: 180
                    },
                    {
                        sec_id: 6,
                        load: 19
                    },
                    {
                        sec_id: 7,
                        load: 10
                    },
                    {
                        sec_id: 8,
                        load: 12
                    },
                    {
                        sec_id: 9,
                        load: 133
                    },
                ],
                time: "2018-01-30 03:00"
            },
            "2018-01-30 04:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 14
                    },
                    {
                        sec_id: 2,
                        load: 19
                    },
                    {
                        sec_id: 3,
                        load: 16
                    },
                    {
                        sec_id: 4,
                        load: 19
                    },
                    {
                        sec_id: 5,
                        load: 28
                    },
                    {
                        sec_id: 6,
                        load: 80
                    },
                    {
                        sec_id: 7,
                        load: 10
                    },
                    {
                        sec_id: 8,
                        load: 15
                    },
                    {
                        sec_id: 9,
                        load: 13
                    },
                ],
                time: "2018-01-30 04:00"
            },
            "2018-01-30 05:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 55
                    },
                    {
                        sec_id: 2,
                        load: 93
                    },
                    {
                        sec_id: 3,
                        load: 23
                    },
                    {
                        sec_id: 4,
                        load: 56
                    },
                    {
                        sec_id: 5,
                        load: 87
                    },
                    {
                        sec_id: 6,
                        load: 90
                    },
                    {
                        sec_id: 7,
                        load: 18
                    },
                    {
                        sec_id: 8,
                        load: 16
                    },
                    {
                        sec_id: 9,
                        load: 13
                    },
                ],
                time: "2018-01-30 05:00"
            },
            "2018-01-30 06:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 10
                    },
                    {
                        sec_id: 2,
                        load: 17
                    },
                    {
                        sec_id: 3,
                        load: 100
                    },
                    {
                        sec_id: 4,
                        load: 160
                    },
                    {
                        sec_id: 5,
                        load: 14
                    },
                    {
                        sec_id: 6,
                        load: 190
                    },
                    {
                        sec_id: 7,
                        load: 10
                    },
                    {
                        sec_id: 8,
                        load: 122
                    },
                    {
                        sec_id: 9,
                        load: 13
                    },
                ],
                time: "2018-01-30 06:00"
            },
            "2018-01-30 07:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 10
                    },
                    {
                        sec_id: 2,
                        load: 16
                    },
                    {
                        sec_id: 3,
                        load: 120
                    },
                    {
                        sec_id: 4,
                        load: 160
                    },
                    {
                        sec_id: 5,
                        load: 180
                    },
                    {
                        sec_id: 6,
                        load: 190
                    },
                    {
                        sec_id: 7,
                        load: 1000
                    },
                    {
                        sec_id: 8,
                        load: 1220
                    },
                    {
                        sec_id: 9,
                        load: 130
                    },
                ],
                time: "2018-01-30 07:00"
            },
            "2018-01-30 08:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 10
                    },
                    {
                        sec_id: 2,
                        load: 16
                    },
                    {
                        sec_id: 3,
                        load: 120
                    },
                    {
                        sec_id: 4,
                        load: 160
                    },
                    {
                        sec_id: 5,
                        load: 180
                    },
                    {
                        sec_id: 6,
                        load: 190
                    },
                    {
                        sec_id: 7,
                        load: 1000
                    },
                    {
                        sec_id: 8,
                        load: 1220
                    },
                    {
                        sec_id: 9,
                        load: 130
                    },
                ],
                time: "2018-01-30 08:00"
            },
            "2018-01-30 09:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 10
                    },
                    {
                        sec_id: 2,
                        load: 16
                    },
                    {
                        sec_id: 3,
                        load: 120
                    },
                    {
                        sec_id: 4,
                        load: 160
                    },
                    {
                        sec_id: 5,
                        load: 180
                    },
                    {
                        sec_id: 6,
                        load: 190
                    },
                    {
                        sec_id: 7,
                        load: 1000
                    },
                    {
                        sec_id: 8,
                        load: 1220
                    },
                    {
                        sec_id: 9,
                        load: 130
                    },
                ],
                time: "2018-01-30 09:00"
            },
            "2018-01-30 10:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 10
                    },
                    {
                        sec_id: 2,
                        load: 16
                    },
                    {
                        sec_id: 3,
                        load: 120
                    },
                    {
                        sec_id: 4,
                        load: 160
                    },
                    {
                        sec_id: 5,
                        load: 180
                    },
                    {
                        sec_id: 6,
                        load: 190
                    },
                    {
                        sec_id: 7,
                        load: 1000
                    },
                    {
                        sec_id: 8,
                        load: 1220
                    },
                    {
                        sec_id: 9,
                        load: 130
                    },
                ],
                time: "2018-01-30 10:00"
            },
            "2018-01-30 11:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 10
                    },
                    {
                        sec_id: 2,
                        load: 16
                    },
                    {
                        sec_id: 3,
                        load: 120
                    },
                    {
                        sec_id: 4,
                        load: 160
                    },
                    {
                        sec_id: 5,
                        load: 180
                    },
                    {
                        sec_id: 6,
                        load: 190
                    },
                    {
                        sec_id: 7,
                        load: 1000
                    },
                    {
                        sec_id: 8,
                        load: 1220
                    },
                    {
                        sec_id: 9,
                        load: 130
                    },
                ],
                time: "2018-01-30 11:00"
            },
            "2018-01-30 12:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 10
                    },
                    {
                        sec_id: 2,
                        load: 16
                    },
                    {
                        sec_id: 3,
                        load: 120
                    },
                    {
                        sec_id: 4,
                        load: 160
                    },
                    {
                        sec_id: 5,
                        load: 180
                    },
                    {
                        sec_id: 6,
                        load: 190
                    },
                    {
                        sec_id: 7,
                        load: 1000
                    },
                    {
                        sec_id: 8,
                        load: 1220
                    },
                    {
                        sec_id: 9,
                        load: 130
                    },
                ],
                time: "2018-01-30 12:00"
            },
            "2018-01-30 13:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 10
                    },
                    {
                        sec_id: 2,
                        load: 16
                    },
                    {
                        sec_id: 3,
                        load: 120
                    },
                    {
                        sec_id: 4,
                        load: 160
                    },
                    {
                        sec_id: 5,
                        load: 180
                    },
                    {
                        sec_id: 6,
                        load: 190
                    },
                    {
                        sec_id: 7,
                        load: 1000
                    },
                    {
                        sec_id: 8,
                        load: 1220
                    },
                    {
                        sec_id: 9,
                        load: 130
                    },
                ],
                time: "2018-01-30 13:00"
            },"2018-01-30 14:00": {
                sectionLoad: [
                    {
                        sec_id: 1,
                        load: 10
                    },
                    {
                        sec_id: 2,
                        load: 16
                    },
                    {
                        sec_id: 3,
                        load: 120
                    },
                    {
                        sec_id: 4,
                        load: 160
                    },
                    {
                        sec_id: 5,
                        load: 180
                    },
                    {
                        sec_id: 6,
                        load: 190
                    },
                    {
                        sec_id: 7,
                        load: 1000
                    },
                    {
                        sec_id: 8,
                        load: 1220
                    },
                    {
                        sec_id: 9,
                        load: 130
                    },
                ],
                time: "2018-01-30 14:00"
            },

        };

        return returnMap;
    }
};
