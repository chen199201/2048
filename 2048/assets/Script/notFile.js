import { GameConfig } from 'config';
var tools = require('tools');
var uitools = require('uitools');
cc.Class({
    extends: cc.Component,
    properties: {
        continueBtn: cc.Node,
        againBtn: cc.Node,
    },

    onLoad(){
        let ifFile = cc.sys.localStorage.getItem('fileGame');
        let fileArr = [];
        for(let i = 0;i<ifFile.length;i++){
          if (ifFile[i]!=null){
            fileArr.push(i);
          }
        }
        if (fileArr.length==16){
          cc.sys.localStorage.removeItem('fileGame');
          GameConfig.isFile = false;
          cc.sys.localStorage.setItem('isFile', GameConfig.isFile);
          this.node.active = false;
          cc.find('Canvas/cj').active = true;
        }
    },

    start() {
        this.btnFun();
    },

    btnFun: function () {
        let that = this;
        that.continueBtn.on('touchstart',function(event){
            that.node.active = false;
            cc.find('Canvas/jl').active = false;
            cc.find('Canvas/cj').active = true;
        })
        that.againBtn.on('touchstart',function(event){
            that.reOpen();
            that.node.active = false;
            cc.find('Canvas/jl').active = false;
            cc.find('Canvas/cj').active = true;
        })
    },

    //重新开始
    reOpen() {
        cc.sys.localStorage.removeItem('fileGame');
        cc.sys.localStorage.removeItem('isFile');
        cc.sys.localStorage.removeItem('myScore');
        cc.sys.localStorage.removeItem('lookZD');
        cc.sys.localStorage.removeItem('lookCZ');
        cc.sys.localStorage.removeItem('lookXS');
        cc.sys.localStorage.removeItem('fhNum');
        cc.sys.localStorage.removeItem('level');
        GameConfig.boomNum = 0;
        GameConfig.czNum = 0;
        GameConfig.sxNum = 0;
        GameConfig.fhNum = 0;
        GameConfig.mfZD =  1;
        GameConfig.mfCZ = 1;
        GameConfig.mfSX = 1;
        GameConfig.level = 0;
        GameConfig.isFile = false;
        cc.sys.localStorage.setItem('isFile', GameConfig.isFile);
        this.clearNum();
    },


    //清除棋盘
    clearNum() {
        GameConfig.GameScore = 0;
        this.indexScore = cc.find('Canvas/cj/index_score');
        this.indexScore.getComponent(cc.Label).string = GameConfig.GameScore
        this.bgBox = cc.find('Canvas/cj/drawBox');
        this.liuchaoliang = this.bgBox.getComponent('bg_box');
        this.children_arr = [];
        this.children_arr = this.bgBox.children;
        for (let i = 0; i < this.children_arr.length; i++) {
            this.children_arr[i].isFulled = false;
            this.children_arr[i].children[0].getComponent(cc.Sprite).spriteFrame = '';
        }
    },
    // update (dt) {},
});
