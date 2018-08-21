
var sectionManager = {

    /**
     * 구간 부하 구하는 함수인데 각 스위치에 있는 전류 값 가지고 구함
     * 구간을 임의로 정해둔 대로 나눠서 계산하며 다른 DL에 적용 불가 함수
     */
    testCalcSectionLoadByCurrent : function(gridMap){
        /*
          5576  ┬    17529   ┬    18538   ─    25513  ─   27775

               28987         20245
         */
        //section = {sec : 1, load : 1}
        //sec = sqrt(3) * 22.9 * 0.9 * 전류
        /*
        { column : "coulmn", data : [{'data' : data, 'time' : time, etc...}, {}, ...{}]

            var beforeTimeSyncData = {
                'pv' : {'column' : 'pv', 'data' : preProcessDataArr}
            };

         */
        var mapForTimeSyncForm = {};
        mapForTimeSyncForm['sec_1'] = {"column" : "sec_1", 'data' : sectionManager.createSection(1, gridMap['5576'], [gridMap['17529'], gridMap['28987'] ])};
        mapForTimeSyncForm['sec_2'] = {"column" : "sec_2", 'data' : sectionManager.createSection(2, gridMap['28987'], [  ])};
        mapForTimeSyncForm['sec_3'] = {"column" : "sec_3", 'data' : sectionManager.createSection(3, gridMap['17529'], [ gridMap['20245'], gridMap['18538'] ])};
        mapForTimeSyncForm['sec_4'] = {"column" : "sec_4", 'data' : sectionManager.createSection(4, gridMap['20245'], [  ])};
        mapForTimeSyncForm['sec_5'] = {"column" : "sec_5", 'data' : sectionManager.createSection(5, gridMap['18538'], [ gridMap['25513'] ])};
        mapForTimeSyncForm['sec_6'] = {"column" : "sec_6", 'data' : sectionManager.createSection(6, gridMap['25513'], [ gridMap['27775'] ])};
        mapForTimeSyncForm['sec_7'] = {"column" : "sec_7", 'data' : sectionManager.createSection(7, gridMap['27775'], [  ])};
        return mapForTimeSyncForm;
    },

    createSection : function(sec_number, parentSW, childrenArr){
        var returnSecList = [];
        for (var i in parentSW) {
            var childrenInfo = [];
            for (var j in childrenArr) {
                childrenInfo.push(childrenArr[j][i]);
            }
            const load = sectionManager.calcLoad(parentSW[i], childrenInfo);
            returnSecList.push({'sec' : sec_number, 'load' : load, 'time' : parentSW[i].time})
        }
        return returnSecList;
    },

    /**
     * 자식 스위치들의 전류값을 더해서 부모에서 뺀다음 sqrt(3) * 22.9 * 0.9 * 전류 값으로 계산함
     * @param parentSW 부모 스위치 데이터
     * @param childSWArr 자식 스위치들을 가지는 배열
     */
    calcLoad : function(parentInfo, childrenInfo) {
        var childCurrent = 0;
        var parentCurrent = parentInfo.pred;

        for (var i in childrenInfo) {
            childCurrent += childrenInfo[i].pred;
        }

        var current = parentCurrent - childCurrent;
        if (current <= 0) {
            current = 0;
        }

        var load = Math.sqrt(3) * 22.9 * 0.9 * current / 1000; //kVA -> MVA( / 1000)
        load = parseFloat(load.toFixed(4));
        return load;
    }
}