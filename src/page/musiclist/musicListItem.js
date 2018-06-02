import React from 'react';
import './musicListItem.less'
import Pubsub from 'pubsub-js'//事件订阅管理器

function MusicListItem({musicItem,focus}){
    let item = musicItem;
    return (
        <li onClick={playMusic.bind(this,item)} className={`components-listitem row ${focus? 'focus':''}`}>
            <p><strong>{item.title}</strong>-{item.artist}</p>
            <p onClick={deleteMusic.bind(this,item) } className="-col-auto delete"></p>
        </li>
    )
}
function playMusic(musicItem){
    Pubsub.publish('PLAY_MUSIC',musicItem)
}
function deleteMusic(musicItem,e){
    e.stopPropagation();
    
    Pubsub.publish('DELETE_MUSIC',musicItem)

}
export default MusicListItem;