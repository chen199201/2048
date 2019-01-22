import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
cc.Class({
    extends: cc.Component,

    properties: {
        lq: cc.Node,
        cha: cc.Node,
        mask:cc.Node,
    },


    onLoad() {
        this.hideTime = 0;
        if (CC_WECHATGAME) {
            this.boxShare();
        }
    },

    boxShare() {
        let that = this;
        wx.onHide(() => {
            let timeDate = Date.parse(new Date());
            this.hideTime = timeDate;
        })

        wx.onShow(() => {
            let timeDate = Date.parse(new Date());
            let value = timeDate - this.hideTime;
            if(value>=3000){
                that.node.runAction(cc.fadeOut(.3));
                uitools.loadingLayer('toastProp')
                that.node.destroy();
            }else{
                that.mask.active = true;
                that.mask.runAction(cc.fadeIn(.8));
                that.scheduleOnce(()=>{
                    that.mask.runAction(cc.fadeOut(1.5))
                },1.5)
            }
        })
    },

    addTouchEvent() {
        var that = this;
        this.lq.on(cc.Node.EventType.TOUCH_START, function (event) {
            tools.sharePicture();
        }, this)
        this.cha.on(cc.Node.EventType.TOUCH_START, function (event) {
            that.node.destroy();
        }, this)
    },
    start() {
        this.boxAnimate();
    },

    //宝箱动画
    boxAnimate() {
        var that = this;
        that.addTouchEvent();
        let bg = that.node.children[1];
        let xz = that.node.children[2];
        let box = that.node.children[4];
        let lq = that.node.children[5]
        let xzRote = cc.repeatForever(cc.rotateBy(4, 360));
        let boxFade1 = cc.scaleTo(.4, 1.3);
        let boxFade2 = cc.scaleTo(.2, 1);
        let lqFade = cc.fadeIn(.3);
        xz.opacity = 0;
        box.scale = 0;
        lq.opacity = 0;
        setInterval(()=>{
            if (bg.opacity < 200) {
                bg.opacity += 5
            };
          },1)
        box.runAction(cc.sequence(boxFade1, boxFade2));
        that.scheduleOnce(() => {
            xz.opacity = 255;
            xz.runAction(xzRote);
            lq.runAction(lqFade)
        }, .6)
    },

    // update (dt) {},
});
