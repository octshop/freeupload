//================================引用滚动条美化插件的JS(只需要引用此文件即可)==========================//

/*-----------调用方法----------
只需要引用文件 <script src="QuoteScrollBarMobileStyle.js"></script>
设置参数 scrollBarMobileStylePath = "../"; //文件夹路径名称
scrollBarMainContentID = "mainContent"; //滚动内容DIV的ID

HTML的内容
<div id="mainContent" style="width: 500px;height: 300px;border: 2px solid #1F1F1F;overflow: hidden;">
        <div style="width:100%">
            <!-- 滚动的内容区域 -->
            <div class="box" style="background:#546B8B; height:300px;">滚动条在这里</div>
            <div class="box" style="background:#5ACDE5; height:300px;">2</div>
            <div class="box" style="background:#483362; height:300px;">3</div>
            <div class="box" style="background:#723E4B; height:300px;">4</div>
            <div class="box" style="background:#546B8B; height:300px;">5</div>

        </div>
</div>

------------------------------*/


//-----------设置参数----------////var mobiscrollSelDate = "MobiscrollSelDate/";//var mobiscrollSelDate = "../ClhBao/JsPublicLib/MobiscrollSelDate/";var scrollBarMobileStylePath = "../"; //文件夹路径名称//var scrollBarMobileStylePath = "" + getRootPath("RelPath") + "/"; //文件夹路径名称var scrollBarMainContentID = "mainContent"; //滚动内容DIV的ID

//----------------初始化插件-------------//
$(function () {

    //alert(getRootPath("RelPath"));
    $("#" + scrollBarMainContentID).panel({ iWheelStep: 32 });
});


//--------------加载Js文件 ---------------//var myJsValScrollBarMobileStylePath = "";myJsValScrollBarMobileStylePath += "<script src=\"" + scrollBarMobileStylePath + "zUI.js\"></script>";//alert(myJsValScrollBarMobileStylePath);//myJsValMobiscrollSelDate += "<script src=\"" + mobiscrollSelDate + "dev/js/mobiscroll.core-2.5.2.js\" type=\"text/javascript\"></script>";document.write(myJsValScrollBarMobileStylePath);//-------------加载Css样式------------//var myJsValcrollBarMobileStyleCss = "";myJsValcrollBarMobileStyleCss += " <style type=\"text\/css\">";myJsValcrollBarMobileStyleCss += "        .zUIpanelScrollBox, .zUIpanelScrollBar {";myJsValcrollBarMobileStyleCss += "            width: 10px;";myJsValcrollBarMobileStyleCss += "            top: 4px;";myJsValcrollBarMobileStyleCss += "            right: 2px;";myJsValcrollBarMobileStyleCss += "            border-radius: 5px;";myJsValcrollBarMobileStyleCss += "        }";myJsValcrollBarMobileStyleCss += "        .zUIpanelScrollBox {";myJsValcrollBarMobileStyleCss += "            background: black;";myJsValcrollBarMobileStyleCss += "            opacity: 0.1;";myJsValcrollBarMobileStyleCss += "            filter: alpha(opacity=10);";myJsValcrollBarMobileStyleCss += "        }";myJsValcrollBarMobileStyleCss += "        .zUIpanelScrollBar {";myJsValcrollBarMobileStyleCss += "            background: #fff;";myJsValcrollBarMobileStyleCss += "            opacity: 0.8;";myJsValcrollBarMobileStyleCss += "            filter: alpha(opacity=80);";myJsValcrollBarMobileStyleCss += "        }";myJsValcrollBarMobileStyleCss += " <\/style>";document.writeln(myJsValcrollBarMobileStyleCss);//---------获取当前文件的路径-----------////pOutType 值：FullPath 全路径 ,RelPath 相对function getRootPath(pOutType) {
    //获得根目录

    var strFullPath = window.document.location.href;

    var strPath = window.document.location.pathname;

    var pos = strFullPath.indexOf(strPath);

    var prePath = strFullPath.substring(0, pos);

    var postPath = strPath.substring(1, strPath.substr(1).indexOf('/') + 1);

    console.log("strFullPath=" + strFullPath + " | strPath=" + strPath + " | prePath=" + prePath + "| postPath=" + postPath);

    //return (prePath + postPath);
    if (pOutType == "FullPath")
    {
        return strFullPath;
    }
    else if (pOutType == "RelPath")
    {
        return postPath;
    }
}
