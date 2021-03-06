<%@ Page Language="C#" AutoEventWireup="true" CodeFile="JsSdk.aspx.cs" Inherits="WeiXin_JSSDK_JsSdk" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>C# 微信JS-SDK说明文档</title>

     <!--
       <meta name="viewport" content="width=device-width initial-scale="1" />
   viewport是网页默认的宽度和高度，上面这行代码的意思是，网页宽度默认等于屏幕宽度（width=device-width），
   原始缩放比例（initial-scale=1）为1.0，即网页初始大小占屏幕面积的100%。 user-scalable=no  不允许缩放网页 -->
    <meta name="viewport" content="width=device-width" initial-scale="1" />

<!--引入百度地图-->
  <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=Vz8HWF36Qc2duKpz3Gw7Np9GlAjdcpVv"></script>
  <style type="text/css">
    body, html, #allmap {
      width: 100%;
      height: 100%;
      /*overflow: hidden;*/
      margin: 0;
      font-family: "微软雅黑";
    }
  </style>

    <%--<script src="jweixin-1.0.0.js" type="text/javascript"></script>--%>
    <script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script src="jquery-1.10.2.js" type="text/javascript"></script>


</head>
<body>
    <form id="form1" runat="server">
        <div>


             <h1>请特别要注意，调用微信JS-SDK的页面后面绝对不能带参数如： 

http://m.0731oho.com/TestWxJsSdk.aspx/#

