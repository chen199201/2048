import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
var margin;  //与每个格子的距离
var jq = 0; //消除音效
var hold = 0;//控制2048动画
var holdAudioA = 0; //控制音效
let score;  //当前分数
let bestscore = 0;//历史最高分
const getRandomInt = function (min, max) {
    let ratio = Math.random();
    return min + Math.floor((max - min) * ratio);
};

cc.Class({
    extends: cc.Component,
    properties: {
        numImg0: {
            default: null,
            type: cc.SpriteFrame,
        },
        numImg1: {
            default: null,
            type: cc.SpriteFrame
        },
        numImg2: {
            default: null,
            type: cc.SpriteFrame
        },
        numImg3: {
            default: null,
            type: cc.SpriteFrame
        },
        numImg4: {
            default: null,
            type: cc.SpriteFrame
        },

        numImg5: {
            default: null,
            type: cc.SpriteFrame
        },
        numImg6: {
            default: null,
            type: cc.SpriteFrame
        },
        numImg7: {
            default: null,
            type: cc.SpriteFrame
        },
        numImg8: {
            default: null,
            type: cc.SpriteFrame
        },
        numImg9: {
            default: null,
            type: cc.SpriteFrame
        },
        numImg10: {
            default: null,
            type: cc.SpriteFrame
        },
        refreshBtn: cc.Node,
        backBtn: cc.Node,
        sxa: {
            default: null,
            type: cc.SpriteFrame
        },
        audios: {           //放置音效
            default: null,
            url: cc.AudioClip
        },
        HAudios: {           //合成音效1
            default: null,
            url: cc.AudioClip
        },
        HAudiosD: {           //合成音效4
            default: null,
            url: cc.AudioClip
        },
        HAudiosE: {           //合成音效5
            default: null,
            url: cc.AudioClip
        },
        HAudiosF: {           //合成音效6
            default: null,
            url: cc.AudioClip
        },
        H2048: {               //2048音效
            default: null,
            url: cc.AudioClip
        },
        reVideo: {           //刷新音效
            default: null,
            url: cc.AudioClip
        },
        select: {           //提示图片
            default: null,
            type: cc.SpriteFrame
        },
        nodeA: cc.SpriteFrame,  //2048动画
        nodeB: cc.SpriteFrame,  //2048动画
        nodeC: cc.SpriteFrame,  //2048动画
        AniBox: cc.Node,
        wnProp: cc.Node,   //随机道具
        zyz: cc.Node,        //转一转
        handbg: cc.Node,     //新手引导背景

    },

    onLoad() {
        var that = this;
        // tools.createBan();
        this.nima();
        this.boomImg = cc.find('Canvas/cj/prop/boom').getComponent(cc.Sprite);
        this.hammerImg = cc.find('Canvas/cj/prop/hammer').getComponent(cc.Sprite);
        this.refreshImg = cc.find('Canvas/cj/prop/refresh').getComponent(cc.Sprite);
        this.boomNumber = cc.find('Canvas/cj/prop/boom/number').getComponent(cc.Label);
        this.hammerNumber = cc.find('Canvas/cj/prop/hammer/number').getComponent(cc.Label);
        this.refreshNumber = cc.find('Canvas/cj/prop/refresh/number').getComponent(cc.Label);
        // cc.game.on(cc.game.EVENT_HIDE, function () {
        //     that.fileGame();
        // });
        this.getFile();
    },

    //新手教程
    noviceFun() {
        let that = this;
        let novice = cc.sys.localStorage.getItem('isNovice');
        if (novice == '') {
            cc.sys.localStorage.setItem('isNovice', 'new');
            that.handbg.active = true;
            that.handbg.runAction(cc.fadeIn(.5));
            let hide = cc.callFunc(()=>{
                that.handbg.destroy();  
                GameConfig.IS_GAME_BANNER.show();
            },this)
            this.handbg.on(cc.Node.EventType.TOUCH_START, function () {
                that.handbg.runAction(cc.sequence(cc.fadeOut(.5),hide));
            }, this)
        }else{
            GameConfig.IS_GAME_BANNER.show();
        }
    },



    //圈圈转动
    rote() {
        this.zyz.runAction(cc.repeatForever(cc.rotateBy(8, 360)))
    },

    //放置音效
    gameAudio() {
        if (GameConfig.IS_GAME_MUSIC == true) {
            this.current = cc.audioEngine.play(this.audios, false, 1);
        }
    },

    //2048音效
    HBest() {
        if (GameConfig.IS_GAME_MUSIC == true) {
            this.current = cc.audioEngine.play(this.H2048, false, 1);
        }
    },

    //合成音效
    HgameAudio() {
        let that = this;
        if (GameConfig.IS_GAME_MUSIC == true) {
            if (jq >= 1 || jq <= 3) {
                holdAudioA++;
                if (holdAudioA == 1) {
                    that.current = cc.audioEngine.play(that.HAudios, false, 1);
                }
            }
            if (jq == 4) {
                setTimeout(() => {
                    cc.audioEngine.pause(that.current);
                    that.current = null;
                    that.current = cc.audioEngine.play(that.HAudiosD, false, 1);
                }, 500);
            } else if (jq == 5) {
                setTimeout(() => {
                    cc.audioEngine.pause(that.current);
                    that.current = null;
                    that.current = cc.audioEngine.play(that.HAudiosE, false, 1);

                }, 1000);

            } else if (jq == 6) {
                setTimeout(() => {
                    cc.audioEngine.pause(that.current);
                    that.current = null;
                    that.current = cc.audioEngine.play(that.HAudiosF, false, 1);

                }, 1500);
            }
        }
    },

    //刷新音效
    reGameAudio() {
        if (GameConfig.IS_GAME_MUSIC == true) {
            this.current = cc.audioEngine.play(this.reVideo, false, 1);
        }
    },

    // onEnable() {
    //     this.noviceFun();
    //     this.getFile();
    //     this.getData();
    //     if (CC_WECHATGAME) { wx.triggerGC() }
    //     this.node.x = 0;
    //     this.node.y = -460;
    // },

    //获取存档
    getFile() {
        let fileList = cc.sys.localStorage.getItem('fileGame');
        let isFile = cc.sys.localStorage.getItem('isFile');
        let myScore = cc.sys.localStorage.getItem('myScore');
        let lookZD = cc.sys.localStorage.getItem('lookZD');
        let lookCZ = cc.sys.localStorage.getItem('lookCZ');
        let lookXS = cc.sys.localStorage.getItem('lookXS');
        let fhNum = cc.sys.localStorage.getItem('fhNum');
        let level = cc.sys.localStorage.getItem('level');
        if (isFile) {
            cc.find('Canvas/cj/index_score').getComponent(cc.Label).string = myScore;
            GameConfig.boomNum = lookZD;
            GameConfig.czNum = lookCZ;
            GameConfig.sxNum = lookXS;
            GameConfig.fhNum = fhNum;
            GameConfig.GameScore = myScore;
            GameConfig.level = level;
            for (let i = 0; i < this.children_arr.length; i++) {
                if (fileList[i] == null || fileList[i] == '') {
                    fileList[i] = '';
                } else {
                    if (fileList[i]._name == 'num2') {
                        this.children_arr[i].isFulled = true;
                        this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame = this[`numImg${0}`]
                    }
                    if (fileList[i]._name == 'num4') {
                        this.children_arr[i].isFulled = true;
                        this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame = this[`numImg${1}`]
                    }
                    if (fileList[i]._name == 'num8') {
                        this.children_arr[i].isFulled = true;
                        this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame = this[`numImg${2}`]
                    }
                    if (fileList[i]._name == 'num16') {
                        this.children_arr[i].isFulled = true;
                        this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame = this[`numImg${3}`]
                    }
                    if (fileList[i]._name == 'num32') {
                        this.children_arr[i].isFulled = true;
                        this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame = this[`numImg${4}`]
                    }
                    if (fileList[i]._name == 'num64') {
                        this.children_arr[i].isFulled = true;
                        this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame = this[`numImg${5}`]
                    }
                    if (fileList[i]._name == 'num128') {
                        this.children_arr[i].isFulled = true;
                        this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame = this[`numImg${6}`]
                    }
                    if (fileList[i]._name == 'num256') {
                        this.children_arr[i].isFulled = true;
                        this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame = this[`numImg${7}`]
                    }
                    if (fileList[i]._name == 'num512') {
                        this.children_arr[i].isFulled = true;
                        this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame = this[`numImg${8}`]
                    }
                    if (fileList[i]._name == 'num1024') {
                        this.children_arr[i].isFulled = true;
                        this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame = this[`numImg${9}`]
                    }
                }
            }
        } else {
            GameConfig.boomNum = lookZD;
            GameConfig.czNum = lookCZ;
            GameConfig.sxNum = lookXS;
            GameConfig.level = level;
        }
    },

    // onDisable() {
    //     let i = getRandomInt(0, 3);
    //     GameConfig.IS_GAME_BANNER.hide();
    //     this.fileGame();
    //     if (CC_WECHATGAME) { wx.triggerGC() };
    //     this.node.children[0].getComponent(cc.Sprite).spriteFrame = this[`numImg${i}`]
    // },

    fileGame() {
        var fileList = [];
        for (let i = 0; i < this.children_arr.length; i++) {
            fileList.push(this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame);
            if (fileList[i] != null || fileList[i] != '') {
                GameConfig.file = true;
            }
        }
        cc.sys.localStorage.setItem('isFile', GameConfig.file);
        cc.sys.localStorage.setItem('fileGame', fileList);
        cc.sys.localStorage.setItem('myScore', GameConfig.GameScore);
        cc.sys.localStorage.setItem('level', GameConfig.level);

    },

    nima() {
        this.bgBox = cc.find('Canvas/cj/drawBox');
        this.liuchaoliang = this.bgBox.getComponent('bg_box');
        this.children_arr = [];
        this.children_arr = this.bgBox.children;
        this.lianJi = 0; //连消
        this.refreshNumber = cc.find('Canvas/cj/prop/refresh/number').getComponent(cc.Label);   //充值道具的数量
        this.refreshNumber.string = 'x' + GameConfig.IS_GAME_PROP.refresh;
        this.lastArr = [];//最后的数字
        this.audioArr = [];
        if (CC_WECHATGAME) {
            wx.triggerGC()
        }
    },

    //2048消除动画
    bestBoom(pos) {
        let that = this;
        let nodeA = new cc.Node('nodeAImg');
        let nodeB = new cc.Node('nodeBImg');
        let nodeC = new cc.Node('nodeCImg');
        let spriteA = nodeA.addComponent(cc.Sprite);
        let spriteB = nodeB.addComponent(cc.Sprite);
        let spriteC = nodeC.addComponent(cc.Sprite);
        let biga = cc.scaleTo(.25, 3.2);
        let bigb = cc.scaleTo(.25, 3.2);
        let bigc = cc.scaleTo(.25, 3.2);
        nodeA.parent = this.AniBox;
        nodeB.parent = this.AniBox;
        nodeC.parent = this.AniBox;
        nodeA.setPosition(pos);
        nodeB.setPosition(pos);
        nodeC.setPosition(pos);
        spriteA.spriteFrame = this.nodeA;
        spriteB.spriteFrame = this.nodeB;
        spriteC.spriteFrame = this.nodeC;
        nodeA.runAction(biga);
        setTimeout(() => {
            nodeB.runAction(bigb);
        }, 150)
        setTimeout(() => {
            nodeC.runAction(bigc);
        }, 300)
        setTimeout(() => {
            nodeA.destroy();
            nodeB.destroy();
            nodeC.destroy();
            cc.log(that.children_arr)
        }, 600);
        that.HBest();
    },

    createProp(reProp) {
        var that = this;
        let node = new cc.Node('reImg');
        node.parent = reProp;
        let sprite = node.addComponent(cc.Sprite);
        let x = node.x * node.parent.scaleX + node.parent.x;
        let y = node.y * node.parent.scaleY + node.parent.y;
        sprite.spriteFrame = this.sxa;
        node.x = x;
        node.y = y;
        let setTimes = cc.callFunc(() => {
            node.x = 0;
            node.y = 0;
        })
        node.runAction(cc.spawn(setTimes, cc.scaleTo(.5, 1.2), cc.moveTo(.5, cc.v2(293, -460))))
        setTimeout(() => {
            let nodeNum = cc.scaleTo(.1, 1)
            let bigNodeNum = cc.scaleTo(.1, 1.2);
            let smaNodeNum = cc.scaleTo(.1, .85);
            that.refreshBtn.runAction(cc.sequence(bigNodeNum, smaNodeNum, nodeNum));
            node.destroy();
        }, 500);
    },

    // 创建首张图片
    createNum(sjx, sjy) {
        let i = getRandomInt(sjx, sjy);
        let node = new cc.Node('numberImg');
        let sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this[`numImg${i}`];
        node.x = 0;
        node.y = 0;
        node.parent = this.node;
        this.node.ox = this.node.x;
        this.node.oy = this.node.y;
    },

    //获取历史最高分
    getData() {
        tools.postd({ gm_id: 1002, openid: GameConfig.openid }, 'get_user_paihang', (res, event) => {
            console.log('获取世界排行榜回调数据', res);
            var resData = res.data.data;
            for (let i = 0; i < resData.length; i++) {
                if (resData[i].nickname == GameConfig.nickname) {
                    bestscore = resData[i].score;
                    if (bestscore == '') {
                        cc.find('Canvas/cj/Highest/score').getComponent(cc.Label).string = '历史最高:0'
                    } else {
                        cc.find('Canvas/cj/Highest/score').getComponent(cc.Label).string = '历史最高:' + bestscore;
                    }
                }
            }
        });
    },

    // 移动事件
    addTouchEvent() {
        var that = this;
        this.node.on(cc.Node.EventType.TOUCH_START,      //点击
            function (event) {
                that.node.setScale(0.92);
                this.node.x = 0;
                this.node.y = -460;
            }, this)

        this.node.on(cc.Node.EventType.TOUCH_MOVE,      //移动
            function (event) {
                const { x, y } = event.touch.getDelta();
                that.node.x += x;
                that.node.y += y;
                that.pengzhuang();
            }, this)
        this.node.on(cc.Node.EventType.TOUCH_END,       //放置
            function (event) {
                const { x, y } = event.touch.getDelta();
                that.node.setScale(1)
                if (margin < 85) {
                    that.tian_chong();
                    that.gameAudio();
                } else {
                    this.node.x = 0;
                    this.node.y = -460;
                }
                for (let i = 0; i < this.children_arr.length; i++) {
                    this.children_arr[i].children[1].getComponent(cc.Sprite).spriteFrame = '';
                }
            }, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,
            function (event) {
                this.node.x = 0;
                this.node.y = -460;
            }, this)


        //随机道具
        that.wnProp.on('touchstart', function (event) {
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
        })
        //刷新数字;
        that.refreshBtn.on('touchstart', function (event) {
            if (GameConfig.IS_GAME_PROP.refresh <= 0) {
                if (CC_WECHATGAME) {
                    tools.show_toast('道具用完啦')
                }
            } else {
                that.reGameAudio();
                GameConfig.IS_GAME_PROP.refresh--;
                if (GameConfig.sxNum != 0) {
                    GameConfig.yMFSX++;
                    console.log(GameConfig.yMFSX);
                }
                that.reduceDJ({ gm_id: 1002, uid: GameConfig.uid, prop_3: 1 })
                that.refreshNumber.string = 'x' + GameConfig.IS_GAME_PROP.refresh;
                that.chong_sheng(0, 9);
            }
        });
    },

    buttonFunc: function (event) {
        let button = event.target;
        if (this.backBtn == button) {
            uitools.loadingLayer('menuToast');
        }
        return true;
    },

    // 检测是否碰撞
    pengzhuang() {
        const zuobiao = this.node.children[0];
        this.qi_chong_he = [];
        this.tian_chong_he = [];
        const pos = this.node._position.add(zuobiao._position, pos);
        const qi_node = this.checkp(pos);
        this.qi_chong_he.push(qi_node);
        this.tian_chong_he.push(zuobiao);
    },

    // 是否相交
    checkp(pos) {
        let dist = 85;
        const children_arr = this.children_arr;
        for (let i = 0; i < children_arr.length; i++) {
            const chil = children_arr[i];
            const node_dist = chil._position.sub(pos).mag();
            margin = node_dist;
            if (node_dist < dist) {
                // if (chil.isFulled != true) {
                //     chil.children[1].getComponent(cc.Sprite).spriteFrame = this.select;
                // }
                return chil
            } else {
                for (let i = 0; i < this.children_arr.length; i++) {
                    this.children_arr[i].children[1] ? (this.children_arr[i].children[1].getComponent(cc.Sprite).spriteFrame = '') : '';
                }

            }
        }
    },

    //判断是否可以填充
    checkT() {
        const cc = this.qi_chong_he;
        for (let o = 0; o < cc.length; o++) {
            const cco = cc[o];
            if (cco.isFulled) {
                return false
            } else {
                return true
            }
        }
    },

    //填充函数
    tian_chong() {
        let nodeNum = cc.scaleTo(.1, 1)
        let bigNodeNum = cc.scaleTo(.1, 1.2);
        let smaNodeNum = cc.scaleTo(.1, .85);
        if (this.checkT()) {
            GameConfig.level++;
            const ccTq = this.qi_chong_he[0];   //ccTq.nodeIndex就是当前节点的下标；
            this.nodeIndex = ccTq.nodeIndex;
            const cctnodeq = this.tian_chong_he[0];
            const cctqChi = ccTq.getChildByName('newFarme');
            const cctnodeqs = cctnodeq.getComponent(cc.Sprite).spriteFrame;
            cctqChi.getComponent(cc.Sprite).spriteFrame = cctnodeqs;
            ccTq.isFulled = true;
            if (GameConfig.level < 20) {
                this.chong_sheng(0, 4);
            } else if (GameConfig.level >= 20 && GameConfig.level < 40) {
                this.chong_sheng(0, 5);
            } else if (GameConfig.level >= 40 && GameConfig.level < 60) {
                this.chong_sheng(0, 6);
            } else if (GameConfig.level >= 60 && GameConfig.level < 80) {
                this.chong_sheng(0, 7);
            } else if (GameConfig.level >= 80 && GameConfig.level < 100) {
                this.chong_sheng(0, 8);
            } else if (GameConfig.level >= 100 && GameConfig.level < 120) {
                this.chong_sheng(0, 8);
            } else if (GameConfig.level >= 120) {
                this.chong_sheng(0, 9);
            }
            this.gameOver();
            ccTq.children[0].runAction(cc.sequence(bigNodeNum, smaNodeNum, nodeNum, this.matchRule(this.nodeIndex)));
            ccTq.children[0].x = 0;
            ccTq.children[0].y = 0;
        } else {
            this.node.x = 0;
            this.node.y = -460;
        }
    },
    //加分
    pushScore(num) {
        GameConfig.GameScore += parseInt(num.substring(3));
        const str = GameConfig.GameScore;
        cc.find('Canvas/cj/index_score').getComponent(cc.Label).string = str;
        if (GameConfig.GameScore > bestscore) {
            cc.find('Canvas/cj/Highest/score').getComponent(cc.Label).string = '历史最高:' + str;
        }
    },


    //第16个数字
    lastCreate(indexNumber) {
        let numberName = this.children_arr[indexNumber].children[0].getComponent(cc.Sprite).spriteFrame.name;
        this.lastArr.push(numberName);
        let firstName = this.lastArr[0];
        console.log(this.lastArr, firstName)
        if (firstName == 'num2') {
            this.chong_sheng(0, 0)
        }
        if (firstName == 'num4') {
            this.chong_sheng(1, 1)
        }
        if (firstName == 'num8') {
            this.chong_sheng(2, 2)
        }
        if (firstName == 'num16') {
            this.chong_sheng(3, 3)
        }
        if (firstName == 'num32') {
            this.chong_sheng(4, 4)
        }
        if (firstName == 'num64') {
            this.chong_sheng(5, 5)
        }
        if (firstName == 'num128') {
            this.chong_sheng(6, 6)
        }
        if (firstName == 'num256') {
            this.chong_sheng(7, 7)
        }
        if (firstName == 'num512') {
            this.chong_sheng(8, 8)
        }
        if (firstName == 'num1024') {
            this.chong_sheng(9, 9)
        }
    },


    //送分
    lastNum(indexNumber) {
        let that = this;
        switch (indexNumber) {
            case 0: {
                that.lastCreate(1);
                that.lastCreate(4);
                break;
            }
            case 1: {
                that.lastCreate(0);
                that.lastCreate(2);
                that.lastCreate(5);
                break;
            }
            case 2: {
                that.lastCreate(1);
                that.lastCreate(3);
                that.lastCreate(6);
                break;
            }
            case 3: {
                that.lastCreate(2);
                that.lastCreate(7);
                break;
            }
            case 4: {
                that.lastCreate(0);
                that.lastCreate(5);
                that.lastCreate(8);
                break;
            }
            case 5: {
                that.lastCreate(1);
                that.lastCreate(4);
                that.lastCreate(6);
                that.lastCreate(9);
                break;
            }
            case 6: {
                that.lastCreate(2);
                that.lastCreate(5);
                that.lastCreate(7);
                that.lastCreate(10);
                break;
            }
            case 7: {
                that.lastCreate(3);
                that.lastCreate(6);
                that.lastCreate(11);
                break;
            }
            case 8: {
                that.lastCreate(4);
                that.lastCreate(9);
                that.lastCreate(12);
                break;
            }
            case 9: {
                that.lastCreate(5);
                that.lastCreate(8);
                that.lastCreate(10);
                that.lastCreate(13);
                break;
            }
            case 10: {
                that.lastCreate(6);
                that.lastCreate(9);
                that.lastCreate(11);
                that.lastCreate(14);
                break;
            }
            case 11: {
                that.lastCreate(7);
                that.lastCreate(10);
                that.lastCreate(15);
                break;
            }
            case 12: {
                that.lastCreate(8);
                that.lastCreate(13);
                break;
            }
            case 13: {
                that.lastCreate(9);
                that.lastCreate(12);
                that.lastCreate(14);
                break;
            }
            case 14: {
                that.lastCreate(10);
                that.lastCreate(13);
                that.lastCreate(15);
                break;
            }
            case 15: {
                that.lastCreate(11);
                that.lastCreate(14);
                break;
            }
        }
    },

    // //游戏结束
    gameOver() {
        var that = this;
        this.trueArr = [];
        for (let i = 0; i < this.children_arr.length; i++) {
            let num2048 = this.children_arr[i].children[0] ? this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame || '' : '';
            if (num2048.name == 'num2048') {
                hold++;
                if (hold == 1) {
                    var setPosition = this.children_arr[i]._position;
                    this.bestNum(i);
                    this.bestBoom(setPosition);
                    let o = getRandomInt(1, 11);
                    if (o > 4) {
                        this.scheduleOnce(() => {
                            if (GameConfig.IS_GAME_ONEDAY != 0) {
                                uitools.loadingLayer('toastBox')
                            }
                        }, .3)
                    }
                }
            }
            if (this.children_arr[i].isFulled == true) {
                this.trueArr.push(this.children_arr[i].isFulled);
            }
        }
        if (that.trueArr.length >= 15) {
            that.node.opacity = 0;
            let a = getRandomInt(1, 11);
            if (a > 6) {
                for (let i = 0; i < that.children_arr.length; i++) {
                    if (that.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame == null) {
                        that.lastNum(that.children_arr[i].nodeIndex);
                        that.lastArr = [];
                    }
                }
            }
        }
        that.scheduleOnce(function () {
            that.node.opacity = 255;
            if (that.trueArr.length == 16) {
                that.sendScore();
                GameConfig.IS_GAME_BANNER.hide();
                that.level = 0;
                cc.find("Canvas/cj").active = false;
                if (GameConfig.fhNum == 2) {
                    uitools.loadingLayer('gameover');
                    GameConfig.fhNum = 0;
                } else {
                    uitools.loadingLayer('timeover')
                }
            }
        }, .35)
        if (this.lianJi < 3) {
            this.lianJi = 0;
        } else {
            GameConfig.IS_GAME_PROP.refresh++;
            let i = getRandomInt(1, 11);
            if (i > 7) {
                this.mfDJ(0, 0, 1)
                this.createProp(that.children_arr[that.nodeIndex]);
                console.log('获得道具', GameConfig.IS_GAME_PROP.refresh);
                this.refreshNumber.string = 'x' + GameConfig.IS_GAME_PROP.refresh;
                this.lianJi = 0;
            } else {
                this.lianJi = 0;
                this.scheduleOnce(() => {
                    if (GameConfig.IS_GAME_ONEDAY != 0) {
                        uitools.loadingLayer('toastBox')
                    }
                }, .3)
            }

        }
    },

    //2048清除
    bestNum(boomIndex) {
        switch (boomIndex) {
            case 0: {
                this.bestBoomNum(0, 0);
                this.bestBoomNum(0, 1);
                this.bestBoomNum(0, 4);
                this.bestBoomNum(0, 5);
                break;
            }
            case 1: {
                this.bestBoomNum(1, 0);
                this.bestBoomNum(1, 1);
                this.bestBoomNum(1, 2);
                this.bestBoomNum(1, 4);
                this.bestBoomNum(1, 5);
                this.bestBoomNum(1, 6);
                break;
            }
            case 2: {
                this.bestBoomNum(2, 1);
                this.bestBoomNum(2, 2);
                this.bestBoomNum(2, 3);
                this.bestBoomNum(2, 5);
                this.bestBoomNum(2, 6);
                this.bestBoomNum(2, 7);
                break;
            }
            case 3: {
                this.bestBoomNum(3, 2);
                this.bestBoomNum(3, 3);
                this.bestBoomNum(3, 6);
                this.bestBoomNum(3, 7);
                break;
            }
            case 4: {
                this.bestBoomNum(4, 0);
                this.bestBoomNum(4, 1);
                this.bestBoomNum(4, 4);
                this.bestBoomNum(4, 5);
                this.bestBoomNum(4, 8);
                this.bestBoomNum(4, 9);
                break;
            }
            case 5: {
                this.bestBoomNum(5, 0);
                this.bestBoomNum(5, 1);
                this.bestBoomNum(5, 2);
                this.bestBoomNum(5, 4);
                this.bestBoomNum(5, 5);
                this.bestBoomNum(5, 6);
                this.bestBoomNum(5, 8);
                this.bestBoomNum(5, 9);
                this.bestBoomNum(5, 10);

                break;
            }
            case 6: {
                this.bestBoomNum(6, 1);
                this.bestBoomNum(6, 2);
                this.bestBoomNum(6, 3);
                this.bestBoomNum(6, 5);
                this.bestBoomNum(6, 6);
                this.bestBoomNum(6, 7);
                this.bestBoomNum(6, 9);
                this.bestBoomNum(6, 10);
                this.bestBoomNum(6, 11);
                break;
            }
            case 7: {
                this.bestBoomNum(7, 2);
                this.bestBoomNum(7, 3);
                this.bestBoomNum(7, 6);
                this.bestBoomNum(7, 7);
                this.bestBoomNum(7, 10);
                this.bestBoomNum(7, 11);
                break;
            }
            case 8: {
                this.bestBoomNum(8, 4);
                this.bestBoomNum(8, 5);
                this.bestBoomNum(8, 8);
                this.bestBoomNum(8, 9);
                this.bestBoomNum(8, 12);
                this.bestBoomNum(8, 13);
                break;
            }
            case 9: {
                this.bestBoomNum(9, 4);
                this.bestBoomNum(9, 5);
                this.bestBoomNum(9, 6);
                this.bestBoomNum(9, 8);
                this.bestBoomNum(9, 9);
                this.bestBoomNum(9, 10);
                this.bestBoomNum(9, 12);
                this.bestBoomNum(9, 13);
                this.bestBoomNum(9, 14);
                break;
            }
            case 10: {
                this.bestBoomNum(10, 5);
                this.bestBoomNum(10, 6);
                this.bestBoomNum(10, 7);
                this.bestBoomNum(10, 9);
                this.bestBoomNum(10, 10);
                this.bestBoomNum(10, 11);
                this.bestBoomNum(10, 13);
                this.bestBoomNum(10, 14);
                this.bestBoomNum(10, 15);
                break;
            }
            case 11: {
                this.bestBoomNum(11, 6);
                this.bestBoomNum(11, 7);
                this.bestBoomNum(11, 10);
                this.bestBoomNum(11, 11);
                this.bestBoomNum(11, 14);
                this.bestBoomNum(11, 15);
                break;
            }
            case 12: {
                this.bestBoomNum(12, 8);
                this.bestBoomNum(12, 9);
                this.bestBoomNum(12, 12);
                this.bestBoomNum(12, 13);
                break;
            }
            case 13: {
                this.bestBoomNum(13, 8);
                this.bestBoomNum(13, 9);
                this.bestBoomNum(13, 10);
                this.bestBoomNum(13, 12);
                this.bestBoomNum(13, 13);
                this.bestBoomNum(13, 14);
                break;
            }
            case 14: {
                this.bestBoomNum(14, 9);
                this.bestBoomNum(14, 10);
                this.bestBoomNum(14, 11);
                this.bestBoomNum(14, 13);
                this.bestBoomNum(14, 14);
                this.bestBoomNum(14, 15);
                break;
            }
            case 15: {
                this.bestBoomNum(15, 10);
                this.bestBoomNum(15, 11);
                this.bestBoomNum(15, 14);
                this.bestBoomNum(15, 15);
                break;
            }
        }
    },

    // 匹配规则
    matchRule(ruleNum) {
        switch (ruleNum) {
            case 0:
                if (this.getImg(0, 1)) {
                    this.delFun(0, 1)
                }
                if (this.getImg(0, 4)) {
                    this.delFun(0, 4)
                }
                break;
            case 1:
                if (this.getImg(1, 0)) {
                    this.delFun(1, 0);
                }
                if (this.getImg(1, 2)) {
                    this.delFun(1, 2);
                }
                if (this.getImg(1, 5)) {
                    this.delFun(1, 5);
                }
                break;
            case 2:
                if (this.getImg(2, 1)) {
                    this.delFun(2, 1);
                }
                if (this.getImg(2, 3)) {
                    this.delFun(2, 3);
                }
                if (this.getImg(2, 6)) {
                    this.delFun(2, 6);
                }
                break;
            case 3:
                if (this.getImg(3, 2)) {
                    this.delFun(3, 2);
                }
                if (this.getImg(3, 7)) {
                    this.delFun(3, 7);
                }
                break;
            case 4:
                if (this.getImg(4, 0)) {
                    this.delFun(4, 0);
                }
                if (this.getImg(4, 5)) {
                    this.delFun(4, 5);
                }
                if (this.getImg(4, 8)) {
                    this.delFun(4, 8);
                }
                break;
            case 5:
                if (this.getImg(5, 1)) {
                    this.delFun(5, 1);
                }
                if (this.getImg(5, 4)) {
                    this.delFun(5, 4);
                }
                if (this.getImg(5, 6)) {
                    this.delFun(5, 6);
                }
                if (this.getImg(5, 9)) {
                    this.delFun(5, 9);
                }
                break;
            case 6:
                if (this.getImg(6, 2)) {
                    this.delFun(6, 2);
                }
                if (this.getImg(6, 5)) {
                    this.delFun(6, 5);
                }
                if (this.getImg(6, 7)) {
                    this.delFun(6, 7);
                }
                if (this.getImg(6, 10)) {
                    this.delFun(6, 10);
                }
                break;
            case 7:
                if (this.getImg(7, 3)) {
                    this.delFun(7, 3);
                }
                if (this.getImg(7, 6)) {
                    this.delFun(7, 6);
                }
                if (this.getImg(7, 11)) {
                    this.delFun(7, 11);
                }
                break;
            case 8:
                if (this.getImg(8, 4)) {
                    this.delFun(8, 4);
                }
                if (this.getImg(8, 9)) {
                    this.delFun(8, 9);
                }
                if (this.getImg(8, 12)) {
                    this.delFun(8, 12);
                }
                break;
            case 9:
                if (this.getImg(9, 5)) {
                    this.delFun(9, 5);
                }
                if (this.getImg(9, 8)) {
                    this.delFun(9, 8);
                }
                if (this.getImg(9, 10)) {
                    this.delFun(9, 10);
                }
                if (this.getImg(9, 13)) {
                    this.delFun(9, 13);
                }
                break;
            case 10:
                if (this.getImg(10, 6)) {
                    this.delFun(10, 6);
                }
                if (this.getImg(10, 9)) {
                    this.delFun(10, 9);
                }
                if (this.getImg(10, 11)) {
                    this.delFun(10, 11);
                }
                if (this.getImg(10, 14)) {
                    this.delFun(10, 14);
                }
                break;
            case 11:
                if (this.getImg(11, 7)) {
                    this.delFun(11, 7);
                }
                if (this.getImg(11, 10)) {
                    this.delFun(11, 10);
                }
                if (this.getImg(11, 15)) {
                    this.delFun(11, 15);
                }
                break;
            case 12:
                if (this.getImg(12, 8)) {
                    this.delFun(12, 8);
                }
                if (this.getImg(12, 13)) {
                    this.delFun(12, 13);
                }
                break;
            case 13:
                if (this.getImg(13, 9)) {
                    this.delFun(13, 9);
                }
                if (this.getImg(13, 12)) {
                    this.delFun(13, 12);
                }
                if (this.getImg(13, 14)) {
                    this.delFun(13, 14);
                }
                break;
            case 14:
                if (this.getImg(14, 10)) {
                    this.delFun(14, 10);
                }
                if (this.getImg(14, 13)) {
                    this.delFun(14, 13);
                }
                if (this.getImg(14, 15)) {
                    this.delFun(14, 15);
                }
                break;
            case 15:
                if (this.getImg(15, 11)) {
                    this.delFun(15, 11);
                }
                if (this.getImg(15, 14)) {
                    this.delFun(15, 14);
                }
                break;
        }
    },

    getImg(index, number) {
        const indexSpriteName = this.children_arr[index].children[0].getComponent(cc.Sprite).spriteFrame.name;
        const numSprite = this.children_arr[number].children[0].getComponent(cc.Sprite).spriteFrame;
        var numSpriteName = '';
        if (numSprite != null) {
            numSpriteName = numSprite.name
        };
        if (indexSpriteName == numSpriteName) {
            return true
        } else {
            return false
        }
    },

    //2048消除
    bestBoomNum(boomIndex, index) {
        var that = this;
        const finished = cc.callFunc(() => {
            that.children_arr[index].isFulled = false;
            that.children_arr[index].children[0].getComponent(cc.Sprite).spriteFrame = null;
            that.children_arr[index].children[0].opacity = 255;
            that.children_arr[index].children[0].scaleX = 1;
            that.children_arr[index].children[0].scaleY = 1;
        }, this);
        that.children_arr[index].children[0].runAction(cc.sequence(cc.scaleTo(.5, 0), finished));
    },

    delFun(numberIndex, index) {
        var that = this;
        let chilNode = that.children_arr[index].children[0];
        var a = chilNode.getComponent(cc.Sprite).spriteFrame.name;
        let my = that.children_arr[that.nodeIndex];
        let x = chilNode.x * chilNode.parent.scaleX + chilNode.parent.x;
        let y = chilNode.y * chilNode.parent.scaleY + chilNode.parent.y;
        chilNode.x = x;
        chilNode.y = y;
        let nodeNum = cc.scaleTo(.1, 1)
        let bigNodeNum = cc.scaleTo(.1, 1.25);
        let setTime = cc.callFunc(() => {
            chilNode.x = 0;
            chilNode.y = 0;
        }, this)
        const finished = cc.callFunc(() => {
            that.children_arr[index].isFulled = false;
            chilNode.getComponent(cc.Sprite).spriteFrame = null;
            chilNode.opacity = 255;
            that.children_arr[that.nodeIndex].runAction(cc.sequence(setTime,bigNodeNum,nodeNum))
            jq++;
            this.audioArr.push(jq)
            console.log(this.audioArr)
            that.HgameAudio();
            that.pushScore(a);
            that.gameOver();
        }, this);
        this.lianJi++;
        chilNode.runAction(cc.sequence(cc.spawn(setTime, cc.moveTo(.3, cc.p(my.x, my.y)),cc.fadeOut(.3)), finished));
        if (a == 'num2') {
            that.yanShi(numberIndex, 1)
        }
        if (a == 'num4') {
            that.yanShi(numberIndex, 2)
        }
        if (a == 'num8') {
            that.yanShi(numberIndex, 3)
        }
        if (a == 'num16') {
            that.yanShi(numberIndex, 4)
        }
        if (a == 'num32') {
            that.yanShi(numberIndex, 5)
        }
        if (a == 'num64') {
            that.yanShi(numberIndex, 6)
        }
        if (a == 'num128') {
            that.yanShi(numberIndex, 7)
        }
        if (a == 'num256') {
            that.yanShi(numberIndex, 8)
        }
        if (a == 'num512') {
            that.yanShi(numberIndex, 9)
        }
        if (a == 'num1024') {
            that.yanShi(numberIndex, 10)
        }
    },

    yanShi(numberIndex, i) {
        var that = this;
        setTimeout(function () {
            that.children_arr[numberIndex].children[0].getComponent(cc.Sprite).spriteFrame = that[`numImg${i}`];
            that.matchRule(numberIndex);
        }, 200)
    },

    //重生
    chong_sheng(sjx, sjy) {
        this.node.removeAllChildren();
        this.node.x = this.node.ox;
        this.node.y = this.node.oy;
        this.createNum(sjx, sjy);
        jq = 0;
        hold = 0;
        holdAudioA = 0;
        this.audioArr = [];
    },
    start() {
        this.createNum(0, 3);
        this.addTouchEvent();
        uitools.setButtonClickEvents(this, this.backBtn, 'buttonFunc');
        this.rote();
    },

    sendScore() {
        tools.postd(
            {   
                gm_id: 1002,
                uid: GameConfig.uid,
                id:GameConfig.tjNum,
                score: GameConfig.GameScore
            },
            'update_score',
            (res) => {
                console.log('send score ok!', res, '发送成功');
            }
        );
    },


    //减道具
    reduceDJ(data) {
        tools.postd(
            data,
            'dec_prop', (res) => {
                console.log('消耗道具返回', res);
                GameConfig.IS_GAME_PROP.boom = res.data.data.prop_1
                GameConfig.IS_GAME_PROP.hammer = res.data.data.prop_2
                GameConfig.IS_GAME_PROP.refresh = res.data.data.prop_3
            });
    },

    mfDJ(propa, propb, propc) {
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
                GameConfig.IS_GAME_PROP.refresh = res.data.data.prop_3
                self.refreshNumber.string = 'x' + GameConfig.IS_GAME_PROP.refresh;
            }
        );
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
                    self.pushDJ();
                    GameConfig.viderDJ = true;
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    GameConfig.viderDJ = true;
                }
            })
        }
    },



    // update (dt) {},
});