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
    
    runPauseHandlerOnEnter = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter") {
            this.props.onPauseCallback();
        }
    }

    runPlayHandlerOnEnter = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter") {
            this.props.onPlayCallback();
        }
    }

    render() {
        return <div className="audio-controls">
            {this.props.isPlaying ?
                <button onClick={this.props.onPauseCallback}
                        onKeyDown={this.runPauseHandlerOnEnter}>Pause</button> :
                <button onClick={this.props.onPlayCallback}
                        onKeyDown={this.runPlayHandlerOnEnter}>Play</button>}
        </div>;
    }

}

export default AudioControls;
