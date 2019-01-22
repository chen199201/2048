cc.Class({
	extends: cc.Component,
	name: 'RankItem',
	properties: {
		rankLabel: cc.Label,
		avatarImgSprite: cc.Sprite,
		nickLabel: cc.Label,
		topScoreLabel: cc.Label,
		one:cc.SpriteFrame,
		two:cc.SpriteFrame,
		three:cc.SpriteFrame,
		hmask:cc.SpriteFrame
	},
	start() {
	 },

	init: function (rank, data) {
		let avatarUrl = data.avatarUrl;
		let nick = data.nickname.length <7 ? data.nickname : data.nickname.substr(0, 7) + "...";
		// let nick = data.nickname;
		let grade = data.KVDataList ? data.KVDataList[0].value : data.score;
		if (rank == 0) {
			this.rankLabel.node.children[0].getComponent(cc.Sprite).spriteFrame = this.one;
		} else if (rank == 1) {
			this.rankLabel.node.children[0].getComponent(cc.Sprite).spriteFrame = this.two;
		} else if (rank == 2) {
			this.rankLabel.node.children[0].getComponent(cc.Sprite).spriteFrame = this.three;
		}
		this.rankLabel.string = (rank + 1);
		this.createImage(avatarUrl);
		this.nickLabel.string = nick;
		this.topScoreLabel.string = grade + '分';
	},
	init2(rank, data) {
		let avatarUrl = data.avatarUrl;
		let nick = data.nickname.length < 7 ? data.nickname : data.nickname.substr(0, 7) + "...";
		// let nick = data.nickname||data.nickName;
		let grade = data.score;
		if (rank == 1) {
			this.rankLabel.node.children[0].getComponent(cc.Sprite).spriteFrame = this.one;
		} else if (rank == 2) {
			this.rankLabel.node.children[0].getComponent(cc.Sprite).spriteFrame = this.two;
		} else if (rank == 3) {
			this.rankLabel.node.children[0].getComponent(cc.Sprite).spriteFrame = this.three;
		}
		this.rankLabel.string = (rank);
		this.createImage(avatarUrl);
		this.nickLabel.string = nick;
		this.topScoreLabel.string = grade + '分';
		this.node.children[4].getComponent(cc.Sprite).spriteFrame = this.hmask
	},

	createImage(avatarUrl) {
		if (CC_WECHATGAME) {
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
		} else {
			cc.loader.load(
				{
					url: avatarUrl,
					type: 'jpg'
				},
				(err, texture) => {
					this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
				}
			);
		}
	}
});
