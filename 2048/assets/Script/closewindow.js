import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
cc.Class({
    extends: cc.Component,
    properties: {
        chab: cc.Node,
        isZD: {
            default: null,
            type: cc.SpriteFrame
        },
        isCZ: {
            default: null,
            type: cc.SpriteFrame
        },
        isSX: {
            default: null,
            type: cc.SpriteFrame
        },
        spBtn: cc.Node,
    },


    onLoad() {
        uitools.setButtonClickEvents(this, this.chab, 'buttonFunc');
        this.isWhat();
        this.rote();

    },
    start() {
        this.boomImg = cc.find('Canvas/cj/prop/boom').getComponent(cc.Sprite);
        this.hammerImg = cc.find('Canvas/cj/prop/hammer').getComponent(cc.Sprite);
        this.refreshImg = cc.find('Canvas/cj/prop/refresh').getComponent(cc.Sprite);
        this.boomNumber = cc.find('Canvas/cj/prop/boom/number').getComponent(cc.Label);
        this.hammerNumber = cc.find('Canvas/cj/prop/hammer/number').getComponent(cc.Label);
        this.refreshNumber = cc.find('Canvas/cj/prop/refresh/number').getComponent(cc.Label);
    },

    rote() {
        let roteNode = this.node.children[1].children[1];
        roteNode.runAction(cc.repeatForever(cc.rotateBy(4, 360)))
    },

    buttonFunc: function (event) {
        let button = event.target;
        if (event) {
            event.stopPropagation();
        }
        if (this.chab == button) {
            this.node.destroy();
        } else if (this.spBtn) {
            this.node.destroy();
        }
        return true;
    },
    isWhat() {
        const node = this.node.children[1];
        if (GameConfig.IS_WHAT_PROP == 0) {
            node.children[3].getComponent(cc.Sprite).spriteFrame = this.isZD;
        } else if (GameConfig.IS_WHAT_PROP == 1) {
            node.children[3].getComponent(cc.Sprite).spriteFrame = this.isCZ;
        } else if (GameConfig.IS_WHAT_PROP == 2) {
            node.children[3].getComponent(cc.Sprite).spriteFrame = this.isSX;
        }
    },
    // update (dt) {},
});
