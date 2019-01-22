import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
cc.Class({
    extends: cc.Component,
    properties: {
        chaBtn: cc.Node,
        lqBtn: cc.Node,
        gouImg: {
            default: null,
            type: cc.SpriteFrame
        },
        nullImg: {
            default: null,
            type: cc.SpriteFrame
        },
        zdA: cc.SpriteFrame,
        czA: cc.SpriteFrame,
        xsA: cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        uitools.setButtonClickEvents(this, this.chaBtn, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.lqBtn, 'buttonFunc');
        GameConfig.IS_GAME_ISSHARE = 0;   //默认勾选
    },
    buttonFunc: function (event) {
        let button = event.target;
        if (this.chaBtn == button) {
            this.node.destroy();
        } else if (this.lqBtn == button) {
            this.node.destroy();
            // if (GameConfig.IS_GAME_ISSHARE == 0) {
            //     tools.sharePicture();
            //     this.getLB(0, 2, 2);
            //     tools.show_toast('领取成功')
            // } else {
            //     this.getLB(0, 1, 1);
            //     tools.show_toast('领取成功')
            // }
        } 
        return true;
    },

    getLB(propa, propb, propc) {
        var self = this;
        GameConfig.IS_GAME_ONEDAY = 1;
        tools.postd(
            {
                gm_id: 1002,
                uid: GameConfig.uid,
                prop_1: propa,
                prop_2: propb,
                prop_3: propc,
                is_gift: GameConfig.IS_GAME_ONEDAY,
            },
            'inc_prop',
            function (res) {
                console.log('执行获取道具的回调数据', res);
                GameConfig.IS_GAME_PROP.boom = res.data.data.prop_1
                GameConfig.IS_GAME_PROP.hammer = res.data.data.prop_2
                GameConfig.IS_GAME_PROP.refresh = res.data.data.prop_3
                self.boomNumber.string = 'x' + GameConfig.IS_GAME_PROP.boom;
                if (GameConfig.IS_GAME_PROP.boom > 0) {
                    self.boomImg.spriteFrame = self.zdA;
                }
                self.hammerNumber.string = 'x' + GameConfig.IS_GAME_PROP.hammer;
                if (GameConfig.IS_GAME_PROP.hammer > 0) {
                    self.hammerImg.spriteFrame = self.czA;
                }
                self.refreshNumber.string = 'x' + GameConfig.IS_GAME_PROP.refresh;
                if (GameConfig.IS_GAME_PROP.refresh > 0) {
                    self.refreshImg.spriteFrame = self.xsA;
                }
                console.log(GameConfig.IS_GAME_PROP);
                tools.show_toast('获取道具成功！');
                self.node.destroy();
            }
        );
    },

    start() {
        this.boomImg = cc.find('Canvas/cj/prop/boom').getComponent(cc.Sprite);
        this.hammerImg = cc.find('Canvas/cj/prop/hammer').getComponent(cc.Sprite);
        this.refreshImg = cc.find('Canvas/cj/prop/refresh').getComponent(cc.Sprite);
        this.boomNumber = cc.find('Canvas/cj/prop/boom/number').getComponent(cc.Label);
        this.hammerNumber = cc.find('Canvas/cj/prop/hammer/number').getComponent(cc.Label);
        this.refreshNumber = cc.find('Canvas/cj/prop/refresh/number').getComponent(cc.Label);
    },

    // update (dt) {},
});
