using BusiApiHttpNS;
using BusiRndKeyUploadNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【支付】相关Api控制器
/// </summary>
namespace OctMallMiniWeb.PageControllers.ApiPage
{
    public class PayApiController : Controller
    {
        /// <summary>
        /// 支付首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }


            //获取操作类型  Type=1 正式的微信小程序支付 Type=2 微信模拟支付 Type=3 处理订单选择的不同方式支付 Type=4 买家充值正式的微信小程序支付 Type=5 买单直接支付-微信支付
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string WxOpenID = PublicClass.FilterRequestTrim("WxOpenID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

                string UserKeyID = WebAppConfig.UserKeyID;

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("UserKeyID", UserKeyID);
                _dicPost.Add("WxOpenID", WxOpenID);
                _dicPost.Add("BillNumber", BillNumber);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_TAC_GetWxMiniUnifiedOrderResult, "TAC_GetWxMiniUnifiedOrderResult", "1", _dicPost);

                ModelJsonBack _modelJsonBack = new ModelJsonBack();
                //  //得到微信小程序统一下单结果信息
                //"WPUOR_02" 统一下单信息不完整 "WPUOR_04" 支付订单信息错误  "WPUOR_06" 微信支付统一下单出错, "WPUOR_08" 订单预支付信息写入失败！"
                if (_jsonBack == "WPUOR_02")
                {
                    _modelJsonBack.ErrCode = _jsonBack;
                    _modelJsonBack.ErrMsg = "统一下单信息不完整";
                }
                else if (_jsonBack == "WPUOR_04")
                {
                    _modelJsonBack.ErrCode = _jsonBack;
                    _modelJsonBack.ErrMsg = "支付订单信息错误";
                }
                else if (_jsonBack == "WPUOR_06")
                {
                    _modelJsonBack.ErrCode = _jsonBack;
                    _modelJsonBack.ErrMsg = "微信支付统一下单出错";
                }
                else if (_jsonBack == "WPUOR_08")
                {
                    _modelJsonBack.ErrCode = _jsonBack;
                    _modelJsonBack.ErrMsg = "订单预支付信息写入失败";
                }
                if (string.IsNullOrWhiteSpace(_modelJsonBack.ErrMsg) == false)
                {
                    //输出错误信息
                    return ModelJsonBack.convertModelToJson(_modelJsonBack);
                }
                //输出支付信息
                return _jsonBack;


