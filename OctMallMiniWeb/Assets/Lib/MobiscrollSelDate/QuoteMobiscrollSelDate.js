﻿//================================引用日期时间控件所需要的文件==========================//
    //获得根目录

    var strFullPath = window.document.location.href;

    var strPath = window.document.location.pathname;

    var pos = strFullPath.indexOf(strPath);

    var prePath = strFullPath.substring(0, pos);

    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);

    console.log("strFullPath=" + strFullPath + " | strPath=" + strPath);

    return (prePath + postPath);
}