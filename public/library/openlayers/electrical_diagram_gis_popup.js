
$(function(){

    var progressBarTimerId;
    initSelectedObjInfoTab();

/*
    $('#substInfoTab').on('click', function(){

        // alert(' substInfoTab 탭 클릭');


    });*/

    $('#algorithmListTab').on('click', function() {

 /*       $.ajax({
            url: "/electrical_diagram_gis/selectAlgorithmList",
            type: "POST",
            dataType: 'json',
            success: function (data){
                $("#algorithmListTbody").empty();
                for (var i = 0; i < data.length; i++) {
                    var tr = document.createElement("tr");
                    var checkTd = $("<td><input type='checkbox' name='algorithmList' value="+ data[i].algorithm_name + "></td>");
                    var algoNameTd = $("<td>" + data[i].algorithm_name + "</td>");
                    $(tr).append(algoNameTd).append(algoNameTd).append(checkTd); //TODO : append 중간에 버전 select box 같은걸로 바꿔야함
                    $(algorithmListTbody).append(tr);
                }
                $(algorithmListDiv).trigger("classChange");
            }
        })*/


    });



    $('#substEquipmentTab').on('click', function(){
        // alert(' substInfoTab 탭 클릭');
        var substcd = $("#substcd").val();

        $('#substInfoDiv').hide();
        $('#substEquipmentDiv').show();

        $('#subsinfo').find('.modal-content').css({
            width:'500px', //probably not needed
            height:'auto', //probably not needed
            'max-height':'100%',
            'max-width':'500px'
        });
        /*    $('#subsinfo').find('.modal-content').find('.list-group').css({
                width:'auto', //probably not needed
                height:'auto', //probably not needed
                overflow : 'scroll',
                '-webkit-overflow-scrolling' : 'touch',
                'max-height':'600px',
                'max-width':'500px'

            });*/
        // $('#algorithmListDiv').hide();

        $.ajax({
            type: "POST"
            , url: "/electrical_diagram_gis/request_subst_equipment"
            , data: { 'substid': substcd }
            , success:function(data){
                console.log('request_subst_equipment Success ! ');
                console.log(data);
                // $('#substQueryData').val(data);
                $("#substEquipmentDiv").empty();

                var treeData = makeSubstEquipmentTreeData(data);
                console.log('treeData', treeData);

                /*var defaultData = [
                    {
                        text: 'Parent 1',
                        href: '#parent1',
                        id: 'Parent 1',
                        tags: ['4'],
                        nodes: [
                            {
                                text: 'Child 1',
                                href: '#child1',
                                tags: ['2'],
                                id: 'Child 1',
                                nodes: [
                                    {
                                        text: 'Grandchild 1',
                                        href: '#grandchild1',
                                        id: 'Grandchild 1',
                                        tags: ['0']
                                    },
                                    {
                                        text: 'Grandchild 2',
                                        href: '#grandchild2',
                                        id: 'Grandchild 2',
                                        tags: ['0']
                                    }
                                ]
                            },
                            {
                                text: 'Child 2',
                                href: '#child2',
                                id: 'Child 2',
                                tags: ['0']
                            }
                        ]
                    },
                    {
                        text: 'Parent 2',
                        href: '#parent2',
                        id: 'Parent 2',
                        tags: ['0']
                    },
                    {
                        text: 'Parent 3',
                        href: '#parent3',
                        id: 'Parent 3',
                        tags: ['0']
                    },
                    {
                        text: 'Parent 4',
                        href: '#parent4',
                        id: 'Parent 4',
                        tags: ['0']
                    },
                    {
                        text: 'Parent 5',
                        href: '#parent5',
                        id: 'Parent 5',
                        tags: ['4'],
                        nodes: [
                            {
                                text: 'Child 1',
                                href: '#child1',
                                tags: ['2'],
                                id: 'Child 1',
                                nodes: [
                                    {
                                        text: 'Grandchild 1',
                                        href: '#grandchild1',
                                        id: 'Grandchild 1',
                                        tags: ['0']
                                    },
                                    {
                                        text: 'Grandchild 2',
                                        href: '#grandchild2',
                                        id: 'Grandchild 2',
                                        tags: ['0']
                                    }
                                ]
                            },
                            {
                                text: 'Child 2',
                                href: '#child2',
                                id: 'Child 2',
                                tags: ['0']
                            }
                        ]
                    }
                ];*/

                $('#substEquipmentDiv').treeview({
                    color: "#428bca",
                    expandIcon: "glyphicon glyphicon-plus",
                    collapseIcon: "glyphicon glyphicon-minus",
                    nodeIcon: "glyphicon glyphicon-flash",
                    showTags: true,
                    data: treeData,
                    onNodeSelected: function(event, node) {
                        // alert('onNodeSelected');
                        console.log(node);
                        console.log(event);
                        if(node.type == 'MTR'){
                            alert('DL을 선택해주세요.');
                        }
                        else if(node.type == 'DL'){
                            console.log('DL Select');
                            $(".modal-body #subs_id").val($("#substcd").val());
                            $(".modal-body #dl_id").val(node.id);
                            $(".modal-body #dl_name").val(node.text);

                            $("#subsAlgorithm").modal('show');
                        }
                    },
                });
            }
            , error:function(data) {
                console.log('[Client] Extent Error Data : ', data);
                console.log('Ajax Error!');
            }
        });
    });

    /*$('#algorithmListTab').on('click', function(){
        // alert('algorithmListDiv 탭 클릭');

        $('#substInfoDiv').hide();
        $('#substEquipmentDiv').hide();
        // $('#algorithmListDiv').show();

    });*/
    /*
        Modal이 표시될 때 처리할 이벤트
        CSS 전환까지 완료된 후의 이벤트를 처리하려면 .on('shown.bs.modal', function () 을 해야한다.
    */
    $("#subsAlgorithm").on('show.bs.modal', function (){
        $('#subsAlgorithm').focus();
        var treeData = [
            {
                text: 'PQMS',
                id: 'PQMS'
            },
            {
                text: 'ETC',
                id: 'ETC'
            }
        ];

        $('#algorithmListDiv').treeview({
            color: "#428bca",
            expandIcon: "glyphicon glyphicon-plus",
            collapseIcon: "glyphicon glyphicon-minus",
            nodeIcon: "glyphicon glyphicon-print",
            showTags: true,
            data: treeData,
            onNodeSelected: function(event, node) {
                // alert('onNodeSelected');
                console.log(node);
                console.log(event);
                if(node.id == 'PQMS'){

                    $("#subspqms").modal('show');
                }
                else if(node.id == 'ETC'){
                    alert('기타 알고리즘에 대한 처리는 별도의 등록이 필요하오니, 관리자에게 문의하시기 바랍니다.');
                }
            },
        });
    });

   /* $("#subspqms").on('show.bs.modal', function (){
        // alert('PQMS Modal Create!');
        // console.log(d3.select("#subsPqmsDiv").text());
        // var chartWidth = 400, chartHeight = 400;
        //remove_span_group
        $('#subspqms').focus();
        $('#subspqms').find('.modal-content').css({
            width:'400px', //probably not needed
            height:'150px' //probably not needed
        });

        if(event.toElement.getAttribute('id') == "remove_PQMS_span" || event.toElement.getAttribute('id') == "calendar_PQMS_span" ||
            event.toElement.getAttribute('id') == "remove_PQMS_span_group" || event.toElement.getAttribute('id') == "calendar_PQMS_span_group"
            || event.toElement.getAttribute('class') == "today"
            || event.toElement.getAttribute('class') == "minute active" || event.toElement.getAttribute('class') == "minute"){
            return;
        }
        $('#subs_pqms_dateTimePickerDiv').datetimepicker({
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayBtn: true,
            todayHighlight: true,
            minuteStep: 10,
        });

        $('#predPqmsDateInput').val("");
        if($('.selectpicker').attr('id') == "pqms_algo_type"){
            $('.selectpicker').val('default');
        }

        clearSVGTagContent();
        createEmptySVGTagContent();

    });

    $("#subspqms").on('hide.bs.modal', function (){
        if(event.toElement.getAttribute('id') == "remove_span" || event.toElement.getAttribute('id') == "calendar_span" ||
            event.toElement.getAttribute('id') == "remove_span_group" || event.toElement.getAttribute('id') == "calendar_span_group"
            || event.toElement.getAttribute('class') == "today"
            || event.toElement.getAttribute('class') == "minute active" || event.toElement.getAttribute('class') == "minute"){
            return;
        }
        clearSVGTagContent();
    });
*/


    $("#pqmsProgressBar").on('show.bs.modal', function (){
        var percent;

        progressBarTimerId = setInterval(function() {

            // increment progress bar
            percent += 5;
            $('#pqmsProgressBar').css('width', percent + '%');
            // $('#load').html(percent + '%');


            // complete
            if (percent >= 100) {
                percent = 0;
                // $('#pqmsProgressBar').removeClass('progress-bar-striped active');
                // $('#pqmsProgressBar').html('payment complete');

            }

        }, 200);
    });

    $("#pqmsProgressBar").on('hide.bs.modal', function (){
        clearInterval(progressBarTimerId);
    });
});

