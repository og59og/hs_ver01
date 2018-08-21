
/*
need Jquery
need bootstrap ?
need moment.js
 */

var logContentManager = {
    logGetterTimer : null,
    setTimer : function(){
        //##TODO : set interval로 바꿀껏
        //logContentManager.logGetterTimer = setInterval(logContentManager.getLogContent, 1000);
        logContentManager.logGetterTimer = setTimeout(logContentManager.getLogContent, 1000);
    },

    makeLogContent : function(date, type, content){
        var li = document.createElement("li");
        var dateSpan = document.createElement("span");
        var logTypeSpan = document.createElement("span");
        var textSpan = document.createElement("span");

        $(dateSpan).addClass("green").text("[" + moment(date).format('LLL') + "] ");
        $(logTypeSpan).addClass("blue").text("[" + type + "] ");
        $(textSpan).text(content);
        $(li).append(dateSpan).append(logTypeSpan).append(textSpan);
        return li;
    },
    getLogContent : function(){

        $.ajax({
            url: "/log/content",
            type: "GET",
            dataType: 'json',
            success: function (data) {
                //console.log(data);
                $("#logContentUl").empty();
                for (var i in data) {
                    $("#logContentUl").append(logContentManager.makeLogContent(data[i].date, data[i].type, data[i].message));

                }

            }
        })

    },
    saveLogContent : function(func, message, log_type){

        //function, message, user_id, log_type
        const param = {
            "func" : func,
            "message" : message,
            "log_type" : log_type
        };

        $.ajax({
            url: "/log/content",
            type: "POST",
            dataType: 'json',
            data : param,
            success: function (data) {
                //결과
                console.log(data);
                //alert(data);

            }
        })
    }

};

logContentManager.getLogContent();
logContentManager.setTimer();