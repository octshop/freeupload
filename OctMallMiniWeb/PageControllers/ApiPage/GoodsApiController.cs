using HttpServiceNS;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【商品】相关Api控制器
/// </summary>
namespace OctMallMiniWeb.PageControllers.ApiPage
{
    public class GoodsApiController : Controller
    {
        /// <summary>
        /// 商品首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            return "";
        }


        /// <summary>
        /// 加载商品内容
        /// </summary>
        /// <returns></returns>
        public string GoodsDetail()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型  Type=1  加载商品图片轮播的内容 Type=2 加载商品信息 Type=3 加载商品的规格和属性值 Type=4 加载商品额外数据 如收货地址等 Type=5 得到 商品可以使用的优惠券列表 Type=6 买家领取优惠券 Type=7 初始化或统计商品的运费 Type=8 验证商品是否可以立即订购 Type=9 加入购物车 Type=10 加载店铺地址坐标相关信息 Type=11 得到买家分享商品返佣的URL
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "5");
                _dicPost.Add("GoodsID", GoodsID);

                //调用加载父级类目列表函数
                return HttpService.Post(WebAppConfig.ApiUrl_UGS_GooGoodsImg, _dicPost);
                //return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsImg, "UGS_GooGoodsImg", "5", _dicPost);
            }
            else if (_exeType == "2") //加载商品信息
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "7");
                _dicPost.Add("GoodsID", GoodsID);

                //调用加载父级类目列表函数
                return HttpService.Post(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, _dicPost);
            }
            else if (_exeType == "3") //加载商品的规格和属性值
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "2");
                _dicPost.Add("GoodsID", GoodsID);

                //调用加载父级类目列表函数
                return HttpService.Post(WebAppConfig.ApiUrl_UGS_GooSpecParam, _dicPost);
            }
            else if (_exeType == "4") //加载商品额外数据 如收货地址等
            {
                //获取买家登录BuyerUserID
                //string _loginUserID = _loginUserID;
                if (string.IsNullOrWhiteSpace(_loginUserID))
                {
                    return "";
                }

                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "9");
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("GoodsID", GoodsID);

                //调用加载父级类目列表函数
                return HttpService.Post(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, _dicPost);
            }
            else if (_exeType == "5") //得到 商品可以使用的优惠券列表
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "7");
                _dicPost.Add("ShopUserID", ShopUserID);
                _dicPost.Add("GoodsID", GoodsID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_T_CouponsMsg, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "6") //买家领取优惠券
            {
                //获取买家登录BuyerUserID
                //string _loginUserID = BusiLogin.getLoginUserID();
                if (string.IsNullOrWhiteSpace(_loginUserID))
                {
                    return "";
                }

                //获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("CouponsID", CouponsID);
                _dicPost.Add("BuyerUserID", _loginUserID);

                //买家领取优惠券
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "8", _dicPost);
            }
            else if (_exeType == "7") //初始化或统计商品的运费
            {
                //获取传递的参数
                string GoodsID = "0";
                string FtID = PublicClass.FilterRequestTrim("FtID");
                string OrderNum = "1";

                //获取当前收货地址的省份Code
                string RegionProCode = PublicClass.FilterRequestTrim("RegionProCode");
                if (string.IsNullOrWhiteSpace(RegionProCode))
                {
                    //通过获取收货地址Cookie来获取省份Code 选择收货地址Cookie =  BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县
                    string _buyerReceiAddrSelCookieArr = "";//BusiBuyer.getBuyerReceiAddrSelCookieArr(); //PublicClass.getCookieValue("BuyerReceiAddrSelCookieArr");  
                    if (string.IsNullOrWhiteSpace(_buyerReceiAddrSelCookieArr) == false)
                    {
                        RegionProCode = _buyerReceiAddrSelCookieArr.Split('^')[1].Split('_')[0];
                    }
                }
                if (string.IsNullOrWhiteSpace(RegionProCode))
                {
                    return "";
                }

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "10");
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("FtID", FtID);
                _dicPost.Add("RegionProCode", RegionProCode);
                _dicPost.Add("OrderNum", OrderNum);

                //调用加载父级类目列表函数
                return HttpService.Post(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, _dicPost);
            }
            else if (_exeType == "8") //验证商品是否可以立即订购
            {
                //获取传递的参数
                string GID = PublicClass.FilterRequestTrim("GID");
                string SelSpecPropIDVal = PublicClass.FilterRequestTrim("SelSpecPropIDVal");
                string OrderNumber = PublicClass.FilterRequestTrim("OrderNumber");
                //获取收货地址Cookie =  BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县
                string BuyerReceiAddrSelCookieArr = PublicClass.FilterRequestTrim("BuyerReceiAddrSelCookieArr");

                //防止数字类型为空
                GID = PublicClass.preventNumberDataIsNull(GID);
                SelSpecPropIDVal = PublicClass.preventNumberDataIsNull(SelSpecPropIDVal);
                OrderNumber = PublicClass.preventNumberDataIsNull(OrderNumber);

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "11");
                _dicPost.Add("GoodsID", GID);
                _dicPost.Add("SelSpecPropIDVal", SelSpecPropIDVal);
                _dicPost.Add("OrderNum", OrderNumber);

                //调用加载父级类目列表函数
                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, _dicPost);
                //解析Json
                JObject _jObj = (JObject)JsonConvert.DeserializeObject(_jsonBack);
                if (string.IsNullOrWhiteSpace(_jObj["Msg"].ToString()) == false)
                {
                    ////设置订购参数Cookie 【GoodsID ^ OrderNum ^ SpecID】
                    ////PublicClass.setCookieValue("OrderGoodsMsgCookieArr", GID + "^" + OrderNumber + "^" + SelSpecPropIDVal);
                    //BusiOrder.setOrderGoodsMsgCookieArrSingle(Convert.ToInt64(GID), Convert.ToInt32(OrderNumber), Convert.ToInt64(SelSpecPropIDVal));

                    //string[] _orderGoodsMsgCookieArrSingle = BusiOrder.getOrderGoodsMsgCookieArrSingle();

                    ////设置选择的收货地址Cookie
                    //if (string.IsNullOrWhiteSpace(BuyerReceiAddrSelCookieArr) == false)
                    //{
                    //    PublicClass.setCookieValue("BuyerReceiAddrSelCookieArr", BuyerReceiAddrSelCookieArr);
                    //}

                }

                return _jsonBack;
            }
            else if (_exeType == "9") //加入购物车
            {
                //获取买家登录BuyerUserID
                //string _loginUserID = BusiLogin.getLoginUserID();
                if (string.IsNullOrWhiteSpace(_loginUserID))
                {
                    return "92"; //请登录
                }

                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SpecIDOrPropID = PublicClass.FilterRequestTrim("SpecIDOrPropID");
                string OrderNum = PublicClass.FilterRequestTrim("OrderNum");

                //防止数字为空
                OrderNum = PublicClass.preventNumberDataIsNull(OrderNum);
                if (Convert.ToInt32(OrderNum) <= 0)
                {
                    OrderNum = "1";
                }

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("SpecIDOrPropID", SpecIDOrPropID);
                _dicPost.Add("OrderNum", OrderNum);

                //买家领取优惠券
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_SCart, "UGS_SCart", "1", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "10") //加载店铺地址坐标电话相关信息
            {
                //获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "13");
                _dicPost.Add("ShopID", ShopID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopMsg, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "11") //得到买家分享商品返佣的URL
            {
                //获取传递过来的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "24");
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("BuyerUserID", BuyerUserID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 商品描述
        /// </summary>
        /// <returns></returns>
        public string GoodsDetailMsg()
        {
            //获取操作类型  Type=1 加载商品描述规格参数包装售后
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "8");
                _dicPost.Add("GoodsID", GoodsID);


                return HttpService.Post(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, _dicPost);
            }
            return "";
        }

        /// <summary>
        /// 商品评价
        /// </summary>
        /// <returns></returns>
        public string GoodsAppraise()
        {
            //获取操作类型  Type=1 订单商品评价数据分页 Type=2 统计商品的各种评价信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                //当前页
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                // 0 全部，1 好评，2中评，3差评,4有图
                string SearchTxt = PublicClass.FilterRequestTrim("SearchTxt");

                string AppScore = "0";
                string CountAppraiseImg = "0";
                if (SearchTxt == "0")
                {
                    AppScore = "0";
                }
                else if (SearchTxt == "1")
                {
                    AppScore = "4";
                }
                else if (SearchTxt == "2")
                {
                    AppScore = "3";
                }
                else if (SearchTxt == "3")
                {
                    AppScore = "2";
                }
                else if (SearchTxt == "4")
                {
                    CountAppraiseImg = "1";
                }


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "5");
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("GoodsID", GoodsID);
                //评分
                _dicPost.Add("AppScore", AppScore);
                //有图
                _dicPost.Add("CountAppraiseImg", CountAppraiseImg);

                _dicPost.Add("IsLock", "false");

                //发送Http请求
                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_GooAppraise, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //统计商品的各种评价信息
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "6");
                _dicPost.Add("GoodsID", GoodsID);

                //发送Http请求
                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_GooAppraise, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        #region【赠品相关】

        /// <summary>
        /// 赠品详情
        /// </summary>
        /// <returns></returns>
        public string GiftDetail()
        {
            //获取操作类型  Type=1 初始化赠品信息 Type=2 初始化赠品描述内容
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string GIID = PublicClass.FilterRequestTrim("GIID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "8");
                _dicPost.Add("GiftID", GIID);

                //调用加载父级类目列表函数
                return HttpService.Post(WebAppConfig.ApiUrl_UGS_GooGiftMsg, _dicPost);
            }
            else if (_exeType == "2") //初始化赠品描述内容
            {
                //获取传递的参数
                string GIID = PublicClass.FilterRequestTrim("GIID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "10");
                _dicPost.Add("GiftID", GIID);

                //调用加载父级类目列表函数
                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_GooGiftMsg, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        #endregion





    }
}