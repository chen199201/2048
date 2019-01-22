var uitools = require('uitools');
var tools = require('tools');
import { GameConfig } from 'config';
cc.Class({
    extends: cc.Component,
    properties: {
        resGame: cc.Node,
        continue: cc.Node,
        backHome: cc.Node,
        bg: cc.Node,
        zdB: cc.SpriteFrame,
        czB: cc.SpriteFrame,
        sxb: cc.SpriteFrame,
        syBtn: cc.Node,
        syBtna: cc.SpriteFrame,
        syBtnb: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (GameConfig.IS_GAME_MUSIC == true) {
            this.syBtn.getComponent(cc.Sprite).spriteFrame = this.syBtna;
        } else {
            this.syBtn.getComponent(cc.Sprite).spriteFrame = this.syBtnb;
        }
    },
    fnBg(event) {
        let button = event.target;
        if (event) {
            event.stopPropagation();
        }
        if (this.syBtn == button) {
            if (GameConfig.IS_GAME_MUSIC == true) {
                this.syBtn.getComponent(cc.Sprite).spriteFrame = this.syBtnb;
                GameConfig.IS_GAME_MUSIC = false;
            } else {
                GameConfig.IS_GAME_MUSIC = true;
                this.syBtn.getComponent(cc.Sprite).spriteFrame = this.syBtna;
            }
        }
    },
    start() {
        uitools.setButtonClickEvents(this, this.bg, 'fnBg');
        uitools.setButtonClickEvents(this, this.syBtn, 'fnBg');
        this.addClick();

        this.boomImg = cc.find('Canvas/cj/prop/boom').getComponent(cc.Sprite).spriteFrame;
        this.hammerImg = cc.find('Canvas/cj/prop/hammer').getComponent(cc.Sprite).spriteFrame;
        this.refreshImg = cc.find('Canvas/cj/prop/refresh').getComponent(cc.Sprite).spriteFrame;

        this.boomNumber = cc.find('Canvas/cj/prop/boom/number').getComponent(cc.Label);
        this.hammerNumber = cc.find('Canvas/cj/prop/hammer/number').getComponent(cc.Label);
        this.refreshNumber = cc.find('Canvas/cj/prop/refresh/number').getComponent(cc.Label);
        this.indexScore = cc.find('Canvas/cj/index_score');
        this.bgBox = cc.find('Canvas/cj/drawBox');
        this.liuchaoliang = this.bgBox.getComponent('bg_box');
        this.children_arr = [];
        this.children_arr = this.bgBox.children;
    },

    addClick() {
        var _t = this;
        this.continue.on('touchstart', function (event) {
            _t.node.active = false;
        });
        this.resGame.on('touchstart', function (event) {
            _t.node.active = false;
            _t.clearNum();
            _t.initFun();
            _t.aging();
        });
        this.backHome.on('touchstart', function (event) {
            let indexSy = cc.find("Canvas/jl/homeMenu/sy/pic");
            if (GameConfig.IS_GAME_MUSIC == true) {
                indexSy.getComponent(cc.Sprite).spriteFrame = _t.syBtna;
            } else {
                indexSy.getComponent(cc.Sprite).spriteFrame = _t.syBtnb;
            }
            _t.node.active = false;
            cc.find('Canvas/cj').active = false;
            cc.find("Canvas/jl").active = true;
            if (CC_WECHATGAME) {
                wx.triggerGC()
            }
        });
    },
    clearNum() {
        GameConfig.GameScore = 0
        this.indexScore.getComponent(cc.Label).string = GameConfig.GameScore;
        for (let i = 0; i < this.children_arr.length; i++) {
            this.children_arr[i].isFulled = false;
            this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame = '';
        }
    },

    // update (dt) {},
    initFun() {
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

    aging() {
        cc.sys.localStorage.removeItem('fileGame')
        cc.sys.localStorage.removeItem('isFile')
        cc.sys.localStorage.removeItem('myScore')
        cc.sys.localStorage.removeItem('lookZD');
        cc.sys.localStorage.removeItem('lookCZ');
        cc.sys.localStorage.removeItem('lookXS');
        cc.sys.localStorage.removeItem('fhNum');
        cc.sys.localStorage.removeItem('level');
        GameConfig.boomNum = 0;
        GameConfig.czNum = 0;
        GameConfig.sxNum = 0;
        GameConfig.fhNum = 0;
        GameConfig.level = 0;
        if (CC_WECHATGAME) {
            wx.triggerGC()
        }
    },

    //游戏重开，减去剩余的免费道具
    reduceDJ(data) {
        var self = this;
        tools.postd(
            data,
            'dec_prop', (res) => {
                console.log('消耗道具返回', res);
                GameConfig.IS_GAME_PROP.boom = res.data.data.prop_1;
                GameConfig.IS_GAME_PROP.hammer = res.data.data.prop_2;
                GameConfig.IS_GAME_PROP.refresh = res.data.data.prop_3;
                self.boomNumber.string = 'x' + GameConfig.IS_GAME_PROP.boom;
                self.hammerNumber.string = 'x' + GameConfig.IS_GAME_PROP.hammer;
                self.refreshNumber.string = 'x' + GameConfig.IS_GAME_PROP.refresh;
                if (GameConfig.IS_GAME_PROP.boom == 0) {
                    this.boomImg = this.zdB;
                }
                if (GameConfig.IS_GAME_PROP.hammer == 0) {
                    this.hammerImg = this.czB;
                }
                if (GameConfig.IS_GAME_PROP.refresh == 0) {
                    this.refreshImg = this.sxb;
                }
            });
    },
});
