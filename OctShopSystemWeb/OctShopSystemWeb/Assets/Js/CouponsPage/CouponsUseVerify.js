﻿//=============线下使用验证===============//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Coupons/CouponsUseVerify";

/**------初始化------**/
$(function () {

    //初始化详细窗口显示代码
    initDetailWinHtml();

});

/**
 * 查询验证优惠券信息列表
 * */
function searchCheckCouponsUseVerify() {

    //获取表单值
    var IssueIDTxt = $("#IssueIDTxt").val().trim();
    var CheckCodeTxt = $("#CheckCodeTxt").val().trim();
    if (CheckCodeTxt == "") {
        toastWin("【验证码】不能为空！");
        $("#CheckCodeTxt").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "IssueID": IssueIDTxt, "VerifyCode": CheckCodeTxt,
    };
    console.log(dataPOST);

    //加载提示窗口
    loadingWin();

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("查询验证优惠券信息列表=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);

                if (_jsonObj.VerifyCodeList.length <= 0) {
                    $("#CheckOrderList").html("没有查询到相关数据");
                    return;
                }

                //构造验证优惠券列表 显示代码
                var _xhtmlCouponsUseVerifyList = xhtmlCouponsUseVerifyList(_jsonObj.VerifyCodeList);
                $("#CheckOrderList").html(_xhtmlCouponsUseVerifyList);

            }
            else {
                $("#CheckOrderList").html("没有查询到相关数据");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 构造验证优惠券列表 显示代码
 * @param {any} pVerifyCodeListJson
 */
function xhtmlCouponsUseVerifyList(pVerifyCodeListJson) {

    var myJsVal = "";
        }
        }
        }
        }
    return myJsVal;
}


/**
 * 优惠券使用验证  进行验证
 * */
function verifyCouponsCheckCode(pIssueID, pBuyerUserID) {

    if (pIssueID == "" || pBuyerUserID == "") {
        return;
    }

    confirmWinWidth("确定要验证使用吗？", function () {

        //获取表单值
        var CheckCodeTxt = $("#CheckCodeTxt").val().trim();
        if (CheckCodeTxt == "") {
            toastWin("【验证码】不能为空！");
            $("#CheckCodeTxt").focus();
            return;
        }

        //构造POST参数
        var dataPOST = {
            "Type": "2", "ExtraData": pIssueID, "BuyerUserID": pBuyerUserID, "VerifyType": "Coupons", "VerifyCode": CheckCodeTxt,
        };
        console.log(dataPOST);

        //加载提示窗口
        loadingWin();

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../VerifyCode/VerifyCodeAll?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("优惠券使用验证=" + reTxt);

                //移除加载提示
                closeLoadingWin();

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        toastWin(_jsonObj.ErrMsg);
                        return;
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                        toastWinCb(_jsonObj.Msg, function () {

                            //重新加载数据
                            searchCheckCouponsUseVerify();

                            //跳转到订单详情页
                            //window.location.href = "../ActivityPage/ActivityDetail?AID=" + pActivityID;

                        });

                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });

    }, 400);
}



//==================弹出窗口==================//

/**
 * 初始化详细窗口显示代码
 * */
function initDetailWinHtml() {
    //获取窗口显示代码
    mDetailWinHtml = $("#DetailWin").html();
    $("#DetailWin").empty();
}


/**
 * 打开详情窗口
 * @param {any} pCouponsID 优惠券ID
 */
function openDetailWin(pCouponsID) {

    //打开Dialog弹出窗口
    openCustomDialogWin("优惠券详情", mDetailWinHtml, 600);

    //初始化优惠券详情窗口信息
    initDetailWinMsg(pCouponsID);

}

/**
 * 初始化优惠券详情窗口信息
 * @param {any} pCouponsID 优惠券ID
 */
function initDetailWinMsg(pCouponsID) {

    //构造POST参数
    var dataPOST = {
        "Type": "4", "CouponsID": pCouponsID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Coupons/CouponsMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //构造显示代码
                var myJsVal = "";
                }
                }
                    myJsVal += "<span class=\"span-padding-left\">抵用金额：</span>" + _jsonReTxt.UseMoney + "元";
                }
                    myJsVal += "<span class=\"span-padding-left\">使用折扣：</span>" + _jsonReTxt.UseDiscount + "折";
                }
                }
                }
                }
                }
                    myJsVal += "<div>";
                }
                }
                }
                    }
                }
                    }
                }
                }
        }
    });


}

