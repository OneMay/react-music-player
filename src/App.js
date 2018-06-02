import React, { Component } from "react";
import Header from "./components/header/header";
import Player from "./page/player/player";
import $ from "jquery";
import jPlayer from "jplayer";
import { MUSIC_LIST } from "./config/musiclist";
import MusicList from './page/musiclist/musiclist';
import {Router,Link ,Route,IndexRoute,hashHistory} from 'react-router';
import Pubsub from 'pubsub-js'//事件订阅管理器
import { randomRange } from './utils/util';

class Root extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            musicList: MUSIC_LIST,
            currentMusicItem: MUSIC_LIST[0],
            repeatType: 'cycle'
        };
    }
    playMusic(musicItem){
        $("#player").jPlayer('setMedia',{
            mp3:musicItem.file
        }).jPlayer('play');
        this.setState({
            currentMusicItem:musicItem
        });
    }
    playNext(type="next"){
        let index  = this.findMusicIndex(this.state.currentMusicItem);
        let newIndex = null;
        let musiclistLength = this.state.musicList.length;
        if(type==="next"){
            newIndex = (index + 1) % musiclistLength;
        }else{
            newIndex = (index - 1 + musiclistLength) % musiclistLength;
        }
        let musicItem = this.state.musicList[newIndex];
		this.setState({
			currentMusicItem: musicItem
		});
		this.playMusic(musicItem);
    }
    findMusicIndex(musicItem){
        let index = this.state.musicList.indexOf(musicItem);
        return  Math.max(0, index);
    }
    playWhenEnd() {
		if (this.state.repeatType === 'random') {
			let index = this.findMusicIndex(this.state.currentMusicItem);
			let randomIndex = randomRange(0, this.state.musicList.length - 1);
			while(randomIndex === index) {
				randomIndex = randomRange(0, this.state.musicList.length - 1);
			}
			this.playMusic(this.state.musicList[randomIndex]);
		} else if (this.state.repeatType === 'once') {
            alert(this.state.currentMusicItem)
			this.playMusic(this.state.currentMusicItem);
		} else {
			this.playNext();
		}
	}
    componentDidMount() {
        $("#player").jPlayer({
            
            supplied: "mp3",
            wmode: "window"
        });
        this.playMusic(this.state.currentMusicItem);
        $("#player").bind($.jPlayer.event.ended,(e)=>{
            this.playWhenEnd();
        })
        Pubsub.subscribe('DELETE_MUSIC',(msg,musicItem)=>{
            this.setState({
                musicList:this.state.musicList.filter(item=>{
                    return item !== musicItem;
                })
            })
        })
        Pubsub.subscribe('PLAY_MUSIC',(msg,musicItem)=>{
            this.playMusic(musicItem)
        })
        Pubsub.subscribe('PLAY_PREV',(msg,musicItem)=>{
            this.playNext('prev')
        })
        Pubsub.subscribe('PLAY_NEXT',(msg,musicItem)=>{
            this.playNext()
        })
        let repeatList = [
			'cycle',
			'once',
			'random'
		];
        Pubsub.subscribe('CHANAGE_REPEAT', () => {
			let index = repeatList.indexOf(this.state.repeatType);
			index = (index + 1) % repeatList.length;
			this.setState({
				repeatType: repeatList[index]
			});
		});
    }
    componentWillUnmount() {
        Pubsub.unsubscribe('CHANAGE_REPEAT');
        Pubsub.unsubscribe('DELETE_MUSIC')
        Pubsub.unsubscribe('PLAY_MUSIC')
        Pubsub.unsubscribe('PLAY_PREV')
        Pubsub.unsubscribe('PLAY_NEXT')
        $("#player").unbind($.jPlayer.event.ended)
    }
    render() {
        return ( 
            <div>
                <Header></Header>
                {
                    React.cloneElement(this.props.children,this.state)
                }
            </div >
        );
    }
}



function App(){
 
    return (
        <Router history={hashHistory}>
            <Route path='/' component={Root}>
                <IndexRoute component={Player}></IndexRoute>
                <Route path='list' component={MusicList}/>
            </Route>
        </Router>
    )
}

export default App;