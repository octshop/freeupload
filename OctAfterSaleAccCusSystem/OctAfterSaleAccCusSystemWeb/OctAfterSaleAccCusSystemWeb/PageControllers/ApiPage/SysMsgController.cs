using BusiApiKeyVerifyNS;
using OctAfterSaleAccCusNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【系统通知信息】API接口控制器
/// </summary>
namespace OctAfterSaleAccCusSystemWeb.PageControllers.ApiPage
{
    public class SysMsgController : Controller
    {

        /// <summary>
        /// 商家系统消息
        /// </summary>
        /// <returns></returns>
        public string ShopSysMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2 添加商家系统消息 Type=3 删除商家系统消息 Type=4  将商家系统消息更改为已读 Type=5 删除几个月以前的通知信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SSysMsgID = PublicClass.FilterRequestTrim("SSysMsgID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");
                string MsgTitle = PublicClass.FilterRequestTrim("MsgTitle");
                string MsgContent = PublicClass.FilterRequestTrim("MsgContent");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string IsRead = PublicClass.FilterRequestTrim("IsRead");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //是否为后台CMS加载数据
                string IsCMSLoad = "false";
                IsCMSLoad = PublicClass.FilterRequestTrim("IsCMSLoad");


                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                SSysMsgID = PublicClass.preventNumberDataIsNull(SSysMsgID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelShopSysMsg _modelShopSysMsg = new ModelShopSysMsg();
                _modelShopSysMsg.SSysMsgID = Convert.ToInt64(SSysMsgID);
                _modelShopSysMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelShopSysMsg.SysMsgType = SysMsgType;
                _modelShopSysMsg.MsgTitle = MsgTitle;
                _modelShopSysMsg.MsgContent = MsgContent;
                _modelShopSysMsg.OrderID = Convert.ToInt64(OrderID);
                _modelShopSysMsg.ExtraData = ExtraData;
                _modelShopSysMsg.IsRead = IsRead;
                _modelShopSysMsg.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONShopSysMsg(_modelShopSysMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //将相应的商家消息通知 更改为“已读”
                if (string.IsNullOrWhiteSpace(_strJson) == false)
                {
                    if (Convert.ToInt64(ShopUserID) > 0 && IsCMSLoad != "true")
                    {
                        BusiSysMsg.readedShopSysMsg("SysMsgType", 0, Convert.ToInt64(ShopUserID), SysMsgType);
                    }
                }

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加商家系统消息
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");
                string MsgTitle = PublicClass.FilterRequestTrim("MsgTitle");
                string MsgContent = PublicClass.FilterRequestTrimNoConvert("MsgContent");
                string ExtraData = PublicClass.FilterRequestTrimNoConvert("ExtraData"); //可以为空
                string OrderID = PublicClass.FilterRequestTrimNoConvert("OrderID"); //可以为空

                //防止数字类型为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);

                //添加商家系统消息 --API方法
                return BusiSysMsg.addShopSysMsgApi(Convert.ToInt64(ShopUserID), SysMsgType, MsgTitle, MsgContent, ExtraData, Convert.ToInt64(OrderID));
            }
            //删除商家系统消息
            else if (_exeType == "3")
            {
                // 获取传递的参数
                string DelType = PublicClass.FilterRequestTrim("DelType"); //删除的类别
                string SSysMsgID = PublicClass.FilterRequestTrim("SSysMsgID"); //根据情况可以为空
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID"); //根据情况可以为空
                // [SSysMsgID 单个删除，SysMsgType删除同类型所有消息]
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType"); //根据情况可以为空

                //防止数字类型为空
                SSysMsgID = PublicClass.preventNumberDataIsNull(SSysMsgID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);


                //删除商家系统消息 --API方法
                return BusiSysMsg.delShopSysMsgApi(DelType, Convert.ToInt64(SSysMsgID), Convert.ToInt64(ShopUserID), SysMsgType);
            }
            //将商家系统消息更改为已读
            else if (_exeType == "4")
            {
                // 获取传递的参数
                string ReadType = PublicClass.FilterRequestTrim("ReadType"); //已读的类别
                string SSysMsgID = PublicClass.FilterRequestTrim("SSysMsgID"); //根据情况可以为空
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID"); //根据情况可以为空
                //[SSysMsgID 单个已读，SysMsgType已读同类型所有消息]
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType"); //根据情况可以为空

                //防止数字类型为空
                SSysMsgID = PublicClass.preventNumberDataIsNull(SSysMsgID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //将商家系统消息更改为已读
                return BusiSysMsg.readedShopSysMsgApi(ReadType, Convert.ToInt64(SSysMsgID), Convert.ToInt64(ShopUserID), SysMsgType);
            }
            else if (_exeType == "5") //删除几个月以前的通知信息
            {
                // 获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //防止数字类型为空
                MonthNumAgo = PublicClass.preventNumberDataIsNull(MonthNumAgo);

                string _jsonBack = BusiSysMsg.delShopSysMsgMonthAgoApi(Convert.ToInt32(MonthNumAgo));
                return _jsonBack;
            }
            return "";
        }

        /// <summary>
        /// 买家系统消息
        /// </summary>
        /// <returns></returns>
        public string BuyerSysMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2 添加买家系统消息 Type=3 删除买家系统消息 Type=4  将买家系统消息更改为已读 Type=5 删除几个月以前的 买家通知信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string BSysMsgID = PublicClass.FilterRequestTrim("BSysMsgID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");
                string MsgTitle = PublicClass.FilterRequestTrim("MsgTitle");
                string MsgContent = PublicClass.FilterRequestTrim("MsgContent");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string IsRead = PublicClass.FilterRequestTrim("IsRead");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                BSysMsgID = PublicClass.preventNumberDataIsNull(BSysMsgID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelBuyerSysMsg _modelBuyerSysMsg = new ModelBuyerSysMsg();
                _modelBuyerSysMsg.BSysMsgID = Convert.ToInt64(_modelBuyerSysMsg.BSysMsgID);
                _modelBuyerSysMsg.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelBuyerSysMsg.SysMsgType = SysMsgType;
                _modelBuyerSysMsg.MsgTitle = MsgTitle;
                _modelBuyerSysMsg.MsgContent = MsgContent;
                _modelBuyerSysMsg.OrderID = Convert.ToInt64(_modelBuyerSysMsg.OrderID);
                _modelBuyerSysMsg.ExtraData = ExtraData;
                _modelBuyerSysMsg.IsRead = IsRead;
                _modelBuyerSysMsg.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONBuyerSysMsg(_modelBuyerSysMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加买家系统消息
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");
                string MsgTitle = PublicClass.FilterRequestTrim("MsgTitle");
                string MsgContent = PublicClass.FilterRequestTrimNoConvert("MsgContent");
                string ExtraData = PublicClass.FilterRequestTrimNoConvert("ExtraData"); //可以为空
                string OrderID = PublicClass.FilterRequestTrimNoConvert("OrderID"); //可以为空

                //防止数字类型为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);

                //添加买家系统消息 --API方法
                return BusiSysMsg.addBuyerSysMsgApi(Convert.ToInt64(BuyerUserID), SysMsgType, MsgTitle, MsgContent, ExtraData, Convert.ToInt64(OrderID));
            }
            //删除买家系统消息
            else if (_exeType == "3")
            {
                // 获取传递的参数
                string DelType = PublicClass.FilterRequestTrim("DelType"); //删除的类别
                string BSysMsgID = PublicClass.FilterRequestTrim("BSysMsgID"); //根据情况可以为空
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID"); //根据情况可以为空
                // [BSysMsgID 单个删除，SysMsgType删除同类型所有消息]
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType"); //根据情况可以为空

                //防止数字类型为空
                BSysMsgID = PublicClass.preventNumberDataIsNull(BSysMsgID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //删除买家系统消息 --API方法
                return BusiSysMsg.delBuyerSysMsgApi(DelType, Convert.ToInt64(BSysMsgID), Convert.ToInt64(BuyerUserID), SysMsgType);
            }
            //将买家系统消息更改为已读
            else if (_exeType == "4")
            {
                // 获取传递的参数
                string ReadType = PublicClass.FilterRequestTrim("ReadType"); //已读的类别
                string BSysMsgID = PublicClass.FilterRequestTrim("BSysMsgID"); //根据情况可以为空
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID"); //根据情况可以为空
                //[SSysMsgID 单个已读，SysMsgType已读同类型所有消息]
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType"); //根据情况可以为空

                //防止数字类型为空
                BSysMsgID = PublicClass.preventNumberDataIsNull(BSysMsgID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //将商家系统消息更改为已读
                return BusiSysMsg.readedBuyerSysMsgApi(ReadType, Convert.ToInt64(BSysMsgID), Convert.ToInt64(BuyerUserID), SysMsgType);
            }
            else if (_exeType == "5") //删除几个月以前的 买家通知信息
            {
                // 获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //防止数字类型为空
                MonthNumAgo = PublicClass.preventNumberDataIsNull(MonthNumAgo);

                string _jsonBack = BusiSysMsg.delBuyerSysMsgMonthAgoApi(Convert.ToInt32(MonthNumAgo));
                return _jsonBack;
            }
            return "";
        }

        /// <summary>
        /// 平台系统消息
        /// </summary>
        /// <returns></returns>
        public string PlatformSysMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2 添加平台系统消息 Type=3 删除平台系统消息  Type=4  将平台系统消息更改为已读 Type=5 删除几个月以前的平台通知信息 Type=6 统计平台通知信息和 系统异常信息 未读总数
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string PSysMsgID = PublicClass.FilterRequestTrim("PSysMsgID");
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");
                string MsgTitle = PublicClass.FilterRequestTrim("MsgTitle");
                string MsgContent = PublicClass.FilterRequestTrim("MsgContent");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string IsRead = PublicClass.FilterRequestTrim("IsRead");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                PSysMsgID = PublicClass.preventNumberDataIsNull(PSysMsgID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelPlatformSysMsg _modelPlatformSysMsg = new ModelPlatformSysMsg();
                _modelPlatformSysMsg.PSysMsgID = Convert.ToInt64(_modelPlatformSysMsg.PSysMsgID);
                _modelPlatformSysMsg.SysMsgType = SysMsgType;
                _modelPlatformSysMsg.MsgTitle = MsgTitle;
                _modelPlatformSysMsg.MsgContent = MsgContent;
                _modelPlatformSysMsg.ExtraData = ExtraData;
                _modelPlatformSysMsg.IsRead = IsRead;
                _modelPlatformSysMsg.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONPlatformSysMsg(_modelPlatformSysMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                if (string.IsNullOrWhiteSpace(_strJson) == false)
                {
                    //将所有平台通知信息更改为【已读】
                    BusiSysMsg.readedAllPlatformSysMsg();
                }

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加平台系统消息
            {
                // 获取传递的参数
                string MsgTitle = PublicClass.FilterRequestTrim("MsgTitle");
                string MsgContent = PublicClass.FilterRequestTrim("MsgContent");
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");

                //调用添加函数
                return BusiSysMsg.addPlatformSysMsgApi(SysMsgType, MsgTitle, MsgContent, ExtraData);
            }
            else if (_exeType == "3") //删除平台系统消息
            {
                // 获取传递的参数
                string DelType = PublicClass.FilterRequestTrim("DelType");
                string PSysMsgID = PublicClass.FilterRequestTrim("PSysMsgID");
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");

                //调用删除函数
                return BusiSysMsg.delPlatformSysMsgApi(DelType, Convert.ToInt64(PSysMsgID), SysMsgType);
            }
            else if (_exeType == "4") //将平台系统消息更改为已读
            {
                // 获取传递的参数
                //已读的类别
                string ReadType = PublicClass.FilterRequestTrim("ReadType");
                //根据情况可以为空
                string PSysMsgID = PublicClass.FilterRequestTrim("PSysMsgID");

                //[PSysMsgID 单个已读，SysMsgType已读同类型所有消息]
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType"); //根据情况可以为空

                //防止数字类型为空
                PSysMsgID = PublicClass.preventNumberDataIsNull(PSysMsgID);

                //将平台系统消息更改为已读
                return BusiSysMsg.readedPlatformSysMsgApi(ReadType, Convert.ToInt64(PSysMsgID), SysMsgType);
            }
            else if (_exeType == "5") //删除几个月以前的平台通知信息
            {
                // 获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //防止数字类型为空
                MonthNumAgo = PublicClass.preventNumberDataIsNull(MonthNumAgo);

                string _jsonBack = BusiSysMsg.delPlatformSysMsgMonthAgoApi(Convert.ToInt32(MonthNumAgo));
                return _jsonBack;
            }
            else if (_exeType == "6") //统计平台通知信息和 系统异常信息 未读总数
            {
                string _jsonBack = BusiSysMsg.countPlatformSystemNoReadApi();
                return _jsonBack;
            }
            return "";
        }

        /// <summary>
        /// 各种系统消息阅读集合，售后，咨询，交易
        /// </summary>
        /// <returns></returns>
        public string ReadAllSysMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1  加载买家端所有的系统消息阅读集合
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");
                string LoadNum = PublicClass.FilterRequestTrim("LoadNum");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                LoadNum = PublicClass.preventNumberDataIsNull(LoadNum);

                string _jsonBack = BusiSysMsg.loadReadAllSysMsgBuyerListApi(Convert.ToInt64(BuyerUserID), SysMsgType, Convert.ToInt32(LoadNum));



                return _jsonBack;

            }

            return "";
        }


    }
}