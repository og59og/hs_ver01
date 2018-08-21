

var pv_plotly = {
    dataList : [],

    defaultLayout : {
        width: 568,
        height: 350,
        margin: { l: 45, r: 15, b: 40, t: 45},
        xaxis: {
            title: '시간',
            type: 'date',
            tickformat : "%d일 %H시간",
            autorange : true,
        },
        yaxis: {
            title: '발전량',
            range : [0, 1000],
            autorange : false,
        },
        showlegend : true,
        legend : {
            x: 0.8,
            y: 1,
            traceorder: 'normal',
            font: {
                family: 'sans-serif',
                size: 12,
                color: '#000'
            },
            bgcolor: '#E2E2E2',
            bordercolor: '#FFFFFF',
            borderwidth: 2
        }
    },
    defaultPlotlyConfiguration : {
        showLink: false, // removes the link to edit on plotly - works
        modeBarButtonsToRemove: ['toImage', 'zoom2d', 'pan', 'pan2d', 'autoScale2d'],
        displaylogo: false,
        showTips: true
    },

    initPlot : function(){

        //modal에 차트 그려놓기 처음에 한번 실행되게
        /*        var data = [
                    {
                        x: ['2013-10-04 22:23:00'],
                        y: [0],
                        type: 'scatter'
                    }
                ];*/
        var trace1 = {
            x: ['2013-10-04 22:23:00', '2013-10-04 22:23:00'],
            y: [1, -1],
            fill: "tozeroy", fillcolor: "rgba(0,0,0,0.2)", line: {width: 0}, name: "예측 발전량", showlegend: false, type: "scatter", mode: "lines", //hoverinfo: 'none',
        };

        var trace2 = {
            type: "scatter",
            mode: "lines",
            x: ['2013-10-04 22:23:00'],
            y: [0],
            line: {color: '#7F7F7F'},
            name : "예측 발전량",
        };
        var data = [trace1,trace2];

        var defaultPlotlyConfiguration = {
            showLink: false, // removes the link to edit on plotly - works
            //modeBarButtonsToRemove: ['toImage', 'zoom2d', 'pan', 'pan2d', 'autoScale2d'],
            displaylogo: false,
            showTips: true
        };

        Plotly.newPlot('pv_plot', data, pv_plotly.defaultLayout, pv_plotly.defaultPlotlyConfiguration);

    },
    pvDataProcessing : function(totalDataList, currentTickVal){
        var totalLoad = 0;
        var predictTotalLoad = 0;
        var pvDataList = [];
        //tickVal은 for문으로 변경해서
        for (var tickVal in totalDataList) {
            var totalLoad = 0;
            var predictTotalLoad = 0;
            if (tickVal <= currentTickVal) { //현재부터 과거 데이터
                for (var i in totalDataList[tickVal].sec_load) {
                    totalLoad += totalDataList[tickVal].sec_load[i].sec_load;
                }
                pvDataList.push({"totalLoad" : totalLoad, "predictTotalLoad" : predictTotalLoad, "time" : totalDataList[tickVal].time});
            } else { //미래 예측 데이터
                var totalLoad = 0;
/*                for (var i in totalDataList[tickVal].pv) {
                    totalLoad += totalDataList[tickVal].pv[i].data;
                }*/
                /*
                for (var i in totalDataList[tickVal].pqmsPredictOutput) {
                    predictTotalLoad += totalDataList[tickVal].pqmsPredictOutput[i].load;
                }
                */
                pvDataList.push({"predictData" : totalDataList[tickVal].pv[0].data.toFixed(2), "time" : totalDataList[tickVal].time});
            }
        }
        return pvDataList;
    },
    pvDataToPlotData : function(pqmsDataList){
        var org_x = [];
        var org_y = [];
        var prd_x = [];
        var prd_y = [];
        //for (var i=0; i<=tickVal; i++) {
        for (var i in pqmsDataList) {
            org_x.push(pqmsDataList[i].time); //predictTotalLoad
            org_y.push(pqmsDataList[i].totalLoad);
            prd_x.push(pqmsDataList[i].time);
            prd_y.push(pqmsDataList[i].predictTotalLoad);
        }

        return [
            {type: "scatter", mode: "lines", line: {color: '#17BECF'}, name : "original load", x: org_x, y: org_y},
            {type: "scatter", mode: "lines", line: {color: '#7F7F7F'}, name : "predict load",x: prd_x, y: prd_y}
        ];



    },
    redrawPlot : function(termsTime){
        if (pv_plotly.dataList != undefined && pv_plotly.dataList.length != 0) {

            const dataList = pv_plotly.dataList;
            const startTime = new Date(dataList[0]['time']).getTime();
            const endTime = new Date(dataList[dataList.length - 1]['time']).getTime();

            var layout = JSON.parse(JSON.stringify(pv_plotly.defaultLayout));
            layout.xaxis.autorange = false;
            layout.xaxis.range = [startTime, endTime];

            const accuracy = 0.6781;
            const plusValue = Math.abs(1 - accuracy) + 1;
            const minusValue = 1 - Math.abs(1 - accuracy);

            var x = [];
            var y = [];
            var x_error = [];
            var y_error = [];
            const terms = new Date(termsTime);
            for (var i in dataList) {
                //const targetTime = new Date(dataList[i].time).getTime();
                const targetTime = new Date(dataList[i].time);
                if (targetTime <= terms) {
                    y.push(dataList[i].pv[0].data);
                    x.push(targetTime);
                }
            }
            var trace_main = {
                type: "scatter",mode: "lines",line: {color: '#000000'}, name : "predict load", //hoverinfo: 'none',
                x: x,  y: y
            };
            for (var i=0; i<x.length; i++) {
                x_error.push(x[i]);
                y_error.push(y[i] * plusValue);
            }
            for (var i=x.length - 1; i>=0; i--) {
                x_error.push(x[i]);
                y_error.push(y[i] * minusValue);
            }
            var trace_error = {
                fill: "tozeroy", fillcolor: "rgba(0,0,0,0.2)", line: {width: 0}, name: "predict load", showlegend: false, type: "scatter", mode: "lines", hoverinfo: 'none',
                x: x_error,
                y: y_error
            };

            var data = [trace_main, trace_error];
            Plotly.react('pv_plot', data, layout, pv_plotly.defaultPlotlyConfiguration);
        }

    },
};