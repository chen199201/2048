
import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
cc.Class({
    extends: cc.Component,
    properties: {
        lqBtn: cc.Node,
        cha:cc.Node,
        yday0:cc.SpriteFrame,
        yday1:cc.SpriteFrame,
        yday2:cc.SpriteFrame,
        yday3:cc.SpriteFrame,
        yday4:cc.SpriteFrame,
        yday5:cc.SpriteFrame,
        yday6:cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    buttonFunc: function (event) {
        let button = event.target;
        let node = this.node.children[0].children[3].children[0];
        if(this.cha == button){
            this.node.destroy();
        }else if (this.lqBtn == button) {
            node.children[GameConfig.IS_DAY].getComponent(cc.Sprite).spriteFrame = this[`yday${GameConfig.IS_DAY}`];
            this.signDay(0);
        }
        return true;
    },

    isSign() {
        var node = this.node.children[0].children[3].children[0];
        console.log(node)
        for (let i = 0; i < node.children.length; i++) {
            if (i < GameConfig.IS_DAY) {
                node.children[i].getComponent(cc.Sprite).spriteFrame = this[`yday${i}`];
            }
        }
    },

    signDay(type) {
        tools.postd(
            {
                uid: GameConfig.uid,
                gm_id: 1002,
                id: GameConfig.IS_DAY + 1,
                type: type
            },
            'signed',
            (res) => {
                console.log('sign ok', res);
                GameConfig.IS_GAME_PROP.boom = res.data.data.prop_1
                GameConfig.IS_GAME_PROP.hammer = res.data.data.prop_2
                GameConfig.IS_GAME_PROP.refresh = res.data.data.prop_3
                GameConfig.IS_GAME_SGIN = 1;
                this.node.destroy();
                tools.show_toast('签到成功!', 'success');
            }
        );
    },

    start() {
        this.isSign()
        uitools.setButtonClickEvents(this, this.lqBtn, 'buttonFunc');
    },

    // update (dt) {},
});
