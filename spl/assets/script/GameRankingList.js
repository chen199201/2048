cc.view._convertPointWithScale=function(point) 
{
    var viewport = this._viewPortRect;
    point.x = (point.x - viewport.x) / (this._scaleX / 2);
    point.y = (point.y - viewport.y) / (this._scaleY / 2);
};

cc.view._convertTouchesWithScale=function(touches) 
{
    var viewport = this._viewPortRect, scaleX = this._scaleX / 2, scaleY = this._scaleY / 2, selTouch, selPoint, selPrePoint;
    for (var i = 0; i < touches.length; i++) 
    {
        selTouch = touches[i];
        selPoint = selTouch._point;
        selPrePoint = selTouch._prevPoint;
        selPoint.x = (selPoint.x - viewport.x) / scaleX;
        selPoint.y = (selPoint.y - viewport.y) / scaleY;
        selPrePoint.x = (selPrePoint.x - viewport.x) / scaleX;
        selPrePoint.y = (selPrePoint.y - viewport.y) / scaleY;
    }
};

cc.Class({
	extends: cc.Component,

	properties: {
		rankingScrollView: cc.ScrollView,
		scrollViewContent: cc.Node,
		prefabRankItem: cc.Prefab,
		prefabGameOverRank: cc.Prefab,
		ownRank: cc.Node
	},

	start() {
		this.removeChild();
		if (CC_WECHATGAME) {
			window.wx.onMessage((data) => {
				console.log('接收到主域发来消息：', data);
				if (data.messageType == 0) {
					this.removeChild(); //移除排行榜信息
				} else if (data.messageType == 1) {
					this.fetchFriendData(data.MAIN_MENU_NUM); //获取好友排行榜
				} else if (data.messageType == 3) {
					this.submitScore(data.MAIN_MENU_NUM, data.score); //提交分数
				} else if (data.messageType == 4) {
					this.gameOverRank(data.MAIN_MENU_NUM); //显示游戏结束数据
				} else if (data.messageType == 5) {
					this.fetchGroupFriendData(data.MAIN_MENU_NUM, data.shareTicket); //获取好友排行榜
				} else if (data.messageType == 6) {
					this.worldRank(data.resData);
				}
			});
		}
	},

	//提交得分
	submitScore(MAIN_MENU_NUM, score) {
		if (CC_WECHATGAME) {
			window.wx.getUserCloudStorage({
				// 以key/value形式存储
				keyList: [ 'x' + MAIN_MENU_NUM ],
				success: function(getres) {
					console.log('获取用户托管信息成功', getres);
					if (getres.KVDataList.length != 0) {
						if (MAIN_MENU_NUM == 1) {
							window.wx.setUserCloudStorage({
								KVDataList: [
									{
										key: 'Classic',
										value:
											'{"wxgame":{"score":' +
											(getres.KVDataList[0].value > score ? getres.KVDataList[0].value : score) +
											',"update_time": ' +
											new Date().getTime() +
											'}}'
									}
								]
							});
						}
						if (getres.KVDataList[0].value > score) {
							return;
						}
					}
					// 对用户托管数据进行写数据操作
					window.wx.setUserCloudStorage({
						KVDataList: [ { key: 'x' + MAIN_MENU_NUM, value: '' + score } ],
						success: function(res) {
							console.log('托管用户数据成功', res);
						},
						fail: function(res) {
							console.log('用户数据托管失败', 'fail');
						},
						complete: function(res) {
							console.log('用户数据托管执行完成', 'ok');
						}
					});
				},
				fail: function(res) {
					console.log('获取用户托管信息失败', 'fail');
				},
				complete: function(res) {
					console.log('获取用户托管信息执行完成', 'ok');
				}
			});
		}
	},

	// 移除子域信息
	removeChild() {
		this.node.removeChild(this.node.getChildByName("1000"));
		this.rankingScrollView.node.active = false;
		this.ownRank.active=false;
		this.scrollViewContent.removeAllChildren();
		this.ownRank.removeAllChildren();
	},

	// 获取好友排行榜
	fetchFriendData(MAIN_MENU_NUM) {
		this.removeChild();
		this.rankingScrollView.node.active = true;
		this.ownRank.active=true;
		if (CC_WECHATGAME) {
			wx.getUserInfo({
				openIdList: [ 'selfOpenId' ],
				success: (userRes) => {
					console.log('获取用户信息成功', userRes.data);
					let userData = userRes.data[0];
					//取出所有好友数据
					wx.getFriendCloudStorage({
						keyList: [ 'x' + MAIN_MENU_NUM ],
						success: (res) => {
							console.log('获取好友数据 success', res);
							let data = res.data;
							data.sort((a, b) => {
								if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
									return 0;
								}
								if (a.KVDataList.length == 0) {
									return 1;
								}
								if (b.KVDataList.length == 0) {
									return -1;
								}
								return b.KVDataList[0].value - a.KVDataList[0].value;
							});
							for (let i = 0; i < data.length; i++) {
								var playerInfo = data[i];
								var item = cc.instantiate(this.prefabRankItem);
								item.getComponent('RankItem').init(i, playerInfo);
								this.scrollViewContent.addChild(item);
								if (data[i].avatarUrl == userData.avatarUrl) {
									let userItem = cc.instantiate(this.prefabRankItem);
									userItem.y = 5;
									userItem.getComponent('RankItem').init(i, playerInfo);
									this.ownRank.addChild(userItem, 1, 1000);
								}
							}
						},
						fail: (res) => {
							console.log('获取好友数据 fail', res);
						}
					});
				},
				fail: (res) => {
					console.log('本人信息失败', res);
				}
			});
		} else {
			cc.log('非常抱歉！非小程序暂不支持好友排行榜功能');
		}
	},

	// 获取群排行榜
	fetchGroupFriendData(MAIN_MENU_NUM, shareTicket) {
		this.removeChild();
		this.rankingScrollView.node.active = true;
		this.ownRank.active=true;
		if (CC_WECHATGAME) {
			wx.getUserInfo({
				openIdList: [ 'selfOpenId' ],
				success: (userRes) => {
					console.log('success', userRes.data);
					let userData = userRes.data[0];
					//取出所有好友数据
					wx.getGroupCloudStorage({
						shareTicket: shareTicket,
						keyList: [ 'x' + MAIN_MENU_NUM ],
						success: (res) => {
							console.log('获取群数据 success', res);
							let data = res.data;
							data.sort((a, b) => {
								if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
									return 0;
								}
								if (a.KVDataList.length == 0) {
									return 1;
								}
								if (b.KVDataList.length == 0) {
									return -1;
								}
								return b.KVDataList[0].value - a.KVDataList[0].value;
							});
							for (let i = 0; i < data.length; i++) {
								var playerInfo = data[i];
								var item = cc.instantiate(this.prefabRankItem);
								item.getComponent('RankItem').init(i, playerInfo);
								this.scrollViewContent.addChild(item);
								if (data[i].avatarUrl == userData.avatarUrl) {
									let userItem = cc.instantiate(this.prefabRankItem);
									userItem.y = 5;
									userItem.getComponent('RankItem').init(i, playerInfo);
									this.ownRank.addChild(userItem, 1, 1000);
								}
							}
						}
					});
				}
			});
		} else {
			cc.log('不好意思！非小游戏无群排行榜功能呢！');
		}
	},
	// 获取世界排行榜
	worldRank(data) {
		this.removeChild();
		this.rankingScrollView.node.active = true;
		this.ownRank.active=true;
		wx.getUserInfo({
			openIdList: [ 'selfOpenId' ],
			success: (userRes) => {
				console.log('获取用户信息成功', userRes.data);
				let userData = userRes.data[0];
				//取出所有好友数据
				for (let i = 0; i < data.length; i++) {
					var playerInfo = data[i];
					var item = cc.instantiate(this.prefabRankItem);
					item.getComponent('RankItem').init(i, playerInfo);
					this.scrollViewContent.addChild(item);
					if (data[i].avatarUrl == userData.avatarUrl) {
						let userItem = cc.instantiate(this.prefabRankItem);
						userItem.y = 5;
						userItem.getComponent('RankItem').init(i, playerInfo);
						this.ownRank.addChild(userItem, 1, 1000);
					}
				}
			},
			fail: (res) => {
				console.log('本人信息失败', res);
			}
		});
	},
	// 游戏结束弹框
	gameOverRank(MAIN_MENU_NUM) {
		this.removeChild();
		this.gameOverRankLayout.active = true;
		if (CC_WECHATGAME) {
			wx.getUserInfo({
				openIdList: [ 'selfOpenId' ],
				success: (userRes) => {
					console.log('获取自己信息', userRes.data);
					let userData = userRes.data[0];
					//取出所有好友数据
					wx.getFriendCloudStorage({
						keyList: [ 'x' + MAIN_MENU_NUM ],
						success: (res) => {
							console.log('获取好友数据 success', res);
							let data = res.data;
							data.sort((a, b) => {
								if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
									return 0;
								}
								if (a.KVDataList.length == 0) {
									return 1;
								}
								if (b.KVDataList.length == 0) {
									return -1;
								}
								return b.KVDataList[0].value - a.KVDataList[0].value;
							});
							for (let i = 0; i < data.length; i++) {
								// 判断数据的长度
								if (data[i].avatarUrl == userData.avatarUrl) {
									if (i - 1 >= 0) {
										if (i + 1 >= data.length && i - 2 >= 0) {
											let userItem = cc.instantiate(this.prefabGameOverRank);
											userItem.getComponent('GameOverRank').init(i - 2, data[i - 2]);
											this.gameOverRankLayout.addChild(userItem);
										}
										let userItem = cc.instantiate(this.prefabGameOverRank);
										userItem.getComponent('GameOverRank').init(i - 1, data[i - 1]);
										this.gameOverRankLayout.addChild(userItem);
									} else {
										if (i + 2 >= data.length) {
											let node = new cc.Node();
											node.width = 600;
											this.gameOverRankLayout.addChild(node);
										}
									}
									let userItem = cc.instantiate(this.prefabGameOverRank);
									userItem.getComponent('GameOverRank').init(i, data[i], true);
									this.gameOverRankLayout.addChild(userItem);
									console.log('用户信息已经填充');
									if (i + 1 < data.length) {
										let userItem = cc.instantiate(this.prefabGameOverRank);
										userItem.getComponent('GameOverRank').init(i + 1, data[i + 1]);
										this.gameOverRankLayout.addChild(userItem);
										if (i - 1 < 0 && i + 2 < data.length) {
											let userItem = cc.instantiate(this.prefabGameOverRank);
											userItem.getComponent('GameOverRank').init(i + 2, data[i + 2]);
											this.gameOverRankLayout.addChild(userItem);
										}
									}
								}
							}
						}
					});
				}
			});
		} else {
			cc.log('非常抱歉！非小游戏不支持该功能！');
		}
	}
});
