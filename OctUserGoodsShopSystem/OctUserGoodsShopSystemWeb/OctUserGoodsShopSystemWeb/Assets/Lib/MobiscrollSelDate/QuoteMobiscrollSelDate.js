//================================引用日期时间控件所需要的文件==========================////-----------文件夹路径名称----------////var mobiscrollSelDate = "MobiscrollSelDate/";var mobiscrollSelDate = "../JsPublicLib/MobiscrollSelDate/";//-----------文件夹路径名称----------//var myJsValMobiscrollSelDate = "";myJsValMobiscrollSelDate += "<script src=\"" + mobiscrollSelDate + "dev/js/mobiscroll.core-2.5.2.js\" type=\"text/javascript\"></script>";myJsValMobiscrollSelDate += "<script src=\"" + mobiscrollSelDate + "dev/js/mobiscroll.core-2.5.2-zh.js\" type=\"text/javascript\"></script>";myJsValMobiscrollSelDate += "<link href=\"" + mobiscrollSelDate + "dev/css/mobiscroll.core-2.5.2.css\" rel=\"stylesheet\" type=\"text/css\" />";myJsValMobiscrollSelDate += "<script src=\"" + mobiscrollSelDate + "dev/js/mobiscroll.datetime-2.5.1.js\" type=\"text/javascript\"></script>";myJsValMobiscrollSelDate += "<script src=\"" + mobiscrollSelDate + "dev/js/mobiscroll.datetime-2.5.1-zh.js\" type=\"text/javascript\"></script>";document.write(myJsValMobiscrollSelDate);//获取当前文件的路径function getRootPath() {
    //获得根目录

    var strFullPath = window.document.location.href;

    var strPath = window.document.location.pathname;

    var pos = strFullPath.indexOf(strPath);

    var prePath = strFullPath.substring(0, pos);

    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);

    console.log("strFullPath=" + strFullPath + " | strPath=" + strPath);

    return (prePath + postPath);
}