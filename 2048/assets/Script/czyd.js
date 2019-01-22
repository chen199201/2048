import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
cc.Class({
    extends: cc.Component,

    properties: {
        czyd: cc.Node,    //锤子道具引导
        czbga: cc.SpriteFrame,  //背景
        czbg: cc.SpriteFrame,   //锤子消除背景
        zdydbg: cc.SpriteFrame,  //炸弹消除背景
        zdpic: cc.SpriteFrame,   //炸弹原图
        czpic: cc.SpriteFrame,   //锤子原图
        zdmove: cc.SpriteFrame,//炸弹移动图
        czmove: cc.SpriteFrame,//锤子移动图
        zdtext: cc.SpriteFrame,//炸弹文字
        cztext: cc.SpriteFrame,//锤子文字
        textNode: cc.Node,//背景文字节点
        bgpic: cc.Node,  //切换背景
        isWhatA: cc.Node, //道具图片
        isWhatB: cc.Node, //道具图片
    },


    onEnable() {
        let that = this;
        GameConfig.IS_GAME_BANNER.hide();
        let bgtext = that.czyd.children[0].children[0];
        let isWhat = that.czyd.children[2];
        let czpic = that.czyd.children[3].children[0];
        let zddh = that.czyd.children[3].children[0].children[0];
        if (GameConfig.iscz) {
            zddh.active = false;
            that.node.active = true
            bgtext.getComponent(cc.Sprite).spriteFrame = that.cztext;
            isWhat.getComponent(cc.Sprite).spriteFrame = that.czpic;
            czpic.getComponent(cc.Sprite).spriteFrame = that.czmove;
        }

        if (GameConfig.isboom) {
            bgtext.getComponent(cc.Sprite).spriteFrame = that.zdtext;
            isWhat.getComponent(cc.Sprite).spriteFrame = that.zdpic;
            czpic.getComponent(cc.Sprite).spriteFrame = that.zdmove;
        }
    },

    onLoad() {
        this.czFun();
    },

    //锤子教程
    czFun() {
        let that = this;
        let bgpic = that.czyd.children[1];
        let czbox = that.czyd.children[3];
        let hand = czbox.children[1];
        let czpic = that.czyd.children[3].children[0];
        let zddh = that.czyd.children[3].children[0].children[0];
        let czmove = cc.moveTo(.5, cc.v2({ x: 370, y: -30 }));
        let rotea = cc.rotateTo(.2, -20);
        let roteb = cc.rotateTo(.2, 0)
        let changbg = cc.callFunc(() => {
            setTimeout(() => {
                if (GameConfig.iscz) {
                    bgpic.getComponent(cc.Sprite).spriteFrame = that.czbg;
                }
                if (GameConfig.isboom) {
                    bgpic.getComponent(cc.Sprite).spriteFrame = that.zdydbg;
                }
            }, 1900);
        }, this)

        //刷新背景
        let rebg = cc.callFunc(() => {
            setTimeout(() => {
                czbox.x = -280;
                hand.x = 50;
                czpic.active = false;
                bgpic.getComponent(cc.Sprite).spriteFrame = that.czbga;
                this.scheduleOnce(() => {
                    czbox.runAction(cc.sequence(handeFun, boomdht, czpicAni, changbg, rebg))
                }, 1.3)
            }, 2300);
        }, this)

        //锤子敲击动画
        let czpicAni = cc.callFunc(() => {
            if (GameConfig.iscz) {
                this.scheduleOnce(() => {
                    czpic.runAction(cc.sequence(rotea, roteb));
                }, 1.3)
            }
        }, this)

        //炸弹动画
        let boomdhf = cc.callFunc(() => {
            zddh.active = false;
            zddh.scale = 0;
        }, this)

        //炸弹动画
        let boomdht = cc.callFunc(() => {
            if (GameConfig.isboom) {
                zddh.active = true;
                this.scheduleOnce(() => {
                    zddh.runAction(cc.sequence(cc.scaleTo(.5, 6), boomdhf))
                }, 1.3)
            }
        }, this)
        let handeFun = cc.callFunc(() => {
            hand.runAction(cc.sequence(rotea, roteb, czmove, rotea, roteb));
            this.scheduleOnce(() => {
                czpic.active = true;
            }, 1.3)
        }, this)

        //开始动画
        setTimeout(() => {
            czbox.runAction(cc.sequence(handeFun, boomdht, czpicAni, changbg, rebg))
        }, 500);

        //关闭
        that.node.children[0].on(cc.Node.EventType.TOUCH_START,
            function (event) {
                that.node.active = false;
                GameConfig.iscz = false;
                GameConfig.isboom = false;
                zddh.active = false;
                if (CC_WECHATGAME) { wx.triggerGC() }
            });
    },

    start() {


    },

    onDisable() {
        GameConfig.IS_GAME_BANNER.show();
    },

    update(dt) {

    },
});
