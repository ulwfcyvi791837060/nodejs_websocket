var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//io.set('heartbeat interval', 1200);

app.get('/', function (req, res) {
	res.send('<h1>Welcome Realtime Server</h1>');
});

// 在线用户
var onlineUsers = {};
// 当前在线人数
var onlineCount = 0;

var request = require('request');

var url_cn = "http://www.200.com:8080"

//定义数组，为了统计在线人数
var alluser = [];
//是否进入了chat页面
var chatflag = true;
// 房间用户名单
var roomInfo = {};

//所有币种
var coinCodeList = [];



io.on('connection', function (socket) {
	// 监听新用户加入
	socket.on('login', function (obj) {


		if (obj.room.indexOf("kline") != -1) {
			var i = 0;
			console.log("---------------行情中心退房算法--------------------")
			for (var key in socket.adapter.rooms) {
				console.log("key==" + key)
				i++;
				if (i > 2) {
					if (key != obj.room) {
						console.log("退出" + key + "房间");
						socket.leave(key);
					}
				}
			}
			console.log("加入专业交易" + obj.room);
			socket.join(obj.room);//加入行情中心

		} else if (obj.room.indexOf("formalTrade") != -1) {
			var i = 0;
			console.log("---------------专业交易退房算法--------------------")
			for (var key in socket.adapter.rooms) {
				console.log("key==" + key)
				i++;
				if (i > 2) {
					if (key != obj.room) {
						console.log("退出" + key + "房间");
						socket.leave(key);
					}
				}
			}
			console.log("加入专业交易" + obj.room);
			socket.join(obj.room);//加入专业交易
		} else if (obj.room.indexOf("index_en") != -1) {
			socket.join("index_en");//加入大厅
		} else {
			socket.join("index");//加入大厅
		}



		// 将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
		socket.name = obj.userid;

		// 检查在线列表，如果不在里面就加入
		if (!onlineUsers.hasOwnProperty(obj.userid)) {
			onlineUsers[obj.userid] = obj.username;
			// 在线人数+1
			onlineCount++;
		}

		// 向所有客户端广播用户加入
		io.emit('login', {
			onlineUsers: onlineUsers,
			onlineCount: onlineCount,
			user: obj
		});
		console.log(obj.username + '加入了聊天室');
	});



	// 监听用户发布聊天内容
	socket.on('message', function (data, isRequest) {
		// 向所有客户端广播发布的消息
		io.emit('message', data, isRequest);

	});

	//初始化数据
	socket.on('request', function (obj) {

		var website = "cn";  //站点      默认cn
		var symbol = "BTC";  //币种      默认BTC
		var period = "5min" //K线分期   默认1min 
		var marketDetail = "0"  //深度   默认0

		if (obj.website != undefined && obj.website.indexOf("en") != -1) {
			website = "en";//设置为国际站房间
		}
		if (obj.symbol != undefined) {
			symbol = obj.symbol;
		}

		if (obj.msgType == "reqMsgUnsubscribe") {//退订
			//离开K线房间
			if (obj.symbolList.lastKLine != undefined) {
				period = obj.symbolList.lastKLine[0].period[0];
				var kroom = website + symbol + period;
				console.log("离开" + kroom + "房间");
				socket.leave(kroom);
			}

			//离开交易房间
			for (var i = 0; i <= 100; i++) {
				if (eval("obj.symbolList.marketDetail" + i) != undefined) {
					marketDetail = i;
					var droom = website + symbol + marketDetail;
					console.log("离开" + droom + "房间");
					socket.leave(droom);
				}
			}

		}
		if (obj.msgType == "reqMsgSubscribe") {//订阅
			try {
				//加载K线房间
				if (obj.symbolList.lastKLine != undefined) {
					period = obj.symbolList.lastKLine[0].period[0];
					var kroom = website + symbol + period;
					console.log("加入" + kroom + "房间");
					socket.join(kroom);

					if ("cn" == website) {
						request(url_cn + '/klinevtwo/con?symbol=' + symbol + '&period=' + period, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								var data = JSON.parse(body);
								console.log("加载K线数据" + website + symbol + data.reqKLine.payload.period);
								io.in(website + symbol + data.reqKLine.payload.period).emit('request', data.reqMsgSubscribe, 200);
								io.in(website + symbol + data.reqKLine.payload.period).emit('request', data.reqKLine, 200);
							}
						})
					}

				}
				//加入交易房间
				for (var i = 0; i <= 100; i++) {
					if (eval("obj.symbolList.marketDetail" + i) != undefined) {
						marketDetail = i;
						var droom = website + symbol + marketDetail;
						console.log("加入" + droom + "房间");
						socket.join(droom);
					}
				}

			} catch (e) {
				// TODO: handle exception
				console.log(e);
			}

		}


	});

	// 监听用户退出
	// socket.on('disconnect', function (type, obj) {
	// 	console.log("退出了");
	// });

	// socket.on('reconnect', function (type, obj) {

	// });

	// socket.on('error', function (type, obj) {

	// });

	var url = socket.request.headers.referer;
	var roomID = "room";
	if (url != undefined) {
		var splited = url.split('/');
		roomID = splited[splited.length - 1];  // 获取房间ID
	}
	var user = '';
	socket.on('join', function (msg) {
		user = msg;
		// 将用户昵称加入房间名单中
		if (!roomInfo[roomID]) {
			roomInfo[roomID] = [];
		}
		roomInfo[roomID].push(user);

		socket.join(roomID);  // 加入房间
		// 通知房间内人员
		io.to(roomID).emit('notice', user + '加入了房间', roomInfo[roomID]);
		console.log('==================' + user + '加入了' + roomID + '聊天室==================');
		io.emit('onlineLength', roomInfo[roomID].length);
	});

	socket.on('disconnect', function () {
		if (roomInfo[roomID] != undefined) {
			var index = roomInfo[roomID].indexOf(user);
			if (index !== -1) {
				roomInfo[roomID].splice(index, 1);
			}

			socket.leave(roomID);  // 退出房间
			io.to(roomID).emit('allMessageLogout', user + '退出了房间', roomInfo[roomID]);
			console.log('==================' + user + '退出了' + roomID + '聊天室==================');
			io.emit('onlineLength', roomInfo[roomID].length);
		}		
	});

	//监听聊天内容，回调给客户端
	socket.on('liaotian', function (msg) {
		console.log(msg);
		io.emit('liaotian', msg);
	})


	//基础版页面 -- 币的各种价格
	socket.on('coinDataEmit', function (coinCode) {
		//老版
		/*socket.join(coinCode)
		request(url_cn+'/tradeMarket/tradePair', function(error, response, body) {
			if (!error && response.statusCode == 200) {
				try {
					var data = JSON.parse(body);
					var list = JSON.parse(data.obj);
					coinCodeList = list;
				} catch (e) {
					// TODO: handle exception
					console.log(e);
				}
			}
		});*/
		//新版
		socket.join('base:' + coinCode)
	})
	
	//深度
	socket.on('coinCode', function (coinCode) {
		socket.join(coinCode);
	})
});

