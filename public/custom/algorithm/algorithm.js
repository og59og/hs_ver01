
algorithmManager = {
    callPVAlgorithm : function(capacity, date, algoType, pv_id){
        return new Promise(function(resolve, reject){
            $.ajax({
                type: "POST"
                , url: "/algorithm/pv"
                , data: { 'capacity': capacity, 'date' : date, 'algoType' : algoType, 'pv_id' : pv_id}
                , timeout: 45 * 1000
                , success:function(data){
                    if(data.body.isSuccess == false) {
                        reject(data);
                    }
                    resolve(data);
                }
                , error:function(data) {
                    console.log('[Client] Extent Error Data : ', data);
                    console.log('Ajax Error!');
                    reject(data);

                }
            });
        });
    },
    callPQMSAlgorithm : function(subs_id, dl_id, pred_date, algo_type){
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
                }
                , error:function(data) {
                    console.log('[Client] Extent Error Data : ', data);
                    console.log('Ajax Error!');
                    reject(data);

                }
            });
        });

    },
    callSectionLoadAlgorithm : function(dl_id, date, algoType) {
        return new Promise(function(resolve, reject){
            $.ajax({
                type: "POST"
                , url: "/algorithm/sectionLoad"
                , data: { 'dl_id': dl_id, 'date' : date, 'algoType' : algoType}
                , timeout: 45 * 1000
                , success:function(data){
                    console.log('data : ', data);
                    if(data.body.isSuccess == false) {
                        reject(data);
                    }

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
    }
};