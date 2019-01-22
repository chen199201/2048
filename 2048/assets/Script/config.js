
const GameConfig = {
	GameClubButton: null, //游戏圈按钮
	GameScene: null,
	topid: 0,
	source: 0,
	uid: '',
	openid: 0,
	UseUrl: '',
	GetUrl: '',
	userInfo: {},
	nickname: '',
	DEVICE_WIDTH: 750, // 屏幕宽度
	DEVICE_HEIGHT: 1334,
	MAIN_MENU_NUM: 'Classic', // 主选择菜单
	GameScore: 0, //游戏得分
	GameHeightScore: 0, //游戏最高分
	IS_GAME_MUSIC: true, // 游戏音效
	IS_GAME_SHARE: false, // 游戏分享
	IS_GAME_START: false, //游戏是否开始
	IS_GAME_OVER: false, // 游戏是否结束
	IS_TIME: 12,		//倒计时时间
	IS_GAME_PROP: {	//道具数量
		boom: 0,
		hammer:0,
		refresh: 0,
	},
	IS_WHAT_PROP: 0, //什么道具
	IS_GAME_SGIN: 0,	//是否签到
	IS_GAME_ONEDAY: 0,//是否领取每日礼包
	IS_GAME_ISSHARE: 0,//首页是否分享领双倍
	IS_DAY: 0,		//签到天数
	IS_FRIEND: 1,	//邀请好友数量
	BOOM_NUM: 2,		//游戏页看视频得炸弹次数
	HAMMER_NUM: 2,	//游戏页看视频得锤子次数
	REFRESH_NUM: 2,	//游戏业看视频得刷新次数
	shareTicket: null,
	IS_GAME_BANNER: null, //广告
	boomNum: 0,	//本局还能看视频的次数
	czNum: 0,		//本局还能看视频的次数
	sxNum: 0,	 	//本局还能看视频的次数
	mfZD: 1,		//免费炸弹
	mfCZ: 1,		//免费锤子
	mfSX: 1,		//免费刷新
	yMFZD: 0,	//用去的免费炸弹
	yMFCZ: 0,	//用去的免费锤子
	yMFSX: 0,	//用去的免费刷新
	fhNum: 0,	//复活次数
	file: false,	//是否有存档
	level:0,	//游戏难度
	shareFh:true,	//分享复活
	viderFh:true,	//视频复活
	viderDJ:true,	//看视频得道具
	overPage:false,  //结束页进入排行榜
	tjNum:0,//统计
	isboom:false,//炸弹指导
	iscz:false,//锤子指导
};


export default { GameConfig }