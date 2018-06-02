import React from "react";
import MusicListItem from './musicListItem';

function MusicList({musicList,currentMusicItem}){
    let listEle = null;
    listEle = musicList.map((item)=>{
        return <MusicListItem focus={item===currentMusicItem} key={item.id} musicItem={item}>{item.title}</MusicListItem>
    })

    return (
        <ul>
            {listEle}
        </ul>
    )
}

export default MusicList;