define(function (require, exports, module) {
    require("js/base/base.js");
    require("lib/layer/layer.js");
    require("lib/layer/css/layer.css");
    require("lib/swiper/swiper.min.js");
    require("lib/exstatic/static/lib/jquery-cookie/jquery.cookie.js");
    var socket = io.connect(HRY.socketioUrl);
    var reg=/^\d+(.\d+)?$/;
    module.exports = {
        init: function (coinName) {
        	$("#suoyoujilu").on("click",function () {
                $.cookie('show', "/v.do?u=front/user/entrust",{ path: '/' });
                 $.cookie('entrustTop', 'history',{ path: '/' });
                 window.location.href = _ctx + "/user/center";
            })
            $("#market_depth").on("click", ".sell .price", function(){  
                var sellPrice = $(this).text();
                if($("#Limit_price").hasClass("cur")){
                    $("#buyPrice").val(sellPrice);
                }   
            })
            $("#market_depth").on("click", ".buy .price", function(){
                var buyPrice = $(this).text();
                if($("#Limit_price").hasClass("cur")){
                    $("#sellPriceInput").val(buyPrice);
                }
                
            })
            //清除输入框不是数字的内容
            var keepDecimalForCoinOld = $("#keepDecimalForCoinold").val();
            var keepDecimalForCurrencyOld= $("#keepDecimalForCurrencyold").val();
            var keepDecimalForCoin = $("#keepDecimalForCoin").val();
            var keepDecimalForCurrency = $("#keepDecimalForCurrency").val();
            /*console.log(keepDecimalForCoinOld);
            console.log(keepDecimalForCurrencyOld);
            console.log(keepDecimalForCoin);
            console.log(keepDecimalForCurrency);*/
            var fixCoin = coinName.split("_")[1];
            var coinCode = coinName.split("_")[0]

            scale = function (btn, bar, title) {
                this.btn = document.getElementById(btn);
                this.bar = document.getElementById(bar);
                this.title = document.getElementById(title);
                this.step = this.bar.getElementsByTagName("DIV")[0];
                this.init();
            };
            
            scale.prototype = {
                init: function () {
                    var f = this, g = document, b = window, m = Math;
                    f.btn.onmousedown = function (e) {
                        var x = (e || b.event).clientX;
                        var l = this.offsetLeft;
                        var max = f.bar.offsetWidth - this.offsetWidth;
                        g.onmousemove = function (e) {
                            var thisX = (e || b.event).clientX;
                            var to = m.min(max, m.max(-2, l + (thisX - x)));
                            f.btn.style.left = to + 'px';
                            f.ondrag(m.round(m.max(0, to / max) * 100), to);
                            b.getSelection ? b.getSelection().removeAllRanges()
                                : g.selection.empty();
                        };
                        g.onmouseup = new Function('this.onmousemove=null');
                    };
                },
                ondrag: function (pos, x) {
                    this.step.style.width = Math.max(0, x) + 'px';
                    this.title.value = pos / 100 + '';
                    //修改价格
                    //var login = getCookie("isLogin")
                    var userName = $("#username").val();

                    if (userName != "") {
                        if (this.title.id == "title0") {
                        	var buySum = $("#buyPrice").val();
                        	var n = Math.pow(10,keepDecimalForCurrency);
                            var m = Math.pow(10,keepDecimalForCoin);
                    		if ($("#buyPrice").attr("disabled") == "disabled") {
                                $("#buySum").val((Math.floor($(".buy_available").html() * this.title.value*n)/n));
                                /*$("#buySum").val(($('.buy_available').html() * this.title.value).toFixed(new Number(keepDecimalForCurrency)))*/
                            } else {
                            	if(reg.test(buySum) && buySum > 0){
                                    //console.log(($(".buy_available").html()/ $("#buyPrice").val() * this.title.value*n/n))
                                   /* $("#buySum").val((Math.floor(($(".buy_available").html()/ $("#buyPrice").val() * this.title.value*n)/n)).toFixed(keepDecimalForCoin)); */
                                    $("#buySum").val((Math.floor($(".buy_available").html() / $("#buyPrice").val()* this.title.value*m)/m).toFixed(new Number(keepDecimalForCoin)))
                            		 /*$("#buySum").val(($('.buy_available').html() / $("#buyPrice").val() * this.title.value).toFixed(new Number(keepDecimalForCoin)))*/
                                    $("#buy_total").html(($("#buyPrice").val() * $("#buySum").val()).toFixed(new Number(keepDecimalForCurrencyOld)) + "  " + fixCoin)
                                    //$("#buy_total").html(($("#buyPrice").val() * $("#buySum").val()).toFixed(new Number(8)) + "  " + fixCoin)
                            	}else{
                                     layer.msg(weituojiagebixudayuling, {
                                        skin:'layer-success',
                                        icon: 2,
                                        time: 1000
                                     })
				                    return
                        		}
                               
                            }
                        	
                           

                        }
                        if (this.title.id == "title1") {
                            var n = Math.pow(10,keepDecimalForCurrency);
                            var m = Math.pow(10,keepDecimalForCoin);
                        	if($("#sellPriceInput").attr("disabled") == "disabled"){
                                $("#sellCountInput").val((Math.floor($(".sell_available").html() * this.title.value*m)/m))

                        		/* $("#sellCountInput").val(($(".sell_available").html() * this.title.value).toFixed(new Number(keepDecimalForCoin)))*/
                        		$("#sell_total").html((0 * $("#sellCountInput").val()).toFixed(new Number(keepDecimalForCurrencyOld)) +" " + fixCoin);
                                //$("#sell_total").html((0 * $("#sellCountInput").val()).toFixed(new Number(8)) +" " + fixCoin);
                        	}else{
                                $("#sellCountInput").val((Math.floor($(".sell_available").html() * this.title.value*m)/m))

                        		/* $("#sellCountInput").val(($(".sell_available").html() * this.title.value).toFixed(new Number(keepDecimalForCoin)))*/
                                
                            	$("#sell_total").html(($("#sellPriceInput").val() * $("#sellCountInput").val()).toFixed(new Number(keepDecimalForCurrencyOld)) +" " + fixCoin);
                                //$("#sell_total").html(($("#sellPriceInput").val() * $("#sellCountInput").val()).toFixed(new Number(8)) +" " + fixCoin);
                        	}
                           
                        }
                        //$("#buySum").val(new Number($(".buy_available").html()/new Number()))
                    }
                }
            }


            new scale('btn0', 'bar0', 'title0');
            new scale('btn1', 'bar1', 'title1');
            //
            //充币跳转
            $("[kline_chongbi]").on("click", function(o) {
                var src = $(this).attr("src");
                var cny_language_code = $("#language_code").val();
                var chongbi_code = $(this).prev().text();
                var type = chongbi_code == cny_language_code ? "CNY" : "USD";
                if (src != undefined) {
                    $.cookie('ischongbi', type,{ path: '/' }); 
                    window.location.href =src;
                }
            });

            //tradingview

            $('#depth_select').on('click', function (e) {
                $(this).find('ul').toggle();
                $(this).toggleClass('slide_down')
                $(document).on("click", function () {
                    $('#depth_select ul').hide();
                });
                e.stopPropagation();
            })
            $('#depth_select ul').on('click', 'li', function () {
                var con = $(this).text();
                $(this).addClass('active').siblings().removeClass('active');
                $('#depth_step').text(con)
            })

            function getCookie(name) {
                var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                if (arr != null) return unescape(arr[2]);
                return null;
            }
            
        },
        swiper:function (){
            var mySwiper = new Swiper ('#swiper1', {
                slidesPerView: 5,
                //loop: true,
                //autoplay:true,
                observer:true,
                observeParents:true,
                // 如果需要前进后退按钮
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                on:{
                    click: function(){
                        $('.coin_filter .swiper-slide').children().removeClass('cur')
                       $(this).children().addClass('cur');
                        var swiperIndex= mySwiper.clickedIndex;
                        $('.coin_filter .swiper-slide').eq(swiperIndex).children().addClass('cur');
                        //$(".coin_list").html("");
                        var areaname = $('.coin_filter  .cur').html();
                        $.ajax({
                            url: _ctx + "/klinevtwo/getCoinArea",
                            data:{"areaname":areaname},
                            type: "post",
                            dataType: 'json',
                            success: function (data) {
                                if (data != undefined) {
                                    var list = data.data;
                                    var html = createHtml(list,areaname);
                                    $(".coin_list").html(html);
                                }
                            }
                        });
                    }
                }

            });

            //交易对
            function createHtml(list, coinName){
                var fixCoin = coinName.split("_")[1];
                var coinCode = coinName.split("_")[0]
                var html = "";
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    var search = $("#search_keyword").val();
                    if(search==""){
                        if (obj.coinCode == coinName) {
                            html += " <dl action=\"gourl\" class=\"cur\"> <dt></dt><dd> <div class=\"coin_unit\"> <div><a href='" + _ctx + "/tradingview?symbol=" + obj.coinCode + "'>";
                            html += "<span><i class=\"iconfont icon-choiceO\"></i><em class=\"base_currency\">" + obj.coinCode.split("_")[0] + "</em></span>"

                            html += "<span price=\"price\">" + obj.currentExchangPrice + "</span>"

                            if(obj.RiseAndFall>0 || obj.RiseAndFall==0){
                                html += " <span rate=\"rate\" class=\"color-buy\">+" + obj.RiseAndFall.toFixed(2) + "%</span>";
                                $("#ratezf").css("color", "#589065");
                                $("#ratezf").empty().text("+" + obj.RiseAndFall.toFixed(2) + "%");
                                $("#rateId").html("+" + obj.RiseAndFall.toFixed(2) + "%");
                                $("#rateId").removeClass("color_down").addClass("color_up");
                                $("#jiaoyidui").html(coinCode+"/"+fixCoin+"<span style='color:#589065;' class=\"ticker_close\">+"+obj.currentExchangPrice+"</span>")
                            }else{
                                html += " <span rate=\"rate\" class=\"color-sell\">" + obj.RiseAndFall.toFixed(2) + "%</span>";
                                $("nowprice").css("color", "#AE4E54");
                                $("#nowprice").empty().text(obj.currentExchangPrice);
                                $("#ratezf").css("color", "#AE4E54");
                                $("#ratezf").empty().text("" + obj.RiseAndFall.toFixed(2) + "%");
                                $("#rateId").html(obj.RiseAndFall.toFixed(2) + "%");
                                $("#rateId").removeClass("color_up").addClass("color_down");
                                $("#jiaoyidui").html(coinCode+"/"+fixCoin+"<span style='color:#AE4E54;' class=\"ticker_close\">-"+obj.currentExchangPrice+"</span>")
                            }



                            html += "</a> </div> </div> </dd> </dl>";
                            //$("#tickerCny_ticker_bar,#tickerCny").html("≈ "+((obj.usdtcount*$("#usdttormb").val()).toFixed(keepDecimalForCoin))+" CNY")
                            $("#tickerCny_ticker_bar,#tickerCny").html("≈ "+((obj.usdtcount*$("#usdttormb").val()).toFixed(2))+" CNY")
                            $('#tickerClose').html(obj.currentExchangPrice)//最新价格
                            $("#high").html(new Number(obj.maxPrice).toFixed(keepDecimalForCurrency))
                            $("#low").html(new Number(obj.minPrice).toFixed(keepDecimalForCurrency))
                        } else {
                            html += " <dl action=\"gourl\"> <dt></dt><dd> <div class=\"coin_unit\"> <div><a href='" + _ctx + "/tradingview?symbol=" + obj.coinCode + "'>";
                            html += "<span><i class=\"iconfont icon-choiceO\"></i><em class=\"base_currency\">" + obj.coinCode.split("_")[0] + "</em></span>"

                            html += "<span price=\"price\">" + obj.currentExchangPrice + "</span>"

                            if(obj.RiseAndFall>0 || obj.RiseAndFall==0){
                                html += " <span rate=\"rate\" class=\"color-buy\">+" + obj.RiseAndFall.toFixed(2) + "%</span>";
                            }else{
                                html += " <span rate=\"rate\" class=\"color-sell\">" + obj.RiseAndFall.toFixed(2) + "%</span>";
                            }



                            html += " </div> </div> </dd> </dl>";
                        }
                    }else {
                        var coinCode = obj.coinCode.toString();
                        if(coinCode.indexOf(search.toUpperCase())!=-1 || coinCode.indexOf(search.toLowerCase())!=-1){
                            html += " <dl action=\"gourl\"> <dt></dt><dd> <div class=\"coin_unit\"> <div><a href='" + _ctx + "/tradingview?symbol=" + obj.coinCode + "'>";
                            html += "<span><i class=\"iconfont icon-choiceO\"></i><em class=\"base_currency\">" + obj.coinCode.split("_")[0] + "</em></span>"

                            html += "<span price=\"price\">" + obj.currentExchangPrice + "</span>"

                            if(obj.RiseAndFall>0 || obj.RiseAndFall==0){
                                html += " <span rate=\"rate\" class=\"color-buy\">+" + obj.RiseAndFall.toFixed(2) + "%</span>";
                            }else{
                                html += " <span rate=\"rate\" class=\"color-sell\">" + obj.RiseAndFall.toFixed(2) + "%</span>";
                            }

                            html += " </div> </div> </dd> </dl>";
                        }


                    }


                }
                var jiaoyiliang=$("#jiyiliang").text();
                $("#jiyiliang").text(parseFloat(jiaoyiliang).toFixed(keepDecimalForCoin));
                return html;
            }

        },


        tradingview: function (coinName) {
        	
        	var locale = $("#locale").val();
        	
            function getParameterByName(name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }

            /*function test(func){
                func();
            }
            test(function(){
                console.log(1);
            })
            test(function(i){
                console.log(i);
            }(5))*/

//        	+function (){
//        		console.log(123);
//        	}();



            //不知为何,这块内容由页面移入js,没有效果也不报错,也就是没回调回来
            //这里使用()让js立即执行
            //可是,为什么没有回调回来了。。。
            TradingView.onready(function () {


                var widget = window.tvWidget = new TradingView.widget({
                    debug: false, // uncomment this line to see Library errors and warnings in the console
                    fullscreen: true,
                    symbol: coinName,
                    interval: '15',
                    container_id: "tv_chart_container",
                    //	BEWARE: no trailing slash is expected in feed URL
                    datafeed: new Datafeeds.UDFCompatibleDatafeed(_ctx,1000),
                    library_path: _ctx + "/static/" + _version + "/lib/charting_library/charting_library/",
                    locale: locale == 'zh_CN' ? 'zh' : 'en',
                    //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
                    drawings_access: {type: 'black', tools: [{name: "Regression Trend"}]},
                    disabled_features: ["compare_symbol", "display_market_status", "go_to_date", "header_chart_type", "header_compare", "header_interval_dialog_button", "header_resolutions", "header_screenshot", "header_symbol_search", "header_undo_redo", "show_hide_button_in_legend", "show_interval_dialog_on_key_press", "snapshot_trading_drawings", "symbol_info", "timeframes_toolbar", "use_localstorage_for_settings", "volume_force_overlay"],
                    enabled_features: ["header_settings", "dont_show_boolean_study_arguments", "hide_last_na_study_output", "move_logo_to_main_pane", "same_data_requery", "side_toolbar_in_fullscreen_mode", "legend_context_menu",],
                    //charts_storage_url: 'www.hurongbi.cn',
                    charts_storage_api_version: "1.1",
                    client_id: 'tradingview.com',
                    user_id: 'public_user_id',
                    loading_screen: {backgroundColor: "＃000000"},
                    timezone: "Asia/Shanghai",
                    toolbar_bg: "transparent",
                    overrides: {
                        "paneProperties.background": "#181B2A",
                        "paneProperties.vertGridProperties.color": "#454545",
                        "paneProperties.horzGridProperties.color": "#454545",
                        "symbolWatermarkProperties.transparency": 90,
                        "scalesProperties.textColor": "#AAA",
                        "paneProperties.legendProperties.showLegend": 0, //默认展开
                        "volumePaneSize": "medium",//"medium",
                        "paneProperties.vertGridProperties.color": "#11253E",
                        "paneProperties.vertGridProperties.style": 0,
                        "paneProperties.horzGridProperties.color": "#11253E",
                        "paneProperties.horzGridProperties.style": 0,
                        "mainSeriesProperties.style": 9
                    },
                    studies_overrides: {
                    	//macd线
                    	"macd.histogram.color": "red",
                    	"macd.macd.color": "#55B3A8",
                    	"macd.signal.color": "#C08DF0"
                        /*"bollinger bands.median.color": "#33FF88",
                        "bollinger bands.upper.linewidth": 7*/
                    }
                    //preset: "mobile"
                });

                widget.onChartReady(function () {
                    widget.chart().executeActionById("drawingToolbarAction");
                    widget.chart().executeActionById("hideAllMarks");
                    
                    //widget.chart().createStudy('MACD', false, false, [12, 26, "close", 9]);
                    
                    var studyColor = ["yellow", "#84aad5", "#55b263"],
                    maStudies = [5, 10, 30];
	                maStudies.forEach(mastudFunction);
	
	                function mastudFunction(item, index) {
	                    widget.chart().createStudy("Moving Average", !1, !1, [item], null, {"plot.color.0": studyColor[index]})
	                }; 
                    
                    widget.chart().createStudy("Moving Average", false, false, 5, function (guid) {
                    	widget.chart().getStudyById(guid).mergeDown();
					}, {"plot.color": "yellow"})
					
                    widget.chart().createStudy("Moving Average", false, false, 10, function (guid) {
                    	widget.chart().getStudyById(guid).mergeDown();
					}, {"plot.color": "#84aad5"})
                   
                    
                    
                    widget.onContextMenu(function (unixtime, price) {
                        return [{
                            position: "top",
                            text: "First top menu item, time: " + unixtime + ", price: " + price,
                            click: function () {
                                alert("First clicked.");
                            }
                        },
                            {text: "-", position: "top"},
                            {text: "-Objects Tree..."},
                            {
                                position: "top",
                                text: "Second top menu item 2",
                                click: function () {
                                    alert("Second clicked.");
                                }
                            }, {
                                position: "bottom",
                                text: "Bottom menu item",
                                click: function () {
                                    alert("Third clicked.");
                                }
                            }];
                    });
                    var t = [{
	                        slug: fenshi,
	                        resolution: "1",
	                        chartType: 3,
	                        isMobile: !0
	                    },
                        {
                            slug: min1,
                            resolution: "1"
                        },
                        {
                            slug: min5,
                            resolution: "5"
                        },
                        {
                            slug: min15,
                            resolution: "15"
                        },
                        {
                            slug: min30,
                            resolution: "30"
                        },
                        {
                            slug: hour1,
                            resolution: "60"
                        },
                        {
                            slug: day1,
                            resolution: "1D"
                        },
                        {
                            slug: week1,
                            resolution: "1W"
                        }];
                    
                    var getIntervalClass = function (t) {
                        var e = t.resolution,
                            n = t.chartType;
                        return "interval-" + e + "-" + (void 0 === n ? 1 : n)
                    };
                    var shouldShowMAStudiesByChartTypePreset = function (t) {
                        return "1" === t.toString()
                    };


                    var a = function (t) {
                        var e = t.resolution,
                            n = t.chartType,
                            r = void 0 === n ? 1 : n;

                        widget.changingInterval || (widget.setSymbol(coinName, e), widget.chart().chartType() !== r && widget.applyOverrides({
                            "mainSeriesProperties.style": r
                        }),

                            widget.selectedIntervalClass = (0, getIntervalClass)({
                                resolution: e,
                                chartType: r
                            }), widget.changingInterval = !1)
                    }

                    t.map(function (t) {

                        return widget.createButton({
                            align: "left"
                        })
                            .attr("title", "" + t.slug)
                            .addClass((t.slug == '15min' || t.slug == '15分')? "selected" : "")
                            .on("click", function () {
                                a(t);
                                $(this).addClass("selected").parent().siblings().find('div').removeClass("selected");

                            })
                            .append("<span id='" + t.resolution + "'>" +
                                function (t) {
                                    return top.window.LANG && top.window.LANG.kline && top.window.LANG.kline[t] || t
                                }(t.slug) + "</span>")
                    });
                })
            }());
            
            /*debugger
            console.log($("#tv_chart_container").html());
            
            var iframeId = $("#tv_chart_container").find("iframe").attr("id");
            
            console.log(iframeId);
            
        	$("#"+iframeId+"").load(function(){
                $(this).contents().find("div.chart-widget tbody tr").each(function(index, item){
                	debugger
                	console.log(item);
                })
            });*/
            
            /*function asd(){
            	debugger
            	console.log($("div.chart-widget").html());
            	console.log($("div.chart-widget").html());
            }
            
            setTimeout(asd, 5000);*/
        },
        loadChangeArea: function (coinName) {
            var keepDecimalForCoinOld = $("#keepDecimalForCoinold").val();
            var keepDecimalForCurrencyOld= $("#keepDecimalForCurrencyold").val();
            var keepDecimalForCoin = $("#keepDecimalForCoin").val();
            var keepDecimalForCurrency = $("#keepDecimalForCurrency").val();
            var fixCoin = coinName.split("_")[1];
            var coinCode = coinName.split("_")[0]

            addCoinString();

            function addCoinString (){
                var buy_total = $('#buy_total').text();
                if(buy_total.indexOf(fixCoin) < 0){
                    $('#buy_total').text(parseFloat(buy_total).toFixed(new Number(keepDecimalForCurrencyOld)) +" "+fixCoin)
                }

                var sell_total = $('#sell_total').text();
                if(sell_total.indexOf(fixCoin) < 0){
                    $('#sell_total').text(parseFloat(sell_total).toFixed(new Number(keepDecimalForCurrencyOld)) +" "+ fixCoin)
                }
            }


            // 交易对区
            var loadChangeArea = function () {
                $.ajax({
                    url: _ctx + "/klinevtwo/indexv1",
                    type: "post",
                    dataType: 'json',
                    success: function (data) {
                        if (data != undefined) {
                            var areaname = ""; // 交易区
                            $('.coinName').html(fixCoin)
                            $('.coinCodeName,.pullCoins').html(" "+coinCode)
                            $('.input_text_amount .buycoinName').html(coinCode)
                            $("#buyCoin").html(mairu + " " + coinCode)
                            $("#sellCoin").html(maichu + " " + coinCode)
                            $("#jiaoyidui").html(coinCode+"/"+fixCoin)
                            $(".curJiage").html("("+ fixCoin +")")
                            $(".curWeituozonge").html("("+ fixCoin +")")
                            $(".curShuliang").html("("+ coinCode +")")
                            for (var i = 0; i < data.length; i++) {
                                if(data[i].areaname !== "自选" && data[i].areaname !== 'Favorites') {
                                    if (coinName.split("_")[1] == data[i].areaname) {
                                        areaname += "<div class=\"swiper-slide\"><span class=\"cur\">" + data[i].areaname + "</span></div>"
                                    } /*else if (data[i].areanameview == "自选") {//去掉自选的交易对

                                }*/
                                    else {
                                        areaname += "<div class=\"swiper-slide\"><span action=\"userfilter\" class=\"\">" + data[i].areaname + "</span></div>"
                                    }
                                }
                            }
                            $(".swiper-wrapper").html(areaname);

                        }

                    }
                });
            }
            loadChangeArea();
            //交易对
            function createHtml(list, coinName){
                var fixCoin = coinName.split("_")[1];
                var coinCode = coinName.split("_")[0]
                var html = "";
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    var search = $("#search_keyword").val();
                    if(search==""){
                        if (obj.coinCode == coinName) {
                            html += " <dl action=\"gourl\" class=\"cur\"> <dt></dt><dd> <div class=\"coin_unit\"> <div><a href='" + _ctx + "/tradingview?symbol=" + obj.coinCode + "'>";
                            html += "<span><i class=\"iconfont icon-choiceO\"></i><em class=\"base_currency\">" + obj.coinCode.split("_")[0] + "</em></span>"

                            html += "<span price=\"price\">" + obj.currentExchangPrice + "</span>"

                            if(obj.RiseAndFall>0 || obj.RiseAndFall==0){
                                html += " <span rate=\"rate\" class=\"color-buy\">+" + obj.RiseAndFall.toFixed(2) + "%</span>";
                                $("#ratezf").css("color", "#589065");
                                $("#ratezf").empty().text("+" + obj.RiseAndFall.toFixed(2) + "%");
                                $("#rateId").html("+" + obj.RiseAndFall.toFixed(2) + "%");
                                $("#rateId").removeClass("color_down").addClass("color_up");
                                $("#jiaoyidui").html(coinCode+"/"+fixCoin+"<span style='color:#589065;' class=\"ticker_close\">+"+obj.currentExchangPrice+"</span>")
                            }else{
                                html += " <span rate=\"rate\" class=\"color-sell\">" + obj.RiseAndFall.toFixed(2) + "%</span>";
                                $("nowprice").css("color", "#AE4E54");
                                $("#nowprice").empty().text(obj.currentExchangPrice);
                                $("#ratezf").css("color", "#AE4E54");
                                $("#ratezf").empty().text("" + obj.RiseAndFall.toFixed(2) + "%");
                                $("#rateId").html(obj.RiseAndFall.toFixed(2) + "%");
                                $("#rateId").removeClass("color_up").addClass("color_down");
                                $("#jiaoyidui").html(coinCode+"/"+fixCoin+"<span style='color:#AE4E54;' class=\"ticker_close\">-"+obj.currentExchangPrice+"</span>")
                            }



                            html += "</a> </div> </div> </dd> </dl>";
                            //$("#tickerCny_ticker_bar,#tickerCny").html("≈ "+((obj.usdtcount*$("#usdttormb").val()).toFixed(keepDecimalForCoin))+" CNY")
                            $("#tickerCny_ticker_bar,#tickerCny").html("≈ "+((obj.usdtcount*$("#usdttormb").val()).toFixed(2))+" CNY")
                            $('#tickerClose').html(obj.currentExchangPrice)//最新价格
                            $("#high").html(new Number(obj.maxPrice).toFixed(keepDecimalForCurrency))
                            $("#low").html(new Number(obj.minPrice).toFixed(keepDecimalForCurrency))
                        } else {
                            html += " <dl action=\"gourl\"> <dt></dt><dd> <div class=\"coin_unit\"> <div><a href='" + _ctx + "/tradingview?symbol=" + obj.coinCode + "'>";
                            html += "<span><i class=\"iconfont icon-choiceO\"></i><em class=\"base_currency\">" + obj.coinCode.split("_")[0] + "</em></span>"

                            html += "<span price=\"price\">" + obj.currentExchangPrice + "</span>"

                            if(obj.RiseAndFall>0 || obj.RiseAndFall==0){
                                html += " <span rate=\"rate\" class=\"color-buy\">+" + obj.RiseAndFall.toFixed(2) + "%</span>";
                            }else{
                                html += " <span rate=\"rate\" class=\"color-sell\">" + obj.RiseAndFall.toFixed(2) + "%</span>";
                            }



                            html += " </div> </div> </dd> </dl>";
                        }
                    }else {
                        var coinCode = obj.coinCode.toString();
                        if(coinCode.indexOf(search.toUpperCase())!=-1 || coinCode.indexOf(search.toLowerCase())!=-1){
                            html += " <dl action=\"gourl\"> <dt></dt><dd> <div class=\"coin_unit\"> <div><a href='" + _ctx + "/tradingview?symbol=" + obj.coinCode + "'>";
                            html += "<span><i class=\"iconfont icon-choiceO\"></i><em class=\"base_currency\">" + obj.coinCode.split("_")[0] + "</em></span>"

                            html += "<span price=\"price\">" + obj.currentExchangPrice + "</span>"

                            if(obj.RiseAndFall>0 || obj.RiseAndFall==0){
                                html += " <span rate=\"rate\" class=\"color-buy\">+" + obj.RiseAndFall.toFixed(2) + "%</span>";
                            }else{
                                html += " <span rate=\"rate\" class=\"color-sell\">" + obj.RiseAndFall.toFixed(2) + "%</span>";
                            }

                            html += " </div> </div> </dd> </dl>";
                        }


                    }


                }
                var jiaoyiliang=$("#jiyiliang").text();
                $("#jiyiliang").text(parseFloat(jiaoyiliang).toFixed(keepDecimalForCoin));
                return html;
            }

            //交易对区下方推送
            socket.on('indexv1On', function (data) {
                if (data != undefined) {
                    var html = ""; // 交易区下的交易对
                    var areaname = $('.coin_filter  .cur').html();
                    if (data != undefined && data.length > 0) {
                        var list = data[0].data;
                        // 遍历数据获得选中的交易区数据
                        for (var i = 0; i < data.length; i++) {
                            if (areaname == data[i].areaname) {
                                list = data[i].data;
                            }
                        }
                        // 创建html

                        var str = location.href; //取得整个地址栏
                        var num = str.indexOf("?")
                        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
                        var arr = str.split("&"); //各个参数放到数组里
                        var coinName = arr[0]
                        html = createHtml(list, coinName.split("=")[1]);
                    }

                    $(".coin_list").html(html);

                }
            });


            //监听买卖深度消息发送
            socket.on('newmessage', function (obj) {
                var sellDetail = obj.payload.asks
                var buyDetail = obj.payload.bids
                var tradesList = obj.payload.trades
                $('#market_depth .sell').html(sellDeep(sellDetail))//卖深度
                $('#market_depth .buy').html(buyDeep(buyDetail))//买深度
                trades(tradesList)//实时成交
            });


            function length(o) {
                var count = 0;
                for (var i in o) {
                    count++;
                }
                return count;
            };
            var keepDecimalForCoinOld = $("#keepDecimalForCoinold").val();
            var keepDecimalForCurrencyOld= $("#keepDecimalForCurrencyold").val();
            var keepDecimalForCoin = $("#keepDecimalForCoin").val()
            var keepDecimalForCurrency = $("#keepDecimalForCurrency").val();
            //卖深度
            var sellDeep = function (data) {
               /* if(data.price==null){
                    return
                }*/
                if ($("#buyPrice").val() == "" && data.price!=null) {
                    $("#buyPrice").val(data.price[0].toFixed(new Number(keepDecimalForCurrency)))
                }
                var html = "";
                var amount = data.amount;
                var size=0;
                if(data.price!=null){
                    size = length(amount)
                }

                if(size>7){
                    size=7
                }
                var count = 0;
                for (var i = 0; i < size; i++) {
                    count += data.amount[i];
                    html = "<dd><div class=\"inner\"> <span class=\"title color-sell\">" +mai4 + (i + 1) + "</span>  <span class=\"price\">" + data.price[i].toFixed(new Number(keepDecimalForCurrency)) + "</span>   <span class=\"amount\">" + data.amount[i].toFixed(new Number(keepDecimalForCoin)) + "</span>   <span>" + count.toFixed(new Number(keepDecimalForCoin)) + "</span>   </div>   </dd>" + html;
                }
                    html = "<dt class=\"header\"><span class=\"title\"></span><span class=\"price\">"+jiage+"("+ fixCoin +")</span> <span class=\"amount\">"+shuliang+"<em class=\"uppercase\">("+ coinCode +")</em></span> <span>"+leiji+"<em class=\"uppercase\">("+ coinCode +")</em></span>\"\"   </dt>" + html;
                return html;
            }
            //买深度
            var buyDeep = function (data) {
                if(data.price==null){
                    return "";
                }
                if ($("#sellPriceInput").val() == "" && data.price!=null) {
                    $("#sellPriceInput").val(data.price[0].toFixed(new Number(keepDecimalForCurrency)))
                }
                var html = "";
                var amount = data.amount;
                var size=0;
                if(data.price!=null){
                    size = length(amount)
                }

                if(size>7){
                    size=7
                }
                var count = 0;
                for (var i = 0; i < size; i++) {
                    count += data.amount[i];
                    html += "<dd name=\"depth-item\"><div class=\"inner\"><span class=\"title color-buy\">"+mai3 + (i + 1) + "</span> <span  class=\"price\">" + data.price[i].toFixed(new Number(keepDecimalForCurrency)) + "</span> <span class=\"amount\">" + data.amount[i].toFixed(new Number(keepDecimalForCoin)) + "</span>  <span>" + count.toFixed(new Number(keepDecimalForCoin)) + "</span></div> </dd>"
                }

                return html;
            }

            //实时成交
            var trades = function (data) {
                //时间列填充
                var time = data.time;
                if(time==null){
                    return
                }
                var timeHtml = '<dt>'+shijian+'</dt>';
                var directionHtml = '<dt>'+fangxiang+'</dt>';
                var priceHtml = "<dt>"+jiage+"<span class=\"uppercase\">("+ fixCoin +")</span></dt>";
                var amountHtml = "<dt>"+shuliang+"<span class=\"uppercase\">("+ coinCode +")</span></dt>"
                for (var i = 0; i < time.length; i++) {
                    var date = new Date(new Number(time[i]*1000))
                    var h = date.getHours();  // 获取小时数(0-23)
                    var m = date.getMinutes();  // 获取分钟数(0-59)
                    var s = date.getSeconds();  // 获取秒数(0-59)
                    timeHtml += " <dd>" + (h<10?("0"+h) : h )+ ":" + (m<10?("0"+m):m) + ":" + (s<10?("0"+s):s) + "</dd>"
                    if (data.direction[i] == 2) {
                        directionHtml += "<dd class=\"color_down\">"+maichu+"</dd>";
                    } else {
                        directionHtml += "<dd class=\"color_up\">"+mairu+"</dd>";
                    }
                    priceHtml += "<dd>" + data.price[i].toFixed(new Number(keepDecimalForCurrency)) + "</dd>";
                    amountHtml += "<dd>" + data.amount[i].toFixed(new Number(keepDecimalForCoin)) + "</dd>"
                }
                $('#market_trades_list .market_trades_time').html(timeHtml)
                $('#market_trades_list .market_trades_type').html(directionHtml)
                $('#market_trades_list .market_trades_price').html(priceHtml)
                $('#market_trades_list .market_trades_amount').html(amountHtml)
                //买卖填充

            }




            /*// 切换交易区
            $('.coin_filter ').on('click', "span", function () {
                $(this).addClass('cur').siblings().removeClass('cur');
                $(".coin_list").html("")
            })*/

            $('.coin_list').on('click', 'dl .coin_unit div', function () {
                $(this).parent().parent().parent().addClass("cur").siblings().removeClass('cur');
            })

            // 原生 JavaScript 获取 cookie 值
            function getCookie(name) {
                var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                if (arr != null) return unescape(arr[2]);
                return null;
            }

            //是否登录
            function isLogin() {
                //var login = getCookie("isLogin")
                var userName = $("#username").val()
                if (userName != "") {
                    $("#order_history_scroll,#open_orders_scroll").css("display","block");

                    $("#margin_hb_quote").show()
                    $(".loginDiv").hide()
                    $("#open_history_order").show()
                    var keepDecimalForCoinOld = $("#keepDecimalForCoinold").val();
                    var keepDecimalForCurrencyOld= $("#keepDecimalForCurrencyold").val();
                    var keepDecimalForCoin = $("#keepDecimalForCoin").val()
                    var keepDecimalForCurrency = $("#keepDecimalForCurrency").val()

                    //用户可用币渲染
//                    $.ajax({
//                        type: "post",
//                        url: _ctx + "/getHotMoney",
//                        data: {},
//                        cache: false,
//                        dataType: "json",
//                        success: function (data) {
//                            if (data) {debugger
//                                if (data.success) {
//                                    var coinAccount = data.obj
//                                    var str = location.href; //取得整个地址栏
//                                    var num = str.indexOf("?")
//                                    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
//                                    var arr = str.split("&"); //各个参数放到数组里
//                                    var fixCoinName = arr[0].split("=")[1].split("_")[1];
//                                    var coinCode = arr[0].split("=")[1].split("_")[0];
//                                    for (var i = 0; i < coinAccount.length; i++) {
//                                        if (coinAccount[i].coinCode == fixCoinName) {
//                                            var hotMoney = coinAccount[i].hotMoney
//                                            $("#pull_available").html((hotMoney / $("#buyPrice").val()).toFixed(new Number(keepDecimalForCurrency)))
//                                            $('.buy_available').html(hotMoney.toFixed(new Number(keepDecimalForCurrency)))
//                                        }
//                                        if (coinAccount[i].coinCode == coinCode) {
//
//                                            var hotMoney = coinAccount[i].hotMoney
//                                            $('.sell_available').html(hotMoney.toFixed(new Number(keepDecimalForCoin)))
//                                        }
//
//                                    }
//                                }
//                            }
//                        },
//                        error: function (e) {
//
//                        }
//                    });
                    var str = location.href; //取得整个地址栏
                    var num = str.indexOf("?")
                    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
                    var arr = str.split("&"); //各个参数放到数组里
                    var symbol = arr[0].split("=")[1];
                    //获取用户资金
                    function getAccountInfo(){
                        $.ajax({
                            type : "post",
                            url : _ctx + "/user/getAccountInfo",
                            data : {coinCode: symbol},
                            cache: false,
                            dataType : "json",
                            success : function(data) {
                                if(data.success){
                                	var obj = eval("["+data.obj+"]")[0];
                                	var coinHotMoney = obj.coinHotMoney;
                                	//console.info("coinHotMoney:" + coinHotMoney);
                                	var fixCoinHotMoney = obj.rmb;
                                	//console.info("fixCoinHotMoney:" + fixCoinHotMoney);
                                	if($("#buyPrice").val() != null && $("#buyPrice").val() != "" && typeof($("#buyPrice").val()) != "undefined"){
                                		var pull_available = (fixCoinHotMoney / $("#buyPrice").val()).toFixed(new Number(keepDecimalForCoinOld));
                                		if(reg.test(pull_available)){
                                			$("#pull_available").html(pull_available);
                                		}else{
                                			$("#pull_available").html("0.0000");
                                		}
                                		
                                	}
                                	$('.buy_available').html(fixCoinHotMoney.toFixed(new Number(keepDecimalForCurrencyOld)));
	                                $('.sell_available').html(coinHotMoney.toFixed(new Number(keepDecimalForCoinOld)));
                                    /*$('.buy_available').html(fixCoinHotMoney.toFixed(new Number(8)));
                                    $('.sell_available').html(coinHotMoney.toFixed(new Number(8)));*/
                                    $('.sell_available.max_num').html(coinHotMoney.toFixed(new Number(keepDecimalForCoinOld)));

                                }
                            }
                        });
                    }
                    getAccountInfo();
                    
                    
                    
                    //查询当前委托
                    $.ajax({
                        type: "post",
                        url: _ctx + "/user/entrust/rlist",
                        data: {
                            coinCode:coinCode+"_"+fixCoin,
                            type:"current"
                        },
                        cache: false,
                        dataType: "json",
                        success: function (data) {
                            if (data) {
                                if(data.length>0){
                                    $("#noList").hide();
                                }
                                var state = $(".myListing .z_active").attr("data-type")
                                var html="<ul>";
                                if(state=="buy"){
                                    for(var  i=0;i<data.length;i++){
                                        if(data[i].type=="1"){
                                            html+="<ul>"
                                            html+="<li class=\"trade_time\">"+data[i].entrustTime+"</li>";
                                            html+="<li class=\"trade_type\">"+bibijiaoyi+"</li>";
                                            html+="<li class=\"trade_pair\" action=\"goTrade\" data-info=\"BTC/USDT/spot\">"+data[i].coinCode+"/"+data[i].fixPriceCoinCode+"</li>";
                                            if(data[i].type=="2"){
                                                html+="<li class=\"color_down\">"+maichu+"</li>";
                                            }else{
                                                html+="<li class=\"color_up\">"+mairu+"</li>";
                                            }
                                            html+= "<li>"+data[i].entrustPrice.toFixed(new Number(keepDecimalForCurrency))+"</li> <li>"+data[i].entrustCount.toFixed(new Number(keepDecimalForCoin))+"</li> <li>"+data[i].entrustSum.toFixed(new Number(keepDecimalForCurrency))+"</li>  <li>"+((data[i].entrustCount-data[i].surplusEntrustCount).toFixed(new Number(keepDecimalForCoin)))+"</li><li>"+data[i].surplusEntrustCount.toFixed(new Number(keepDecimalForCoin))+"</li>";
                                            html+="<li><button data-id=\""+data[i].entrustNum+"\" class=\"btn_cancel\">"+chedan+"</button></li>";
                                            html+="</ul>"
                                        }

                                    }
                                }else if(state=="sell"){
                                    for(var  i=0;i<data.length;i++){
                                        if(data[i].type=="2"){
                                            html+="<ul>"
                                            html+="<li class=\"trade_time\">"+data[i].entrustTime+"</li>";
                                            html+="<li class=\"trade_type\">"+bibijiaoyi+"</li>";
                                            html+="<li class=\"trade_pair\" action=\"goTrade\" data-info=\"BTC/USDT/spot\">"+data[i].coinCode+"/"+data[i].fixPriceCoinCode+"</li>";
                                            if(data[i].type=="2"){
                                                html+="<li class=\"color_down\">"+maichu+"</li>";
                                            }else{
                                                html+="<li class=\"color_up\">"+mairu+"</li>";
                                            }
                                            html+= "<li>"+data[i].entrustPrice.toFixed(new Number(keepDecimalForCurrency))+"</li> <li>"+data[i].entrustCount.toFixed(new Number(keepDecimalForCoin))+"</li> <li>"+data[i].entrustSum.toFixed(new Number(keepDecimalForCurrency))+"</li>  <li>"+((data[i].entrustCount-data[i].surplusEntrustCount).toFixed(new Number(keepDecimalForCoin)))+"</li><li>"+data[i].surplusEntrustCount.toFixed(new Number(keepDecimalForCoin))+"</li>";
                                            html+="<li><button data-id=\""+data[i].entrustNum+"\" class=\"btn_cancel\">"+chedan+"</button></li>";
                                            html+="</ul>"
                                        }

                                    }
                                }else{
                                    for(var  i=0;i<data.length;i++){
                                        html+="<ul>"
                                        html+="<li class=\"trade_time\">"+data[i].entrustTime+"</li>";
                                        html+="<li class=\"trade_type\">"+bibijiaoyi+"</li>";
                                        html+="<li class=\"trade_pair\" action=\"goTrade\" data-info=\"BTC/USDT/spot\">"+data[i].coinCode+"/"+data[i].fixPriceCoinCode+"</li>";
                                        if(data[i].type=="2"){
                                            html+="<li class=\"color_down\">"+maichu+"</li>";
                                        }else{
                                            html+="<li class=\"color_up\">"+mairu+"</li>";
                                        }
                                        if(data[i].entrustWay == 1){
                                            	 html+= "<li>"+data[i].entrustPrice.toFixed(new Number(keepDecimalForCurrency))+"</li>";
                                            }else{
                                            	html+= "<li>"+shijia+"</li> ";
                                            }
                                        html+=  "<li>"+data[i].entrustCount.toFixed(new Number(keepDecimalForCoin))+"</li><li>"+data[i].entrustSum.toFixed(new Number(keepDecimalForCurrency))+"</li><li>"+((data[i].entrustCount-data[i].surplusEntrustCount).toFixed(new Number(keepDecimalForCoin)))+"</li>";
                                        if(data[i].surplusEntrustCount.toFixed(new Number(keepDecimalForCoin))<0){
                                        	html +="<li>"+bufenchengjiao+"</li>";
                                        }else{
                                        	html+="<li>"+data[i].surplusEntrustCount.toFixed(new Number(keepDecimalForCoin))+"</li>";
                                        }
                                        html+="<li><button data-id=\""+data[i].entrustNum+"\" class=\"btn_cancel\">"+chedan+"</button></li>";
                                        html+="</ul>"
                                    }
                                }

                                $("#listing").html(html)
                            }
                        },
                        error: function (e) {

                        }
                    });

                    //查询历史委托
                    $.ajax({
                        type: "post",
                        url: _ctx + "/user/entrust/rlist",
                        data: {
                            coinCode:coinCode+"_"+fixCoin,
                        },
                        cache: false,
                        dataType: "json",
                        success: function (data) {
                            if (data) {
                                if(data.length>0){
                                    $("#noList").hide();
                                }
                                var state = $(".myListed .z_active").attr("data-type")
                               // console.log(state)
                                var html="<ul>";
                                if(state=="buy"){
                                    for(var  i=0;i<data.length;i++){
                                        if(data[i].type=="1"){
                                            html+="<ul>"
                                            html+="<li class=\"trade_time\">"+data[i].entrustTime+"</li>";
                                            html+="<li class=\"trade_type\">"+bibijiaoyi+"</li>";
                                            html+="<li class=\"trade_pair\" action=\"goTrade\" data-info=\"BTC/USDT/spot\">"+data[i].coinCode+"/"+data[i].fixPriceCoinCode+"</li>";
                                            if(data[i].type=="2"){
                                                html+="<li class=\"color_down\">"+maichu+"</li>";
                                            }else{
                                                html+="<li class=\"color_up\">"+mairu+"</li>";
                                            }
                                            if(data[i].entrustWay == 1){
                                            	 html+= "<li>"+data[i].entrustPrice.toFixed(new Number(keepDecimalForCurrency))+"</li> ";
                                            }else{
                                            	html+= "<li>"+shijia+"</li> ";
                                            }
                                            if(data[i].entrustWay == 2 && data[i].type == 1){
                                            	html+=" <li>"+new Number(data[i].entrustCount-data[i].surplusEntrustCount).toFixed(keepDecimalForCoin) +"</li>" ;
                                            }else{
                                            	 html+= "<li>"+data[i].entrustCount.toFixed(new Number(keepDecimalForCoin))+"</li> ";
                                            }
                                           if(data[i].entrustWay == 1){
												html+="<li>"+((data[i].entrustSum).toFixed(new Number(keepDecimalForCurrency)))+"</li> ";
                                           }else{
                                           		html+=" <li>"+new Number(data[i].transactionSum).toFixed(keepDecimalForCurrency) +"</li>" ;
                                           }
                                           		 html+=" <li>"+new Number(data[i].entrustCount-data[i].surplusEntrustCount).toFixed(keepDecimalForCoin) +"</li>" ;
                                           	html+="<li>"+(data[i].status==2?yiwancheng:data[i].status==3?bufenchexiao:quanbuchexiao)+"</li>";
                                            html+="</ul>"
                                           // html+= "<li>"+data[i].entrustPrice.toFixed(new Number(keepDecimalForCurrency))+"</li> <li>"+data[i].entrustCount.toFixed(new Number(keepDecimalForCurrency))+"</li> <li>"+((data[i].entrustCount-data[i].surplusEntrustCount).toFixed(new Number(keepDecimalForCurrency)))+"</li>  <li>"+new Number(data[i].processedPrice==null?0:data[i].processedPrice).toFixed(keepDecimalForCurrency) +"</li><li>"+(data[i].status==2?yiwancheng:data[i].status==3?bufenchexiao:quanbuchexiao)+"</li>";
                                           // html+="</ul>"
                                        }

                                    }

                                }else if(state=="sell"){
                                    for(var  i=0;i<data.length;i++){
                                        if(data[i].type=="2"){
                                            html+="<ul>"
                                            html+="<li class=\"trade_time\">"+data[i].entrustTime+"</li>";
                                            html+="<li class=\"trade_type\">"+bibijiaoyi+"</li>";
                                            html+="<li class=\"trade_pair\" action=\"goTrade\" data-info=\"BTC/USDT/spot\">"+data[i].coinCode+"/"+data[i].fixPriceCoinCode+"</li>";
                                            if(data[i].type=="2"){
                                                html+="<li class=\"color_down\">"+maichu+"</li>";
                                            }else{
                                                html+="<li class=\"color_up\">"+mairu+"</li>";
                                            }
                                              if(data[i].entrustWay == 1){
                                            	 html+= "<li>"+data[i].entrustPrice.toFixed(new Number(keepDecimalForCurrency))+"</li> ";
                                            }else{
                                            	html+= "<li>"+shijia+"</li> ";
                                            }
                                            if(data[i].entrustWay == 2 && data[i].type == 1){
                                            	html+=" <li>"+new Number(data[i].entrustCount-data[i].surplusEntrustCount).toFixed(keepDecimalForCoin) +"</li>" ;
                                            }else{
                                            	 html+= "<li>"+data[i].entrustCount.toFixed(new Number(keepDecimalForCoin))+"</li> ";
                                            }
                                           if(data[i].entrustWay == 1){
												html+="<li>"+((data[i].entrustSum).toFixed(new Number(keepDecimalForCurrency)))+"</li> ";
                                           }else{
                                           		html+=" <li>"+new Number(data[i].transactionSum).toFixed(keepDecimalForCurrency) +"</li>" ;
                                           }
                                           		 html+=" <li>"+new Number(data[i].entrustCount-data[i].surplusEntrustCount).toFixed(keepDecimalForCoin) +"</li>" ;
                                           	html+="<li>"+(data[i].status==2?yiwancheng:data[i].status==3?bufenchexiao:quanbuchexiao)+"</li>";
                                            html+="</ul>"
                                           // html+= "<li>"+data[i].entrustPrice.toFixed(new Number(keepDecimalForCurrency))+"</li> <li>"+data[i].entrustCount.toFixed(new Number(keepDecimalForCurrency))+"</li> <li>"+((data[i].entrustCount-data[i].surplusEntrustCount).toFixed(new Number(keepDecimalForCurrency)))+"</li>  <li>"+new Number(data[i].processedPrice==null?0:data[i].processedPrice).toFixed(keepDecimalForCurrency) +"</li><li>"+(data[i].status==2?yiwancheng:data[i].status==3?bufenchexiao:quanbuchexiao)+"</li>";
                                           // html+="</ul>"
                                        }

                                    }
                                }else{
                                    for(var  i=0;i<data.length;i++){
                                            html+="<ul>"
                                            html+="<li class=\"trade_time\">"+data[i].entrustTime+"</li>";
                                            html+="<li class=\"trade_type\">"+bibijiaoyi+"</li>";
                                            html+="<li class=\"trade_pair\" action=\"goTrade\" data-info=\"BTC/USDT/spot\">"+data[i].coinCode+"/"+data[i].fixPriceCoinCode+"</li>";
                                            if(data[i].type=="2"){
                                                html+="<li class=\"color_down\">"+maichu+"</li>";
                                            }else{
                                                html+="<li class=\"color_up\">"+mairu+"</li>";
                                            }
                                            if(data[i].entrustWay == 1){
                                            	 html+= "<li>"+data[i].entrustPrice.toFixed(new Number(keepDecimalForCurrency))+"</li> ";
                                            }else{
                                            	html+= "<li>"+shijia+"</li> ";
                                            }
                                            if(data[i].entrustWay == 2 && data[i].type == 1){
                                            	html+=" <li>"+new Number(data[i].entrustCount-data[i].surplusEntrustCount).toFixed(keepDecimalForCoin) +"</li>" ;
                                            }else{
                                            	 html+= "<li>"+data[i].entrustCount.toFixed(new Number(keepDecimalForCoin))+"</li> ";
                                            }
                                           if(data[i].entrustWay == 1){
												html+="<li>"+((data[i].entrustSum).toFixed(new Number(keepDecimalForCurrency)))+"</li> ";
                                           }else{
                                           		html+=" <li>"+new Number(data[i].transactionSum).toFixed(keepDecimalForCurrency) +"</li>" ;
                                           }
                                           		 html+=" <li>"+new Number(data[i].entrustCount-data[i].surplusEntrustCount).toFixed(keepDecimalForCoin) +"</li>" ;
                                           	html+="<li>"+(data[i].status==2?yiwancheng:data[i].status==3?bufenchexiao:quanbuchexiao)+"</li>";
                                            html+="</ul>"

                                    }
                                }


                                $("#listed").html(html)
                            }
                        },
                        error: function (e) {

                        }
                    });

                    $(".myListing,.myListed").on("click","li",function () {
                        $(this).addClass("z_active").siblings().removeClass('z_active');
                    })

                } else {
                    // ("未登录")
                    $("#open_history_order").hide()
                    $("#buyCoin").attr("disabled", "disabled")
                    $("#sellCoin").attr("disabled", "disabled")
                    $(".loginDiv").show()
                    $("#totalMoneyNum,#margin_hb_quote,#totalMoney").hide()

                }
            }

            //定时器查询用户的账户余额
            setInterval(function () {
                isLogin();
            }, 1000);

            //限价交易和市价交易的切换
            $(".trade_transaction").on("click", "li", function () {
                $(this).addClass("cur").siblings().removeClass('cur');
                if($("#Limit_price").attr("class")==""){
                    $('.buySum').html(jiaoyie)
                    $("#buyPrice").val(yishichangshangzuiyoujiagemairu)
                    $("#sellPriceInput").val(yishichangshangzuiyoujiagemaichu)
                    $('#buyPrice,#sellPriceInput').attr("disabled", "disabled")
                    $('#buycoinName').html(fixCoin)
                    $('.pullCoins').html(" "+fixCoin)
                    $('#pull_available').addClass("buy_available").removeClass("sell_available")
                    $(".total").css("display","none");
                }else{
                    $("#buyPrice").val("")
                    $("#sellPriceInput").val("")
                    $('#buyPrice,#sellPriceInput').removeAttr("disabled")
                    $('.buySum').html(mairuliang)
                    $('#buycoinName').html(coinCode)
                    $('.pullCoins').html(" "+coinCode)
                    $('#pull_available').removeClass("buy_available")
                    $(".total").css("display","block");
                }
                
            })


            

        },
        tradeAdd: function (coinName) {

            var str = location.href; //取得整个地址栏
            var num = str.indexOf("?")
            str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
            var arr = str.split("&"); //各个参数放到数组里
            var buyCoinCode = arr[0].split("=")[1];

            //买币
            $('#buyCoin').on('click', '', function () {
                //判断是市价还是限价
                var marketType = "";
                if ($("#buyPrice").attr("disabled") == "disabled") {
                    marketType = 'shijia';
                } else {
                    marketType = 'xianjia';
                }
                var entrustPrice = $('#buyPrice').val();
                if (entrustPrice == "" && (!$("#buyPrice").attr("disabled") == "disabled")) {
                    layer.msg(weituojiagebunengweikong, {
                        skin:'layer-success',
                        icon: 2,
                        time: 1000
                    })
                    return
                }
                if (entrustPrice!= "" && entrustPrice < 0) {
                    layer.msg(weituojiagebuzhengque, {
                        skin:'layer-success',
                        icon: 2,
                        time: 1000
                    })
                	return
                }
                var entrustCount = $('#buySum').val();
                if (entrustCount == "") {
                    layer.msg(qingshuruweituoshuliang, {
                        skin:'layer-success',
                        icon: 2,
                        time: 1000
                    })
                    return
                }
                if (entrustCount!= "" && entrustCount < 0) {
                    layer.msg(weituoshuliangbuzhengque, {
                        skin:'layer-success',
                        icon: 2,
                        time: 1000
                    })
                	return
                }
                var source = '1';//来源（pc）
                var coinCode = buyCoinCode;//交易对
                var type = '1';//买
                var entrustWay = '';
                var buy_available = $('.buy_available').html()
                if ($("#buyPrice").attr("disabled") == "disabled") {//市价
                    var entrustWay = '2';
                    if (new Number(entrustCount) > new Number(buy_available)) {
                        layer.open({
                            skin:'layer-del',
                            title:wenxintishi,
                            content:yuebuzutishi,
                            area:["480px","270px"],
                            btn: [quxiao,quchongzhi],
                            yes: function(){
                              layer.closeAll();
                            }
                            ,btn2: function(){
                                layer.closeAll('dialog');
                                window.location.href =_ctx+"/user/center";
                            }
                        })
                        return
                    }
                } else {//限价
                    var entrustWay = '1';
                    
                    if (new Number(entrustCount) * new Number(entrustPrice) > new Number(buy_available)) {
                        layer.open({
                            skin:'layer-del',
                            title:wenxintishi,
                            content:yuebuzutishi,
                            area:["480px","270px"],
                            btn: [quxiao,quchongzhi],
                            yes: function(){
                              layer.closeAll();
                            }
                            ,btn2: function(){
                                layer.closeAll('dialog');
                                window.location.href =_ctx+"/user/center";
                            }
                        })
                        return
                    }
                }
                $('#buySum').val("")
                $.ajax({
                    type: "post",
                    url: _ctx + "/user/trades/add",
                    data: {
                        entrustPrice: entrustPrice,
                        entrustCount: entrustCount,//限价委托数
                        entrustSum: entrustCount,//市价委托数
                        source: source,
                        coinCode: coinCode,
                        type: type,
                        entrustWay: entrustWay
                    },
                    cache: false,
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            if(data.success==true){
								buyClean();
                                layer.msg(data.msg, {
                                    skin:'layer-success',
                                    icon: 1,
                                    time: 1000
                                })     
                            }else{
                            	buyClean();
                                /*layer.msg(data.msg, {
                                    skin:'layer-success',
                                    icon: 2,
                                    time: 1000
                                })*/
                                layer.open({
                                    skin:'layer-del',
                                    title:wenxintishi,
                                    content:data.msg,
                                    area:["480px","270px"],
                                    btn: [quxiao,quchongzhi],
                                    yes: function(){
                                      layer.closeAll();
                                    }
                                    ,btn2: function(){
                                        layer.closeAll('dialog');
                                        window.location.href =_ctx+"/user/center";
                                    }
                                })
                            }
                        }
                    },
                    error: function (e) {

                    }
                });

            })

            //清除输入框不是数字的内容
            var keepDecimalForCoinOld = $("#keepDecimalForCoinold").val();
            var keepDecimalForCurrencyOld= $("#keepDecimalForCurrencyold").val();
            var keepDecimalForCoin = $("#keepDecimalForCoin").val()
            var keepDecimalForCurrency = $("#keepDecimalForCurrency").val()
            var str = location.href; //取得整个地址栏
            var num = str.indexOf("?")
            str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
            var arr = str.split("&"); //各个参数放到数组里
            var coinName = arr[0]
            var fixCoin = coinName.split("=")[1].split("_")[1];
            var coinCode = coinName.split("=")[1].split("_")[0]
            $("#buySum").on("keyup", "", function () {
                this.value = this.value.replace(/[^\d.]/g, '');
                var nowVal=$("#buySum").val();
                var maxVal=$("#pull_available").text();
                if(parseFloat(nowVal)>parseFloat(maxVal)){
                    this.value = maxVal;       
                }
                var tval = this.value.split('.');
                var isCur=$("#market_price").hasClass("cur")
                if (tval.length > 1) {
                    if(isCur){
                        if (tval[1].length > keepDecimalForCurrency) {
                            this.value = tval[0] + '.' + tval[1].substring(0, keepDecimalForCurrency);
                        }
                    }else{
                        if (tval[1].length > keepDecimalForCoin) {
                            this.value = tval[0] + '.' + tval[1].substring(0, keepDecimalForCoin);
                        }
                    }
                    
                }

                //根据价格和数量改变拉杆
                //var login = getCookie("isLogin")
                var userName = $("#username").val();
                if(userName != ""){
                    var totalWide = $('.ratings_bars').width();
                    if (this.id == "buySum" || this.id == 'buyPrice') {
                        if ($("#buyPrice").attr("disabled") == "disabled") {
                            var total = $(".buy_available").html();

                            var wide = this.value / total * totalWide;
                            if (new Number(wide) < totalWide) {
                                $("#bar0Div").css("width", wide + "px")
                                $("#btn0").css("left", wide + "px")
                            } else {
                                $("#bar0Div").css("width", totalWide+"px")
                                $("#btn0").css("left", totalWide+"px")
                            }

                        } else {
                            var total = $(".buy_available").html();
                            //取值错误，应做判断
                            var price = this.id == "buySum" ? $("#buyPrice").val() : $("#buySum").val();
                            var wide = this.value * price / total * totalWide;
                            var fixCoin = coinName.split("_")[1];
                            var coinCode = coinName.split("_")[0]
                            if (new Number(wide) < totalWide) {
                                $("#bar0Div").css("width", wide + "px")
                                $("#btn0").css("left", wide + "px")
                            } else {
                                $("#bar0Div").css("width", totalWide+"px")
                                $("#btn0").css("left", totalWide+"px")
                            }
                            $("#buy_total").html((price * this.value).toFixed(new Number(keepDecimalForCurrencyOld)) +" "+ fixCoin)
                            //$("#buy_total").html((price * this.value).toFixed(new Number(8)) +" "+ fixCoin)
                        }

                    }
                    if (this.id == "sellCountInput" || this.id == "sellPriceInput") { 
                        var total = $(".sell_available").html();
                        var wide = this.value / total * totalWide;
                        var fixCoin = coinName.split("_")[1];
                        var coinCode = coinName.split("_")[0]
                        if (new Number(wide) < totalWide) {
                            $("#bar1Div").css("width", wide + "px")
                            $("#btn1").css("left", wide + "px")
                        } else {
                            $("#bar1Div").css("width", totalWide+"px")
                            $("#btn1").css("left", totalWide+"px")
                        }
                        //var a = ($("#sellPriceInput").val() * $("#sellCountInput").val()).toFixed(new Number(keepDecimalForCoin));
                        var a = ($("#sellPriceInput").val() * $("#sellCountInput").val()).toFixed(new Number(8));
                        if(a == "NaN"){
                        	 $("#sell_total").html("0.00000000" +" " + fixCoin);
                        }else{
                        	 $("#sell_total").html( parseFloat(a).toFixed(new Number(keepDecimalForCurrencyOld)) +" " + fixCoin);
                        }
                       
                       

                    }
                }



            })
            $("#sellCountInput").on("keyup", "", function () {
                this.value = this.value.replace(/[^\d.]/g, '');
                var nowVal=$("#sellCountInput").val();
                var maxVal=$(".sell_available").text();
                if(parseFloat(nowVal)>parseFloat(maxVal)){
                    this.value = maxVal; 
                }
                var tval = this.value.split('.');
                var isCur=$("#market_price").hasClass("cur")
                if (tval.length > 1) {
                    if (tval[1].length > keepDecimalForCoin) {
                        this.value = tval[0] + '.' + tval[1].substring(0, keepDecimalForCoin);
                    }
                    
                }

                //根据价格和数量改变拉杆
                //var login = getCookie("isLogin")
                var userName = $("#username").val();
                if(userName != ""){
                    var totalWide = $('.ratings_bars').width();
                    if (this.id == "buySum" || this.id == 'buyPrice') {
                        if ($("#buyPrice").attr("disabled") == "disabled") {
                            var total = $(".buy_available").html();

                            var wide = this.value / total * totalWide;
                            if (new Number(wide) < totalWide) {
                                $("#bar0Div").css("width", wide + "px")
                                $("#btn0").css("left", wide + "px")
                            } else {
                                $("#bar0Div").css("width", totalWide+"px")
                                $("#btn0").css("left", totalWide+"px")
                            }

                        } else {
                            var total = $(".buy_available").html();
                            //取值错误，应做判断
                            var price = this.id == "buySum" ? $("#buyPrice").val() : $("#buySum").val();
                            var wide = this.value * price / total * totalWide;
                            var fixCoin = coinName.split("_")[1];
                            var coinCode = coinName.split("_")[0]
                            if (new Number(wide) < totalWide) {
                                $("#bar0Div").css("width", wide + "px")
                                $("#btn0").css("left", wide + "px")
                            } else {
                                $("#bar0Div").css("width", totalWide+"px")
                                $("#btn0").css("left", totalWide+"px")
                            }
                            $("#buy_total").html((price * this.value).toFixed(new Number(keepDecimalForCurrencyOld)) +" "+ fixCoin)
                            //$("#buy_total").html((price * this.value).toFixed(new Number(8)) +" "+ fixCoin)
                        }

                    }
                    if (this.id == "sellCountInput" || this.id == "sellPriceInput") { 
                        var total = $(".sell_available").html();
                        var wide = this.value / total * totalWide;
                        var fixCoin = coinName.split("_")[1];
                        var coinCode = coinName.split("_")[0]
                        if (new Number(wide) < totalWide) {
                            $("#bar1Div").css("width", wide + "px")
                            $("#btn1").css("left", wide + "px")
                        } else {
                            $("#bar1Div").css("width", totalWide+"px")
                            $("#btn1").css("left", totalWide+"px")
                        }
                        //var a = ($("#sellPriceInput").val() * $("#sellCountInput").val()).toFixed(new Number(keepDecimalForCoin));
                        var a = ($("#sellPriceInput").val() * $("#sellCountInput").val()).toFixed(new Number(8));
                        if(a == "NaN"){
                        	 $("#sell_total").html("0.00000000" +" " + fixCoin);
                        }else{
                        	 $("#sell_total").html( parseFloat(a).toFixed(new Number(keepDecimalForCurrencyOld)) +" " + fixCoin);
                        }
                       
                       

                    }
                }



            })
            $("#sellPriceInput,#buyPrice").on("keyup", "", function () {
                this.value = this.value.replace(/[^\d.]/g, '');
                var tval = this.value.split('.');
                if (tval.length > 1) {
                    if (tval[1].length > keepDecimalForCurrency) {
                        this.value = tval[0] + '.' + tval[1].substring(0, keepDecimalForCurrency);
                    }
                }

                //根据价格和数量改变拉杆
                //var login = getCookie("isLogin")
                var userName = $("#username").val();
                if(userName != ""){
                    var totalWide = $('.ratings_bars').width();
                    if (this.id == "buySum" || this.id == 'buyPrice') {
                        if ($("#buyPrice").attr("disabled") == "disabled") {
                            var total = $(".buy_available").html();

                            var wide = this.value / total * totalWide;
                            if (new Number(wide) < totalWide) {
                                $("#bar0Div").css("width", wide + "px")
                                $("#btn0").css("left", wide + "px")
                            } else {
                                $("#bar0Div").css("width", totalWide+"px")
                                $("#btn0").css("left", totalWide+"px")
                            }

                        } else {
                            var total = $(".buy_available").html();
                            //取值错误，应做判断
                            var price = this.id == "buySum" ? $("#buyPrice").val() : $("#buySum").val();
                            var wide = this.value * price / total * totalWide;
                            var fixCoin = coinName.split("_")[1];
                            var coinCode = coinName.split("_")[0]
                            if (new Number(wide) < totalWide) {
                                $("#bar0Div").css("width", wide + "px")
                                $("#btn0").css("left", wide + "px")
                            } else {
                                $("#bar0Div").css("width", totalWide+"px")
                                $("#btn0").css("left", totalWide+"px")
                            }
                            $("#buy_total").html((price * this.value).toFixed(new Number(keepDecimalForCurrencyOld)) +" "+ fixCoin)
                            //$("#buy_total").html((price * this.value).toFixed(new Number(8)) +" "+ fixCoin)
                        }

                    }
                    if (this.id == "sellCountInput" || this.id == "sellPriceInput") { 
                        var total = $(".sell_available").html();
                        var wide = this.value / total * totalWide;
                        var fixCoin = coinName.split("_")[1];
                        var coinCode = coinName.split("_")[0]
                        if (new Number(wide) < totalWide) {
                            $("#bar1Div").css("width", wide + "px")
                            $("#btn1").css("left", wide + "px")
                        } else {
                            $("#bar1Div").css("width", totalWide+"px")
                            $("#btn1").css("left", totalWide+"px")
                        }
                        //var a = ($("#sellPriceInput").val() * $("#sellCountInput").val()).toFixed(new Number(keepDecimalForCoin));
                        var a = ($("#sellPriceInput").val() * $("#sellCountInput").val()).toFixed(new Number(8));
                        if(a == "NaN"){
                             $("#sell_total").html("0.00000000" +" " + fixCoin);
                        }else{
                             $("#sell_total").html(parseFloat(a).toFixed(new Number(keepDecimalForCurrencyOld)) +" " + fixCoin);
                        }
                       
                       

                    }
                }



            })
			$("#market_price").on("click",function(){
				$("#buySum").val("");
				$("#sellCountInput").val("");
				buyClean();
				sellClean();
			})
			$("#Limit_price").on("click",function(){
				$("#buySum").val("");
				$("#sellCountInput").val("");
				buyClean();
				sellClean();
			})	
			
			function buyClean(){
				$("#btn0").css("left","0px");
                $("#bar0Div").css("width","0px");
                $("#title0").val("0.0000");
                var buy_total = $("#buy_total").html();
                var newBuyTotal = buy_total.split(" ");
                $("#buy_total").html(parseFloat(0.00000000).toFixed(new Number(keepDecimalForCurrencyOld)) +" "+newBuyTotal[1]);
                if(newBuyTotal.length>1){
                	 $("#buy_total").html(parseFloat(0.00000000).toFixed(new Number(keepDecimalForCurrencyOld)) +" "+newBuyTotal[1]);
                }else{
                	$("#buy_total").html(parseFloat(0.00000000).toFixed(new Number(keepDecimalForCurrencyOld)) +" "+newBuyTotal[1]);
                }
			}
			function sellClean(){
				$("#btn1").css("left","-2px");
                $("#bar1Div").css("width","0px");
                $("#title1").val("0.0000");
                var sell_total = $("#sell_total").html();
                var newSellTotal = sell_total.split(" ");
                var fixCoin = coinName.split("_")[1];
                var coinCode = coinName.split("_")[0]
                if(newSellTotal.length>1){
                	 $("#sell_total").html(parseFloat(0).toFixed(new Number(keepDecimalForCurrencyOld))+newSellTotal[1]);
                }else{
                	$("#sell_total").html(parseFloat(0).toFixed(new Number(keepDecimalForCurrencyOld))+" "+fixCoin);
                }
               
                
			}
            //卖币
            $("#sellCoin").on('click', '', function () {
                var entrustPrice = $('#sellPriceInput').val();
                if (entrustPrice == "" && (!$("#buyPrice").attr("disabled") == "disabled")) {
                    layer.msg(weituojiagebunengweikong, {
                        skin:'layer-success',
                        icon: 2,
                        time: 1000
                    })
                    return
                }
                if (entrustPrice!= "" && entrustPrice < 0) {
                    layer.msg(weituojiagebuzhengque, {
                        skin:'layer-success',
                        icon: 2,
                        time: 1000
                    })
                	return
                }
                var entrustCount = $('#sellCountInput').val();
                if (entrustCount == "") {
                    layer.msg(qingshuruweituoshuliang, {
                        skin:'layer-success',
                        icon: 2,
                        time: 1000
                    })
                    return
                }
                if (entrustCount!= "" && entrustCount < 0) {
                    layer.msg(weituoshuliangbuzhengque, {
                        skin:'layer-success',
                        icon: 2,
                        time: 1000
                    })
                	return
                }
                var source = '1';//来源（pc）
                var coinCode = buyCoinCode;//交易对
                var type = '2';//卖
                var sell_available = $('.sell_available').html()
                if ($("#buyPrice").attr("disabled") == "disabled") {//市价
                    var entrustWay = '2';//
                    if (new Number(entrustCount) > new Number(sell_available)) {
                        layer.open({
                            skin:'layer-del',
                            title:wenxintishi,
                            content:yuebuzutishi,
                            area:["480px","270px"],
                            btn: [quxiao,quchongzhi],
                            yes: function(){
                              layer.closeAll();
                            }
                            ,btn2: function(){
                                layer.closeAll('dialog');
                                window.location.href =_ctx+"/user/center";
                            }
                        })
                        return
                    }
                } else {//限价
                    var entrustWay = '1';//
                    if (new Number(entrustCount) > new Number(sell_available)) {
                        layer.open({
                            skin:'layer-del',
                            title:wenxintishi,
                            content:yuebuzutishi,
                            area:["480px","270px"],
                            btn: [quxiao,quchongzhi],
                            yes: function(){
                              layer.closeAll();
                            }
                            ,btn2: function(){
                                layer.closeAll('dialog');
                               window.location.href =_ctx+"/user/center";
                            }
                        })
                        return
                    }
                }

                $('#sellCountInput').val("");
                $.ajax({
                    type: "post",
                    url: _ctx + "/user/trades/add",
                    data: {
                        entrustPrice: entrustPrice,
                        entrustCount: entrustCount,//限价委托数
                        entrustSum: entrustCount,//市价委托数
                        source: source,
                        coinCode: coinCode,
                        type: type,
                        entrustWay: entrustWay
                    },
                    cache: false,
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            if(data.success==true){
                            	sellClean();
                                layer.msg(data.msg, {
                                    skin:'layer-success',
                                    icon: 1,
                                    time: 1000
                                })
                               
                            }else{
                            	sellClean();
                                /*layer.msg(data.msg, {
                                    skin:'layer-success',
                                    icon: 2,
                                    time: 1000
                                })*/
                                layer.open({
                                    skin:'layer-del',
                                    title:wenxintishi,
                                    content:data.msg,
                                    area:["480px","270px"],
                                    btn: [quxiao,quchongzhi],
                                    yes: function(){
                                      layer.closeAll();
                                    }
                                    ,btn2: function(){
                                        layer.closeAll('dialog');
                                        window.location.href =_ctx+"/user/center";
                                    }
                                })
                               
                            }
                        }
                    },
                    error: function (e) {

                    }
                });
            })
            
            $("#Onekeyrevocation a").on("click",function(){
            	var length = $("#listing ul").children().length;
            	if(length==0){
            		return false;
            	}
            	var type = null;
            	$(".myListing li").each(function(){
            		var value = $(this).attr("class");
            		var datatype = $(this).attr("data-type");
            		if(value!="undefined"&&value=="z_active"){
            			if(datatype=='buy'){
            				type=1;
            			}else if(datatype=='sell'){
            				type=2;
            			}
            		}
            	});
            	$("#listing ul ul").each(function(i,v){
            		var enturstNums = $(this).find("li").children("a").attr("data-id");
            		var entrustPrice = $(this).find("li").eq(4).html();
            		var coinCode= $(this).find("li").eq(2).html().replace("/","_");
            		if(type == null){
               		 type= $(this).find("li").eq(3).html()==mairu?1:2;
            		}
            		$.ajax({
                        type: "post",
                        url: _ctx + "/user/trades/cancelExEntrust",
                        data: {
                            entrustNums:enturstNums,
                            entrustPrice:entrustPrice,
                            coinCode:coinCode,
                            type:type
                        },
                        cache: false,
                        dataType: "json",
                        success: function (data) {
                            if (data) {
                                if(data.success==true){
                                    layer.msg(data.msg, {
                                        skin:'layer-success',
                                        icon: 1,
                                        time: 1000
                                    })
                                }else{
                                    layer.msg(data.msg, {
                                        skin:'layer-success',
                                        icon: 2,
                                        time: 1000
                                    })
                                }

                            }
                        },
                        error: function (e) {

                        }
                    });
            		
            	});
            
            		
            });
           
            
            $("#listing").on("click",".btn_cancel",function () {
               
                var entrustNums = $(this).attr("data-id");
                var entrustPrice = $(this).parent().siblings().eq(4).html();
                var coinCode=$(this).parent().siblings().eq(2).html().replace("/","_");
                var type=$(this).parent().siblings().eq(3).html()==mairu?1:2;
                var that=$(this);
                $.ajax({
                    type: "post",
                    url: _ctx + "/user/trades/cancelExEntrust",
                    data: {
                        entrustNums:entrustNums,
                        entrustPrice:entrustPrice,
                        coinCode:coinCode,
                        type:type
                    },
                    cache: false,
                    dataType: "json",
                    success: function (data) {
                        
                        if (data) {
                            if(data.success==true){
                                layer.msg(data.msg, {
                                    skin:'layer-success',
                                    icon: 1,
                                    time: 1000
                                })
                            that.attr("disabled","disabled"); 
                            }else{
                                layer.msg(data.msg, {
                                    skin:'layer-success',
                                    icon: 2,
                                    time: 1000
                                })
                            }

                        }
                        

                    },
                    error: function (e) {

                    }
                });
            })

            function getCookie(name) {
                var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                if (arr != null) return unescape(arr[2]);
                return null;
            }

        },
        loadChart: function (coinName) {

            var chartTheme = {
                colors: [ "#3D8146","#AE4E54"],
                chart: {
                    backgroundColor: "#181B2A",
                    //borderColor: "#fff",
                    //borderRadius: 0,
                    //plotShadow: !0,
                    //plotBorderWidth: 1,
                    height: 510
                },
                xAxis: {
                    gridLineWidth: 0,
                    lineColor: "#000",
                    tickColor: "#000",
                    labels: {
                        style: {
                            color: "#545B79"
                        }
                    },
                    title: {
                        style: {
                            color: "#333"
                        }
                    }
                },
                yAxis: {
                    gridLineWidth: 0,
                    lineColor: "#000",
                    lineWidth: 1,
                    tickWidth: 1,
                    labels: {
                        style: {
                            color: "#545B79"
                        }
                    },
                    title: {
                        style: {
                            color: "#333"
                        }
                    }
                },
                plotOptions: {
                    series: {
                        fillOpacity: .2
                    }
                }
            }
            Highcharts.setOptions(chartTheme);
            Highcharts.zdy_chart = new Highcharts.Chart('container_deep', {
                chart: {
                    type: "area",
                    //renderTo: "chart_depth"
                },
                title: {
                    text: ""
                },
                subtitle: {
                    text: ""
                },
                credits: {
                    text: "",
                    href: ""
                },
                xAxis: {

                    labels: {
                        formatter: function () {
                            return this.value;
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        formatter: function () {
                            return this.value
                        }
                    }
                },
                tooltip: {
                    shared: !0,
                    formatter: function () {
                        return weituojia + this.points[0].x + "<br>" + leijishuliang + this.points[0].y
                    }
                },
                plotOptions: {
                    area: {
                        pointStart: 0,
                        marker: {
                            enabled: !1,
                            symbol: "circle",
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: !0
                                }
                            }
                        }
                    }
                },
                series: [{
                    name: '',
                    //data: buyArr
                    data: []
                },
                    {
                        name: '',
                        //data: sellArr
                        data: []
                    }]
            });



            //实时拉取最新价等价格
            socket.emit('coinCode',coinName);

            socket.on('deep', function (data){
                var len = data.bids.length < data.asks.length ? data.asks.length : data.bids.length;
                var sellArr = new Array()
                var buyArr = new Array()
                //两个数组的长度要一样
                for(var i=0;i<len;i++){
                    sellArr[i] = data.bids[i];
                    buyArr[i]=data.asks[i]
                }

                Highcharts.zdy_chart.series[0].setData(sellArr,true,true,false);
                Highcharts.zdy_chart.series[1].setData(buyArr,true,true,false);

            })

        }
    }
})