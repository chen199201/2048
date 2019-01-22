import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
var timeItem = require('timeItem')
const getRandomInt = function (min, max) {
    let ratio = Math.random();
    return min + Math.floor((max - min) * ratio);
};
cc.Class({
    extends: cc.Component,

    properties: {
        jumpBtn: cc.Node,
        fxfhBtn: cc.Node,
        kspfhBtn: cc.Node,
        timeItem: cc.Prefab,
    },
    isStop: false,


    onLoad() {
        this.loading();
        this.worFunc();
        if (GameConfig.IS_GAME_ONEDAY == 0) {
            this.node.children[2].children[4].active = false
        }
    },
    onEnable() {
        GameConfig.IS_TIME = 12;
        var node = this.node.children[2];
        node.children[3].children[0].getComponent(cc.Label).string = GameConfig.IS_TIME + 'S';   //倒计时
        this.schedule(this.timeOver, 1);
        this.isStop = false;
    },

    //世界排行榜
    worFunc() {
        tools.postd({ gm_id: 1002, openid: GameConfig.openid }, 'get_user_paihang', (res) => {
            var list = res.data.data;
            for (let i = 0; i < list.length; i++) {
                if (list[i].nickname == GameConfig.nickname) {
                    if (i - 1 >= 0) {
                        console.log('有没有超越的人才啊')
                        let preItem = cc.instantiate(this.timeItem);
                        preItem.getComponent('timeItem').init(i - 1, res.data.data[i - 1]);
                        this.node.addChild(preItem, 1, 1000);
                    }
                }
            }
        });
    },



    loading() {
        var node = this.node.children[2];
        this.bgBox = cc.find('Canvas/cj/drawBox');
        this.liuchaoliang = this.bgBox.getComponent('bg_box');
        this.children_arr = [];
        this.children_arr = this.bgBox.children;
        this.sjarr = [];
        node.children[1].getComponent(cc.Label).string = cc.find('Canvas/cj/index_score').getComponent(cc.Label).string;   //本局得分
        this.timeOver(GameConfig.IS_TIME);
        uitools.setButtonClickEvents(this, this.fxfhBtn, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.jumpBtn, 'buttonFunc');
    },

    start() {
        let that = this;
        this.kspfhBtn.on(cc.Node.EventType.TOUCH_START,      //点击
            function (event) {
                if (GameConfig.viderDJ) {
                    GameConfig.viderDJ = false;
                    if (GameConfig.viderFh) {
                        GameConfig.viderFh = false
                        that.isStop = true;
                        if (CC_WECHATGAME) {
                            wx.showToast({
                                icon: 'loading',
                                title: '加载中',
                                success: function () {
                                    that.onVideoRelive();
                                }
                            })
                        }
                    }
                }
            }, this)
    },

    buttonFunc: function (event) {
        let button = event.target;
        let that = this;
        if (this.jumpBtn == button) {
            this.isStop = true;
            this.reOpen();
            this.node.destroy();
            uitools.loadingLayer('gameover')
        } else if (this.fxfhBtn == button) {
            tools.sharePicture();
            if (GameConfig.shareFh) {
                this.isStop = true;
                GameConfig.shareFh = false
                if (CC_WECHATGAME) { wx.triggerGC()}
                setTimeout(() => {
                    GameConfig.shareFh = true
                    that.node.destroy();
                    that.dedupe();
                }, 1000)
            }
        }
        return true;
    },

    timeOver() {
        var that = this;
        var node = that.node.children[2];
        if (that.isStop == true) {
            return
        }
        GameConfig.IS_TIME -= 1;
        node.children[3].children[0].getComponent(cc.Label).string = GameConfig.IS_TIME + 'S';   //倒计时
        if (GameConfig.IS_TIME == 0) {
            that.node.destroy();
            uitools.loadingLayer('gameover')
        }
    },

    dedupe() {
        this.hfDel();
        cc.sys.localStorage.removeItem('isFile');
        GameConfig.isFile = false;
        cc.sys.localStorage.setItem('isFile', GameConfig.isFile);
        for (let i = 0; i < 5; i++) {
            this.children_arr[this.sjarr[i]].isFulled = false;
            this.children_arr[this.sjarr[i]].children[0].getComponent(cc.Sprite).spriteFrame = null;
            this.children_arr[this.sjarr[i]].children[0].opacity = 255;
        }
        GameConfig.fhNum++;
        cc.sys.localStorage.setItem('fhNum', GameConfig.fhNum);
        cc.find("Canvas/cj").active = true;
    },

    hfDel() {
        var count = 16;
        var originalArray = new Array;
        for (var i = 0; i < count; i++) {
            originalArray[i] = i;
        }
        originalArray.sort(function () { return 0.5 - Math.random() });
        for (var i = 0; i < count; i++) {
            this.sjarr = originalArray;
        }
    },

    //重新开始并充值参数
    reOpen() {
        cc.sys.localStorage.removeItem('fileGame');
        cc.sys.localStorage.removeItem('isFile');
        cc.sys.localStorage.removeItem('myScore');
        cc.sys.localStorage.removeItem('lookZD');
        cc.sys.localStorage.removeItem('lookCZ');
        cc.sys.localStorage.removeItem('lookXS');
        cc.sys.localStorage.removeItem('fhNum');
        cc.sys.localStorage.removeItem('level');
        GameConfig.boomNum = 0;
        GameConfig.czNum = 0;
        GameConfig.sxNum = 0;
        GameConfig.fhNum = 0;
        GameConfig.mfZD = 1;
        GameConfig.mfCZ = 1;
        GameConfig.mfSX = 1;
        GameConfig.level = 0;
        GameConfig.isFile = false;
        cc.sys.localStorage.setItem('isFile', GameConfig.isFile);
        this.clearNum();
    },

    //清除棋盘    
    clearNum() {
        this.indexScore = cc.find('Canvas/cj/index_score');
        this.indexScore.getComponent(cc.Label).string = GameConfig.GameScore
        this.bgBox = cc.find('Canvas/cj/drawBox');
        this.liuchaoliang = this.bgBox.getComponent('bg_box');
        this.children_arr = [];
        this.children_arr = this.bgBox.children;
        for (let i = 0; i < this.children_arr.length; i++) {
            this.children_arr[i].isFulled = false;
            this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame = '';
        }
    },


    //看视频复活
    onVideoRelive(event) {
        var self = this;
        self.isStop = true;
        self.videoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-0048771f3f74d4ec' })
        if (this.videoAd != null) {
            this.videoAd.onLoad(() => {
            });
            this.videoAd.show()
                .catch(err => {
                    self.videoAd.load()
                        .then(() => self.videoAd.show())
                })
            this.videoAd.onClose(res => {
                if (!this.videoAd) return
                this.videoAd.offClose()
                if (res && res.isEnded || res === undefined) {
                    self.kspfhBtn.active = true;
                    self.dedupe();
                    self.node.destroy();
                    tools.show_toast('复活成功');
                    GameConfig.viderFh = true;
                    GameConfig.viderDJ = true;
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    self.kspfhBtn.active = true;
                    GameConfig.viderDJ = true;
                    GameConfig.viderFh = true
                }
                self.isStop = false;
            })
        }
    },


    update(dt) {

    },
});
