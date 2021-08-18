using HttpServiceNS;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

/// <summary>
/// 【买家】相关Ajax控制器
/// </summary>
namespace OctWapWeb.PageControllers.AjaxPage
{
    public class BuyerAjaxController : Controller
    {
        /// <summary>
        /// 买家中心首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //获取操作类型  Type=1  平台猜你喜欢商品数据搜索分页-手机端 Type=2 统计买家当前积分总额  Type=3 加载买家用户的 账号，买家信息，余额积分信息 Type=4 更新用户的坐标位置信息 Type=5 将用户当前定位到的坐标保存到Cookie中，无需注册  Type=6 更新微信用户信息 - 公众号
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "5")
            {
                //获取传递的参数
                string Longitude = PublicClass.FilterRequestTrim("Longitude");
                string Latitude = PublicClass.FilterRequestTrim("Latitude");

                //保存cookie
                if (string.IsNullOrWhiteSpace(Longitude) == false && string.IsNullOrWhiteSpace(Latitude) == false)
                {
                    //保存经度（Longitude） 纬度(Latitude) cookie值
                    PublicClass.setCookieValue("LngLatCookie", Longitude + "^" + Latitude, 1000);

                    return "51"; //保存成功
                }
                return "52";//保存失败
            }

            //------------判断买家登录是否正确，并获取登录的UserID----------------//
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }


            if (_exeType == "1")
            {
                // 获取传递的参数

                //获取登录的买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "1");
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("BuyerUserID", BuyerUserID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_MallGuessYouLike, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //统计买家当前积分总额
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                //_dicPost.Add("Type", "1");
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //保存买家收货地址
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerIntegral, "T_BuyerIntegral", "2", _dicPost);
                return _backJson;
            }
            else if (_exeType == "3") //加载买家用户的 账号，买家信息，余额积分信息
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                //_dicPost.Add("Type", "1");
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //保存买家收货地址
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserAccount, "UGS_UserAccount", "5", _dicPost);
                return _backJson;
            }
            else if (_exeType == "4") //更新用户的坐标位置信息
            {
                //获取传递的参数
                string Longitude = PublicClass.FilterRequestTrim("Longitude");
                string Latitude = PublicClass.FilterRequestTrim("Latitude");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                //_dicPost.Add("Type", "1");
                _dicPost.Add("UserID", _loginBuyerUserID);
                _dicPost.Add("Longitude", Longitude);
                _dicPost.Add("Latitude", Latitude);

                //保存买家收货地址
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserAccountMsg, "UGS_UserAccountMsg", "1", _dicPost);
                return _backJson;
            }
            else if (_exeType == "6") //更新微信用户信息 - 公众号
            {
                //获取传递参数
                string UserID = _loginBuyerUserID;
                string WxOpenID = PublicClass.FilterRequestTrimNoConvert("WxOpenID");
                string NickName = PublicClass.FilterRequestTrim("NickName");
                string HeadImgUrl = PublicClass.FilterRequestTrimNoConvert("HeadImgUrl");
                string Sex = PublicClass.FilterRequestTrim("Sex");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                //_dicPost.Add("Type", "1");
                _dicPost.Add("UserID", UserID);
                _dicPost.Add("WxOpenID", WxOpenID);
                _dicPost.Add("NickName", NickName);
                _dicPost.Add("HeadImgUrl", HeadImgUrl);
                _dicPost.Add("Sex", Sex);

                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_RegUserAccount, "UGS_RegUserAccount", "9", _dicPost);
                return _backJson;
            }

            return "";
        }

        #region 【订单相关】

        /// <summary>
        /// 我的订单
        /// </summary>
        /// <returns></returns>
        public string MyOrder()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1  全部订单数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string OrderStatus = PublicClass.FilterRequestTrim("OrderStatus");
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");
                //搜索关键字
                string SearchKey = PublicClass.FilterRequestTrim("SearchKey");

                //配送方式（送货上门 express  到店消费自取 shop） 
                string ExpressType = PublicClass.FilterRequestTrim("ExpressType");
                //支付方式 （WeiXinPay [微信支付], Alipay[支付宝] , Transfer[银行转账] , Offline[线下付款(到店付)], PayDelivery [货到付款]  Balance[余额支付]）
                string PayWay = PublicClass.FilterRequestTrim("PayWay");

                string IsLoadFieldName = PublicClass.FilterRequestTrim("IsLoadFieldName");

                //是否只加载拼团订单
                string GroupID = PublicClass.FilterRequestTrim("GroupID");


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("OrderStatus", OrderStatus);
                _dicPost.Add("ExpressType", ExpressType);
                _dicPost.Add("PayWay", PayWay);
                _dicPost.Add("IsLoadFieldName", IsLoadFieldName);
                _dicPost.Add("GroupID", GroupID);


                //构造搜索字段
                if (string.IsNullOrWhiteSpace(SearchKey) == false)
                {
                    //判断是否为数字
                    if (PublicClass.IsNumber(SearchKey))
                    {
                        _dicPost.Add("OrderID", SearchKey);
                    }
                    else
                    {
                        _dicPost.Add("GoodsTitleArr", SearchKey);
                    }
                }


                //保存买家收货地址
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "3", _dicPost);
                return _backJson;
            }

            return "";
        }

        #endregion

        #region【礼品订单】

        /// <summary>
        /// 我的礼品订单列表
        /// </summary>
        /// <returns></returns>
        public string MyPresentOrder()
        {
            

            return "";
        }

        #endregion

        #region 【收货地址】

        /// <summary>
        /// 添加收货地址
        /// </summary>
        /// <returns></returns>
        public string ReceiAddrAdd()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1  添加买家收货地址
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string ReceiName = PublicClass.FilterRequestTrim("ReceiName");
                string Mobile = PublicClass.FilterRequestTrim("Mobile");
                string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                string AddrType = PublicClass.FilterRequestTrim("AddrType");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");

                string BackUrl = PublicClass.FilterRequestTrim("BackUrl");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("ReceiName", ReceiName);
                _dicPost.Add("Mobile", Mobile);
                _dicPost.Add("DetailAddr", DetailAddr);
                _dicPost.Add("AddrType", AddrType);
                _dicPost.Add("RegionCodeArr", RegionCodeArr);

                //保存买家收货地址
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_BuyerReceiAddr, "UGS_BuyerReceiAddr", "2", _dicPost);

                if (_backJson.IndexOf("添加成功") >= 0 && string.IsNullOrWhiteSpace(BackUrl) == false)
                {
                    //写入选择地址Cookie
                    //转化Json字符串
                    JObject _jObj = (JObject)JsonConvert.DeserializeObject(_backJson);
                    JObject _jObj2 = (JObject)JsonConvert.DeserializeObject(_jObj["DataDic"].ToString().Trim());
                    //设置Cooke
                    BusiBuyer.setBuyerReceiAddrSelCookieArr(Convert.ToInt64(_jObj2["BReceiAddrID"]), _jObj2["RegionCodeArr"].ToString(), _jObj2["RegionNameArr"].ToString());
                }

                return _backJson;
            }
            return "";
        }

        /// <summary>
        /// 编辑收货地址
        /// </summary>
        /// <returns></returns>
        public string ReceiAddrEdit()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1  编辑买家收货地址 Type=2 初始化买家收货地址
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");
                string ReceiName = PublicClass.FilterRequestTrim("ReceiName");
                string Mobile = PublicClass.FilterRequestTrim("Mobile");
                string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                string AddrType = PublicClass.FilterRequestTrim("AddrType");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("BReceiAddrID", BReceiAddrID);
                _dicPost.Add("ReceiName", ReceiName);
                _dicPost.Add("Mobile", Mobile);
                _dicPost.Add("DetailAddr", DetailAddr);
                _dicPost.Add("AddrType", AddrType);
                _dicPost.Add("RegionCodeArr", RegionCodeArr);

                //保存买家收货地址
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_BuyerReceiAddr, "UGS_BuyerReceiAddr", "3", _dicPost);
            }
            else if (_exeType == "2") //初始化买家收货地址
            {
                //获取传递的参数
                string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("BReceiAddrID", BReceiAddrID);

                //初始化买家收货地址
                string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_BuyerReceiAddr, "UGS_BuyerReceiAddr", "5", _dicPost);
                return _backMsg;
            }
            return "";
        }

        /// <summary>
        /// 收货地址列表
        /// </summary>
        /// <returns></returns>
        public string ReceiAddrList()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1  数据分页 Type=2 设为默认收货地址 Type=3 删除收货地址 Type=4 单击选择当前收货地址
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");
                //查询条件值 用^隔开
                string SearchTxtArr = PublicClass.FilterRequestTrim("SearchTxtArr");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("IsLock", "false");

                //分割查询条件值  再发送查询条件

                //保存买家收货地址
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_BuyerReceiAddr, "UGS_BuyerReceiAddr", "1", _dicPost);
            }
            else if (_exeType == "2") //设为默认收货地址
            {
                //获取传递过来的参数
                string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("BReceiAddrID", BReceiAddrID);

                //保存买家收货地址
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_BuyerReceiAddr, "UGS_BuyerReceiAddr", "6", _dicPost);
            }
            else if (_exeType == "3") //删除收货地址
            {
                //获取传递过来的参数
                string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("BReceiAddrID", BReceiAddrID);

                //保存买家收货地址
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_BuyerReceiAddr, "UGS_BuyerReceiAddr", "4", _dicPost);
            }
            else if (_exeType == "4") //单击选择当前收货地址
            {
                //获取传递过来的参数
                string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                string RegionNameArr = PublicClass.FilterRequestTrim("RegionNameArr");
                //设置当前买家选择的收货地址Cookie值【 BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县 】
                BusiBuyer.setBuyerReceiAddrSelCookieArr(Convert.ToInt64(BReceiAddrID), RegionCodeArr, RegionNameArr);

                return "41";
            }

            return "";
        }

        #endregion

        #region 【评价相关】

        /// <summary>
        /// 评价中心
        /// </summary>
        /// <returns></returns>
        public string AppraiseCenter()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1  统计买家的评价信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooAppraise, "UGS_GooAppraise", "8", _dicPost);
                return _backJson;
            }

            return "";
        }

        /// <summary>
        /// 评价晒单表单
        /// </summary>
        /// <returns></returns>
        public string AppraiseForm()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 加载订单的商品信息(评价等显示) Type=2 提交订单商品评价 Type=3 初始化商品评价晒单的返积分信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("OrderID", OrderID);

                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "17", _dicPost);
                return _backJson;
            }
            else if (_exeType == "2") //提交订单商品评价
            {
                /*
                 {
	                "OrderID": "340845",
	                "BuyerUserID": "10006",
	                "ShopUserID": "10004",
	                "AppraiseGoodsArr": [{
		                "GoodsID": "40057",
		                "AppraiseScore": "2",
		                "IsAnonymity": "true",
		                "AppraiseContent": "1111",
		                "AppraiseImgs": [{
			                "UploadGuid": "cf6df941-76e9-468c-b7f1-975262cccb6d",
			                "ImgUrl": "localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005101036443030.jpg"
		                }, {
			                "UploadGuid": "cf6df941-76e9-468c-b7f1-975262cccb6d",
			                "ImgUrl": "localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005101036480640.jpg"
		                }]
	                }, {
		                "GoodsID": "50058",
		                "AppraiseScore": "3",
		                "IsAnonymity": "false",
		                "AppraiseContent": "2222",
		                "AppraiseImgs": [{
			                "UploadGuid": "424207b8-d1d1-0869-80c6-11afd3bda2f7",
			                "ImgUrl": "localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005101037012800.jpg"
		                }]
	                }, {
		                "GoodsID": "30056",
		                "AppraiseScore": "5",
		                "IsAnonymity": "",
		                "AppraiseContent": "3333",
		                "AppraiseImgs": [{
			                "UploadGuid": "1057727b-2cf2-1a31-bad2-b1f1f062b951",
			                "ImgUrl": "localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005101037102350.jpg"
		                }]
	                }],
	                "ShopAppraise": {
		                "ConformityScore": "1",
		                "AttitudeScore": "2",
		                "ExpressScore": "3",
		                "DeliverymanScore": "4"
	                }
                }
                 */
                //获取传递的参数
                string AppraiseJson = PublicClass.FilterRequestTrimNoConvert("AppraiseJson");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("AppraiseJson", AppraiseJson);

                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooAppraise, "UGS_GooAppraise", "2", _dicPost);
                return _backJson;
            }
            else if (_exeType == "3") //初始化商品评价晒单的返积分信息
            {
                // 获取传递的参数
                string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsIDArr", GoodsIDArr);

                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopIntegralSetting, "UGS_ShopIntegralSetting", "6", _dicPost);
                return _backJson;

            }

            return "";
        }

        /// <summary>
        /// 评价详情
        /// </summary>
        /// <returns></returns>
        public string AppraiseDetail()
        {

            //获取操作类型  Type=1  评价详情 Type=2 初始化商品评价,指定记录条数
            string _exeType = PublicClass.FilterRequestTrim("Type");

            //------------不需要登录-----------//
            if (_exeType == "2")
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "4");
                _dicPost.Add("GoodsID", GoodsID);

                //发送Http请求
                string _jsonBack = HttpServiceNS.HttpService.Post(WebAppConfig.ApiUrl_UGS_GooAppraise, _dicPost);
                return _jsonBack;
            }
            else
            {
                //------------需要登录-----------//
                //判断买家登录是否正确，并获取登录的UserID
                string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
                if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
                {
                    return "";
                }

                if (_exeType == "1")
                {
                    //获取传递的参数
                    string OrderID = PublicClass.FilterRequestTrim("OrderID");

                    //POST参数
                    Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                    _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                    _dicPost.Add("OrderID", OrderID);

                    //发送Http请求
                    string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooAppraise, "UGS_GooAppraise", "3", _dicPost);
                    return _backJson;
                }
            }

            return "";
        }

        #endregion

        #region 【我的投诉】

        /// <summary>
        /// 我的投诉 
        /// </summary>
        /// <returns></returns>
        public string ComplainMy()
        {
           
            return "";
        }

        /// <summary>
        /// 提交投诉 
        /// </summary>
        /// <returns></returns>
        public string ComplainSubmit()
        {
           

            return "";
        }

        /// <summary>
        /// 投诉详情
        /// </summary>
        /// <returns></returns>
        public string ComplainDetail()
        {
           

            return "";
        }

        #endregion

        #region 【活动参与】

        public string ActivityList()
        {
           


            return "";
        }

        #endregion

        #region【抽奖信息】

        /// <summary>
        /// 抽奖信息
        /// </summary>
        /// <returns></returns>
        public string LuckyDrawMsg()
        {
           

            return "";
        }

        /// <summary>
        /// 中奖详情
        /// </summary>
        /// <returns></returns>
        public string LuckyDrawDetail()
        {
           


            return "";
        }




        #endregion

        #region 【优惠券】

        /// <summary>
        /// 我的优惠券
        /// </summary>
        /// <returns></returns>
        public string CouponsMy()
        {

            //获取操作类型  Type=1  数据搜索分页-视图-Wap端 Type=2 初始化优惠券横条的Bar信息 Type=3 买家单个获取优惠券 Type=4 初始化优惠券线下使用验证码 Type=5 得到优惠券可以使用的产品列表 Type=6 加载优惠券可以使用的店铺列表 Type=7 统计买家各种优惠券信息总数
            string _exeType = PublicClass.FilterRequestTrim("Type");

            //初始化优惠券横条的Bar信息
            if (_exeType == "2")
            {
                //获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string IssueID = PublicClass.FilterRequestTrim("IssueID");

                string _loginBuyerUserID2 = "";
                if (string.IsNullOrWhiteSpace(IssueID) == false)
                {
                    //判断买家登录是否正确，并获取登录的UserID
                    _loginBuyerUserID2 = BusiLogin.isLoginRetrunUserID();
                    if (string.IsNullOrWhiteSpace(_loginBuyerUserID2))
                    {
                        return "";
                    }
                }

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID2);
                _dicPost.Add("CouponsID", CouponsID);
                _dicPost.Add("IssueID", IssueID);
                _dicPost.Add("Type", "12");


                //发送Http请求
                return HttpService.Post(WebAppConfig.ApiUrl_T_CouponsMsg, _dicPost);
                //string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "12", _dicPost);
                //return _backJson;

            }
            else if (_exeType == "5") //得到优惠券可以使用的产品列表
            {
                //获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("CouponsID", CouponsID);
                _dicPost.Add("Type", "10");


                //发送Http请求
                return HttpService.Post(WebAppConfig.ApiUrl_T_CouponsMsg, _dicPost);

                //string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "10", _dicPost);
                //return _backJson;
            }
            else if (_exeType == "6") //加载优惠券可以使用的店铺列表
            {
                //获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("CouponsID", CouponsID);
                _dicPost.Add("Type", "11");

                //发送Http请求
                return HttpService.Post(WebAppConfig.ApiUrl_T_CouponsMsg, _dicPost);
                //string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "11", _dicPost);
                //return _backJson;
            }

            //---------判断买家登录是否正确，并获取登录的UserID-----------//
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //数据搜索分页-视图-Wap端
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SearchKey = PublicClass.FilterRequestTrim("SearchKey");
                //string IsOverTime = PublicClass.FilterRequestTrim("IsOverTime");
                //string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //是否使用 ( false / true )
                string IsUsed = SearchKey;

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("IsUsed", IsUsed);


                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsIssueMsg, "T_CouponsIssueMsg", "9", _dicPost);
                return _backJson;
            }
            else if (_exeType == "3") //买家单个获取优惠券
            {
                // 获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("CouponsID", CouponsID);


                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "8", _dicPost);
                return _backJson;
            }
            else if (_exeType == "4") //初始化优惠券线下使用验证码
            {
                // 获取传递的参数
                string IssueID = PublicClass.FilterRequestTrim("IssueID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsReSet = PublicClass.FilterRequestTrim("IsReSet");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("IssueID", IssueID);
                _dicPost.Add("ShopUserID", ShopUserID);
                _dicPost.Add("IsReSet", IsReSet);


                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsVerifyCode, "T_CouponsVerifyCode", "1", _dicPost);
                return _backJson;
            }
            else if (_exeType == "7") //统计买家各种优惠券信息总数
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);


                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsIssueMsg, "T_CouponsIssueMsg", "10", _dicPost);
                return _backJson;
            }


            return "";
        }

        #endregion

        #region【关注收藏信息 (收藏商品或店铺)】

        /// <summary>
        /// 关注收藏信息 (收藏商品或店铺)
        /// </summary>
        /// <returns></returns>
        public string BuyerFocusFav()
        {
            //---------判断买家登录是否正确，并获取登录的UserID-----------//
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 添加关注收藏信息 (收藏商品或店铺) Type=2 搜索分页数据-wap Type=3 统计买家所有的收藏信息 商品，店铺
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //获取传递的参数
                //收藏关注类型( shop / goods)
                string FocusFavType = PublicClass.FilterRequestTrim("FocusFavType");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("FocusFavType", FocusFavType);
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("ShopID", ShopID);


                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_BuyerFocusFav, "UGS_BuyerFocusFav", "2", _dicPost);
                return _backJson;
            }
            else if (_exeType == "2") //搜索分页数据-wap
            {
                // 获取传递的参数
                string SearchKey = PublicClass.FilterRequestTrim("SearchKey");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //收藏关注类型( shop / goods)
                string FocusFavType = SearchKey;

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("FocusFavType", FocusFavType);
                _dicPost.Add("PageType", "wap");


                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_BuyerFocusFav, "UGS_BuyerFocusFav", "1", _dicPost);
                return _backJson;
            }
            else if (_exeType == "3") //统计买家所有的收藏信息 商品，店铺
            {

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_BuyerFocusFav, "UGS_BuyerFocusFav", "4", _dicPost);
                return _backJson;
            }

            return "";
        }

        #endregion

        #region【浏览足迹】

        /// <summary>
        /// 浏览足迹
        /// </summary>
        /// <returns></returns>
        public string BuyerBrowseHistory()
        {
            //---------判断买家登录是否正确，并获取登录的UserID-----------//
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加浏览足迹
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1") // 搜索分页数据
            {
                // 获取传递的参数
                string SearchKey = PublicClass.FilterRequestTrim("SearchKey");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("PageType", "wap");

                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_BuyerBrowseHistory, "UGS_BuyerBrowseHistory", "1", _dicPost);
                return _backJson;

            }
            else if (_exeType == "2") //添加浏览足迹
            {
                //获取传递参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("GoodsID", GoodsID);

                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_BuyerBrowseHistory, "UGS_BuyerBrowseHistory", "2", _dicPost);
                return _backJson;

            }

            return "";
        }

        #endregion

        #region【我的推广会员】

        /// <summary>
        /// 我推广的人
        /// </summary>
        /// <returns></returns>
        public string MyPromoteUser()
        {
           

            return "";
        }

        #endregion

        /// <summary>
        /// 买家消息列表
        /// </summary>
        /// <returns></returns>
        public string BuyerMsg()
        {
            //---------判断买家登录是否正确，并获取登录的UserID-----------//
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 加载买家端所有的系统消息阅读集合
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                // 获取传递的参数
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("SysMsgType", SysMsgType);
                _dicPost.Add("LoadNum", "5");

                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ReadAllSysMsg, "ASAC_ReadAllSysMsg", "1", _dicPost);
                return _backJson;
            }

            return "";
        }

        /// <summary>
        /// 买家设置
        /// </summary>
        /// <returns></returns>
        public string Setting()
        {
            //---------判断买家登录是否正确，并获取登录的UserID-----------//
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 判断买家账号是否可以冻结 Type=2 冻结账号，账户 Type=3 清除所有缓存
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("UserID", _loginBuyerUserID);

                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_RegUserAccount, "UGS_RegUserAccount", "5", _dicPost);
                return _backJson;
            }
            else if (_exeType == "2") //冻结账号，账户
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("UserID", _loginBuyerUserID);

                //发送Http请求
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_RegUserAccount, "UGS_RegUserAccount", "6", _dicPost);
                return _backJson;
            }
            else if (_exeType == "3") //清除所有缓存
            {
                //BuyerReceiAddrSelCookieArr,AsSelApplyCookie,AsSelApplyCookieCopy,OrderGoodsCookie,OrderGoodsCookieArr,SelCityRegionArrCookie,ScartIDOrderNumArrCookie,BackUrlLoginCookie,
                PublicClass.clearCookieValue("BuyerReceiAddrSelCookieArr");
                PublicClass.clearCookieValue("AsSelApplyCookie");
                PublicClass.clearCookieValue("AsSelApplyCookieCopy");
                PublicClass.clearCookieValue("OrderGoodsCookie");
                PublicClass.clearCookieValue("OrderGoodsCookieArr");
                PublicClass.clearCookieValue("SelCityRegionArrCookie");
                PublicClass.clearCookieValue("ScartIDOrderNumArrCookie");
                PublicClass.clearCookieValue("BackUrlLoginCookie");
                PublicClass.clearCookieValue("LngLatCookie");

                //清除登录
                BusiLogin.clearLoginCookie();

                return "31"; //清除所有缓存成功
            }

            return "";
        }

        /// <summary>
        /// 官方客服
        /// </summary>
        /// <returns></returns>
        public string OfficialService()
        {
            //---------判断买家登录是否正确，并获取登录的UserID-----------//
            //string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            //if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            //{
            //    return "";
            //}

            //获取操作类型  Type=1 加载指定类型和标题的说明性文本内容 Type=2 初始化说明性文本内容
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                // 获取传递的参数
                string ExplainType = PublicClass.FilterRequestTrim("ExplainType");
                string ExplainTitle = PublicClass.FilterRequestTrim("ExplainTitle");

                //----------选 填---------------//
                //是包含还是清除模式 (true / false )
                string Exclude = PublicClass.FilterRequestTrim("Exclude");
                //包含与清仓字段，用 “^”连接
                string ClearOrShowPropertyNameArr = PublicClass.FilterRequestTrim("ClearOrShowPropertyNameArr");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "7");
                _dicPost.Add("ExplainType", ExplainType);
                _dicPost.Add("ExplainTitle", ExplainTitle);
                _dicPost.Add("Exclude", Exclude);
                _dicPost.Add("ClearOrShowPropertyNameArr", ClearOrShowPropertyNameArr);


                return HttpService.Post(WebAppConfig.ApiUrl_ASAC_ExplainText, _dicPost);

                ////发送Http请求
                //string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ExplainText, "ASAC_ExplainText", "7", _dicPost);
                //return _backJson;
            }
            else if (_exeType == "2") //初始化说明性文本内容
            {
                // 获取传递的参数
                string ExplainID = PublicClass.FilterRequestTrim("ExplainID");

                string ExplainType = PublicClass.FilterRequestTrim("ExplainType");
                string ExplainTitle = PublicClass.FilterRequestTrim("ExplainTitle");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "8");
                _dicPost.Add("ExplainID", ExplainID);
                _dicPost.Add("IsLock", "false");
                _dicPost.Add("ExplainType", ExplainType);
                _dicPost.Add("ExplainTitle", ExplainTitle);

                return HttpService.Post(WebAppConfig.ApiUrl_ASAC_ExplainText, _dicPost);
            }

            return "";
        }



    }
}