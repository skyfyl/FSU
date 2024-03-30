// ==UserScript==
// @name         【FSU】EAFC FUT WEB 增强器 Kobe
// @namespace    https://futcd.com/
// @version      24.15.1
// @description  EAFCFUT模式SBC任务便捷操作增强器👍👍👍，额外信息展示、近期低价自动查询、一键挂出球员、跳转FUTBIN、快捷搜索、拍卖行优化等等...👍👍👍
// @author       Futcd_kcka Kobe
// @match        https://www.ea.com/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.easports.com/*/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.ea.com/*/ea-sports-fc/ultimate-team/web-app/*
// @require      https://cdn.staticfile.org/lodash.js/4.17.21/lodash.min.js
// @updateURL    https://github.com/skyfyl/FSU/releases/latest/download/FSU.Kobe.user.js
// @downloadURL  https://github.com/skyfyl/FSU/releases/latest/download/FSU.Kobe.user.js
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      ea.com
// @connect      futbin.com
// @connect      futbin.org
// @connect      futcd.com
// @connect      fut.gg
// @license      MIT
// ==/UserScript==
 
(function () {
    'use strict';
    !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(require("lodash")):"function"==typeof define&&define.amd?define(["lodash"],t):t((e=e||self)._)}(this,(function(e){"use strict";(e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e).mixin({multicombinations:function(t,n){var i=e.values(t),f=function(e,t){if(--t<0)return[[]];var n=[];e=e.slice();for(var i=function(){var i=e[0];f(e,t).forEach((function(e){e.unshift(i),n.push(e)})),e.shift()};e.length;)i();return n};return f(i,n)}})}));
    var events = {},info = {},cntlr = {},html = {},call = {},set = {},pdb = {},lock = {},build = {};
    info = {
        "task":{"obj":{"stat":{},"html":"","source":[]},"sbc":{"stat":{},"html":""}},
        "base":{"state":false,"platform":"pc","price":{},"sId":"","localization":"",autoLoad:true,"ratings":{},"input":true,"promo":0,"template":false,"losauction":false,"savesquad":false,"packcoin":{}},
        "criteria":{},
        "roster":{"state":false,"data":{},"page":-1,"element":{},"thousand":{"lowest":99}},
        "language":2,
        "localization":{},
        "quick":{},
        "market":{"ts":0,"mb":[]},
        "range":[46,99],
        "build":{"league":true,"rare":true,"untradeable":true,"ignorepos":true},
        "league":{2012:'中超',61:'英乙',60:'英甲',14:'英冠',13:'英超',2208:'英丙',2149:'印超',32:'意乙',31:'意甲',54:'西乙',53:'西甲',68:'土超',50:'苏超',308:'葡超',39:'美职联',17:'法乙',16:'法甲',20:'德乙',19:'德甲',2076:'德丙',2118:'传奇',353:'阿甲'},
        "setfield":{"card":["pos","price","other","club","low","accele"],"player":["auction","futbin","getprice","loas","uatoclub","transfertoclub"],"sbc":["top","right","quick","duplicate","records","input","icount","template","templatemode","market","sback","cback","dupfill","autofill","squadcmpl","conceptbuy","meetsreq"],"info":["obj","sbc","sbcf","sbcs","pack","squad","skipanimation","sbcagain","packagain"]},
        "set":{},
        "lock":[],
        "douagain":{"sbc":0,"pack":0},
        "formation":{27:[0,5,5,5,12,10,10,16,25,18,25],
            5:[0,3,5,5,7,14,14,23,27,25,25],
            21:[0,3,5,5,7,12,18,14,18,16,25],
            31:[0,2,5,5,5,8,14,10,14,25,25],
            22:[0,5,5,5,12,14,10,14,16,25,25],
            23:[0,5,5,5,12,14,14,16,25,18,25],
            24:[0,5,5,5,12,14,14,16,21,25,21],
            1:[0,3,5,5,7,12,10,16,14,25,25],
            7:[0,3,5,5,7,14,14,14,21,25,21],
            29:[0,2,5,5,5,8,14,14,25,18,25],
            14:[0,3,5,5,7,12,10,16,25,18,25],
            15:[0,3,5,5,7,14,10,14,25,18,25],
            4:[0,3,5,5,7,10,10,12,18,16,25],
            9:[0,3,5,5,7,14,10,14,23,25,27],
            10:[0,3,5,5,7,10,14,10,23,25,27],
            11:[0,3,5,5,7,14,18,14,23,25,27],
            12:[0,3,5,5,7,14,10,14,23,21,27],
            17:[0,3,5,5,7,12,10,10,16,25,25]
        }
    };

    cntlr = {
        "current":function(){return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController();},
        "right":function(){return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._rightController._currentController},
        "left":function(){return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._leftController},
    };

    events.notice = function(text,type){
        services.Notification.queue([fy(text),type])
    };

    events.init =  async function(){
        
        info.base.year = APP_YEAR_SHORT;
        MAX_NEW_ITEMS = 100;
        console.log(info.language)
       
        let user = services.User.getUser().getSelectedPersona();
        if(user.isXbox || user.isPlaystation || user.isStadia){
            info.base.platform = "ps";
        }
        services.User.maxAllowedAuctions = 100;
        
        let lb = events.createButton(
            new UTButtonControl(),
            fy("loadingclose.text"),
            async(e) => {
                events.kobe_hideLoader()
            },
            "fsu-loading-close"
        )
        info.base.close = lb;
        document.querySelector(".ut-click-shield").append(info.base.close.__root);
        info.base.localization = services.Localization.repository._collection;
        
        // await events.reloadPlayers();
        // events.notice("notice.succeeded",0);
    };

    //获取缓存球员数据
    events.getItemBy = (type,queryOptions,insertData,replaceData) => {
        let players = replaceData ? replaceData : repositories.Item.club.items,
        ratingOrder = queryOptions.hasOwnProperty("LTrating") ? "desc" : "asc";
        for (let [k,v] of Object.entries(queryOptions)) {
            players = players.filter(i => {
                if(i.type === 'player' && i.loans === -1 && i.academy == null){
                    switch(k){
                        case "rs":
                            switch(v){
                                case 0:
                                    return i.rating >= 0 && i.rating <= 64 && (!i.isSpecial() || i.leagueId == 1003  || i.leagueId == 1014);
                                case 1:
                                    return i.rating >= 65 && i.rating <= 74 && (!i.isSpecial() || i.leagueId == 1003  || i.leagueId == 1014);
                                case 2:
                                    return i.rating >= 75 && i.rating <= 83 && (!i.isSpecial() || i.leagueId == 1003  || i.leagueId == 1014);
                                default:
                                    return i.rating >= 0 && i.rating <= 99;
                            }
                        case "gs":
                            return v ? i.groups.includes(4) : i.groups.length == 0;
                        case "levelId":
                            switch(v){
                                case 3:
                                    return i.isSpecial();
                                case 0:
                                    return i.isBronzeRating() && !i.isSpecial();
                                case 1:
                                    return i.isSilverRating() && !i.isSpecial();
                                case 2:
                                    return i.isGoldRating() && !i.isSpecial();
                            }
                        case "BTWrating":
                            if(v[0] > v[1]){
                                ratingOrder = "desc";
                                return i.rating >= v[1] && i.rating <= v[0];
                            }else{
                                return i.rating >= v[0] && i.rating <= v[1];
                            }
                        case "bepos":
                            return i.basePossiblePositions.includes(v);
                        case "lock":
                            if(v){
                                return info.lock.includes(i.id);
                            }else{
                                return !info.lock.includes(i.id);
                            }
                        case "quality":
                            switch(v){
                                case "=1" && "<=1":
                                    return i.isBronzeRating();
                                case "=2":
                                    return i.isSilverRating();
                                case "=3" && ">=3":
                                    return i.isGoldRating();
                                case ">=1" && "<=3":
                                    return true;
                                case ">=2":
                                    return i.isSilverRating() || i.isGoldRating();
                                case "<=2":
                                    return i.isSilverRating() || i.isBronzeRating();
                                default:
                                    return true;
                            }
                        default:
                            if(/NE/.test(k)){
                                let rk = k.replace(/NE/, '');
                                return v instanceof Array ? !v.includes(i[rk]) : i[rk] !== v;
                            }else if(/GT/.test(k)){
                                let rk = k.replace(/GT/, '');
                                return v instanceof Array ? i[rk] >= Math.max(...v) : i[rk] >= v;
                            }else if(/LT/.test(k)){
                                let rk = k.replace(/LT/, '');
                                return v instanceof Array ? i[rk] <= Math.min(...v) : i[rk] <= v;
                            }else{
                                return v instanceof Array ? v.includes(i[k]) : i[k] === v;
                            }
                    }
                } 
            });
        }
        players = _.orderBy(players,["rating","untradeable","rareflag","_itemPriceLimits.minimum","_itemPriceLimits.maximum"],[`${ratingOrder}`,"desc","asc","asc","asc"]);
        if(insertData && !replaceData){
            let tIds = [...new Set(insertData.map(i => {if(i.isDuplicate() && !i.isLoaned() && i.isPlayer()){return i.duplicateId}}))];
            for (let i of tIds) {
                let ix = players.findIndex(it => it.id === i);
                if(ix !== -1){
                    let tItem = players.splice(ix, 1)[0];
                    players.unshift(tItem);
                }
            }
        }
        if(type == 1){
            return players.map(member => member.definitionId);
        }else if(type == 2){
            return players;
        }
    }

    //加载loading界面
    events.kobe_showLoader = () => {
        document.querySelector(".ut-click-shield").classList.add("showing","fsu-loading");
        document.querySelector(".loaderIcon").style.display = "block";
    };
    
    //隐藏loading界面
    events.kobe_hideLoader = () => {
        document.querySelector(".ut-click-shield").classList.remove("showing","fsu-loading");
        document.querySelector(".loaderIcon").style.display = "none";
        if(info.base.template){
            info.base.template = false;
            isPhone() ? cntlr.current()._view._fsuSquad.setInteractionState(1) : cntlr.right().getView()._fsuSquad.setInteractionState(1);
        }
        if(info.base.losauction){
            info.base.losauction = false;
            if(isPhone()){
                events.notice("notice.phoneloas",0)
            }
        }
        events.kobe_changeLoadingText("loadingclose.text");
    };
    //本地化文本显示程序
    const fy = function(p){
        let t = "";
        if(Array.isArray(p)){
            t = info.localization[p.shift()][info.language];
            let s = p.slice();
            for (let n in s) {
                t = t.replace(`%${Number(n) + 1}`,`${s[n]}`);
            }
        }else if(p.indexOf("{") !== -1){
            t = p;
            let pa = p.match(/{(.*?)}/g);
            for (let i of pa) {
                let pf = i.match(/{(.*?)}/)[1];
                if(info.localization.hasOwnProperty(pf)){
                    t = t.replace(i,info.localization[pf][info.language]);
                }
            }
        }else{
            t = info.localization.hasOwnProperty(p) ? info.localization[p][info.language] : p;
        }
        return t;
    }
    //本地化文本内容
    info.localization = {
        "price.btntext":["查询价格","查詢價格","Check Price"],
        "price.formatno":["无数据","沒有數據","No Data"],
        "price.formatcompany":["万","萬","ten thousand"],
        "price.now":["球员低价","最低價格","Low Price"],
        "price.low":["评分低价","評分最低價格","Rating Price"],
        "price.last":["购买价格","購入價格","Bought Price"],
        "duplicate.swap":["可发送俱乐部","可以送到球會","Can be Sent to Club"],
        "duplicate.not":["队内不可交易","球會球員無法交易","Club Players are Untradeable"],
        "duplicate.yes":["队内可交易","球會球員可交易","Club Players are Tradable"],
        "duplicate.nodata":["无队内数据","沒有球員數據","No Club Players Data"],
        "duplicate.lowprice":["评分低价:","評分最低價格:","Rating Price "],
        "top.readme":["【FSU】插件使用说明","【FSU】插件使用說明","【FSU】Plugin Instructions"],
        "top.upgrade":["有新版FSU插件可升级","有新版本的FSU插件可更新","There is a new version of the FSU plugin that can be upgraded"],
        "notice.upgradefailed":["查询新版本失败","查詢新版本失敗","Query new version failed"],
        "notice.upgradeconfirm":["有新版本点击顶部链接查看","有新版本點擊頂部鏈接查看","There is a new version, click the top link to view"],
        "notice.uasreset":["已重新载入列表 请重新进入查看","已重新載入列表 請重新進入查看","The list has been reloaded, please re-enter to view"],
        "notice.priceloading":["开始读取价格数据 请稍等","開始讀取價格數據 請稍等","Start reading price data, please wait"],
        "notice.loaderror":["读取数据失败 请检查网络","讀取數據失敗 請檢查網絡","Failed to read data, please check the network"],
        "notice.succeeded":["FSU插件加载成功","FSU插件載入成功","FSU plugin loaded successfully"],
        "notice.duplicateloading":["开始读取重复球员数据 请稍等","開始讀取重複球員數據 請稍等","Start reading duplicate player data, please wait"],
        "notice.quicksearch":["使用快捷添加 直接沿用上次配置搜索球员","使用快捷增加球員 直接沿用上次配置搜索球員","Use the shortcut to add, directly follow the last configuration to search for players"],
        "notice.appointloading":["开始读取指定条件球员 请稍等","開始讀取指定條件球員 請稍等","Start reading the specified condition player, please wait a moment"],
        "notice.noduplicate":["已无重复球员","已經沒有重複球員","no duplicate player"],
        "notice.quickauction":["球员将按照最低售价作为即买价挂出","球員將按最低價格列在轉會市場上","Players will be listed at the lowest selling price as an immediate purchase price"],
        "task.player":["球员","球員","Player"],
        "task.pack":["组合包","組合包","Pack"],
        "task.added":["今日新增：","今日新增：","Added today "],
        "task.noadded":["今日无新增","今日沒有新增","No new additions today"],
        "task.new":["新","新","New"],
        "task.expire":["即将到期","即將過期","Expiring"],
        "task.nodata":["无数据请过段时间重新进入WEBAPP再查看","沒有數據請過段時間重新進入WEBAPP再查看","No data, please re-enter WEBAPP after a while to check"],
        "sbc.price":["造价预估：","製作價格：","Cost estimate:"],
        "sbc.topprice":["预估造价","製作價格","Estimate"],
        "sbc.topsquad":["阵容价值","球隊價格","Squad"],
        "sbc.like":["值得做：","贊成：","Thumbs Up："],
        "sbc.dislike":["不值得：","反對：","Thumbs Down："],
        "sbc.consult":["抄作业","參考方案","See Plan"],
        "sbc.count":["算评分","計算評分","Calculate Score"],
        "sbc.duplicates":["重复球员名单","重複球員名單","Duplicate Players List"],
        "sbc.qucikdupes":["重","重","D"],
        "sbc.appoint":["指定条件球员名单","指定條件球員名單","Specified conditions Player list"],
        "sbc.addduplicate":["添加重复球员","新增重複球員","Add Duplicate Players"],
        "sbc.swapduplicate":["替换为重复球员","交換為重複球員","Swap Duplicate Players"],
        "sbc.notduplicate":["无重复球员","沒有重複球員","No Duplicate Players"],
        "sbc.addquick":["快捷添加球员","快速新增球員","Quick Add Player"],
        "sbc.swapquick":["快捷替换球员","快速交換球員","Quick Swap Player"],
        "sbc.watchplayer":["查看球员","查看球員","Watch Player"],
        "uasreset.btntext":["重载名单","重新載入名單","Reload List"],
        "sbc.filtert":["筛选","篩選","Filter"],
        "sbc.filter0":["全部","全部","All"],
        "sbc.filter1":["新增","新增","New"],
        "sbc.filter2":["临期","即期","Expiring"],
        "sbc.filter3":["高评价","高評價","Approval"],
        "loadingclose.text":["数据载入 如卡顿点此关闭","數據載入中 如長時間未響應 請點擊此處關閉","If you encounter stuck, click here to close"],
        "quicklist.gotofutbin":["前往FUTBIN查看","前往FUTBIN查看","Go to FUTBIN"],
        "quicklist.auction":["按低价快速拍卖","使用最低價格列入轉會","Quick Auction at Low Price"],
        "pack.promo":["特殊球员","特殊球員","PROMO"],
        "emptylist.t":["处理后无符合条件球员","處理後無符合條件球員","No eligible players after processing"],
        "emptylist.c":["请改变条件或翻页查看","請改變條件或翻頁查看","Please change the criteria or flip the page to view"],
        "set.title":["FSU设置","FSU設定","FSU Settings"],
        "set.card.title":["球员卡信息","球員卡資訊","Player Card Information"],
        "set.card.pos":["额外位置","額外位置","Extra Position"],
        "set.card.price":["球员价格","球員價格","Player Price"],
        "set.card.other":["其他属性","其他屬性","Other Attributes"],
        "set.card.club":["俱乐部内球员","俱樂部內球員","Club Players"],
        "set.card.low":["评分低价","評分低價","Low Rating Price"],
        "set.sbc.title":["SBC操作","SBC 操作","SBC Operations"],
        "set.sbc.top":["阵容顶部按钮","陣容頂部按鈕","Top Buttons"],
        "set.sbc.right":["阵容右侧按钮","陣容右側按鈕","Right-side Buttons"],
        "set.sbc.quick":["快捷添加球员","快速添加球員","Quick Add Players"],
        "set.sbc.duplicate":["重复球员填充","重複球員填充","Fill with Duplicate Players"],
        "set.sbc.records":["选项记录","選項記錄","Option Records"],
        "set.sbc.input":["信息输入检索","資訊輸入檢索","Information Input Search"],
        "set.info.title":["信息展示","資訊展示","Information Display"],
        "set.info.obj":["目标顶部显示","目標頂部顯示","Objective top display"],
        "set.info.sbc":["SBC顶部显示","SBC頂部顯示","SBC top display"],
        "set.info.sbcf":["SBC筛选","SBC篩選","SBC Filters"],
        "set.info.sbcs":["SBC子任务","SBC子任務","SBC Subtasks"],
        "set.info.pack":["球员包可开球员","球員包可開球員","Pack PROMO"],
        "set.info.squad":["阵容价值","陣容價值","Squad Value"],
        "set.style.title":["球员卡信息样式","球員卡資訊樣式","Player Card Information Style"],
        "set.style.new":["随品质变化","隨品質變化","Varies with Quality"],
        "set.style.old":["纯色样式","純色樣式","Solid Color Style"],
        "set.player.title":["选中球员操作","選中球員操作","Select Player Action"],
        "set.player.auction":["按低价快速拍卖","按低價快速拍賣","Quick Auction at Low Price"],
        "set.player.futbin":["前往FUTBIN查看","前往FUTBIN查看","Go to FUTBIN for Details"],
        "quicklist.getprice":["查询拍卖低价","查詢拍賣低價","Search for Auction Price"],
        "quicklist.getpricey":["刷新拍卖低价","重新整理拍賣低價","Refresh Auction Price"],
        "set.player.getprice":["查询拍卖低价","查詢拍賣低價","Search for Auction Price"],
        "quicklist.getpricelt":["最低价","最低價","Lowest price"],
        "quicklist.getpriceload":["读取中","讀取中","Loading"],
        "sbc.swaprating":["替换为同评分","替換為同評分","Replace with the same rating"],
        "sbc.squadfill":["SBC方案填充","SBC方案填充","SBC squad autofill"],
        "notice.templateload":["读取SBC方案并比价中 请稍后","讀取SBC方案並比價中 請稍後","Reading SBC squad and comparing prices. Please wait."],
        "notice.templateerror":["阵容保存失败 请重新尝试","陣容儲存失敗 請重新嘗試","Failed to save the squad. Please try again."],
        "notice.templatesuccess":["阵容填充成功","陣容填充成功","Squad Filled Successfully"],
        "notice.templatezero":["无可加载方案 请稍后再试","無可載入的方案 請稍後再試","Squad failed to save, please try again"],
        "set.sbc.template":["SBC方案填充","SBC方案填充","SBC squad autofill"],
        "notice.marketsetmax":["已修改优化搜索信息可直接搜索 如无结果请返回调整参数","已修改優化搜尋資訊，可直接搜尋。如無結果，請返回調整參數。","Optimizations have been made to the search information. You can now search directly. If there are no results, please return and adjust the parameters."],
        "set.sbc.market":["假想球员拍卖搜索优化","假想球员拍賣搜尋優化","Fantasy Player Auction Search Optimization"],
        "notice.auctionsuccess":["%1 挂牌 %2 成功","%1 掛牌 %2 成功","%1 listed %2 successfully."],
        "notice.auctionnoplayer":["%1 没有找到球员","%1 沒有找到球員","%1 player not found."],
        "notice.auctionlimits":["%1 FUTBIN价格超出球员限价","%1 FUTBIN價格超出球員限價","The FUTBIN price for %1 exceeds player limit."],
        "notice.auctionmax":["已达到拍卖行上限","已達到拍賣行上限","Auction house limit reached."],
        "losa.all":["全选","全選","Select All"],
        "losa.select":["已选球员","已選球員","Selected"],
        "losa.price":["共计可售","共計可售","Total"],
        "loas.button":["拍卖所选球员","拍賣所選球員","Auction Selected Players"],
        "loas.popupt":["球员批量挂拍卖提示","球員批量掛拍賣提示","Bulk Auction Listing Reminder for Players"],
        "loas.popupm":["已选择本列表中 %1 个球员拍卖价格大致为 %2 ，请点击确认开始陆续上架拍卖，途中可点击加载图标下文字取消。","已選擇本列表中 %1 個球員拍賣價格大致為 %2 ，請點擊確認開始陸續上架拍賣，途中可點擊加載圖標下文字取消。","You have selected approximately %1 players from this list, with an estimated auction price of %2. Please click confirm to start listing them for auction one by one. You can click the text below the loading icon to cancel during the process."],
        "loas.variation":["本版块批量拍卖选择球员调整为 %1 个","本版塊批量拍賣選擇球員調整為 %1 個","Batch auction selection of players in this section is adjusted to %1"],
        "loas.start":["程序开始批量售卖球员 预计耗费 %1 秒","程式開始批量售賣球員 預計耗費 %1 秒","The program starts to sell players in bulk, which is expected to take %1 of seconds"],
        "loadingclose.template1":["读取SBC方案列表中 请稍后","讀取SBC方案列表中 請稍後","Read the list of SBC schemes, please wait"],
        "loadingclose.template2":["正在读取方案 %1 阵容 剩余 %2 方案 点此可结束程序","正在讀取和比對方案 %1 陣容 剩餘 %2 方案 點此可結束程式","Reading and comparing plan %1 lineup, remaining %2 plans, click here to end the program"],
        "loadingclose.loas":["正在挂牌第 %1 个球员 剩余 %2 个 点此可结束程序","正在掛牌第 %1 個球員 剩餘 %2 個 點此可結束程式","The %1 players are being listed, and the remaining %2, click here to end the program"],
        "set.player.loas":["批量拍卖球员","批量拍賣球員","Bulk Auction Players"],
        "notice.squaderror":["方案读取失败 可能是FUTBIN无作业方案 请稍后再试","方案讀取失敗 可能是FUTBIN無作業方案 請稍後再試","Scheme reading failed, it may be that FUTBIN has no job scheme, please try again later"],
        "set.getdoc":["查看设置说明","檢視設定說明","View setup instructions"],
        "builder.league":["排除指定联赛球员","排除指定聯賽球員","Exclude designated league"],
        "builder.rare":["排除周最佳球员","排除周最佳球員","Exclude TOTW"],
        "notice.phoneloas":["请注意手机端挂牌后需重新进入拍卖清单才会刷新显示。","請注意手機端掛牌後需重新進入拍賣清單才會重新整理顯示。","Please note that after listing on the mobile terminal, you need to re-enter the auction list before refreshing the display."],
        "notice.builder":["通过排除后球员数量已不足以填充阵容，如需要请调整条件再次搜索。","通過排除後球員數量已不足以填充陣容，如需要請調整條件再次搜尋。","The number of players after exclusion is no longer sufficient to fill the lineup, please adjust the criteria to search again if necessary."],
        "notice.conceptdiff":["发现所购买的假想球员有多个版本，已经将非搜索版本的亮度。","發現所購買的假想球員有多個版本，已經將非搜尋版本的亮度。","Found that there are multiple versions of the purchased hypothetical player, the brightness of the non-searched version has been added."],
        "notice.packback":["已无未分配球员 自动返回","已無未分配球員 自動返回","No unassigned players, automatically return"],
        "sbc.swapchem":["替换为默契球员","替換為默契球員","Swap Chemistry Players"],
        "notice.notchemplayer":["俱乐部中没有满足当前默契需求的球员","俱樂部中沒有滿足當前默契需求的球員","there are no players in the club who meet the current chemistry needs"],
        "sbc.addchem":["添加默契球员","新增默契球員","Add Chemistry Players"],
        "notice.chemplayerloading":["开始读取满足默契球员 请稍等","開始讀取滿足默契球員 請稍等","Start reading Meet chemistry players, please wait"],
        "sbc.chemplayer":["默契球员名单","默契球員名單","Chemistry Players List"],
        "notice.noplayer":["已无指定条件球员","已無指定條件球員","No conditions specified player"],
        "squadback.popupt":["阵容回退提示","陣容回退提示","Squad Back Tip"],
        "squadback.popupm":["请注意，阵容回退后将无法再返回到此阵容，还可回退 %1 次。","請注意，陣容回退後將無法再返回到此陣容，還可回退 %1 次。","Note that the squad will no longer be able to return to this lineup after retreating, and can go back %1 times."],
        "sbc.squadback":["退","退","B"],
        "notice.nosquad":["已无操作记录 无法法回退","已無操作記錄 無法法回退","There is no operation record and cannot be rolled back"],
        "tile.settitle":["插件配置","外掛配置","Plugin configuration"],
        "tile.settext":["配置FSU功能开关","配置FSU功能開關","Configure FSU function switch"],
        "tile.infotitle":["使用说明","使用說明","Instructions for use"],
        "tile.infotext":["查看插件使用说明","檢視外掛使用說明","View plugin instructions"],
        "tile.fbtitle":["问题反馈","問題反饋","Problem feedback"],
        "tile.fbtext":["有问题请尽快反馈","有問題請儘快反饋","If you have any questions, please give feedback ASAP."],
        "set.sbc.cback":["假想球员购买自动分配","假想球员购买自动分配","Hypothetical player purchase automatic distribution"],
        "set.sbc.sback":["阵容回退","阵容回退","lineup fallback"],
        "swaptradable.btntext":["批量交换可交易","批量交换可交易","Bulk exchange tradable"],
        "swaptradable.popupt":["批量交换队内可交易球员","批量交换队内可交易球员","Batch exchange of tradable players within the team"],
        "swaptradable.popupm":["点击确定可将未分配中球员与队内可交易球员交换，共可交换 %1 个。","点击确定可将未分配中球员与队内可交易球员交换，共可交换 %1 个。","Click OK to exchange unassigned players with tradable players in the team, for a total of %1 players."],
        "notice.swaptsuccess":["%1 交换成功","%1 交换成功","%1 exchange successful"],
        "notice.swapterror":["%1 交换失败 程序暂停","%1 交换失败 程序暂停","%1 exchange failed, program paused"],
        "loadingclose.swapt":["正在交换第 %1 个球员 剩余 %2 个","正在交换第 %1 个球员 剩余 %2 个","Swap %1 player,%2 remaining"],
        "set.player.swapt":["未分配批量交换可交易","未分配批量交換可交易","Unallocated Bulk Exchange Tradable"],
        "set.sbc.dupfill":["重复球员填充阵容","重複球員填充陣容","Repeat player fill squad"],
        "dupfill.btntext":["重复球员填充阵容","重複球員填充陣容","Repeat player fill squad"],
        "autofill.btntext":["一键填充(优先重复)","一鍵填充(優先重複)","One-click fill (priority repeat)"],
        "set.sbc.icount":["搜索球员数量显示","搜尋球員數量顯示","Search number of players displayed"],
        "set.sbc.autofill":["一键填充球员","一鍵填充球員","One-click fill player"],
        "completion.btntext":["一键补全阵容","一鍵補全陣容","One-click complete lineup"],
        "set.sbc.completion":["一键补全阵容","一鍵補全陣容","One-click complete lineup"],
        "notice.setsuccess":["设置保存成功","設定儲存成功","Settings saved successfully"],
        "notice.seterror":["设置保存失败 请检查","設定儲存失敗 請檢查","Settings failed to save, please check"],
        "shieldlea.btntext":["排除联赛设置","排除聯賽設定","Exclude league settings"],
        "shieldlea.placeholder":["请输入联赛数字ID和英文逗号","請輸入聯賽數字ID和英文逗號","Please enter the league number ID and English comma"],
        "squadcmpl.btntext":["阵容补全(优先重复)","陣容補全(優先重複)","Squad completion (priority repeat)"],
        "squadcmpl.popupt":["阵容补全提示","陣容補全提示","Squad Completion Tips"],
        "squadcmpl.placeholder":["请填入评分和英文逗号组合","請填入評分和英文逗號組合","Please fill in the combination of ratings and English commas"],
        "squadcmpl.placeholder_zero":["无需填充空位","無需填充空位","No need to fill gaps"],
        "squadcmpl.error":["输入填充评分格式不匹配 无法填充指定评分","輸入填充評分格式不匹配 無法填充指定評分","The input fill score format does not match, and the specified score cannot be filled"],
        "set.sbc.squadcmpl":["阵容补全功能","陣容補全功能","Squad completion"],
        "notice.ldatasuccess":["球员数据已全部加载成功","球員資料已全部載入成功","All player data has been loaded successfully"],
        "notice.ldataerror":["球员数据加载失败 请重刷新页面加载 否则核心功能无法使用","球員資料載入失敗 請重重新整理頁面載入 否則核心功能無法使用","Player data loading failed, please refresh the page to load, otherwise the core functions cannot be used"],
        "loadingclose.ldata":["正在读取球员数据（%1/%2）请耐心等待","正在讀取球員資料（%1/%2）請耐心等待","Reading player data (%1/%2) please be patient"],
        "uatoclub.btntext":["直接发送%1个至俱乐部","直接傳送%1個至俱樂部","Send %1 directly to the club"],
        "uatoclub.success":["直接发送俱乐部成功","直接傳送俱樂部成功","Send directly to the club successfully"],
        "uatoclub.error":["直接发送俱乐部失败 请进入页面自行分配","直接傳送俱樂部失敗 請進入頁面自行分配","Failed to send the club directly, please enter the page to assign it yourself."],
        "set.info.skipanimation":["跳过开包动画","跳過開包動畫","Skip the package animation"],
        "builder.untradeable":["仅限不可交易球员","僅限不可交易球員","Only Untradeable"],
        "set.player.uatoclub":["未分配外部发送至俱乐部","未分配外部傳送至俱樂部","Unassigned external send to club"],
        "douagain.sbctile.title":["快速SBC","快速SBC","Fast SBC"],
        "douagain.packtile.title":["快速开包","快速開包","Quick unpacking"],
        "douagain.sbctile.text":["请先打开或完成SBC","請先開啟或完成SBC","Please open or complete SBC"],
        "douagain.packtile.text":["请先进行开包","請先進行開包","Please open the package first"],
        "douagain.error":["出现程序错误无法打开，请重新完成SBC以便继续。","出現程式錯誤無法開啟，請重新完成SBC以便繼續。","A program error failed to open, please complete the SBC again to continue."],
        "douagain.sbctile.state1":["已做%1个","已做%1個","%1 done"],
        "douagain.sbctile.state2":["可做%1个","可做%1個","Can do %1"],
        "douagain.sbctile.state3":["已完成","已完成","Completed"],
        "set.info.sbcagain":["商店快速SBC","商店快速SBC","Store Express SBC"],
        "set.info.packagain":["商店快速开包","商店快速開包","Store quick open pack"],
        "sbc.infocount":["已完成 %1 个","已完成 %1 個","%1 completed"],
        "notice.dupfilldiff":["请注意因存在于阵容或屏蔽条件未能全部填充球员","請注意因存在於陣容或遮蔽條件未能全部填充球員","Please note that players are not fully filled due to presence in the lineup or shielding conditions"],
        "screenshot.text":["未分配共计 %1 名球员 总价 %2","未分配共計 %1 名球員 總價 %2","Unassigned total %1 players, total price %2"],
        "packcoin.text":["商店价值：","商店價值：","Store value:"],
        "sbcrange.title":["评分范围","評分範圍","ratings range"],
        "sbcrange.to":["至","至","to"],
        "tile.gptitle":["重载球员","載入球員","Overload player"],
        "tile.gptext":["如有问题可重载入球员","如有問題可重新載入球員","If there is a problem, you can reload the player."],
        "player.accelerate1":["爆发型","爆發型","Explosive"],
        "player.accelerate2":["偏爆发型","偏爆發型","Mostly Explosive"],
        "player.accelerate3":["爆发控制型","爆發控制型","Controlled Explosive"],
        "player.accelerate4":["控制型","控制型","Controlled"],
        "player.accelerate5":["持久控制型","持久控制型","Controlled Explosive"],
        "player.accelerate6":["偏持久型","偏持久型","Mostly Lengthy"],
        "player.accelerate7":["持久型","持久型","Lengthy"],
        "set.card.accele":["加速类型（大卡显示）","加速型別（大卡顯示）","AcceleRATE(large card display)"],
        "notice.basesbc":["需要完成初始SBC才可显示更多SBC任务","需要完成初始SBC才可顯示更多SBC任務","The initial SBC needs to be completed to show more SBC tasks"],
        "builder.ignorepos":["忽略球员位置","忽略球員位置","Ignore player position"],
        "transfertoclub.popupt":["发送球员提示","傳送球員提示","Send player tips"],
        "transfertoclub.popupm":["是否要将列表中 %1 名球员发送到俱乐部","是否要將列表中 %1 名球員傳送到俱樂部","Do you want to send %1 players in the list to the club"],
        "readauction.error":["读取球员拍卖信息失败，请重试。","讀取球員拍賣資訊失敗，請重試。","Failed to read player auction information, please try again."],
        "buyplayer.success":["购买球员 %1 成功，花费 %2 。","購買球員 %1 成功，花費 %2 。","Purchase player %1 successfully, cost %2."],
        "buyplayer.error":["购买球员 %1 失败，%2请稍后再试。","購買球員 %1 失敗，%2請稍後再試。","Purchase of player %1 failed,%2 please try again later."],
        "buyplayer.error.child1":["被其他用户购买，","被其他使用者購買，","Purchased by other users,"],
        "buyplayer.error.child2":["金币不足，","金幣不足，","Not enough gold coins,"],
        "buyplayer.error.child3":["无拍卖信息，","無拍賣資訊，","No auction information,"],
        "buyplayer.error.child4":["购买超时，","購買超時，","Purchase timed out,"],
        "buyplayer.error.child5":["未分配物品过多，","未分配物品過多，","Too many unallocated items,"],
        "buyplayer.sendclub.success":["购买球员 %1 发送俱乐部成功","購買球員 %1 傳送球隊成功","Buy player %1 send team successfully"],
        "buyplayer.sendclub.error":["购买球员 %1 发送俱乐部失败","購買球員 %1 傳送球隊失敗","Failed to buy player %1 to send team"],
        "readauction.loadingclose":["正在读取最新FUT价格","正在讀取最新FUT價格","Reading the latest FUT prices"],
        "readauction.loadingclose2":["正在读取拍卖信息","正在讀取拍賣資訊","Reading auction information"],
        "buyplayer.loadingclose":["正在尝试购买球员","正在嘗試購買球員","Trying to buy players"],
"buyplayer.pauseloadingclose":["正在等待购买球员","正在等待购买球员","Pause to buy players"],
        "buyplayer.missplayerbuy.success":["购买缺失球员完成","购买缺失球员完成","Success to buy players"],
        "conceptbuy.btntext":["直接购买此球员","直接購買此球員","Buy this player directly"],
        "set.sbc.conceptbuy":["假想球员直接购买","概念球員直接購買","Concept player direct purchase"],
        "set.player.transfertoclub":["转会发送俱乐部","轉會傳送俱樂部","Transfer sending club"],
        "transfertoclub.unable":["%1个球员因重复无法发送","%1個球員因重複無法傳送","%1 player could not be sent due to duplication"],
        "numberofqueries.btntext":["查询价格次数","查詢價格次數","Number of price inquiries"],
        "numberofqueries.popupm":["此处影响在购买球员的查询次数，初次使用futbin读取价格，其后每次按照搜索出结果进行下次查询价格，查询价格变化按照拍卖价格+、-变化，可自行在拍卖输入价格点击+、-后查看，具体规则请阅读说明文档。<br>默认配置为5次，最低可设置为1次，不建议次数过多。","此處影響在購買球員的查詢次數，初次使用futbin讀取價格，其後每次按照搜尋出結果進行下次查詢價格，查詢價格變化按照拍賣價格+、-變化，可自行在拍賣輸入價格點選+、-後檢視，具體規則請閱讀說明文件。<br>預設配置為5次，最低可設定為1次，不建議次數過多。","This affects the number of inquiries in the purchase of players. Use futbin to read the price for the first time, and then check the price for the next time according to the search results. The query price changes according to the auction price + and -. You can enter the price in the auction by yourself and click + and -. Please read the description document for specific rules. < br > The default configuration is 5 times, and the minimum can be set to 1 time. It is not recommended to use too many times."],
        "numberofqueries.placeholder":["请输入数字 为空重置为5次","請輸入數字 為空重置為5次","Please enter a number, entering empty will reset to 5 times"],
        "settingsbutton.phone":["说明、联赛、询价","說明、聯賽、詢價","desc、league、query"],
        "notice.lockplayer":["锁定球员成功","鎖定球員成功","Lock player successfully"],
        "notice.unlockplayer":["解锁球员成功","解鎖球員成功","Unlock Player Success"],
        "locked.unlock":["解锁","解鎖","Unlock"],
        "locked.lock":["锁定","鎖定","lock"],
        "locked.tile":["锁定球员","鎖定球員","Lock player"],
        "locked.navtilte":["锁定球员列表","鎖定球員列表","Lock player list"],
        "pack.filter0":["可交易组合包","可交易組合包","Tradeable Pack"],
        "history.title":["搜索历史：","搜尋歷史：","Search history"],
        "consult.popupt":["请输入导入方案ID或网址","請輸入匯入方案ID或網址","Please enter the import squad ID or URL"],
        "consult.popupm":["支持导入FUTBIN和FUT.GG两个网站的SBC方案ID或网址，为空则默认读取FUTBIN价格最低的5个方案进行计算。","支援匯入FUTBIN和FUT.GG兩個網站的SBC方案ID或網址，為空則預設讀取FUTBIN價格最低的5個方案進行計算。","Support import FUTBIN and FUT.GG the SBC squad ID or URL of the two websites. If it is empty, read the 5 schemes with the lowest FUTBIN price by default for calculation."],
        "consult.placeholder":["在此填入方案ID或网址","在此填入方案ID或網址","Enter the squad ID or URL here"],
        "consult.error":["未能识别到有效的方案ID或网址，请重新输入。","未能識別到有效的方案ID或網址，請重新輸入。","Could not identify a valid squad ID or URL, please re-enter."],
        "meetsreq.btntext":["替换为满足需求球员","替換為滿足需求球員","Swap Meets Requirements Players"],
        "set.sbc.meetsreq":["替换满足需求球员","替換滿足需求球員","Swap Meets Requirements Players"],
        "meetsreq.error":["俱乐部中没有满足可替换的满足需求球员","俱樂部中沒有滿足可替換的滿足需求球員","There are no replaceable meet requirements players in the club"],
        "set.sbc.templatemode":["SBC方案填充输入模式","SBC方案填充輸入模式","SBC squad populate input mode"],
        "readauction.loadingclose3":["正在读取价格 %1","正在讀取價格 %1","Reading price %1"],
        "squadcmpl.popupm":["阵容补全即会将假想球员替换为同评分球员、空位替换为所填评分。请填入评分需要数字，以英文逗号组合，单个评分将会替换所有空位，多个将替换指定个数空位。","陣容補全即會將假想球員替換為同評分球員、空位替換為所填評分。請填入評分需要數字，以英文逗號組合，單個評分將會替換所有空位，多個將替換指定個數空位。","Lineup completion will replace hypothetical players with players of the same rating, and vacancies with the filled rating. Please fill in the numbers required for the rating, combined with English commas, a single rating will replace all vacancies, and multiple will replace the specified number of vacancies."],
        "squadcmpl.popupmsup":["模拟计算结果可能略有偏差，可点击按钮前往网站进行自由计算。","模擬計算結果可能略有偏差，可點選按鈕前往網站進行自由計算。","The simulation results may be slightly biased, and you can click the button to go to the website for free calculation."],
        "shieldlea.popupm":["默认排除五大联赛，如想调整请从使用说明中找到对应的联赛ID填入。多个ID使用英文逗号分割，否则保存失败。为空恢复为默认设置","預設排除五大聯賽，如想調整請從使用說明中找到對應的聯賽ID填入。多個ID使用英文逗號分割，否則儲存失敗。為空恢復為預設設定","The five major leagues are excluded by default. If you want to adjust it, please find the corresponding league ID from the instructions and fill it in. Multiple IDs are separated by English commas, otherwise the save fails. If it is empty, restore it to the default settings"],
        "popupButtonsText.44401":["前往网站计算","前往網站計算","Go to the website to calculate"],
        "popupButtonsText.44402":["前往查看ID列表","前往檢視ID列表","Go to view ID list"],
        "squadcmpl.simulatedsuccess":["此次模拟补全后阵容评分： %1 ，预估填充球员价值： %2 。","此次模擬補全後陣容評分： %1 ，預估填充球員價值： %2 。","Lineup score after this simulation completion: %1 , estimated fill player value: %2 ."],
        "squadcmpl.simulatederror":["无法模拟补全出阵容，请填充球员、调整排除选项或进入网站计算。","無法模擬補全出陣容，請填充球員、調整排除選項或進入網站計算。","The full lineup cannot be simulated. Please fill in players, adjust exclusion options, or enter the website for calculations."],
        "packfilter.total":["共计：%1   价值：%2","共計：%1   價值：%2","Total:%1   Value:%2"],
        "chemistrylist.setpos":["仅显示 %1","僅顯示 %1","Show only %1"],
        "chemistrylist.setall":["显示全部","顯示全部","Show all"],
        "requirements.addbtn":["添加 %1","新增 %1","Add %1"],
        "requirements.swapbtn":["替换为 %1","替換為 %1","Swap %1"],
        "squadcmpl.popupmsupallconcept":["此次将尝试替换假想球员，不会考虑挑战要求，如无法替换代表无此评分球员。","此次將嘗試替換概念球員，不會考慮挑戰條件，如無法替換代表無此評分球員。","This time, attempts will be made to replace concept players, without considering challenge requirements. If a player cannot be replaced, it means that the player does not have this rating."],
        "sbcrange.concepttitle":["假想搜索无评分范围","概念搜尋無評分範圍","Concept Search No Rating Range"],
        "searchconcept.sameclub":["搜索同俱乐部假想球员","搜尋同俱樂部概念球員","Search concept from the same club"],
        "searchconcept.sameleague":["搜索同联赛同地区假想球员","搜尋同聯賽同地區概念球員","Search concept in the same league and nation"],
        "notice.searchconceptloading":["开始搜索指定条件假想球员","開始搜尋指定條件概念球員","Start searching for specified concept players"],
        "subsbcaward.title":["奖励价值：","獎勵價值：","Reward value:"],
        "subsbcaward.nope":["无法计算","無法計算","Can't count"],
        "sbc.quciktransfers":["转","轉","T"],
        "sbc.onlycmpltext":["保留阵容补全仅为方便查看所需评分","保留陣容補全僅為方便檢視所需評分","Keep the squad complete for convenience only to view the required rating"],
    }
    //固话的HTML内容
    html = {
        "priceBtn":"<button class=\"flat pagination fsu-getprice\" id=\"getprice\">{price.btntext}</button>",
        "priceBtn2":"<button class=\"btn-standard section-header-btn mini call-to-action fsu-getprice\" id=\"getprice\">{price.btntext}</button>",
        "taskBar":"<div class=\"fsu-task-bar\">{Number}</div>",
        "sbcInfo":"<div class=\"fsu-sbc-info\"><div class=\"currency-coins\">{sbc.price}{price}</div><div><span>{sbc.like}{up}</span><span>{sbc.dislike}{down}</span></div></div>",
        "consultBtn":"<a href=\"https://www.futbin.com/squad-building-challenges/ALL/{sbcId}\" target=\"_blank\" class=\"fsu-consult fsu-sbcButton\">{sbc.consult}</a>",
        "countBtn":"<a id=\"goToCount\" href=\"javascript:void(0)\" class=\"fsu-count\">{sbc.count}</a>",
        "searchInput":"<input type=\"text\" class=\"fsu-input\" placeholder=\"{text}\" maxlength=\"50\">",
        "uasBtn":"<button class=\"btn-standard section-header-btn mini call-to-action fsu-getprice\" id=\"uasreset\">{uasreset.btntext}</button>",
    };
    info.base.sytle = ".tns-horizontal.tns-subpixel>.tns-item{position: relative;}button.notevents{pointer-events: none;color: #a4a9b4;}.btn-standard.section-header-btn.mini.call-to-action.fsu-getprice{margin-left: 1rem;}.btn-standard.section-header-btn.mini.call-to-action.fsu-getprice:hover{background-color:#e9dfcd}.view-modal-container.form-modal header .fsu-getprice{position: absolute;top: .5rem;left: 0;height: 2rem;line-height: 2rem;}.fsu-task-bar{position: absolute;right: .2rem;top: 0;}.ut-sbc-set-tile-view.production-tagged .tileHeader::before{display:none;}.fsu-task{display: flex;justify-content: space-between;padding: 0.5rem;background-color: #d31332;}.fsu-task.no{background-color: #d313325c;}.task-expire{background-color: #d313325c;height: 2rem;line-height: 2rem;text-align: center;}a.header_explain{color: #a2a2a2;text-decoration: none;line-height: 3rem;}a.header_explain:hover{color: #ffffff;}.ut-fifa-header-view{display: flex;justify-content: space-between;}    .fsu-loading-close{display: none;position: absolute;bottom: 38%;z-index: 999;}.fsu-loading .fsu-loading-close{display: block;}          .fsu-task-bar-favorite{background-color: rgb(255,86,48);right: 0.2rem;top: 2px;color: #ffffff;padding: 0 6px;border-radius: 4px;line-height: 1.2rem;position: absolute;}                                                     .fsu-sbc-info{padding: 0.5rem;background-color: #d313325c;display: flex;font-family: UltimateTeamCondensed,sans-serif;justify-content: space-between;font-size: 1rem;}.fsu-sbc-info div{width: 50%;}.fsu-sbc-info div:last-child{display: flex;justify-content: space-around;}.fsu-sbc-info .currency-coins::after{font-size:16px}                .rewards-footer li{position: relative;}.fsu-sbc-vplayer {position: absolute;bottom: .25rem;right:0;background-color: #8A6E2C;padding: .5rem;color: #15191d;line-height: 1rem;font-size: 16px;}.fsu-sbc-vplayer:hover{background-color: #f6b803;}                 @media screen and (min-width:1280px) and (max-width:1441px) {.ut-split-view {padding:0;}.ut-split-view>.ut-content {max-height:100%;}}            .fsu-squad-pBox{display:flex}.fsu-squad-pWrap{margin:.5em}.fsu-squad-pTitle{width:100%;word-break:keep-all;font-size:.8em;display:block;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase;white-space:nowrap}.fsu-squad-pValue{font-family:UltimateTeamCondensed,sans-serif;font-weight:400;font-size:1.125em;text-overflow:ellipsis;white-space:nowrap;line-height: 1.8rem;}.fsu-squad-pValue.currency-coins::after{font-size:1rem;margin-left:.2em !important;margin-top:-.2em !important}.fsu-squad-pTitle .plus{color:#36b84b;padding-left:.1rem}.fsu-squad-pTitle .minus{color:#d21433;padding-left:.1rem}         li.with-icon.hide {display: none;}                      .fsu-input{border: 0 !important;background-color: rgba(0,0,0,0) !important;padding-left: 0 !important;font-family: UltimateTeamCondensed,sans-serif;font-size: 1em;color: #f8eede;}                   .sbc-quick{top:100%;width:100%;display:flex;align-items:center;font-family:UltimateTeam,sans-serif;justify-content:center;margin-top:.2rem} .sbc-quick-list{display:flex;align-items:center}                   .fsu-quick{position:absolute;top:100%;width:100%;display:flex;align-items:center;font-family:UltimateTeam,sans-serif;justify-content:center;margin-top:.2rem}.fsu-quick.top .fsu-quick-list{display:flex;align-items:center}.fsu-quick-list .im{height:1.8rem;line-height:1.8rem;cursor:pointer;background-color:#2b3540;font-family:UltimateTeam,sans-serif;border-radius:4px;padding:0 .2rem;font-size:1rem;font-weight:900;color:#f2f2f2;overflow: hidden;}.fsu-quick-list .im:hover{background-color:#394754}.fsu-quick-list.other .im{background-color:#f8eede;color:#ef6405;font-weight:500;margin-left:.3rem;text-align:center;}.fsu-quick-list.other .im:hover{background-color:#f5efe6}.fsu-quick-list .im span{font-size:.8rem;font-weight:300;color:#a4a9b4}.fsu-quick-list.left .im{margin-right:.3rem}.fsu-quick-list.right .im{margin-left:.3rem}.fsu-quick-inr{font-size:.8rem;margin:0 .3rem}.fsu-quick.right{position:absolute;top:50%;width:2rem;display:block;right:0%;z-index:3;-webkit-transform:translateY(-50%) !important;transform:translateY(-50%) !important}.phone .fsu-quick.right{top:8rem;-webkit-transform:translateY(0%) !important;transform:translateY(0%) !important}.fsu-quick.right .fsu-quick-list .im{width:1.4rem;margin-bottom:.2rem;text-align:center}.fsu-quick.right .fsu-quick-list .im.disabled{background-color:#30302e;color:#656563}.entityContainer>.name.untradeable{color:#f6b803}                                      .fsu-promo-box{flex:auto;display:flex;justify-content:flex-end}.landscape button.currency.fsu-promo{margin-top:-.25rem;text-align:justify;padding:.25rem .5rem;width:6.6rem;color:#f2f2f2;background-color:#556c95}.landscape button.currency.fsu-promo:hover{background-color:#ef6405}.landscape button.currency.fsu-promo .text{font-size:2rem;font-weight:600;height:2rem;line-height:2rem}.landscape button.currency.fsu-promo .subtext{font-size:.6rem;line-height:1rem;font-weight:600;text-transform:uppercase}.landscape button.currency.fsu-promo::after{background-image:url(https://www.ea.com/ea-sports-fc/ultimate-team/web-app/images/Items/small_item_totw_gold.png) !important;background-position:center;background-repeat:no-repeat;background-size:contain;content:'';height:3rem;transform:translateY(-50%);position:absolute;width:3rem;top:50%;right:0}                                  .phone .fsu-sbc-info{font-size:.875rem}.phone .fsu-task{display:block;font-size:.875rem}.phone .fsu-price-box.right > div .value{font-size:1rem;margin-top:.2rem}.phone .fsu-price-box.right > div .title{font-size:.875rem}.phone button.currency.fsu-promo{line-height:1.6rem;padding:0 .3rem;height:3rem}.phone button.currency.fsu-promo .subtext{display:block;font-size:.6rem;line-height:1rem;text-transform:uppercase}.phone .fsu-player-other > div{font-size:0.6rem}.phone .small.player .fsu-cards-price{font-size:.6rem}.phone .small.player .fsu-cards-price{font-size:.6rem}.phone .small.player .fsu-cards-price::after{font-size:.875rem}.phone .fsu-cards.fsu-cards-attr{font-size:.6rem}.phone .fsu-quick-list .im{font-size:.875rem}                                              .ut-pinned-item .listFUTItem.has-auction-data .fsu-player-other{margin-top:0 !important;top:.8rem;right:.2rem;position:absolute;z-index:2}        .fsu-sbcfilter-box{align-items:center;background-color:#394754;display:flex;justify-content:center;padding:1rem;z-index:10}.fsu-sbcfilter-option{align-items:center;box-sizing:border-box;display:flex;flex:1;max-width:300px}.fsu-sbcfilter-option .ut-drop-down-control{margin-left:1rem;flex:1}             .fsu-cards-pos.old>div,div:not(.small)>.fsu-cards-attr.old>div{background-color:#0040A6}.small.player .fsu-price-box{font-size:.875rem}.large.player .fsu-price-box{font-size:1rem}.fsu-price-box.old{background-color:#0f1417;color:#a4a9b4;border:0}.small>.fsu-cards-attr.old{background-color:#0040A6}                         .fsu-setbox{display: grid;grid-template-columns: repeat(3, minmax(0, 1fr));}.phone .fsu-setbox{display: grid;grid-template-columns: repeat(1, minmax(0, 1fr));}                                  .btn-standard.mini.fsu-reward-but{height:2rem;line-height:2rem;position:absolute;top:.2rem;left:50%;transform:translateX(-50%)}.btn-standard.mini.fsu-reward-but.pcr{bottom:1.9rem;top:auto}           .btn-standard.mini.fsu-pickspc{line-height:2rem;height:2rem;margin:.5rem auto 0 auto}.ut-image-button-control.back-btn.fsu-picksback{height:100%;width:3rem;position:absolute;left:0;font-size:1.6rem}                       .fsu-fcount{position:absolute;right:0.5rem;height:1.4rem;top:.8rem;line-height:1.5rem;padding:0 .4rem;border-radius:.2rem;z-index:1;background-color: #264A35;}        .ut-squad-building-set-status-label-view.refresh.sbccount::before {content:'\\E0AA';color: #36b84b;}.phone .fsu-store-tile .ut-tile-content-graphic-info .description{display:block;}        .fsu-range button{margin:0}                                                               .fsu-price-box{font-family:UltimateTeamCondensed,sans-serif}.fsu-price-box.right{position:absolute;right:0%;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);display:flex;align-items:center}.fsu-price-box.right>div{background-color:#162C1A;color: #ffffff;padding:0.5rem;text-align:center;border-radius:4px;margin-top:0;display:block}.fsu-price-box.right>div .title{color:#a4a9b4;padding:0;font-size:1rem;line-height:1rem}.fsu-price-box.right>div .title span.plus{color:#36b84b;font-weight:500;padding-left:.2rem}.fsu-price-box.right>div .title span.minus{color:#d21433;font-weight:500;padding-left:.2rem}.fsu-price-box.right>div .value{font-size:1.2rem;margin-top:.5rem;line-height:1.2rem}.fsu-price-val[data-value='0']{display:none !important}.fsu-price-val .currency-coins::after{font-size:1rem;margin-top:-3px}.fsu-price-box.bottom{padding-left:6.3rem;margin:.2rem 0rem}.fsu-price-box.bottom>div{display:flex;align-items:center;font-size:0.9375rem}.fsu-price-box.bottom>div .title{color:#a4a9b4;margin-right:.2rem}.fsu-price-box.bottom .fsu-price-val .currency-coins::after{font-size:inherit}.fsu-price-box.trf{position:absolute;left:54%;margin-top:.2rem}.fsu-price-box.trf .fsu-price-val{display:flex;align-items:center;background-color:#162C1A;color: #ffffff;text-align:center;border-radius:4px;padding:0 .3rem;height:20px}.fsu-price-box.trf .fsu-price-val .title{font-size:.875rem;margin-right:.2rem}.fsu-price-box.trf .fsu-price-val .currency-coins::after{margin-top:-2px}.fsu-price-box.top{position:absolute;right:0%;top:8%;display:flex;align-items:center}.fsu-price-box.top>div{display:flex;align-items:center;background-color:#162C1A;color: #ffffff;padding:.1rem 0.5rem;text-align:center;border-radius:4px}.fsu-price-box.top>div .title{font-size:0.875rem;margin-right:0.5rem}.fsu-price-last{margin-right:.5rem}.fsu-player-other{display:flex;margin-top:.2rem;font-family:UltimateTeamCondensed,sans-serif;font-size:1rem;line-height:1rem}.fsu-price-box.top+.fsu-player-other{margin-top:.4rem}.fsu-player-other>div{background-color:#3B4754;color:#a4a9b4;padding:0.1rem 0.5rem;text-align:center;border-radius:20px;font-size:0.9rem;margin-right:0.5rem;white-space:nowrap}.fsu-player-other>div.swap{background-color:#36b84b;color:#201e20}.fsu-player-other>div.not{background-color:#8A6E2C;color:#201e20}.fsu-player-other>div.yes{background-color:#264A35;color:#201e20}.large.player+.fsu-player-other{justify-content:center}.large.player+.fsu-player-other>div{margin-right:0rem}.fsu-player-other .currency-coins::after{font-size:.875rem;margin-top:-1px;margin-left:2px !important}@media (max-width:1130px){.has-auction-data .fsu-player-other{margin-top:5rem !important}.has-auction-data .fsu-price-box.trf{margin-top:5rem !important;left:auto;right:3%}}                                                                    .fsu-cards-lea-small,.fsu-cards-accele-large,.fsu-cards-price{position:absolute;z-index:2;font-family:UltimateTeamCondensed,sans-serif;font-weight:300;text-align:center;width:1.6rem;top:25%}.fsu-cards-lea-small{bottom:8%;height:16%;font-size:70%;width:100%;top:auto;font-weight:500;line-height:1}.fsu-cards-lea-small~.playStyle,.ut-squad-pitch-view:not(.sbc) .fsu-cards-lea-small{display:none !important}.specials .fsu-cards-lea-small{bottom:10%}.fsu-cards-accele-large,.fsu-cards-price{width:auto !important;padding:0 0.2rem;left:50%;-webkit-transform:translateX(-50%) !important;transform:translateX(-50%) !important;white-space:nowrap;background-color:#13151d;border:1px solid;border-radius:5px}.fsu-cards-accele-large{bottom:0;top:auto !important}.fsu-cards-price{top:0 !important}.fsu-cards-price::after{font-size:1rem}.ut-squad-pitch-view:not(.sbc) .fsu-cards-lea-small~.playStyle{display:block !important}.fsu-cards-attr,.fsu-cards-pos{position:absolute;z-index:2;font-family:UltimateTeamCondensed,sans-serif;font-weight:300;text-align:center;top:25%;display:flex;flex-direction:column;gap:1px}.fsu-cards-attr div,.fsu-cards-pos div{border:1px solid;border-color:inherit;background-color:#13151d;line-height:100%;border-radius:5px;color:#fcfcf7;width:1.4rem;white-space:nowrap;}.large.player~.fsu-cards-attr,.large.player .fsu-cards-attr,.ut-tactics-instruction-menu-view  .fsu-cards-attr{left:calc(50% + 76px - 0.8rem);font-size:14px;gap:4px}.large.player~.fsu-cards-attr div,.large.player .fsu-cards-attr div{width:1.6rem}.small.player~.fsu-cards-attr{left:5.2rem;font-size:12px}.reward.small .small.player~.fsu-cards-attr{left:calc(50% + 42px);top:20%}.reward.small .small.player~.fsu-cards-pos{left:calc(50% - 66px);top:20%;font-size:12px}.ut-squad-slot-view .small.player~.fsu-cards-attr{left:auto;right:-.2rem}.large.player~.fsu-cards-pos,.large.player .fsu-cards-pos,.ut-tactics-instruction-menu-view  .fsu-cards-pos{left:calc(50% - 76px - .8rem);font-size:14px;gap:4px}.ut-squad-slot-view .small.player~.fsu-cards-pos{flex-direction:row;font-size:12px;top:auto;bottom:-1.2rem;left:50%;transform:translate(-50%,0)}.ut-squad-slot-dock-view .ut-squad-slot-view .small.player~.fsu-cards-pos{bottom:-.6rem}.ut-store-xray-pack-details-view .large.player~.fsu-cards-attr{left:calc(50% + 76px - 2rem)}.ut-store-article-pack-graphic-view--option .large.player~.fsu-cards-pos{left:calc(50% - 76px - .4rem)}.large.player .fsu-cards-attr{right:0;left:auto;}.large.player .fsu-cards-pos{right:auto;left:0;}                                       .ut-image-button-control.filter-btn.fsu-transfer::after{content:'\\E0C1';font-size:1.6rem}.ut-image-button-control.filter-btn.fsu-club::after{content:'\\E04A';font-size:1.6rem}.ut-image-button-control.filter-btn.fsu-swap::after{content:'\\E08D';font-size:1.4rem}.ut-image-button-control.filter-btn.fsu-refresh::after{content:'\\E0AC';font-size:1.4rem}.filter-btn.fsu-swap,.filter-btn.fsu-transfer,.filter-btn.fsu-club,.filter-btn.fsu-refresh{margin-left:1rem}                                  .fsu-akb .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip{font-family:UltimateTeam-Icons,sans-serif;font-style:normal;font-variant:normal;font-weight:400;text-transform:none;flex-shrink:0;font-size:1em;text-decoration:none;text-align:center;line-height:1.5rem;transition:color .3s,bottom .3s,top .3s}.fsu-akb .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip::before,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip::before{content:'\\E049';color:#3a4755}.fsu-akb .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--grip::before,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--grip::before{content:'\\E02C';color:#36b94b}.fsu-akb .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--track,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--track{background-color:#36b94b}.fsu-akb .ut-toggle-cell-view>.ut-toggle-cell-view--label{display:none}.fsu-akb .ut-toggle-cell-view{position:absolute;z-index:10;transform:scale(0.7);top:-.2rem;left:-.5rem;padding:0 1rem 1rem 0;cursor:pointer}.fsu-akb-title{align-items:center;background-color:#2b3540;display:flex;justify-content:space-between;padding:.75rem .5rem;border-top:solid 1px #556c95}.fsu-akb-left{display:flex;align-items:center}.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip{transition:color .3s,left .3s,right .3s}.fsu-akb-left>div{padding:0 .675rem 0 0}.fsu-akb-left>div:last-child{padding-right:0}                  body.landscape.futweb{min-height: 38rem;}.ut-tab-bar-item-notif ~ .fsu-task-bar{top: auto;bottom: 0;}               .ut-club-hub-view .tile.fsu-lock .tileContent:before { content:'\\E097'; }                            .fsu-objnew{background:#ff0000;z-index:2;position:absolute;left:0;top:1rem;transform:rotate(-45deg);transform-origin:0 100%;padding:6px 10px;width:3.2rem;text-align:center}              .fsu-lockbtn{padding:0 10px;position:absolute;right:2rem;bottom:0;z-index:2;margin:2rem 0 .8rem 2rem;}.fsu-lockbtn::before{font-family:UltimateTeam-Icons,sans-serif;padding-right:.4rem;content:'';display:inline-block;vertical-align:middle;background-size:100% auto;background-repeat:no-repeat}.fsu-lockbtn.unlock::before{content:'\\E0C4'}.fsu-lockbtn.lock::before{content:'\\E097'}.fsu-lockbtn.unlock{background-color:#fcfcf7;color:#151616}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.locked,html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.untradeable{padding-right:2.7em}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.locked::before,html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.untradeable::before{right:1.4em}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked::after{font-family:UltimateTeam-Icons,sans-serif;color:#d31332;margin-top:2px;position:absolute;width:1.1em;content:'\\E097';right:0}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked{padding-right:1.4em}html[dir=ltr] :not(.phone) .listFUTItem .entityContainer>.name.fsulocked.untradeable { max-width: 42%; }        .fsu-cardlock{position:absolute;height:.9rem;width:.9rem;right:0;bottom:5%;z-index:2;background-color:#222426;border:1px solid #333d47;border-radius:100%;text-align:center;box-shadow:0 1px 3px #000;font-size:10.8px}.fsu-cardlock::before{font-family:UltimateTeam-Icons,sans-serif;content:'\\E097';display:inline-block;vertical-align:middle;background-size:100% auto;color:#d31332;background-repeat:no-repeat}                            .filter-btn.fsu-eligibilitysearch{height:1.8rem;width:1.8rem;position:absolute;right:0}.ut-image-button-control.filter-btn.fsu-eligibilitysearch::after{font-size:1.4rem;content:'\\E098'}                  .item.player>.fsu-cards-rating{position:absolute;left:50%;top:50%;font-size:5rem;transform:translate(-50%,-50%)}.large.item.player>.fsu-cards-rating{font-size:7rem}.item.player.ut-item-loading>.fsu-cards-rating{opacity:1}.item.player.ut-item-loaded>.fsu-cards-rating{opacity:0}                        .fsu-chemistryfilter{position:absolute;right:.5rem;top:.5rem;}                          .ut-list-active-tag-view .label-container.fsu-inclubtag{background-color:#0b96ff}.ut-list-active-tag-view .label-container.fsu-inclubtag::after{border-color:#0b96ff}"
 
 
    //获取futbin信息
    function getFutbin(url){
        return new Promise(res => {
            GM_xmlhttpRequest({
                method:"GET",
                url:url,
                headers: {
                    "Content-type": "application/json"
                },
                onload:function(response){
                    if(response.status == 404){
                        events.notice("notice.loaderror",2);
                        if(document.querySelector(".ut-click-shield").classList.contains("showing")){
                            events.kobe_hideLoader()
                        }
                        return;
                    }
                    res(JSON.parse(response.response))
                },
                onerror:function(){
                    events.notice("notice.loaderror",2);
                    if(document.querySelector(".ut-click-shield").classList.contains("showing")){
                        events.kobe_hideLoader()
                    }
                }
            })
        })
    };
 
    call.view = {
        card:UTPlayerItemView.prototype.renderItem,
        squad:UTBaseSquadSplitViewController.prototype.viewDidAppear,
        unassigned:UTUnassignedItemsViewController.prototype.renderView,
        pack:UTStorePackDetailsView.prototype._generate,
        build:UTSquadBuilderViewController.prototype.viewDidAppear,
        market:UTMarketSearchView.prototype._generate,
        setting:UTAppSettingsView.prototype._generate,
        picks:UTPlayerPicksView.prototype.setItems,
        picksSelect:UTPlayerPicksView.prototype.selectPickOption,
        squadRating:UTSquadEntity.prototype._calculateRating,
        transfer:UTTransferListViewController.prototype._renderView,
        clubHub:UTClubHubView.prototype.clearTileContent,
        academySlot:UTAcademySlotItemDetailsViewController.prototype.renderView
    }


    UTSquadBuilderViewController.prototype.viewDidAppear = function() {
        call.view.build.call(this)
        if(this.squad.isSBC()){
            this._view.getSortDropDown().setIndexById(3);
 
            this._view._fsuleague = events.createToggle(
                `${fy(`builder.league`)}(${info.set.shield_league.length})`,
                async(e) => {
                    build.set("league",e.getToggleState())
                }
            )
            this._view._fsuleague.toggle(info.build.league);
            this._view._searchOptions.__root.appendChild(this._view._fsuleague.__root);
 
            this._view._fsurare = events.createToggle(
                fy(`builder.rare`),
                async(e) => {
                    build.set("rare",e.getToggleState())
                }
            )
            this._view._fsurare.toggle(info.build.rare);
            this._view._searchOptions.__root.appendChild(this._view._fsurare.__root);
 
 
            this._view._fsupos = events.createToggle(
                fy(`builder.ignorepos`),
                async(e) => {
                    build.set("ignorepos",e.getToggleState())
                }
            )
            this._view._fsupos.toggle(info.build.ignorepos);
            this._view._searchOptions.__root.appendChild(this._view._fsupos.__root);
            
        }
    }

    call.plist = {
        sectioned:UTSectionedItemListView.prototype.addItems,
        paginated:UTPaginatedItemListView.prototype.renderItems,
        storeReveal:UTStoreRevealModalListView.prototype.addItems,
        picks:UTPlayerPicksViewController.prototype.viewDidAppear,
        club:UTClubRepository.prototype.removeClubItem,
        squadSet:UTSquadEntity.prototype.setPlayers,
        squadGR:UTSquadEntity.prototype.getRating,
        squad:UTSquadOverviewViewController.prototype.viewDidAppear,
        clubSelectItem:UTSelectItemFromClubViewController.prototype.updateItemList
    }

    call.other = {
        uaTile:UTUnassignedTileView.prototype.setNumberOfItems,
        store:{
            setPacks:UTStoreView.prototype.setPacks,
            openPack:UTStoreViewController.prototype.eOpenPack,
            setCategory:UTStoreViewController.prototype.setCategory
        },
        requestItems:UTSelectItemFromClubViewController.prototype.requestItems,
        market:{
            eSearch:UTMarketSearchFiltersView.prototype.eSearchButtonSelected,
            setFilter:UTMarketSearchFiltersView.prototype.setFilters,
        },
        rewards:{
            base:UTRewardsCarouselView.prototype.setupRewards,
            campaign:UTCampaignRewardsCarouselView.prototype.setupRewards,
            campaigns:UTCampaignRewardsCarouselView.prototype.setupCampaignRewards,
            selection:UTRewardSelectionChoiceViewController.prototype.viewDidAppear,
            popupTapped:UTGameRewardsViewController.prototype.onButtonTapped
        },
        SBCSetDealloc:UTSBCSetTileView.prototype.dealloc
    }
 
 
    // UTSquadOverviewViewController.prototype.viewDidAppear = function() {
    //     call.plist.squad.call(this);
    //     let p = this._squad._players.map(function (i) {if(i._item.type == "player" && !info.roster.data.hasOwnProperty(i._item.definitionId)){return i._item.definitionId}}).filter(i => i > 0);
    //     events.loadPlayerPrice(p);
 
 
    //     if(this._squad.isSBC()){
    //         let sp = this._view;
    //         if(sp.hasOwnProperty("_fsuQuickRight")){
    //             sp._fsuQuickRight.remove()
    //         }
    //         if(sp.hasOwnProperty("_fsuQuickTop")){
    //             sp._fsuQuickTop.remove()
    //         }
    //         if(sp.hasOwnProperty("_detailsButton") && isPhone()){
    //             sp._detailsButton.__root.style.zIndex = 999;
    //         }
    //         let e = this._challenge.eligibilityRequirements;
    //         let t = 0;
    //         let th = document.createElement("div");
    //         th.classList.add("fsu-quick","top")
    //         sp._fsuQuickTop = th;
    //         let to = document.createElement("div");
    //         to.classList.add("fsu-quick-list","other");
    //         sp._fsuQuickOther = to;
    //         sp._fsuRlist = {};
            
    //         for (let i of e) {
    //             if(i.kvPairs._collection.hasOwnProperty(19)){
    //                 t = i.kvPairs._collection[19][0];
    //                 sp._fsuCount = events.createButton(
    //                     new UTButtonControl(),
    //                     fy("sbc.count"),
    //                     (e) => {events.squadCount(e);},
    //                     "im"
    //                 )
    //                 sp._fsuCount.__root.setAttribute("data-r",t);
    //                 sp._fsuQuickOther.append(sp._fsuCount.__root);
    //             }
    //             if(i.kvPairs._collection.hasOwnProperty(35)){
    //                 sp._fsuConsult = events.createButton(
    //                     new UTButtonControl(),
    //                     fy("sbc.consult"),
    //                     (e) => {events.squadConsult(e);},
    //                     "im"
    //                 )
    //                 sp._fsuConsult.__root.setAttribute("data-id",this._challenge.id);
    //                 sp._fsuQuickOther.append(sp._fsuConsult.__root);
    //             }
    //         }
 
    //         let y = t !== 0 ? t : 75;
    //         let rh = document.createElement("div");
    //         rh.classList.add("fsu-quick","right");
    //         rh.innerHTML = `<div class="fsu-quick-list"></div>`;
    //         sp._fsuQuickRight = rh;
    //         let yl = [],
    //         ylLimit = isPhone() ? [4,8] : [5,10];
    //         for (let i = 1; i < 11; i++) {
    //             if(events.getDedupPlayers(events.getItemBy(1,{"rating":y-i}),this._squad.getPlayers()).length){
    //                 yl.push(y-i);
    //             }
    //             if(yl.length == ylLimit[0]){
    //                 break;
    //             }
    //         }
    //         for (let i = 0; i < 99-y; i++) {
    //             if(events.getDedupPlayers(events.getItemBy(1,{"rating":y+i}),this._squad.getPlayers()).length){
    //                 yl.unshift(y+i);
    //             }
    //             if(yl.length == ylLimit[1]){
    //                 break;
    //             }
    //         }
    //         if(t !== 0 && yl.length){
    //             let ts = document.createElement("div");
    //             ts.classList.add("fsu-quick-list","left");
    //             sp._fsuQuickTop.append(ts);
    //             // sp._fsuQuickTop.append(events.createDF(`<div class="fsu-quick-inr">OR</div>`));
    //             let ratPlus = `${Number(yl[0]) + 1}`,
    //             ratPlusBut = events.createButton(
    //                 new UTButtonControl(),
    //                 "",
    //                 (e) => {events.SBCSetRatingPlayers(e);},
    //                 "im"
    //             )
    //             ratPlusBut.__root.innerHTML = `<span> >= </span>${ratPlus}`;
    //             ratPlusBut.__root.setAttribute("data-r",`${ratPlus}GT`);
    //             sp._fsuRlist[`t_${ratPlus}+`] = ratPlusBut;
    //             sp._fsuQuickTop.querySelector(`.left`).append(ratPlusBut.__root);
 
    //             let ratMinus = `${Number(yl[yl.length - 1]) - 1}`,
    //             ratMinusBut = events.createButton(
    //                 new UTButtonControl(),
    //                 "",
    //                 (e) => {events.SBCSetRatingPlayers(e);},
    //                 "im"
    //             )
    //             ratMinusBut.__root.innerHTML = `<span> <= </span>${ratMinus}`;
    //             ratMinusBut.__root.setAttribute("data-r",`${ratMinus}LT`);
    //             sp._fsuRlist[`t_${ratMinus}-`] = ratMinusBut;
    //             sp._fsuQuickTop.querySelector(`.left`).append(ratMinusBut.__root);
    //             if(ratMinus > 80 && t > 80){
    //                 let ratGold = `GOLD`,
    //                 ratGoldBut = events.createButton(
    //                     new UTButtonControl(),
    //                     "",
    //                     (e) => {events.SBCSetRatingPlayers(e);},
    //                     "im"
    //                 )
    //                 ratGoldBut.__root.innerHTML = `75<span>-</span>80`;
    //                 ratGoldBut.__root.setAttribute("data-r",`GOLD`);
    //                 sp._fsuRlist[`t_${ratGold}`] = ratGoldBut;
    //                 sp._fsuQuickTop.querySelector(`.left`).append(ratGoldBut.__root);
    //             }
    //         }
    //         if(sp._fsuQuickOther.innerHTML !== ""){
    //             sp._fsuQuickTop.append(sp._fsuQuickOther);
    //         }
    //         sp._summaryPanel.__root.append(sp._fsuQuickTop)
    //         //初始载入保存阵容
    //         if(!isPhone() || !this._squad.hasOwnProperty("_fsuOldSquad")){
    //             events.saveOldSquad(this._squad,false,true);
    //         }
    //         info.douagain.sbc = this._set.id;
    //         for (let i of yl) {
    //             let n = `r_${i}`
    //             let r = events.createButton(
    //                 new UTButtonControl(),
    //                 i,
    //                 (e) => {events.SBCSetRatingPlayers(e);},
    //                 "im"
    //             );
    //             r.__root.setAttribute("data-r",i);
    //             sp._fsuRlist[n] = r;
    //             sp._fsuQuickRight.querySelector(".fsu-quick-list").append(sp._fsuRlist[n].__root);
    //         }
 
    //         let quickUnassignedBtn = events.createButton(
    //             new UTButtonControl(),
    //             fy("sbc.qucikdupes"),
    //             (e) => {events.SBCSetRatingPlayers(e);},
    //             "im"
    //         );
    //         quickUnassignedBtn.__root.setAttribute("data-r","d");
    //         sp._fsuRlist["r_d"] = quickUnassignedBtn;
    //         quickUnassignedBtn.setInteractionState(!1)
    //         sp._fsuQuickRight.querySelector(".fsu-quick-list").append(quickUnassignedBtn.getRootElement());
            
    //         //开始判断是否需要屏蔽重复按钮
    //         let unassignedIds = _.uniq(_.map(repositories.Item.getUnassignedItems(), `definitionId`));
    //         if(unassignedIds.length){
    //             if(events.getDedupPlayers(events.getItemBy(2,{definitionId:unassignedIds}),this._squad.getPlayers()).length){
    //                 quickUnassignedBtn.setInteractionState(1)
    //             }
    //         }
 
    //         //转会名单搜索功能
    //         let quickTransfersBtn = events.createButton(
    //             new UTButtonControl(),
    //             fy("sbc.quciktransfers"),
    //             (e) => {
    //                 events.SBCSetRatingPlayers(e);
    //             },
    //             "im"
    //         );
    //         quickTransfersBtn.__root.setAttribute("data-r","t");
    //         sp._fsuRlist["r_t"] = quickTransfersBtn;
    //         quickTransfersBtn.setInteractionState(!1)
    //         sp._fsuQuickRight.querySelector(".fsu-quick-list").append(quickTransfersBtn.getRootElement());
    //         console.log(quickTransfersBtn,p)
            
    //         //开始判断是否需要屏蔽搜索按钮
    //         let transferIds = _.uniq(_.map(repositories.Item.getTransferItems(),i => {if(i.getAuctionData().isInactive()){ return i.definitionId}}).filter(Boolean));
    //         if(transferIds.length){
    //             if(events.getDedupPlayers(events.getItemBy(2,{definitionId:transferIds}),this._squad.getPlayers()).length){
    //                 quickTransfersBtn.setInteractionState(1)
    //             }
    //         }
 
    //         //阵容回退按钮
    //         if(info.set.sbc_sback){
    //             let rb = events.createButton(
    //                 new UTButtonControl(),
    //                 fy("sbc.squadback"),
    //                 (e) => {
    //                     let c = e._challenge.squad._fsuOldSquadCount;
    //                     if(c){
    //                         events.popup(
    //                             fy("squadback.popupt"),
    //                             fy(["squadback.popupm",c]),
    //                             (t) => {
    //                                 if(t === 2){
    //                                     events.kobe_showLoader();
    //                                     let s = e._challenge.squad._fsuOldSquad[c - 1]
    //                                     events.saveSquad(e._challenge,e._challenge.squad,s,[]);
    //                                     e._challenge.squad._fsuOldSquadCount--;
    //                                     e._challenge.squad._fsuOldSquad.pop();
    //                                 }
    //                             }
    //                         )
    //                     }else{
    //                         events.notice("notice.nosquad",2);
    //                     }
    //                 },
    //                 "im"
    //             );
    //             rb._challenge = this._challenge;
    //             sp._fsuRlist["r_b"] = rb;
    //             sp._fsuQuickRight.querySelector(".fsu-quick-list").append(sp._fsuRlist["r_b"].__root);
    //         }
 
    //         sp._summaryPanel.__root.after(sp._fsuQuickRight);
    //         if(!info.set.sbc_top){
    //             sp._fsuQuickTop.remove();
    //         }
    //         if(!info.set.sbc_right){
    //             sp._fsuQuickRight.remove();
    //         }
    //     }
    // }

    events.wait = (min,max) => {
        let delay = Math.floor(Math.random() * (max * 1000 - min * 1000 + 1)) + min * 1000;
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    events.kobe_changeLoadingText = (t) =>{
        document.querySelector('.fsu-loading-close').innerHTML = fy(t);
    }

    events.getCachePrice = (i,t) => {
        if(t == 1){
            let price = 0;
            if(i in info.roster.data){
                let untreated = info.roster.data[i].prices[info.base.platform].LCPrice;
                price = isNaN(untreated) ? Number((untreated).replace(/,/g, "")) : Number(untreated);
            }
            return price;
        }else{
            return info.roster.data.hasOwnProperty(i) && events.getCachePrice(i,1) !== 0;
        }
    }
    events.losAuctionCount = (e,t) => {
        if(e.hasOwnProperty("_fsuAkbCurrent") && e.hasOwnProperty("_fsuAkbNumber") && e.hasOwnProperty("_fsuAkbArray")){
            let pn = 0,qs = {};
            for (let n in e._fsuAkbArray) {
                let p = events.getCachePrice(e._fsuAkbArray[n]._pId,1),j = events.getCachePrice(e._fsuAkbArray[n]._pId,2);
                pn += p;
                if(!j){
                    e._fsuAkbArray[n].setInteractionState(0);
                }else if(j && p == 0){
                    e._fsuAkbArray[n].setInteractionState(0);
                    e._fsuAkbCurrent--;
                    e._fsuAkbNumber--;
                    delete e._fsuAkbArray[n];
                }else{
                    e._fsuAkbArray[n].setInteractionState(1);
                }
            }
            e._fsuAkb.querySelector(".fsu-akb-num").innerText = e._fsuAkbCurrent;
            e._fsuAkb.querySelector(".fsu-akb-max").innerText = e._fsuAkbNumber;
            e._fsuAkb.querySelector(".fsu-akb-price").innerText = pn.toLocaleString();
            if(pn){
                e._fsuAkbButton.setInteractionState(1);
                e._fsuAkbToggle.setInteractionState(1);
            }else if(pn == 0){
                e._fsuAkbButton.setInteractionState(0);
            }
        }
        if(document.querySelector(".fsu-screenshot")){
            let view = isPhone() ? cntlr.current() : cntlr.left(),
            price = view.getViewModel().getSectionItems().map(i => {
                if(!i.isLoaned() && i.isPlayer()){
                    return events.getCachePrice(i.definitionId,1);
                }
            }).filter(Boolean);
 
            view._view.__root.querySelector(".fsu-screenshot h2 span.text").textContent = fy(["screenshot.text",price.length,price.reduce((a, b) => a + b, 0).toLocaleString()])
        }
    }
    //列表形式(右侧、拍卖行搜索结果、俱乐部)球员列表 读取球员列表查询价格
    UTPaginatedItemListView.prototype.renderItems = function(t) {
        call.plist.paginated.call(this,t);
        let p = this.listRows.map(function (i) {
            if(i.data.type == "player"){
                if(!info.roster.data.hasOwnProperty(i.data.definitionId)){
                    return i.data.definitionId
                }else{
                    //价格高亮显示
                    let np = events.getCachePrice(i.data.definitionId,1);
                    if(np && i.data.getAuctionData().buyNowPrice <= np){
                        i.__auctionBuyValue.style.backgroundColor = "#36b84b"
                    }
                }
            }
        }).filter(Boolean);
        events.loadPlayerPrice(p);
        let c = cntlr.current(),csbc = false;
        if(isPhone()){
            if(c.hasOwnProperty("_squad") && c._squad && c._squad.isSBC()){
                csbc = true;
            }
        }else{
            if(c.hasOwnProperty("_rightController") && c._rightController){
                c = cntlr.right()._parentViewController;
            }
            if(c.hasOwnProperty("_squad") && c._squad.isSBC()){
                csbc = true;
            }
        }
        if(!isPhone() && c.hasOwnProperty("_rightController") && c._rightController){
            c = cntlr.right()._parentViewController;
        }
        if(csbc){
            if(c.getNavigationTitle() == services.Localization.localize("navbar.label.clubsearch")){
                let s = [];
                if(c._fsuFillArray.length && c._currentController.searchCriteria.defId.length && this.listRows.length){
                    s = this.listRows.map(i => {
                        if(c._currentController.searchCriteria.defId.includes(i.data.definitionId)){
                            return i.data.definitionId
                        }else{
                            i.hide()
                        }
                    }).filter(Boolean);
                    if(!s.length){
                        this.__itemList.prepend(events.createDF(`<div class="ut-no-results-view"><div class="contents"><span class="no-results-icon"></span><h2>${fy("emptylist.t")}</h2><p>${fy("emptylist.c")}</p></div></div>`));
                    }else{
                        if(this.__itemList.querySelector(".ut-no-results-view")){
                            this.__itemList.querySelector(".ut-no-results-view").remove()
                        }
                    }
                }
            }else{
                //假想球员搜索结果排除其他版本项目
                let pn = this._targets._collection.rowselect[0].target;
                if(info.set.sbc_market && pn.hasOwnProperty("pinnedItemView") && pn.pinnedItemView && pn.pinnedItemView.itemCell.data.concept){
                    let z = 0;
                    let pi = pn.pinnedItemView.itemCell.data.definitionId;
                    this.listRows.forEach(function(i) {
                        if(i.data.definitionId !== pi){
                            i.__root.style.filter = "brightness(0.5)";
                            z++;
                        }
                    })
                    if(z && !isPhone()){
                        events.notice("notice.conceptdiff",1)
                    }
                }
            }
        }
    }
 
    //差价计算 需要传递购买价格和预估价格
    events.priceLastDiff = (p,l) => {
        let n = ((Number(p)*0.95/Number(l)-1)*100).toFixed(0);
        if (!isFinite(n)) {
            n = 0;
        }
        let v = ("+" + n +"%").replace("+-","-");
        return v.indexOf("+") != -1 ? `<span class="plus">${v}</span>` : `<span class="minus">${v}</span>`;
    }
 
    //球员价格读取 需要传递球员ID列表(数组)
    events.loadPlayerPrice = async(list,el) => {
        if(list.length > 0){
            let la = Array.from(new Set(list));
            let pu = [];
            let gr = Math.ceil(la.length / 23);
            console.log(la)
            for (let i = 0; i < gr; i++) {
                let lt = la.splice(-23).join();
                pu.push(`https://www.futbin.com/${info.base.year}/playerPrices?player=&rids=${lt}`)
            }
            for (let k in pu) {
                let t = await getFutbin(pu[k]);
                info.roster.data = Object.assign(info.roster.data,t);
                for (let k in t) {
                    let e = document.querySelectorAll(`.fsu-price-box[data-id='${k}']`);
                    let p = t[k].prices[info.base.platform].LCPrice;
                    if(e.length > 0){
                        for (let i of e) {
                            if(i.classList.contains("fsu-price-val")){
                                i.setAttribute("data-value",p);
                                i.innerText = p;
                            }else{
                                i.querySelector(".fsu-price-val").setAttribute("data-value",p);
                                i.querySelector(".fsu-price-val .value").innerText = p;
                            }
                            let lastPriceName = isPhone() ? '[data-last]' : '.fsu-price-last';
                            if(i.querySelectorAll(lastPriceName).length > 0){
                                i.querySelector(".fsu-price-val .title span").outerHTML = events.priceLastDiff(p.replace(/,/g, ''),isPhone() ? i.querySelector(lastPriceName).getAttribute("data-last").replace(/,/g, '') : i.querySelector(lastPriceName).innerText.replace(/,/g, ''));
                            }
                        }
                    }
                }
            }
            // if(document.getElementById("squadTotal")){
            //     events.squadTotal(cntlr.current()._squad.getFieldPlayers().map(function (i) {return i._item.definitionId}).filter(i => i > 0));
            // }
        }
        if(el){
            events.losAuctionCount(el,0)
        }
    }
 

    call.task = {
        sbcT:UTSBCHubView.prototype.populateTiles,
        sbcC:UTSBCChallengesViewController.prototype.viewDidAppear,
        sbcN:UTSBCHubView.prototype.populateNavigation,
        objN:UTObjectivesHubView.prototype.setupNavigation,
        objG:UTObjectiveCategoryView.prototype.setCategoryGroups,
        home:UTHomeHubView.prototype._generate,
        objSetNum:UTObjectivesHubTileView.prototype.setNumUnclaimedObjectives,
        sbcSetDate:UTSBCSetTileView.prototype.setData,
        subTableRender:UTSBCChallengeTableRowView.prototype.render,
        rewardList:UTSBCGroupRewardListView.prototype.setRewards
    }
 

    events.squadCount = (e) => {
        let t = Number(e.__root.getAttribute("data-r"));
        let pa = cntlr.current()._squad.getFieldPlayers().map(i => {if(!i.isBrick() && i.item.rating && !i.item.concept){return i.item.rating}}).filter(Boolean),pr = "";
        if(pa.length > 0){
            pr = "&ratings=" + pa.join(",");
        }
        let dli = [...new Set(events.getItemBy(2,{"NEdatabaseId":cntlr.current()._squad.getFieldPlayers().map(i => i.item.databaseId).filter(Boolean)}).map(i => {return i.rating}))],
        br = t > 84 ? 70 : t < 61 ? 46 : t - 15,
        cs = Array.from({ length: 30 }, (_, i) => i + br).filter(n => !dli.includes(n)),
        l = cs.length ? `&lock=${cs.join(",")}` : "";
        GM_openInTab(`https://futcd.com/sbc.html?target=${t}${pr}${l}`, { active: true, insert: true, setParent :true });
    }
    events.squadConsult = (e) => {
        let i = e.__root.getAttribute("data-id");
        GM_openInTab(`https://www.futbin.com/squad-building-challenges/ALL/${i}/list`, { active: true, insert: true, setParent :true });
    }
    //SBC阵容填充指定评分 需要元素携带data-r(评分)，切换球员填充状态为3
    events.SBCSetRatingPlayers = async(e) => {
        let phone = isPhone();
        //判断当前的选择，如果有遮挡就关闭
        if(phone){
            if(cntlr.current().className == "UTSBCSquadDetailPanelViewController"){
                cntlr.current().getNavigationController()._eBackButtonTapped();
                await events.wait(0.3,0.3);
            }else if(cntlr.current().className == "UTSBCSquadOverviewViewController"){
                gPopupClickShield.onRequestBack();
                await events.wait(0.3,0.3);
            }
        }
        //创建各种参数
        let queryType = e.__root.getAttribute('data-r'),
            currentController = phone ? cntlr.current() : cntlr.left(),
            currentView = currentController.getView(),
            currentSquad = currentController._squad,
            selectSlot = 0,
            pendingPlayers,
            querySort = 3,
            needFind = true;
 
        
        if(e.getRootElement().tagName == "BUTTON" && e.getRootElement().classList.length < 3){
            needFind = false;
        }
        
        switch(queryType){
            case "d":
                pendingPlayers = repositories.Item.getUnassignedItems().map( i => { if(i.isDuplicate() && !i.isLoaned() && i.isPlayer()){return i.definitionId}});
                break;
            case "t":
                pendingPlayers = events.getItemBy(2,{definitionId:_.uniq(_.map(repositories.Item.getTransferItems(),i => {if(i.getAuctionData().isInactive()){ return i.definitionId}}).filter(Boolean))});
                break;
            case "GOLD":
                pendingPlayers = events.getItemBy(2,{"rs":2});
                break;
            case "conceptsearch":
                querySort = 2;
                break;
            case "eligibilitysearch":
                pendingPlayers = events.getItemBy(2,e.criteria);
                break;
            default:
                let queryObject = {"rating":Number(queryType)};
                if(/GT/.test(queryType)){
                    queryObject = {"GTrating":Number(queryType.replace(/GT$/, ""))}
                }else if(/LT/.test(queryType)){
                    queryObject = {"LTrating":Number(queryType.replace(/LT$/, ""))}
                    querySort = 2;
                }
                pendingPlayers = events.getItemBy(2,queryObject)
                break;
        }
        let resultPlayers = []
        if(queryType !== "conceptsearch"){
            resultPlayers = events.getDedupPlayers(pendingPlayers,currentSquad.getPlayers());
            if(!resultPlayers.length){
                events.notice("notice.noplayer",2)
                return;
            }
        }else{
            resultPlayers = e.criteria;
        }
        
        //点击选中位置
        if(needFind){
            let slotIndex = _.find(currentSquad.getNonBrickSlots(), item => !item.isValid() && !item.isBrick())?.index;
            if(slotIndex){
                selectSlot = slotIndex;
            }else if(!phone && currentView.getSelectedSlot()){
                selectSlot = currentView.getSelectedSlot().getIndex();
            }
            await currentView.selectSlot(selectSlot);
            await currentView.getSelectedSlot()._tapDetected();
        }
 
 
        let detailsController = phone ? cntlr.current()._rootController : cntlr.right();
        if(queryType == "d"){
            if(detailsController.panelView._fsuUn._interactionState){
                await detailsController.panelView._fsuUn._tapDetected();
            }else{
                events.notice("notice.noduplicate",2);
            }
        }else{
            events.sbcQuerySetFillAttr(detailsController._parentViewController,queryType == "conceptsearch" ? 9 : 5,resultPlayers,querySort)
            if(detailsController?.panelView){
                await detailsController.panelView._btnAddSwap._tapDetected(this);
            }
        }
    }
    events.filterRatingPlayers = async(r, ps) => {
        let jq = {"rating":Number(r)};            
        let curP = events.getItemBy(2, jq)
        // let w = isPhone() ? cntlr.current() : cntlr.left();
        let p = events.getDedupPlayers(curP, ps);
        if(!p.length){
            events.notice("notice.noplayer",2)
            return [];
        }

        return p;
    }
    events.sbcQuerySetFillAttr = (element,type,players,sort) => {
        if (type !== false) {
            element._fsuFillType = type;
        }
        element._fsuFillArray = players.length || _.isObject(players) ? players : [];
        element._fsuFillRange =  players.length ? [_.minBy(players, 'rating').rating,_.maxBy(players, 'rating').rating] :  [46,99];
        if (sort !== false) {
            element._fsuFillSort = sort;
        }
    }
    //取出排重后的ID列表
    events.getDedupPlayers = (s,p) => {
        let dp = p.map( i => {
            return i.item.databaseId
        }).filter(Boolean);
        let r = s.map( i => {
            if(typeof i === 'object'){
                if(!dp.includes(i.databaseId)){
                    return i;
                }
            }else{
                if(!dp.includes(i)){
                    return i;
                }
            }
        }).filter(Boolean);
        return r;
    };

    //字符串转换html对象
    events.createDF = (t) => {
        let f = document.createRange().createContextualFragment(t);
        return f;
    }
 
    events.sbcSubPrice = async(id,e) => {
        if(info.task.sbc.stat[id]){
            if(!info.task.sbc.stat[id].hasOwnProperty("c")){
                let u = `https://www.futbin.org/futbin/api/getChallengesBySetId?set_id=${id}`;
                let d = await getFutbin(u);
                info.task.sbc.stat[id].c = {};
                for (let i of d.data) {
                    let j = {"tv":i.price.ps,"pc":i.price.pc};
                    info.task.sbc.stat[id].c[i.challengeId] = j;
                }
            }
            if(info.task.sbc.stat[id].hasOwnProperty("c")){
                for (let i of e) {
                    if("_fsuSubSet" in i){
                        let sId = i._fsuSubSet.id,
                        box = events.createElementWithConfig("div",{
                            style:{
                                display:"flex",
                                flexDirection:"row"
                            }
                        }),
                        priceValue = Number(info.base.platform == "pc" ? info.task.sbc.stat[id].c[sId].pc : info.task.sbc.stat[id].c[sId].tv).toLocaleString(),
                        price = events.createElementWithConfig("span",{
                            textContent:`${fy("sbc.price")}${priceValue}`,
                            classList:['currency-coins']
                        });
                        box.appendChild(price);
 
                        let sAwards = i._fsuSubSet.awards,
                            packCoin = 0;
                        _.map(sAwards,item => {
                            if(item.isPack){
                                let packCoinValue = info.base.packcoin?.[item.value];
                                if(packCoinValue){
                                    packCoin += packCoinValue * item.count;
                                }
                            }
                        })
                        let award = events.createElementWithConfig("span",{
                            textContent:`${fy("subsbcaward.title")}${packCoin ? packCoin.toLocaleString() : fy("subsbcaward.nope")}`,
                            classList:[`${packCoin ? 'currency-coins' : 'no'}`],
                            style:{
                                marginLeft:"2rem",
                            }
                        })
                        box.appendChild(award);
 
                        if(isPhone()){
                            box.style.flexDirection = "column";
                            award.style.marginLeft = "0";
                        }
 
                        i.__rowTitle.insertAdjacentElement('afterend',box);
                    }
                }
            }
        }
    }
 
    call.panel = {
        default:UTDefaultActionPanelView.prototype._generate,
        auction:UTAuctionActionPanelView.prototype._generate,
        slot:UTSlotActionPanelView.prototype._generate,
        transfer:UTTransferActionPanelView.prototype._generate,
        quickRender:UTQuickListPanelViewController.prototype.renderView,
        quick:UTQuickListPanelView.prototype._generate,
        loan:UTDuplicateLoanActionPanelView.prototype._generate,
        sbc:UTSBCSquadDetailPanelView.prototype.render,
        market:UTMarketSearchFiltersView.prototype.setPinnedItem,
        reward:UTRewardSelectionChoiceView.prototype.expandRewardSet
    }

    events.conceptBuyBack = (w) =>{
        let a = w.panelView || w.panel;
        a._sendClubButton._tapDetected(this);
        if(isPhone()){
            let p = w._parentViewController,cv,cn;
            for (let [n,v] of p._childViewControllers.entries()) {
                if(v.className == "UTSBCSquadOverviewViewController"){
                    cv = v;
                    cn = n;
                }
            }
            p.popToViewController(cv,cn)
        }else{
            cntlr.current()._ePitchTapped()
        }
    }

    UTQuickListPanelViewController.prototype.renderView = function () {
        call.panel.quickRender.call(this);
        events.detailsButtonSet(this)
    };

    events.detailsButtonSet = (e) => {
        if(!isPhone() && !cntlr.current()._rightController) return;
        let w = isPhone() ? cntlr.current() : cntlr.right();
        if(w.hasOwnProperty("_rootController")) w = w._rootController;
        let a = w.panelView || w.panel;
        if(!a){
            return;
        }
        if(e.item.isPlayer()){
            let pid = e.item.definitionId || 0;
            if (!events.getCachePrice(pid)) {
                events.loadPlayerPrice([pid]);
            }

            // //假想球员购买按钮
            // if(pid && e.item.concept && "_fsuConceptBuy" in a && info.set.sbc_conceptbuy){
            //     if (!events.getCachePrice(pid)) {
            //         events.loadPlayerPrice([pid]);
            //     }
                
            //     if(events.getCachePrice(pid)){
            //         a._fsuConceptBuy.player = e.item;
            //         a._fsuConceptBuy.setSubtext(events.getCachePrice(pid,1));
            //         a._fsuConceptBuy.displayCurrencyIcon(!0);
            //         a._fsuConceptBuy.setInteractionState(!0);
            //         a._fsuConceptBuy.show();
            //     }              
            // }

            // //假想球员购买直接发送到俱乐部并返回阵容
            // if(a.hasOwnProperty("_sendClubButton") && w._squadContext && a._sendClubButton.isInteractionEnabled() && e.item.definitionId == w._squadContext.squad.getPlayer(w._squadContext.slotIndex).item.definitionId && w._squadContext.squad.getPlayer(w._squadContext.slotIndex).item.concept && info.set.sbc_cback){
            //     events.conceptBuyBack(w);
            //     return;
            // }

            // if(pid && a.hasOwnProperty("_fsuPlayer")){
            //     a._fsuPlayer.__root.setAttribute("data-id",pid);
            //     a._fsuPlayer.__root.setAttribute("data-name",`${e.item._staticData.name}`);
            //     a._fsuPlayer.setDisplay(1);
            //     if(!info.set.player_futbin){
            //         a._fsuPlayer.hide();
            //     }
            // }

            // if(pid && a.hasOwnProperty("_fsuGP")){
            //     a._fsuGP.__root.setAttribute("data-id",pid);
            //     if(pdb.hasOwnProperty(pid)){
            //         a._fsuGP.setText(fy("quicklist.getpricey"));
            //         a._fsuGP.setSubtext(pdb[pid]);
            //         a._fsuGP.displayCurrencyIcon(!0);
            //     }
            // }

            // e._view._fsuAuction.__subtext.setAttribute('data-id',pid);
            // e._view._fsuAuction.__subtext.setAttribute('data-i',e.item.id || 0);
            // if(events.getCachePrice(pid)){
            //     let lp = info.roster.data[pid].prices[info.base.platform].LCPrice;
            //     if(lp && lp !== "0"){
            //         e._view._fsuAuction.setSubtext(lp);
            //         e._view._fsuAuction.setInteractionState(1);
            //         if(a.hasOwnProperty("_fsuGP")){
            //             a._fsuGP.__root.setAttribute("data-p",lp);
            //             a._fsuGP.show();
            //         }
            //     }else{
            //         e._view._fsuAuction.setSubtext(lp);
            //         e._view._fsuAuction.setInteractionState(0);
            //     }
            // }
            // if(!info.set.player_auction){
            //     e._view._fsuAuction.hide();
            // }
            if(a.hasOwnProperty("_fsuRat") && e.item.rating > 0){
                a._fsuRat.__root.setAttribute("data-r",e.item.rating);
                a._fsuRat.setInteractionState(1);
                a._fsuRat.show();
            }
            if(a.hasOwnProperty("_fsuLeag") && e.item.leagueId > 0){
                a._fsuLeag.__root.setAttribute("data-r",`eligibilitysearch`);
                let originalCriteria = {};
                let criteria = JSON.parse(JSON.stringify(originalCriteria));
                criteria.leagueId = e.item.leagueId;
                criteria.lock = false;
                a._fsuLeag.criteria = criteria;
                a._fsuLeag.setInteractionState(1);
                a._fsuLeag.show();
            }

            if(a.hasOwnProperty("_fsuLeagRat") && e.item.leagueId > 0 && e.item.rating > 0){
                a._fsuLeagRat.__root.setAttribute("data-r",`eligibilitysearch`);
                let originalCriteria = {};
                let criteria = JSON.parse(JSON.stringify(originalCriteria));
                criteria.leagueId = e.item.leagueId;
                criteria.rating = e.item.rating;
                criteria.lock = false;
                a._fsuLeagRat.criteria = criteria;
                a._fsuLeagRat.setInteractionState(1);
                a._fsuLeagRat.show();
            }

            if(a.hasOwnProperty("_fsuClu") && e.item.teamId > 0){
                a._fsuClu.__root.setAttribute("data-r",`eligibilitysearch`);
                let originalCriteria = {};
                let criteria = JSON.parse(JSON.stringify(originalCriteria));
                criteria.teamId = e.item.teamId;
                criteria.lock = false;
                a._fsuClu.criteria = criteria;
                a._fsuClu.setInteractionState(1);
                a._fsuClu.show();
            }

            if(a.hasOwnProperty("_fsuNat") && e.item.teamId > 0){
                a._fsuNat.__root.setAttribute("data-r",`eligibilitysearch`);
                let originalCriteria = {};
                let criteria = JSON.parse(JSON.stringify(originalCriteria));
                criteria.nationId = e.item.nationId;
                criteria.lock = false;
                a._fsuNat.criteria = criteria;
                a._fsuNat.setInteractionState(1);
                a._fsuNat.show();
            }
        }else{
            e._view._fsuAuction.setDisplay(!1);
        }
        if(!info.set.player_getprice || services.User.getUser().tradeAccess !== TradeAccessLevel.ALLOWED){
            a._fsuGP.hide();
        }
        // if(a.hasOwnProperty("_fsuSwap") && a.hasOwnProperty("_fsuUn")){
        //     if(e.item.id){
        //         a._fsuSwap.__text.innerText = fy("sbc.swapquick");
        //         a._fsuUn.__text.innerText = fy("sbc.swapduplicate");
        //         a._fsuChem.__text.innerText = fy("sbc.swapchem");
        //     }else{
        //         a._fsuSwap.__text.innerText = fy("sbc.addquick");
        //         a._fsuUn.__text.innerText = fy("sbc.addduplicate");
        //         a._fsuChem.__text.innerText = fy("sbc.addchem");
        //     }
        //     if(Object.keys(info.criteria).length){
        //         a._fsuSwap.setInteractionState(1);
        //     }
 
 
        //     let ul = cntlr.current()._squad._players.map(function (i) {if(i.item.definitionId > 0){return i.item.definitionId}}).filter(Boolean);
        //     let rul = services.Item.itemDao.itemRepo.getUnassignedItems().map(i => {
        //         if (i.isDuplicate() && !i.isLoaned() && i.isPlayer()) {
        //             if(ul.length){
        //                 if(ul.indexOf(i.definitionId) == -1){
        //                     return i.definitionId
        //                 }
        //             }else{
        //                 return i.definitionId
        //             }
        //         }
        //     }).filter(Boolean);
        //     if(rul.length){
        //         a._fsuUn.setInteractionState(1);
        //     }else{
        //         a._fsuUn.__text.innerText = fy("sbc.notduplicate")
        //     }
        //     if(!info.set.sbc_quick){
        //         a._fsuSwap.hide();
        //     }
        //     if(!info.set.sbc_duplicate){
        //         a._fsuUn.hide();
        //     }
 
        //     //SBC状态置为0
        //     if(w.hasOwnProperty("_parentViewController") && w._parentViewController){
        //         events.sbcQuerySetFillAttr(w._parentViewController,0,false,3)
        //     }
            
        //     //默契球员按钮判断
        //     if(w.hasOwnProperty("_challenge") && w._viewmodel.getIndex() < 11 && w._squad.getFieldPlayers().filter(i => i.getItem().rating > 0).length){
        //         let c = 0,r = 0,q = 0;
        //         for (let se of w._challenge.eligibilityRequirements) {
        //             if(se.getFirstKey() === 35){
        //                 c = se.getFirstValue(35)
        //             }
        //             if(se.getFirstKey() === 19){
        //                 r = se.getFirstValue(19)
        //             }
        //             if(se.getFirstKey() === 3){
        //                 q = `${se.scope == 0 ? ">=" : se.scope == 1 ? "<=" : "="}${se.getFirstValue(3)}`
                        
        //             }
        //         }
        //         if(c){
        //             a._fsuChem.show();
        //             a._fsuChem.__root.setAttribute("data-c",c);
        //             a._fsuChem.__root.setAttribute("data-r",r);
        //             a._fsuChem.__root.setAttribute("data-q",q);
        //             a._fsuChem._parent = w;
        //         }
        //     }
        //     if(w.hasOwnProperty("_challenge") && w._challenge.meetsRequirements() && info.set.sbc_meetsreq && w._viewmodel.getIndex() < 11){
        //         a._fsuMeets.show();
        //         a._fsuMeets._parent = w;
        //     }
        // }
 
        // //插入假想球员搜索按钮
        // if(!("_fsuConceptSearch" in a) && "_squad" in w && w._squad.isSBC() && e.item.isPlayer() && e.item.concept){
        //     let btnBox = events.createElementWithConfig("div",{
        //         classList:["ut-button-group"]
        //     })
        //     a._fsuConceptSearch = [];
        //     let btnSetting = {club:[`teamId:club`,`leagueId:league`],league:[`leagueId:league`,`nationId:nation`]};
        //     _.map(btnSetting,function(value, key) {
        //         let btn = events.createButton(
        //             new UTGroupButtonControl(),
        //             fy(`searchconcept.same${key}`),
        //             async(e) => {
        //                 events.SBCSetRatingPlayers(e);
        //             },
        //             ""
        //         )
        //         btn.getRootElement().setAttribute("data-r","conceptsearch");
        //         btn.criteria = {}
        //         _.map(value,attrKey => {
        //             let cKey = attrKey.split(":");
        //             btn.criteria[cKey[1]] = e.item[cKey[0]];
        //         })
        //         a._fsuConceptSearch.push(btn);
        //         btnBox.appendChild(btn.getRootElement());
        //     });
        //     a._fsuConceptSearchBox = btnBox;
        //     a._fsuButtons.insertAdjacentElement('afterend', btnBox);
        // }
 
        // //插入挑战需求购买按钮
        // if(!("_fsuRequests" in a) && "_squad" in w && w._squad.isSBC() && "_fsuRequests" in w._squad && e.item.isPlayer()){
        //     let btnBox = events.createElementWithConfig("div",{
        //         classList:["ut-button-group"]
        //     })
        //     a._fsuRequests = [];
        //     _.map(w._squad._fsuRequests,(i) => {
        //         let btn = events.createButton(
        //             new UTGroupButtonControl(),
        //             fy([`requirements.${e.item.id ? "swap" : "add"}btn`,i.name]),
        //             async(e) => {
        //                 events.SBCSetRatingPlayers(e);
        //             },
        //             ""
        //         )
        //         btn.criteria = i.criteria;
        //         btn.getRootElement().setAttribute("data-r","eligibilitysearch");
        //         btn.setSubtext(`${w._challenge.getRequirementCounter(i.value)}/${i.value.count}`);
        //         a._fsuRequests.push(btn);
        //         btnBox.appendChild(btn.getRootElement());
        //     })
        //     a._fsuRequestsBox = btnBox;
        //     a._fsuButtons.insertAdjacentElement('afterend', btnBox);
        // }
    }
    
    events.requirementsToText = (e) => {
        let L10n = services.Localization;
        let text = ``;
        let rKey = e.getFirstKey();
        let rIds = e.getValue(rKey);
        function combine(t) {
            return _.map(t, function(value, index, array) {
                return index < array.length - 1 ? value + " " + _.toUpper(L10n.localize("label.general.or")) : value;
            }).join(" ");
        }
        switch(rKey){
            case SBCEligibilityKey.CLUB_ID:
                text = combine(_.uniq(_.map(rIds, (value) => {
                    return UTLocalizationUtil.teamIdToAbbr15(value, L10n)
                })))
                break;
            case SBCEligibilityKey.LEAGUE_ID:
                text = combine(_.map(rIds, (value) => {
                    return UTLocalizationUtil.leagueIdToName(value, L10n)
                }))
                break;
            case SBCEligibilityKey.NATION_ID:
                text = combine(_.map(rIds, (value) => {
                    return UTLocalizationUtil.nationIdToName(value, L10n)
                }))
                break;
            case SBCEligibilityKey.PLAYER_RARITY:
                text = combine(_.map(rIds, (value) => {
                    return L10n.localize(`item.raretype${value}`)
                }))
                break;
            default:
                text = e.getValue(e.getFirstKey()).join();
        }
        return text;
    }

    events.detailsButtonQuick = (e) => {
        let pa = events.createButton(
            new UTGroupButtonControl(),
            fy("quicklist.auction"),
            (e) => {
                events.kobe_showLoader();
                let p = Number(e.__subtext.innerText.replace(/,/g, '')),i = Number(e.__subtext.getAttribute("data-i"));
                events.playerToAuction(i,p);
                events.kobe_hideLoader();
            },
            "accordian fsuBuy"
        )
        pa.setSubtext(0);
        pa.displayCurrencyIcon(!0);
        pa.setInteractionState(!1);
        e._fsuAuction = pa;
        e._btnToggle.__root.after(e._fsuAuction.__root);
    }
    //添加fut默认按钮
    events.createButton = (s,t,b,c) => {
        const btn = s;
        btn.init();
        btn.addTarget(btn, b.bind(btn), EventType.TAP);
        btn.setText(t);
        if(c){
            const cl = c.split(" ").filter(Boolean);
            for (let ci of cl) btn.getRootElement().classList.add(ci);
        }
        return btn;
    }
 
    //添加fut滑动切换选项
    events.createToggle = (t,b) => {
        const te = new UTToggleCellView;
        te.init();
        te.addTarget(te, b.bind(te), EventType.TAP);
        te.setLabel(t);
        return te;
    }

    UTDefaultActionPanelView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.panel.default.call(this, ...args);
            events.detailsButtonAction(this)
        }
    };

    UTDuplicateLoanActionPanelView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.panel.loan.call(this, ...args);
            events.detailsButtonAction(this)
        }
    }
    UTAuctionActionPanelView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.panel.auction.call(this, ...args);
            events.detailsButtonAction(this)
        }
    };
    UTSlotActionPanelView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.panel.slot.call(this, ...args);
            events.detailsButtonAction(this)
        }
    };
    UTTransferActionPanelView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.panel.transfer.call(this, ...args);
            events.detailsButtonAction(this)
        }
    };
 
    events.detailsButtonAction = (e) =>{
        // let fb = events.createButton(
        //     new UTGroupButtonControl(),
        //     fy("quicklist.gotofutbin"),
        //     (e) => {events.openFutbinPlayerUrl(e);},
        //     "more"
        // )
        // fb.setDisplay(!1)
        // e._fsuPlayer = fb;

        // let pb = e._playerBioButton || e._btnPlayerBio;
        // pb.__root.after(e._fsuPlayer.__root);

        // let fg = events.createButton(
        //     new UTGroupButtonControl(),
        //     fy("quicklist.getprice"),
        //     (e) => {events.getAuction(e);},
        //     "accordian fsuGP"
        // )
        // fg.hide();
        // e._fsuGP = fg;
        // let pg = e._btnDiscard || e._findRelatedButton || e._btnSearchMarket || e._discardButton;
        // if(pg){
        //     pg.__root.after(e._fsuGP.__root);
        // }
        if(e.hasOwnProperty("_btnAddSwap") && cntlr.current()._squad.isSBC()){
            let fbg = document.createElement("div");
            fbg.classList.add("ut-button-group");
 
            // e._fsuConceptBuy = events.createButton(
            //     new UTGroupButtonControl(),
            //     fy("conceptbuy.btntext"),
            //     async(e) => {
            //         events.buyPlayer(e.player,e._parent);
            //     },
            //     ""
            // )
            // e._fsuConceptBuy._parent = e;
            // e._fsuConceptBuy.setInteractionState(!1);
            // e._fsuConceptBuy.hide();
            // fbg.appendChild(e._fsuConceptBuy.__root);
 
 
            // let fq = events.createButton(
            //     new UTGroupButtonControl(),
            //     "quickSwap",
            //     async() => {
            //         let b = isPhone() ? cntlr.current()._rootController : cntlr.right();
            //         events.sbcQuerySetFillAttr(b._parentViewController,1,[],3)
            //         b.panelView._btnAddSwap._tapDetected(this);
            //         console.log("快捷添加状态变为",1)
            //     },
            //     ""
            // )
            // fq.setInteractionState(!1);
            // e._fsuSwap = fq;
            // fbg.appendChild(e._fsuSwap.__root);
 
            // let fu = events.createButton(
            //     new UTGroupButtonControl(),
            //     "unassigned",
            //     async() => {
            //         let b = isPhone() ? cntlr.current()._rootController : cntlr.right();
            //         let p = events.getDedupPlayers(events.getItemBy(2,{"definitionId":services.Item.itemDao.itemRepo.getUnassignedItems().map( i => { if(i.isDuplicate() && !i.isLoaned() && i.isPlayer()){return i.definitionId}})}),b._squad.getPlayers());
            //         if(p.length){
            //             events.sbcQuerySetFillAttr(b._parentViewController,3,p,3)
            //             b.panelView._btnAddSwap._tapDetected(this);
            //         }else{
            //             events.notice("notice.noplayer",2);
            //         }
            //     },
            //     ""
            // )
            // fu.setInteractionState(!1);
            // e._fsuUn = fu;
            // fbg.appendChild(e._fsuUn.__root);
 
            // let fr = events.createButton(
            //     new UTGroupButtonControl(),
            //     fy("sbc.swaprating"),
            //     (e) => {events.SBCSetRatingPlayers(e);},
            //     ""
            // )
            // fr.setInteractionState(!1);
            // fr.hide();
            // e._fsuRat = fr;
            // fbg.appendChild(e._fsuRat.__root);

             // 联赛
             let fle = events.createButton(
                new UTGroupButtonControl(),
                "替换为同联赛",
                (e) => {events.SBCSetRatingPlayers(e);},
                ""
            )
            fle.setInteractionState(!1);
            fle.hide();
            e._fsuLeag = fle;
            fbg.appendChild(e._fsuLeag.__root);

            // 联赛同分
            let fler = events.createButton(
                new UTGroupButtonControl(),
                "替换为同联赛同分",
                (e) => {events.SBCSetRatingPlayers(e);},
                ""
            )
            fler.setInteractionState(!1);
            fler.hide();
            e._fsuLeagRat = fler;
            fbg.appendChild(e._fsuLeagRat.__root);

            // 俱乐部
            let fcl = events.createButton(
                new UTGroupButtonControl(),
                "替换为同俱乐部",
                (e) => {events.SBCSetRatingPlayers(e);},
                ""
            )
            fcl.setInteractionState(!1);
            fcl.hide();
            e._fsuClu = fcl;
            fbg.appendChild(e._fsuClu.__root);

            // 国籍
            let fcn = events.createButton(
                new UTGroupButtonControl(),
                "替换为同国籍",
                (e) => {events.SBCSetRatingPlayers(e);},
                ""
            )
            fcn.setInteractionState(!1);
            fcn.hide();
            e._fsuNat = fcn;
            fbg.appendChild(e._fsuNat.__root);
 
            // let fcm = events.createButton(
            //     new UTGroupButtonControl(),
            //     fy("sbc.swapchem"),
            //     (e) => {events.SBCSetChemPlayers(e);},
            //     ""
            // )
            // fcm.hide();
            // e._fsuChem = fcm;
            // fbg.appendChild(e._fsuChem.__root);
            
 
 
            // let fcmr = events.createButton(
            //     new UTGroupButtonControl(),
            //     fy("meetsreq.btntext"),
            //     (e) => {events.SBCSetMeetsPlayers(e);},
            //     ""
            // )
            // fcmr.hide();
            // e._fsuMeets = fcmr;
            // fbg.appendChild(e._fsuMeets.__root);
 
 
            e._fsuButtons = fbg;
            e.__itemActions.before(e._fsuButtons)
            
 
            
        }
    }
 
    //满足条件球员读取程序 返回列表
    events.SBCSetMeetsPlayersResult = async(e, p) => {
        let newChallenge = events.createVirtualChallenge(p._parent);
        let defList = p._parent.squad.getPlayers().map(i => {return i.getItem().definitionId}).filter(Boolean);
        let search = {"NEdatabaseId":defList};
        let shortlist = events.getItemBy(2,search);
        let playerIndex = e.getIndex();
        let currentList = newChallenge.squad.getPlayers().map(i => {return i.getItem()});
        let originPlayer = currentList[playerIndex];
        let resultList = [];
        for (let player of shortlist) {
            currentList[playerIndex] = player;
            newChallenge.squad.setPlayers(currentList);
            if(newChallenge.meetsRequirements()){
                resultList.push(player)
            }
        }

        // return resultList.length === 0 ? resultList : _.cloneDeep(resultList.filter(i => { return i.rating >= originPlayer.rating}));
        return resultList.length === 0 ? resultList : _.cloneDeep(resultList.filter(i => { return i.rating <= 81}).sort((a, b) => a.rating - b.rating));
    }
   

    UTHomeHubView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.task.home.call(this, ...args);
            GM_addStyle(info.base.sytle);
            let locale = services.Messages.messagesDAO.authDelegate.sessionUtas.locale;
            if(locale.language == "zh"){
                info.language = locale.variant == "Hans" ? 0 : 1;
            }
            events.init();
        }
    };
    events.reloadPlayers = async(e) =>{
        await services.Club.getStats().observe(cntlr.current(),async function _onGetStats(e, t) {
            e.unobserve(e);
            t.success ? t.response.stats.forEach(async function(e) {
                if(e.type == 'players'){
                    if(e.count !== services.Club.clubDao.clubRepo.items.length){
                        events.kobe_showLoader();
                        let playersCount = isPhone() ? 200 : 200;
                        let playersPage = Math.ceil(e.count / playersCount);
                        for (let i = 0; i < playersPage; i++) {
                            let playersCriteria = new UTSearchCriteriaDTO();
                            playersCriteria.type = "player";
                            playersCriteria.sortBy = "ovr";
                            playersCriteria.sort = "desc";
                            playersCriteria.count = playersCount;
                            playersCriteria.offset = i * playersCount;
                            events.kobe_changeLoadingText(["loadingclose.ldata",`${i}`,`${playersPage}`]);
                            try {
                                const searchResult = await new Promise((resolve, reject) => {
                                    services.Club.search(playersCriteria).observe(e, (p, t) => {
                                        if (p.unobserve(p), t.success && JSUtils.isObject(t.response)) {
                                            resolve(t.response);
                                        } else {
                                            reject(new Error("Search operation failed"));
                                        }
                                    });
                                });
                                await events.wait(0.2,0.5)
                            } catch (error) {
                                console.error("Search error:", error);
                                services.Notification.queue([services.Localization.localize("notification.club.failedToLoad"), UINotificationType.NEGATIVE]);
                                const navController = e.getNavigationController();
                                if (navController) {
                                    navController.popViewController(true);
                                }
                            }
                        }
                        events.kobe_hideLoader();
                        info.base.state = true;
                        events.notice("notice.ldatasuccess",0);
                        if(cntlr.current().className == "UTHomeHubViewController" && info.task.obj.html && !cntlr.current()._view._objectivesTile.__root.querySelector(".fsu-task") && cntlr.current()._view._objectivesTile.__tileContent.querySelector(".ut-tile-view--subtitle")){
                            cntlr.current()._view._objectivesTile.__tileContent.before(
                                events.createDF(`<div class="fsu-task">${info.task.obj.html}</div>`)
                            )
                        }
                        if(cntlr.current().className == "UTHomeHubViewController" && info.task.sbc.html && !cntlr.current()._view._sbcTile.__root.querySelector(".fsu-task") && cntlr.current()._view._sbcTile.__tileContent.querySelector(".ut-tile-content-graphic-info")){
                            cntlr.current()._view._sbcTile.__tileContent.before(
                                events.createDF(`<div class="fsu-task">${info.task.sbc.html}</div>`)
                            )
                        }
                    }
                }
            }) : NetworkErrorManager.checkCriticalStatus(response.status) && NetworkErrorManager.handleStatus(response.status) && events.kobe_hideLoader() && events.notice("notice.ldataerror",2);
        }); 
    }

    //SBC无须排列创建队伍
    UTSquadBuilderViewModel.prototype.generatePlayerCollection = function (e,o,n) {
        let c = 0;
        let ls = info.build.league ? info.set.shield_league : [];
        let rs = info.build.rare ? [3] : [];
        let p = o.filter(item => !ls.includes(item.leagueId) && !rs.includes(item.rareflag))
        let v = 0;
        for (let i = 0; i < 11; i++) {
            if(!n.getSlot(i).isValid() && !n.getSlot(i).isBrick()){
                v++;
            }
        }
        if(p.length < v && (ls.length || rs.length)){
            events.notice("notice.builder",2)
        }
        let r = this;
        let pa = e.map(function (_, t) {
            var i = n ? n.getSlot(t) : null;
            return i && (i.isValid() || i.isBrick()) ?
                i.getItem() :
                info.build.ignorepos ? 
                p[c++] : r.getBestPlayerForPos(_, p);
        })
        events.loadPlayerPrice(pa.map(function (i) {if(i){return i.definitionId}}).filter(i => i > 0))
        return pa;
    };


    //假想球员批量购买
    events.buyPlayerList = async (player, isShowLoader = true) => {
        isShowLoader && events.kobe_showLoader();
        let defId = 0,playerName ="";
        if(Number.isInteger(player)){
            defId = player;
            playerName = repositories.Item.getStaticDataByDefId(defId).name;
        }else if(typeof player == "object" && player.isPlayer()){
            defId = player.definitionId;
            playerName = player.getStaticData().name
        }
        if(!defId){
            return;
        }
        if(repositories.Item.numItemsInCache(ItemPile.PURCHASED) >= MAX_NEW_ITEMS){
            events.notice(["buyplayer.error",playerName,fy("buyplayer.error.child5")],2);
            events.cardAddBuyErrorTips(defId);
        }else{
            let priceList = await events.readAuctionPrices(player);
            priceList.sort((a, b) => b._auction.buyNowPrice - a._auction.buyNowPrice);
            console.log(priceList)
            isShowLoader && events.kobe_changeLoadingText("buyplayer.loadingclose");
            if(!priceList || priceList.length == 0){
                events.notice(["buyplayer.error",playerName,fy("buyplayer.error.child3")],2);
                events.cardAddBuyErrorTips(defId);
            }else{
                let currentPlayer = priceList[priceList.length - 1];
                let currentData = currentPlayer.getAuctionData();
                if(!currentData.canBuy(services.User.getUser().getCurrency(GameCurrency.COINS).amount)){
                    events.notice(["buyplayer.error",playerName,fy("buyplayer.error.child2")],2);
                    events.cardAddBuyErrorTips(defId);
                }else{
                    if(0 < currentData.getSecondsRemaining()){
                        return new Promise(async (resolve) => {
                            events.sendPinEvents("Item - Detail View");
                            services.Item.bid(currentPlayer,currentPlayer._auction.buyNowPrice).observe(this, async function (sender, data) {
                                if(data.success){
                                    events.notice(["buyplayer.success",playerName,currentPlayer._auction.buyNowPrice],0);
                                    services.Item.move(currentPlayer, ItemPile.CLUB).observe(this, (e,t) => {
                                        if (e.unobserve(this),t.success) {
                                            events.notice(["buyplayer.sendclub.success",playerName],0);
                                            if(isPhone()){
                                                let controller = cntlr.current();
                                                if(controller.className ==  'UTSquadItemDetailsNavigationController'){
                                                    controller.getParentViewController()._eBackButtonTapped()
                                                }
                                            }
                                        }else{
                                            events.notice(["buyplayer.sendclub.error",playerName],2);
                                            events.cardAddBuyErrorTips(defId);
                                        }
                                        isShowLoader && events.kobe_hideLoader();
                                    })
                                }else{
                                    let denied = data.error && data.error.code === UtasErrorCode.PERMISSION_DENIED
                                    events.notice(["buyplayer.error",playerName,`${denied ? fy("buyplayer.error.child1") : ""}`],2);
                                    events.cardAddBuyErrorTips(defId);
                                    isShowLoader && events.kobe_hideLoader();
                                }
                            })
                            resolve();
                        })
                    }else{
                        events.notice(["buyplayer.error",playerName,fy("buyplayer.error.child4")],2);
                        events.cardAddBuyErrorTips(defId);
                    }
                }
            }
            
        }
        isShowLoader && events.kobe_hideLoader();
    };
 
    //购买失败添加标识
    events.cardAddBuyErrorTips = (defId) => {
        let squad = cntlr.current()._squad;
        if(!("_fsuBuyEroor" in squad)){
            squad._fsuBuyEroor = [];
        }
        if (!_.includes(squad._fsuBuyEroor,defId)) {
            squad._fsuBuyEroor.push(defId);
        }
        if(!isPhone()){
            _.map(squad._fsuBuyEroor,i => {
                if(document.querySelector(`.fsu-cards-buyerror[data-id="${i}"]`) == null && document.querySelector(`.fsu-cards-price[data-id="${i}"]`) !== null){
                    let buyErrorElement = events.getBuyErrorTipsHtml();
                    let targetElement = document.querySelector(`.ut-squad-slot-view .concept .fsu-cards-price[data-id="${i}"]`).parentNode;
                    let parentElement = targetElement.parentNode;
                    if(parentElement.querySelector(".fsu-cards-buyerror") == null){
                        parentElement.insertBefore(buyErrorElement, targetElement);
                    }
                }
            })
        }
    }

    events.getBuyErrorTipsHtml = () => {
        let buyError = events.createElementWithConfig("div",{
            classList:["ut-squad-slot-chemistry-points-view","item","fsu-cards","fsu-cards-buyerror"],
            style:{
                left:"auto",
                right:"1%",
                color:"#fae8e6",
                backgroundColor:"#d31332",
                borderColor:"#d6675d"
            }
        })
        let buyErrorIcon = events.createElementWithConfig("div",{
            classList:["ut-squad-slot-chemistry-points-view--container","chemstyle","icon_untradeable"]
        })
        buyError.appendChild(buyErrorIcon);
        return buyError;
    }

    events.readAuctionPrices = async(player,price) => {
        events.kobe_changeLoadingText("readauction.loadingclose");
        let attempts = "queries_number" in info.set ? info.set.queries_number : 5;
        let defId = Number.isInteger(player) ? player : typeof player == "object" && "definitionId" in player ? player.definitionId : Number(player);
        let searchCriteria = new UTSearchCriteriaDTO();
        searchCriteria.defId = [defId];
        searchCriteria.type = SearchType.PLAYER;
        searchCriteria.category = SearchCategory.ANY;
        let searchModel = new UTBucketedItemSearchViewModel();
        searchModel.searchFeature = ItemSearchFeature.MARKET;
        searchModel.defaultSearchCriteria.type = searchCriteria.type;
        searchModel.defaultSearchCriteria.category = searchCriteria.category;
        searchModel.updateSearchCriteria(searchCriteria);
        let result = [];
        if(searchCriteria.defId.length){
            let queried = [];
            if(price){
                searchCriteria.maxBuy = Number(price);
            }else{
                let playerPrice = await getFutbin(`https://www.futbin.com/${info.base.year}/playerPrices?player=${defId}`);
                if(!playerPrice){
                    return;
                }
                info.roster.data[defId] = playerPrice[defId];
                searchCriteria.maxBuy = events.getCachePrice(defId,1);
            }
            searchModel.updateSearchCriteria(searchCriteria);
            events.kobe_changeLoadingText("readauction.loadingclose2");
            while (attempts --> 0) {
                events.kobe_changeLoadingText(["readauction.loadingclose3",`${searchModel.searchCriteria.maxBuy.toLocaleString()}`]);
                if(queried.includes(searchModel.searchCriteria.maxBuy)){
                    break;
                }
                services.Item.clearTransferMarketCache();
                let response = await events.searchTransferMarket(searchModel.searchCriteria, 1);
                if(response.success){
                    events.sendPinEvents("Transfer Market Results - List View");
                    result = result.concat(response.data.items);
                    let currentQuery = searchCriteria.maxBuy;
                    queried.push(currentQuery)
                    if(response.data.items.length == 0){
                        currentQuery = UTCurrencyInputControl.getIncrementAboveVal(currentQuery);
                    }else if(response.data.items.length == 21){
                        currentQuery = UTCurrencyInputControl.getIncrementBelowVal(currentQuery);
                    }else{
                        break;
                    }
                    searchCriteria.maxBuy = currentQuery;
                    searchModel.updateSearchCriteria(searchCriteria);
                }else{
                    events.notice("readauction.error",2);
                    break;
                }
                if(attempts > 0){
                    await events.wait(0.2,0.5)
                }
            }
        }
        return result;
    }

    events.searchTransferMarket = (criteria,type) => {
        return new Promise(async (resolve) => {
            services.Item.searchTransferMarket(criteria, type).observe(this,async function (sender, response) {
                resolve(response);
            });
        })
    }

    events.sendPinEvents = (pageId) => {
        services.PIN.sendData(PINEventType.PAGE_VIEW, {type: PIN_PAGEVIEW_EVT_TYPE,pgid: pageId,});
    };

    UTSBCSquadDetailPanelView.prototype.render = function(e, t, i, o) {
        call.panel.sbc.call(this,e, t, i, o)
        let rh = document.createElement("div");
        rh.classList.add("sbc-quick","top");
        this._sbcQuickOther = rh;

        let to = document.createElement("div");
        to.classList.add("sbc-quick-list","other");
        this._sbcQuickOtherList = to

        info.set.sbc_template = true;
        info.set.sbc_templatemode = false;

        if(!this._fsuSquad && info.set.sbc_template){
            let b = events.createButton(
                new UTStandardButtonControl(),
                fy("sbc.squadfill"),
                (e) => {
                    if(info.set.sbc_templatemode){
                        events.popup(
                            fy("consult.popupt"),
                            fy("consult.popupm"),
                            (t,i) => {
                                if(t === 2){
                                    let v = i.getValue();
                                    if(v == ""){
                                        events.getTemplate(e,1);
                                    }else{
                                        let futBinRegex = /www.futbin.com\/\d{2}\/squad\/\d{9}|^\d{9}$/;
                                        let futGGRegex = /www.fut.gg\/\d{2}\/squad-builder\/\S{8}-\S{4}-\S{4}-\S{4}-\S{12}|^\S{8}-\S{4}-\S{4}-\S{4}-\S{12}$/;
                                        if(futGGRegex.test(v)){
                                            let pattern = /\S{8}-\S{4}-\S{4}-\S{4}-\S{12}/;
                                            let sId = v.match(pattern);
                                            events.getTemplate(e,3,sId[0]);
                                        }else if(futBinRegex.test(v)){
                                            let pattern = /\d{9}/;
                                            let sId = v.match(pattern);
                                            events.getTemplate(e,2,sId[0]);
                                        }else{
                                            events.notice("consult.error",2);
                                        }
                                    }
                                }
                            }
                            ,false,
                            [fy("consult.placeholder"),""],
                            true
                        )
                    }else{
                        events.getTemplate(e,1);
                    }
                },
                "call-to-action"
            )
            b.__root.setAttribute("data-id",e.id);
            this._fsuSquad = b;
            this._fsuSquad.challenge = e;
            this._btnSquadBuilder.__root.after(this._fsuSquad.__root);
        }

        if(!this._fsuMissBuy && info.set.sbc_template){
            let b = events.createButton(
                new UTStandardButtonControl(),
                "购买球员",
                async (e) => {
                    //console.log(cntlr.current()._squad);
                    //console.log(cntlr.current()._squad.getFieldPlayers());
                    let players = e._parent.squad.getFieldPlayers().map(i => i.getItem()).filter(i => i.concept);
                    //console.log(players);
                    events.kobe_showLoader();
                    info.base.template = true;
                    for (const player of players) {
                        if(!info.base.template){return};
                        //console.log(player);     
                        await events.buyPlayerList(player, false);                 
                        events.kobe_changeLoadingText("buyplayer.pauseloadingclose");
                        await events.wait(2, 3);                       
                                                                                            
                    }   
                    events.kobe_hideLoader();  
                    events.notice("buyplayer.missplayerbuy.success",0);               
                },
                "mini call-to-action"
            )
            b._parent = e;
            this._fsuMissBuy = b;
            //this._btnSquadBuilder.__root.after(this._fsuMissBuy.__root);
            this._sbcQuickOtherList.append(this._fsuMissBuy.__root);
        }

        if(!this._fsuMeetsFill && info.set.sbc_template){
            let b = events.createButton(
                new UTStandardButtonControl(),
                "替换满足",
                async (e) => {
                    // console.log(cntlr);
                    // console.log(cntlr.current()._challengeDetailsController._challenge);
                    // console.log(cntlr.current()._squad);
                    // console.log(cntlr.current()._squad.getFieldPlayers());
                    // console.log(e);
                    // let players = _.cloneDeep(e._parent.squad.getFieldPlayers().filter(i => i.getItem().concept));
                    // let currentSquad = _.cloneDeep(e._parent.squad._players.map((p) => p._item));
                    let players = e._parent.squad.getFieldPlayers().filter(i => i.getItem().concept);
                    let currentSquad = e._parent.squad._players.map((p) => p._item);
                    // console.log("currentSquad: ")
                    // console.log(currentSquad)
                    // let oldSquad = _.cloneDeep(e._parent.squad._players.map((p) => p._item));
                    // console.log(players);
                    events.kobe_showLoader();
                    info.base.template = true;
                    for (const player of players) {
                        if(!info.base.template){
                            console.log("info.base.template");
                            return
                        };
                        console.log(player);   
                        let playerIndex = player.getIndex();
                        // console.log(playerIndex);
                        let newplayers = await events.SBCSetMeetsPlayersResult(player, e);  
                        // console.log(newplayers);
                        if (newplayers.length > 0) {

                            let currentPlayersId = currentSquad.filter(i => i.definitionId > 0).map((p) => p.definitionId);
                            // console.log(currentPlayersId);
                            let newPlayersId = newplayers.map((p) => p.definitionId);
                            // console.log(newPlayersId);
                            let difference = _.difference(newPlayersId, currentPlayersId);
                            // console.log(difference);
                            if (difference.length > 0) {
                                let newplayerDiffs =  newplayers.filter(i => difference.indexOf(i.definitionId) !== -1);
                                // console.log(newplayerDiffs);
                                let newplayer = newplayerDiffs[0];
                                // console.log(newplayer);
                                currentSquad[playerIndex] = newplayer;     
                                // console.log("currentSquad: change")
                                // console.log(currentSquad)   
                                
                                events.saveSquadLoader(e._parent,  e._parent.squad, currentSquad, []);
                                //events.saveOldSquad(e._parent.squad, false);
                                //events.kobe_showLoader();
                            }                                            
                        }              
                        events.kobe_changeLoadingText("buyplayer.pauseloadingclose");
                        await events.wait(0.2, 0.5);
                                                                                            
                    }   
                    events.kobe_hideLoader();  
                    console.log(currentSquad);
                    events.saveSquad(e._parent,  e._parent.squad, currentSquad, currentSquad.map(i => {if(i && !info.roster.data.hasOwnProperty(i.definitionId)){return i.definitionId}}).filter(Boolean));
                    events.saveOldSquad(e._parent.squad, false);
                    events.notice("buyplayer.missplayerbuy.success",0);               
                },
                "mini call-to-action"
            )
            b._parent = e;
            //b.__root.style.width = '100%';
            //b.__root.style.marginTop = '.675rem';
            this._fsuMeetsFill = b;
            this._sbcQuickOtherList.append(this._fsuMeetsFill.__root);
            //this._btnSquadBuilder.__root.after(this._fsuMeetsFill.__root);
            //this._challengeDetails._requirements.__root.appendChild(this._sbcQuickOther.__root);            
        }


        if(!this._fsuRatFill && info.set.sbc_template){
            let b = events.createButton(
                new UTStandardButtonControl(),
                "替换同分",
                async (e) => {
                    // console.log(cntlr);
                    // console.log(cntlr.current()._challengeDetailsController._challenge);
                    // console.log(cntlr.current()._squad);
                    // console.log(cntlr.current()._squad.getFieldPlayers());
                    // console.log(e);
                    let players = _.cloneDeep(e._parent.squad.getFieldPlayers().filter(i => i.getItem().concept));
                    let currentSquad = _.cloneDeep(e._parent.squad._players.map((p) => p._item));
                    // console.log("currentSquad: ")
                    // console.log(currentSquad)
                    // let oldSquad = _.cloneDeep(e._parent.squad._players.map((p) => p._item));
                    // console.log(players);
                    events.kobe_showLoader();
                    info.base.template = true;
                    for (const player of players) {
                        if(!info.base.template){return};
                        // console.log(player);   
                        let playerIndex = player.getIndex();
                        // console.log(playerIndex);
                        let newplayers = await events.filterRatingPlayers(player.getItem().rating, e._parent.squad.getPlayers());  
                        // console.log(newplayers);
                        if (newplayers.length > 0) {

                            let currentPlayersId = currentSquad.filter(i => i.definitionId > 0).map((p) => p.definitionId);
                            // console.log(currentPlayersId);
                            let newPlayersId = newplayers.map((p) => p.definitionId);
                            // console.log(newPlayersId);
                            let difference = _.difference(newPlayersId, currentPlayersId);
                            // console.log(difference);
                            if (difference.length > 0) {
                                let newplayerDiffs =  newplayers.filter(i => difference.indexOf(i.definitionId) !== -1);
                                // console.log(newplayerDiffs);
                                let newplayer = newplayerDiffs[0];
                                // console.log(newplayer);
                                currentSquad[playerIndex] = newplayer;     
                                // console.log("currentSquad: change")
                                // console.log(currentSquad)      
                            }                                            
                        }              
                        events.kobe_changeLoadingText("buyplayer.pauseloadingclose");
                        await events.wait(0.2, 1);
                                                                                            
                    }   
                    events.kobe_hideLoader();  
                    // console.log(currentSquad);
                    events.saveSquad(e._parent,  e._parent.squad, currentSquad, []);
                    events.saveOldSquad(e._parent.squad, false);
                    events.notice("buyplayer.missplayerbuy.success",0);               
                },
                "mini call-to-action"
            )
            b._parent = e;
            //b.__root.style.width = '100%';
            //b.__root.style.marginTop = '.675rem';
            this._fsuRatFill = b;
            this._sbcQuickOtherList.append(this._fsuRatFill.__root);
            //this._btnSquadBuilder.__root.after(this._fsuRatFill.__root);
            //this._challengeDetails._requirements.__root.appendChild(this._fsuRatFill.__root);
        }

        this._sbcQuickOther.append(this._sbcQuickOtherList);
        
        this._challengeDetails._requirements.__root.append(this._sbcQuickOther);

    }

    //阵容智能填充
    events.getTemplate = async function(e,type,sId){
        e.setInteractionState(0);
        let squadPos = e.challenge.squad.getFieldPlayers().map(i => { return i.isBrick() ? null : i.getGeneralPosition()});
        events.kobe_showLoader();
        events.kobe_changeLoadingText("loadingclose.template1");
        info.base.template = true;
        events.notice("notice.templateload",1);
        let planCount = 0;
        let resultSquad = [];
        let resultCount = 0;
        let resultValue = 0;
        let resultId = 0;
        let refePlan = [];
        if(type == 1){
 
            let list = await getSbcSquad(e.challenge.id,type);
            if(list && list.length == 0){
                return;
            }
            refePlan = list.slice(0, 5).map(item => item.id);
        }else{
            refePlan.push(sId);
        }
        for (let planId of refePlan) {
            planCount++;
            events.kobe_changeLoadingText(["loadingclose.template2",`${planCount}`,`${refePlan.length - planCount}`]);
            if(!info.base.template){return};
            let planSquad = await getSbcSquad(planId,type == 1 ? 2 : type);
            let ownedPlayer = 0;
            let surplusValue = 0;
            let createSquad = new Array(11);
            let copySquadPos = JSON.parse(JSON.stringify(e.challenge.squad.getFormation().generalPositions));
            for (let i = 0; i < createSquad.length; i++) {
                let formationId = e.challenge.squad.getFormation().id;
                let posIndex = i;
                if(formationId in info.formation){
                    posIndex = copySquadPos.lastIndexOf(info.formation[formationId][i]);
                    copySquadPos[posIndex] = null;
                }
                if(type == 3){
                    if("data" in planSquad && "activeGroupPositions" in planSquad.data && i in planSquad.data.activeGroupPositions){
                        let player = new UTItemEntity();
                        player.definitionId = planSquad.data.activeGroupPositions[i].playerEaId;
                        player.stackCount = 1;
                        let cachePlayer = events.getItemBy(2,{"definitionId":player.definitionId})[0];
                        if(cachePlayer){
                            player.id = cachePlayer.id;
                            player.concept = false;
                        }else{
                            player.id = player.definitionId;
                            player.concept = true;
                        }
                        createSquad[posIndex] = player;
                    }else{
                        createSquad[posIndex] = null;
                    }
                }else{
                    let planIndex = `cardlid${11 - i}`;
                    if(squadPos[posIndex] !== null){
                        if(planIndex in planSquad){
                            let player = new UTItemEntity();
                            let planPlayer = planSquad[planIndex];
                            player.definitionId = planPlayer.Player_Resource;
                            player.stackCount = 1;
                            let cachePlayer = events.getItemBy(2,{"definitionId":planPlayer.Player_Resource})[0];
                            if(cachePlayer){
                                player.id = cachePlayer.id;
                                player.concept = false;
                                ownedPlayer++;
                            }else{
                                player.id = planPlayer.Player_Resource;
                                player.concept = true;
                                surplusValue += planPlayer.price;
                            }
                            createSquad[posIndex] = player;
                        }else{
                            createSquad[posIndex] = null;
                        }
                    }else{
                        createSquad[posIndex] = null;
                    }
                }
            }
            //console.log(`阵容效果：`,createSquad,`拥有球员：`,ownedPlayer,`剩余需花费：`,surplusValue,`阵容id:`,planId)
            if(resultSquad.length == 0 || surplusValue < resultValue || (surplusValue == resultValue && ownedPlayer > resultCount)){
                resultSquad = createSquad;
                resultCount = ownedPlayer;
                resultValue = surplusValue;
                resultId = planId;
            }
        }
        console.log(`最终结果：阵容：`,resultSquad,`拥有球员：`,resultCount,`剩余需花费：`,resultValue,`阵容id:`,resultId)
        if(!info.base.template){return};
        await events.saveSquad(e.challenge,e.challenge.squad,resultSquad,resultSquad.map(i => {if(i && !info.roster.data.hasOwnProperty(i.definitionId)){return i.definitionId}}).filter(Boolean));
        events.saveOldSquad(e.challenge.squad,false)
    }

    //阵容方案保存 
    events.saveSquad = async(c,s,l,a) => {
        info.base.savesquad = true;
        s.removeAllItems();
        s.setPlayers(l, true);
        await services.SBC.saveChallenge(c).observe(
            this,
            async function (z, d) {
                if (!d.success) {
                    events.notice("notice.templateerror",2);
                    s.removeAllItems();
                    info.base.savesquad = false;
                    events.kobe_hideLoader();
                }
                services.SBC.loadChallengeData(c).observe(
                    this,
                    async function (z, {response:{squad}}) {
                        events.kobe_hideLoader();
                        let ps = squad._players.map((p) => p._item);
                        c.squad.setPlayers(ps, true);
                        c.onDataChange.notify({squad});
                        info.base.savesquad = false;
                        if(isPhone() && cntlr.current().className !== "UTSBCSquadOverviewViewController"){
                            setTimeout(() => {
                                cntlr.current()._parentViewController._eBackButtonTapped()
                            },500);
                        }
                        events.notice("notice.templatesuccess",0);
                        events.loadPlayerPrice(a);
                        let view = isPhone() ? cntlr.current().getView() : cntlr.left().getView();
                        // console.log(view._interactionState)
                        if(!view._interactionState){
                            view.setInteractionState(!0)
                        }
                    }
                );
            }
        );
        
    }

    events.saveSquadLoader = async(c,s,l,a) => {
        info.base.savesquad = true;
        s.removeAllItems();
        s.setPlayers(l, true);
        await services.SBC.saveChallenge(c).observe(
            this,
            async function (z, d) {
                if (!d.success) {
                    events.notice("notice.templateerror",2);
                    s.removeAllItems();
                    info.base.savesquad = false;
                    //events.kobe_hideLoader();
                }
                services.SBC.loadChallengeData(c).observe(
                    this,
                    async function (z, {response:{squad}}) {
                        //events.kobe_hideLoader();
                        let ps = squad._players.map((p) => p._item);
                        c.squad.setPlayers(ps, true);
                        c.onDataChange.notify({squad});
                        info.base.savesquad = false;
                        if(isPhone() && cntlr.current().className !== "UTSBCSquadOverviewViewController"){
                            setTimeout(() => {
                                cntlr.current()._parentViewController._eBackButtonTapped()
                            },500);
                        }
                        events.notice("notice.templatesuccess",0);
                        events.loadPlayerPrice(a);
                        let view = isPhone() ? cntlr.current().getView() : cntlr.left().getView();
                        console.log(view._interactionState)
                        if(!view._interactionState){
                            view.setInteractionState(!0)
                        }
                    }
                );
            }
        );
        
    }

    UTSBCService.prototype.loadChallengeData = function (r) {
        var s = this,
            a = new EAObservable();
        return (
            this.sbcDAO
            .loadChallenge(r.id, r.isInProgress())
            .observe(this, function (t, e) {
                t.unobserve(s);
                a.notify(e);
            }),
            a
        );
    };

    function getSbcSquad(i,t){
        let p = info.base.platform == "pc" ? "PC" : "PS";
        let u = t == 1 ? `https://www.futbin.org/futbin/api/getChallengeTopSquads?chal_id=${i}&platform=${p}` : t == 2 ? `https://www.futbin.org/futbin/api/getSquadByID?squadId=${i}` : `https://www.fut.gg/api/squads/${i}`;
        return new Promise(res => {
            GM_xmlhttpRequest({
                method:"GET",
                url:u,
                headers: {
                    "Content-type": "application/json"
                },
                onload:function(response){
                    if(response.status == 404 || response.status == 401){
                        events.notice("notice.loaderror",2);
                        events.kobe_hideLoader();
                    }else{
                        let data = JSON.parse(response.response)[t == 2 ? "squad_data" : "data"];
                        if(data){
                            res(data)
                        }else{
                            events.notice("notice.squaderror",2);
                            events.kobe_hideLoader();
                        }
                    }
                },
                onerror: function(error) {
                    console.error('请求出错:', error);
                    events.notice("notice.loaderror",2);
                    events.kobe_hideLoader();
                }
            })
        })
    };
 


 
    UTSelectItemFromClubViewController.prototype.updateItemList = function(t) {
        call.plist.clubSelectItem.call(this,t)
        //填充状态重置为0判断
        if(this._parentViewController._fsuFillType){
            if(this._parentViewController._fsuFillType%2){
                this._parentViewController._fsuFillType++;
                if(t.length == 0){
                    events.notice("notice.noplayer",2);
                    services.Item.itemDao.itemRepo.unassigned.reset();
                }
            }
        }
    }
 
    call.squad = {
        "setPlayers":UTSquadEntity.prototype.setPlayers,
        "swapPlayers":UTSquadEntity.prototype.swapPlayersByIndex,
        "addItem":UTSquadEntity.prototype.addItemToSlot,
        "removeItem":UTSquadEntity.prototype.removeItemFromSlot,
        "removeAll":UTSquadEntity.prototype.removeAllItems,
        "submitted":UTSBCSquadOverviewViewController.prototype._onChallengeSubmitted,
        "requirements":UTSBCChallengeRequirementsView.prototype.renderChallengeRequirements
    }
 
 
 
    //SBC阵容默契读取程序
    UTSBCChallengeRequirementsView.prototype.renderChallengeRequirements = function(n, r) {
        call.squad.requirements.call(this,n,r)
        setTimeout(() => {
            if(cntlr.current().className.includes("UTSBCSquad")){
                let view = this;
                let ratingEligibility = n.eligibilityRequirements.filter((i) => i.getFirstKey() == 19);
                let requests = [];
                n.eligibilityRequirements.forEach(function(item,index){
                    let eKey = item.getFirstKey();
                    let eValue = item.getValue(eKey);
                    let criteria = {};
                    let requestObject = {};
                    switch (eKey) {
                        case 12:
                            criteria.teamId = eValue;
                            break;
                        case 11:
                            criteria.leagueId = eValue;
                            break;
                        case 10:
                            criteria.nationId = eValue;
                            break;
                        case 18:
                            criteria.rareflag = eValue;
                            break;
                        default:
                            break;
                    }
                    if(Object.keys(criteria).length >= 1 && "__requirements" in view){
                        if(ratingEligibility.length){
                            criteria.GTrating = ratingEligibility[0].getFirstValue(19) - 10;
                        }
                        let eLi = view.__requirements.querySelectorAll("li")[index];
                        let but =  events.createButton(
                            new UTImageButtonControl(),
                            "",
                            (e) => {
                                events.SBCSetRatingPlayers(e);
                            },
                            "filter-btn fsu-eligibilitysearch"
                        )
                        but.getRootElement().setAttribute("data-r",`eligibilitysearch`);
                        criteria.lock = false;
                        but.criteria = criteria;
                        eLi.style.paddingRight = "2rem";
                        eLi.appendChild(but.getRootElement())
                        requestObject.criteria = criteria;
                        requestObject.value = item;
                        requestObject.name = events.requirementsToText(item);
                        requests.push(requestObject);
                    }
                })
                if(requests.length){
                    n.squad._fsuRequests = requests;
                }
            }
        },50);
    }
    UTSquadEntity.prototype.swapPlayersByIndex = function(t, e) {
        call.squad.swapPlayers.call(this,t,e)
        events.saveOldSquad(this,true)
    }
    UTSquadEntity.prototype.addItemToSlot = function(t, e) {
        call.squad.addItem.call(this,t,e)
        if(this.isSBC()){
            let op = this._fsuOldSquad[this._fsuOldSquadCount][t];
            if(op.definitionId == e.definitionId && op.concept == true){
                this._fsuOldSquad[this._fsuOldSquadCount][t] = e;
            }else{
                events.saveOldSquad(this,true)
            }
        }
    }
    UTSquadEntity.prototype.removeItemFromSlot = function(t) {
        call.squad.removeItem.call(this,t)
        events.saveOldSquad(this,true)
    }
    UTSquadEntity.prototype.removeAllItems = function(t) {
        call.squad.removeAll.call(this,t)
        events.saveOldSquad(this,true)
    }
    UTSquadEntity.prototype.setPlayers = function(t, e) {
        call.squad.setPlayers.call(this,t,e)
        events.saveOldSquad(this,true)
    }
 
    //读取阵容保存
    events.saveOldSquad = (s,t,c) => {
        if(s.isSBC() && (!info.base.savesquad || !t)){
            if(!s.hasOwnProperty("_fsuOldSquad") || c){
                s._fsuOldSquad = [];
                s._fsuOldSquadCount = -1;
            }
            let pl = s.getPlayers().map(i => { return i.getItem()});
            if(s._fsuOldSquadCount == -1 || s._fsuOldSquad[s._fsuOldSquadCount].map( i => { return i.id}).join() !== pl.map( i => { return i.id}).join()){
                //console.log("保存阵容",s._fsuOldSquadCount,pl);
                s._fsuOldSquadCount++;
                s._fsuOldSquad.push(pl);
                if(isPhone() && cntlr.current().className == "UTSquadItemDetailsNavigationController"){
                    setTimeout(() => {
                        cntlr.current()._parentViewController._eBackButtonTapped()
                    },500);
                }
            }
        }
    }
    events.getRatingPlayers = (squad,eligibility,ratings) => {
        let playerlist = [],ratingsList = ratings ? Array.from(ratings) : [];
        let Exclusionlist = squad.getPlayers().map((i => {if( i.item.rating && !i.item.concept){return i.item.databaseId}})).filter(Boolean);
        let formation = squad.getFormation();
        let eligibilityChemistry = 0;
        for (let i of eligibility) {
            if(i.getFirstKey() == 35){
                eligibilityChemistry = i.getFirstValue(35);
            }
        }
        let buildSquad = formation.generalPositions.concat(Array(12).fill(-1));
        let manager = squad.getManager().item;
        let criteria = {"NEdatabaseId":Exclusionlist,"NEleagueId":info.build.league ? info.set.shield_league : [],"NErareflag":info.build.rare ? 3 : -1,"lock":false};
        if(info.build.untradeable){
            criteria["untradeable"] = true;
        }
        buildSquad.forEach(function(e, t) {
            let i = squad ? squad.getSlot(t) : null;
            let player = i.getItem();
            if(i && !i.isBrick()){
                if(i.isValid()){
                    //有填充的
                    if(player.concept){
                        //幻想球员
                        let need = JSON.parse(JSON.stringify(criteria));
                        need.rating = player.rating;
                        if(eligibilityChemistry || !info.build.ignorepos){
                            need.bepos = i.getGeneralPosition()
                        }
                        let shortlist = events.getItemBy(2,need,repositories.Item.getUnassignedItems());
                        if(shortlist.length){
                            if(eligibilityChemistry){
                                for (let p of shortlist) {
                                    let fieldPlayers = squad.getFieldPlayers().map(function(t) {return t.item});
                                    playerlist.forEach(function(e, t) {
                                        fieldPlayers[t] = e;
                                    })
                                    fieldPlayers[t] = p;
                                    if(squad.chemCalculator.calculate(formation, fieldPlayers, manager).chemistry >= eligibilityChemistry){
                                        Exclusionlist.push(p.databaseId);
                                        playerlist.push(p);
                                        return;
                                    }
                                }
                            }else{
                                Exclusionlist.push(shortlist[0].databaseId);
                                playerlist.push(shortlist[0]);
                                return;
                            }
                        }
                    }
                }else{
                    //没有填充是空位
                    if(ratingsList.length){
                        //还有填充评分
                        let target;
                        if(ratings.length == 1){
                            target = ratingsList[0];
                        }else{
                            target = ratingsList.shift();
                        }
                        let need = JSON.parse(JSON.stringify(criteria));
                        if(!info.build.ignorepos && e !== -1){
                            need.bepos = i.getGeneralPosition()
                        }
                        if(/^\d{2}$/.test(target)){
                            need.rating = Number(target);
                        }else if(/^\d{2}\+$/.test(target)){
                            need.GTrating = Number(target.replace(/\D/g, ""));
                        }else if(/^\d{2}\-$/.test(target)){
                            need.LTrating = Number(target.replace(/\D/g, ""));
                        }else if(/^\d{2}\-\d{2}$/.test(target)){
                            need.BTWrating = target.split("-").map(x => parseInt(x));
                        }
                        let shortlist = events.getItemBy(2,need,services.Item.itemDao.itemRepo.getUnassignedItems());
                        if(shortlist.length){
                            playerlist.push(shortlist[0]);
                            Exclusionlist.push(shortlist[0].databaseId);
                            return;
                        }
                    }
                }
            }
            playerlist.push(player);
        });
        console.log(playerlist)
        return playerlist;
    }
 
    events.createVirtualChallenge = (c) =>{
        let challengeInfo = {
            assetId:"virtual",
            description: "virtual",
            eligibilityOperation: c.eligibilityOperation,
            endTime: c.endTime,
            formation: c.squad.getFormation().name,
            id: 888888,
            name: "virtual",
            priority: c.priority,
            repeatable: c.repeatable,
            requirements: c.eligibilityRequirements,
            rewards: [],
            setId: 888888,
            status: c.status,
            timesCompleted: c.timesCompleted,
            type: c.type
        };
        let newChallenge = new UTSBCChallengeEntity(challengeInfo);
        let squadInfo = {
            chemistry:0,
            id:888888,
            formation:c.squad.getFormation().name,
            manager:[new UTNullItemEntity()],
            players:[],
            rating:0
        }
        for (let i = 0; i < 23; i++) {
            squadInfo.players.push({
                index:i,
                itemData: new UTItemEntity()
            })
        }
        let brickIndices = undefined;
        if(c.squad.simpleBrickIndices.length){
            brickIndices = [];
            for (let i = 0; i < 11; i++) {
                brickIndices.push({
                    index:i,
                    playerType: c.squad.simpleBrickIndices.includes(i) ? "BRICK" : "DEFAULT"
                })
            }
        }
        let newSquad = new UTSquadEntity(
            factories.Squad.generateSBCSquadConstructorOptions(squadInfo,services.SBC.sbcDAO.factory,brickIndices),
            services.Squad.squadDao,
            new UTSquadChemCalculatorUtils(services.Chemistry,repositories.TeamConfig)
        )
        newSquad.setPlayers(c.squad.getPlayers().map(i => {return i.getItem()}),true)
        newChallenge.squad = newSquad;
        return newChallenge;
    }

    unsafeWindow.call = call;
    unsafeWindow.info = info;
    unsafeWindow.cntlr = cntlr;
    unsafeWindow.events = events;
    unsafeWindow._ = _;
})();