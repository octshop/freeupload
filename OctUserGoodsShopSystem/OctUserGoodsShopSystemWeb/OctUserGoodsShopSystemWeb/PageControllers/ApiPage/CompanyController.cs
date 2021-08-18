using BusiApiKeyVerifyNS;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【公司】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class CompanyController : Controller
    {
        // GET: Company
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 公司信息
        /// </summary>
        /// <returns></returns>
        public string CompanyMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加或编辑公司信息 Type=3 初始化公司信息 有附加信息 Type=4 锁定/解锁 公司信息 Type=5 审核公司信息  Type=6 初始化公司信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string CreditCode = PublicClass.FilterRequestTrim("CreditCode");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string RegAddress = PublicClass.FilterRequestTrim("RegAddress");
                string LegalPerson = PublicClass.FilterRequestTrim("LegalPerson");
                string BusiScope = PublicClass.FilterRequestTrim("BusiScope");
                string SetUpDate = PublicClass.FilterRequestTrim("SetUpDate");
                string RegMoney = PublicClass.FilterRequestTrim("RegMoney");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                CompanyID = PublicClass.preventNumberDataIsNull(CompanyID);
                RegMoney = PublicClass.preventDecimalDataIsNull(RegMoney);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelCompanyMsg _modelCompanyMsg = new ModelCompanyMsg();
                _modelCompanyMsg.CompanyID = Convert.ToInt64(CompanyID);
                _modelCompanyMsg.CreditCode = CreditCode;
                _modelCompanyMsg.CompanyName = CompanyName;
                _modelCompanyMsg.RegAddress = RegAddress;
                _modelCompanyMsg.LegalPerson = LegalPerson;
                _modelCompanyMsg.BusiScope = BusiScope;
                _modelCompanyMsg.SetUpDate = SetUpDate;
                _modelCompanyMsg.RegMoney = Convert.ToInt32(RegMoney);
                _modelCompanyMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelCompanyMsg.IsCheck = IsCheck;
                _modelCompanyMsg.IsLock = IsLock;
                _modelCompanyMsg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONCompanyMsg(_modelCompanyMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加或编辑公司信息
            {
                // 获取传递的参数
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                string CreditCode = PublicClass.FilterRequestTrim("CreditCode");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string RegAddress = PublicClass.FilterRequestTrim("RegAddress");
                string LegalPerson = PublicClass.FilterRequestTrim("LegalPerson");
                string BusiScope = PublicClass.FilterRequestTrim("BusiScope");
                string SetUpDate = PublicClass.FilterRequestTrim("SetUpDate");
                string RegMoney = PublicClass.FilterRequestTrim("RegMoney");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                CompanyID = PublicClass.preventNumberDataIsNull(CompanyID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                if (ShopUserID == "0" || string.IsNullOrWhiteSpace(ShopUserID))
                {
                    ShopUserID = BusiCompany.getShopUserIDByCompanyID(Convert.ToInt64(CompanyID)).ToString();
                }

                //提交 公司信息
                return BusiCompany.submitCompanyMsgApi(Convert.ToInt64(CompanyID), CreditCode, CompanyName, RegAddress, LegalPerson, BusiScope, SetUpDate, Convert.ToInt32(RegMoney), Convert.ToInt64(ShopUserID), UserAccount, IsLock);
            }
            else if (_exeType == "3") //初始化公司信息，有附加信息
            {
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                //防止数字类型为空
                CompanyID = PublicClass.preventNumberDataIsNull(CompanyID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //如果只传ShopUserID没 查询出CompanyID
                if (CompanyID == "0" || string.IsNullOrWhiteSpace(CompanyID))
                {
                    CompanyID = BusiCompany.getCompanyIDShopMsg(Convert.ToInt64(ShopUserID)).ToString();
                }

                //初始化公司信息,有附加信息 --API调用方法
                return BusiCompany.initCompanyMsgApi(Convert.ToInt64(CompanyID), Convert.ToInt64(ShopUserID));
            }
            else if (_exeType == "4") //锁定/解锁 公司信息 
            {
                //获取传递的参数
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");

                //锁定/解锁 公司信息 -- API调用方法
                return BusiCompany.lockCompanyMsgApi(Convert.ToInt64(CompanyID));
            }
            else if (_exeType == "5") //审核公司信息 
            {
                //获取传递的参数
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");

                //审核公司信息 -- API调用方法
                return BusiCompany.checkCompanyMsgApi(Convert.ToInt64(CompanyID), IsCheck, CheckReason);
            }
            else if (_exeType == "6") //初始化公司信
            {
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                //防止数字类型为空
                CompanyID = PublicClass.preventNumberDataIsNull(CompanyID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                if (CompanyID == "0" && ShopUserID == "0")
                {
                    return "";
                }
                ModelCompanyMsg _modelCompanyMsg = BusiGetData.getModelCompanyMsgCS(Convert.ToInt64(CompanyID), Convert.ToInt64(ShopUserID));
                //Model转换Json字符串
                string _jsonCompanyMsg = BusiJsonBuilder.jsonModel(_modelCompanyMsg, true, new string[] { "WriteDate", "PageOrder" });

                return _jsonCompanyMsg;

            }

            return "";
        }

        /// <summary>
        /// 公司证件信息
        /// </summary>
        /// <returns></returns>
        public string CompanyCertificate()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加或编辑公司证件信息 Type=3 删除 单个或批量公司证件信息 Type=4 查询公司所有证件信息 Type=5 删除单个公司证件信息UploadGuid
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string CertID = PublicClass.FilterRequestTrim("CertID");
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string CertType = PublicClass.FilterRequestTrim("CertType");
                string CertImg = PublicClass.FilterRequestTrimNoConvert("CertImg");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                CompanyID = PublicClass.preventNumberDataIsNull(CompanyID);
                CertID = PublicClass.preventDecimalDataIsNull(CertID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelCompanyCertificate _modelCompanyCertificate = new ModelCompanyCertificate();
                _modelCompanyCertificate.CertID = Convert.ToInt64(CertID);
                _modelCompanyCertificate.CompanyID = Convert.ToInt64(CompanyID);
                _modelCompanyCertificate.CertType = CertType;
                _modelCompanyCertificate.CertImg = CertImg;
                _modelCompanyCertificate.IsLock = IsLock;
                _modelCompanyCertificate.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONCompanyCertificate(_modelCompanyCertificate, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加或编辑公司证件信息
            {
                // 获取传递的参数
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string CertType = PublicClass.FilterRequestTrim("CertType");
                string CertImg = PublicClass.FilterRequestTrim("CertImg");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");

                //防止数字类型为空
                CompanyID = PublicClass.preventNumberDataIsNull(CompanyID);

                //提交 公司信息
                return BusiCompany.submitCompanyCertificateApi(Convert.ToInt64(CompanyID), CertType, CertImg, ImgKeyGuid, IsLock);
            }
            else if (_exeType == "3") //删除 单个或批量公司证件信息
            {
                //获取传递过来的参数
                string CertIDArr = PublicClass.FilterRequestTrim("CertIDArr");

                //删除 单个或批量公司证件信息 ---API调用方法
                return BusiCompany.delCompanyCertificateArrApi(CertIDArr);
            }
            else if (_exeType == "4") //查询公司所有证件信息
            {
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //得到公司所有的证件信息 通过 公司ID或商家UserID
                List<ModelCompanyCertificate> _listModelCompanyCertificate = BusiGetData.getListModelCompanyCertificate(Convert.ToInt64(CompanyID), Convert.ToInt64(ShopUserID));
                //Model转Json
                return BusiJsonBuilder.jsonListModel(_listModelCompanyCertificate.OfType<object>().ToList(), "ListCompanyCertificate");
            }
            else if (_exeType == "5") //删除单个公司证件信息UploadGuid
            {
                //获取传递过来的参数
                string CertType = PublicClass.FilterRequestTrim("CertType");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //删除 单个公司证件信息 通过 UploadGuid --- API调用方法
                return BusiCompany.delCompanyCertificateUploadGuidApi(CertType, UploadGuid);
            }

            return "";
        }


    }
}