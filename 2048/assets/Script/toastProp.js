import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
cc.Class({
    extends: cc.Component,
    properties: {
        lq: cc.Node,
        cha: cc.Node
    },

    onLoad() {
        this.boomNumber = cc.find('Canvas/cj/prop/boom/number').getComponent(cc.Label);
        this.hammerNumber = cc.find('Canvas/cj/prop/hammer/number').getComponent(cc.Label);
        this.refreshNumber = cc.find('Canvas/cj/prop/refresh/number').getComponent(cc.Label);
    },

    addTouchEvent() {
        var that = this;
        this.lq.on(cc.Node.EventType.TOUCH_START, function (event) {
            that.getDJ(1, 1, 0);
            that.node.runAction(cc.fadeOut(.3))
            if (CC_WECHATGAME) { wx.triggerGC() }
            that.node.active = false;
        }, this)
        this.cha.on(cc.Node.EventType.TOUCH_START, function (event) {
            that.getDJ(1, 1, 0);
            if (CC_WECHATGAME) { wx.triggerGC() }
            that.node.destroy();
        }, this)
    },
    start() {
        this.addTouchEvent();
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(.3));
        let xz = this.node.children[1];
        let xzRote = cc.repeatForever(cc.rotateBy(4, 360));
        xz.runAction(xzRote);
    },
    getDJ(propa, propb, propc) {
        var self = this;
        tools.postd(
            {
                gm_id: 1002,
                uid: GameConfig.uid,
                prop_1: propa,
                prop_2: propb,
                prop_3: propc,
            },
            'inc_prop',
            function (res) {
                console.log('执行获取道具的回调数据', res);
                GameConfig.IS_GAME_PROP.boom = res.data.data.prop_1
                GameConfig.IS_GAME_PROP.hammer = res.data.data.prop_2
                GameConfig.IS_GAME_PROP.refresh = res.data.data.prop_3
                self.boomNumber.string = 'x' + GameConfig.IS_GAME_PROP.boom;
                self.hammerNumber.string = 'x' + GameConfig.IS_GAME_PROP.hammer;
                self.refreshNumber.string = 'x' + GameConfig.IS_GAME_PROP.refresh;
            }
        );
    },

    // update (dt) {},
});
