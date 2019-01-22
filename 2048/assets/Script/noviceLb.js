import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
cc.Class({
    extends: cc.Component,

    properties: {
        lqBtn: cc.Node,
        chaBtn: cc.Node,
        mask:cc.Node,
    },

    onLoad() {
        this.boomNumber = cc.find('Canvas/cj/prop/boom/number').getComponent(cc.Label);
        this.hammerNumber = cc.find('Canvas/cj/prop/hammer/number').getComponent(cc.Label);
        this.refreshNumber = cc.find('Canvas/cj/prop/refresh/number').getComponent(cc.Label);
    },

    start() {

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
                console.log(GameConfig.IS_GAME_PROP);
                self.boomNumber.string = 'x' + GameConfig.IS_GAME_PROP.boom;
                self.hammerNumber.string = 'x' + GameConfig.IS_GAME_PROP.hammer;
                self.refreshNumber.string = 'x' + GameConfig.IS_GAME_PROP.refresh;
            }
        );
    },

    


    // update (dt) {},
});
