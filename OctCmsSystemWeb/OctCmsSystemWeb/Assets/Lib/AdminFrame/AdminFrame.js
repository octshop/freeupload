/*========================== 后台管理框架脚本 ===============================*/

/************** 公共变量与配置参数 ***************/

//默认加载的主菜单索引
var mLoadMainMenuIndex = 0;
//默认加载的子菜单索引与主菜单索引匹配  子菜单项索引 [0 开始 ,包括所有子菜单项不分主菜单]
var mLoadSubMenuIndex = 0;

/*************** 初始化 *********************/
$(function () {

    
    //初始化 左侧菜单 
    initNavLeft();

    //当单击am-dropdown 下拉框时关闭弹出菜单 
    closeAllAmDropdownWin();

    //初始化主菜单列表的单击事件
    initClickMainMenu();

    //初始化折叠子级菜单
    initFoldSubList()

    //监听 需要跳转到Iframe加载内容的Li 标签单击事件
    listenerLinkLiToIframe();

    //初始化打开的主菜单和子菜单 
    initRedirectCurrentSubMenuItem();
    //initOpenDefaultMainMenu(mLoadMainMenuIndex, mLoadSubMenuIndex);

   

});

/********************* 自定义函数 *********************/

/**
 * 初始化 左侧菜单 
 * */
function initNavLeft() {

    $("#NavLeft").mouseenter(function () {
        foldNavLeft("Open");
    });
    $("#NavLeft").mouseleave(function () {
        foldNavLeft("Close");
    });
    $("#NavLeft").click(function () {
        foldNavLeft("Close");
    });



    //设置 左侧导航区高度
    setNavLeftHeightAuto();
}

/**
 * 展开与折叠左侧导航
 * @param {any} pFoldType 折叠类型 [Open / Close]
 */
function foldNavLeft(pFoldType) {
    if (pFoldType == "Open") {
        $("#NavLeft").css("width", "200px");
    }
    else {
        $("#NavLeft").css("width", "50px");
    }
}

/**
 * 设置 左侧导航区高度
 * */
function setNavLeftHeightAuto() {

    $(window).resize(function () {

        //浏览器时下窗口文档的高度
        var docWidth = $(document).width();
        var docHeight = window.innerHeight; //$(document).height();

        var navLeftHeight = docHeight - 50;

        $("#NavLeft").css("height", navLeftHeight);
        //$("#MainLeftNav").css("height", navLeftHeight);
        //$("#MainLeftNav").css("overflow-y", "auto");

        //console.log("innerHeight=" + $(document.body).innerHeight());

        var _winInnerHeight = window.innerHeight - 50;
        //console.log("window.innerHeigh=" + _winInnerHeight);

        document.getElementById('MainLeftNav').style.cssText = 'overflow-y: auto; height:' + _winInnerHeight + 'px;'

        //设置Iframe的宽度和高度
        $("#IframeContentPageID").width(docWidth - 200);
        $("#IframeContentPageID").height(docHeight - 48);

    });
    //重设窗口尺寸
    $(window).resize();
}

/**
 * 当单击 am-dropdown 下拉框时关闭弹出菜单 
 * */
function closeAllAmDropdownWin() {

    $(".am-dropdown").click(function () {

        $(".am-dropdown").dropdown("close");
    });


    //监听Iframe的单事件,并关闭am-dropdown下拉框
    IframeOnClick.track(document.getElementById("IframeContentPageID"), function () {


        $(".am-dropdown").dropdown("close");

    });
}

/**
 * 初始化折叠子级菜单
 * */
