﻿//================================引用滚动条美化插件的JS(只需要引用此文件即可)==========================//

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


//-----------设置参数----------//

//----------------初始化插件-------------//
$(function () {

    //alert(getRootPath("RelPath"));
    $("#" + scrollBarMainContentID).panel({ iWheelStep: 32 });
});



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