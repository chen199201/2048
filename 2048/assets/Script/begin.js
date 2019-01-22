import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
var jumpGame = require('jumpGame');
const getRandomInt = function (min, max) {
    let ratio = Math.random();
    return min + Math.floor((max - min) * ratio);
};
cc.Class({
    extends: cc.Component,
    properties: {
        beginBtn: cc.Node,
        shareBtn: cc.Node,
        rankBtn: cc.Node,
        txBtn: cc.Node,
        yqBtn: cc.Node,
        qphBtn: cc.Node,
        syBtn: cc.Node,
        syBtna: cc.SpriteFrame,
        syBtnb: cc.SpriteFrame,
        mrhlBtn: cc.Node,
        playUi: cc.Node,
        jumpGame: cc.Prefab,
        gameImg1: cc.SpriteFrame,
        gameImg2: cc.SpriteFrame,
        gameImg3: cc.SpriteFrame,
        gameImg4: cc.SpriteFrame,
        signNode: cc.Node,
        moreImg: cc.SpriteFrame,
        noviceLb: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (CC_WECHATGAME) {
            window.wx.getStorage({
                key: 'usemsg',
                success: (res) => {
                    console.log('首页请求', res)
                    tools.wx_login(res.data);
                },
                fail: () => {
                    tools.login();
                }
            });
        }
        //开始按钮帧动画
        // var anim = this.beginBtn.getComponent(cc.Animation);
        // var animState = anim.play('start');
        // animState.wrapMode = cc.WrapMode.Normal;
        // animState.repeatCount = Infinity;
        this.boomNumber = cc.find('Canvas/cj/prop/boom/number').getComponent(cc.Label);
        this.hammerNumber = cc.find('Canvas/cj/prop/hammer/number').getComponent(cc.Label);
        this.refreshNumber = cc.find('Canvas/cj/prop/refresh/number').getComponent(cc.Label);
        let novice = cc.sys.localStorage.getItem('isNovice');
        if (novice == '') {
            this.ifNoveic();
        }
    },

    buttonFunc: function (event) {
        let button = event.target;
        var node = this.node.children[0];
        let that = this;
        if (this.rankBtn == button) {
            tools.getRankData();
        } else if (this.shareBtn == button) {
            setTimeout(() => {
                tools.sharePicture();
            }, 100);
        } else if (this.beginBtn == button) {
            this.notFile();
        } else if (this.txBtn == button) {
            window.wx.openCustomerServiceConversation({
                success: (res) => {
                }
            });
        } else if (this.yqBtn == button) {
            uitools.loadingLayer('Invitation')
        } else if (this.mrhlBtn == button) {
            GameConfig.IS_WHAT_PROP = getRandomInt(0, 3);
            if (GameConfig.viderDJ) {
                GameConfig.viderDJ = false;
                if (CC_WECHATGAME) {
                    wx.showToast({
                        icon: 'loading',
                        title: '加载中',
                        success: function () {
                            that.onVideoRelive();
                        }
                    })
                }
            }

        } else if (this.syBtn == button) {
            if (GameConfig.IS_GAME_MUSIC == true) {
                this.syBtn.children[0].getComponent(cc.Sprite).spriteFrame = this.syBtnb;
                GameConfig.IS_GAME_MUSIC = false;
            } else {
                GameConfig.IS_GAME_MUSIC = true;
                this.syBtn.children[0].getComponent(cc.Sprite).spriteFrame = this.syBtna;
            }
        } else if (this.qphBtn == button) {
            setTimeout(() => {
                tools.sharePicture();
            }, 100);
        } else if (this.signNode == button) {
            uitools.loadingLayer('Sign')
        }
        return true;
    },

    //获取更多游戏
    getMore() {
        var moreBox = cc.find('Canvas/jl/hideBox/content');
        var res = [
            { 'avatarUrl': this.gameImg1, 'name': '方块蹦蹦蹦', 'appId': 'wxe0672d2593b64b2c', 'path': 'index.html?channel=diantuo09' },
            { 'avatarUrl': this.gameImg2, 'name': '蛇皮大作战', 'appId': 'wx4f4d8af53cd620e5', 'path': 'index.html?channel=diantuo09' },
            { 'avatarUrl': this.gameImg3, 'name': '颜色方块大师', 'appId': 'wx0d6b65a65566823b', 'path': 'index.html?channel=diantuo09' },
            { 'avatarUrl': this.gameImg4, 'name': '成语赢现金', 'appId': 'wx304788d3cc66f4b6', 'path': 'pages/mainUi/index' },
            { 'avatarUrl': this.moreImg, 'name': '', 'appId': 'wx43728d5e0bec2447', 'path': 'pages/index/index' }
        ];
        for (let i = 0; i < res.length; i++) {
            let gameInfo = res[i];
            let item = cc.instantiate(this.jumpGame);
            item.getComponent('jumpGame').init(gameInfo);
            moreBox.addChild(item, 1, 1000);
        }
    },

    //是否有存档
    notFile() {
        let that = this;
        tools.postd({
            gm_id: 1002,
            uid: GameConfig.uid,
            score: 0
        },
            'add_user_score',
            function (res) {
                GameConfig.tjNum = res.data.data;
                let getFile = cc.sys.localStorage.getItem('isFile');
                if (getFile) {
                    cc.find('Canvas/jl/file').active = true;
                } else {
                    that.node.getChildByName('jl').active = false;
                    that.playUi.active = true;
                }
            }
        )
    },

    ifNoveic() {
        let that = this;
        this.noviec = cc.instantiate(this.noviceLb);
        this.node.addChild(this.noviec, 1, 1000);
        that.noviec.children[3].on(cc.Node.EventType.TOUCH_START,
            function (event) {
                that.newHand(5,5,0,true)
            });
        that.noviec.children[1].on(cc.Node.EventType.TOUCH_START,
            function (event) {
                that.newHand()
            });
    },
    //新手
    newHand(a,b,c,d){
        let that = this;
        tools.postd({
            gm_id: 1002,
            uid: GameConfig.uid,
            score: 0
        },
            'add_user_score',
            function (res) {
                if(d){
                    that.getDJ(a, b, c)
                }
                that.noviec.destroy();
                that.node.getChildByName('jl').active = false;
                that.playUi.active = true;
            }
        )
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

    //加道具
    pushDJ() {
        if (GameConfig.IS_WHAT_PROP == 0) {
            this.getDJ(2, 0, 0)
        } else if (GameConfig.IS_WHAT_PROP == 1) {
            this.getDJ(0, 2, 0)
        } else if (GameConfig.IS_WHAT_PROP == 2) {
            this.getDJ(0, 0, 2)
        }
        uitools.loadingLayer('mfdj');
    },


    //看视频得道具
    onVideoRelive(event) {
        var self = this;
        self.videoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-0048771f3f74d4ec' })
        if (this.videoAd != null) {
            this.videoAd.onLoad(() => {
                console.log('激励视频 广告加载成功')
            });
            this.videoAd.show()
                .catch(err => {
                    self.videoAd.load()
                        .then(() => self.videoAd.show())
                })
            this.videoAd.onClose(res => {
                if (!this.videoAd) return
                this.videoAd.offClose()
                if (res && res.isEnded || res === undefined) {
                    GameConfig.viderDJ = true;
                    self.pushDJ();
                }
                else {
                    GameConfig.viderDJ = true;
                    // 播放中途退出，不下发游戏奖励
                }
            })
        }
    },

    start() {
        uitools.setButtonClickEvents(this, this.beginBtn, 'buttonFunc', 1, false);
        uitools.setButtonClickEvents(this, this.shareBtn, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.rankBtn, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.txBtn, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.yqBtn, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.mrhlBtn, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.syBtn, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.qphBtn, 'buttonFunc');
        uitools.setButtonClickEvents(this, this.signNode, 'buttonFunc');
        return
        this.getMore();
        let LaunchOption = wx.getLaunchOptionsSync(); //获取小游戏启动参数：option 、scene等
        if (LaunchOption.shareTicket != undefined) {
        }

        if (LaunchOption.query.scene) {
            GameConfig.source = LaunchOption.query.scene;
        } else {
            GameConfig.source = 0;
        }
        if (LaunchOption.query.uid) {
            GameConfig.topid = LaunchOption.query.uid;
        } else {
            GameConfig.topid = 0;
        }
        if (tools.getItemByLocalStorage('UserPlayGame', true)) {
            cc.sys.localStorage.setItem('UserPlayGame', false);
            window.wx.setUserCloudStorage({
                KVDataList: [{ key: 'UserPlayGame', value: '1' }]
            });
        };
        wx.showShareMenu({ withShareTicket: true });
        wx.onShareAppMessage(function () {
            return {
                title: '据说玩这个游戏的人，已经锤烂了2048个屏幕！',
                imageUrl: 'src/sharePic.jpg',
                query: 'uid=' + GameConfig.uid,
                success: function () {
                    window.wx.request({
                        url: 'https://text.qkxz.com/index/users/user_share',
                        data: {
                            gm_id: 1002,
                            uid: GameConfig.uid
                        },
                        success: (res) => {
                            console.log('分享成功');
                        }
                    });
                }
            };
        });
    },

    // update (dt) {},
});
