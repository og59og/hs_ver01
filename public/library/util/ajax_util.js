// dependency : jquery

//ajax_obj 에 url(경로), type(GET or POST), data, run_function (함수여야 하면 ajax 결과 object를 파라미터로 받아야함)

ajax_util = {
    test : function(){
        alert("asdsad");
    },
    ajax_json : function(ajax_obj) {
        $.ajax({
            url: ajax_obj.url,
            type: ajax_obj.type,
            dataType: 'json',
            //data: JSON.stringify(ajax_obj.data),
            data: ajax_obj.data,
            success: function (result) {
                ajax_obj.run_function(result);
            }
        })
    }
};