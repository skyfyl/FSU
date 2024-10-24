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

//满足条件球员读取程序 返回列表
events.SBCSetMeetsPlayersAll = async(e) => {
    let players = e._parent.squad.getFieldPlayers().filter(i => i.getItem().concept);
    let currentSquad = e._parent.squad._players.map((p) => p._item);
    events.showLoader();
    events.changeLoadingText("loadingclose.template1");
    info.run.template = true;
    events.notice("notice.templateload",1);
    let resultSquad = [];

    for (const player of players) {

        if(!info.run.template){return};

        let playerIndex = player.getIndex();
        let newplayers = await events.SBCSetMeetsPlayersList(player, e);
        if (newplayers.length > 0) {

            let currentPlayersId = currentSquad.filter(i => i.definitionId > 0).map((p) => p.definitionId);
            let newPlayersId = newplayers.map((p) => p.definitionId);
            let difference = _.difference(newPlayersId, currentPlayersId);
            if (difference.length > 0) {
                let newplayerDiffs =  newplayers.filter(i => difference.indexOf(i.definitionId) !== -1);
                let newplayer = newplayerDiffs[0];
                currentSquad[playerIndex] = newplayer;

                events.saveSquadLoader(e._parent,  e._parent.squad, currentSquad, []);
            }
        }
        events.changeLoadingText("buyplayer.pauseloadingclose");
        await events.wait(0.2, 0.5);

    }
    if(!info.run.template){return};
    events.saveSquad(e._parent,  e._parent.squad, currentSquad, currentSquad.map(i => {if(i && !info.roster.data.hasOwnProperty(i.definitionId)){return i.definitionId}}).filter(Boolean));
    events.saveOldSquad(e._parent.squad, false);
    events.notice("buyplayer.missplayerbuy.success",0);
}

//满足条件球员读取程序 返回列表
events.SBCSetMeetsPlayersList = async(e, p) => {
    let newChallenge = events.createVirtualChallenge(p._parent);
    let defList = p._parent.squad.getPlayers().map(i => {return i.getItem().definitionId}).filter(Boolean);
    let search = {"NEdatabaseId":defList};
    let shortlist = events.getItemBy(2,search);
    let playerIndex = e.getIndex();
    let currentList = newChallenge.squad.getPlayers().map(i => {return i.getItem()});
    let resultList = [];
    for (let player of shortlist) {
        currentList[playerIndex] = player;
        newChallenge.squad.setPlayers(currentList);
        if(newChallenge.meetsRequirements()){
            resultList.push(player)
        }
    }

    return resultList.length === 0 ? resultList : _.cloneDeep(resultList.filter(i => { return i.rating <= 81}).sort((a, b) => a.rating - b.rating));
}