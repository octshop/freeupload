using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【订购订单】相关业务逻辑
/// </summary>
namespace OctWapWeb
{
    public class BusiOrder
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiOrder()
        {

        }

        /// <summary>
        /// 设置需要订单商品Cookie数组,以便下单使用 _单个商品订购通道  用“^”拼接【GoodsID ^ OrderNum ^ SpecID】 
        /// </summary>
        /// <param name="pGoodsID">商品ID</param>
        /// <param name="pOrderNum">订单数量</param>
        /// <param name="pSpecID">规格或属性ID，如果有属性ID,则选择属性ID</param>
        /// <param name="pGroupSettingID">拼团商品设置ID，不是拼团则为0</param>
        /// <returns></returns>
        public static bool setOrderGoodsMsgCookieArrSingle(long pGoodsID,int pOrderNum,long pSpecID=0,long pGroupSettingID=0)
        {
            //设置订购参数Cookie 【GoodsID ^ OrderNum ^ SpecID】
            PublicClass.setCookieValue("OrderGoodsCookie", pGoodsID + "^" + pOrderNum + "^" + pSpecID + "^" + pGroupSettingID);

            //解决OrderGoodsCookie无故为空的BUg
            PublicClass.setCookieValue("OrderGoodsCookieArr", pGoodsID + "^" + pOrderNum + "^" + pSpecID + "^" + pGroupSettingID);

            return true;
        }

        /// <summary>
        /// 得到订购的 商品Cookie拼接数组 _单个商品订购通道  用“^”拼接【GoodsID ^ OrderNum ^ SpecID】 
        /// </summary>
        /// <returns></returns>
        public static string[] getOrderGoodsMsgCookieArrSingle()
        {
            string _orderGoodsMsgCookie = PublicClass.getCookieValue("OrderGoodsCookie");

            //解决OrderGoodsCookie无故为空的BUg
            string _orderGoodsMsgCookie2 = PublicClass.getCookieValue("OrderGoodsCookieArr");
            if (string.IsNullOrWhiteSpace(_orderGoodsMsgCookie))
            {
                _orderGoodsMsgCookie = _orderGoodsMsgCookie2;
            }


            if (_orderGoodsMsgCookie.IndexOf("^") >=0)
            {
                //得到订购参数Cookie 【GoodsID ^ OrderNum ^ SpecID】
                string[] _orderGoodsMsgCookieArr = _orderGoodsMsgCookie.Split('^');
                return _orderGoodsMsgCookieArr;
            }
            return null;
            
        }

        /// <summary>
        /// http请求 -- 初始化订单验证码
        /// </summary>
        /// <param name="pOrderID">订单ID</param>
        /// <param name="pBuyerUserID">买家UserID</param>
        /// <returns></returns>
        public static string httpInitCheckCodeOrderStatus(string pOrderID,string pBuyerUserID)
        {
             //POST参数
            Dictionary<string, string> _dicPost = new Dictionary<string, string>();
            _dicPost.Add("OrderID", pOrderID);
            _dicPost.Add("IsReSet", "false"); //不需要重新生成
            _dicPost.Add("BuyerUserID", pBuyerUserID);

            //取消订单,关闭交易
            string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderCheckCode, "T_OrderCheckCode", "1", _dicPost);
            return _jsonBack;

        }
    }
}