//分房机制
//交易数据分房机制： 只按站点分房 
//K线数据分房机制：：按站点分房  +  按k线类型分房
//定时请求
/*setInterval(function () {



	//中国站
	request(url_cn + '/klinevtwo/message', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var data = JSON.parse(body);
				io.in("index").emit("index", data);
				for (var i = 0; i < data.productList.length; i++) {
					var symbol = data.productList[i];
					var marketDetail = eval("data.marketDetail." + symbol);
					for (var j = 0; j < marketDetail.length; j++) {
						var droom = "cn" + symbol + j;
						//console.log(droom);
						//推送到交易大厅
						io.in(droom).emit('message', marketDetail[j], 200);

						//推送到专业交易的页面
						// console.log("formalTrad");
						var formalTradeRoom = "formalTrade_cn_" + symbol + "_" + j;
						io.in(formalTradeRoom).emit('formalTrade', marketDetail[j]);

						//推送到行情中心
						if (j == 0) {
							var klineRoom = "kline_cn_" + symbol
							//console.log(klineRoom);
							io.in(klineRoom).emit('kline', symbol, marketDetail[j]);
						}

					}

					var lastKLine = eval("data.lastKLine." + symbol);
					for (var j = 0; j < lastKLine.length; j++) {
						var kroom = "cn" + symbol + lastKLine[j].payload.period;

						//console.log(kroom);
						io.in(kroom).emit('message', lastKLine[j], 200);
					}
				}
			} catch (e) {
				// TODO: handle exception
				console.log(e);
			}
		}
	});
}, 1000);
ulwfcyvi */

