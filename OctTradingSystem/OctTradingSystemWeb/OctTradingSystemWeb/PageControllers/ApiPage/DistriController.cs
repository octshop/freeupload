using BusiApiKeyVerifyNS;
using OctTradingSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


/// <summary>
/// 【分销店铺】相关的API接口控制器
/// </summary>
namespace OctTradingSystemWeb.PageControllers.ApiPage
{
    public class DistriController : Controller
    {
        // GET: Distri
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 分销订单信息
        /// </summary>
        /// <returns></returns>
        public string DistriOrderMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加/编辑信息 Type=3 开关锁定信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string DistriOrderID = PublicClass.FilterRequestTrim("DistriOrderID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string DistriGoodsIDArr = PublicClass.FilterRequestTrim("DistriGoodsIDArr");
                string DistriGoodsMoneyArr = PublicClass.FilterRequestTrim("DistriGoodsMoneyArr");
                string SumDistriMoney = PublicClass.FilterRequestTrim("SumDistriMoney");
                string DistriBuyerUserID = PublicClass.FilterRequestTrim("DistriBuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                DistriOrderID = PublicClass.preventNumberDataIsNull(DistriOrderID);
                OrderID = PublicClass.preventDecimalDataIsNull(OrderID);
                SumDistriMoney = PublicClass.preventDecimalDataIsNull(SumDistriMoney);
                DistriBuyerUserID = PublicClass.preventDecimalDataIsNull(DistriBuyerUserID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelDistriOrderMsg _modelDistriOrderMsg = new ModelDistriOrderMsg();
                _modelDistriOrderMsg.DistriOrderID = Convert.ToInt64(DistriOrderID);
                _modelDistriOrderMsg.OrderID = Convert.ToInt64(OrderID);
                _modelDistriOrderMsg.DistriGoodsIDArr = DistriGoodsIDArr;
                _modelDistriOrderMsg.DistriGoodsMoneyArr = DistriGoodsMoneyArr;
                _modelDistriOrderMsg.SumDistriMoney = Convert.ToDecimal(SumDistriMoney);
                _modelDistriOrderMsg.DistriBuyerUserID = Convert.ToInt64(DistriBuyerUserID);
                _modelDistriOrderMsg.IsLock = IsLock;
                _modelDistriOrderMsg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONDistriOrderMsg(_modelDistriOrderMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加/编辑信息
            {
                // 获取传递的参数
                string DistriOrderID = PublicClass.FilterRequestTrim("DistriOrderID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string DistriGoodsIDArr = PublicClass.FilterRequestTrim("DistriGoodsIDArr");
                string DistriGoodsMoneyArr = PublicClass.FilterRequestTrim("DistriGoodsMoneyArr");
                string SumDistriMoney = PublicClass.FilterRequestTrim("SumDistriMoney");
                string DistriBuyerUserID = PublicClass.FilterRequestTrim("DistriBuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                DistriOrderID = PublicClass.preventNumberDataIsNull(DistriOrderID);
                OrderID = PublicClass.preventDecimalDataIsNull(OrderID);
                SumDistriMoney = PublicClass.preventDecimalDataIsNull(SumDistriMoney);
                DistriBuyerUserID = PublicClass.preventDecimalDataIsNull(DistriBuyerUserID);

                //提交 分销订单信息 --API调用方法
                return BusiDistri.submitDistriOrderMsgApi(Convert.ToInt64(DistriOrderID), Convert.ToInt64(OrderID), DistriGoodsIDArr, DistriGoodsMoneyArr, Convert.ToDecimal(SumDistriMoney), Convert.ToInt64(DistriBuyerUserID), IsLock);
            }
            else if (_exeType == "3") //开关锁定信息
            {
                // 获取传递的参数
                string DistriOrderID = PublicClass.FilterRequestTrim("DistriOrderID");
                //锁定 / 解锁 分销订单信息--API调用方法
                return BusiDistri.lockDistriOrderMsgApi(Convert.ToInt64(DistriOrderID));
            }
            return "";

        }

    }
}