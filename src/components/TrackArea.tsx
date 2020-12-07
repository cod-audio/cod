import React, { Component } from "react";
import "./TrackArea.css";

import AudioControls from "./AudioControls";
import AudioPlayer from "../util/AudioPlayer";
import Playhead from "./Playhead";
import Waveform from "./Waveform";

interface TrackAreaProps {
    audioBuffer?: AudioBuffer;
    audioPlayer: AudioPlayer;
    isAudioPlaying: boolean;
}

interface TrackAreaState {
    playheadIntervalId?: number;
    playheadPosition: number;
}

class TrackArea extends Component<TrackAreaProps, TrackAreaState> {

    defaultState: TrackAreaState = {
        playheadPosition: 0
    };

    constructor(props: TrackAreaProps) {
        super(props);
        this.state = this.defaultState;
    }

    startPlayheadMove = () => {
        if (window) {
            const playheadIntervalId = window.setInterval(() => this.updatePlayheadPosition(), 1);
            this.setState({ playheadIntervalId });
        }
    }

    pausePlayheadMove = () => {
        if (window) {
            window.clearInterval(this.state.playheadIntervalId);
            this.setState({ playheadIntervalId: null });
        }
    }

    // TODO: Calculate this correctly
    updatePlayheadPosition = () => {
        this.setState({ playheadPosition: this.state.playheadPosition + 1 });
    }

    render() {
        return <div className="track-area">
            <div className="label-area">
                Insert Labels Here
            </div>
            <div className="playhead-area">
                <Playhead x={this.state.playheadPosition}/>
            </div>
            <div className="waveform-area">
                <Waveform audioBuffer={this.props.audioBuffer}/>
            </div>
            <div className="controls-area">
                <AudioControls audioPlayer={this.props.audioPlayer}
                               pauseCallback={this.pausePlayheadMove.bind(this)}
                               playCallback={this.startPlayheadMove.bind(this)}/>
            </div>
        </div>;
    }

}

export default TrackArea;
