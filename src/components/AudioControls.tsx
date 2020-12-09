import React, { Component } from "react";
import "./AudioControls.css";

import AudioPlayer from "../util/AudioPlayer";

interface AudioControlsProps {
    audioPlayer?: AudioPlayer;
    isPlaying: boolean;
    onPauseCallback: () => void;
    onPlayCallback: () => void;
}

interface AudioControlsState {}

class AudioControls extends Component<AudioControlsProps, AudioControlsState> {

    render() {
        return <div className="audio-controls">
            {this.props.isPlaying ?
                <button onClick={this.props.onPauseCallback}>Pause</button> :
                <button onClick={this.props.onPlayCallback}>Play</button>}
        </div>;
    }

}

export default AudioControls;
