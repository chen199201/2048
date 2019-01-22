var uitools = require('uitools');
cc.Class({
    extends: cc.Component,
    name: 'jumpGame',
    properties: {
        avatarImgSprite: cc.Sprite,
        nameId: cc.Label,
        appId: cc.Label,
        path: cc.Label,
        jumpBtn: cc.Node,
    },
    start() {
        this.node.on('touchstart', function (event) {
            console.log(this.game[0])
            if (CC_WECHATGAME) {
                var self = this;
                wx.navigateToMiniProgram({
                    appId: self.game[0].appId,
                    path: self.game[0].path,
                    envVersion: 'release',	//跳转的目标小游戏版本，develop（开发版），trial（体验版），release（正式版）
                })
            } 
        }, this);
    },
    init: function (data) {
        this.game = [];
        this.game.push(data)
        console.log(data);
        this.avatarImgSprite.getComponent(cc.Sprite).spriteFrame = data.avatarUrl;
        let avatarUrl = data.avatarUrl;
        let name = data.name;
        let appId = data.appId;
        let path = data.path;
        // this.createImage(avatarUrl);
        this.nameId.string = name;
    },

    createImage(avatarUrl) {
        try {
            let image = wx.createImage();
            image.onload = () => {
                try {
                    let texture = new cc.Texture2D();
                    texture.initWithElement(image);
                    texture.handleLoadedTexture();
                    this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                } catch (e) {
                    this.avatarImgSprite.node.active = false;
                }
            };
            image.src = avatarUrl;
        } catch (e) {
            this.avatarImgSprite.node.active = false;
        }
    }
});
