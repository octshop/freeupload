using BusiApiKeyVerifyNS;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【买家】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class BuyerController : Controller
    {
        // GET: Buyer
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 买家购物车信息
        /// </summary>
        /// <returns></returns>
        public string BuyerShoppingCart()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string _CartID = PublicClass.FilterRequestTrim("CartID");
                string _GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string _SpecID = PublicClass.FilterRequestTrim("SpecID");
                string _GoodsPrice = PublicClass.FilterRequestTrim("GoodsPrice");
                string _OrderNum = PublicClass.FilterRequestTrim("OrderNum");
                string _BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string _ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string _WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                string _GoodsTitle = PublicClass.FilterRequestTrim("GoodsTitle");
                string _ShopID = PublicClass.FilterRequestTrim("ShopID");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                _CartID = PublicClass.preventNumberDataIsNull(_CartID);
                _GoodsID = PublicClass.preventNumberDataIsNull(_GoodsID);
                _SpecID = PublicClass.preventNumberDataIsNull(_SpecID);
                _GoodsPrice = PublicClass.preventDecimalDataIsNull(_GoodsPrice);
                _OrderNum = PublicClass.preventDecimalDataIsNull(_OrderNum);
                _BuyerUserID = PublicClass.preventDecimalDataIsNull(_BuyerUserID);
                _ShopUserID = PublicClass.preventDecimalDataIsNull(_ShopUserID);
                _ShopID = PublicClass.preventDecimalDataIsNull(_ShopID);

                //------------用实体类去限制的查询条件 AND 连接 视图------------//
                ModelV_Buyer_ShoppingCart_GoodsMsg _modelV_Buyer_ShoppingCart_GoodsMsg = ModelV_Buyer_ShoppingCart_GoodsMsg.initModelV_Buyer_ShoppingCart_GoodsMsg();

                _modelV_Buyer_ShoppingCart_GoodsMsg.ModelBuyerShoppingCart.CartID = Convert.ToInt64(_CartID);
                _modelV_Buyer_ShoppingCart_GoodsMsg.ModelBuyerShoppingCart.GoodsID = Convert.ToInt64(_GoodsID);
                _modelV_Buyer_ShoppingCart_GoodsMsg.ModelBuyerShoppingCart.SpecID = _SpecID;
                _modelV_Buyer_ShoppingCart_GoodsMsg.ModelBuyerShoppingCart.GoodsPrice = Convert.ToDecimal(_GoodsPrice);
                _modelV_Buyer_ShoppingCart_GoodsMsg.ModelBuyerShoppingCart.OrderNum = Convert.ToInt32(_OrderNum);
                _modelV_Buyer_ShoppingCart_GoodsMsg.ModelBuyerShoppingCart.BuyerUserID = Convert.ToInt32(_BuyerUserID);
                _modelV_Buyer_ShoppingCart_GoodsMsg.ModelBuyerShoppingCart.ShopUserID = Convert.ToInt32(_ShopUserID);
                _modelV_Buyer_ShoppingCart_GoodsMsg.ModelBuyerShoppingCart.WriteDate = _WriteDate;
                _modelV_Buyer_ShoppingCart_GoodsMsg.ModelGooGoodsMsg.GoodsTitle = _GoodsTitle;
                _modelV_Buyer_ShoppingCart_GoodsMsg.ModelGooGoodsMsg.ShopID = Convert.ToInt64(_ShopID);

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "CartID", "GoodsID", "SpecID", "GoodsPrice", "OrderNum", "BuyerUserID", "ShopUserID", "WriteDate", "GoodsTitle", "ShopID" };
                string _strJson = BusiJsonPageStr.morePageJSONV_Buyer_ShoppingCart_GoodsMsg(_modelV_Buyer_ShoppingCart_GoodsMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, false, "cms");

                //输出前台显示代码
                return _strJson;
            }

            return "";
        }

        /// <summary>
        /// 买家收货地址
        /// </summary>
        /// <returns></returns>
        public string BuyerReceiAddr()
        {
            //获取操作类型  Type=1 搜索分页数据 Type=2 添加收货地址 Type=3 编辑收货地址 Type=4 删除收货地址 Type=5 初始化买家收货地址 Type=6 设为默认收货地址 Type=7 加载默认收货地址 Type=8 预加载买家收货地址
            string _exeType = PublicClass.FilterRequestTrim("Type");

            //不需要验证签名与用户登录
            if (_exeType == "1111")
            {

            }
            else //需要验证签名与用户登录
            {
                //验证RndKeyRsa是否正确
                bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
                if (_verifySu == false)
                {
                    return "";
                }

                if (_exeType == "1")
                {
                    // 获取传递的参数
                    string _BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");
                    string _BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                    string _AddrType = PublicClass.FilterRequestTrim("AddrType");
                    string _ReceiName = PublicClass.FilterRequestTrim("ReceiName");
                    string _Mobile = PublicClass.FilterRequestTrim("Mobile");
                    string _RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                    string _RegionNameArr = PublicClass.FilterRequestTrim("RegionNameArr");
                    string _DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                    string _FixTel = PublicClass.FilterRequestTrim("FixTel");
                    string _Email = PublicClass.FilterRequestTrimNoConvert("Email");
                    string _ZipCode = PublicClass.FilterRequestTrimNoConvert("ZipCode");
                    string _IsLock = PublicClass.FilterRequestTrimNoConvert("IsLock");
                    string _IsDel = PublicClass.FilterRequestTrimNoConvert("IsDel");
                    string _WriteDate = PublicClass.FilterRequestTrimNoConvert("WriteDate");

                    //获取当前页数
                    string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                    //防止数字类型为空
                    _BReceiAddrID = PublicClass.preventNumberDataIsNull(_BReceiAddrID);
                    _BuyerUserID = PublicClass.preventNumberDataIsNull(_BuyerUserID);

                    //------------用实体类去限制的查询条件 AND 连接------------//
                    ModelBuyerReceiAddr _modelBuyerReceiAddr = new ModelBuyerReceiAddr();
                    _modelBuyerReceiAddr.BReceiAddrID = Convert.ToInt64(_BReceiAddrID);
                    _modelBuyerReceiAddr.BuyerUserID = Convert.ToInt64(_BuyerUserID);
                    _modelBuyerReceiAddr.AddrType = _AddrType;
                    _modelBuyerReceiAddr.ReceiName = _ReceiName;
                    _modelBuyerReceiAddr.Mobile = _Mobile;
                    _modelBuyerReceiAddr.RegionCodeArr = _RegionCodeArr;
                    _modelBuyerReceiAddr.RegionNameArr = _RegionNameArr;
                    _modelBuyerReceiAddr.DetailAddr = _DetailAddr;
                    _modelBuyerReceiAddr.FixTel = _FixTel;
                    _modelBuyerReceiAddr.Email = _Email;
                    _modelBuyerReceiAddr.ZipCode = _ZipCode;
                    _modelBuyerReceiAddr.IsLock = _IsLock;
                    _modelBuyerReceiAddr.IsDel = _IsDel;
                    _modelBuyerReceiAddr.WriteDate = _WriteDate;

                    // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                    string _initSQLCharWhere = "";

                    //获取分页JSON数据字符串
                    //显示的字段值
                    string[] _showFieldArr = { "PageOrder" };
                    string _strJson = BusiJsonPageStr.morePageJSONBuyerReceiAddr(_modelBuyerReceiAddr, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                    //输出前台显示代码
                    return _strJson;
                }
                else if (_exeType == "2") //添加收货地址
                {
                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                    string AddrType = PublicClass.FilterRequestTrim("AddrType");
                    string ReceiName = PublicClass.FilterRequestTrim("ReceiName");
                    string Mobile = PublicClass.FilterRequestTrim("Mobile");
                    string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                    string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");

                    // 添加买家收货地址信息
                    return BusiBuyer.addBuyerReceiAddrApi(Convert.ToInt64(BuyerUserID), AddrType, ReceiName, Mobile, RegionCodeArr, DetailAddr);
                }
                else if (_exeType == "3") //编辑收货地址
                {
                    string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");
                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                    string AddrType = PublicClass.FilterRequestTrim("AddrType");
                    string ReceiName = PublicClass.FilterRequestTrim("ReceiName");
                    string Mobile = PublicClass.FilterRequestTrim("Mobile");
                    string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                    string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");

                    //编辑 买家收货地址信息
                    return BusiBuyer.eidtBuyerReceiAddrApi(Convert.ToInt64(BReceiAddrID), Convert.ToInt64(BuyerUserID), AddrType, ReceiName, Mobile, RegionCodeArr, DetailAddr);
                }
                else if (_exeType == "4") //删除收货地址
                {
                    string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");
                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                    //删除 买家收货地址信息
                    return BusiBuyer.delBuyerReceiAddrApi(Convert.ToInt64(BReceiAddrID), Convert.ToInt64(BuyerUserID));
                }
                else if (_exeType == "5") //初始化买家收货地址
                {
                    //获取传递的参数
                    string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");
                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                    //防止数字类型为空
                    BReceiAddrID = PublicClass.preventNumberDataIsNull(BReceiAddrID);
                    BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                    //初始化买家收货地址信息 --API方法
                    string _jsonBack = BusiBuyer.initBuyerReceiAddrApi(Convert.ToInt64(BReceiAddrID), Convert.ToInt64(BuyerUserID));
                    return _jsonBack;
                }
                else if (_exeType == "6") //设为默认收货地址
                {
                    //获取传递的参数
                    string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");
                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                    //防止数字类型为空
                    BReceiAddrID = PublicClass.preventNumberDataIsNull(BReceiAddrID);
                    BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                    //将地址设置为默认地址，根据收货地址ID pBReceiAddrID
                    string _jsonBack = BusiBuyer.setDefaultBuyerReceiAddrApi(Convert.ToInt64(BReceiAddrID), Convert.ToInt64(BuyerUserID));
                    return _jsonBack;
                }
                else if (_exeType == "7") //加载默认收货地址
                {
                    //获取传递的参数
                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                    //防止数字类型为空
                    BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                    //加载买家默认收货地址
                    string _jsonBack = BusiBuyer.loadBuyerReceiAddrDefaultApi(Convert.ToInt64(BuyerUserID));
                    return _jsonBack;
                }
                else if (_exeType == "8") //预加载买家收货地址
                {
                    //获取传递的参数
                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                    //防止数字类型为空
                    BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                    //预加载买家收货地址
                    string _jsonBack = BusiBuyer.preBuyerReceiAddrApi(Convert.ToInt64(BuyerUserID));
                    return _jsonBack;

                }
            }
            return "";
        }

        /// <summary>
        /// 买家信息
        /// </summary>
        /// <returns></returns>
        public string BuyerMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string _BuyerMsgID = PublicClass.FilterRequestTrim("BuyerMsgID");
                string _UserID = PublicClass.FilterRequestTrim("UserID");
                string _UserNick = PublicClass.FilterRequestTrim("UserNick");
                string _HeaderImg = PublicClass.FilterRequestTrimNoConvert("HeaderImg");
                string _TrueName = PublicClass.FilterRequestTrim("TrueName");
                string _BuyerSex = PublicClass.FilterRequestTrim("BuyerSex");
                string _BirthDay = PublicClass.FilterRequestTrim("BirthDay");
                string _LinkMobile = PublicClass.FilterRequestTrim("LinkMobile");
                string _Email = PublicClass.FilterRequestTrim("Email");
                string _Profession = PublicClass.FilterRequestTrim("Profession");
                string _RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                string _RegionNameArr = PublicClass.FilterRequestTrim("RegionNameArr");
                string _DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                string _WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                _BuyerMsgID = PublicClass.preventNumberDataIsNull(_BuyerMsgID);
                _UserID = PublicClass.preventNumberDataIsNull(_UserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelBuyerMsg _modelBuyerMsg = new ModelBuyerMsg();
                _modelBuyerMsg.BuyerMsgID = Convert.ToInt64(_BuyerMsgID);
                _modelBuyerMsg.UserID = Convert.ToInt64(_UserID);
                _modelBuyerMsg.UserNick = _UserNick;
                _modelBuyerMsg.HeaderImg = _HeaderImg;
                _modelBuyerMsg.TrueName = _TrueName;
                _modelBuyerMsg.BuyerSex = _BuyerSex;
                _modelBuyerMsg.BirthDay = _BirthDay;
                _modelBuyerMsg.LinkMobile = _LinkMobile;
                _modelBuyerMsg.Email = _Email;
                _modelBuyerMsg.Profession = _Profession;
                _modelBuyerMsg.RegionCodeArr = _RegionCodeArr;
                _modelBuyerMsg.RegionNameArr = _RegionNameArr;
                _modelBuyerMsg.DetailAddr = _DetailAddr;
                _modelBuyerMsg.WriteDate = _WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONBuyerMsg(_modelBuyerMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }

            return "";
        }

        /// <summary>
        /// 关注收藏
        /// </summary>
        /// <returns></returns>
        public string BuyerFocusFav()
        {

            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据-wap,cms  Type=2 添加关注收藏 Type=3 删除关注收藏 Type=4 统计买家所有的收藏信息 商品，店铺
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string _FocusFavID = PublicClass.FilterRequestTrim("FocusFavID");
                string _BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //收藏关注类型( shop / goods)
                string _FocusFavType = PublicClass.FilterRequestTrim("FocusFavType");
                string _GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string _ShopID = PublicClass.FilterRequestTrim("ShopID");
                string _IsLock = PublicClass.FilterRequestTrim("IsLock");
                string _WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //分页类型[wap 手机网站，pc 电脑网站，cms 后台管理]
                string PageType = PublicClass.FilterRequestTrim("PageType");
                if (string.IsNullOrWhiteSpace(PageType))
                {
                    PageType = "cms";
                }

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                _FocusFavID = PublicClass.preventNumberDataIsNull(_FocusFavID);
                _BuyerUserID = PublicClass.preventNumberDataIsNull(_BuyerUserID);
                _GoodsID = PublicClass.preventNumberDataIsNull(_GoodsID);
                _ShopID = PublicClass.preventNumberDataIsNull(_ShopID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelBuyerFocusFav _modelBuyerFocusFav = new ModelBuyerFocusFav();
                _modelBuyerFocusFav.FocusFavID = Convert.ToInt64(_FocusFavID);
                _modelBuyerFocusFav.BuyerUserID = Convert.ToInt64(_BuyerUserID);
                _modelBuyerFocusFav.FocusFavType = _FocusFavType;
                _modelBuyerFocusFav.GoodsID = Convert.ToInt64(_GoodsID);
                _modelBuyerFocusFav.ShopID = Convert.ToInt64(_ShopID);
                _modelBuyerFocusFav.IsLock = _IsLock;
                _modelBuyerFocusFav.WriteDate = _WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONBuyerFocusFav(_modelBuyerFocusFav, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, PageType);

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加关注收藏
            {
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string FocusFavType = PublicClass.FilterRequestTrim("FocusFavType");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);

                //添加关注收藏信息 (收藏商品或店铺)
                return BusiBuyer.addBuyerFocusFavApi(Convert.ToInt64(BuyerUserID), FocusFavType, Convert.ToInt64(GoodsID), Convert.ToInt64(ShopID));
            }
            else if (_exeType == "3") //删除关注收藏
            {
                //获取传递的参数
                string FocusFavID = PublicClass.FilterRequestTrim("FocusFavID");

                //删除 关注收藏信息 (收藏商品或店铺)
                return BusiBuyer.delBuyerFocusFavApi(Convert.ToInt64(FocusFavID));
            }
            else if (_exeType == "4") //统计买家所有的收藏信息 商品，店铺
            {
                //获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiBuyer.countAllFavMsgApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 浏览足迹
        /// </summary>
        /// <returns></returns>
        public string BuyerBrowseHistory()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加浏览足迹 Type=3 删除浏览足迹
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string _BroHisID = PublicClass.FilterRequestTrim("BroHisID");
                string _BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string _GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string _BrowseNum = PublicClass.FilterRequestTrim("BrowseNum");
                string _IsLock = PublicClass.FilterRequestTrim("IsLock");
                string _WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //分页类型[wap 手机网站，pc 电脑网站，cms 后台管理]
                string PageType = PublicClass.FilterRequestTrim("PageType");
                if (string.IsNullOrWhiteSpace(PageType))
                {
                    PageType = "cms";
                }

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                _BroHisID = PublicClass.preventNumberDataIsNull(_BroHisID);
                _BuyerUserID = PublicClass.preventNumberDataIsNull(_BuyerUserID);
                _GoodsID = PublicClass.preventNumberDataIsNull(_GoodsID);
                _BrowseNum = PublicClass.preventNumberDataIsNull(_BrowseNum);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelBuyerBrowseHistory _modelBuyerBrowseHistory = new ModelBuyerBrowseHistory();
                _modelBuyerBrowseHistory.BroHisID = Convert.ToInt64(_BroHisID);
                _modelBuyerBrowseHistory.BuyerUserID = Convert.ToInt64(_BuyerUserID);
                _modelBuyerBrowseHistory.GoodsID = Convert.ToInt64(_GoodsID);
                _modelBuyerBrowseHistory.BrowseNum = Convert.ToInt64(_BrowseNum);
                _modelBuyerBrowseHistory.IsLock = _IsLock;
                _modelBuyerBrowseHistory.WriteDate = _WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONBuyerBrowseHistory(_modelBuyerBrowseHistory, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, PageType);

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加浏览足迹
            {
                //获取传递参数
                long BuyerUserID = Convert.ToInt64(PublicClass.FilterRequestTrim("BuyerUserID"));
                long GoodsID = Convert.ToInt64(PublicClass.FilterRequestTrim("GoodsID"));

                //添加浏览足迹信息
                return BusiBuyer.addBuyerBrowseHistoryApi(BuyerUserID, GoodsID);
            }
            else if (_exeType == "3") //删除浏览足迹
            {
                //获取传递参数
                long BuyerUserID = Convert.ToInt64(PublicClass.FilterRequestTrim("BuyerUserID"));
                long GoodsID = Convert.ToInt64(PublicClass.FilterRequestTrim("GoodsID"));

                //删除浏览足迹信息
                return BusiBuyer.delBuyerBrowseHistoryApi(BuyerUserID, GoodsID);
            }


            return "";
        }

        /// <summary>
        /// 推广会员信息
        /// </summary>
        /// <returns></returns>
        public string BuyerPromoteUser()
        {

            return "";
        }

        /// <summary>
        /// 买家发展店铺商家信息
        /// </summary>
        /// <returns></returns>
        public string BuyerExpandShop()
        {
           

            return "";
        }

    }
}