

var secion_load_plotly = {
    dataList : [],

    setDataList : function(data){
        var copyData = JSON.parse(JSON.stringify(data));
        for (var i in copyData) {
            for (var key in copyData[i]) {
                delete copyData[i]['time'];
            }
        }
        secion_load_plotly.dataList = copyData;
    },

    defaultLayout : {
        width: 568,
        height: 350,
        margin: { l: 45, r: 15, b: 40, t: 45},
        xaxis: {
            title: '시간',
            type: 'date',
            tickformat : "%H:%M",
            autorange : true,
        },
        yaxis: {
            title: '부하',
            range : [0, 10],
            autorange : false,
        },
        bargap: 0.15,
        bargroupgap: 0.1,
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
        },
        shapes: [
            {
                type: 'line',
                xref : 'paper',
                x0: '0',
                y0: 1.7,
                x1: '1',
                y1: 1.7,
                line:{
                    color: '#FB8C00',
                    width: 1.5,
                    dash:'dot'
                }
            },
            {
                type: 'line',
                xref : 'paper',
                x0: '0',
                y0: 3,
                x1: '1',
                y1: 3,
                line:{
                    color: '#FF0000',
                    width: 1.5,
                    dash:'dot'
                }
            }
        ],
    },
    defaultPlotlyConfiguration : {
        showLink: false, // removes the link to edit on plotly - works
        //modeBarButtonsToRemove: ['toImage', 'zoom2d', 'pan', 'pan2d', 'autoScale2d'],
        displaylogo: false,
        showTips: true
    },

    initPlot : function(){

        var trace1 = {
            type: "bar",
            x: ['2013-10-04 22:23:00', '2013-10-05 22:23:00'],
            y: [0.9, 3.3],
            //marker: {color: 'rgb(55, 83, 109)'},
            name : "1번 구간 부하",
        };
/*        var trace2 = {
            type: "bar",
            x: ['2013-10-04 22:23:00', '2013-10-05 22:23:00'],
            y: [0.7, 2.3],
            //marker: {color: 'rgb(55, 83, 109)'},
            name : "2번 구간 부하",
        };
        var trace3 = {
            type: "bar",
            x: ['2013-10-04 22:23:00', '2013-10-05 22:23:00'],
            y: [1.3, 1.6],
            //marker: {color: 'rgb(55, 83, 109)'},
            name : "3번 구간 부하",
        };*/



        var data = [trace1];

        var defaultPlotlyConfiguration = {
            showLink: false, // removes the link to edit on plotly - works
            modeBarButtonsToRemove: ['toImage', 'zoom2d', 'pan', 'pan2d', 'autoScale2d'],
            displaylogo: false,
            showTips: true
        };

        Plotly.newPlot('section_load_plot', data, secion_load_plotly.defaultLayout, secion_load_plotly.defaultPlotlyConfiguration);

    },

    redrawPlot : function(){
        if (secion_load_plotly.dataList != undefined && secion_load_plotly.dataList.length != 0) {

            const dataList = secion_load_plotly.dataList;
            const startTime = new Date(dataList[0]['sec_1'][0]['time']).getTime();
            const endTime = new Date(dataList[dataList.length - 1]['sec_1'][0]['time']).getTime();

            var layout = JSON.parse(JSON.stringify(secion_load_plotly.defaultLayout));
            layout.xaxis.autorange = false;
            layout.xaxis.range = [startTime, endTime];

            //각 구간별로 값을 만들어야함 (plot을)
            var plots = [];
            var keyList = [];
            //키 값 배열을 만든다.
            for(var key in dataList[0]) {
                keyList.push(key);
            }
            //키 값 배열을 정렬한다. sec_1 sec_2 같이 _ 뒤 숫자를 기준으로 정렬할 수 있도록 한다.
            keyList.sort(function (a, b) {
                const terms_1 = parseInt(a.split("_")[1]);
                const terms_2 = parseInt(b.split("_")[1]);
                return terms_1 - terms_2;
            });
            //key 순서대로 plot을 만든다. plot map을 만든다.
            var plotMap = {};
            for (var i in keyList) {
                const name = keyList[i];
                plotMap[keyList[i]] = { type: "bar", name : name, x: [], y: []}
            }
            //list에서 각 map을 key 순서로 불러와서 plot에 data를 채워넣자.
            for (var i in dataList) {
                const secMap = dataList[i];
                for (var j in keyList) {
                    const key = keyList[j];
                    plotMap[key].x.push(secMap[key][0].time);
                    plotMap[key].y.push(secMap[key][0].load);
                }
            }
            //plotMap의 plot들을 배열로 만들자.
            var data = [];
            for (var i in keyList) {
                const key = keyList[i];
                data.push(plotMap[key]);
            }

            /*
            var trace1 = {
                type: "bar",
                x: ['2013-10-04 22:23:00', '2013-10-05 22:23:00'],
                y: [0.9, 3.3],
                //marker: {color: 'rgb(55, 83, 109)'},
                name : "1번 구간 부하",
            };
             */

/*            var trace_main = {
                type: "scatter",mode: "lines",line: {color: '#000000'}, name : "predict load", hoverinfo: 'none',
                x: x,  y: y
            };*/

            Plotly.react('section_load_plot', data, layout, secion_load_plotly.defaultPlotlyConfiguration);
        }

    },
};