function initSelectedObjInfoTab(){
    var substcd = $("#substcd").val();
    var substnm = $("#substnm").val();
    var pwrmngdept = $("#pwrmngdept").val();

    /*var objInfo = {
        type: "subs",
        value: [node.id, node.type, node.no, node.name]
    };*/
    var subsid = "";

    try{
        var coordiMap = getSubsCoordinateMap().get(substcd);
        if(coordiMap !== undefined){
            subsid = coordiMap.get('subs_id');
        }

    }catch (error) {
        console.log('substInfoTab Error : ', error);
    }

    if(subsid === "Not_Exist_Data"){
        subsid = "";
    }
    var eqipType = "SUBSTATION";
    if($("#substcd").val() === ""){
        eqipType = "";
    }
    var objInfo = {
        type: "subs",
        value: [subsid, eqipType, substcd, substnm]
    };
    showInfoRightMenu(objInfo);
}

function makeSubstEquipmentTreeData(originData){
    console.log('originData : ', originData);

    var mtrList = [];
    var resultList = [];
    for(var i=0; i<originData.length; i++){
        if(mtrList.indexOf(originData[i].mtr_id) == -1)
        {
            mtrList.push(originData[i].mtr_id);
            /*var mtrMap = {};
            mtrMap.set('text', originData[i].mtr_id);
            mtrMap.set('id', originData[i].mtr_id);
            mtrMap.set('tags', originData[i].cnt_mtr_value);
            mtrMap.set('nodes', new Array());*/
            var mtrMap = {
                'text': originData[i].mtr_id,
                'id': originData[i].mtr_id,
                'type': 'MTR',
                // 'tags': [originData[i].cnt_mtr_value],
                'nodes': new Array()
            };
            resultList.push(mtrMap);
        }

        var mtrIndex = mtrList.indexOf(originData[i].mtr_id);
        /* var dlMap = new Map();
         dlMap.set('text', originData[i].dl_name);
         dlMap.set('id', originData[i].dl_id);
         dlMap.set('no', originData[i].dl_no);
         dlMap.set('tags', 0);*/
        var dlMap = {
            'text': originData[i].dl_name,
            'id': originData[i].dl_id,
            'no': originData[i].dl_no,
            // 'href' : '#subspqms',
            'type': 'DL'
            // 'tags': ['0']
        };
        resultList[mtrIndex].nodes.push(dlMap);

    }
    return resultList;
}

