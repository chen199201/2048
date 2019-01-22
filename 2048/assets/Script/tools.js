import { GameConfig } from 'config';
cc.log(GameConfig)
var GameTools = {
	numberLabelAtlas: null,
	// 音乐播放
	// playSimpleAudioEngine: function(engineType) {
	// 	if (GameConfig.IS_GAME_MUSIC) {
	// 		switch (engineType) {
	// 			case 0:
	// 				cc.audioEngine.play(cc.url.raw('resources/audios/btn.mp3'), false, 0.5);
	// 				break;
	// 			case 1:
	// 				cc.audioEngine.play(cc.url.raw('resources/audios/move.mp3'), false, 0.5);
	// 				break;
	// 			case 2:
	// 				cc.audioEngine.play(cc.url.raw('resources/audios/del.mp3'), false, 0.5);
	// 				break;
	// 			case 3:
	// 				cc.audioEngine.play(cc.url.raw('resources/audios/bgm.mp3'), true, 0.5);
	// 				break;
	// 			case 4:
	// 				cc.audioEngine.play(cc.url.raw('resources/audios/bjm.mp3'), true, 0.5);
	// 				break;
	// 			default:
	// 				break;
	// 		}
	// 	}
	// },
	/*获取本地信息*/
	getItemByLocalStorage: function (key, value) {
		let values = cc.sys.localStorage.getItem(key);
		if (values === undefined || values === null || values === '') {
			cc.sys.localStorage.setItem(key, value);
			return value;
		}
		if (typeof value === 'boolean') {
			if (typeof values === 'boolean') {
				return values;
			}
			return 'true' == values;
		} else if (typeof value === 'number') {
			return Number(values);
		}
		return values;
	},
	/*存储信息到本地*/
	setItemByLocalStorage: function (key, value) {
		cc.sys.localStorage.setItem(key, value);
	},

	toastMessage(toastType) {
		cc.loader.loadRes('panel/ShowMessage', (err, prefab) => {
			if (!err) {
				var node = cc.instantiate(prefab);
				node.getComponent(cc.Component).toastType = toastType;
				cc.director.getScene().getChildByName('Canvas').addChild(node);
			}
		});
	},

	//显示插屏广告
	showSpotAds(type) { },

	autoShowSpotAds(times) { },
	showAddInteardlView() {
		//显示获取积分窗口
	},
	showGameHelp() { }, //显示游戏帮助

	// 用户分享
	sharePicture(pictureName, cb) {
		let titleStr = '据说玩这个游戏的人，已经锤烂了2048个屏幕！';
		if ('shareTicket' == pictureName) {
			titleStr = '据说玩这个游戏的人，已经锤烂了2048个屏幕！';
		} else if (pictureName != undefined && pictureName != null) {
			titleStr = '据说玩这个游戏的人，已经锤烂了2048个屏幕！';
		}
		if (CC_WECHATGAME) {
			wx.shareAppMessage({
				title: titleStr,
				query: 'x=' + GameConfig.MAIN_MENU_NUM,
				imageUrl: 'src/sharePic.png',
				success: (res) => {
					window.wx.request({
						url: 'https://text.qkxz.com/index/users/user_share',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							gm_id: 1002,
							uid: GameConfig.uid
						},
						success: (resa) => {
							console.log('分享成了')
							window.wx.showToast({
								title: '分享成功！'
							  });
						},
					});
					typeof cb == 'function' && cb(res);
				},
				complete:()=>{
					console.log('执行了什么东西')
				},
				fail:()=>{
					console.log('失败了')
				}
			});
		} else {
			this.toastMessage(1);
			cc.log('执行了截图' + titleStr);
		}
	},

	//获取积分
	getGameIntegral() {
		return this.getItemByLocalStorage('GameIntegral', 0);
	},

	// 设置积分
	setGameIntegral(intrgral) {
		cc.sys.localStorage.setItem('GameIntegral', intrgral);
		// if (GameConfig.GameScene != undefined || GameConfig.GameScene != null) {
		//     GameConfig.GameScene.gameIntegral.string = intrgral;
		// }
	},

	//评论功能
	commentGame() {
		if (CC_WECHATGAME) {
			window.wx.openCustomerServiceConversation({});
		} else {
			this.toastMessage(1);
			cc.log('执行了评论');
		}
	},

	/*检测登录状态*/
	checkFirstLoginGame() {
		//检查是否首次登录
		let loginDate = Math.floor(
			(new Date().getTime() - new Date(2018, 3, 18, 0, 0, 0, 0).getTime()) / (1000 * 60 * 60 * 24)
		);
		if (loginDate > this.getItemByLocalStorage('FirstEnterGameDate', 0)) {
			cc.sys.localStorage.setItem('FirstEnterGameDate', loginDate);
			this.setGameIntegral(this.getGameIntegral() + 100);
			this.toastMessage(9);
		}
	},

	/*获取排行榜数据*/
	getRankData(shareTicket) {
		cc.loader.loadRes('rank', (err, prefab) => {
			if (!err) {
				var node = cc.instantiate(prefab);
				if (shareTicket != undefined) {
					node.getComponent(cc.Component).shareTicket = shareTicket;
				}
				cc.director.getScene().children[0].addChild(node);
			}
		});
	},



	//移除排行榜数据
	removeRankData() {
		if (CC_WECHATGAME) {
			window.wx.postMessage({
				messageType: 0
			});
		} else {
			cc.log('移除排行榜数据。');
		}
	},

	/*提交分数*/
	submitScore(score) {
		if (CC_WECHATGAME) {
			window.wx.postMessage({
				messageType: 3,
				MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
				score: score
			});
		} else {
			cc.log('提交得分:' + GameConfig.MAIN_MENU_NUM + ' : ' + score);
		}
	},

	/* 数据请求 */
	postd(data, url, cb) {
		window.wx.request({
			url:'https://text.qkxz.com/index/users/'+url,
			method: 'POST',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: data,
			success(res) {
				'function' == typeof cb && cb(res)
			},
			fail(err) {
				throw new Error('?');
			}
		});
	},

	getHttp(data, cb) {
		window.wx.request({
			url: GameConfig.GetUrl,
			method: 'GET',
			data: data,
			success(res) {
				console.log(res);
				cb(res.data);
			},
			fail(err) {
				throw new Error('?');
			}
		});
	},

	// 用户登录授权
	userData(url) {
		if (!CC_WECHATGAME) return;
		let sysInfo = window.wx.getSystemInfoSync();
		let sdkVersion = sysInfo.SDKVersion;
		let width = sysInfo.screenWidth;
		let height = sysInfo.screenHeight;
		if (sdkVersion >= '2.0.1') {
			var button = window.wx.createUserInfoButton({
				type: 'text',
				text: '',
				style: {
					left: 10,
					top: 10,
					width: width - 20,
					height: height - 20,
					textAlign: 'center'
				}
			});
			button.onTap((res) => {
				if (res.userInfo) {
					console.log('用户授权:', res);
					var userInfo = res.userInfo;
					button.destroy();
					this.setItemByLocalStorage('usemsg', userInfo);
					GameConfig.userMsg = userInfo;
					this.wx_login(userInfo);
				} else {
					console.log('拒绝授权');
				}
			});
		} else {
			window.wx.getUserInfo({
				withCredentials: true,
				success: (res) => {
					console.log('用户授权:', res);
					var userInfo = res.userInfo;
					this.setItemByLocalStorage('usemsg', userInfo);
					this.wx_login(userInfo);
				},
				fail: (res) => {
					this.show_modal('友情提醒', '请允许微信获得授权!', '授权', false, function (res) {
						console.log('未获得微信授权！');
					});
				}
			});
		}
	},

	wx_login(msg) {
		if (!CC_WECHATGAME) return;
		window.wx.login({
			success: function (res) {
				console.log('用户code', res);
				GameConfig.nickname = msg.nickName;
				window.wx.request({
					url: 'https://text.qkxz.com/index/users/tzxc_login',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						gm_id: 1002,
						jscode: res.code,
						nickname: msg.nickName,
						avatarUrl: encodeURI(msg.avatarUrl),
						topid: GameConfig.topid,
						source: GameConfig.source
					},
					success: (res1) => {
						console.log('chenggogn', res1);
						GameConfig.uid = res1.data.data.uid;
						GameConfig.IS_GAME_PROP.boom = res1.data.data.prop_1;
						GameConfig.IS_GAME_PROP.hammer = res1.data.data.prop_2;
						GameConfig.IS_GAME_PROP.refresh = res1.data.data.prop_3;
						GameConfig.openid = res1.data.data.openid;
						GameConfig.IS_DAY = res1.data.data.now_sign_day;
						GameConfig.IS_GAME_SGIN = res1.data.data.is_sign;
						GameConfig.IS_GAME_ONEDAY = res1.data.data.is_gift;
						// if (res1.data.data.is_sign == 0) {
						// 	setTimeout(() => {
						// 		cc.loader.loadRes('Sign', (err, prefab) => {
						// 			if (!err) {
						// 				var node = cc.instantiate(prefab);
						// 				cc.director.getScene().children[0].addChild(node);
						// 			}
						// 		});
						// 	}, 10);
						// }
					}
				});
			}
		});
	},

	login() {
		if (!CC_WECHATGAME) return;
		window.wx.getSetting({
			success: (res) => {
				var authSetting = res.authSetting;
				if (authSetting['scope.userInfo'] === true) {
					// 用户已授权，可以直接调用相关 API
					// wx_login();
					this.userData();
				} else if (authSetting['scope.userInfo'] === false) {
					// 用户已拒绝授权，再调用相关 API 或者 window.wx.authorize 会失败，需要引导用户到设置页面打开授权开关
					console.log('用户拒绝了获取信息的授权！');
					this.userData();
					this.show_toast('拒绝授权将无法获取排行榜等信息！', this.exit_game());
				} else {
					// 未询问过用户授权，调用相关 API 或者 window.wx.authorize 会弹窗询问用户
					this.userData();
				}
			},
			fail: (res) => {
				console.log('wx getSetting fail:' + res);
			}
		});
	},

	// 弹框合集
	// showToast
	show_toast(title, success = undefined, fail = undefined) {
		if (!CC_WECHATGAME) return;
		let obj = {
			title: title,
			mask: true
		};
		typeof success == 'function' && (obj.success = success);
		typeof fail == 'function' && (obj.fail = fail);
		window.wx.showToast(obj);
	},

	// showModal
	show_modal(title, content, confirmText, showCancel, success = undefined) {
		if (!CC_WECHATGAME) return;
		let obj = {
			title: title,
			content: content,
			confirmText: confirmText,
			showCancel: showCancel
		};
		typeof success == 'function' && (obj.success = success);
		window.wx.showModal(obj);
	},

	// 退出游戏
	exit_game() {
		if (!CC_WECHATGAME) return;
		window.wx.exitMiniProgram({
			success: (res) => {
				console.log('exit_mini_game success!');
			},
			fail: (res) => {
				console.log('exit_mini_game fail! res:', res);
			}
		});
	},
	//看广告
	showAds(type, node) {
		switch (type) {
			case 1:
				node.videoAd = wx.createRewardedVideoAd({
					adUnitId: 'adunit-ff35435534e88462'
				});
				break;
			case 2:
				node.bannerAd = wx.createBannerAd({
					adUnitId: 'adunit-6b9405d8f66f41da',
					style: {
						left: 0,
						top: GameConfig.DEVICE_HEIGHT - 110,
						width: GameConfig.DEVICE_WIDTH
					}
				});
				break;
			default:
				console.log('没有广告可以显示');
				break;
		}
	},

	 //广告
	 createBan() {
        let winSize = wx.getSystemInfoSync();
        console.log(winSize);
        let bannerHeight = 80;
        let bannerWidth = 300;
        GameConfig.IS_GAME_BANNER = wx.createBannerAd({
            adUnitId: 'adunit-ade3b4483fac051c',
            style: {
                left: (winSize.windowWidth - bannerWidth) / 2,
                top: winSize.windowHeight - bannerHeight,
                width: bannerWidth,
            }
        });
        GameConfig.IS_GAME_BANNER.onResize(res => {
            GameConfig.IS_GAME_BANNER.style.top = winSize.windowHeight - GameConfig.IS_GAME_BANNER.style.realHeight;
        })
    },

};




module.exports = GameTools;
