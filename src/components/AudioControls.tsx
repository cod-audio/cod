import React, { Component } from "react";
import "./AudioControls.css";

import AudioPlayer from "../util/AudioPlayer";

interface AudioControlsProps {
    audioPlayer?: AudioPlayer;
    pauseCallback: () => void;
    playCallback: () => void;
}

interface AudioControlsState {
    paused: boolean;
}

class AudioControls extends Component<AudioControlsProps, AudioControlsState> {

    defaultState: AudioControlsState = {
        paused: true
    };

    constructor(props: AudioControlsProps) {
        super(props);
        this.state = this.defaultState;
    }

    playPressed = () => {
        if (this.props.audioPlayer.getIsLoaded()) {
            this.setState({ paused: false });
            this.props.audioPlayer.play();
            this.props.playCallback();
        }
    }

    pausePressed = () => {
        this.setState({ paused: true });
        this.props.audioPlayer.pause();
        this.props.pauseCallback();
    }
    
    render() {
        return <div className="audio-controls">
            {this.state.paused ?
               <button onClick={this.playPressed}>Play</button> :
               <button onClick={this.pausePressed}>Pause</button>}
        </div>;
    }

}

export default AudioControls;
