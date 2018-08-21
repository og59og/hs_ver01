/**
 * need jquery
 */
$(function() {


    $('#listTabSub').off("click").on("click", function () {
        $('#listTableSub').footable({
            "columns": $.get('/system/subs/column'),
            "rows": $.get('/system/subs/rows'),
            "paging": {"size": 5}
        })
        $('#listTableMtr').hide();
        $('#listTableDl').hide();
        $('#listTableSw').hide();
    });


    $('#listTabMtr').off("click").on("click", function () {
        $('#listTableMtr').footable({
            "columns": $.get('/system/mtr/column'),
            "rows": $.get('/system/mtr/rows'),
            "paging": {"size": 5}
        })
        $('#listTableSub').hide();
        $('#listTableDl').hide();
        $('#listTableSw').hide();
    });

    $('#listTabDl').off("click").on("click", function () {
        $('#listTableDl').footable({
            "columns": $.get('/system/dl/column'),
            "rows": $.get('/system/dl/rows'),
            "paging": {"size": 5}
        })
        $('#listTableSub').hide();
        $('#listTableMtr').hide();
        $('#listTableSw').hide();
    });


    $('#listTabSw').off("click").on("click", function () {
        $('#listTableSw').footable({
            "columns": $.get('/system/sw/column'),
            "rows": $.get('/system/sw/rows'),
            "paging": {"size": 5}
        })
        $('#listTableSub').hide();
        $('#listTableMtr').hide();
        $('#listTableDl').hide();
    });
})



