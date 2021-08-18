using BusiApiKeyVerifyNS;
using OctTradingSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【提现】相关的API接口控制器
/// </summary>
namespace OctTradingSystemWeb.PageControllers.ApiPage
{
    public class WithDrawController : Controller
    {
        /// <summary>
        /// 买家提现信息
        /// </summary>
        /// <returns></returns>
        public string BuyerWithDraw()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据  Type=2 添加买家提现信息,提交提现请求 Type=3 得到最新没有完成的提现信息ID (如果为0则不存在没有处理完成的提现) Type=4 初始化买家提现详细 Type=5 初始化买家提现详细CMS版 Type=6 预加载买家以前最近的提现信息 Type=7 完成买家提现处理 Type=8 微信企业付款到个人，完成买家提现处理 Type=9 转账到支付宝账户，完成买家提现处理
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string WithDrawID = PublicClass.FilterRequestTrim("WithDrawID");
                string SerialNumber = PublicClass.FilterRequestTrim("SerialNumber");
                string ToType = PublicClass.FilterRequestTrim("ToType");
                string WithDrawAmt = PublicClass.FilterRequestTrim("WithDrawAmt");
                string WithDrawStatus = PublicClass.FilterRequestTrim("WithDrawStatus");
                string TrueName = PublicClass.FilterRequestTrim("TrueName");
                string LinkMobile = PublicClass.FilterRequestTrim("LinkMobile");
                string WeChatAccount = PublicClass.FilterRequestTrim("WeChatAccount");
                string AlipayAccount = PublicClass.FilterRequestTrim("AlipayAccount");
                string BankCardNumber = PublicClass.FilterRequestTrim("BankCardNumber");
                string BankAccName = PublicClass.FilterRequestTrim("BankAccName");
                string OpeningBank = PublicClass.FilterRequestTrim("OpeningBank");
                string WithDrawMemo = PublicClass.FilterRequestTrim("WithDrawMemo");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string FinishDate = PublicClass.FilterRequestTrim("FinishDate");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                WithDrawID = PublicClass.preventNumberDataIsNull(WithDrawID);
                WithDrawAmt = PublicClass.preventDecimalDataIsNull(WithDrawAmt);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelBuyerWithDraw _modelBuyerWithDraw = new ModelBuyerWithDraw();
                _modelBuyerWithDraw.WithDrawID = Convert.ToInt64(WithDrawID);
                _modelBuyerWithDraw.SerialNumber = SerialNumber;
                _modelBuyerWithDraw.ToType = ToType;
                _modelBuyerWithDraw.WithDrawAmt = Convert.ToDecimal(WithDrawAmt);
                _modelBuyerWithDraw.WithDrawStatus = WithDrawStatus;
                _modelBuyerWithDraw.TrueName = TrueName;
                _modelBuyerWithDraw.LinkMobile = LinkMobile;
                _modelBuyerWithDraw.WeChatAccount = WeChatAccount;
                _modelBuyerWithDraw.AlipayAccount = AlipayAccount;
                _modelBuyerWithDraw.BankCardNumber = BankCardNumber;
                _modelBuyerWithDraw.BankAccName = BankAccName;
                _modelBuyerWithDraw.OpeningBank = OpeningBank;
                _modelBuyerWithDraw.WithDrawMemo = WithDrawMemo;
                _modelBuyerWithDraw.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelBuyerWithDraw.IsLock = IsLock;
                _modelBuyerWithDraw.FinishDate = FinishDate;
                _modelBuyerWithDraw.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONBuyerWithDraw(_modelBuyerWithDraw, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加买家提现信息,提交提现请求
            {
                // 获取传递的参数
                string ToType = PublicClass.FilterRequestTrim("ToType");
                string WithDrawAmt = PublicClass.FilterRequestTrim("WithDrawAmt");
                string TrueName = PublicClass.FilterRequestTrim("TrueName");
                string LinkMobile = PublicClass.FilterRequestTrim("LinkMobile");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string WeChatAccount = PublicClass.FilterRequestTrim("WeChatAccount");
                string AlipayAccount = PublicClass.FilterRequestTrim("AlipayAccount");
                string BankCardNumber = PublicClass.FilterRequestTrim("BankCardNumber");
                string BankAccName = PublicClass.FilterRequestTrim("BankAccName");
                string OpeningBank = PublicClass.FilterRequestTrim("OpeningBank");
                string WithDrawMemo = PublicClass.FilterRequestTrim("WithDrawMemo");
                //短信验证码
                string SmsVerifyCode = PublicClass.FilterRequestTrim("SmsVerifyCode");


                //防止数字类型为空
                WithDrawAmt = PublicClass.preventDecimalDataIsNull(WithDrawAmt);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiWithDraw.addBuyerWithDrawApi(ToType, Convert.ToDecimal(WithDrawAmt), TrueName, LinkMobile, SmsVerifyCode, Convert.ToInt64(BuyerUserID), WeChatAccount, AlipayAccount, BankCardNumber, BankAccName, OpeningBank, WithDrawMemo);
                return _jsonBack;

            }
            else if (_exeType == "3") //得到最新没有完成的提现信息ID (如果为0则不存在没有处理完成的提现)
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiWithDraw.getRecentNoFinishWithDrawIDApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "4") //初始化买家提现详细
            {
                // 获取传递的参数
                string WithDrawID = PublicClass.FilterRequestTrim("WithDrawID");

                //防止数字类型为空
                WithDrawID = PublicClass.preventNumberDataIsNull(WithDrawID);

                string _jsonBack = BusiWithDraw.initBuyerWithDrawDetailApi(Convert.ToInt64(WithDrawID));
                return _jsonBack;
            }
            else if (_exeType == "5") //初始化买家提现详细CMS版
            {
                // 获取传递的参数
                string WithDrawID = PublicClass.FilterRequestTrim("WithDrawID");

                //防止数字类型为空
                WithDrawID = PublicClass.preventNumberDataIsNull(WithDrawID);

                string _jsonBack = BusiWithDraw.initBuyerWithDrawDetailCMSApi(Convert.ToInt64(WithDrawID));
                return _jsonBack;
            }
            else if (_exeType == "6") //预加载买家以前最近的提现信息
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiWithDraw.loadPreBuyerWithDrawApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "7") //完成买家提现处理
            {
                // 获取传递的参数
                string WithDrawID = PublicClass.FilterRequestTrim("WithDrawID");
                string WithDrawMemo = PublicClass.FilterRequestTrim("WithDrawMemo");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                WithDrawID = PublicClass.preventNumberDataIsNull(WithDrawID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiWithDraw.finishBuyerWithDrawApi(Convert.ToInt64(WithDrawID), WithDrawMemo, Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "8") //微信企业付款到个人，完成买家提现处理 
            {
                // 获取传递的参数
                string WithDrawID = PublicClass.FilterRequestTrim("WithDrawID");
                string WithDrawMemo = PublicClass.FilterRequestTrim("WithDrawMemo");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                WithDrawID = PublicClass.preventNumberDataIsNull(WithDrawID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiWithDraw.sendWxCompanyPayApi(Convert.ToInt64(WithDrawID), WithDrawMemo, Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "9") //转账到支付宝账户，完成买家提现处理
            {
                // 获取传递的参数
                string WithDrawID = PublicClass.FilterRequestTrim("WithDrawID");
                string WithDrawMemo = PublicClass.FilterRequestTrim("WithDrawMemo");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                WithDrawID = PublicClass.preventNumberDataIsNull(WithDrawID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiWithDraw.sendAlipayCompanyTransPersonApi(Convert.ToInt64(WithDrawID), WithDrawMemo, Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }

            return "";
        }


    }
}