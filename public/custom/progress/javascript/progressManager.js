/*
need Jquery
 */

//프로그레스를 계속 쌓아가고 10개가 넘어가면 그 떄 앞에부터 삭제하도록 수정

var progressManager = {
    MAX_PROGRESS_NUM : 5,

    progressObjMap : {},
    progressElementCnt : 0,

    makeProgressObj : function(id, content){
        //id로 구분하도록 해야할꺼같고 중복되는 id있으면 그냥 초기화해버리는 식으로
        if($("#" + id).length > 0) { //map에 아이디가 있는지 없는지로 해야할꺼같다.
            return;
        }
        var li = document.createElement("li");
        var text = document.createElement("strong");
        var icon = document.createElement("i");
        var textSpan = document.createElement("span");
        var progressDiv = document.createElement("div");
        var progress = document.createElement("div");
        var progressVal = document.createElement("span");

        $(icon).addClass("fa").addClass("fa-chevron-right");
        $(textSpan).text(" " + content);
        $(text).append(icon).append(textSpan);

        $(progressDiv).addClass("progress").addClass("progress-animated").addClass("progress-striped");
        $(progress).addClass("progress-bar").addClass("progress-bar-success").attr("data-percentage", 100).attr("id", id);
        $(progressVal).addClass("sr-only").text("100 % completed");

        $(progress).append(progressVal);
        $(progressDiv).append(progress);
        $(li).append(text).append(progressDiv);


        progressManager.progressElementCnt++;
        $("#req_progress").prepend(li);
        progressManager.cleanProgress();

    },
    cleanProgress : function(){
        if (progressManager.progressElementCnt > progressManager.MAX_PROGRESS_NUM) {
            $('#req_progress li').last().remove();
            progressManager.progressElementCnt--;
        }
    },
    failProgress : function(id){
        var updateProgressTarget = $("#" + id);
        $("#" + id).removeClass("progress-bar-success");
        $("#" + id).addClass("progress-bar-danger");
        updateProgressTarget.css('width', (100) + '%');
        updateProgressTarget.text("error");
        $("#" + id).trigger('classChange');

        progressManager.clearProgressMap(id, 10);
    },
    updateProgress : function(id, updatePerc){

        var precData;
        if (updatePerc > 100) {
            precData = 100;
        } else if(0 <= updatePerc && updatePerc <= 100) {
            precData = updatePerc;
        } else {
            precData = 0;
        }

        var updateProgressTarget = $("#" + id);
        $("#" + id).removeClass("progress-bar-danger");
        $("#" + id).addClass("progress-bar-success");
        var perc = updateProgressTarget.attr("data-percentage");

        updateProgressTarget.css('width', (precData) + '%');
        updateProgressTarget.text((precData)+'%');
    },

    clearProgressMap : function(id, second){
        const _id = id;
        $("#" + id).attr("id", "null");
        delete progressManager.progressObjMap[id];
    },

};