function initFoldSubList() {
    var _mainNavFoldArr = $(".main-nav-fold a.main-nav-sub-a");
    var _mainNavFoldSpanArr = $(".main-nav-fold a.main-nav-sub-a span");
    var _mainNavFoldUlArr = $(".main-nav-fold ul");

    //console.log(_mainNavFoldArr.length);

    _mainNavFoldArr.each(function (i) {

        _mainNavFoldArr.eq(i).click(function (e) {

            //var _labelObject = e.currentTarget;

            var _navIndex = i; //_labelObject.getAttribute("name").replace("MainFoldNavSub_", "");

            //console.log("_navIndex=" + _navIndex);

            if (_mainNavFoldUlArr.get(_navIndex).style.display == "none") {
                _mainNavFoldUlArr.get(_navIndex).style.display = "block";

                _mainNavFoldSpanArr.eq(_navIndex).removeClass("am-icon-caret-down").removeClass("am-icon-caret-up");
                _mainNavFoldSpanArr.eq(_navIndex).addClass("am-icon-caret-down");
            }
            else {
                _mainNavFoldUlArr.get(_navIndex).style.display = "none";

                _mainNavFoldSpanArr.eq(_navIndex).removeClass("am-icon-caret-down").removeClass("am-icon-caret-up");
                _mainNavFoldSpanArr.eq(_navIndex).addClass("am-icon-caret-up");
            }

        });

    });
}

/**
 * 监听 需要跳转到Iframe加载内容的Li 标签单击事件
 * */
function listenerLinkLiToIframe() {
    var _linkAiframeArr = $(".link-li-iframe");
    //console.log(_linkAiframeArr);
    _linkAiframeArr.click(function (e) {
        //console.log(e.currentTarget);
        //移除所有选中的Li新式
        _linkAiframeArr.each(function (i) {

            _linkAiframeArr.eq(i).removeClass("main-nav-current");
            //console.log(_linkAiframeArr.eq(i));
        });
        var _labelObj = e.currentTarget;
        console.log(_labelObj);
        //添加当前选择样式,通过设置属性来实现
        _labelObj.setAttribute("class", "main-nav-current link-li-iframe");

        //得到跳转的IframePage的URL
        var _hrefCurrentUrl = $(_labelObj).children("a").attr("href");
        console.log(_hrefCurrentUrl);
        //将子菜单加载的相对路径存入Cookie
        $.cookie("LoadSubMenuIframeURLCookie", undefined);
        $.cookie("LoadSubMenuIframeURLCookie", "" + _hrefCurrentUrl + "");

    });
}

/**
 * 初始化主菜单列表的单击事件
 * */
function initClickMainMenu() {

    var _navLeftItemArr = $(".nav-left-item");

    _navLeftItemArr.each(function (i) {

        _navLeftItemArr.eq(i).click(function () {

            console.log("主菜单索引=" + i);

            //存储当前访问的主菜单索引
            $.cookie("LoadMainMenuIndexCookie", "" + i + "");

            //加载和打开子菜单列表
            openMainSubMenu(i);

        })
    });
}

/**
 * 加载和打开子菜单列表
 * @param {any} pMainMenuIndex 主菜单索引 [0 开始]
 */
function openMainSubMenu(pMainMenuIndex) {

    var _navLeftNavAArr = $(".nav-left-nav-a");
    var _mainNavUlArr = $(".main-nav-ul");
    var _mainNavSubNameB = $("#MainNavSubNameB");

    //关闭之前的所有子菜单
    _mainNavUlArr.hide();

    //改变菜单标题文本
    _mainNavSubNameB.html(_navLeftNavAArr.eq(pMainMenuIndex).html());
    //打开子菜单列表
    _mainNavUlArr.eq(pMainMenuIndex).show();

    //console.log("执行了openMainSubMenu");
}

/**
 * 初始化打开的主菜单和子菜单 
 * @param {any} pMainMenuIndex 主菜单索引 [0 开始]
 * @param {any} pSubMenuIndex  子菜单项索引 [0 开始 ,包括所有子菜单项不分主菜单]
 */
function initOpenDefaultMainMenu(pMainMenuIndex, pSubMenuIndex) {

    //加载和打开子菜单列表
    openMainSubMenu(pMainMenuIndex);
    //选择指定索引的子菜单项
    selSubMenuItem(pSubMenuIndex)

    //存储当前访问的主菜单索引
    $.cookie("LoadMainMenuIndexCookie", pMainMenuIndex);

}

