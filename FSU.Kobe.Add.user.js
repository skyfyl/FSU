// ==UserScript==
// @name         【FSU】EAFC FUT WEB 增强器 Kobe ADD
// @namespace    https://futcd.com/
// @version      24.13.5
// @description  EAFCFUT模式SBC任务便捷操作增强器👍👍👍，额外信息展示、近期低价自动查询、一键挂出球员、跳转FUTBIN、快捷搜索、拍卖行优化等等...👍👍👍
// @author       Futcd_kcka Kobe
// @match        https://www.ea.com/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.easports.com/*/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.ea.com/*/ea-sports-fc/ultimate-team/web-app/*
// @updateURL    https://github.com/skyfyl/FSU/releases/latest/download/FSU.user.js
// @downloadURL  https://github.com/skyfyl/FSU/releases/latest/download/FSU.user.js
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

    //本地化文本内容
    info.localization = {
        "price.btntext":["查询价格","查詢價格","Check Price"],
        
    }

    events.filterRatingPlayers = async(r, ps) => {
        let jq = {"rating":Number(r)};            
        let curP = events.getItemBy(2, jq)
        let p = events.getDedupPlayers(curP, ps);
        if(!p.length){
            events.notice("notice.noplayer",2)
            return [];
        }

        return p;
    }

    events.detailsButtonSet = (e) => {
        if(!isPhone() && !cntlr.current()._rightController) return;
        let w = isPhone() ? cntlr.current() : cntlr.right();
        if(w.hasOwnProperty("_rootController")) w = w._rootController;
        let a = w._panelView || w._panel;
        if(!a){
            return;
        }
        if(e.item.isPlayer()){
            let pid = e.item.definitionId || 0;
            if (!events.getCachePrice(pid)) {
                events.loadPlayerPrice([pid]);
            }
            //假想球员购买按钮
            if(pid && e.item.concept && "_fsuConceptBuy" in a && info.set.sbc_conceptbuy){
                if (!events.getCachePrice(pid)) {
                    events.loadPlayerPrice([pid]);
                }
                
                if(events.getCachePrice(pid)){
                    a._fsuConceptBuy.player = e.item;
                    a._fsuConceptBuy.setSubtext(events.getCachePrice(pid,1));
                    a._fsuConceptBuy.displayCurrencyIcon(!0);
                    a._fsuConceptBuy.setInteractionState(!0);
                    a._fsuConceptBuy.show();
                }              
            }
            //假想球员购买直接发送到俱乐部并返回阵容
            if(a.hasOwnProperty("_sendClubButton") && w._squadContext && a._sendClubButton.isInteractionEnabled() && e.item.definitionId == w._squadContext.squad.getPlayer(w._squadContext.slotIndex).item.definitionId && w._squadContext.squad.getPlayer(w._squadContext.slotIndex).item.concept && info.set.sbc_cback){
                events.conceptBuyBack(w);
                return;
            }
            if(pid && a.hasOwnProperty("_fsuPlayer")){
                a._fsuPlayer.__root.setAttribute("data-id",pid);
                a._fsuPlayer.__root.setAttribute("data-name",`${e.item._staticData.name}`);
                a._fsuPlayer.setDisplay(1);
                if(!info.set.player_futbin){
                    a._fsuPlayer.hide();
                }
            }
            if(pid && a.hasOwnProperty("_fsuGP")){
                a._fsuGP.__root.setAttribute("data-id",pid);
                if(pdb.hasOwnProperty(pid)){
                    a._fsuGP.setText(fy("quicklist.getpricey"));
                    a._fsuGP.setSubtext(pdb[pid]);
                    a._fsuGP.displayCurrencyIcon(!0);
                }
            }
            e._view._fsuAuction.__subtext.setAttribute('data-id',pid);
            e._view._fsuAuction.__subtext.setAttribute('data-i',e.item.id || 0);
            if(events.getCachePrice(pid)){
                let lp = info.roster.data[pid].prices[info.base.platform].LCPrice;
                if(lp && lp !== "0"){
                    e._view._fsuAuction.setSubtext(lp);
                    e._view._fsuAuction.setInteractionState(1);
                    if(a.hasOwnProperty("_fsuGP")){
                        a._fsuGP.__root.setAttribute("data-p",lp);
                        a._fsuGP.show();
                    }
                }else{
                    e._view._fsuAuction.setSubtext(lp);
                    e._view._fsuAuction.setInteractionState(0);
                }
            }
            if(!info.set.player_auction){
                e._view._fsuAuction.hide();
            }
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
        if(a.hasOwnProperty("_fsuSwap") && a.hasOwnProperty("_fsuUn")){
            if(e.item.id){
                a._fsuSwap.__text.innerText = fy("sbc.swapquick");
                a._fsuUn.__text.innerText = fy("sbc.swapduplicate");
                a._fsuChem.__text.innerText = fy("sbc.swapchem");
            }else{
                a._fsuSwap.__text.innerText = fy("sbc.addquick");
                a._fsuUn.__text.innerText = fy("sbc.addduplicate");
                a._fsuChem.__text.innerText = fy("sbc.addchem");
            }
            if(Object.keys(info.criteria).length){
                a._fsuSwap.setInteractionState(1);
            }
 
 
            let ul = cntlr.current()._squad._players.map(function (i) {if(i.item.definitionId > 0){return i.item.definitionId}}).filter(Boolean);
            let rul = services.Item.itemDao.itemRepo.getUnassignedItems().map(i => {
                if (i.isDuplicate() && !i.isLoaned() && i.isPlayer()) {
                    if(ul.length){
                        if(ul.indexOf(i.definitionId) == -1){
                            return i.definitionId
                        }
                    }else{
                        return i.definitionId
                    }
                }
            }).filter(Boolean);
            if(rul.length){
                a._fsuUn.setInteractionState(1);
            }else{
                a._fsuUn.__text.innerText = fy("sbc.notduplicate")
            }
            if(!info.set.sbc_quick){
                a._fsuSwap.hide();
            }
            if(!info.set.sbc_duplicate){
                a._fsuUn.hide();
            }
 
            //SBC状态置为0
            if(w.hasOwnProperty("_parentViewController") && w._parentViewController){
                events.sbcQuerySetFillAttr(w._parentViewController,0,false,3)
            }
            
            //默契球员按钮判断
            if(w.hasOwnProperty("_challenge") && w._viewmodel.getIndex() < 11 && w._squad.getFieldPlayers().filter(i => i.getItem().rating > 0).length){
                let c = 0,r = 0,q = 0;
                for (let se of w._challenge.eligibilityRequirements) {
                    if(se.getFirstKey() === 35){
                        c = se.getFirstValue(35)
                    }
                    if(se.getFirstKey() === 19){
                        r = se.getFirstValue(19)
                    }
                    if(se.getFirstKey() === 3){
                        q = `${se.scope == 0 ? ">=" : se.scope == 1 ? "<=" : "="}${se.getFirstValue(3)}`
                        
                    }
                }
                if(c){
                    a._fsuChem.show();
                    a._fsuChem.__root.setAttribute("data-c",c);
                    a._fsuChem.__root.setAttribute("data-r",r);
                    a._fsuChem.__root.setAttribute("data-q",q);
                    a._fsuChem._parent = w;
                }
            }
            if(w.hasOwnProperty("_challenge") && w._challenge.meetsRequirements() && info.set.sbc_meetsreq && w._viewmodel.getIndex() < 11){
                a._fsuMeets.show();
                a._fsuMeets._parent = w;
            }
        }
 
        //插入假想球员搜索按钮
        if(!("_fsuConceptSearch" in a) && "_squad" in w && w._squad.isSBC() && e.item.isPlayer() && e.item.concept){
            let btnBox = events.createElementWithConfig("div",{
                classList:["ut-button-group"]
            })
            a._fsuConceptSearch = [];
            let btnSetting = {club:[`teamId:club`,`leagueId:league`],league:[`leagueId:league`,`nationId:nation`]};
            _.map(btnSetting,function(value, key) {
                let btn = events.createButton(
                    new UTGroupButtonControl(),
                    fy(`searchconcept.same${key}`),
                    async(e) => {
                        events.SBCSetRatingPlayers(e);
                    },
                    ""
                )
                btn.getRootElement().setAttribute("data-r","conceptsearch");
                btn.criteria = {}
                _.map(value,attrKey => {
                    let cKey = attrKey.split(":");
                    btn.criteria[cKey[1]] = e.item[cKey[0]];
                })
                a._fsuConceptSearch.push(btn);
                btnBox.appendChild(btn.getRootElement());
            });
            a._fsuConceptSearchBox = btnBox;
            a._fsuButtons.insertAdjacentElement('afterend', btnBox);
        }
 
        //插入挑战需求购买按钮
        if(!("_fsuRequests" in a) && "_squad" in w && w._squad.isSBC() && "_fsuRequests" in w._squad && e.item.isPlayer()){
            let btnBox = events.createElementWithConfig("div",{
                classList:["ut-button-group"]
            })
            a._fsuRequests = [];
            _.map(w._squad._fsuRequests,(i) => {
                let btn = events.createButton(
                    new UTGroupButtonControl(),
                    fy([`requirements.${e.item.id ? "swap" : "add"}btn`,i.name]),
                    async(e) => {
                        events.SBCSetRatingPlayers(e);
                    },
                    ""
                )
                btn.criteria = i.criteria;
                btn.getRootElement().setAttribute("data-r","eligibilitysearch");
                btn.setSubtext(`${w._challenge.getRequirementCounter(i.value)}/${i.value.count}`);
                a._fsuRequests.push(btn);
                btnBox.appendChild(btn.getRootElement());
            })
            a._fsuRequestsBox = btnBox;
            a._fsuButtons.insertAdjacentElement('afterend', btnBox);
        }
    }
    
 
    events.detailsButtonAction = (e) =>{
        let fb = events.createButton(
            new UTGroupButtonControl(),
            fy("quicklist.gotofutbin"),
            (e) => {events.openFutbinPlayerUrl(e);},
            "more"
        )
        fb.setDisplay(!1)
        e._fsuPlayer = fb;
        let pb = e._playerBioButton || e._btnPlayerBio;
        pb.__root.after(e._fsuPlayer.__root);
        let fg = events.createButton(
            new UTGroupButtonControl(),
            fy("quicklist.getprice"),
            (e) => {events.getAuction(e);},
            "accordian fsuGP"
        )
        fg.hide();
        e._fsuGP = fg;
        let pg = e._btnDiscard || e._findRelatedButton || e._btnSearchMarket || e._discardButton;
        if(pg){
            pg.__root.after(e._fsuGP.__root);
        }
        if(e.hasOwnProperty("_btnAddSwap") && cntlr.current()._squad.isSBC()){
            let fbg = document.createElement("div");
            fbg.classList.add("ut-button-group");
 
            e._fsuConceptBuy = events.createButton(
                new UTGroupButtonControl(),
                fy("conceptbuy.btntext"),
                async(e) => {
                    events.buyPlayer(e.player,e._parent);
                },
                ""
            )
            e._fsuConceptBuy._parent = e;
            e._fsuConceptBuy.setInteractionState(!1);
            e._fsuConceptBuy.hide();
            fbg.appendChild(e._fsuConceptBuy.__root);
 
 
            let fq = events.createButton(
                new UTGroupButtonControl(),
                "quickSwap",
                async() => {
                    let b = isPhone() ? cntlr.current()._rootController : cntlr.right();
                    events.sbcQuerySetFillAttr(b._parentViewController,1,[],3)
                    b._panelView._btnAddSwap._tapDetected(this);
                    console.log("快捷添加状态变为",1)
                },
                ""
            )
            fq.setInteractionState(!1);
            e._fsuSwap = fq;
            fbg.appendChild(e._fsuSwap.__root);
 
            let fu = events.createButton(
                new UTGroupButtonControl(),
                "unassigned",
                async() => {
                    let b = isPhone() ? cntlr.current()._rootController : cntlr.right();
                    let p = events.getDedupPlayers(events.getItemBy(2,{"definitionId":services.Item.itemDao.itemRepo.getUnassignedItems().map( i => { if(i.isDuplicate() && !i.isLoaned() && i.isPlayer()){return i.definitionId}})}),b._squad.getPlayers());
                    if(p.length){
                        events.sbcQuerySetFillAttr(b._parentViewController,3,p,3)
                        b._panelView._btnAddSwap._tapDetected(this);
                    }else{
                        events.notice("notice.noplayer",2);
                    }
                },
                ""
            )
            fu.setInteractionState(!1);
            e._fsuUn = fu;
            fbg.appendChild(e._fsuUn.__root);
 
            let fr = events.createButton(
                new UTGroupButtonControl(),
                fy("sbc.swaprating"),
                (e) => {events.SBCSetRatingPlayers(e);},
                ""
            )
            fr.setInteractionState(!1);
            fr.hide();
            e._fsuRat = fr;
            fbg.appendChild(e._fsuRat.__root);

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
 
            let fcm = events.createButton(
                new UTGroupButtonControl(),
                fy("sbc.swapchem"),
                (e) => {events.SBCSetChemPlayers(e);},
                ""
            )
            fcm.hide();
            e._fsuChem = fcm;
            fbg.appendChild(e._fsuChem.__root);
            
 
 
            let fcmr = events.createButton(
                new UTGroupButtonControl(),
                fy("meetsreq.btntext"),
                (e) => {events.SBCSetMeetsPlayers(e);},
                ""
            )
            fcmr.hide();
            e._fsuMeets = fcmr;
            fbg.appendChild(e._fsuMeets.__root);
 
 
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
                    events.showLoader();
                    info.base.template = true;
                    for (const player of players) {
                        if(!info.base.template){return};
                        //console.log(player);     
                        await events.buyPlayerList(player, false);                 
                        events.changeLoadingText("buyplayer.pauseloadingclose");
                        await events.wait(2, 3);                       
                                                                                            
                    }   
                    events.hideLoader();  
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
                    events.showLoader();
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
                                //events.showLoader();
                            }                                            
                        }              
                        events.changeLoadingText("buyplayer.pauseloadingclose");
                        await events.wait(0.2, 0.5);
                                                                                            
                    }   
                    events.hideLoader();  
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
                    events.showLoader();
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
                        events.changeLoadingText("buyplayer.pauseloadingclose");
                        await events.wait(0.2, 1);
                                                                                            
                    }   
                    events.hideLoader();  
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
                    //events.hideLoader();
                }
                services.SBC.loadChallengeData(c).observe(
                    this,
                    async function (z, {response:{squad}}) {
                        //events.hideLoader();
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
})();