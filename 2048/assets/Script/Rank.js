import { GameConfig } from "config";
var tools = require('tools');
var uitools = require('uitools');
cc.Class({
    extends: cc.Component,
    properties: {
        rankBack: cc.Node,
        qunBtn: cc.Node,
        rankingScrollView: cc.Sprite,//显示排行榜
        shareTicket: null,
        startBtn: cc.Node,//开始游戏
        fRank: cc.Node,  //好友排行
        wRank: cc.Node,   //世界排行
        hyphbbg:cc.SpriteFrame, //bg
        sjphbbg:cc.SpriteFrame, //bg
    },

    onLoad() {
        if(GameConfig.overPage){
            this.node.children[1].opacity = 255;
        }
        this.phbBox = this.node.children[6].getComponent(cc.Sprite);
        if (CC_WECHATGAME) {
            console.log('我在微信', GameConfig.shareTicket)
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 750;
            window.sharedCanvas.height = 1334;
            // 发消息给子域
            if (GameConfig.shareTicket != null) {
                window.wx.postMessage({
                    messageType: 5,
                    MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                    shareTicket: GameConfig.shareTicket
                });
            } else {
                window.wx.postMessage({
                    messageType: 1,
                    MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                });
            }
        } else {
            let gameTypeNode = new cc.Node();
            gameTypeNode.addComponent(cc.Label).string = "暂无排行榜数据";
            this.node.addChild(gameTypeNode);
            console.log("获取排行榜数据。" + GameConfig.MAIN_MENU_NUM);
        }
    },
    start() {
        uitools.setButtonClickEvents(this, this.rankBack, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.startBtn, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.qunBtn, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.fRank, 'buttonFunc',1,false);
        uitools.setButtonClickEvents(this, this.wRank, 'buttonFunc',1,false);
        cc.log(cc.director.getScene());

    },
    // 点击事件
    buttonFunc: function (event) {
        let button = event.target;
        let that = this;
        if (this.rankBack == button) {
            tools.removeRankData();
            this.node.destroy();
            GameConfig.overPage = false
            GameConfig.shareTicket = null;
        } else if (this.qunBtn == button) {
            this.node.destroy();
            tools.sharePicture();
            tools.getRankData();
        } else if (this.fRank == button) {
            that.phbBox.spriteFrame = that.hyphbbg;
            this.friFun();
            wx.showToast({
                icon: 'loading',
                title: '加载中',
                duration: 1000,
                success: function () {
                    setTimeout(function () {
                        that.wRank.getComponent(cc.Button).interactable = true;
                    }, 1000)
                }
            })
        } else if (this.wRank == button) {
            that.phbBox.spriteFrame = that.sjphbbg;
            this.worFunc();
            wx.showToast({
                icon: 'loading',
                title: '加载中',
                duration: 1000,
                success: function () {
                    setTimeout(function () {
                        that.fRank.getComponent(cc.Button).interactable = true;
                    }, 1000)
                }
            })
        } else if (this.startBtn == button) {
            this.node.destroy();
            cc.find('Canvas/jl').active = false;
            cc.find('Canvas/cj').active = true;
            if (cc.find('Canvas').getChildByName('gameover')) {
                cc.find('Canvas').getChildByName('gameover').destroy();
                this.reOpen();
                this.clearNum();
                
            }
        }
        return true;
    },

    //重新开始，重置参数
    reOpen() {
        cc.sys.localStorage.removeItem('fileGame');
        cc.sys.localStorage.removeItem('isFile');
        cc.sys.localStorage.removeItem('myScore');
        cc.sys.localStorage.removeItem('lookZD');
        cc.sys.localStorage.removeItem('lookCZ');
        cc.sys.localStorage.removeItem('lookXS');
        cc.sys.localStorage.removeItem('fhNum');
        GameConfig.boomNum = 0;
        GameConfig.czNum = 0;
        GameConfig.sxNum = 0;
        GameConfig.fhNum = 0;
        GameConfig.mfZD =  1;
        GameConfig.mfCZ = 1;
        GameConfig.mfSX = 1;
        GameConfig.isFile = false;
        cc.sys.localStorage.setItem('isFile', GameConfig.isFile);
    },

    //清除棋盘
    clearNum() {
        GameConfig.GameScore = 0;
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

    //获取群
    getQun() {
        wx.showShareMenu({ withShareTicket: true });
        setTimeout(() => {
            tools.sharePicture('shareTicket', (res) => {
                console.log('分享到群了', res);
                GameConfig.shareTicket = res.shareTickets[0];
                tools.getRankData();
            });
        }, 16);
    },



    //好友排行榜
    friFun() {
        window.wx.postMessage({
            messageType: 1,
            MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
        });
    },

    //世界排行榜
    worFunc() {
        tools.removeRankData();
        tools.postd({ gm_id: 1002 }, 'user_score_charts', (res) => {
            var tdata = res.data.data;
            var tag = 0;
            for (let i = 0; i < tdata.length; i++) {
                if (tdata[i].nickname == GameConfig.nickname) {
                    tag = 1;
                }
            }
            if (tag == 0) {
                tools.postd({ gm_id: 1002,openid: GameConfig.openid }, 'get_user_paihang', (data) => {
                    console.log(data.data.data[1]);
                    tdata.push(data.data.data[1]);
                    window.wx.postMessage({
                        messageType: 6,
                        MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                        resData: tdata
                    });
                })
            } else {
                window.wx.postMessage({
                    messageType: 6,
                    MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                    resData: tdata
                });
            }
        });

    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (CC_WECHATGAME) {
            if (window.sharedCanvas != undefined) {
                this.tex.initWithElement(window.sharedCanvas);
                this.tex.handleLoadedTexture();
                this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
            }
        }
    },

    update() {
        this._updateSubDomainCanvas();
    },
});
