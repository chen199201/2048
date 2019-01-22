cc.Class({
	extends: cc.Component,
	name: 'timeItem',
	properties: {
        avatarImgSprite:cc.Sprite,
        score:cc.Label,
	},
	start() {
	},

	init: function(rank, data) {
		console.log(data);
        let avatarUrl = data.avatarUrl;
		let grade = data.score;
		this.createImage(avatarUrl);
		this.score.string = grade.toString() + '分';
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
