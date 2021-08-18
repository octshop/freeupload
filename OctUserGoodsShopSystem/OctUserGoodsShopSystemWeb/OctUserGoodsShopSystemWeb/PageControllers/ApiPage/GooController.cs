using BusiApiKeyVerifyNS;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【商品】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class GooController : Controller
    {
        // GET: Goo
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 商品评价
        /// </summary>
        /// <returns></returns>
        public string GooAppraise()
        {

            //获取操作类型  Type=1 搜索分页数据 Type=2 提交商品评价,晒单信息和店铺评价 Type=3 初始化订单商品评价信息 Type=4 初始化商品评价,指定记录条数 Type=5 订单商品评价数据分页 Type=6 统计商品的各种评价信息 Type=7 统计店铺所有商品的评价信息 Type=8 统计买家的评价信息 Type=9 批量-锁定/解锁 商品评价 Type=10 删除评价信息
            string _exeType = PublicClass.FilterRequestTrim("Type");

            //------------------无需进行验证签名----------------//
            if (_exeType == "4") //初始化商品评价,指定记录条数
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //防止数字类型为空
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                if (GoodsID == "0")
                {
                    return "";
                }

                //初始化商品评价,指定记录条数 --API调用方法
                string _jsonBack = BusiGoods.initGoodsAppraiseSelTopApi(Convert.ToInt64(GoodsID));
                return _jsonBack;
            }
            else if (_exeType == "5") //订单商品评价数据分页
            {
                // 获取传递的参数
                string _AppID = PublicClass.FilterRequestTrim("AppID");
                string _OrderID = PublicClass.FilterRequestTrim("OrderID");
                string _GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string _AppScore = PublicClass.FilterRequestTrim("AppScore");
                string _AppContent = PublicClass.FilterRequestTrim("AppContent");
                string _UserID = PublicClass.FilterRequestTrim("UserID");
                string _IsLock = PublicClass.FilterRequestTrim("IsLock");
                string _WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                string IsAnonymity = PublicClass.FilterRequestTrim("IsAnonymity");

                string CountAppraiseImg = PublicClass.FilterRequestTrim("CountAppraiseImg");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                _AppID = PublicClass.preventNumberDataIsNull(_AppID);
                _OrderID = PublicClass.preventNumberDataIsNull(_OrderID);
                CountAppraiseImg = PublicClass.preventNumberDataIsNull(CountAppraiseImg);
                _GoodsID = PublicClass.preventNumberDataIsNull(_GoodsID);
                _AppScore = PublicClass.preventNumberDataIsNull(_AppScore);
                _UserID = PublicClass.preventNumberDataIsNull(_UserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelOrderGooAppraise _modelOrderGooAppraise = new ModelOrderGooAppraise();
                _modelOrderGooAppraise.AppID = Convert.ToInt64(_AppID);
                _modelOrderGooAppraise.OrderID = Convert.ToInt64(_OrderID);
                _modelOrderGooAppraise.GoodsID = Convert.ToInt64(_GoodsID);
                //_modelOrderGooAppraise.AppScore = Convert.ToInt32(_AppScore);
                _modelOrderGooAppraise.AppContent = _AppContent;
                _modelOrderGooAppraise.UserID = Convert.ToInt64(_UserID);
                _modelOrderGooAppraise.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelOrderGooAppraise.IsAnonymity = IsAnonymity;
                _modelOrderGooAppraise.IsLock = _IsLock;
                _modelOrderGooAppraise.WriteDate = _WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                if (_AppScore != "0")
                {
                    if (Convert.ToInt32(_AppScore) >= 4)
                    {
                        _initSQLCharWhere = "AppScore>=4"; //好评
                    }
                    else if (Convert.ToInt32(_AppScore) == 3)
                    {
                        _initSQLCharWhere = "AppScore=3"; //中评
                    }
                    else if (Convert.ToInt32(_AppScore) <= 2)
                    {
                        _initSQLCharWhere = "AppScore<=2"; //差评
                    }
                }
                if (Convert.ToInt32(CountAppraiseImg) > 0)
                {
                    _initSQLCharWhere = "CountAppraiseImg>0"; //有图
                }


                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "GoodsTitle", "ShopID" };
                string _strJson = BusiJsonPageStr.morePageJSONOrderGooAppraise(_modelOrderGooAppraise, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "6") //统计商品的各种评价信息
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //统计 商品的各种评价信息 --API调用方法
                string _jsonBack = BusiGoods.sumGoodsAppraiseMsgApi(Convert.ToInt64(GoodsID));
                return _jsonBack;
            }
            else if (_exeType == "7") //统计店铺所有商品的评价信息
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //统计店铺所有商品评价信息 --Api调用方法
                string _jsonBack = BusiGoods.countShopAllGoodsAppraiseMsgApi(Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else
            {
                //---------------------需要进行验证签名----------------//

                //验证RndKeyRsa是否正确
                bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
                if (_verifySu == false)
                {
                    return "";
                }

                if (_exeType == "1")
                {
                    // 获取传递的参数
                    string _AppID = PublicClass.FilterRequestTrim("AppID");
                    string _OrderID = PublicClass.FilterRequestTrim("OrderID");
                    string _GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    string _AppScore = PublicClass.FilterRequestTrim("AppScore");
                    string _AppContent = PublicClass.FilterRequestTrim("AppContent");
                    string _UserID = PublicClass.FilterRequestTrim("UserID");
                    string _IsLock = PublicClass.FilterRequestTrim("IsLock");
                    string _WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                    //获取当前页数
                    string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                    //防止数字类型为空
                    _AppID = PublicClass.preventNumberDataIsNull(_AppID);
                    _OrderID = PublicClass.preventNumberDataIsNull(_OrderID);
                    _GoodsID = PublicClass.preventNumberDataIsNull(_GoodsID);
                    _AppScore = PublicClass.preventNumberDataIsNull(_AppScore);
                    _UserID = PublicClass.preventNumberDataIsNull(_UserID);

                    //------------用实体类去限制的查询条件 AND 连接------------//
                    ModelGooAppraise _modelGooAppraise = new ModelGooAppraise();
                    _modelGooAppraise.AppID = Convert.ToInt64(_AppID);
                    _modelGooAppraise.OrderID = Convert.ToInt64(_OrderID);
                    _modelGooAppraise.GoodsID = Convert.ToInt64(_GoodsID);
                    _modelGooAppraise.AppScore = Convert.ToInt32(_AppScore);
                    _modelGooAppraise.AppContent = _AppContent;
                    _modelGooAppraise.UserID = Convert.ToInt32(_UserID);
                    _modelGooAppraise.IsLock = _IsLock;
                    _modelGooAppraise.WriteDate = _WriteDate;

                    // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                    string _initSQLCharWhere = "";

                    //获取分页JSON数据字符串
                    //显示的字段值
                    string[] _showFieldArr = { "PageOrder" };
                    string _strJson = BusiJsonPageStr.morePageJSONGooAppraise(_modelGooAppraise, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                    //输出前台显示代码
                    return _strJson;
                }
                else if (_exeType == "2") //提交商品评价,晒单信息和店铺评价
                {
                    //获取传递的参数
                    string AppraiseJson = PublicClass.FilterRequestTrimNoConvert("AppraiseJson");
                    AppraiseJson = HttpContext.Server.UrlDecode(AppraiseJson);

                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                    //防止数字类型为空
                    BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                    //评价商品和店铺 
                    string _backJson = BusiGoods.submitOrderGoodsAppImgShopAppraiseApi(AppraiseJson, Convert.ToInt64(BuyerUserID));

                    return _backJson;
                }
                else if (_exeType == "3") //初始化订单商品评价信息
                {
                    //获取传递的参数
                    string OrderID = PublicClass.FilterRequestTrim("OrderID");
                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                    //防止数字类型为空
                    OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                    BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                    //初始化 订单的商品评价信息，包括商品评价，晒单评价，店铺评价 --API调用方法
                    string _jsonBack = BusiGoods.initOrderGoodsShopAppraiseApi(Convert.ToInt64(OrderID), Convert.ToInt64(BuyerUserID));
                    return _jsonBack;
                }
                else if (_exeType == "8") //统计买家的评价信息
                {
                    //获取传递的参数
                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                    //防止数字类型为空
                    BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                    string _jsonBack = BusiGoods.countBuyerAppraiseMsgApi(Convert.ToInt64(BuyerUserID));
                    return _jsonBack;
                }
                else if (_exeType == "9") //批量-锁定/解锁 商品评价
                {
                    //获取传递的参数
                    string AppIDArr = PublicClass.FilterRequestTrim("AppIDArr");
                    string IsLock = PublicClass.FilterRequestTrim("IsLock");

                    string _jsonBack = BusiGoods.lockGoodsAppraiseArrApi(AppIDArr, IsLock);
                    return _jsonBack;

                }
                else if (_exeType == "10") //删除评价信息
                {
                    //获取传递的参数
                    string OrderID = PublicClass.FilterRequestTrim("OrderID");
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                    //防止数字为空
                    OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                    GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);

                    string _jsonBack = BusiGoods.delGooAppraiseApi(Convert.ToInt64(OrderID), Convert.ToInt64(GoodsID));
                    return _jsonBack;
                }
            }


            return "";
        }

        /// <summary>
        /// 商品评价照片
        /// </summary>
        /// <returns></returns>
        public string GooAppraiseImgs()
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
                string _AppImgID = PublicClass.FilterRequestTrim("AppImgID");
                string _OrderID = PublicClass.FilterRequestTrim("OrderID");
                string _GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string _ImgUrl = PublicClass.FilterRequestTrimNoConvert("ImgUrl");
                string _BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string _IsLock = PublicClass.FilterRequestTrim("IsLock");
                string _WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                _AppImgID = PublicClass.preventNumberDataIsNull(_AppImgID);
                _OrderID = PublicClass.preventNumberDataIsNull(_OrderID);
                _GoodsID = PublicClass.preventNumberDataIsNull(_GoodsID);
                _BuyerUserID = PublicClass.preventNumberDataIsNull(_BuyerUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelGooAppraiseImgs _modelGooAppraiseImgs = new ModelGooAppraiseImgs();
                _modelGooAppraiseImgs.AppImgID = Convert.ToInt64(_AppImgID);
                _modelGooAppraiseImgs.OrderID = Convert.ToInt64(_OrderID);
                _modelGooAppraiseImgs.GoodsID = Convert.ToInt64(_GoodsID);
                _modelGooAppraiseImgs.ImgUrl = _ImgUrl;
                _modelGooAppraiseImgs.BuyerUserID = Convert.ToInt64(_BuyerUserID);
                _modelGooAppraiseImgs.IsLock = _IsLock;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONGooAppraiseImgs(_modelGooAppraiseImgs, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            return "";
        }

        /// <summary>
        /// 商品赠品
        /// </summary>
        /// <returns></returns>
        public string GooGiftMsg()
        {
            //获取操作类型  Type=1 搜索分页数据 Type=2 添加赠品 Type=3 编辑赠品 Type=4 删除赠品 Type=5 上架下架赠品 Type=6 加载店铺赠品信息列表  Type=7 删除 单个或批量 赠品信息 Type=8 初始化赠品信息 Type=9 加载商家赠品信息列表 Type=10 初始化赠品描述内容
            string _exeType = PublicClass.FilterRequestTrim("Type");

            //初始化赠品信息
            if (_exeType == "8")
            {
                //获取传递的参数
                string GiftID = PublicClass.FilterRequestTrim("GiftID");

                //初始化赠品信息，包含 赠品图片列表
                return BusiGoods.initGooGiftMsgApi(Convert.ToInt64(GiftID));
            }
            else if (_exeType == "10") //初始化赠品描述内容
            {
                //获取传递的参数
                string GiftID = PublicClass.FilterRequestTrim("GiftID");

                //防止数字为空
                GiftID = PublicClass.preventNumberDataIsNull(GiftID);

                string _jsonBack = BusiGoods.initGiftDescApi(Convert.ToInt64(GiftID));
                return _jsonBack;
            }

            //----验证RndKeyRsa是否正确----//
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            if (_exeType == "1")
            {
                // 获取传递的参数
                string _GiftID = PublicClass.FilterRequestTrim("GiftID");
                string _GiftName = PublicClass.FilterRequestTrim("GiftName");
                string _GiftDesc = PublicClass.FilterRequestTrim("GiftDesc");
                string _GiftPrice = PublicClass.FilterRequestTrim("GiftPrice");
                string _StockNum = PublicClass.FilterRequestTrim("StockNum");
                string _GiftImgUrl = PublicClass.FilterRequestTrim("GiftImgUrl");
                string _ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string _IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");
                string _IsLock = PublicClass.FilterRequestTrim("IsLock");
                string _WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                _GiftID = PublicClass.preventNumberDataIsNull(_GiftID);
                _GiftPrice = PublicClass.preventDecimalDataIsNull(_GiftPrice);
                _StockNum = PublicClass.preventNumberDataIsNull(_StockNum);
                _ShopUserID = PublicClass.preventNumberDataIsNull(_ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelGooGiftMsg _modelGooGiftMsg = new ModelGooGiftMsg();
                _modelGooGiftMsg.GiftID = Convert.ToInt64(_GiftID);
                _modelGooGiftMsg.GiftName = _GiftName;
                _modelGooGiftMsg.GiftDesc = _GiftDesc;
                _modelGooGiftMsg.GiftPrice = Convert.ToDecimal(_GiftPrice);
                _modelGooGiftMsg.StockNum = Convert.ToInt32(_StockNum);
                _modelGooGiftMsg.GiftImgUrl = _GiftImgUrl;
                _modelGooGiftMsg.ShopUserID = Convert.ToInt64(_ShopUserID);
                _modelGooGiftMsg.IsUnSale = _IsUnSale;
                _modelGooGiftMsg.IsLock = _IsLock;
                _modelGooGiftMsg.WriteDate = _WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONGooGiftMsg(_modelGooGiftMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加赠品 
            {
                // 获取传递的参数
                string GiftName = PublicClass.FilterRequestTrim("GiftName");
                string GiftDesc = Request["GiftDesc"].ToString().Trim();
                string GiftPrice = PublicClass.FilterRequestTrim("GiftPrice");
                string StockNum = PublicClass.FilterRequestTrim("StockNum");
                string GiftImgUrlArr = PublicClass.FilterRequestTrimNoConvert("GiftImgUrlArr");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");

                //Base64解密
                GiftDesc = EncryptionClassNS.EncryptionClass.DecodeBase64("UTF-8", GiftDesc);

                //去掉数字后的小数点
                StockNum = PublicClass.formatNumberRemovePoint(StockNum);

                //过滤掉 GiftDesc 中的<Script /> 等标签
                PublicClass.FilterFrameset(PublicClass.FilterHrefScript(PublicClass.FilterIframe(PublicClass.FilterScript(GiftDesc))));

                //添加 商品赠品信息
                return BusiGoods.addGooGiftMsgApi(GiftName, GiftDesc, Convert.ToDecimal(GiftPrice), Convert.ToInt32(StockNum), GiftImgUrlArr, Convert.ToInt64(ShopUserID), IsUnSale);
            }
            else if (_exeType == "3") //编辑赠品
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string GiftID = PublicClass.FilterRequestTrim("GiftID");
                string GiftName = PublicClass.FilterRequestTrim("GiftName");
                string GiftDesc = Request["GiftDesc"].ToString().Trim();
                string GiftPrice = PublicClass.FilterRequestTrim("GiftPrice");
                string StockNum = PublicClass.FilterRequestTrim("StockNum");
                string GiftImgUrlArr = PublicClass.FilterRequestTrimNoConvert("GiftImgUrlArr");
                string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字值为空
                GiftID = PublicClass.preventNumberDataIsNull(GiftID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //Base64解密
                GiftDesc = EncryptionClassNS.EncryptionClass.DecodeBase64("UTF-8", GiftDesc);

                //去掉数字后的小数点
                StockNum = PublicClass.formatNumberRemovePoint(StockNum);

                //过滤掉 GiftDesc 中的<Script /> 等标签
                PublicClass.FilterFrameset(PublicClass.FilterHrefScript(PublicClass.FilterIframe(PublicClass.FilterScript(GiftDesc))));

                //编辑 商品赠品信息
                return BusiGoods.editGooGiftMsgApi(Convert.ToInt64(GiftID), GiftName, GiftDesc, Convert.ToDecimal(GiftPrice), Convert.ToInt32(StockNum), GiftImgUrlArr, IsUnSale, IsLock, Convert.ToInt64(ShopUserID));
            }
            else if (_exeType == "4") //删除赠品 
            {
                // 获取传递的参数
                string GiftID = PublicClass.FilterRequestTrim("GiftID");

                //删除 商品赠品信息
                return BusiGoods.delGooGiftMsgApi(Convert.ToInt64(GiftID));
            }
            else if (_exeType == "5") //上架下架赠品
            {
                // 获取传递的参数
                string GiftID = PublicClass.FilterRequestTrim("GiftID");
                string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");

                //上架下架赠品信息
                return BusiGoods.toggleUnSaleGooGiftMsgApi(Convert.ToInt64(GiftID), IsUnSale);
            }
            else if (_exeType == "6") //加载店铺赠品信息列表
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string IsUnSale = PublicClass.FilterRequestTrim("pIsUnSale"); //是否下架

                //得到 店铺赠品信息列表
                List<ModelGooGiftMsg> _listModelGooGiftMsg = BusiGetData.getListModelGooGiftMsg(Convert.ToInt64(ShopUserID), IsLock, IsUnSale);
                return BusiJsonBuilder.jsonListModel(_listModelGooGiftMsg.OfType<object>().ToList(), "GooGiftMsgList", true, new string[] { "ShopUserID", "IsUnSale", "IsLock", "WriteDate", "PageOrder" });
            }
            else if (_exeType == "7") //删除 单个或批量 赠品信息 --API调用方法
            {
                //获取传递的参数
                string GiftIDArr = PublicClass.FilterRequestTrim("GiftIDArr");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //删除 单个或批量 赠品信息 --API调用方法
                return BusiGoods.delGooGiftMsgArrApi(GiftIDArr, Convert.ToInt64(ShopUserID));
            }
            else if (_exeType == "8") //初始化赠品信息
            {
                //获取传递的参数
                string GiftID = PublicClass.FilterRequestTrim("GiftID");

                //初始化赠品信息，包含 赠品图片列表
                return BusiGoods.initGooGiftMsgApi(Convert.ToInt64(GiftID));
            }
            else if (_exeType == "9") //加载商家赠品信息列表
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //得到商家赠品列表
                List<ModelGooGiftMsg> _listModelGooGiftMsg = BusiGetData.getListModelGooGiftMsg(Convert.ToInt64(ShopUserID), "false", "false");
                for (int i = 0; i < _listModelGooGiftMsg.Count; i++)
                {
                    _listModelGooGiftMsg[i].GiftDesc = "";
                }
                //生成Json
                string _jsonBack = BusiJsonBuilder.jsonListModel(_listModelGooGiftMsg.OfType<object>().ToList(), "GooGiftMsgList", true, new string[] { "ShopUserID", "IsUnSale", "IsLock", "WriteDate", "PageOrder", "GiftDesc" });
                return _jsonBack;
            }



            return "";
        }

        /// <summary>
        /// 赠品图片
        /// </summary>
        /// <returns></returns>
        public string GooGiftImg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 批量删除赠品图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string GiftImgID = PublicClass.FilterRequestTrim("GiftImgID");
                string GiftID = PublicClass.FilterRequestTrim("GiftID");
                string ImgURL = PublicClass.FilterRequestTrim("ImgURL");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                GiftImgID = PublicClass.preventNumberDataIsNull(GiftImgID);
                GiftID = PublicClass.preventNumberDataIsNull(GiftID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelGooGiftImg _modelGooGiftImg = new ModelGooGiftImg();
                _modelGooGiftImg.GiftImgID = Convert.ToInt64(GiftImgID);
                _modelGooGiftImg.GiftID = Convert.ToInt64(GiftID);
                _modelGooGiftImg.ImgURL = ImgURL;
                _modelGooGiftImg.UploadGuid = UploadGuid;
                _modelGooGiftImg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelGooGiftImg.IsLock = IsLock;
                _modelGooGiftImg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "ShopUserID", "IsLock", "WriteDate" };
                string _strJson = BusiJsonPageStr.morePageJSONGooGiftImg(_modelGooGiftImg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //批量删除赠品图片
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string GiftImgIDArr = PublicClass.FilterRequestTrim("GiftImgIDArr");

                //删除 赠品图片信息 --API调用方法
                string _jsonBack = BusiGoods.delGooGiftImgArrApi(GiftImgIDArr, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 商品信息
        /// </summary>
        /// <returns></returns>
        public string GooGoodsMsg()
        {
            //获取操作类型  Type=1 搜索分页数据 Type=2 添加商品信息 Type=3 初始化商品信息 Type=4 保存商品信息 Type=5 商品上架下架 Type=6 得到没有规格属性时的库存和价格 Type=7 加载商品信息 Type=8 加载商品描述规格参数包装售后  Type=9 加载商品额外数据 如收货地址等 Type=10 初始化或统计商品的运费 Type=11 验证商品是否可以立即订购 Type=12 初始化订购下单信息[商家，商品，运费,默认优惠券，配送方式]等 Type=13 初始化商家商品列表信息--多商家多商品确认订单 Type=14 判断商品库存是否足够 Type=15 保存商品价格与库存，没有规格的情况 Type=16 初始化商品信息 -简单的单表信息 Type=17 批量切换 - 商家是否推荐商品 Type=18 搜索分页数据视图-商品信息-店铺信息 Type=19 审核商品信息 Type=20 锁定与解锁 商品信息 Type=21 加载商品详情信息-视图(后台CMS) Type=22 加载指定记录条数的 商品简单信息列表，根据第三级商品类目 Type=23 批量删除商品信息 Type=24 得到买家分享商品返佣的URL
            string _exeType = PublicClass.FilterRequestTrim("Type");

            //-------------无需要验证签名------------//
            if (_exeType == "7") //加载商品信息
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //加载商品信息 --API调用方法
                string _jsonBack = BusiGoods.loadGooGoodsMsgApi(Convert.ToInt64(GoodsID));
                return _jsonBack;
            }
            else if (_exeType == "8") //加载商品描述规格参数包装售后
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //加载商品描述规格参数包装售后 --API调用方法
                return BusiGoods.loadGoodsDescPropPackAfterSaleApi(Convert.ToInt64(GoodsID));
            }
            else if (_exeType == "9") //加载商品额外数据 如收货地址等
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //防止数据为空
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //加载商品额外数据 如收货地址等
                string _jsonBack = BusiGoods.loadExtraGoodsMsgApi(Convert.ToInt64(BuyerUserID), Convert.ToInt64(GoodsID));

                return _jsonBack;
            }
            else if (_exeType == "10") //初始化或统计商品的运费
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string FtID = PublicClass.FilterRequestTrim("FtID");
                string RegionProCode = PublicClass.FilterRequestTrim("RegionProCode");
                string OrderNum = PublicClass.FilterRequestTrim("OrderNum");

                //防止数字为空
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                FtID = PublicClass.preventNumberDataIsNull(FtID);
                OrderNum = PublicClass.preventNumberDataIsNull(OrderNum);

                //计算商品的运费-- - API方法
                string _jsonBack = BusiShop.countGoodsFreightMoneyApi(Convert.ToInt64(GoodsID), Convert.ToInt64(FtID), RegionProCode, Convert.ToInt32(OrderNum));
                return _jsonBack;
            }
            else if (_exeType == "11") //验证商品是否可以立即订购
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SelSpecPropIDVal = PublicClass.FilterRequestTrim("SelSpecPropIDVal");
                string OrderNum = PublicClass.FilterRequestTrim("OrderNum");

                //防止数字为空
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                SelSpecPropIDVal = PublicClass.preventNumberDataIsNull(SelSpecPropIDVal);
                OrderNum = PublicClass.preventNumberDataIsNull(OrderNum);

                //检测商品状态信息，是否可以立即订购 ---API调用方法
                string _jsonBack = BusiGoods.checkGoodsIsOrderNowApi(Convert.ToInt64(GoodsID), Convert.ToInt64(SelSpecPropIDVal), Convert.ToInt32(OrderNum));
                return _jsonBack;

            }
            else if (_exeType == "14") //判断商品库存是否足够
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                //规格ID和属性ID的拼接字符串 [110585^110588 | 110585 | 0]
                string SpecPropIDArr = PublicClass.FilterRequestTrim("SpecPropIDArr");
                string OrderNum = PublicClass.FilterRequestTrim("OrderNum");

                //防止数字类型为空
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                OrderNum = PublicClass.preventNumberDataIsNull(OrderNum);

                //判断商品库存是否足够 - 信息主要是来自购物车信息 --API调用方法
                string _jsonBack = BusiGoods.isStockEnoughBySCartApi(Convert.ToInt64(GoodsID), SpecPropIDArr, Convert.ToInt32(OrderNum));
                return _jsonBack;

            }
            else if (_exeType == "16") //初始化商品信息 -简单的单表信息
            {
                //获取传递的参数
                //可以是只有一个GoodID
                string GoodIDArr = PublicClass.FilterRequestTrim("GoodIDArr");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //初始化商品信息 - 简单的单表 信息 --API调用方法
                string _jsonBack = BusiGoods.initGooGoodsMsgSingleApi(GoodIDArr, Convert.ToInt64(ShopUserID));
                return _jsonBack;

            }
            else if (_exeType == "22") //加载指定记录条数的 商品简单信息列表，根据第三级商品类目
            {
                //获取传递的参数
                string GoodsTypeIDThird = PublicClass.FilterRequestTrim("GoodsTypeIDThird");

                //防止数字类型为空
                GoodsTypeIDThird = PublicClass.preventNumberDataIsNull(GoodsTypeIDThird);

                string _json = BusiGoods.loadListGoodsMsgSimpleByThirdTypeApi(Convert.ToInt64(GoodsTypeIDThird));
                return _json;
            }
            else if (_exeType == "24") //得到买家分享商品返佣的URL
            {
                //获取传递过来的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiGoods.getBuyerShareGoodsURLApi(Convert.ToInt64(GoodsID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else //-------------需要验证签名-----------------//
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
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                    string GoodsTypeNeedProp = PublicClass.FilterRequestTrim("GoodsTypeNeedProp");
                    string GoodsTypeCustomProp = PublicClass.FilterRequestTrim("GoodsTypeCustomProp");
                    string GoodsTitle = PublicClass.FilterRequestTrim("GoodsTitle");
                    string GoodsDesc = PublicClass.FilterRequestTrim("GoodsDesc");
                    string GiftIDArr = PublicClass.FilterRequestTrim("GiftIDArr");
                    string ShopID = PublicClass.FilterRequestTrim("ShopID");
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                    string GoodsPrice = PublicClass.FilterRequestTrim("GoodsPrice");
                    string StockNum = PublicClass.FilterRequestTrim("StockNum");
                    string GoodsStatus = PublicClass.FilterRequestTrim("GoodsStatus");
                    string PackAfterSaleDesc = PublicClass.FilterRequestTrim("PackAfterSaleDesc");
                    string GoodsMemo = PublicClass.FilterRequestTrim("GoodsMemo");
                    string IsSpecParam = PublicClass.FilterRequestTrim("IsSpecParam");
                    string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");
                    string IsPayDelivery = PublicClass.FilterRequestTrim("IsPayDelivery");
                    string IsShopExpense = PublicClass.FilterRequestTrim("IsShopExpense");
                    string IsDistri = PublicClass.FilterRequestTrim("IsDistri");
                    string DistriMoney = PublicClass.FilterRequestTrim("DistriMoney");
                    string IsLock = PublicClass.FilterRequestTrim("IsLock");
                    string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                    //获取当前页数
                    string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");
                    //页面记录数
                    string _pageSize = PublicClass.FilterRequestTrim("PageSize");
                    if (string.IsNullOrWhiteSpace(_pageSize) || _pageSize == "0")
                    {
                        _pageSize = "15";
                    }

                    //防止数字类型为空
                    GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                    GoodsTypeID = PublicClass.preventNumberDataIsNull(GoodsTypeID);
                    ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                    ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                    GoodsPrice = PublicClass.preventDecimalDataIsNull(GoodsPrice);
                    StockNum = PublicClass.preventNumberDataIsNull(StockNum);
                    DistriMoney = PublicClass.preventDecimalDataIsNull(DistriMoney);


                    //------------用实体类去限制的查询条件 AND 连接------------//
                    ModelGooGoodsMsg _modelGooGoodsMsg = new ModelGooGoodsMsg();
                    _modelGooGoodsMsg.GoodsID = Convert.ToInt64(GoodsID);
                    _modelGooGoodsMsg.GoodsTypeID = Convert.ToInt64(GoodsTypeID);
                    _modelGooGoodsMsg.GoodsTypeNeedProp = GoodsTypeNeedProp;
                    _modelGooGoodsMsg.GoodsTypeCustomProp = GoodsTypeCustomProp;
                    _modelGooGoodsMsg.GoodsTitle = GoodsTitle;
                    _modelGooGoodsMsg.GoodsDesc = GoodsDesc;
                    _modelGooGoodsMsg.GiftIDArr = GiftIDArr;
                    _modelGooGoodsMsg.ShopID = Convert.ToInt64(ShopID);
                    _modelGooGoodsMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                    _modelGooGoodsMsg.GoodsPrice = Convert.ToDecimal(GoodsPrice);
                    _modelGooGoodsMsg.StockNum = Convert.ToInt32(StockNum);
                    _modelGooGoodsMsg.GoodsStatus = GoodsStatus;
                    _modelGooGoodsMsg.PackAfterSaleDesc = PackAfterSaleDesc;
                    _modelGooGoodsMsg.GoodsMemo = GoodsMemo;
                    _modelGooGoodsMsg.IsSpecParam = IsSpecParam;
                    _modelGooGoodsMsg.IsUnSale = IsUnSale;
                    _modelGooGoodsMsg.IsPayDelivery = IsPayDelivery;
                    _modelGooGoodsMsg.IsShopExpense = IsShopExpense;
                    _modelGooGoodsMsg.IsDistri = IsDistri;
                    _modelGooGoodsMsg.DistriMoney = Convert.ToDecimal(DistriMoney);
                    _modelGooGoodsMsg.IsLock = IsLock;
                    _modelGooGoodsMsg.WriteDate = WriteDate;


                    // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                    string _initSQLCharWhere = "";

                    //获取分页JSON数据字符串
                    //显示的字段值
                    string[] _showFieldArr = { "PageOrder", "GoodsTypeNeedProp", "GoodsTypeCustomProp", "GoodsDesc", "PackAfterSaleDesc" };
                    string _strJson = BusiJsonPageStr.morePageJSONGooGoodsMsg(_modelGooGoodsMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms", "PageOrder DESC", _pageSize);

                    //输出前台显示代码
                    return _strJson;
                }
                else if (_exeType == "2") //添加商品信息
                {
                    // 获取传递的参数
                    string GoodsMsgGuid = PublicClass.FilterRequestTrim("GoodsMsgGuid");
                    string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                    string GoodsTypeNeedProp = PublicClass.FilterRequestTrimNoConvert("GoodsTypeNeedProp");
                    string GoodsTypeCustomProp = PublicClass.FilterRequestTrimNoConvert("GoodsTypeCustomProp");
                    string GoodsTitle = PublicClass.FilterRequestTrim("GoodsTitle");

                    string GoodsDesc = Request["GoodsDesc"].ToString().Trim();
                    GoodsDesc = EncryptionClassNS.EncryptionClass.DecodeBase64("utf-8", GoodsDesc);
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                    string GoodsSpecTitle = PublicClass.FilterRequestTrim("GoodsSpecTitle");
                    string GoodsPropTitle = PublicClass.FilterRequestTrim("GoodsPropTitle");

                    //mImgKeyGuid | mImgPathDomain ^ mImgKeyGuid | mImgPathDomain^ mImgKeyGuid | mImgPathDomain
                    string GoodsImgArr = PublicClass.FilterRequestTrimNoConvert("GoodsImgArr");
                    string GiftIDArr = PublicClass.FilterRequestTrimNoConvert("GiftIDArr");
                    string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");
                    string GoodsPrice = PublicClass.FilterRequestTrim("GoodsPrice");
                    string StockNum = PublicClass.FilterRequestTrim("StockNum");
                    StockNum = PublicClass.formatNumberRemovePoint(StockNum);
                    string PackAfterSaleDesc = PublicClass.FilterRequestTrim("PackAfterSaleDesc");
                    string IsPayDelivery = PublicClass.FilterRequestTrim("IsPayDelivery");
                    string IsShopExpense = PublicClass.FilterRequestTrim("IsShopExpense");
                    string IsOfflinePay = PublicClass.FilterRequestTrim("IsOfflinePay");
                    string IsDistri = PublicClass.FilterRequestTrim("IsDistri");
                    string DistriMoney = PublicClass.FilterRequestTrim("DistriMoney");

                    string MarketPrice = PublicClass.FilterRequestTrim("MarketPrice");
                    string Discount = PublicClass.FilterRequestTrim("Discount");
                    string FtID = PublicClass.FilterRequestTrim("FtID");

                    //是否买家分享返佣 [ false / true ] (订单必须确认收货后，才会进行返佣操作)
                    string IsShareGoods = PublicClass.FilterRequestTrim("IsShareGoods");
                    if (string.IsNullOrWhiteSpace(IsShareGoods))
                    {
                        IsShareGoods = "false";
                    }
                    //是否显示分享商品的返佣金额(返佣金额根据订单抽成进行计算) [ false / true ]
                    string IsShowShareMoney = PublicClass.FilterRequestTrim("IsShowShareMoney");
                    if (string.IsNullOrWhiteSpace(IsShowShareMoney))
                    {
                        IsShowShareMoney = "false";
                    }

                    //防止数字类型为空
                    GoodsTypeID = PublicClass.preventNumberDataIsNull(GoodsTypeID);
                    ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                    GoodsPrice = PublicClass.preventDecimalDataIsNull(GoodsPrice);
                    StockNum = PublicClass.preventNumberDataIsNull(StockNum);
                    FtID = PublicClass.preventNumberDataIsNull(FtID);
                    DistriMoney = PublicClass.preventDecimalDataIsNull(DistriMoney);
                    ShopGoodsTypeID = PublicClass.preventNumberDataIsNull(ShopGoodsTypeID);
                    MarketPrice = PublicClass.preventDecimalDataIsNull(MarketPrice);
                    Discount = PublicClass.preventDecimalDataIsNull(Discount);

                    //提交商品信息 --API调用方法
                    string _jsonBack = BusiGoods.submitGooGoodsMsgApi(0, GoodsMsgGuid, Convert.ToInt64(GoodsTypeID), GoodsTypeNeedProp, GoodsTypeCustomProp, GoodsTitle, GoodsDesc, GoodsSpecTitle, GoodsPropTitle, GoodsImgArr, GiftIDArr, Convert.ToInt64(ShopGoodsTypeID), Convert.ToInt64(ShopUserID), Convert.ToDecimal(GoodsPrice), Convert.ToInt32(StockNum), "", "审", PackAfterSaleDesc, IsDistri, Convert.ToDecimal(DistriMoney), "false", IsPayDelivery, IsShopExpense, "false", Convert.ToDecimal(MarketPrice), Convert.ToDecimal(Discount), Convert.ToInt64(FtID), IsOfflinePay, IsShareGoods, IsShowShareMoney);

                    return _jsonBack;
                }
                else if (_exeType == "3") //初始化商品信息
                {
                    //获取传递过来的参数
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                    //初始化商品信息 --API调用方法
                    string _jsonBack = BusiGoods.initGooGoodsMsgApi(Convert.ToInt64(GoodsID));
                    return _jsonBack;
                }
                else if (_exeType == "4") //保存商品信息
                {
                    // 获取传递的参数
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    string GoodsMsgGuid = PublicClass.FilterRequestTrim("GoodsMsgGuid");
                    string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                    string GoodsTypeNeedProp = PublicClass.FilterRequestTrimNoConvert("GoodsTypeNeedProp");
                    string GoodsTypeCustomProp = PublicClass.FilterRequestTrimNoConvert("GoodsTypeCustomProp");
                    string GoodsTitle = PublicClass.FilterRequestTrim("GoodsTitle");

                    string GoodsDesc = Request["GoodsDesc"].ToString().Trim();
                    GoodsDesc = EncryptionClassNS.EncryptionClass.DecodeBase64("utf-8", GoodsDesc);
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                    string GoodsSpecTitle = PublicClass.FilterRequestTrim("GoodsSpecTitle");
                    string GoodsPropTitle = PublicClass.FilterRequestTrim("GoodsPropTitle");

                    //mImgKeyGuid | mImgPathDomain ^ mImgKeyGuid | mImgPathDomain^ mImgKeyGuid | mImgPathDomain
                    string GoodsImgArr = PublicClass.FilterRequestTrimNoConvert("GoodsImgArr");
                    string GiftIDArr = PublicClass.FilterRequestTrimNoConvert("GiftIDArr");
                    string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");
                    string GoodsPrice = PublicClass.FilterRequestTrim("GoodsPrice");
                    string StockNum = PublicClass.FilterRequestTrim("StockNum");
                    string PackAfterSaleDesc = PublicClass.FilterRequestTrim("PackAfterSaleDesc");
                    string IsPayDelivery = PublicClass.FilterRequestTrim("IsPayDelivery");
                    string IsShopExpense = PublicClass.FilterRequestTrim("IsShopExpense");
                    string IsOfflinePay = PublicClass.FilterRequestTrim("IsOfflinePay");

                    string IsDistri = PublicClass.FilterRequestTrim("IsDistri");
                    string DistriMoney = PublicClass.FilterRequestTrim("DistriMoney");

                    string MarketPrice = PublicClass.FilterRequestTrim("MarketPrice");
                    string Discount = PublicClass.FilterRequestTrim("Discount");
                    string FtID = PublicClass.FilterRequestTrim("FtID");

                    //是否买家分享返佣 [ false / true ] (订单必须确认收货后，才会进行返佣操作)
                    string IsShareGoods = PublicClass.FilterRequestTrim("IsShareGoods");
                    if (string.IsNullOrWhiteSpace(IsShareGoods))
                    {
                        IsShareGoods = "false";
                    }
                    //是否显示分享商品的返佣金额(返佣金额根据订单抽成进行计算) [ false / true ]
                    string IsShowShareMoney = PublicClass.FilterRequestTrim("IsShowShareMoney");
                    if (string.IsNullOrWhiteSpace(IsShowShareMoney))
                    {
                        IsShowShareMoney = "false";
                    }

                    //防止数字类型为空
                    GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                    GoodsTypeID = PublicClass.preventNumberDataIsNull(GoodsTypeID);
                    ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                    FtID = PublicClass.preventNumberDataIsNull(FtID);
                    GoodsPrice = PublicClass.preventDecimalDataIsNull(GoodsPrice);
                    StockNum = PublicClass.formatNumberRemovePoint(StockNum);
                    DistriMoney = PublicClass.preventDecimalDataIsNull(DistriMoney);
                    ShopGoodsTypeID = PublicClass.preventNumberDataIsNull(ShopGoodsTypeID);
                    MarketPrice = PublicClass.preventDecimalDataIsNull(MarketPrice);
                    Discount = PublicClass.preventDecimalDataIsNull(Discount);

                    //提交商品信息 --API调用方法
                    string _jsonBack = BusiGoods.submitGooGoodsMsgApi(Convert.ToInt64(GoodsID), GoodsMsgGuid, Convert.ToInt64(GoodsTypeID), GoodsTypeNeedProp, GoodsTypeCustomProp, GoodsTitle, GoodsDesc, GoodsSpecTitle, GoodsPropTitle, GoodsImgArr, GiftIDArr, Convert.ToInt64(ShopGoodsTypeID), Convert.ToInt64(ShopUserID), Convert.ToDecimal(GoodsPrice), Convert.ToInt32(StockNum), "", "", PackAfterSaleDesc, IsDistri, Convert.ToDecimal(DistriMoney), "false", IsPayDelivery, IsShopExpense, "false", Convert.ToDecimal(MarketPrice), Convert.ToDecimal(Discount), Convert.ToInt64(FtID), IsOfflinePay, IsShareGoods, IsShowShareMoney);

                    return _jsonBack;
                }
                else if (_exeType == "5") //商品上架下架
                {
                    // 获取传递的参数
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                    //上架下架商品信息  --API调用方法
                    string _unsaleBack = BusiGoods.unSaleGooGoodsMsgApi(Convert.ToInt64(GoodsID), IsUnSale, Convert.ToInt64(ShopUserID));
                    return _unsaleBack;
                }
                else if (_exeType == "6") //初始化指定字段的商品信息
                {
                    // 获取传递的参数
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    //得到没有规格属性时的库存和价格
                    return BusiGoods.initGooGoodsMsgFixFieldApi(Convert.ToInt64(GoodsID));
                }
                else if (_exeType == "12") // 初始化订购下单信息[商家，商品，运费,默认优惠券，配送方式]等
                {
                    //获取传递的参数
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                    string OrderNum = PublicClass.FilterRequestTrim("OrderNum");
                    string SpecID = PublicClass.FilterRequestTrim("SpecID");
                    string RegionProCode = PublicClass.FilterRequestTrim("RegionProCode");

                    //防止数字为空
                    GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                    BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                    OrderNum = PublicClass.preventNumberDataIsNull(OrderNum);
                    SpecID = PublicClass.preventNumberDataIsNull(SpecID);

                    //初始化订购下单信息[商家，商品，运费,默认优惠券，配送方式]等 ---API调用方法
                    string _jsonBack = BusiGoods.initOrderGoodsMsgApi(Convert.ToInt64(GoodsID), Convert.ToInt64(BuyerUserID), Convert.ToInt32(OrderNum), Convert.ToInt64(SpecID), RegionProCode);
                    return _jsonBack;
                }
                else if (_exeType == "13") //初始化商家商品列表信息--多商家多商品确认订单
                {
                    //获取传递的 ScartIDOrderNumArr 得到购物车信息ID 与之对应的  订购数量 拼接字符串 [ SCartID _ OrderNum ^ SCartID _ OrderNum]
                    string ScartIDOrderNumArr = PublicClass.FilterRequestTrim("ScartIDOrderNumArr");
                    ScartIDOrderNumArr = PublicClass.RemoveFrontAndBackChar(ScartIDOrderNumArr, "^");


                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                    //收货地址省份值
                    string RegionProCode = PublicClass.FilterRequestTrim("RegionProCode");


                    //防止数字类型为空
                    BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                    //多店铺多商品  初始化订购下单信息[商家，商品，运费,默认优惠券，配送方式]等 ---API调用方法
                    string _jsonBack = BusiGoods.initOrderGoodsMsgListApi(ScartIDOrderNumArr, Convert.ToInt64(BuyerUserID), RegionProCode);


                    return _jsonBack;
                }
                else if (_exeType == "15") //保存商品价格与库存，没有规格的情况
                {
                    //获取传递的参数
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    string GoodsPrice = PublicClass.FilterRequestTrim("GoodsPrice");
                    string StockNum = PublicClass.FilterRequestTrim("StockNum");

                    //防止数字为空
                    ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                    GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                    GoodsPrice = PublicClass.preventNumberDataIsNull(GoodsPrice);
                    StockNum = PublicClass.preventNumberDataIsNull(StockNum);

                    //保存商品价格与库存，没有规格属性的情况  --API调用方法 
                    string _jsonBack = BusiGoods.saveGoodsPriceStockNoSpecApi(Convert.ToInt64(GoodsID), Convert.ToDecimal(GoodsPrice), Convert.ToInt32(StockNum), Convert.ToInt64(ShopUserID));
                    return _jsonBack;
                }
                else if (_exeType == "17") //批量切换 - 商家是否推荐商品
                {
                    // 获取传递的参数
                    string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");
                    string IsShopCommend = PublicClass.FilterRequestTrim("IsShopCommend");
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                    //防止数字为空
                    ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                    string _jsonBack = BusiGoods.tglGoodsShopCommendArrApi(GoodsIDArr, IsShopCommend, Convert.ToInt64(ShopUserID));
                    return _jsonBack;
                }
                else if (_exeType == "18") //搜索分页数据视图-商品信息-店铺信息
                {
                    // 获取传递的参数
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                    string GoodsTitle = PublicClass.FilterRequestTrim("GoodsTitle");
                    string ShopID = PublicClass.FilterRequestTrim("ShopID");
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                    string GoodsPrice = PublicClass.FilterRequestTrim("GoodsPrice");
                    string StockNum = PublicClass.FilterRequestTrim("StockNum");
                    string GoodsStatus = PublicClass.FilterRequestTrim("GoodsStatus");
                    string IsSpecParam = PublicClass.FilterRequestTrim("IsSpecParam");
                    string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");
                    string IsPayDelivery = PublicClass.FilterRequestTrim("IsPayDelivery");
                    string IsShopExpense = PublicClass.FilterRequestTrim("IsShopExpense");
                    string IsOfflinePay = PublicClass.FilterRequestTrim("IsOfflinePay");
                    string GoodsCheckReason = PublicClass.FilterRequestTrim("GoodsCheckReason");
                    string IsLock = PublicClass.FilterRequestTrim("IsLock");
                    string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                    string ShopName = PublicClass.FilterRequestTrim("ShopName");

                    //获取当前页数
                    string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                    //防止数字类型为空
                    GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                    GoodsTypeID = PublicClass.preventNumberDataIsNull(GoodsTypeID);
                    ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                    ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                    GoodsPrice = PublicClass.preventDecimalDataIsNull(GoodsPrice);
                    StockNum = PublicClass.preventNumberDataIsNull(StockNum);

                    //----用实体类去限制的查询条件 AND 连接 视图-----//
                    ModelV_GoodsMsg_ShopMsg _modelV_GoodsMsg_ShopMsg = ModelV_GoodsMsg_ShopMsg.initModelView();
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.GoodsID = Convert.ToInt64(GoodsID);
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.GoodsTypeID = Convert.ToInt64(GoodsTypeID);
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.GoodsTitle = GoodsTitle;
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.ShopID = Convert.ToInt64(ShopID);
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.GoodsPrice = Convert.ToDecimal(GoodsPrice);
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.StockNum = Convert.ToInt32(StockNum);
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.GoodsStatus = GoodsStatus;
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.IsSpecParam = IsSpecParam;
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.IsUnSale = IsUnSale;
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.IsPayDelivery = IsPayDelivery;
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.IsShopExpense = IsShopExpense;
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.IsOfflinePay = IsOfflinePay;
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.GoodsCheckReason = GoodsCheckReason;
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.IsLock = IsLock;
                    _modelV_GoodsMsg_ShopMsg.ModelGooGoodsMsg.WriteDate = WriteDate;
                    _modelV_GoodsMsg_ShopMsg.ModelShopMsg.ShopName = ShopName;

                    // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                    string _initSQLCharWhere = "";

                    //获取分页JSON数据字符串
                    //显示的字段值
                    string[] _showFieldArr = { "PageOrder", "ShopMobile", "SendMobile", "RegionCodeArr", "RegionNameArr", "DetailAddr", "ShopDesc", "LinkMan", "PackAfterSaleDesc", "GoodsTypeNeedProp", "GoodsTypeCustomProp", "GoodsDesc" };
                    string _strJson = BusiJsonPageStr.morePageJSONV_GoodsMsg_ShopMsg(_modelV_GoodsMsg_ShopMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                    //输出前台显示代码
                    return _strJson;

                }
                else if (_exeType == "19") //审核商品信息
                {
                    //获取传递的参数
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    string GoodsStatus = PublicClass.FilterRequestTrim("GoodsStatus");
                    string GoodsCheckReason = PublicClass.FilterRequestTrim("GoodsCheckReason");

                    //防止数字为空
                    GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);

                    string _jsonBack = BusiGoods.checkGoodsMsgApi(Convert.ToInt64(GoodsID), GoodsStatus, GoodsCheckReason);
                    return _jsonBack;
                }
                else if (_exeType == "20") //锁定与解锁 商品信息
                {
                    //获取传递的参数
                    string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");
                    string IsLock = PublicClass.FilterRequestTrim("IsLock");

                    string _jsonBack = BusiGoods.lockGoodsMsgArrApi(GoodsIDArr, IsLock);
                    return _jsonBack;
                }
                else if (_exeType == "21") //加载商品详情信息-视图(后台CMS)
                {
                    //获取传递的参数
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                    //防止数字为空
                    GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);

                    string _jsonBack = BusiGoods.loadGoodsDetailViewCMSApi(Convert.ToInt64(GoodsID));
                    return _jsonBack;
                }
                else if (_exeType == "23") //批量删除商品信息
                {
                    //获取传递的参数
                    string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                    //防止数字为空
                    ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                    string _jsonBack = BusiGoods.delGoodsMsgArrApi(GoodsIDArr, Convert.ToInt64(ShopUserID));
                    return _jsonBack;
                }
            }

            return "";
        }

        /// <summary>
        /// 商品图片信息
        /// </summary>
        /// <returns></returns>
        public string GooGoodsImg()
        {
            //获取操作类型  Type=1 搜索分页数据 Type=2 删除商品ID的商品图片信息 Type=3 删除UploadGuid的商品图片信息 Type=4 批量删除商品图片信息 Type=5 加载商品图片列表
            string _exeType = PublicClass.FilterRequestTrim("Type");
            //无需进行签名验证
            if (_exeType == "5")
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                //防止数字类型为空
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);

                //加载商品的图片列表 --API调用方法
                string _jsonBack = "{" + BusiGoods.loadGoodsImgListApi(Convert.ToInt64(GoodsID)) + "}";
                return _jsonBack;

            }
            else //需要进行签名验证的操作
            {
                //验证RndKeyRsa是否正确
                bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
                if (_verifySu == false)
                {
                    return "";
                }

                if (_exeType == "1") //搜索分页数据
                {
                    // 获取传递的参数
                    string GoodsImgID = PublicClass.FilterRequestTrim("GoodsImgID");
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    string ImgPath = PublicClass.FilterRequestTrim("ImgPath");
                    string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                    string IsLock = PublicClass.FilterRequestTrim("IsLock");
                    string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                    //获取当前页数
                    string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                    //防止数字类型为空
                    GoodsImgID = PublicClass.preventNumberDataIsNull(GoodsImgID);
                    GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                    ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                    //------------用实体类去限制的查询条件 AND 连接------------//
                    ModelGooGoodsImg _modelGooGoodsImg = new ModelGooGoodsImg();
                    _modelGooGoodsImg.GoodsImgID = Convert.ToInt64(GoodsImgID);
                    _modelGooGoodsImg.GoodsID = Convert.ToInt64(GoodsID);
                    _modelGooGoodsImg.ImgPath = ImgPath;
                    _modelGooGoodsImg.UploadGuid = UploadGuid;
                    _modelGooGoodsImg.ShopUserID = Convert.ToInt64(ShopUserID);
                    _modelGooGoodsImg.IsLock = IsLock;
                    _modelGooGoodsImg.WriteDate = WriteDate;


                    // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                    string _initSQLCharWhere = "";

                    //获取分页JSON数据字符串
                    //显示的字段值
                    string[] _showFieldArr = { "PageOrder", "ShopUserID", "IsLock", "WriteDate" };
                    string _strJson = BusiJsonPageStr.morePageJSONGooGoodsImg(_modelGooGoodsImg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                    //输出前台显示代码
                    return _strJson;
                }
                else if (_exeType == "2") //删除商品ID的商品图片信息
                {
                    //获取传递的参数
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                    //删除指定商品ID的商品图片文件和信息
                    string _jsonBack = BusiGoods.delGooGoodsImgsApi(Convert.ToInt64(GoodsID), Convert.ToInt64(ShopUserID));
                    return _jsonBack;
                }
                else if (_exeType == "3") //删除UploadGuid的商品图片信息
                {
                    //获取传递的参数
                    string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                    //删除指定商品ID的商品图片文件和信息
                    string _jsonBack = BusiGoods.delGooGoodsImgApi(0, UploadGuid, Convert.ToInt64(ShopUserID));
                    return _jsonBack;
                }
                else if (_exeType == "4") //批量删除商品图片信息
                {
                    //获取传递的参数
                    string GoodsImgIDArr = PublicClass.FilterRequestTrim("GoodsImgIDArr");
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                    string _jsonBack = BusiGoods.delGooGoodsImgsArrApi(GoodsImgIDArr, Convert.ToInt64(ShopUserID));
                    return _jsonBack;
                }
            }


            return "";

        }

        /// <summary>
        /// 商品类目
        /// </summary>
        /// <returns></returns>
        public string GooGoodsType()
        {
            //获取操作类型  Type=1 搜索分页数据 Type=2 添加商品类目 Type=3 编辑商品类目 Type=4 删除商品类目 Type=5 开关 显示与锁定操作 
            //Type=6 加载指定类目级别的类目列表  Type=7 初始化类目信息 Type=8 开关锁定 Type=9 单个或批量删除类目 Type=10 保存上传类目图片信息 Type=11 加载子级类目信息 指定父级类目ID  Type= 12 加载第二级商品类目,主要用于手机端(分类显示页) 并SortNum排序 Type=13 加载第三级商品类目,根据第二级类目ID,主要用于手机端(分类显示页) 并SortNum排序 Type=14 根据第三级商品类目ID,加载所有同级的商品类目信息
            string _exeType = PublicClass.FilterRequestTrim("Type");

            // 加载第二级商品类目,主要用于手机端(分类显示页) 并SortNum排序
            if (_exeType == "12")
            {
                // 获取传递的参数
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string _jsonBack = BusiGoods.loadGoodsTypeSecLevelWapApi(IsEntity);
                return _jsonBack;
            }
            //加载第三级商品类目,根据第二级类目ID,主要用于手机端(分类显示页) 并SortNum排序
            else if (_exeType == "13")
            {
                // 获取传递的参数
                string GoodsTypeIDSec = PublicClass.FilterRequestTrim("GoodsTypeIDSec");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //防止数字类型为空
                GoodsTypeIDSec = PublicClass.preventNumberDataIsNull(GoodsTypeIDSec);

                string _jsonBack = BusiGoods.loadGoodsTypeThirdLevelBySecWapApi(Convert.ToInt64(GoodsTypeIDSec), IsEntity);
                return _jsonBack;
            }
            else if (_exeType == "14") //根据第三级商品类目ID,加载所有同级的商品类目信息
            {
                // 获取传递的参数
                string GoodsTypeIDThird = PublicClass.FilterRequestTrim("GoodsTypeIDThird");
                //是否为实体店分类 [ false / true]
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");


                //防止数字类型为空
                GoodsTypeIDThird = PublicClass.preventNumberDataIsNull(GoodsTypeIDThird);

                string _jsonBack = BusiGoods.loadListGoodsTypeThirdByThirdApi(Convert.ToInt64(GoodsTypeIDThird), IsEntity);
                return _jsonBack;
            }

            //----------验证RndKeyRsa是否正确------------//
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            if (_exeType == "1") //搜索分页数据
            {
                // 获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string GoodsTypeName = PublicClass.FilterRequestTrim("GoodsTypeName");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string TypeIcon = PublicClass.FilterRequestTrim("TypeIcon");
                string TypeLevel = PublicClass.FilterRequestTrim("TypeLevel");
                string GoodsTypeMemo = PublicClass.FilterRequestTrim("GoodsTypeMemo");
                string LinkURL = PublicClass.FilterRequestTrim("LinkURL");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                GoodsTypeID = PublicClass.preventNumberDataIsNull(GoodsTypeID);
                FatherTypeID = PublicClass.preventNumberDataIsNull(FatherTypeID);
                TypeLevel = PublicClass.preventNumberDataIsNull(TypeLevel);
                SortNum = PublicClass.preventNumberDataIsNull(SortNum);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelGooGoodsType _modelGooGoodsType = new ModelGooGoodsType();
                _modelGooGoodsType.GoodsTypeID = Convert.ToInt64(GoodsTypeID);
                _modelGooGoodsType.GoodsTypeName = GoodsTypeName;
                _modelGooGoodsType.FatherTypeID = Convert.ToInt64(FatherTypeID);
                _modelGooGoodsType.TypeIcon = TypeIcon;
                _modelGooGoodsType.TypeLevel = Convert.ToInt32(TypeLevel);
                _modelGooGoodsType.GoodsTypeMemo = GoodsTypeMemo;
                _modelGooGoodsType.LinkURL = LinkURL;
                _modelGooGoodsType.SortNum = Convert.ToInt32(SortNum);
                _modelGooGoodsType.IsEntity = IsEntity;
                _modelGooGoodsType.IsShow = IsShow;
                _modelGooGoodsType.IsLock = IsLock;
                _modelGooGoodsType.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONGooGoodsType(_modelGooGoodsType, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms", "SortNum DESC,PageOrder DESC");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加商品类目 
            {
                //获取传递参数
                string GoodsTypeName = PublicClass.FilterRequestTrim("GoodsTypeName");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string TypeIcon = PublicClass.FilterRequestTrim("TypeIcon");
                string TypeLevel = PublicClass.FilterRequestTrim("TypeLevel");
                string GoodsTypeMemo = PublicClass.FilterRequestTrim("GoodsTypeMemo");
                string LinkURL = PublicClass.FilterRequestTrim("LinkURL");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");

                //添加 商品类目
                return BusiGoods.addGooGoodsTypeApi(GoodsTypeName, Convert.ToInt64(FatherTypeID), TypeIcon, Convert.ToInt32(TypeLevel), GoodsTypeMemo, LinkURL, Convert.ToInt32(SortNum), IsEntity, IsLock, IsShow, ImgKeyGuid);
            }
            else if (_exeType == "3") //编辑商品类目
            {
                //获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string GoodsTypeName = PublicClass.FilterRequestTrim("GoodsTypeName");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string TypeIcon = PublicClass.FilterRequestTrim("TypeIcon");
                string TypeLevel = PublicClass.FilterRequestTrim("TypeLevel");
                string GoodsTypeMemo = PublicClass.FilterRequestTrim("GoodsTypeMemo");
                string LinkURL = PublicClass.FilterRequestTrim("LinkURL");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //编辑 商品类目
                return BusiGoods.editGooGoodsTypeApi(Convert.ToInt64(GoodsTypeID), GoodsTypeName, Convert.ToInt64(FatherTypeID), TypeIcon, Convert.ToInt32(TypeLevel), GoodsTypeMemo, LinkURL, Convert.ToInt32(SortNum), IsShow, IsLock, IsEntity);
            }
            else if (_exeType == "4") //删除商品类目 
            {
                //获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                //删除 商品类目
                return BusiGoods.delGooGoodsTypeApi(Convert.ToInt64(GoodsTypeID));
            }
            else if (_exeType == "5") //开关 显示与锁定操作 
            {
                //获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string ExeType = PublicClass.FilterRequestTrim("ExeType");
                string ExeValue = PublicClass.FilterRequestTrim("ExeValue");

                //开关 显示与锁定操作
                return BusiGoods.toggleShowLockGooGoodsTypeApi(Convert.ToInt64(GoodsTypeID), ExeType, ExeValue);
            }
            //加载指定类目级别的类目列表 
            else if (_exeType == "6")
            {
                //获取传递的参数
                string TypeLevel = PublicClass.FilterRequestTrim("TypeLevel");

                //加载指定类目级别的类目列表 
                return BusiGoods.loadFatherGoodsTypeIDAndNameListApi(Convert.ToInt32(TypeLevel));
            }
            // 初始化类目信息
            else if (_exeType == "7")
            {
                //获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");

                //得到 商品类目信息 根据GoodsTypeID
                ModelGooGoodsType _modelGooGoodsType = BusiGetData.getModelGoodsType(Convert.ToInt64(GoodsTypeID));
                if (_modelGooGoodsType != null)
                {
                    //将Model转换成功Json
                    return PublicClass.ConvertModelToJson(_modelGooGoodsType);
                }
            }
            //开关锁定
            else if (_exeType == "8")
            {
                //获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                //开关 锁定 信息
                return BusiGoods.toggleLockGooGoodsTypeApi(Convert.ToInt64(GoodsTypeID));
            }
            //单个或批量删除类目
            else if (_exeType == "9")
            {
                //获取传递的参数
                //类目ID拼接字符串 用 “^”隔开
                string GoodsTypeIDArr = PublicClass.FilterRequestTrim("GoodsTypeIDArr");
                //批量删除 商品类目 
                return BusiGoods.delGooGoodsTypeArrApi(GoodsTypeIDArr);
            }
            //保存上传图片信息
            else if (_exeType == "10")
            {
                //获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string ImgPathDomain = PublicClass.FilterRequestTrimNoConvert("ImgPathDomain");

                //保存上传的类目图片信息 ---API调用方法
                return BusiGoods.saveUploadImgGooGoodsTypeApi(Convert.ToInt64(GoodsTypeID), ImgPathDomain);
            }
            //加载子级类目信息列表 指定父级类目ID
            else if (_exeType == "11")
            {
                //获取传递的参数
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //得到商品类目的子类目列表
                List<ModelGooGoodsType> _listModelGooGoodsType = BusiGetData.getListModelGoodsTypeSub(Convert.ToInt64(FatherTypeID), IsLock);
                //构造Json字符串
                string _backJson = BusiJsonBuilder.jsonListModel(_listModelGooGoodsType.OfType<object>().ToList(), "GoodsTypeSubList", true, new string[] { "GoodsTypeID", "GoodsTypeName" }, false);
                return _backJson;
            }


            return "";
        }

        /// <summary>
        /// 商品类目必填属性
        /// </summary>
        /// <returns></returns>
        public string GooGoodsTypeNeedProp()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加商品类目必填属性 Type=3 编辑商品类目必填属性 Type=4 删除商品类目必填属性 Type=5 加载指定类目ID的必须类目属性 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string GtPropID = PublicClass.FilterRequestTrim("GtPropID");
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string PropName = PublicClass.FilterRequestTrim("PropName");
                string PropValue = PublicClass.FilterRequestTrim("PropValue");
                string InputType = PublicClass.FilterRequestTrim("InputType");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                GtPropID = PublicClass.preventNumberDataIsNull(GtPropID);
                GoodsTypeID = PublicClass.preventNumberDataIsNull(GoodsTypeID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelGooGoodsTypeNeedProp _modelGooGoodsTypeNeedProp = new ModelGooGoodsTypeNeedProp();
                _modelGooGoodsTypeNeedProp.GtPropID = Convert.ToInt64(GtPropID);
                _modelGooGoodsTypeNeedProp.GoodsTypeID = Convert.ToInt64(GoodsTypeID);
                _modelGooGoodsTypeNeedProp.PropName = PropName;
                _modelGooGoodsTypeNeedProp.PropValue = PropValue;
                _modelGooGoodsTypeNeedProp.InputType = InputType;
                _modelGooGoodsTypeNeedProp.IsLock = IsLock;
                _modelGooGoodsTypeNeedProp.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONGooGoodsTypeNeedProp(_modelGooGoodsTypeNeedProp, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加商品类目必填属性
            {
                //获取传递参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string PropName = PublicClass.FilterRequestTrim("PropName");
                string PropValue = PublicClass.FilterRequestTrim("PropValue");
                string InputType = PublicClass.FilterRequestTrim("InputType");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //添加 商品类目必填属性
                return BusiGoods.addGooGoodsTypeNeedPropApi(Convert.ToInt64(GoodsTypeID), PropName, PropValue, InputType, IsLock);
            }
            else if (_exeType == "3") //编辑商品类目必填属性
            {
                // 获取传递的参数
                string GtPropID = PublicClass.FilterRequestTrim("GtPropID");
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string PropName = PublicClass.FilterRequestTrim("PropName");
                string PropValue = PublicClass.FilterRequestTrim("PropValue");
                string InputType = PublicClass.FilterRequestTrim("InputType");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //提交商品类目必填属性
                return BusiGoods.editGooGoodsTypeNeedPropApi(Convert.ToInt64(GtPropID), Convert.ToInt64(GoodsTypeID), PropName, PropValue, InputType, IsLock, 0);
            }
            else if (_exeType == "4") //删除商品类目必填属性
            {
                // 获取传递的参数
                string GtPropIDArr = PublicClass.FilterRequestTrim("GtPropIDArr");
                return BusiGoods.delGooGoodsTypeNeedPropArrApi(GtPropIDArr);
            }
            else if (_exeType == "5") //加载指定类目ID的必须类目属性
            {
                // 获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //得到 类目必填属性 列表 根据GoodsTypeID
                List<ModelGooGoodsTypeNeedProp> _listModelGooGoodsTypeNeedProp = BusiGetData.getListModelGooGoodsTypeNeedProp(Convert.ToInt64(GoodsTypeID), IsLock);
                //Model转换Json字符串
                return BusiJsonBuilder.jsonListModel(_listModelGooGoodsTypeNeedProp.OfType<object>().ToList(), "NeedPropArr", true, new string[] { "WriteDate", "PageOrder", "IsLock" });
            }


            return "";
        }

        /// <summary>
        /// 商品无需发货申请
        /// </summary>
        /// <returns></returns>
        public string GooNoSendGoodsApply()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加 商品无需发货申请 Type=3 编辑 商品无需发货申请 Type=4 删除 商品无需发货申请 Type=5 审核 商品无需发货申请 Type=6 锁定/解锁  商品无需发货申请信息 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string NoSendApplyID = PublicClass.FilterRequestTrim("NoSendApplyID");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string GoodsPurpose = PublicClass.FilterRequestTrim("GoodsPurpose");
                string ApplyReason = PublicClass.FilterRequestTrim("ApplyReason");
                string OrderStatusHintTitle = PublicClass.FilterRequestTrim("OrderStatusHintTitle");
                string OrderStatusHintDesc = PublicClass.FilterRequestTrim("OrderStatusHintDesc");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                NoSendApplyID = PublicClass.preventNumberDataIsNull(NoSendApplyID);
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelGooNoSendGoodsApply _modelGooNoSendGoodsApply = new ModelGooNoSendGoodsApply();
                _modelGooNoSendGoodsApply.NoSendApplyID = Convert.ToInt64(NoSendApplyID);
                _modelGooNoSendGoodsApply.GoodsID = Convert.ToInt64(GoodsID);
                _modelGooNoSendGoodsApply.GoodsPurpose = GoodsPurpose;
                _modelGooNoSendGoodsApply.ApplyReason = ApplyReason;
                _modelGooNoSendGoodsApply.OrderStatusHintTitle = OrderStatusHintTitle;
                _modelGooNoSendGoodsApply.OrderStatusHintDesc = OrderStatusHintDesc;
                _modelGooNoSendGoodsApply.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelGooNoSendGoodsApply.IsCheck = IsCheck;
                _modelGooNoSendGoodsApply.CheckReason = CheckReason;
                _modelGooNoSendGoodsApply.IsLock = IsLock;
                _modelGooNoSendGoodsApply.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONGooNoSendGoodsApply(_modelGooNoSendGoodsApply, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加 商品无需发货申请
            {
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string GoodsPurpose = PublicClass.FilterRequestTrim("GoodsPurpose");
                string ApplyReason = PublicClass.FilterRequestTrim("ApplyReason");
                string OrderStatusHintTitle = PublicClass.FilterRequestTrim("OrderStatusHintTitle");
                string OrderStatusHintDesc = PublicClass.FilterRequestTrim("OrderStatusHintDesc");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //添加 商品无需发货申请
                return BusiGoods.addGooNoSendGoodsApplyApi(Convert.ToInt64(GoodsID), GoodsPurpose, ApplyReason, OrderStatusHintTitle, OrderStatusHintDesc, Convert.ToInt64(ShopUserID));
            }
            else if (_exeType == "3") //编辑 商品无需发货申请
            {
                // 获取传递的参数
                string NoSendApplyID = PublicClass.FilterRequestTrim("NoSendApplyID");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string GoodsPurpose = PublicClass.FilterRequestTrim("GoodsPurpose");
                string ApplyReason = PublicClass.FilterRequestTrim("ApplyReason");
                string OrderStatusHintTitle = PublicClass.FilterRequestTrim("OrderStatusHintTitle");
                string OrderStatusHintDesc = PublicClass.FilterRequestTrim("OrderStatusHintDesc");
                //编辑 商品无需发货申请 
                return BusiGoods.editGooNoSendGoodsApplyApi(Convert.ToInt64(NoSendApplyID), Convert.ToInt64(GoodsID), GoodsPurpose, ApplyReason, OrderStatusHintTitle, OrderStatusHintDesc, PublicClass.PageOrderRndNumInt());
            }
            else if (_exeType == "4") //删除 商品无需发货申请
            {
                // 获取传递的参数
                string NoSendApplyID = PublicClass.FilterRequestTrim("NoSendApplyID");
                // 删除 商品无需发货申请信息
                return BusiGoods.delGooNoSendGoodsApplyApi(Convert.ToInt64(NoSendApplyID));
            }
            else if (_exeType == "5") //审核 商品无需发货申请
            {
                // 获取传递的参数
                string NoSendApplyID = PublicClass.FilterRequestTrim("NoSendApplyID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");
                //审核操作 商品无需发货申请信息
                return BusiGoods.checkGooNoSendGoodsApplyApi(Convert.ToInt64(NoSendApplyID), IsCheck, CheckReason);
            }
            else if (_exeType == "6") //锁定/解锁  商品无需发货申请信息 
            {
                // 获取传递的参数
                string NoSendApplyID = PublicClass.FilterRequestTrim("NoSendApplyID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                //锁定/解锁  商品无需发货申请信息 
                return BusiGoods.toggleLockGooNoSendGoodsApplyApi(Convert.ToInt64(NoSendApplyID), IsLock);
            }


            return "";
        }

        /// <summary>
        /// 商品规格属性
        /// </summary>
        /// <returns></returns>
        public string GooSpecParam()
        {
            //获取操作类型  Type=1 搜索分页数据 Type=2 初始化商品规格属性信息 Type=3 保存商品规格属性信息 Type=4 删除所有商品规格属性信息 Type=5 保存 规格，价格，库存窗口  --优化后，不会删除重新插入啦
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "2") //初始化商品规格属性信息
            {
                //获取传递参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //初始化规格属性窗口信息
                string _jsonBack = BusiGoods.initGooSpecParamApi(Convert.ToInt64(GoodsID));
                return _jsonBack;

            }
            else
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
                    string SpecID = PublicClass.FilterRequestTrim("SpecID");
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    string FatherSpecID = PublicClass.FilterRequestTrim("FatherSpecID");
                    string SpecParamVal = PublicClass.FilterRequestTrim("SpecParamVal");
                    string SpecParamImg = PublicClass.FilterRequestTrim("SpecParamImg");
                    string GoodsPrice = PublicClass.FilterRequestTrim("GoodsPrice");
                    string StockNum = PublicClass.FilterRequestTrim("StockNum");
                    string IsLock = PublicClass.FilterRequestTrim("IsLock");
                    string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                    //获取当前页数
                    string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                    //防止数字类型为空
                    SpecID = PublicClass.preventNumberDataIsNull(SpecID);
                    GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                    FatherSpecID = PublicClass.preventNumberDataIsNull(FatherSpecID);
                    GoodsPrice = PublicClass.preventDecimalDataIsNull(GoodsPrice);


                    //------------用实体类去限制的查询条件 AND 连接------------//
                    ModelGooSpecParam _modelGooSpecParam = new ModelGooSpecParam();
                    _modelGooSpecParam.SpecID = Convert.ToInt64(SpecID);
                    _modelGooSpecParam.GoodsID = Convert.ToInt64(GoodsID);
                    _modelGooSpecParam.FatherSpecID = Convert.ToInt64(FatherSpecID);
                    _modelGooSpecParam.SpecParamVal = SpecParamVal;
                    _modelGooSpecParam.SpecParamImg = SpecParamImg;
                    _modelGooSpecParam.GoodsPrice = Convert.ToDecimal(GoodsPrice);
                    _modelGooSpecParam.StockNum = Convert.ToInt32(StockNum);
                    _modelGooSpecParam.IsLock = IsLock;
                    _modelGooSpecParam.WriteDate = WriteDate;


                    // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                    string _initSQLCharWhere = "";

                    //获取分页JSON数据字符串
                    //显示的字段值
                    string[] _showFieldArr = { "PageOrder" };
                    string _strJson = BusiJsonPageStr.morePageJSONGooSpecParam(_modelGooSpecParam, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                    //输出前台显示代码
                    return _strJson;
                }
                else if (_exeType == "3") //保存商品规格属性信息
                {
                    //获取传递参数
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                    string SpecTitle = PublicClass.FilterRequestTrim("SpecTitle");
                    string SpecAttrName = PublicClass.FilterRequestTrim("SpecAttrName");

                    string GoodsSpecPriceStockArr = PublicClass.FilterRequestTrimNoConvert("GoodsSpecPriceStockArr");

                    //保存 商品规格 预写入信息 --API调用方法
                    return BusiGoods.saveGooSpecParamApi(Convert.ToInt64(ShopUserID), Convert.ToInt64(GoodsID), GoodsSpecPriceStockArr, SpecTitle, SpecAttrName);
                }
                else if (_exeType == "4") //删除所有商品规格属性信息
                {
                    //获取传递参数
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                    //删除所有规格属性 根据商品ID
                    string _delBack = BusiGoods.delSpecParamAllApi(Convert.ToInt64(ShopUserID), Convert.ToInt64(GoodsID));
                    return _delBack;
                }
                else if (_exeType == "5") //保存 规格，价格，库存窗口  --优化后，不会删除重新插入啦
                {
                    //获取传递的参数
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    string SpecTitle = PublicClass.FilterRequestTrim("SpecTitle");
                    string SpecAttrName = PublicClass.FilterRequestTrim("SpecAttrName");
                    string GooSpecParamJson = Server.UrlDecode(PublicClass.FilterRequestTrimNoConvert("GooSpecParamJson"));
                    //string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                    //保存修改的规格属性参数信息
                    string _jsonBack = BusiGoods.saveSpecProParamV2Api(Convert.ToInt64(GoodsID), GooSpecParamJson, SpecTitle, SpecAttrName);

                    return _jsonBack;

                }
            }

            return "";
        }

        /// <summary>
        /// 商品规格 预写入信息
        /// </summary>
        /// <returns></returns>
        public string GooSpecParamPre()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 保存 商品规格 预写入信息 Type=2 初始化规格属性窗口信息
            //Type=3 删除所有的规格属性信息 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string MsgGuid = PublicClass.FilterRequestTrim("MsgGuid");
                string GoodsSpecPriceStockArr = PublicClass.FilterRequestTrimNoConvert("GoodsSpecPriceStockArr");
                //保存 商品规格 预写入信息 --API调用方法
                return BusiGoods.saveGooSpecParamPreApi(Convert.ToInt64(ShopUserID), MsgGuid, GoodsSpecPriceStockArr);
            }
            else if (_exeType == "2") //初始化规格属性窗口信息
            {
                //获取传递参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string MsgGuid = PublicClass.FilterRequestTrim("MsgGuid");

                //初始化规格属性窗口信息
                string _jsonBack = BusiGoods.initSpecPropFormWin(Convert.ToInt64(ShopUserID), MsgGuid);
                return _jsonBack;
            }
            else if (_exeType == "3") //删除所有的预写入规格属性信息 
            {
                //获取传递参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string MsgGuid = PublicClass.FilterRequestTrim("MsgGuid");

                //删除用户所有的 预写入价格规格库存信息 --API调用方法
                return BusiGoods.delAllSpecPriceStockApi(Convert.ToInt64(ShopUserID), MsgGuid);
            }

            //规格名称~属性价格~属性库存~ImgKeyGuid~ImgURL

            //$

            //属性名称~属性价格~属性库存~ImgKeyGuid~ImgURL | 属性名称~属性价格~属性库存~ImgKeyGuid~ImgURL

            //^

            //规格名称~属性价格~属性库存~ImgKeyGuid~ImgURL

            //$

            //属性名称~属性价格~属性库存~ImgKeyGuid~ImgURL | 属性名称~属性价格~属性库存~ImgKeyGuid~ImgURL

            return "";
        }

        /// <summary>
        /// 商品规格标题,属性标题
        /// </summary>
        /// <returns></returns>
        public string GooSpecParamName()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加商品规格标题 type=3 编辑商品规格标题 type=4 删除商品规格标题 Type=5 初始化 商品规格属性总标题
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SpecNameID = PublicClass.FilterRequestTrim("SpecNameID");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SpecTitle = PublicClass.FilterRequestTrim("SpecTitle");
                string SpecAttrName = PublicClass.FilterRequestTrim("SpecAttrName");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                SpecNameID = PublicClass.preventNumberDataIsNull(SpecNameID);
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelGooSpecParamName _modelGooSpecParamName = new ModelGooSpecParamName();
                _modelGooSpecParamName.SpecNameID = Convert.ToInt64(SpecNameID);
                _modelGooSpecParamName.GoodsID = Convert.ToInt64(GoodsID);
                _modelGooSpecParamName.SpecTitle = SpecTitle;
                _modelGooSpecParamName.SpecAttrName = SpecAttrName;
                _modelGooSpecParamName.IsLock = IsLock;
                _modelGooSpecParamName.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONGooSpecParamName(_modelGooSpecParamName, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加商品规格标题
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SpecTitle = PublicClass.FilterRequestTrim("SpecTitle");
                string SpecAttrName = PublicClass.FilterRequestTrim("SpecAttrName");
                //添加 商品规格标题信息
                return BusiGoods.addGooSpecParamNameApi(Convert.ToInt64(GoodsID), SpecTitle, SpecAttrName);
            }
            else if (_exeType == "3") //编辑商品规格标题
            {
                // 获取传递的参数
                string SpecNameID = PublicClass.FilterRequestTrim("SpecNameID");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SpecTitle = PublicClass.FilterRequestTrim("SpecTitle");
                string SpecAttrName = PublicClass.FilterRequestTrim("SpecAttrName");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                //编辑 商品规格标题信息
                return BusiGoods.editGooSpecParamNameApi(Convert.ToInt64(SpecNameID), Convert.ToInt64(GoodsID), SpecTitle, SpecAttrName, IsLock);
            }
            else if (_exeType == "4") //删除商品规格标题
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                //删除 商品规格标题
                return BusiGoods.delGooSpecParamNameApi(Convert.ToInt64(GoodsID));
            }
            else if (_exeType == "5") //初始化 商品规格属性总标题
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //初始化 商品规格属性总标题 --API调用方法
                return BusiGoods.initGooSpecParamNameApi(Convert.ToInt64(GoodsID));
            }
            return "";

        }

    }


}