/*//##TODO : algo js 따로 만들어서 이동해야함
function callPQMSAlgorithm(subs_id, dl_id, pred_date, algo_type){
    return new Promise(function(resolve, reject){
        $.ajax({
            type: "POST"
            , url: "/electrical_diagram_gis/requst_pqms_algorithm"
            , data: { 'subs_id': subs_id, 'dl_id' : dl_id, 'pred_date' : pred_date, 'algo_type' : algo_type}
            , timeout: 45 * 1000
            , success:function(data){
                if(data.body.isSuccess == false) {
                    reject(data);
                }
                console.log('data : ', data);
                resolve(data.body);
                //drawPQMSResultChart(data.body.returnCode, data.body.input, data.body.output, data.body.readOutput, data.body.nrmse );
            }
            , error:function(data) {
                console.log('[Client] Extent Error Data : ', data);
                console.log('Ajax Error!');
                reject(data);

            }
        });
    });

}*/

function clearSVGTagContent(){
    if(document.getElementsByTagName('svg').length > 0) {
        for (var i = 0; i < document.getElementsByTagName('svg').length; i++) {
            if( document.getElementsByTagName('svg')[i].parentElement.id == "subsPqmsDiv"){
                document.getElementsByTagName('svg')[i].remove();
            }
        }
    }
}

function createEmptySVGTagContent(){
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        chartWidth = 500 - margin.left - margin.right,
        chartHeight = 400 - margin.top - margin.bottom;

    d3.select("#subsPqmsDiv").append("svg")
        .attr("width", chartWidth + margin.left + margin.right + 100)
        .attr("height", chartHeight + margin.top + margin.bottom);
}

/**
 *
 * @param returnCode
 * @param input
 * @param output
 * @param realOutput
 * @param nrmse
 */
