// Kobe Add
if(!this._fsuMeetsFill){
    this._fsuMeetsFill = events.createButton(
        new UTStandardButtonControl(),
        "替换满足",
        (e) => {
            events.SBCSetMeetsPlayersAll(e)
        },
        "mini call-to-action"
    )
    this._fsuMeetsFill.__root.style.width = 'calc(100% - 2rem)';
    this._fsuMeetsFill.__root.style.marginLeft = '1rem';
    this._fsuMeetsFill.__root.style.marginRight = '1rem';
    this._fsuMeetsFill.challenge = e;
    this._challengeDetails.__root.insertBefore(this._fsuMeetsFill.__root, this._challengeDetails.__description.nextSibling);
}

// Kobe Add
if(!this._fsuMeetsFill){
    this._fsuMeetsFill = events.createButton(
        new UTStandardButtonControl(),
        "替换满足",
        (e) => {
            events.SBCSetMeetsPlayersAll(e)
        },
        "call-to-action"
    )
    this._fsuMeetsFill.challenge = e;
    this._btnSquadBuilder.__root.after(this._fsuMeetsFill.__root);
}

// Kobe Add
//满足条件球员读取程序 返回列表
events.SBCSetMeetsPlayersAll = async(e) => {
    let players = e.challenge.squad.getFieldPlayers().filter(i => i.getItem().concept);
    let currentSquad = e.challenge.squad._players.map((p) => p._item);
    events.showLoader();
    events.changeLoadingText("loadingclose.template1");
    info.run.template = true;
    events.notice("notice.templateload",1);
    let resultSquad = [];

    for (const player of players) {

        if(!info.run.template){return;}

        let playerIndex = player.getIndex();
        let newplayers = await events.SBCSetMeetsPlayersList(e, player);
        if (newplayers.length > 0) {

            let currentPlayersId = currentSquad.filter(i => i.definitionId > 0).map((p) => p.definitionId);
            let newPlayersId = newplayers.map((p) => p.definitionId);
            let difference = _.difference(newPlayersId, currentPlayersId);
            if (difference.length > 0) {
                let newplayerDiffs =  newplayers.filter(i => difference.indexOf(i.definitionId) !== -1);
                let newplayer = newplayerDiffs[0];
                currentSquad[playerIndex] = newplayer;

                events.SaveSquadLoader(e.challenge,  e.challenge.squad, currentSquad, []);
            }
        }
        events.changeLoadingText("buyplayer.pauseloadingclose");
        await events.wait(0.2, 0.5);

    }
    if(!info.run.template){return};
    events.saveSquad(e.challenge,  e.challenge.squad, currentSquad, currentSquad.map(i => {if(i && !info.roster.data.hasOwnProperty(i.definitionId)){return i.definitionId}}).filter(Boolean));
    events.saveOldSquad(e.challenge.squad, false);
    events.notice("buyplayer.missplayerbuy.success",0);
}

// Kobe Add
//满足条件球员读取程序 返回列表
events.SBCSetMeetsPlayersList = async(e, p) => {
    let newChallenge = events.createVirtualChallenge(e.challenge);
    let defList = e.challenge.squad.getPlayers().map(i => {return i.getItem().definitionId}).filter(Boolean);
    let search = {"NEdatabaseId":defList};
    let shortlist = events.getItemBy(2,search);
    let playerIndex = p.getIndex();
    let currentList = newChallenge.squad.getPlayers().map(i => {return i.getItem()});
    let resultList = [];
    for (let player of shortlist) {
        currentList[playerIndex] = player;
        newChallenge.squad.setPlayers(currentList);
        if(newChallenge.meetsRequirements()){
            resultList.push(player)
        }
    }

    return resultList.length === 0 ? resultList : _.cloneDeep(resultList.filter(i => { return i.rating <= 83}).sort((a, b) => a.rating - b.rating));
}

// Kobe Add
events.SaveSquadLoader = async(c,s,l,a) => {
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
            }
            services.SBC.loadChallengeData(c).observe(
                this,
                async function (z, {response:{squad}}) {
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