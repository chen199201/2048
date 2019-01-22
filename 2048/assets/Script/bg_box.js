cc.Class({
    extends: cc.Component,
    properties: {
        nodeH: 30,
        tilePic: {
            default: null,
            type: cc.SpriteFrame
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.drawBox();
    },

    start() {

    },


    // 创建画布
    drawBox() {
        this.boxArr = [];
        this.noteArr = [];
        this.indexArr = [];
        var xAndY = 1;
        for (let i = -xAndY; i < 3; i++) {
            for (let j = -xAndY; j < 3; j++) {
                let row = i + xAndY;
                let col = j + xAndY;
                if (!this.boxArr[row]) {
                    this.boxArr[row] = [];
                }
                this.boxArr[row][col] = this.zhuanPixl({ i, j }, this.nodeH);
            }
        }
        this.boxArr.forEach(el => {
            this.zhuanNode(el);
        });

        for(let i = 0;i<this.node.children.length;i++){
            const cccc=this.node.children[i];
            this.indexArr.push(i);
            cccc.nodeIndex = i;
        }
    },

    // 坐标转像素
    zhuanPixl(pos, nodeH) {
        let size = (nodeH + 110) / 2;
        let x = size * Math.sqrt(2) * pos.i -75;
        let y = size * Math.sqrt(2) * pos.j -75 ;
        return cc.v2(x, y)
    },

    // 创建画布节点
    zhuanNode(pos) {
        for (let index = 0; index < pos.length; index++) {
            let node = new cc.Node('frame');
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = this.tilePic;
            node.x = pos[index].x;
            node.y = pos[index].y;
            node.parent = this.node;
            pos[index].spriteFrame = node;
            this.noteArr.push(node);
            this.setsunzi(node);
            this.setTiShi(node)
        }
    },
    setsunzi(node) {
        let new_node = new cc.Node('frames');
        new_node.addComponent(cc.Sprite);
        new_node.name = 'newFarme';
        new_node.parent = node;
    },

    //设置提示框
    setTiShi(node) {
        let new_node = new cc.Node('tiShi');
        new_node.addComponent(cc.Sprite);
        new_node.name = 'tiShi';
        new_node.parent = node;
    }

    // update (dt) {},
});
