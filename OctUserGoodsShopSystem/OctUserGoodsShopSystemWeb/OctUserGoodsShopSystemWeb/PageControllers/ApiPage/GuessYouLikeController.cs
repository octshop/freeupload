using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【猜你喜欢商品】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class GuessYouLikeController : Controller
    {

        #region【店铺-猜你喜欢商品】

        /// <summary>
        /// 店铺-猜你喜欢商品
        /// </summary>
        /// <returns></returns>
        public string ShopGuessYouLike()
        {

            //获取操作类型  Type=1  店铺猜你喜欢商品数据搜索分页-手机端 
            string _exeType = PublicClass.FilterRequestTrim("Type");

            //-------------无需要验证签名------------//

            if (_exeType == "1")  //店铺猜你喜欢商品数据搜索分页-手机端 
            {

                //--------获取传递的参数-------//
                //ShopID 和 ShopUserID 必须有一个不能为空
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                //买家UserID
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //商品类目是否为实体店分类,[true , false ]
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");



                //Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
                string PageOrderName = PublicClass.FilterRequestTrim("PageOrderName");
                //是否只加载打折的商品 ( true / false )
                string IsOnlyDiscount = PublicClass.FilterRequestTrim("IsOnlyDiscount");

                string _orderBy = "";

                //排序方式
                if (PageOrderName == "Commend") //推荐
                {
                    _orderBy = "PaidCount DESC,SaleCount DESC,FavGoodsCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "SaleCount") //销量
                {
                    _orderBy = "SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "GoodsPriceAsc") //价格升序
                {
                    _orderBy = "GoodsPrice ASC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "GoodsPriceDesc") //价格降序
                {
                    _orderBy = "GoodsPrice DESC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "WriteDate") //新品
                {
                    _orderBy = "WriteDate DESC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "Discount") //打折
                {
                    _orderBy = "Discount ASC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "GroupMsgCount") //团购
                {
                    _orderBy = "SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "SecKill") //秒杀
                {
                    _orderBy = "CountSecKill ASC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }


                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelVC_GoodsMsg_Search _modelVC_GoodsMsg_Search = new ModelVC_GoodsMsg_Search();
                _modelVC_GoodsMsg_Search.GoodsStatus = "售";
                _modelVC_GoodsMsg_Search.IsLock = "false";
                _modelVC_GoodsMsg_Search.IsUnSale = "false";
                _modelVC_GoodsMsg_Search.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelVC_GoodsMsg_Search.ShopID = Convert.ToInt64(ShopID);
                //商品类目是否为实体店分类,[true , false ]
                _modelVC_GoodsMsg_Search.IsEntity = IsEntity;


                //是否查询团购商品
                if (PageOrderName == "GroupMsgCount")
                {
                    _modelVC_GoodsMsg_Search.GroupMsgCount = 1;
                }
                //是否秒杀
                if (PageOrderName == "SecKill")
                {
                    _modelVC_GoodsMsg_Search.CountSecKill = 1;
                }


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //--------构造查询商品分类 条件------//
                if (BuyerUserID != "0")
                {
                    //买家登录的情况下加载猜你喜欢商品
                    _initSQLCharWhere = BusiGuessYouLike.getShopGuessYouLikeGoodsTypeWhere(Convert.ToInt64(BuyerUserID), Convert.ToInt64(ShopID), Convert.ToInt64(ShopUserID));
                }


                //打折
                if (IsOnlyDiscount == "true")
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND Discount>0";
                }

                //查询秒杀
                if (PageOrderName == "SecKill")
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND GroupMsgCount<=0 AND CountSecKill>=1";
                }

                //如果没有排序则默认 已支付 排序
                if (string.IsNullOrWhiteSpace(PageOrderName))
                {
                    _orderBy = "PaidCount DESC,SaleCount DESC,FavGoodsCount DESC,PageOrder DESC";
                }


                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONVC_GoodsMsg_Search(_modelVC_GoodsMsg_Search, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "wap", _orderBy);

                //输出前台显示代码
                return _strJson;
            }


            return "";
        }

        #endregion

        #region【平台-猜你喜欢商品】

        /// <summary>
        /// 平台-猜你喜欢商品
        /// </summary>
        /// <returns></returns>
        public string MallGuessYouLike()
        {
            //获取操作类型  Type=1  平台猜你喜欢商品数据搜索分页-手机端 
            string _exeType = PublicClass.FilterRequestTrim("Type");

            //-------------无需要验证签名------------//

            if (_exeType == "1")  //平台猜你喜欢商品数据搜索分页-手机端 
            {

                //--------获取传递的参数-------//
                //买家UserID
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //商品类目是否为实体店分类,[true , false ]
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
                string PageOrderName = PublicClass.FilterRequestTrim("PageOrderName");
                //是否只加载打折的商品 ( true / false )
                string IsOnlyDiscount = PublicClass.FilterRequestTrim("IsOnlyDiscount");

                string _orderBy = "";

                //排序方式
                if (PageOrderName == "Commend") //推荐
                {
                    _orderBy = "PaidCount DESC,SaleCount DESC,FavGoodsCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "SaleCount") //销量
                {
                    _orderBy = "SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "GoodsPriceAsc") //价格升序
                {
                    _orderBy = "GoodsPrice ASC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "GoodsPriceDesc") //价格降序
                {
                    _orderBy = "GoodsPrice DESC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "WriteDate") //新品
                {
                    _orderBy = "WriteDate DESC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "Discount") //打折
                {
                    _orderBy = "Discount ASC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "GroupMsgCount") //团购
                {
                    _orderBy = "SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "SecKill") //秒杀
                {
                    _orderBy = "CountSecKill ASC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }


                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelVC_GoodsMsg_Search _modelVC_GoodsMsg_Search = new ModelVC_GoodsMsg_Search();
                _modelVC_GoodsMsg_Search.GoodsStatus = "售";
                _modelVC_GoodsMsg_Search.IsLock = "false";
                _modelVC_GoodsMsg_Search.IsUnSale = "false";

                //商品类目是否为实体店分类,[true , false ]
                _modelVC_GoodsMsg_Search.IsEntity = IsEntity;


                //是否查询团购商品
                if (PageOrderName == "GroupMsgCount")
                {
                    _modelVC_GoodsMsg_Search.GroupMsgCount = 1;
                }
                //是否秒杀
                if (PageOrderName == "SecKill")
                {
                    _modelVC_GoodsMsg_Search.CountSecKill = 1;
                }


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //--------构造查询商品分类 条件------//
                if (BuyerUserID != "0")
                {
                    //买家登录的情况下加载猜你喜欢商品
                    _initSQLCharWhere = BusiGuessYouLike.getGuessYouLikeGoodsTypeWhere(Convert.ToInt64(BuyerUserID));
                }



                //打折
                if (IsOnlyDiscount == "true")
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND Discount>0";
                }

                //查询秒杀
                if (PageOrderName == "SecKill")
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND GroupMsgCount<=0 AND CountSecKill>=1";
                }

                //如果没有排序则默认 已支付 排序
                if (string.IsNullOrWhiteSpace(PageOrderName))
                {
                    _orderBy = "PaidCount DESC,SaleCount DESC,FavGoodsCount DESC,PageOrder DESC";
                }


                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONVC_GoodsMsg_Search(_modelVC_GoodsMsg_Search, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "wap", _orderBy);

                //如果没有查询到推荐喜欢的，则直接去除查询条件,再查询
                try
                {
                    if (string.IsNullOrWhiteSpace(_strJson)) //如果0条也放开条件
                    {
                        _initSQLCharWhere = "";
                        _strJson = BusiJsonPageStr.morePageJSONVC_GoodsMsg_Search(_modelVC_GoodsMsg_Search, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "wap", _orderBy);
                    }
                    else
                    {
                        JObject _jObj = (JObject)JsonConvert.DeserializeObject(_strJson);
                        if (Convert.ToInt32(_jObj["RecordSum"].ToString().Trim()) < 10) //如果小于10条也放开条件
                        {
                            _initSQLCharWhere = "";
                            _strJson = BusiJsonPageStr.morePageJSONVC_GoodsMsg_Search(_modelVC_GoodsMsg_Search, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "wap", _orderBy);
                        }
                    }
                }
                catch { };


                //输出前台显示代码
                return _strJson;
            }


            return "";

        }

        #endregion



    }
}