/**
 * 选择指定索引的子菜单项
 * @param {any} pSubMenuIndex 子菜单项索引 [0 开始 ,所有子菜单项，不分主菜单]
 */
function selSubMenuItem(pSubMenuIndex) {

    $(".link-li-iframe").removeClass("main-nav-current");
    $(".link-li-iframe").eq(pSubMenuIndex).addClass("main-nav-current");
    //加载URL到Iframe中
    var _iframeUrl = $(".link-li-iframe").eq(pSubMenuIndex).children("a").attr("href");
    //console.log("href=" + _iframeUrl);
    $("#IframeContentPageID").attr("src", _iframeUrl);
}

/**
 * 初始化跳转到上次访问的页面
 */
function initRedirectCurrentSubMenuItem() {

    //LoadSubMenuIframeURLCookie 当前访问的Ifame页 URL
    //LoadMainMenuIndexCookie 主菜单的索引Cookie

    //设置初始化访问页主次索引
    var _LoadSubMenuIframeURLCookie = $.cookie('LoadSubMenuIframeURLCookie');
    var _LoadMainMenuIndexCookie = $.cookie('LoadMainMenuIndexCookie');

    console.log("_LoadSubMenuIframeURLCookie=" + _LoadSubMenuIframeURLCookie);
    console.log("_LoadMainMenuIndexCookie=" + _LoadMainMenuIndexCookie);

    if (_LoadSubMenuIframeURLCookie == undefined && _LoadSubMenuIframeURLCookie == undefined) {
        //初始化打开的主菜单和子菜单 
        initOpenDefaultMainMenu(mLoadMainMenuIndex, mLoadSubMenuIndex);
        return;
    }

    if (_LoadMainMenuIndexCookie != undefined && _LoadMainMenuIndexCookie != "" && _LoadMainMenuIndexCookie != null) {

        //打开主菜单 
        openMainSubMenu(_LoadMainMenuIndexCookie);
    }

    if (_LoadSubMenuIframeURLCookie != undefined && _LoadSubMenuIframeURLCookie != "" && _LoadSubMenuIframeURLCookie != null) {
        try {
            $("#IframeContentPageID").attr("src", _LoadSubMenuIframeURLCookie);
        }
        catch (e) {

        }
    }
    //移除所有当前选择的样式
    $(".link-li-iframe").removeClass("main-nav-current");

}


/************* 监听 Iframe的单击事件 ****************/
var IframeOnClick = {
    resolution: 200,
    iframes: [],
    interval: null,
    Iframe: function () {
        this.element = arguments[0];
        this.cb = arguments[1];
        this.hasTracked = false;
    },
    track: function (element, cb) {
        this.iframes.push(new this.Iframe(element, cb));
        if (!this.interval) {
            var _this = this;
            this.interval = setInterval(function () { _this.checkClick(); }, this.resolution);
        }
    },
    checkClick: function () {
        if (document.activeElement) {
            var activeElement = document.activeElement;
            for (var i in this.iframes) {
                if (activeElement === this.iframes[i].element) { // user is in this Iframe  
                    if (this.iframes[i].hasTracked == false) {
                        this.iframes[i].cb.apply(window, []);
                        this.iframes[i].hasTracked = true;
                    }
                } else {
                    this.iframes[i].hasTracked = false;
                }
            }
        }
    }
};


/**
 * 监听Iframe的Src 改变
 * @param {any} obj
 */
function iframeURLChangeListener(obj) {

    var url = obj.contentWindow.location.href;
    console.log("IframeSrc=" + url);
    $.cookie("LoadSubMenuIframeURLCookie", undefined);
    //将Src写入Cookie
    $.cookie("LoadSubMenuIframeURLCookie", "" + url + "");

}