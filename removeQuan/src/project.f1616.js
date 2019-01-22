require=function r(o,c,s){function l(t,e){if(!c[t]){if(!o[t]){var a="function"==typeof require&&require;if(!e&&a)return a(t,!0);if(h)return h(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=c[t]={exports:{}};o[t][0].call(i.exports,function(e){return l(o[t][1][e]||e)},i,i.exports,r,o,c,s)}return c[t].exports}for(var h="function"==typeof require&&require,e=0;e<s.length;e++)l(s[e]);return l}({GameRankingList:[function(e,t,a){"use strict";cc._RF.push(t,"402b6k64D5Jh6JgIwYytzsw","GameRankingList"),"ios"!=window.wx.getSystemInfoSync().platform&&(cc.view._convertPointWithScale=function(e){var t=this._viewPortRect;e.x=(e.x-t.x)/(this._scaleX/2),e.y=(e.y-t.y)/(this._scaleY/2)},cc.view._convertTouchesWithScale=function(e){for(var t,a,n,i=this._viewPortRect,r=this._scaleX/2,o=this._scaleY/2,c=0;c<e.length;c++)a=(t=e[c])._point,n=t._prevPoint,a.x=(a.x-i.x)/r,a.y=(a.y-i.y)/o,n.x=(n.x-i.x)/r,n.y=(n.y-i.y)/o}),cc.Class({extends:cc.Component,properties:{rankingScrollView:cc.ScrollView,scrollViewContent:cc.Node,prefabRankItem:cc.Prefab,prefabGameOverRank:cc.Prefab,ownRank:cc.Node,hmask:cc.SpriteFrame},start:function(){var t=this;this.removeChild(),window.wx.onMessage(function(e){console.log("接收到主域发来消息：",e),0==e.messageType?t.removeChild():1==e.messageType?t.fetchFriendData(e.MAIN_MENU_NUM):3==e.messageType?t.submitScore(e.MAIN_MENU_NUM,e.score):4==e.messageType?t.gameOverRank(e.MAIN_MENU_NUM):5==e.messageType?t.fetchGroupFriendData(e.MAIN_MENU_NUM,e.shareTicket):6==e.messageType&&t.worldRank(e.resData)})},submitScore:function(t,a){window.wx.getUserCloudStorage({keyList:["x"+t],success:function(e){console.log("获取用户托管信息成功",e),0!=e.KVDataList.length&&(1==t&&window.wx.setUserCloudStorage({KVDataList:[{key:"Classic",value:'{"wxgame":{"score":'+(e.KVDataList[0].value>a?e.KVDataList[0].value:a)+',"update_time": '+(new Date).getTime()+"}}"}]}),e.KVDataList[0].value>a)||window.wx.setUserCloudStorage({KVDataList:[{key:"x"+t,value:""+a}],success:function(e){console.log("托管用户数据成功",e)},fail:function(e){console.log("用户数据托管失败","fail")},complete:function(e){console.log("用户数据托管执行完成","ok")}})},fail:function(e){console.log("获取用户托管信息失败","fail")},complete:function(e){console.log("获取用户托管信息执行完成","ok")}})},removeChild:function(){this.node.removeChild(this.node.getChildByName("1000")),this.rankingScrollView.node.active=!1,this.scrollViewContent.removeAllChildren(),this.ownRank.active=!1,this.ownRank.removeAllChildren()},fetchFriendData:function(t){var d=this;this.removeChild(),this.rankingScrollView.node.active=!0,this.ownRank.active=!0,wx.getUserInfo({openIdList:["selfOpenId"],success:function(e){console.log("获取用户信息成功",e.data);var h=e.data[0];wx.getFriendCloudStorage({keyList:["x"+t],success:function(e){console.log("获取好友数据 success",e);var t=e.data;t.sort(function(e,t){return 0==e.KVDataList.length&&0==t.KVDataList.length?0:0==e.KVDataList.length?1:0==t.KVDataList.length?-1:t.KVDataList[0].value-e.KVDataList[0].value});for(var a=[],n="",i=[],r=0;r<t.length;r++){var o=t[r],c=cc.instantiate(d.prefabRankItem);if(a.push(c),i.push(c),c.getComponent("RankItem").init(r,o),d.scrollViewContent.addChild(c),t[r].avatarUrl==h.avatarUrl){var s=cc.instantiate(d.prefabRankItem);s.y=5,s.children[4].getComponent(cc.Sprite).spriteFrame=d.hmask,s.getComponent("RankItem").init(r,o),d.ownRank.addChild(s,1,1e3),console.log(s),s.children[5].active=!1}}n=i.pop();for(var l=0;l<a.length;l++)lastarr[l].children[0].getComponent(cc.Label).string==n.children[0].getComponent(cc.Label).string&&(lastarr[l].children[5].active=!1)},fail:function(e){console.log("获取好友数据 fail",e)}})},fail:function(e){console.log("本人信息失败",e)}})},fetchGroupFriendData:function(t,a){var c=this;this.removeChild(),this.rankingScrollView.node.active=!0,wx.getUserInfo({openIdList:["selfOpenId"],success:function(e){console.log("success",e.data);var o=e.data[0];wx.getGroupCloudStorage({shareTicket:a,keyList:["x"+t],success:function(e){console.log("获取群数据 success",e);var t=e.data;t.sort(function(e,t){return 0==e.KVDataList.length&&0==t.KVDataList.length?0:0==e.KVDataList.length?1:0==t.KVDataList.length?-1:t.KVDataList[0].value-e.KVDataList[0].value});for(var a=0;a<t.length;a++){var n=t[a],i=cc.instantiate(c.prefabRankItem);if(i.getComponent("RankItem").init(a,n),c.scrollViewContent.addChild(i),t[a].avatarUrl==o.avatarUrl){var r=cc.instantiate(c.prefabRankItem);r.y=5,r.getComponent("RankItem").init(a,n),c.ownRank.addChild(r,1,1e3)}}},fail:function(e){}})},fail:function(e){}})},worldRank:function(c){var s=this;this.removeChild(),this.rankingScrollView.node.active=!0,this.ownRank.active=!0,wx.getUserInfo({openIdList:["selfOpenId"],success:function(e){console.log("获取用户信息成功",e.data);var t=e.data[0];c.push(t);for(var a=0;a<40;a++){var n=c[a];if(c[a].avatarUrl==t.avatarUrl){var i=cc.instantiate(s.prefabRankItem);i.y=5,i.getComponent("RankItem").init2(c[a].num||a+1,n),s.ownRank.addChild(i,1,1e3),c.pop(),i.children[5].active=!1,console.log(i)}var r=cc.instantiate(s.prefabRankItem);r.getComponent("RankItem").init(a,n),s.scrollViewContent.addChild(r),39==a&&(r.children[5].active=!1)}if(c[40]){n=c[40];var o=cc.instantiate(s.prefabRankItem);o.y=5,o.getComponent("RankItem").init2(c[40].num,n),s.ownRank.addChild(o,1,1e3),o.children[5].active=!1}},fail:function(e){console.log("本人信息失败",e)}})},gameOverRank:function(t){var h=this;this.removeChild(),this.gameOverRankLayout.active=!0,wx.getUserInfo({openIdList:["selfOpenId"],success:function(e){console.log("获取自己信息",e.data);var l=e.data[0];wx.getFriendCloudStorage({keyList:["x"+t],success:function(e){console.log("获取好友数据 success",e);var t=e.data;t.sort(function(e,t){return 0==e.KVDataList.length&&0==t.KVDataList.length?0:0==e.KVDataList.length?1:0==t.KVDataList.length?-1:t.KVDataList[0].value-e.KVDataList[0].value});for(var a=0;a<t.length;a++)if(t[a].avatarUrl==l.avatarUrl){if(0<=a-1){if(a+1>=t.length&&0<=a-2){var n=cc.instantiate(h.prefabGameOverRank);n.getComponent("GameOverRank").init(a-2,t[a-2]),h.gameOverRankLayout.addChild(n)}var i=cc.instantiate(h.prefabGameOverRank);i.getComponent("GameOverRank").init(a-1,t[a-1]),h.gameOverRankLayout.addChild(i)}else if(a+2>=t.length){var r=new cc.Node;r.width=600,h.gameOverRankLayout.addChild(r)}var o=cc.instantiate(h.prefabGameOverRank);if(o.getComponent("GameOverRank").init(a,t[a],!0),h.gameOverRankLayout.addChild(o),console.log("用户信息已经填充"),a+1<t.length){var c=cc.instantiate(h.prefabGameOverRank);if(c.getComponent("GameOverRank").init(a+1,t[a+1]),h.gameOverRankLayout.addChild(c),a-1<0&&a+2<t.length){var s=cc.instantiate(h.prefabGameOverRank);s.getComponent("GameOverRank").init(a+2,t[a+2]),h.gameOverRankLayout.addChild(s)}}}},fail:function(e){console.log("获取好友数据 fail",e)}})},fail:function(e){}})}}),cc._RF.pop()},{}],RankItem:[function(e,t,a){"use strict";cc._RF.push(t,"bd044ySvT5NioMcK8UG8MfU","RankItem"),cc.Class({extends:cc.Component,name:"RankItem",properties:{rankLabel:cc.Label,avatarImgSprite:cc.Sprite,nickLabel:cc.Label,topScoreLabel:cc.Label,one:cc.SpriteFrame,two:cc.SpriteFrame,three:cc.SpriteFrame,hmask:cc.SpriteFrame},start:function(){},init:function(e,t){var a=t.avatarUrl,n=t.nickname.length<7?t.nickname:t.nickname.substr(0,7)+"...",i=t.KVDataList?t.KVDataList[0].value:t.score;0==e?this.rankLabel.node.children[0].getComponent(cc.Sprite).spriteFrame=this.one:1==e?this.rankLabel.node.children[0].getComponent(cc.Sprite).spriteFrame=this.two:2==e&&(this.rankLabel.node.children[0].getComponent(cc.Sprite).spriteFrame=this.three),this.rankLabel.string=e+1,this.createImage(a),this.nickLabel.string=n,this.topScoreLabel.string=i+"分"},init2:function(e,t){var a=t.avatarUrl,n=t.nickname.length<7?t.nickname:t.nickname.substr(0,7)+"...",i=t.score;1==e?this.rankLabel.node.children[0].getComponent(cc.Sprite).spriteFrame=this.one:2==e?this.rankLabel.node.children[0].getComponent(cc.Sprite).spriteFrame=this.two:3==e&&(this.rankLabel.node.children[0].getComponent(cc.Sprite).spriteFrame=this.three),this.rankLabel.string=e,this.createImage(a),this.nickLabel.string=n,this.topScoreLabel.string=i+"分",this.node.children[4].getComponent(cc.Sprite).spriteFrame=this.hmask},createImage:function(e){var t=this;try{var a=wx.createImage();a.onload=function(){try{var e=new cc.Texture2D;e.initWithElement(a),e.handleLoadedTexture(),t.avatarImgSprite.spriteFrame=new cc.SpriteFrame(e)}catch(e){t.avatarImgSprite.node.active=!1}},a.src=e}catch(e){this.avatarImgSprite.node.active=!1}}}),cc._RF.pop()},{}]},{},["GameRankingList","RankItem"]);