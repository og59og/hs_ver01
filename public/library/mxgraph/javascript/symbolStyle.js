// mxGraph 스타일 지정
function configureStylesheet(graph) {
    var imageStyle = new Object();
    imageStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
    imageStyle[mxConstants.STYLE_STROKECOLOR] = "#FF000000";
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/alts.svg';
    imageStyle[mxConstants.STYLE_FONTCOLOR] = "#FFFFFF"; // 글자색
    // imageStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_BOTTOM;
    // imageStyle[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_TOP;
    imageStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    imageStyle[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_BOTTOM;
    imageStyle[mxConstants.STYLE_TEXT_DIRECTION] = mxConstants.TEXT_DIRECTION_LTR;
    graph.getStylesheet().putCellStyle("ALTS", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/ass.svg';
    graph.getStylesheet().putCellStyle("ASS", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/cbt_ga.svg';
    graph.getStylesheet().putCellStyle("CBT_GA", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/cos.svg';
    graph.getStylesheet().putCellStyle("COS", imageStyle);


    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/dm.svg';
    graph.getStylesheet().putCellStyle("DM", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/dnp_mf.svg';
    graph.getStylesheet().putCellStyle("DNP_MF", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/ga.svg';
    graph.getStylesheet().putCellStyle("GA", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/gs.svg';
    graph.getStylesheet().putCellStyle("GS", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/oh2.svg';
    graph.getStylesheet().putCellStyle("OH2", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/prot_ra.svg';
    graph.getStylesheet().putCellStyle("PROT_RA", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/ra_gas_ins.svg';
    graph.getStylesheet().putCellStyle("RA_gas_ins", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/ra.svg';
    graph.getStylesheet().putCellStyle("RA", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/ga_rb.svg';
    graph.getStylesheet().putCellStyle("RA_rb", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/tr.svg';
    graph.getStylesheet().putCellStyle("TR", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/cbt_base.svg';
    graph.getStylesheet().putCellStyle("CBT_BASE", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/mf.svg';
    graph.getStylesheet().putCellStyle("MF", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/pad_ex.svg';
    graph.getStylesheet().putCellStyle("PAD EX", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/der_lv.svg';
    graph.getStylesheet().putCellStyle("DER_LV", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/load_tr.svg';
    graph.getStylesheet().putCellStyle("LOAD_TR", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/ga_ex.svg';
    graph.getStylesheet().putCellStyle("GA EX", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/der_mf_pad_4.svg';
    graph.getStylesheet().putCellStyle("DER_MF_PAD_4", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/dg.svg';
    imageStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    imageStyle[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_BOTTOM;
    graph.getStylesheet().putCellStyle("DG", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/ca.svg';
    imageStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_BOTTOM;
    imageStyle[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_TOP;
    graph.getStylesheet().putCellStyle("CA", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/substation.svg';
    graph.getStylesheet().putCellStyle("SUBSTATION", imageStyle);

    imageStyle = mxUtils.clone(imageStyle);
    imageStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/mtr.svg';
    imageStyle[mxConstants.STYLE_FONTCOLOR] = "#FFFFFF"; // 글자색
    imageStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    imageStyle[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_BOTTOM;
    imageStyle[mxConstants.STYLE_IMAGE_WIDTH] = '25';
    imageStyle[mxConstants.STYLE_IMAGE_HEIGHT] = '15';
    graph.getStylesheet().putCellStyle("MTR", imageStyle);

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    var padStyle = new Object();
    padStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
    padStyle[mxConstants.STYLE_STROKECOLOR] = "#FF000000";
    padStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/alts.svg';
    padStyle[mxConstants.STYLE_FONTCOLOR] = "#FFFFFF"; // 글자색
    graph.getStylesheet().putCellStyle("ALTS", padStyle);

    padStyle = mxUtils.clone(imageStyle);
    padStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/dnp_mf_4.svg';
    graph.getStylesheet().putCellStyle("DNP_MF 4", padStyle);

    padStyle = mxUtils.clone(padStyle);
    padStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/dnp_mf_fp_4.svg';
    graph.getStylesheet().putCellStyle("DNP_MF_FP_4", padStyle);

    padStyle = mxUtils.clone(padStyle);
    padStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/pa.svg';
    graph.getStylesheet().putCellStyle("PA", padStyle);

    padStyle = mxUtils.clone(padStyle);
    padStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/pca_ga.svg';
    graph.getStylesheet().putCellStyle("PCA_GA", padStyle);

    padStyle = mxUtils.clone(padStyle);
    padStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/pca_rc.svg';
    graph.getStylesheet().putCellStyle("PCA_RC", padStyle);

    padStyle = mxUtils.clone(padStyle);
    padStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/pd.svg';
    graph.getStylesheet().putCellStyle("PD", padStyle);

    padStyle = mxUtils.clone(padStyle);
    padStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/one_ga.svg';
    graph.getStylesheet().putCellStyle("ONE_GA", padStyle);

    padStyle = mxUtils.clone(padStyle);
    padStyle[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/one_rc.svg';
    graph.getStylesheet().putCellStyle("ONE_RC", padStyle);

    var style = new Object();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    style[mxConstants.STYLE_STROKECOLOR] = "#FFFFFFFF";
    style[mxConstants.STYLE_FILLCOLOR] = "#FF0000";
    style[mxConstants.STYLE_FONTSTYLE] = 1;
    style[mxConstants.STYLE_FONTCOLOR] = "#FFFFFF"; // 글자색
    style[mxConstants.STYLE_FONTSIZE] = "8";

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = "#FFFF00";
    style[mxConstants.STYLE_STROKECOLOR] = "#FF000000";
    style[mxConstants.STYLE_FONTCOLOR] = "#000000"; // 글자색
    graph.getStylesheet().putCellStyle("OBJ_NEW", style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = "#FFFF0000";
    style[mxConstants.STYLE_STROKECOLOR] = "#FF000000";
    style[mxConstants.STYLE_FONTCOLOR] = "#FFFFFF"; // 글자색
    style[mxConstants.STYLE_FONTSIZE] = "25";
    style[mxConstants.STYLE_ALIGN] = "ALIGN_LEFT";
    graph.getStylesheet().putCellStyle("DL", style);

    var lineStyle = new Object();
    lineStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    lineStyle[mxConstants.STYLE_VERTICAL_ALIGN] = "top";
    lineStyle[mxConstants.STYLE_STROKECOLOR] = "#FFFFFF";
    lineStyle[mxConstants.STYLE_ENDARROW] = "none";
    lineStyle[mxConstants.STYLE_STROKEWIDTH] = "1";
    lineStyle[mxConstants.STYLE_FONTCOLOR] = "#FFFFFF";
    graph.getStylesheet().putCellStyle("lineStyle", lineStyle);

    var childStyle = new Object;
    childStyle[mxConstants.STYLE_ALIGN] = 'center';
    childStyle[mxConstants.STYLE_VERTICAL_ALIGN] = 'top';
    childStyle[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#FF000000';
    childStyle[mxConstants.STYLE_FONTCOLOR] = '#FFFFFF'; // 글자색
    graph.getStylesheet().putCellStyle("childStyle", childStyle);

    childStyle = mxUtils.clone(childStyle);
    childStyle[mxConstants.STYLE_ALIGN] = 'left';
    graph.getStylesheet().putCellStyle("symbolInfoStyle", childStyle);

    var tmpSectionStyle = new Object();
    tmpSectionStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
    tmpSectionStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
    tmpSectionStyle[mxConstants.STYLE_STROKECOLOR] = "#FFFFFF";
    tmpSectionStyle[mxConstants.STYLE_FILLCOLOR] = "#FF000000";
    tmpSectionStyle[mxConstants.STYLE_DASHED] = 1;
    graph.getStylesheet().putCellStyle("tmpSectionStyle", tmpSectionStyle);

    var tmpSectionSec = new Object();
    tmpSectionSec[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
    tmpSectionSec[mxConstants.STYLE_STROKECOLOR] = "#FF000000";
    tmpSectionSec[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/sec_1.svg';
    tmpSectionSec[mxConstants.STYLE_FONTCOLOR] = "#FFFFFF"; // 글자색
    tmpSectionSec[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    tmpSectionSec[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_BOTTOM;
    tmpSectionSec[mxConstants.STYLE_TEXT_DIRECTION] = mxConstants.TEXT_DIRECTION_LTR;
    graph.getStylesheet().putCellStyle("tmpSectionSec1", tmpSectionSec);

    tmpSectionSec = mxUtils.clone(tmpSectionSec);
    tmpSectionSec[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/sec_2.svg';
    graph.getStylesheet().putCellStyle("tmpSectionSec2", tmpSectionSec);

    tmpSectionSec = mxUtils.clone(tmpSectionSec);
    tmpSectionSec[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/sec_3.svg';
    graph.getStylesheet().putCellStyle("tmpSectionSec3", tmpSectionSec);

    tmpSectionSec = mxUtils.clone(tmpSectionSec);
    tmpSectionSec[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/sec_4.svg';
    graph.getStylesheet().putCellStyle("tmpSectionSec4", tmpSectionSec);

    tmpSectionSec = mxUtils.clone(tmpSectionSec);
    tmpSectionSec[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/sec_5.svg';
    graph.getStylesheet().putCellStyle("tmpSectionSec5", tmpSectionSec);

    tmpSectionSec = mxUtils.clone(tmpSectionSec);
    tmpSectionSec[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/sec_6.svg';
    graph.getStylesheet().putCellStyle("tmpSectionSec6", tmpSectionSec);

    tmpSectionSec = mxUtils.clone(tmpSectionSec);
    tmpSectionSec[mxConstants.SHAPE_IMAGE] = '../library/mxgraph/javascript/src/symbol/sec_7.svg';
    graph.getStylesheet().putCellStyle("tmpSectionSec7", tmpSectionSec);

}