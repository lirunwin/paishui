$(function () {
    //初始化IP地址、端口、用户名、密码、宽度高度
    var _szIp = queryString("ip");
    var _szPort = queryString("port");
    var _szUsername = queryString("user");
    var _szPassword = queryString("password");
    var _iWidth = queryString("width") || "800";
    var _iHeight = queryString("height") || "600";
	
	//var _szIp = "192.168.0.10";
    //var _szPort = "8000";
    //var _szUsername = "admin";
    //var _szPassword = "sg85214551";
    //var _iWidth = "800";
    //var _iHeight = "600";
    if(!_szIp) {        
        document.getElementById('divPlugin').innerHTML = '<img src="./image/nullVideo.png" style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);"/>'
        return
    }
	// 检查插件是否已经安装过
    var iRet = WebVideoCtrl.I_CheckPluginInstall();
    //视频无法预览时判断
    if (-2 == iRet) {
        $("#divPlugin").html("<div style='background-color:black;color:white;width:" + _iWidth + "px;height:" + _iHeight + "px;text-align:center;line-height:" + _iHeight + "px'>请在IE浏览器中进行视频预览！</div>");
        return;
    } else if (-1 == iRet) {
        $("#divPlugin").html("<div style='background-color:black;color:white;width:" + _iWidth + "px;height:" + _iHeight + "px;text-align:center;line-height:" + _iHeight + "px'>您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！</div>");
        return;
    }

	var oPlugin = {
        iWidth: _iWidth,			// plugin width
        iHeight: _iHeight			// plugin height
	};

	// 初始化插件参数及插入插件
	WebVideoCtrl.I_InitPlugin(oPlugin.iWidth, oPlugin.iHeight, {
        bWndFull: true,//是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
        iWndowType: 1,
		cbSelWnd: function (xmlDoc) {

		}
	});
	WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

	// 检查插件是否最新
	if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
		alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
		return;
	}

	var oLiveView = {
		iProtocol: 1,			// protocol 1：http, 2:https
        szIP: _szIp,	// protocol ip
        szPort: _szPort,			// protocol port
        szUsername: _szUsername,	// device username
        szPassword: _szPassword,	// device password
		iStreamType: 1,			// stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
		iChannelID: 1,			// channel no
		bZeroChannel: false		// zero channel
	};

	// 登录设备
    var iRet = WebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
		success: function (xmlDoc) {
			// 开始预览
			WebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
				iStreamType: oLiveView.iStreamType,
				iChannelID: oLiveView.iChannelID,
				bZeroChannel: oLiveView.bZeroChannel
			});
        },
        error: function () {
            $("#divPlugin").html("<div style='background-color:black;color:white;width:" + _iWidth + "px;height:" + _iHeight + "px;text-align:center;line-height:" + _iHeight+"px'>" + oLiveView.szIP + " 登录失败！</div>");
        }
    });

	// 关闭浏览器
	$(window).unload(function () {
		WebVideoCtrl.I_Stop();
    });
});

function queryString(val) {
    var uri = window.location.search;
    var re = new RegExp("" + val + "\=([^\&\?]*)", "ig");
    return ((uri.match(re)) ? decodeURIComponent((uri.match(re)[0].substr(val.length + 1))) : null);
}
