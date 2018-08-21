
var sf_util = {

    /**
     * gis 버튼이 클릭되면 0, 단선도가 클릭되어 있으면 1  (gis=false 단선도=true)
     */
    getDiagramMode : function(){
        var diagramFlag;
        if ($("#gis").hasClass("select-button")) {
            diagramFlag = 0;        // GIS
        } else if ($("#oneLineDiagram").hasClass("select-button")) {
            diagramFlag = 1;        // 단선도
        }
        return diagramFlag;
    },
    /**
     *
     * @param mode
     *  - mode == 0 : GIS Mode
     *  - mode == 1 : Electrical Diagram Mode
     */
    diagramModeCahnge : function(mode) {
        if (mode === 0) {
            $("#diagram_submenu").css('display', 'none');
            $("#gis_diagram_submenu").show();
            $("#gis").addClass("select-button");
            $("#gis").removeClass("btn-default");
            $("#gis").addClass("btn-primary").trigger('classChange');
            $("#oneLineDiagram").addClass("select-button");
            $("#oneLineDiagram").removeClass("select-button");
            $("#oneLineDiagram").removeClass("btn-primary");
            $("#oneLineDiagram").addClass("btn-default").trigger('classChange');
        } else  {
            $("#gis").addClass("select-button");
            $("#gis").removeClass("select-button");
            $("#gis").removeClass("btn-primary");
            $("#gis").addClass("btn-default").trigger('classChange');
            $("#oneLineDiagram").addClass("select-button");
            $("#oneLineDiagram").removeClass("btn-default");
            $("#oneLineDiagram").addClass("btn-primary").trigger('classChange');
          /*  $("#diagram_submenu").css('visibility', 'visible');*/
            $("#diagram_submenu").show();
            $("#gis_diagram_submenu").css('display', 'none');
        }
    }
};
