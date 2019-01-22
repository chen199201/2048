import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
var overItem = require('overItem')
cc.Class({
    extends: cc.Component,

    properties: {
        backBtn: cc.Node,
        restartBtn: cc.Node,
        shareBtnA: cc.Node,
        rankBtnA: cc.Node,
        overItem: cc.Prefab,
        overRank: cc.Node,
        yqBtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.overWindow();
        this.initFun();
        if (CC_WECHATGAME) {
            var seq = cc.repeatForever(
                cc.sequence(
                    cc.moveTo(.5, 165, 0),
                    cc.moveTo(.5, 145, 0)
                ));
            if (wx.getSystemInfoSync().model == 'iPhone X') {
                this.node.children[1].children[9].children[0].y = 70;
                this.node.children[1].children[9].children[1].y = 70;
                seq = cc.repeatForever(
                    cc.sequence(
                        cc.moveTo(.5, 165, 70),
                        cc.moveTo(.5, 145, 70)
                    ));
                this.node.children[1].children[9].children[1].runAction(seq)
            }else{
                this.node.children[1].children[9].children[1].runAction(seq)
            }
            wx.triggerGC()
        }
    },
    overWindow() {
        var node = this.node.children[1];
        this.getData();
        node.children[1].getComponent(cc.Label).string = cc.find('Canvas/cj/index_score').getComponent(cc.Label).string;   //本局得分
        tools.submitScore(GameConfig.GameHeightScore); //提交得分
    },
    start() {
        uitools.setButtonClickEvents(this, this.backBtn, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.restartBtn, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.shareBtnA, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.rankBtnA, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.yqBtn, 'buttonFunc');
        this.reOpen();
        this.clearNum()
    },
    buttonFunc: function (event) {
        let button = event.target;
        if (this.rankBtnA == button) {
            GameConfig.overPage = true;
            uitools.loadingLayer('rank')
        } else if (this.shareBtnA == button) {
            setTimeout(() => {
                tools.sharePicture();
            }, 100);
        } else if (this.restartBtn == button) {
            this.node.destroy();
            cc.find("Canvas/cj").active = true;
        } else if (this.backBtn == button) {
            this.node.destroy();
            this.restartResource('home');
        } else if (this.yqBtn == button) {
            uitools.loadingLayer('Invitation')
        }
        return true;
    },

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
    },

    getData() {
        var node = this.node.children[1];
        tools.postd({ gm_id: 1002, openid: GameConfig.openid }, 'get_user_paihang', (res, event) => {
            var resData = res.data.data;
            for (let i = 0; i < resData.length; i++) {
                var playerInfo = resData[i];
                if (resData[i].nickname == GameConfig.nickname) {
                    GameConfig.GameHeightScore = resData[i].score;
                    node.children[3].getComponent(cc.Label).string = GameConfig.GameHeightScore || '0';   //历史最高分
                    cc.sys.localStorage.setItem('bestScore', GameConfig.GameHeightScore);
                    let userItem = cc.instantiate(this.overItem);
                    userItem.getComponent(overItem).init(i, playerInfo);
                    userItem.y = -12;
                    this.overRank.children[1].addChild(userItem, 1, 1000);
                    if (i - 1 >= 0) {
                        let preItem = cc.instantiate(this.overItem);
                        preItem.getComponent(overItem).init(i - 1, res.data.data[i - 1]);
                        preItem.y = 0;
                        this.overRank.children[0].addChild(preItem, 1, 1000);
                    }
                    if (i + 1 < resData.length) {
                        let preItem = cc.instantiate(this.overItem);
                        preItem.getComponent(overItem).init(i + 1, res.data.data[i + 1]);
                        preItem.y = 0;
                        this.overRank.children[2].addChild(preItem, 1, 1000);
                    }
                }
            }
        });
    },

    //初始化看视频、获得免费道具次数
    initFun() {
        this.boomImg = cc.find('Canvas/cj/prop/boom').getComponent(cc.Sprite);
        this.hammerImg = cc.find('Canvas/cj/prop/hammer').getComponent(cc.Sprite);
        this.refreshImg = cc.find('Canvas/cj/prop/refresh').getComponent(cc.Sprite);
        this.boomNumber = cc.find('Canvas/cj/prop/boom/number').getComponent(cc.Label);
        this.hammerNumber = cc.find('Canvas/cj/prop/hammer/number').getComponent(cc.Label);
        this.refreshNumber = cc.find('Canvas/cj/prop/refresh/number').getComponent(cc.Label);
        console.log(GameConfig.boomNum, GameConfig.czNum, GameConfig.sxNum)
        if (GameConfig.boomNum > 0) {
            this.reduceDJ({ gm_id: 1002, uid: GameConfig.uid, prop_1: GameConfig.boomNum * 2 - GameConfig.yMFZD });
            GameConfig.boomNum = 0
            GameConfig.yMFZD = 0
        }
        if (GameConfig.czNum > 0) {
            this.reduceDJ({ gm_id: 1002, uid: GameConfig.uid, prop_2: GameConfig.czNum * 2 - GameConfig.yMFCZ });
            GameConfig.czNum = 0
            GameConfig.yMFCZ = 0
        }
        if (GameConfig.sxNum > 0) {
            this.reduceDJ({ gm_id: 1002, uid: GameConfig.uid, prop_3: GameConfig.sxNum * 2 - GameConfig.yMFSX });
            GameConfig.sxNum = 0
            GameConfig.yMFSX = 0
        }
        GameConfig.boomNum = 0;
        GameConfig.czNum = 0;
        GameConfig.sxNum = 0;
        GameConfig.mfZD = 1;
        GameConfig.mfCZ = 1;
        GameConfig.mfSX = 1;
    },

    //游戏结束，减去剩余的免费道具
    reduceDJ(data) {
        var self = this;
        tools.postd(
            data,
            'dec_prop', (res) => {
                GameConfig.IS_GAME_PROP.boom = res.data.data.prop_1;
                GameConfig.IS_GAME_PROP.hammer = res.data.data.prop_2;
                GameConfig.IS_GAME_PROP.refresh = res.data.data.prop_3;
                self.boomNumber.string = 'x' + GameConfig.IS_GAME_PROP.boom;
                self.hammerNumber.string = 'x' + GameConfig.IS_GAME_PROP.hammer;
                self.refreshNumber.string = 'x' + GameConfig.IS_GAME_PROP.refresh;
            });
    },


    clearNum() {
        console.log('清除')
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

    restartResource(sceneName) {
        tools.removeRankData();
        uitools.loadingScene(sceneName);
    },

    update(dt) {
    },
});