                //{
                //    "appId" : "wx2421b1c4370ec43b",     //公众号名称，由商户传入     
                //  "nonceStr" : "e61463f8efa94090b1f366cccfbbb444", //随机串     
                //   "package" : "prepay_id=u802345jgfjsdfgsdg888",     
                //  "signType" : "MD5",         //微信签名方式:    
                //  "paySign" : "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
                //}
            }
            else if (_exeType == "2") //微信模拟支付
            {
                //获取传递的参数
                string PayWay = PublicClass.FilterRequestTrim("PayWay"); //支付类型 [WeiXinPay / Alipay]
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

                string UserKeyID = WebAppConfig.UserKeyID;

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("UserKeyID", UserKeyID);
                _dicPost.Add("PayWay", PayWay);
                _dicPost.Add("BillNumber", BillNumber);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_TAC_SimulatePay, "TAC_SimulatePay", "1", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //处理订单选择的不同方式支付
            {
                string PayWay = PublicClass.FilterRequestTrim("PayWay");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("PayWay", PayWay);
                _dicPost.Add("BillNumber", BillNumber);
                _dicPost.Add("BuyerUserID", _loginUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayOrder, "T_PayOrder", "1", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "4") //买家充值正式的微信小程序支付
            {
                //获取传递过来的参数
                string WxOpenID = PublicClass.FilterRequestTrim("WxOpenID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");


                string UserKeyID = WebAppConfig.UserKeyID;

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("UserKeyID", UserKeyID);
                _dicPost.Add("WxOpenID", WxOpenID);
                _dicPost.Add("BillNumber", BillNumber);
                _dicPost.Add("PayType", "BuyerRecharge");

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_TAC_GetWxMiniUnifiedNoOrderResult, "TAC_GetWxMiniUnifiedNoOrderResult", "1", _dicPost);

                ModelJsonBack _modelJsonBack = new ModelJsonBack();
                //  //得到微信小程序统一下单结果信息
                //"WPUOR_02" 统一下单信息不完整 "WPUOR_04" 支付订单信息错误  "WPUOR_06" 微信支付统一下单出错, "WPUOR_08" 订单预支付信息写入失败！"
                if (_jsonBack == "WPUOR_02")
                {
                    _modelJsonBack.ErrCode = _jsonBack;
                    _modelJsonBack.ErrMsg = "统一下单信息不完整";
                }
                else if (_jsonBack == "WPUOR_04")
                {
                    _modelJsonBack.ErrCode = _jsonBack;
                    _modelJsonBack.ErrMsg = "支付订单信息错误";
                }
                else if (_jsonBack == "WPUOR_06")
                {
                    _modelJsonBack.ErrCode = _jsonBack;
                    _modelJsonBack.ErrMsg = "微信支付统一下单出错";
                }
                else if (_jsonBack == "WPUOR_08")
                {
                    _modelJsonBack.ErrCode = _jsonBack;
                    _modelJsonBack.ErrMsg = "订单预支付信息写入失败";
                }
                if (string.IsNullOrWhiteSpace(_modelJsonBack.ErrMsg) == false)
                {
                    //输出错误信息
                    return ModelJsonBack.convertModelToJson(_modelJsonBack);
                }
                //输出支付信息
                return _jsonBack;


                //{
                //    "appId" : "wx2421b1c4370ec43b",     //公众号名称，由商户传入     
                //  "nonceStr" : "e61463f8efa94090b1f366cccfbbb444", //随机串     
                //   "package" : "prepay_id=u802345jgfjsdfgsdg888",     
                //  "signType" : "MD5",         //微信签名方式:    
                //  "paySign" : "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
                //}
            }
            else if (_exeType == "5") //买单直接支付-微信支付
            {
                //获取传递过来的参数
                string WxOpenID = PublicClass.FilterRequestTrim("WxOpenID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");


                string UserKeyID = WebAppConfig.UserKeyID;

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("UserKeyID", UserKeyID);
                _dicPost.Add("WxOpenID", WxOpenID);
                _dicPost.Add("BillNumber", BillNumber);
                _dicPost.Add("PayType", "AggregateOrderPay");

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_TAC_GetWxMiniUnifiedNoOrderResult, "TAC_GetWxMiniUnifiedNoOrderResult", "1", _dicPost);

                ModelJsonBack _modelJsonBack = new ModelJsonBack();
                //  //得到微信小程序统一下单结果信息
                //"WPUOR_02" 统一下单信息不完整 "WPUOR_04" 支付订单信息错误  "WPUOR_06" 微信支付统一下单出错, "WPUOR_08" 订单预支付信息写入失败！"
                if (_jsonBack == "WPUOR_02")
                {
                    _modelJsonBack.ErrCode = _jsonBack;
                    _modelJsonBack.ErrMsg = "统一下单信息不完整";
                }
                else if (_jsonBack == "WPUOR_04")
                {
                    _modelJsonBack.ErrCode = _jsonBack;
                    _modelJsonBack.ErrMsg = "支付订单信息错误";
                }
                else if (_jsonBack == "WPUOR_06")
                {
                    _modelJsonBack.ErrCode = _jsonBack;
                    _modelJsonBack.ErrMsg = "微信支付统一下单出错";
                }
                else if (_jsonBack == "WPUOR_08")
                {
                    _modelJsonBack.ErrCode = _jsonBack;
                    _modelJsonBack.ErrMsg = "订单预支付信息写入失败";
                }
                if (string.IsNullOrWhiteSpace(_modelJsonBack.ErrMsg) == false)
                {
                    //输出错误信息
                    return ModelJsonBack.convertModelToJson(_modelJsonBack);
                }
                //输出支付信息
                return _jsonBack;


                //{
                //    "appId" : "wx2421b1c4370ec43b",     //公众号名称，由商户传入     
                //  "nonceStr" : "e61463f8efa94090b1f366cccfbbb444", //随机串     
                //   "package" : "prepay_id=u802345jgfjsdfgsdg888",     
                //  "signType" : "MD5",         //微信签名方式:    
                //  "paySign" : "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
                //}
            }

