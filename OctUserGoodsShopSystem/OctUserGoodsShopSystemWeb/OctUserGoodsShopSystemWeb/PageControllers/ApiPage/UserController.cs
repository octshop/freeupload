using BusiApiKeyVerifyNS;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【会员，账号】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class UserController : Controller
    {
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 会员账号
        /// </summary>
        /// <returns></returns>
        public string UserAccount()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 注册用户账号信息 Type=3 编辑用户账号信息 Type=4 开通店铺锁定账号 Type=5 加载买家用户的 账号，买家信息，余额积分信息(买家中心首页) Type=6 视图_搜索分页数据 Type=7 批量-锁定/解锁会员账号 Type=8 编辑会员账号信息 Type=9 初始化会员账号信息-带-买家信息-店铺信息 Type=10 获取账户微信注册信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string _UserID = PublicClass.FilterRequestTrim("UserID");
                string _UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                string _BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string _CreditScore = PublicClass.FilterRequestTrim("CreditScore");
                string _VipLevel = PublicClass.FilterRequestTrim("VipLevel");
                string _WxOpenID = PublicClass.FilterRequestTrim("WxOpenID");
                string _WxUnionID = PublicClass.FilterRequestTrim("WxUnionID");
                string _Longitude = PublicClass.FilterRequestTrim("Longitude");
                string _Latitude = PublicClass.FilterRequestTrim("Latitude");
                string _AccountMemo = PublicClass.FilterRequestTrim("AccountMemo");
                string _IsOpenShop = PublicClass.FilterRequestTrim("IsOpenShop");
                string _IsLock = PublicClass.FilterRequestTrim("IsLock");
                string _RegDate = PublicClass.FilterRequestTrim("RegDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                _UserID = PublicClass.preventNumberDataIsNull(_UserID);
                _CreditScore = PublicClass.preventNumberDataIsNull(_CreditScore);
                _VipLevel = PublicClass.preventNumberDataIsNull(_VipLevel);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelUserAccount _modelUserAccount = new ModelUserAccount();
                _modelUserAccount.UserID = Convert.ToInt64(_UserID);
                _modelUserAccount.UserAccount = _UserAccount;
                _modelUserAccount.BindMobile = _BindMobile;
                _modelUserAccount.CreditScore = Convert.ToInt32(_CreditScore);
                _modelUserAccount.VipLevel = Convert.ToInt32(_VipLevel);
                _modelUserAccount.WxOpenID = _WxOpenID;
                _modelUserAccount.WxUnionID = _WxUnionID;
                _modelUserAccount.Longitude = _Longitude;
                _modelUserAccount.Latitude = _Latitude;
                _modelUserAccount.AccountMemo = _AccountMemo;
                _modelUserAccount.IsOpenShop = _IsOpenShop;
                _modelUserAccount.IsLock = _IsLock;
                _modelUserAccount.RegDate = _RegDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONUserAccount(_modelUserAccount, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //注册用户账号信息
            {
                // 获取传递的参数
                string _UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                string _BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string LoginPwd = PublicClass.FilterRequestTrim("LoginPwd");
                string PayPwd = PublicClass.FilterRequestTrim("PayPwd");
                string ExePwd = PublicClass.FilterRequestTrim("ExePwd");
                string _CreditScore = PublicClass.FilterRequestTrim("CreditScore");
                string _VipLevel = PublicClass.FilterRequestTrim("VipLevel");
                string _WxOpenID = PublicClass.FilterRequestTrim("WxOpenID");
                string _WxUnionID = PublicClass.FilterRequestTrim("WxUnionID");
                string _Longitude = PublicClass.FilterRequestTrim("Longitude");
                string _Latitude = PublicClass.FilterRequestTrim("Latitude");
                string _AccountMemo = PublicClass.FilterRequestTrim("AccountMemo");
                string RegIP = Request.UserHostAddress.Trim();
                string _IsOpenShop = PublicClass.FilterRequestTrim("IsOpenShop");
                //添加 用户账号信息
                return BusiUser.addUserAccountApi(_UserAccount, _BindMobile, LoginPwd, PayPwd, ExePwd, Convert.ToInt32(_CreditScore), Convert.ToInt32(_VipLevel), _WxOpenID, _WxUnionID, _Longitude, _Latitude, _AccountMemo, RegIP, _IsOpenShop);
            }
            else if (_exeType == "3") //编辑用户账号信息
            {
                // 获取传递的参数
                string _UserID = PublicClass.FilterRequestTrim("UserID");
                string _UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                string _BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string LoginPwd = PublicClass.FilterRequestTrim("LoginPwd");
                string PayPwd = PublicClass.FilterRequestTrim("PayPwd");
                string ExePwd = PublicClass.FilterRequestTrim("ExePwd");
                string _CreditScore = PublicClass.FilterRequestTrim("CreditScore");
                string _VipLevel = PublicClass.FilterRequestTrim("VipLevel");
                string _WxOpenID = PublicClass.FilterRequestTrim("WxOpenID");
                string _WxUnionID = PublicClass.FilterRequestTrim("WxUnionID");
                string _Longitude = PublicClass.FilterRequestTrim("Longitude");
                string _Latitude = PublicClass.FilterRequestTrim("Latitude");
                string _AccountMemo = PublicClass.FilterRequestTrim("AccountMemo");
                string RegIP = Request.UserHostAddress.Trim();
                string _IsOpenShop = PublicClass.FilterRequestTrim("IsOpenShop");
                string _IsLock = PublicClass.FilterRequestTrim("IsLock");
                //编辑 用户账号信息
                return BusiUser.editUserAccountApi(Convert.ToInt64(_UserID), _UserAccount, _BindMobile, LoginPwd, PayPwd, ExePwd, Convert.ToInt32(_CreditScore), Convert.ToInt32(_VipLevel), _WxOpenID, _WxUnionID, _Longitude, _Latitude, _AccountMemo, RegIP, _IsOpenShop, _IsLock);
            }
            else if (_exeType == "4") //开通店铺锁定账号
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string IsOpenShop = PublicClass.FilterRequestTrim("IsOpenShop");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                //开通店铺、锁定账号
                return BusiUser.openShopLockAccountApi(Convert.ToInt64(UserID), IsOpenShop, IsLock);
            }
            else if (_exeType == "5") // 加载买家用户的 账号，买家信息，余额积分信息(买家中心首页)
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiUser.loadUserMsgAccFinanceApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "6") //视图_搜索分页数据
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string VipLevel = PublicClass.FilterRequestTrim("VipLevel");
                string WxOpenID = PublicClass.FilterRequestTrim("WxOpenID");
                string MiniOpenID = PublicClass.FilterRequestTrim("MiniOpenID");
                string WxUnionID = PublicClass.FilterRequestTrim("WxUnionID");
                string CurrentRegionCodeArr = PublicClass.FilterRequestTrim("CurrentRegionCodeArr");
                string ShopName = PublicClass.FilterRequestTrim("ShopName");
                string AccountMemo = PublicClass.FilterRequestTrim("AccountMemo");
                string IsOpenShop = PublicClass.FilterRequestTrim("IsOpenShop");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string IsTransDividend = PublicClass.FilterRequestTrim("IsTransDividend");
                string RegDate = PublicClass.FilterRequestTrim("RegDate");


                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);
                VipLevel = PublicClass.preventNumberDataIsNull(VipLevel);

                //-------用实体类去限制的查询条件 AND 连接 视图----------//
                ModelV_UserAccount_BuyerMsg_ShopMsg _modelV_UserAccount_BuyerMsg_ShopMsg = ModelV_UserAccount_BuyerMsg_ShopMsg.initModelView();
                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelUserAccount.UserID = Convert.ToInt64(UserID);
                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelUserAccount.UserAccount = UserAccount;
                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelUserAccount.BindMobile = BindMobile;
                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelUserAccount.VipLevel = Convert.ToInt32(VipLevel);
                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelUserAccount.WxOpenID = WxOpenID;
                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelUserAccount.MiniOpenID = MiniOpenID;
                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelUserAccount.WxUnionID = WxUnionID;
                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelUserAccount.AccountMemo = AccountMemo;
                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelUserAccount.IsOpenShop = IsOpenShop;
                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelUserAccount.CurrentRegionCodeArr = CurrentRegionCodeArr;
                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelUserAccount.IsTransDividend = IsTransDividend;
                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelUserAccount.IsLock = IsLock;
                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelUserAccount.RegDate = RegDate;

                _modelV_UserAccount_BuyerMsg_ShopMsg.ModelShopMsg.ShopName = ShopName;




                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "UserID", "UserAccount", "UserNick", "BindMobile", "VipLevel", "CreditScore", "WxOpenID", "CurrentRegionCodeArr", "IsOpenShop", "IsLock", "RegDate", "AccountMemo", "WxUnionID", "MiniOpenID", "IsTransDividend", "ShopName", "ShopID" };
                string _strJson = BusiJsonPageStr.morePageJSONV_UserAccount_BuyerMsg_ShopMsg(_modelV_UserAccount_BuyerMsg_ShopMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, false, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "7") //批量-锁定/解锁会员账号
            {
                // 获取传递的参数
                string UserIDArr = PublicClass.FilterRequestTrim("UserIDArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                string _jsonBack = BusiUser.tglLockUserAccountArrApi(UserIDArr, IsLock);
                return _jsonBack;
            }
            else if (_exeType == "8") //编辑会员账号信息
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string IsTransDividend = PublicClass.FilterRequestTrim("IsTransDividend");
                string IsOpenShop = PublicClass.FilterRequestTrim("IsOpenShop");
                string AccountMemo = PublicClass.FilterRequestTrim("AccountMemo");

                //防止数字类型为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                string _jsonBack = BusiUser.editUserAccountApi(Convert.ToInt64(UserID), IsTransDividend, IsOpenShop, AccountMemo);
                return _jsonBack;
            }
            else if (_exeType == "9") //初始化会员账号信息-带-买家信息-店铺信息
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");

                //防止数字类型为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                string _jsonBack = BusiUser.initUserAccountDetailViewApi(Convert.ToInt64(UserID));
                return _jsonBack;
            }
            else if (_exeType == "10") //获取账户微信注册信息
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");

                //防止数字类型为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                string _jsonBack = BusiUser.getUserAccWeiXinMsgApi(Convert.ToInt64(UserID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 验证用户账号信息
        /// </summary>
        /// <returns></returns>
        public string CheckUserAccount()
        {
            string outUserID = "", outLoginPwd = "", outExtraDataArr = "";
            //验证RndKeyRsa是否正确 并获取登录用户名和密码
            bool _verifySu = BusiApiKeyVerify.verifySignValRequest(out outUserID, out outLoginPwd, out outExtraDataArr);
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 验证用户ID和登录密码是否正确
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string IsOpenShop = PublicClass.FilterRequestTrim("IsOpenShop");

                //验证用户ID和登录密码是否正确--API调用方法
                string _jsonBack = BusiUser.chkUserIDLoginPwdApi(Convert.ToInt64(outUserID), outLoginPwd, IsOpenShop);
                return _jsonBack;
            }



            return "";
        }

        #region【用户注册登录 - 微信-手机号短信】

        /// <summary>
        /// 用户注册登录 - 微信-手机号短信
        /// </summary>
        /// <returns></returns>
        public string RegUserAccount()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 被推广人扫码注册 - 微信扫码  Type=2 微信用户自动登录和注册会员 Type=3 手机短信登录与注册绑定 Type=4 绑定手机号到用户账号,存在账号信息的情况 Type=5  判断买家账号是否可以冻结 Type=6 冻结账号，账户 Type=7 判断用户是否绑定了手机 Type=8 初始化用户账号信息(简单版) Type=9 更新微信用户信息 - 公众号 Type=10 处理手机号被绑定并且存在第三方注册信息 - 【有微信小程序 OPENDID，没有微信公众号OPENDID 】Type=11 小程序端-被推广人扫码注册-微信扫码
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数

                //连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser  RSA分段加密的
                string PQRCRSA = PublicClass.FilterRequestTrimNoConvert("PQRCRSA");
                PQRCRSA = PQRCRSA.Replace(" ", "+").Replace("%2B", "+");

                //获取传递的微信用户信息
                string OpenID = PublicClass.FilterRequestTrim("OpenID");
                string NickName = PublicClass.FilterRequestTrim("NickName");
                string HeadImgUrl = PublicClass.FilterRequestTrimNoConvert("HeadImgUrl");
                string Sex = PublicClass.FilterRequestTrim("Sex");
                string UnionID = PublicClass.FilterRequestTrim("UnionID");

                //解密并分割 连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser 
                Dictionary<string, object> _dicPQRC = BusiUser.splitRSADecryptPQRCArr(PQRCRSA);
                string BuyerUserIDPromoteFather = _dicPQRC["BuyerUserID"].ToString().Trim();
                string LoginPwdSha1 = _dicPQRC["LoginPwdSha1"].ToString().Trim();

                //防止数据为空
                BuyerUserIDPromoteFather = PublicClass.preventNumberDataIsNull(BuyerUserIDPromoteFather);

                string _jsonBack = BusiUser.regPromoteWxAutoUserAccountApi(Convert.ToInt64(BuyerUserIDPromoteFather), LoginPwdSha1, OpenID, NickName, HeadImgUrl, Sex, UnionID);
                return _jsonBack;
            }
            else if (_exeType == "2") //微信用户自动登录和注册会员
            {
                //获取传递的微信用户信息
                string OpenID = PublicClass.FilterRequestTrim("OpenID");
                string NickName = PublicClass.FilterRequestTrim("NickName");
                string HeadImgUrl = PublicClass.FilterRequestTrimNoConvert("HeadImgUrl");
                string Sex = PublicClass.FilterRequestTrim("Sex");
                string UnionID = PublicClass.FilterRequestTrim("UnionID");

                //推广者的UserID (可以是店铺主) 不为空或0 则进行添加
                string BuyerUserIDPromoteFather = PublicClass.FilterRequestTrim("BuyerUserIDPromoteFather");

                //防止数据为空
                BuyerUserIDPromoteFather = PublicClass.preventNumberDataIsNull(BuyerUserIDPromoteFather);

                string _jsonBack = BusiUser.wxAutoLoginAndRegUserAccountApi(OpenID, NickName, HeadImgUrl, Sex, UnionID, Convert.ToInt64(BuyerUserIDPromoteFather));
                return _jsonBack;
            }
            else if (_exeType == "3") //手机短信登录与注册绑定
            {
                //获取传递的参数
                string ToMobileNumber = PublicClass.FilterRequestTrim("ToMobileNumber");
                string SmsVerifyCode = PublicClass.FilterRequestTrim("SmsVerifyCode");

                //获取连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser  RSA加密的
                string PQRCRSA = PublicClass.FilterRequestTrimNoConvert("PQRCRSA");

                string _jsonBack = BusiUser.loginRegMobileSmsApi(ToMobileNumber, SmsVerifyCode, PQRCRSA);
                return _jsonBack;
            }
            else if (_exeType == "4") //绑定手机号到用户账号,存在账号信息的情况 
            {
                //获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ToMobileNumber = PublicClass.FilterRequestTrim("ToMobileNumber");
                string SmsVerifyCode = PublicClass.FilterRequestTrim("SmsVerifyCode");

                //防止数字类型为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                string _jsonBack = BusiUser.bindMobileUserAccountApi(Convert.ToInt64(UserID), ToMobileNumber, SmsVerifyCode);
                return _jsonBack;
            }
            else if (_exeType == "5") //判断买家账号是否可以冻结
            {
                //获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");

                //防止数字类型为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                string _jsonBack = BusiUser.isAbleFreezeUserAccountApi(Convert.ToInt64(UserID));
                return _jsonBack;
            }
            else if (_exeType == "6") //冻结账号，账户
            {
                //获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");

                //防止数字类型为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                string _jsonBack = BusiUser.freezeUserAccountApi(Convert.ToInt64(UserID));
                return _jsonBack;
            }
            else if (_exeType == "7") //判断用户是否绑定了手机
            {
                //获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");

                //防止数字类型为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                string _jsonBack = BusiUser.isBindMobileApi(Convert.ToInt64(UserID));
                return _jsonBack;
            }
            else if (_exeType == "8") //初始化用户账号信息(简单版)
            {
                //获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string IsMaskMobile = PublicClass.FilterRequestTrim("IsMaskMobile");


                //防止数字类型为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                string _jsonBack = BusiUser.getUserAccMsgSimpleApi(Convert.ToInt64(UserID), IsMaskMobile);
                return _jsonBack;
            }
            else if (_exeType == "9") //更新微信用户信息 - 公众号
            {
                //获取传递参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string WxOpenID = PublicClass.FilterRequestTrimNoConvert("WxOpenID");
                string NickName = PublicClass.FilterRequestTrim("NickName");
                string HeadImgUrl = PublicClass.FilterRequestTrimNoConvert("HeadImgUrl");
                string Sex = PublicClass.FilterRequestTrim("Sex");

                //防止数字为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                string _jsonBack = BusiUser.updateWxPubUserInfoApi(Convert.ToInt64(UserID), WxOpenID, NickName, HeadImgUrl, Sex);
                return _jsonBack;
            }
            else if (_exeType == "10") //处理手机号被绑定并且存在第三方注册信息 - 【有微信小程序 OPENDID，没有微信公众号OPENDID 】
            {
                //获取传递参数
                string LoginUserID = PublicClass.FilterRequestTrim("LoginUserID");
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");

                //防止数字为空
                LoginUserID = PublicClass.preventNumberDataIsNull(LoginUserID);

                string _jsonBack = BusiUser.proBindMobileMiniOpenIDNoWxOpenID(Convert.ToInt64(LoginUserID), BindMobile);
                return _jsonBack;
            }
            else if (_exeType == "11") //小程序端-被推广人扫码注册-微信扫码
            {
                //获取传递的参数

                //连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser  RSA分段加密的
                string PQRCRSA = PublicClass.FilterRequestTrimNoConvert("PQRCRSA");
                PQRCRSA = PQRCRSA.Replace(" ", "+").Replace("2%B", "+");

                //获取传递的微信用户信息
                string MiniOpenID = PublicClass.FilterRequestTrim("MiniOpenID");
                string NickName = PublicClass.FilterRequestTrim("NickName");
                string HeadImgUrl = PublicClass.FilterRequestTrimNoConvert("HeadImgUrl");
                string Sex = PublicClass.FilterRequestTrim("Sex");
                string UnionID = PublicClass.FilterRequestTrim("UnionID");

                //解密并分割 连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser 
                Dictionary<string, object> _dicPQRC = BusiUser.splitRSADecryptPQRCArr(PQRCRSA);
                string BuyerUserIDPromoteFather = _dicPQRC["BuyerUserID"].ToString().Trim();
                string LoginPwdSha1 = _dicPQRC["LoginPwdSha1"].ToString().Trim();

                //防止数据为空
                BuyerUserIDPromoteFather = PublicClass.preventNumberDataIsNull(BuyerUserIDPromoteFather);

                string _jsonBack = BusiUser.regPromoteWxAutoUserAccountApi_Mini(Convert.ToInt64(BuyerUserIDPromoteFather), LoginPwdSha1, MiniOpenID, NickName, HeadImgUrl, Sex, UnionID);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 用户登录验证
        /// </summary>
        /// <returns></returns>
        public string UserLoginVerify()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 用户登录验证 (Acc 账号登录，手机短信登录) Type=2 重设与更改用户登录密码 Type=3 重设与更改用户支付密码
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                //SHA1加密后的
                string LoginPwdSha1 = PublicClass.FilterRequestTrim("LoginPwdSha1");

                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string SmsVerifyCode = PublicClass.FilterRequestTrim("SmsVerifyCode");
                //是否已开通店铺 true / false
                string IsOpenShop = PublicClass.FilterRequestTrim("IsOpenShop");
                //登录验证类型 "Acc 账号登录 或 Mobile 手机短信登录"
                string LoginVerifyType = PublicClass.FilterRequestTrim("LoginVerifyType");

                string _jsonBack = BusiUser.LoginUserVerifyApi(LoginVerifyType, BindMobile, SmsVerifyCode, UserAccount, LoginPwdSha1, IsOpenShop);
                return _jsonBack;

            }
            else if (_exeType == "2") //重设与更改用户登录密码
            {
                //获取传递的参数
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string LoginPwdSha1New = PublicClass.FilterRequestTrim("LoginPwdSha1New");
                string SmsVerifyCode = PublicClass.FilterRequestTrim("SmsVerifyCode");

                string _jsonBack = BusiUser.chgUserLoginPwdApi(BindMobile, LoginPwdSha1New, SmsVerifyCode);
                return _jsonBack;
            }
            else if (_exeType == "3") //重设与更改用户支付密码
            {
                //获取传递的参数
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string PayPwdSha1New = PublicClass.FilterRequestTrim("PayPwdSha1New");
                string SmsVerifyCode = PublicClass.FilterRequestTrim("SmsVerifyCode");

                string _jsonBack = BusiUser.chgUserPayPwdApi(BindMobile, PayPwdSha1New, SmsVerifyCode);
                return _jsonBack;
            }

            return "";
        }

        #endregion

        #region【微信小程序 - 用户注册登录】

        /// <summary>
        /// 小程序-用户注册登录
        /// </summary>
        /// <returns></returns>
        public string MiniLoginRegUserAccount()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 小程序注册或登录用户信息 Type=2 绑定与更新-小程序微信用户信息 Type=3 判断是否存在绑定的微信用户信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");

                //获取连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser  RSA加密的
                string PQRCRSA = PublicClass.FilterRequestTrimNoConvert("PQRCRSA");

                //小程序 注册或登录 用户信息
                string _jsonBack = BusiUser.loginRegUserMobileMiniApi(BindMobile, PQRCRSA);
                return _jsonBack;

            }
            else if (_exeType == "2") //绑定与更新-小程序微信用户信息
            {
                //获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string MiniOpenID = PublicClass.FilterRequestTrimNoConvert("MiniOpenID");
                string NickName = PublicClass.FilterRequestTrim("NickName");
                string HeadImgUrl = PublicClass.FilterRequestTrimNoConvert("HeadImgUrl");
                string Sex = PublicClass.FilterRequestTrim("Sex");

                //防止数字为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                string _jsonBack = BusiUser.updateWxMiniUserInfoMiniApi(Convert.ToInt64(UserID), MiniOpenID, NickName, HeadImgUrl, Sex);
                return _jsonBack;

            }
            else if (_exeType == "3") //判断是否存在绑定的微信用户信息
            {
                //获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiUser.isExistWeiXinUserInfoByUserIDMiniApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }


            return "";
        }

        #endregion

        #region【用户信息-位置-微信信息】

        /// <summary>
        /// 用户信息-位置-微信信息
        /// </summary>
        /// <returns></returns>
        public string UserAccountMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1  保存用户最新的位置信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string Longitude = PublicClass.FilterRequestTrim("Longitude");
                string Latitude = PublicClass.FilterRequestTrim("Latitude");

                //防止数字为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                string _jsonBack = BusiUser.updateUserLongitudeLatitudeApi(Convert.ToInt64(UserID), Longitude, Latitude);
                return _jsonBack;
            }



            return "";
        }

        #endregion


    }
}