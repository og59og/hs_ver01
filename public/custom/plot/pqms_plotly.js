

var pqms_plotly = {
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
            title: '전체 부하',
            range : [0, 14000],
            autorange : false,
        },
/*        shapes: [
            {
                type: 'line',
                x0: '2013-10-04 22:23:00',
                y0: 0,
                x1: '2013-10-04 22:23:00',
                y1: 14000,
                line:{
                    //color: 'grey',
                    width: 1.5,
                    dash:'dot'
                }
            }
        ],*/
        showlegend : true,
        legend : {
            x: 0.8,
            y: 1.15,
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

        var trace1 = {
            x: ['2013-10-04 22:23:00', '2013-10-04 22:23:00'],
            y: [1, -1],
            fill: "tozeroy", fillcolor: "rgba(0,0,0,0.2)", line: {width: 0}, name: "predict load", showlegend: false, type: "scatter", mode: "lines", hoverinfo: 'none'
        };

        var trace2 = {
            type: "scatter",
            mode: "lines",
            x: ['2013-10-04 22:23:00'],
            y: [0],
            line: {color: '#7F7F7F'},
            name : "predict load",
        };

        var low_load_trace = {
            type: 'scatter', mode: 'lines', showlegend: true,  line: { color: '#0054FF', width: 2, dash: 'dash'}, name: '안정',
            x: ['2013-10-04 22:23:00'],  //시작시간 끝 시간 가지고 값 넣어주도록 해야함
            y: [3000]
        };
        var mid_load_trace = {
            type: 'scatter', mode: 'lines', showlegend: true,  line: { color: '#2F9D27', width: 2, dash: 'dash'}, name: '경부하',
            x: ['2013-10-04 22:23:00'],  //시작시간 끝 시간 가지고 값 넣어주도록 해야함
            y: [5000]
        };
        var high_load_trace = {
            type: 'scatter', mode: 'lines', showlegend: true,  line: { color: '#FB8C00', width: 2, dash: 'dash'}, name: '중부하',
            x: ['2013-10-04 22:23:00'],  //시작시간 끝 시간 가지고 값 넣어주도록 해야함
            y: [7000]
        };
        var danger_load_trace = {
            type: 'scatter', mode: 'lines', showlegend: true,  line: { color: '#FF0000', width: 2, dash: 'dash'}, name: '위험',
            x: ['2013-10-04 22:23:00'],  //시작시간 끝 시간 가지고 값 넣어주도록 해야함
            y: [10000]
        };



        var data = [trace1, trace2, low_load_trace, mid_load_trace, high_load_trace, danger_load_trace];

        var defaultPlotlyConfiguration = {
            showLink: false, // removes the link to edit on plotly - works
            //modeBarButtonsToRemove: ['toImage', 'zoom2d', 'pan', 'pan2d', 'autoScale2d'],
            displaylogo: false,
            showTips: true
        };

        Plotly.newPlot('pqms_plot', data, pqms_plotly.defaultLayout, pqms_plotly.defaultPlotlyConfiguration);

    },



    makeLegendData : function(type, firstDate, lastDate){
        var x = [firstDate, lastDate];
        var y;
        if (type == "low") {
            y = [3000, 3000];
            return {type: "scatter", hoverinfo: 'none',mode: "lines", line: { color: '#0054FF', width: 2, dash: 'dash'}, name: '안정', 'x': x, 'y': y};
        } else if (type == "mid") {
            y = [5000, 5000];
            return {type: "scatter", hoverinfo: 'none',mode: "lines", line: { color: '#2F9D27', width: 2, dash: 'dash'}, name: '경부하', 'x': x, 'y': y};
        } else if (type == "high") {
            y = [7000, 7000];
            return {type: "scatter", hoverinfo: 'none',mode: "lines", line: { color: '#FB8C00', width: 2, dash: 'dash'}, name: '중부하', 'x': x, 'y': y};
        } else if (type == "danger") {
            y = [10000, 10000];
            return {type: "scatter", hoverinfo: 'none',mode: "lines", line: { color: '#FF0000', width: 2, dash: 'dash'}, name: '위험', 'x': x, 'y': y};
        } else {
            return null;
        }
    },

    //TODO : 차후에 각각 로직을 함수로 떼네도록 한다.
    redrawPlot : function(termsTime){
        if (pqms_plotly.dataList != undefined && pqms_plotly.dataList.length != 0) {
            const dataList = pqms_plotly.dataList;
            const startTime = new Date(dataList[0]['time']).getTime();
            const endTime = new Date(dataList[dataList.length - 1]['time']).getTime();

            var layout = JSON.parse(JSON.stringify(pqms_plotly.defaultLayout));
            layout.xaxis.autorange = false;
            layout.xaxis.range = [startTime, endTime];

            const accuracy = 0.9213;
            const plusValue = Math.abs(1 - accuracy) + 1;
            const minusValue = 1 - Math.abs(1 - accuracy);

            const lowLegendData = pqms_plotly.makeLegendData("low", startTime, endTime);
            const midLegendData = pqms_plotly.makeLegendData("mid", startTime, endTime);
            const highLegendData = pqms_plotly.makeLegendData("high", startTime, endTime);
            const dangerLegendData = pqms_plotly.makeLegendData("danger", startTime, endTime);

            var x = [];
            var y = [];
            var x_error = [];
            var y_error = [];
            const terms = new Date(termsTime);
            for (var i in dataList) {
                //const targetTime = new Date(dataList[i].time).getTime();
                const targetTime = new Date(dataList[i].time);
                if (targetTime <= terms) {
                    y.push(dataList[i].pqmsPredictOutput[0].load);
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

            var data = [trace_main, trace_error, lowLegendData, midLegendData, highLegendData, dangerLegendData];
            Plotly.react('pqms_plot', data, layout, pqms_plotly.defaultPlotlyConfiguration);
        }


    },
};
