import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
cc.Class({
    extends: cc.Component,
    properties: {
        chaBtn:cc.Node,
        lqBtn:cc.Node,
        share:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log(this.node.children[0].children[2].children)
        uitools.setButtonClickEvents(this, this.chaBtn, 'buttonFunc');
        this.isFirend()
    },
    buttonFunc: function (event) {
        let button = event.target;
        if (this.chaBtn == button) {
            this.node.destroy();
        }else if(this.lqBtn == button){

        }else if(this.share == button){
            tools.sharePicture();
        }
        return true;
    },
    start () {
        //this.yqhy();
    },

    isFirend() {
        let jlbox = this.node.children[0].children[2];
        for (let i = 0; i < jlbox.children.length; i++) {
            let lingQuBtn = jlbox.children[i].children[5];
            let text =  jlbox.children[i].children[4];
            if (i < GameConfig.IS_FRIEND) {
                lingQuBtn.active = true
                lingQuBtn.on('touchend', function (event) {
                    lingQuBtn.active = false;
                    text.getComponent(cc.Label).string = '已领取';
                    GameConfig.IS_GAME_PROP.boom = GameConfig.IS_GAME_PROP.boom+1;
                });
            }
        }
    },

    yqhy(){
        var self = this;
        var list = self.node.children[2];
        console.log(list);
        tools.postd(
            {
              gm_id: 1002,
              uid: GameConfig.uid
            },
            'invite_chart',
            (res) => {
              console.log('邀请好友列表', res);
              if (res.data.data) {
                const arr = res.data.data;
                for (let i = 0; i < arr.length; i++) {
                    let lingQuBtn = list.children[i].children[5];
                    let text =  list.children[i].children[4];
                    lingQuBtn.active = false;
                  if (arr[i].is_up_draw == 0) {
                    list.children[i].getChildByName('lq').active = true;
                    list.children[i].getChildByName('text').active = false;
                    uitools.setButtonClickEvents(self, list.children[i].getChildByName('lq'), 'onReceive', arr[i]);
                  } else if (arr.children[i].is_up_draw == 1) {
                    list.children[i].getChildByName('lq').active = false;
                    text.getComponent(cc.Label).string = '已领取';
                  }
                }
              }
            }
          );
    }

    // update (dt) {},
});
