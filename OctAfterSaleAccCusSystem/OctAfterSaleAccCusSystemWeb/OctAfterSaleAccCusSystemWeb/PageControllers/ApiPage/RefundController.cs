using BusiApiKeyVerifyNS;
using OctAfterSaleAccCusNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【退款】API接口控制器
/// </summary>
namespace OctAfterSaleAccCusSystemWeb.PageControllers.ApiPage
{
    public class RefundController : Controller
    {
        // GET: Refund
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 退款申请信息
        /// </summary>
        /// <returns></returns>
        public string RefundApplyMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2 添加/编辑信息 Type=3 锁定/解密信息 Type=4 删除信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string RefundID = PublicClass.FilterRequestTrim("RefundID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SpecID = PublicClass.FilterRequestTrim("SpecID");
                string RefundNum = PublicClass.FilterRequestTrim("RefundNum");
                string RefundType = PublicClass.FilterRequestTrim("RefundType");
                string SendType = PublicClass.FilterRequestTrim("SendType");
                string ReturnMoneyType = PublicClass.FilterRequestTrim("ReturnMoneyType");
                string RefundMoney = PublicClass.FilterRequestTrim("RefundMoney");
                string ApplyStatus = PublicClass.FilterRequestTrim("ApplyStatus");
                string ApplyReason = PublicClass.FilterRequestTrim("ApplyReason");
                string QuestionDesc = PublicClass.FilterRequestTrim("QuestionDesc");
                string BankName = PublicClass.FilterRequestTrim("BankName");
                string BankAcc = PublicClass.FilterRequestTrim("BankAcc");
                string OtherAcc = PublicClass.FilterRequestTrim("OtherAcc");
                string IsWholeOrder = PublicClass.FilterRequestTrim("IsWholeOrder");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string ReplyExplain = PublicClass.FilterRequestTrim("ReplyExplain");
                string OrderTime = PublicClass.FilterRequestTrim("OrderTime");
                string DelayFinishDate = PublicClass.FilterRequestTrim("DelayFinishDate");
                string RefundMemo = PublicClass.FilterRequestTrim("RefundMemo");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                RefundID = PublicClass.preventNumberDataIsNull(RefundID);
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                SpecID = PublicClass.preventNumberDataIsNull(SpecID);
                RefundNum = PublicClass.preventNumberDataIsNull(RefundNum);
                RefundMoney = PublicClass.preventDecimalDataIsNull(RefundMoney);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelRefundApplyMsg _modelRefundApplyMsg = new ModelRefundApplyMsg();
                _modelRefundApplyMsg.RefundID = Convert.ToInt64(RefundID);
                _modelRefundApplyMsg.OrderID = Convert.ToInt64(OrderID);
                _modelRefundApplyMsg.GoodsID = Convert.ToInt64(GoodsID);
                _modelRefundApplyMsg.SpecID = Convert.ToInt64(SpecID);
                _modelRefundApplyMsg.RefundNum = Convert.ToInt32(RefundNum);
                _modelRefundApplyMsg.RefundType = RefundType;
                _modelRefundApplyMsg.SendType = SendType;
                _modelRefundApplyMsg.ReturnMoneyType = ReturnMoneyType;
                _modelRefundApplyMsg.RefundMoney = Convert.ToDecimal(RefundMoney);
                _modelRefundApplyMsg.ApplyStatus = ApplyStatus;
                _modelRefundApplyMsg.ApplyReason = ApplyReason;
                _modelRefundApplyMsg.QuestionDesc = QuestionDesc;
                _modelRefundApplyMsg.BankName = BankName;
                _modelRefundApplyMsg.BankAcc = BankAcc;
                _modelRefundApplyMsg.OtherAcc = OtherAcc;
                _modelRefundApplyMsg.IsWholeOrder = IsWholeOrder;
                _modelRefundApplyMsg.IsCheck = IsCheck;
                _modelRefundApplyMsg.ReplyExplain = ReplyExplain;
                _modelRefundApplyMsg.OrderTime = OrderTime;
                _modelRefundApplyMsg.DelayFinishDate = DelayFinishDate;
                _modelRefundApplyMsg.RefundMemo = RefundMemo;
                _modelRefundApplyMsg.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelRefundApplyMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelRefundApplyMsg.IsLock = IsLock;
                _modelRefundApplyMsg.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONRefundApplyMsg(_modelRefundApplyMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加/编辑信息
            {
                // 获取传递的参数
                string RefundID = PublicClass.FilterRequestTrim("RefundID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SpecID = PublicClass.FilterRequestTrim("SpecID");
                string RefundNum = PublicClass.FilterRequestTrim("RefundNum");
                string RefundType = PublicClass.FilterRequestTrim("RefundType");
                string SendType = PublicClass.FilterRequestTrim("SendType");
                string ReturnMoneyType = PublicClass.FilterRequestTrim("ReturnMoneyType");
                string RefundMoney = PublicClass.FilterRequestTrim("RefundMoney");
                string ApplyStatus = PublicClass.FilterRequestTrim("ApplyStatus");
                string ApplyReason = PublicClass.FilterRequestTrim("ApplyReason");
                string QuestionDesc = PublicClass.FilterRequestTrim("QuestionDesc");
                string BankName = PublicClass.FilterRequestTrim("BankName");
                string BankAcc = PublicClass.FilterRequestTrim("BankAcc");
                string OtherAcc = PublicClass.FilterRequestTrim("OtherAcc");
                string IsWholeOrder = PublicClass.FilterRequestTrim("IsWholeOrder");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string ReplyExplain = PublicClass.FilterRequestTrim("ReplyExplain");
                string OrderTime = PublicClass.FilterRequestTrim("OrderTime");
                string DelayFinishDate = PublicClass.FilterRequestTrim("DelayFinishDate");
                string RefundMemo = PublicClass.FilterRequestTrim("RefundMemo");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //调用 提交 退款申请
                return BusiRefund.submitRefundApplyMsgApi(Convert.ToInt64(RefundID), Convert.ToInt64(OrderID), Convert.ToInt64(GoodsID), Convert.ToInt64(SpecID), Convert.ToInt32(RefundNum), RefundType, SendType, ReturnMoneyType, Convert.ToInt32(RefundMoney), ApplyStatus, ApplyReason, QuestionDesc, Convert.ToInt64(BuyerUserID), Convert.ToInt64(ShopUserID), IsWholeOrder, IsCheck, ReplyExplain, BankName, BankAcc, OtherAcc, OrderTime, DelayFinishDate, RefundMemo);
            }
            else if (_exeType == "3") //锁定/解密信息 
            {
                // 获取传递的参数
                string RefundID = PublicClass.FilterRequestTrim("RefundID");

                //锁定/解锁 退款申请信息 --- API调用方法
                return BusiRefund.lockRefundApplyMsgApi(Convert.ToInt64(RefundID));
            }
            else if (_exeType == "4") //删除信息
            {
                // 获取传递的参数
                string RefundIDArr = PublicClass.FilterRequestTrim("RefundIDArr");

                //删除 退款申请信息 --API调用方法
                return BusiRefund.delAfterSaleSendGoodsArrApi(RefundIDArr);
            }


            return "";
        }

        /// <summary>
        /// 退款收货信息
        /// </summary>
        /// <returns></returns>
        public string RefundDelivery()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2 添加/编辑信息 Type=3 锁定/解密信息 Type=4 删除信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string DeliveryID = PublicClass.FilterRequestTrim("DeliveryID");
                string RefundID = PublicClass.FilterRequestTrim("RefundID");
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string UserType = PublicClass.FilterRequestTrim("UserType");
                string DeliName = PublicClass.FilterRequestTrim("DeliName");
                string Mobile = PublicClass.FilterRequestTrim("Mobile");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                string RegionNameArr = PublicClass.FilterRequestTrim("RegionNameArr");
                string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                DeliveryID = PublicClass.preventNumberDataIsNull(DeliveryID);
                RefundID = PublicClass.preventNumberDataIsNull(RefundID);
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelRefundDelivery _modelRefundDelivery = new ModelRefundDelivery();
                _modelRefundDelivery.DeliveryID = Convert.ToInt64(DeliveryID);
                _modelRefundDelivery.RefundID = Convert.ToInt64(RefundID);
                _modelRefundDelivery.UserID = Convert.ToInt64(UserID);
                _modelRefundDelivery.UserType = UserType;
                _modelRefundDelivery.DeliName = DeliName;
                _modelRefundDelivery.Mobile = Mobile;
                _modelRefundDelivery.RegionCodeArr = RegionCodeArr;
                _modelRefundDelivery.RegionNameArr = RegionNameArr;
                _modelRefundDelivery.DetailAddr = DetailAddr;
                _modelRefundDelivery.IsLock = IsLock;
                _modelRefundDelivery.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONRefundDelivery(_modelRefundDelivery, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加/编辑信息
            {
                // 获取传递的参数
                string DeliveryID = PublicClass.FilterRequestTrim("DeliveryID");
                string RefundID = PublicClass.FilterRequestTrim("RefundID");
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string UserType = PublicClass.FilterRequestTrim("UserType");
                string DeliName = PublicClass.FilterRequestTrim("DeliName");
                string Mobile = PublicClass.FilterRequestTrim("Mobile");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                //RegionNameArr 可以为空
                string RegionNameArr = PublicClass.FilterRequestTrim("RegionNameArr");
                string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                // 提交 退款收货信息
                return BusiRefund.submitRefundDeliveryApi(Convert.ToInt64(DeliveryID), Convert.ToInt64(RefundID), Convert.ToInt64(UserID), UserType, DeliName, Mobile, RegionCodeArr, DetailAddr, RegionNameArr, IsLock);
            }
            else if (_exeType == "3") //锁定/解密信息 
            {
                // 获取传递的参数
                string DeliveryID = PublicClass.FilterRequestTrim("DeliveryID");

                //锁定/解密 退款收货信息 --API调用方法
                return BusiRefund.lockRefundDeliveryApi(Convert.ToInt64(DeliveryID));
            }
            else if (_exeType == "4") //删除信息
            {
                // 获取传递的参数
                string DeliveryIDArr = PublicClass.FilterRequestTrim("DeliveryIDArr");

                //删除 退款收货信息 -- API调用方法
                return BusiRefund.delRefundDeliveryArrApi(DeliveryIDArr);
            }


            return "";
        }

        /// <summary>
        /// 退款发货信息
        /// </summary>
        /// <returns></returns>
        public string RefundSendGoods()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2 添加/编辑信息 Type=3 锁定/解锁信息 Type=4 删除信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string RefundSendID = PublicClass.FilterRequestTrim("RefundSendID");
                string RefundID = PublicClass.FilterRequestTrim("RefundID");
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string UserType = PublicClass.FilterRequestTrim("UserType");
                string SendType = PublicClass.FilterRequestTrim("SendType");
                string ExpressName = PublicClass.FilterRequestTrim("ExpressName");
                string ExpressNumber = PublicClass.FilterRequestTrim("ExpressNumber");
                string SendShopMan = PublicClass.FilterRequestTrim("SendShopMan");
                string TakeShopAddress = PublicClass.FilterRequestTrim("TakeShopAddress");
                string SendTelNumber = PublicClass.FilterRequestTrim("SendTelNumber");
                string SendGoodsMemo = PublicClass.FilterRequestTrim("SendGoodsMemo");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                RefundSendID = PublicClass.preventNumberDataIsNull(RefundSendID);
                RefundID = PublicClass.preventNumberDataIsNull(RefundID);
                UserID = PublicClass.preventNumberDataIsNull(UserID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelRefundSendGoods _modelRefundSendGoods = new ModelRefundSendGoods();
                _modelRefundSendGoods.RefundSendID = Convert.ToInt64(RefundSendID);
                _modelRefundSendGoods.RefundID = Convert.ToInt64(RefundID);
                _modelRefundSendGoods.UserID = Convert.ToInt64(UserID);
                _modelRefundSendGoods.UserType = UserType;
                _modelRefundSendGoods.SendType = SendType;
                _modelRefundSendGoods.ExpressName = ExpressName;
                _modelRefundSendGoods.ExpressNumber = ExpressNumber;
                _modelRefundSendGoods.SendShopMan = SendShopMan;
                _modelRefundSendGoods.TakeShopAddress = TakeShopAddress;
                _modelRefundSendGoods.SendTelNumber = SendTelNumber;
                _modelRefundSendGoods.SendGoodsMemo = SendGoodsMemo;
                _modelRefundSendGoods.IsLock = IsLock;
                _modelRefundSendGoods.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONRefundSendGoods(_modelRefundSendGoods, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加/编辑信息
            {
                // 获取传递的参数
                string RefundSendID = PublicClass.FilterRequestTrim("RefundSendID");
                string RefundID = PublicClass.FilterRequestTrim("RefundID");
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string UserType = PublicClass.FilterRequestTrim("UserType");
                string SendType = PublicClass.FilterRequestTrim("SendType");
                string ExpressName = PublicClass.FilterRequestTrim("ExpressName");
                string ExpressNumber = PublicClass.FilterRequestTrim("ExpressNumber");
                string SendShopMan = PublicClass.FilterRequestTrim("SendShopMan");
                string TakeShopAddress = PublicClass.FilterRequestTrim("TakeShopAddress");
                string SendTelNumber = PublicClass.FilterRequestTrim("SendTelNumber");
                string SendGoodsMemo = PublicClass.FilterRequestTrim("SendGoodsMemo");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                // 提交 退款发货信息 -- API调用方法
                return BusiRefund.submitRefundSendGoodsApi(Convert.ToInt64(RefundSendID), Convert.ToInt64(RefundID), Convert.ToInt64(UserID), UserType, SendType, ExpressName, ExpressNumber, SendShopMan, TakeShopAddress, SendTelNumber, SendGoodsMemo, IsLock);
            }
            else if (_exeType == "3") //锁定/解锁信息 
            {
                // 获取传递的参数
                string RefundSendID = PublicClass.FilterRequestTrim("RefundSendID");
                //锁定/解密 退款发货信息 -- API调用方法
                return BusiRefund.lockRefundSendGoodsApi(Convert.ToInt64(RefundSendID));
            }
            else if (_exeType == "4") //删除信息
            {
                // 获取传递的参数
                string RefundSendIDArr = PublicClass.FilterRequestTrim("RefundSendIDArr");
                //删除 退款发货信息 -- API调用方法
                return BusiRefund.delRefundSendGoodsArrApi(RefundSendIDArr);
            }

            return "";
        }

        /// <summary>
        /// 退款问题图片信息
        /// </summary>
        /// <returns></returns>
        public string RefundProblemImgs()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2 添加/编辑信息 Type=3 删除信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ProImgsID = PublicClass.FilterRequestTrim("ProImgsID");
                string RefundID = PublicClass.FilterRequestTrim("RefundID");
                string ImgPath = PublicClass.FilterRequestTrim("ImgPath");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                ProImgsID = PublicClass.preventNumberDataIsNull(ProImgsID);
                RefundID = PublicClass.preventNumberDataIsNull(RefundID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelRefundProblemImgs _modelRefundProblemImgs = new ModelRefundProblemImgs();
                _modelRefundProblemImgs.ProImgsID = Convert.ToInt64(ProImgsID);
                _modelRefundProblemImgs.RefundID = Convert.ToInt64(RefundID);
                _modelRefundProblemImgs.ImgPath = ImgPath;
                _modelRefundProblemImgs.UploadGuid = UploadGuid;
                _modelRefundProblemImgs.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelRefundProblemImgs.IsLock = IsLock;
                _modelRefundProblemImgs.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONRefundProblemImgs(_modelRefundProblemImgs, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加/编辑信息
            {
                // 获取传递的参数
                string ProImgsID = PublicClass.FilterRequestTrim("ProImgsID");
                string RefundID = PublicClass.FilterRequestTrim("RefundID");
                string ImgPath = PublicClass.FilterRequestTrim("ImgPath");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //提交 退款问题图片信息 --API调用方法
                return BusiRefund.submitRefundProblemImgsApi(Convert.ToInt64(ProImgsID), Convert.ToInt64(RefundID), ImgPath, UploadGuid, Convert.ToInt64(BuyerUserID), IsLock);
            }
            else if (_exeType == "3") //删除信息
            {
                // 获取传递的参数
                string ProImgsIDArr = PublicClass.FilterRequestTrim("ProImgsIDArr");
                //删除 退款问题图片信息 -- API调用方法
                return BusiRefund.delRefundProblemImgsArrApi(ProImgsIDArr);
            }


            return "";
        }


    }
}