            return "";
        }


        /// <summary>
        /// 银行转账支付
        /// </summary>
        /// <returns></returns>
        public string BankTransfer()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型  Type=1 初始化转账付款支付信息 [订单信息,平台转账银行信息,买家之前的转账汇款信息,] Type=2 上传买家转账凭证照片 Type=3 提交买家转账凭证照片信息 Type=4 提交买家汇款信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BillNumber", BillNumber);

                //提交订单发票信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayTransBankMsg, "T_PayTransBankMsg", "5", _dicPost);
                return _jsonBack;


            }
            else if (_exeType == "2") //上传买家转账凭证照片
            {
                // 获取传递的参数
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", _loginUserID); //店铺ID
                _dic.Add("UploadGuid", UploadGuid);

                //调用上传函数
                string _backJson = BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_PayTransCertImg, "FU_PayTransCertImg", _dic);
                return _backJson;
            }
            else if (_exeType == "3") //提交买家转账凭证照片信息
            {
                // 获取传递的参数
                string ImgPath = PublicClass.FilterRequestTrimNoConvert("ImgPath");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", _loginUserID);
                _dic.Add("ImgPath", ImgPath);
                _dic.Add("BillNumber", BillNumber);
                _dic.Add("UploadGuid", UploadGuid);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayTransBankMsg, "T_PayTransBankMsg", "6", _dic);
                return _json;
            }
            else if (_exeType == "4") //提交买家汇款信息
            {
                // 获取传递的参数
                string BuyerBankName = PublicClass.FilterRequestTrimNoConvert("BuyerBankName");
                string BuyerBankAcc = PublicClass.FilterRequestTrimNoConvert("BuyerBankAcc");
                string BankName = PublicClass.FilterRequestTrimNoConvert("BankName");
                string TotalOrderPrice = PublicClass.FilterRequestTrimNoConvert("TotalOrderPrice");
                string UploadGuid = PublicClass.FilterRequestTrimNoConvert("UploadGuid");
                string BillNumber = PublicClass.FilterRequestTrimNoConvert("BillNumber");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", _loginUserID);
                _dic.Add("BuyerBankName", BuyerBankName);
                _dic.Add("BuyerBankAcc", BuyerBankAcc);
                _dic.Add("BankName", BankName);
                _dic.Add("TotalOrderPrice", TotalOrderPrice);
                _dic.Add("BillNumber", BillNumber);
                _dic.Add("UploadGuid", UploadGuid);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayTransBankMsg, "T_PayTransBankMsg", "7", _dic);
                return _json;
            }

            return "";
        }


        /// <summary>
        /// 支付成功的跳转页
        /// </summary>
        /// <returns></returns>
        public string PaySuRedirect()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }


            //获取操作类型  Type=1 得到 BillNumber下的所有订单信息-支付成功后
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BillNumber", BillNumber);
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("IsPaySuccess", "true");

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "19", _dicPost);
                return _jsonBack;
            }


            return "";
        }


        /// <summary>
        /// 订单支付 [从订单详情进入]
        /// </summary>
        /// <returns></returns>
        public string OrderPay()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型  Type=1 初始化订单支付信息 Type=2 保存更新订单的收货地址 Type=3 提交保存订单信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("BuyerUserID", _loginUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "5", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //保存更新订单的收货地址
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("BReceiAddrID", BReceiAddrID);
                _dicPost.Add("BuyerUserID", _loginUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderDelivery, "T_OrderDelivery", "3", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //提交保存支付订单信息
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string OrderMemo = PublicClass.FilterRequestTrim("OrderMemo");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("OrderMemo", OrderMemo);
                _dicPost.Add("BuyerUserID", _loginUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayOrder, "T_PayOrder", "2", _dicPost);
                return _jsonBack;

            }

            return "";

        }



    }
}