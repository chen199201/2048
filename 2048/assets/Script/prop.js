import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
cc.Class({
    extends: cc.Component,
    properties: {
        boomBtn: cc.Node,
        hammerBtn: cc.Node,
        boomVideo: {
            default: null,
            url: cc.AudioClip
        },
        czVideo: {
            default: null,
            url: cc.AudioClip
        },
        boomImg: cc.Node,
        hammerImg: cc.Node,
        AniBox: cc.Node,
        zdDh: cc.SpriteFrame,
        czDh:cc.SpriteFrame,
        czyd: cc.Prefab
    },

    onLoad() {
        this.nima();
        this.addTouchEvent();
        this.isPropNum();
    },

    start() {

    },

    boomDh(pos) {
        let that = this;
        let zd = new cc.Node('zdDh');
        let spriteA = zd.addComponent(cc.Sprite);
        zd.scale = 0
        let biga = cc.scaleTo(.25, .63);
        let bigb = cc.scaleTo(.5, .8);
        zd.parent = this.AniBox;
        zd.setPosition(pos);
        spriteA.spriteFrame = that.zdDh;
        zd.runAction(cc.sequence(biga, cc.spawn(bigb, cc.fadeOut(.3))));
    },

    czDhFun(x,y) {
        let that = this;
        let cz = new cc.Node('czDh');
        let spriteA = cz.addComponent(cc.Sprite);
        cz.parent = this.AniBox;
        cz.setPosition(x,y);

        spriteA.spriteFrame = that.czDh;

        var seq = cc.repeat(
            cc.sequence(
                cc.rotateTo(.2, -40),
                cc.rotateTo(.2, 0)
            ), 2);

        let hide = cc.callFunc(()=>{
            cz.destroy();
            if (CC_WECHATGAME) { wx.triggerGC() }
        },this)
        cz.runAction(cc.sequence(seq,hide))
    },

    //放置音效
    boomGameAudio() {
        if (GameConfig.IS_GAME_MUSIC == true) {
            this.current = cc.audioEngine.play(this.boomVideo, false, 1);
        }
    },

    //放置音效
    czGameAudio() {
        if (GameConfig.IS_GAME_MUSIC == true) {
            this.current = cc.audioEngine.play(this.czVideo, false, 1);
        }
    },

    nima() {
        // cc.log(this.node)
        this.bgBox = cc.find('Canvas/cj/drawBox');
        this.liuchaoliang = this.bgBox.getComponent('bg_box');
        this.children_arr = [];
        this.children_arr = this.bgBox.children;
        this.boomNumber = cc.find('Canvas/cj/prop/boom/number').getComponent(cc.Label);
        this.boomNumber.string = 'x' + GameConfig.IS_GAME_PROP.boom;

        this.hammerNumber = cc.find('Canvas/cj/prop/hammer/number').getComponent(cc.Label);
        this.hammerNumber.string = 'x' + GameConfig.IS_GAME_PROP.hammer;
    },

    // 移动事件
    addTouchEvent() {
        var that = this;
        // 炸弹
        for (let i = 0; i < that.children_arr.length; i++) {
            let setPostiton = that.children_arr[i]._position;
            that.children_arr[i].on(cc.Node.EventType.TOUCH_START, function () {
                if (GameConfig.isboom) {
                    if (GameConfig.IS_GAME_PROP.boom > 0) {
                        if (that.children_arr[i].isFulled == true) {
                            GameConfig.IS_GAME_PROP.boom--;
                            if (GameConfig.boomNum != 0) {
                                GameConfig.yMFZD++;
                            }
                            that.reduceDJ({ gm_id: 1002, uid: GameConfig.uid, prop_1: 1 })
                            that.boomNumber.string = 'x' + GameConfig.IS_GAME_PROP.boom;
                            that.boomFunc(i)
                            that.boomDh(setPostiton)
                            that.boomGameAudio();
                            GameConfig.isboom = false;
                            that.zdBox.active = false;
                            if (CC_WECHATGAME) { wx.triggerGC() }
                        }
                    }
                }
            })


            that.children_arr[i].on(cc.Node.EventType.TOUCH_START, function () {
                if (GameConfig.iscz) {
                    if (GameConfig.IS_GAME_PROP.hammer > 0) {
                        if (that.children_arr[i].isFulled == true) {
                            GameConfig.IS_GAME_PROP.hammer--;
                            if (GameConfig.czNum != 0) {
                                GameConfig.yMFCZ++;
                                console.log(GameConfig.yMFCZ)
                            }
                            that.reduceDJ({ gm_id: 1002, uid: GameConfig.uid, prop_2: 1 })
                            that.hammerNumber.string = 'x' + GameConfig.IS_GAME_PROP.hammer;
                            that.hammerFun(i);
                            that.czDhFun(setPostiton.x+30,setPostiton.y+30)
                            that.czGameAudio();
                            GameConfig.iscz = false;
                            that.czBox.active = false;
                            if (CC_WECHATGAME) { wx.triggerGC() }
                        }
                    }
                }
            })
        }


        that.boomImg.on(cc.Node.EventType.TOUCH_START,
            function (event) {
                if (GameConfig.IS_GAME_PROP.boom <= 0) {
                    if (CC_WECHATGAME) {
                        tools.show_toast('道具用完啦')
                    }
                } else {
                    GameConfig.isboom = true;
                    GameConfig.iscz = false;
                    that.zdBox = cc.instantiate(that.czyd);
                    that.node.addChild(that.zdBox, 1, 1000);
                }
            });


        //锤子

        that.hammerImg.on(cc.Node.EventType.TOUCH_START,
            function (event) {
                if (GameConfig.IS_GAME_PROP.hammer <= 0) {
                    if (CC_WECHATGAME) {
                        tools.show_toast('道具用完啦')
                    }
                } else {
                    GameConfig.iscz = true;
                    GameConfig.isboom = false;
                    that.czBox = cc.instantiate(that.czyd);
                    that.node.addChild(that.czBox, 1, 1000);
                }
            });
    },


    isPropNum() {
        this.boomNumber.string = 'x' + GameConfig.IS_GAME_PROP.boom;
        this.hammerNumber.string = 'x' + GameConfig.IS_GAME_PROP.hammer;
    },


    boomFunc(boomIndex) {
        switch (boomIndex) {
            case 0: {
                this.boomNum(0, 0);
                this.boomNum(0, 1);
                this.boomNum(0, 4);
                break;
            }
            case 1: {
                this.boomNum(1, 0);
                this.boomNum(1, 1);
                this.boomNum(0, 2);
                this.boomNum(0, 5);
                break;
            }
            case 2: {
                this.boomNum(2, 1);
                this.boomNum(2, 2);
                this.boomNum(2, 3);
                this.boomNum(2, 6);
                break;
            }
            case 3: {
                this.boomNum(3, 2);
                this.boomNum(3, 3);
                this.boomNum(3, 7);
                break;
            }
            case 4: {
                this.boomNum(4, 0);
                this.boomNum(4, 4);
                this.boomNum(4, 5);
                this.boomNum(4, 8);
                break;
            }
            case 5: {
                this.boomNum(5, 1);
                this.boomNum(5, 4);
                this.boomNum(5, 5);
                this.boomNum(5, 6);
                this.boomNum(5, 9);
                break;
            }
            case 6: {
                this.boomNum(6, 2);
                this.boomNum(6, 5);
                this.boomNum(6, 6);
                this.boomNum(6, 7);
                this.boomNum(6, 10);
                break;
            }
            case 7: {
                this.boomNum(7, 3);
                this.boomNum(7, 6);
                this.boomNum(7, 7);
                this.boomNum(7, 11);
                break;
            }
            case 8: {
                this.boomNum(8, 4);
                this.boomNum(8, 8);
                this.boomNum(8, 9);
                this.boomNum(8, 12);
                break;
            }
            case 9: {
                this.boomNum(9, 5);
                this.boomNum(9, 8);
                this.boomNum(9, 9);
                this.boomNum(9, 10);
                this.boomNum(9, 13);
                break;
            }
            case 10: {
                this.boomNum(10, 6);
                this.boomNum(10, 9);
                this.boomNum(10, 10);
                this.boomNum(10, 11);
                this.boomNum(10, 14);
                break;
            }
            case 11: {
                this.boomNum(11, 7);
                this.boomNum(11, 10);
                this.boomNum(11, 11);
                this.boomNum(11, 15);
                break;
            }
            case 12: {
                this.boomNum(12, 8);
                this.boomNum(12, 12);
                this.boomNum(12, 13);
                break;
            }
            case 13: {
                this.boomNum(13, 9);
                this.boomNum(13, 12);
                this.boomNum(13, 13);
                this.boomNum(13, 14);
                break;
            }
            case 14: {
                this.boomNum(14, 10);
                this.boomNum(14, 13);
                this.boomNum(14, 14);
                this.boomNum(14, 15);
                break;
            }
            case 15: {
                this.boomNum(15, 11);
                this.boomNum(15, 14);
                this.boomNum(15, 15);
                break;
            }
        }
    },

    hammerFun(hammerIndex) {
        switch (hammerIndex) {
            case 0: {
                this.hammerNum(0, 0);
                break;
            }
            case 1: {
                this.hammerNum(1, 1);
                break;
            }
            case 2: {
                this.hammerNum(2, 2);
                break;
            }
            case 3: {
                this.hammerNum(3, 3);
                break;
            }
            case 4: {
                this.hammerNum(4, 4);
                break;
            }
            case 5: {
                this.hammerNum(5, 5);
                break;
            }
            case 6: {
                this.hammerNum(6, 6);
                break;
            }
            case 7: {
                this.hammerNum(7, 7);
                break;
            }
            case 8: {
                this.hammerNum(8, 8);
                break;
            }
            case 9: {
                this.hammerNum(9, 9);
                break;
            }
            case 10: {
                this.hammerNum(10, 10);
                break;
            }
            case 11: {
                this.hammerNum(11, 11);
                break;
            }
            case 12: {
                this.hammerNum(12, 12);
                break;
            }
            case 13: {
                this.hammerNum(13, 13);
                break;
            }
            case 14: {
                this.hammerNum(14, 14);
                break;
            }
            case 15: {
                this.hammerNum(15, 15);
                break;
            }
        }
    },

    //炸弹消除
    boomNum(boomIndex, index) {
        var that = this;
        const finished = cc.callFunc(() => {
            that.children_arr[index].isFulled = false;
            that.children_arr[index].children[0].getComponent(cc.Sprite).spriteFrame = null;
            that.children_arr[index].children[0].opacity = 255;
        }, this);
        that.children_arr[index].children[0].runAction(cc.sequence(cc.scaleTo(.5, 0), finished));
    },
    hammerNum(boomIndex, index) {
        var that = this;
        const finished = cc.callFunc(() => {
            that.children_arr[index].isFulled = false;
            that.children_arr[index].children[0].getComponent(cc.Sprite).spriteFrame = null;
            that.children_arr[index].children[0].opacity = 255;
        }, this);
        that.children_arr[index].children[0].runAction(cc.sequence(cc.scaleTo(.5, 0), finished));
    },


    reduceDJ(data) {
        tools.postd(
            data,
            'dec_prop', (res) => {
                GameConfig.IS_GAME_PROP.boom = res.data.data.prop_1
                GameConfig.IS_GAME_PROP.hammer = res.data.data.prop_2
                GameConfig.IS_GAME_PROP.refresh = res.data.data.prop_3
                if (GameConfig.IS_GAME_PROP.boom <= 0) {
                    this.boomImg.opacity = 0;
                }
                if (GameConfig.IS_GAME_PROP.hammer <= 0) {
                    this.hammerImg.opacity = 0;
                }
            });
    },
    update(dt) {
    },
});