//推送深度
setInterval(function () {

			request(url_cn+'/moreMarketDetail', function(error, response, body) {
				if (!error && response.statusCode == 200) {
					try {
						var data = JSON.parse(body);
						//io.in(coinCode).emit('deep', data);
						var dui = Object.keys(data);
						for(var i=0;i<dui.length;i++){
							var coinCode = dui[i];
							//console.log("推送深度deep==>"+coinCode+",data="+JSON.stringify(data[coinCode]))
							//console.log("-----------------------------------------------------------------------------------------------------------------------------")
							console.log(coinCode);
							io.in(coinCode).emit('deep', data[coinCode]);
						}
						console.log("推送深度")
					} catch (e) {
						// TODO: handle exception
						console.log("moreMarketDetail==>"+e);
					}
				}
	        });

}, 3000);


//推送实时交易数据
setInterval(function () {
			request(url_cn+'/klinevtwo/message', function(error, response, body) {
				if (!error && response.statusCode == 200) {
					try {
						var data = JSON.parse(body).marketDetail;
						
						var dui = Object.keys(data);
						for (var i = 0; i < dui.length; i++) {
							var coinCode = dui[i];
							//console.log("推送实时交易数据newmessage==>"+coinCode+",data="+JSON.stringify(data[coinCode][0]))
							//console.log("-----------------------------------------------------------------------------------------------------------------------------")
							console.log(coinCode);
							io.in(coinCode).emit('newmessage', data[coinCode][0]);
						}
						console.log("推送实时交易数据")
					} catch (e) {
						console.log("/klinevtwo/message==>"+e);
					}
				}
	        });	
			
	
			
	
}, 3000);


//推送有哪些交易区
setInterval(function () {
	
			request(url_cn+'/klinevtwo/indexv1', function(error, response, body) {
				
				if (!error && response.statusCode == 200) {
					try {
						
						var data = JSON.parse(body);
						//console.log("推送有哪些交易区indexv1On==>"+data);
						//console.log("-----------------------------------------------------------------------------------------------------------------------------")
						console.log(coinCode);
						io.emit('indexv1On', body);
						console.log("推送有哪些交易区")
					} catch (e) {
						console.log("/klinevtwo/indexv1==>"+e);
						// TODO: handle exception
					}
				}
	        });
			
	
}, 3000);


// 基础版交易页面
/*setInterval(function () {
	//老版
	/*if(coinCodeList.length>0){
		for(var i=0;i<coinCodeList.length;i++){
			((coinCode) => {
				request(url_cn + '/tradeMarket/coinPrice.do?coinCode=' + coinCode, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						try {
							var data = JSON.parse(body);
							if (data.success) {
								io.in(coinCode).emit('coinDataOn', data);
							}
						} catch (e) {
							// TODO: handle exception
							console.log(e);
						}
					}
				});
				
				//买卖5价
				request(url_cn + '/tradeMarket/purchaseOrder.do?coinCode=' + coinCode, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						try {
							var data = JSON.parse(body);
							if (data.success) {
								io.in(coinCode).emit('purchaseOrderOn', data);
							}
						} catch (e) {
							// TODO: handle exception
							console.log(e);
						}
					}
				});
			})(coinCodeList[i])
		}
	}/*
	//新版
	request(url_cn + '/tradeMarket/coinPrice.do', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var data = JSON.parse(body);
				if (data.success) {
					var coinCodeData = data.obj;
					var jyd = Object.keys(coinCodeData);
					for(var i=0; i<jyd.length; i++){
						io.in('base:'+jyd[i]).emit('coinDataOn', coinCodeData[jyd[i]]);
					}
				}
			} catch (e) {
				// TODO: handle exception
				console.log("/tradeMarket/coinPrice.do==>"+e);
			}
		}else{
			console.log("/tradeMarket/coinPrice.do==>"+error);
		}
	});
	
	//买卖5价
	request(url_cn + '/tradeMarket/purchaseOrder.do', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var data = JSON.parse(body);
				if (data.success) {
					var coinCodeData = data.obj;
					var jyd = Object.keys(coinCodeData);
					for(var i=0; i<jyd.length; i++){
						//console.log(coinCodeData[jyd[i]]);
						io.in('base:'+jyd[i]).emit('purchaseOrderOn', coinCodeData[jyd[i]]);
					}
				}
			} catch (e) {
				// TODO: handle exception
				console.log("/tradeMarket/purchaseOrder.do==>"+e);
			}
		}
	});
}, 1000);
ulwfcyvi */
//开启监听
http.listen(3000, function () {
	console.log('listening on *:3000');
});