function drawPQMSResultChart(returnCode, input, output, realOutput, nrmse){

    output.unshift(input[0]);
    realOutput.unshift(input[0]);
    clearSVGTagContent();

    if(returnCode){
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            chartWidth = 500 - margin.left - margin.right,
            chartHeight = 400 - margin.top - margin.bottom;
        // set the ranges
        var x = d3.scaleTime().range([0, chartWidth]);
        var y = d3.scaleLinear().range([chartHeight, 0]);

        var resultLine = d3.line()
            .x(function(d) { return x( new Date(d.time)); })
            .y(function(d) { return y(d.load); });
        // .interpolate("linear");

        var svgItem = d3.select("#subsPqmsDiv").append("svg")
            .attr("width", chartWidth + margin.left + margin.right + 100)
            .attr("height", chartHeight + margin.top + margin.bottom)
            .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain([new Date(input[input.length - 1].time), new Date(output[output.length - 1].time)]);

        /*Make aggregation Data Of PQMS Algorithm Start*/
        var aggregationPQMS = [];

        for(var i=0; i< input.length; i++){
            aggregationPQMS.push(input[i]);
        }
        for(var i=0; i< output.length; i++){
            aggregationPQMS.push(output[i]);
        }
        for(var i=0; i< realOutput.length; i++){
            aggregationPQMS.push(realOutput[i]);
        }

        /*Make aggregation Data Of PQMS Algorithm End*/

        y.domain([0, d3.max(aggregationPQMS, function(d) { return  d.load; })]);

        svgItem.append("path")
            .data([input])
            // .attr("class", "line")
            .attr("d", resultLine(input))
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            // .attr("data-legend",function(d) { return "Input"})
        ;

        /* svgItem.append("line")          // attach a line
             .style("stroke", "gray")  // colour the line
             .attr("stroke-dasharray", "5,5")
             .attr("x1", selectItemLine(resultPQMS[centerOfIndex]))     // x position of the first end of the line
             .attr("y1", 0)      // y position of the first end of the line
             .attr("x2", selectItemLine(resultPQMS[centerOfIndex]))     // x position of the second end of the line
             .attr("y2", chartHeight);*/

        svgItem.append("path")
            .data([output])
            // .attr("class", "line")
            .attr("d", resultLine(output))
            .attr("stroke", "green")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            // .attr("data-legend",function(d) { return "Output"})
        ;

        svgItem.append("path")
            .data([realOutput])
            // .attr("class", "line")
            .attr("d", resultLine(realOutput))
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            // .attr("data-legend",function(d) { return "RealOutput"})
        ;

        svgItem.append("g")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(d3.axisBottom(x));

        svgItem.append("g")
            .call(d3.axisLeft(y));

        var legendIndexItem = [input, output, realOutput];

        var legendTag = [
            ["input", "blue"],
            ["output", "green"],
            ["realOutput", "red"]
        ];

        var legend = svgItem.append("g")
            // .attr("class", "legend")
            //.attr("x", w - 65)
            //.attr("y", 50)
            .attr("height", 100)
            .attr("width", 100)
            .attr("padding", 5)
            .attr("font", "10px sans-serif")
            .attr("background", "yellow")
            .attr("box-shadow", "2px 2px 1px #888")
            .attr('transform', "translate(50,30)")
        ;

        legend.selectAll('rect')
            .data(legendIndexItem)
            .enter()
            .append("rect")
            .attr("x", chartWidth - 35)
            .attr("y", function(d, i){ return i *  20;})
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d) {
                var color = legendTag[legendIndexItem.indexOf(d)][1];
                return color;
            })
        ;

        legend.selectAll('text')
            .data(legendIndexItem)
            .enter()
            .append("text")
            .attr("x", chartWidth - 22)
            .attr("y", function(d, i){ return i *  20 + 9;})
            .text(function(d) {
                var text = legendTag[legendIndexItem.indexOf(d)][0];
                return text;
            })
        ;
    }


}

var drawPqmsProcess = function(subs_id, dl_id, predDate, algoType){
    var callPqmsAlgoPromise = algorithmManager.callPQMSAlgorithm(subs_id, dl_id, predDate, algoType);
    callPqmsAlgoPromise.then(function(resolve){
        drawPQMSResultChart(resolve.returnCode, resolve.input, resolve.output, resolve.realOutput, resolve.nrmse );
    }, function(reject){
        console.log('[Client] Extent Error Data : ', reject);
        console.log('Ajax Error!');
    });
};

