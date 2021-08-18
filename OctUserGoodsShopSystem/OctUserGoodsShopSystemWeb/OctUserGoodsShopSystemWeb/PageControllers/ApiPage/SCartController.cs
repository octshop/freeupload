using BusiApiKeyVerifyNS;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【购物车】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class SCartController : Controller
    {
        /// <summary>
        /// 购物车首页 相关操作
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 加入购物车 Type=2 初始化购物车信息返回Json Type=3 批量删除购物车信息 Type=4 保存商品订购数量的增减(直接保存值) Type=5 快捷加入购物车，不需要带规格属性ID
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string OrderNum = PublicClass.FilterRequestTrim("OrderNum");
                string SpecIDOrPropID = PublicClass.FilterRequestTrim("SpecIDOrPropID");

                //防止数字为空
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                OrderNum = PublicClass.preventNumberDataIsNull(OrderNum);
                SpecIDOrPropID = PublicClass.preventNumberDataIsNull(SpecIDOrPropID);

                //加入购物车 --API调用方法
                string _jsonBack = BusiSCart.addToSCartApi(Convert.ToInt64(GoodsID), Convert.ToInt64(BuyerUserID), Convert.ToInt32(OrderNum), Convert.ToInt64(SpecIDOrPropID));
                return _jsonBack;
            }
            else if (_exeType == "2") //初始化购物车信息返回Json
            {
                //获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //初始化购物车信息 ---API调用方法
                string _jsonBack = BusiSCart.initSCartApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "3") //批量删除购物车信息
            {
                //获取传递的参数
                string SCartIDArr = PublicClass.FilterRequestTrim("SCartIDArr");
                //批量删除买家购物车信息
                string _jsonBack = BusiSCart.delBuyerShoppingCartArrApi(SCartIDArr);
                return _jsonBack;
            }
            else if (_exeType == "4") //保存商品订购数量的增减(直接保存值)
            {
                //获取传递的参数
                string CartID = PublicClass.FilterRequestTrim("CartID");
                string OrderNum = PublicClass.FilterRequestTrim("OrderNum");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数据类型为空
                CartID = PublicClass.preventNumberDataIsNull(CartID);
                OrderNum = PublicClass.preventNumberDataIsNull(OrderNum);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //保存购物车订购数量的增减，直接保存值 --API调用方法 
                string _jsonBack = BusiSCart.saveScartNumAddReduceApi(Convert.ToInt64(CartID), Convert.ToInt32(OrderNum), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "5") //快捷加入购物车，不需要带规格属性ID
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string OrderNum = PublicClass.FilterRequestTrim("OrderNum");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数据类型为空
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                OrderNum = PublicClass.preventNumberDataIsNull(OrderNum);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiSCart.addToSCartNoSpecPropIDApi(Convert.ToInt64(GoodsID), Convert.ToInt64(BuyerUserID), Convert.ToInt32(OrderNum));
                return _jsonBack;
            }

            return "";
        }



    }
}