http://m.0731oho.com/TestWxJsSdk.aspx?ID=234  否则，将会出现验证，或签名错误。。</h1>



            <h1>C# 微信JS-SDK说明文档</h1>
            <b id="JsSkdConfigB" runat="server"></b>

            <h3><%= mJsSkdConfig %></h3>



            <script type="text/javascript">





                wx.config(<%= mJsSkdConfig %>);

                //-------------接口处理--------------//
                wx.ready(function () {


                    alert("微信JS-SDK Is Ready!");

                    //-----微信扫一扫-----//
                    $("#btn_scan").click(function () {
                        wx.scanQRCode({
                            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                            success: function (res) {
                                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                                $("#qrCodeContent").text(result);
                            }
                        });
                    });

                    //---分享到QQ空间---//
                    wx.onMenuShareQQ({
                        title: '牛屎的分享到QQ接口', // 分享标题
                        desc: '牛屎就是牛屎，无需解译！', // 分享描述
                        link: 'http://www.baidu.com', // 分享链接
                        imgUrl: 'http://www.baidu.com/img/baidu_jgylogo3.gif', // 分享图标
                        success: function () {
                            alert("分享成功！");
                        },
                        cancel: function () {
                            alert("取消分享！！");
                        }
                    });

                    //-------获取地理位置_接口---------//
                    var _latitude = 28.190732, _longitude = 113.045121, _speed, _accuracy;
                    $("#btn_GetLocation").click(function () {

                        wx.getLocation({
                            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                            success: function (res) {
                                 _latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                 _longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                 _speed = res.speed; // 速度，以米/每秒计
                                 _accuracy = res.accuracy; // 位置精度

                                //百度地图获取经纬度
                                 _longitudeBaiDu = _longitude;
                                 _latitudeBaiDu = _latitude;
                            }
                        });

                    });

    
                    //--------使用微信内置地图查看位置_接口---------//
                    $("#btn_OpenLocation").click(function () {
                        wx.openLocation({
                            latitude: _latitude, // 纬度，浮点数，范围为90 ~ -90
                            longitude: _longitude, // 经度，浮点数，范围为180 ~ -180。
                            name: '默认：人民东路地铁口', // 位置名
                            address: '默认：长沙市芙蓉区人民东路地铁口', // 地址详情说明
                            scale: 20, // 地图缩放级别,整形值,范围从1~28。默认为最大
                            infoUrl: 'http://www.51clh.com' // 在查看位置界面底部显示的超链接,可点击跳转
                        });
                    });



                });

                //--------错误处理----------//
                wx.error(function (res) {

                    alert("接口验证失败，详细信息：\n" + JSON.stringify(res));

                });
            </script>

            <div class="btnListDiv">
                <input type="button" value="微信扫一扫_接口" id="btn_scan" />

                <input type="button" value="获取地理位置_接口" id="btn_GetLocation" />

                <input type="button" value="使用微信内置地图查看位置_接口" id="btn_OpenLocation" />

                <input type="button" value="用微信JS-SDK获取位置信息，然后，在百度地图中显示位置" onclick="panToBaiDu()" /> <br />

                <span>百度地图longitude(经度,长沙经度值大)=</span><input type="text" value="113.082235" id="longitudeTxt" />
                <span>百度地图latitude(纬度)=</span><input type="text" value="28.251869" id="latitudeTxt" />
                <input type="button" value="百度地图计算两个点之间的距离" id="GetTwoPointDistanceBtn" />

            </div>

            <div id="showContent" style="padding: 20px;">

                <%-- 微信扫一扫结果 --%>
                <b>微信扫一扫结果</b>
                <div id="qrCodeContent" style="padding: 20px;">

                </div>

                <b>获取地理位置_接口</b>
                <div id="showGetLocation" style="padding: 20px;">

                </div>

                <b>显示百度地图的位置</b>

                <div id="showBaiDuMap" style="width: 800px; height:800px;">
                        <!--地图显示区-->
                        <div id="allmap"></div>
                </div>


            </div>
            <br /><br /><br /><br />
            底部内容呀,底部内容呀底部内容呀



        </div>



        <%------------------ 百度地图 ------------%>
        <script type="text/javascript">

            var _longitudeBaiDu = 113.045153, _latitudeBaiDu = 28.190585;

            // 百度地图API功能  113.045153,28.190585 长沙
            var map = new BMap.Map("allmap");    // 创建Map实例

            map.centerAndZoom(new BMap.Point(113.045153, 28.190585), 20);  // 初始化地图,设置中心点坐标和地图级别

            map.addControl(new BMap.MapTypeControl());   //添加地图类型控件

            //map.setCurrentCity("长沙");          // 设置地图显示的城市 此项是必须设置的

            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

            //移动到指定点
            //map.panTo(new BMap.Point(113.262232, 23.154345));

           

            var panToBaiDu = function () {

                var mapNewPint = new BMap.Point(_longitudeBaiDu, _latitudeBaiDu);

                ////移动到指定点
                //map.panTo(mapNew);

                //var marker = new BMap.Marker(mapNewPint);  // 创建标注
                //map.addOverlay(mapNewPint);

                //------------原始坐标转换成百度地图坐标 微信坐标必须进行转换才能显示正常--------------//
                convertPointBaiBu(mapNewPint);

                //var convertor = new BMap.Convertor();
                //var pointArr = [];
                //pointArr.push(mapNewPint);
                //convertor.translate(pointArr, 1, 5, translateCallback)

                //-----------google坐标转换成百度地图坐标----------//
                //var convertor = new BMap.Convertor();
                //var pointArr = [];
                //pointArr.push(mapNewPint);
                //convertor.translate(pointArr, 3, 5, translateCallback)

            }

            //------------原始坐标转换成百度地图坐标 微信坐标必须进行转换才能显示正常--------------//
            var convertPointBaiBu = function (BMapPoint) {
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(BMapPoint);
                convertor.translate(pointArr, 1, 5, translateCallback)
            }

            //-------------坐标转换完之后的回调函数-----------//
            translateCallback = function (data) {
                if (data.status === 0) {
                    var marker = new BMap.Marker(data.points[0]);
                    map.addOverlay(marker);

                    //移动到指定点
                    map.panTo(data.points[0]);
                    //var label = new BMap.Label("转换后的百度坐标（正确）", { offset: new BMap.Size(20, -10) });
                   // marker.setLabel(label); //添加百度label
                    //bm.setCenter(data.points[0]);
                }
            }

     
            //----------------为计算两点的按钮定义事件---------------//
            $("#GetTwoPointDistanceBtn").click(function () {
                
                //从微信获取当前位置坐标值
                var weixinNewPint = new BMap.Point(_longitudeBaiDu, _latitudeBaiDu);

                //原始坐标转换成百度地图坐标 微信坐标必须进行转换才能显示正常
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(weixinNewPint); //传入转换点weixinNewPint
                convertor.translate(pointArr, 1, 5, WxTranslateCallback) //传入回调函数WxTranslateCallback
            });

            //--------坐标转换回调函数--------//
            var WxTranslateCallback = function (data) {
                if (data.status === 0) {
                    //data.points[0]就是一个百度地图的point点对象

                    //获取输入的百度坐标值 
                    var longitudeTxt = $.trim($("#longitudeTxt").val()); //经度值
                    var latitudeTxt = $.trim($("#latitudeTxt").val()); //纬度值

                    //创建百度地图 A点
                    var _pointA = new BMap.Point(longitudeTxt, latitudeTxt);
                    //创建百度地图 B点
                    var _pointB = data.points[0];

                    //正式计算两个点的距离
                    getTwoPointDistance(_pointA, _pointB);

                    //var marker = new BMap.Marker(data.points[0]);
                    //map.addOverlay(marker);
                    //移动到指定点
                    //map.panTo(data.points[0]);
                    //var label = new BMap.Label("转换后的百度坐标（正确）", { offset: new BMap.Size(20, -10) });
                    // marker.setLabel(label); //添加百度label
                    //bm.setCenter(data.points[0]);
                }
            }

            //----------------百度地图计算两个点之间的距离-----------------//
            var getTwoPointDistance = function (baiDuPointA, baiDuPointB) {

                //var pointA = new BMap.Point(106.486654, 29.490295);  // 创建点坐标A
                // var pointB = new BMap.Point(106.581515, 29.615467);  // 创建点坐标B

                // alert('从大渡口区到江北区的距离是：' + (map.getDistance(pointA, pointB)).toFixed(2) + ' 米。');  //获取两点距离,保留小数点后两位

                alert("目标位置距离当前位置有：" + (map.getDistance(baiDuPointA, baiDuPointB)).toFixed(2) + " 米。");

                return (map.getDistance(baiDuPointA, baiDuPointB)).toFixed(2);
            }




        </script>


    </form>
</body>
</html>
