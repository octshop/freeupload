using OctUserGoodsShopSystemNS;
using PublicClassNS;
using RegionCodeNameNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【商城展示页面】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class MallController : Controller
    {
        /// <summary>
        /// 商城首页 
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            return "";
        }

        /// <summary>
        /// 商品分类显示 -- 二级或三级类目
        /// </summary>
        /// <returns></returns>
        public string GoodsTypeShowSec()
        {
            //获取操作类型  Type=1  商品分类显示搜索商品分页-手机端 
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                // 获取传递的参数 ，必须有一种级别的类目ID，不能两个都为空

                //二级类目ID
                string GoodsTypeIDSec = PublicClass.FilterRequestTrim("GoodsTypeIDSec");

                //三级类目ID
                string GoodsTypeIDThird = PublicClass.FilterRequestTrim("GoodsTypeIDThird");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                GoodsTypeIDSec = PublicClass.preventNumberDataIsNull(GoodsTypeIDSec);
                GoodsTypeIDThird = PublicClass.preventNumberDataIsNull(GoodsTypeIDThird);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelVC_GoodsMsg_Search _modelVC_GoodsMsg_Search = new ModelVC_GoodsMsg_Search();
                _modelVC_GoodsMsg_Search.GoodsStatus = "售";
                _modelVC_GoodsMsg_Search.IsLock = "false";
                _modelVC_GoodsMsg_Search.IsUnSale = "false";


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //-----构造查询关键字 条件------//
                if (string.IsNullOrWhiteSpace(GoodsTypeIDSec) == false && GoodsTypeIDSec != "0")
                {
                    _initSQLCharWhere = BusiMall.splitWhereGoodsTypeThirdBySec(Convert.ToInt64(GoodsTypeIDSec));
                }
                else
                {
                    _initSQLCharWhere = "GoodsTypeID=" + GoodsTypeIDThird;
                }


                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "GoodsID", "GoodsTitle", "ImgPathCover", "GoodsPrice", "Discount", "PaidCount", "GroupMsgCount", "CountSecKill" };
                string _strJson = BusiJsonPageStr.morePageJSONVC_GoodsMsg_Search(_modelVC_GoodsMsg_Search, _pageCurrent, _initSQLCharWhere, _showFieldArr, false, "wap", "PaidCount DESC,SaleCount DESC,CountAppraise DESC,FavGoodsCount DESC,PageOrder DESC");

                //输出前台显示代码
                return _strJson;
            }

            return "";
        }

        /// <summary>
        /// 拼团商品显示
        /// </summary>
        /// <returns></returns>
        public string GroupGoods()
        {
            return "";
        }

        /// <summary>
        /// 秒杀商品显示
        /// </summary>
        /// <returns></returns>
        public string SecKillGoods()
        {
           

            return "";
        }

        /// <summary>
        /// 礼品商品显示
        /// </summary>
        /// <returns></returns>
        public string PresentGoods()
        {
            

            return "";
        }

        /// <summary>
        /// 打折商品显示
        /// </summary>
        /// <returns></returns>
        public string DiscountGoods()
        {
            //获取操作类型  Type=1  折扣搜索商品分页-手机端 Type=2 加载折扣商品显示分类
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1") //折扣搜索商品分页-手机端
            {
                // 获取传递的参数 

                //商品类目ID,也是折扣类目ID，如果为空则加载所有折扣商品信息
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                //排序方式 综合 Syn ，销量 Sale ，价格 PriceAsc,PriceDesc
                string OrderBy = PublicClass.FilterRequestTrim("OrderBy");
                if (string.IsNullOrWhiteSpace(OrderBy))
                {
                    OrderBy = "Syn";
                }

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                GoodsTypeID = PublicClass.preventNumberDataIsNull(GoodsTypeID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelVC_GoodsMsg_Search _modelVC_GoodsMsg_Search = new ModelVC_GoodsMsg_Search();
                _modelVC_GoodsMsg_Search.GoodsStatus = "售";
                _modelVC_GoodsMsg_Search.IsUnSale = "false";
                _modelVC_GoodsMsg_Search.IsLock = "false";

                _modelVC_GoodsMsg_Search.GoodsTypeID = Convert.ToInt64(GoodsTypeID);


                //构造排序字段
                string _orderBy = "";
                //排序方式 综合 Syn ，销量 Sale ，价格 PriceAsc,PriceDesc
                if (OrderBy == "Syn")
                {
                    _orderBy = "PaidCount DESC,SaleCount DESC,PageOrder DESC,GoodsPrice ASC";
                }
                else if (OrderBy == "Sale")
                {
                    _orderBy = "SaleCount DESC,PaidCount DESC,PageOrder DESC,GoodsPrice ASC";
                }
                else if (OrderBy == "PriceAsc") //价格升序
                {
                    _orderBy = "GoodsPrice ASC,PaidCount DESC,PageOrder DESC,SaleCount DESC";
                }
                else if (OrderBy == "PriceDesc") //价格降序
                {
                    _orderBy = "GoodsPrice DESC,PaidCount DESC,PageOrder DESC,SaleCount DESC";
                }


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //-----构造查询关键字 条件------//


                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONVC_GoodsMsg_Search(_modelVC_GoodsMsg_Search, _pageCurrent, _initSQLCharWhere, _showFieldArr, false, "wap", _orderBy);

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //加载折扣商品显示分类
            {
                // 获取传递的参数 
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                string _jsonBack = BusiMall.loadDiscountGoodsTypeApi(IsEntity);
                return _jsonBack;
            }
            return "";
        }

        /// <summary>
        /// 抽奖信息显示
        /// </summary>
        /// <returns></returns>
        public string LuckyDrawMsg()
        {
          

            return "";

        }

        /// <summary>
        /// 活动信息显示
        /// </summary>
        /// <returns></returns>
        public string ActivityMsg()
        {
           

            return "";
        }




    }
}