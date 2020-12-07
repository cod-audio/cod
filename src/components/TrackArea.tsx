import React, { Component } from "react";
import "./TrackArea.css";

import AudioControls from "./AudioControls";
import AudioPlayer from "../util/AudioPlayer";
import Label from "./Label";
import LabelInfo from "../util/LabelInfo";
import Playhead from "./Playhead";
import StyleConstants from "../util/StyleConstants";
import Waveform from "./Waveform";

interface TrackAreaProps {
    audioBuffer?: AudioBuffer;
    audioPlayer: AudioPlayer;
}

interface TrackAreaState {
    labels: Array<LabelInfo>;
    playheadIntervalId?: number;
    playheadPosition: number;
}

class TrackArea extends Component<TrackAreaProps, TrackAreaState> {

    defaultState: TrackAreaState = {
        labels: [],
        playheadPosition: 0
    };

    constructor(props: TrackAreaProps) {
        super(props);
        this.state = this.defaultState;
    }

    // TODO: Calculate this correctly
    updatePlayheadPosition = () => {
        this.setState({ playheadPosition: this.state.playheadPosition + 1 });
    }

    onLabelClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();

        const labelRect: DOMRect = e.currentTarget.getBoundingClientRect();
        this.setState({ playheadPosition: labelRect.left - StyleConstants.AppMargin });

        this.onPausePressed();
    }

    onLabelAreaClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const x = e.pageX - e.currentTarget.offsetLeft;
        this.setState({ labels: [...this.state.labels, new LabelInfo(x)] });
    }

    onPausePressed = () => {
        if (window && this.props.audioPlayer.getIsPlaying()) {
            this.props.audioPlayer.pause();
            window.clearInterval(this.state.playheadIntervalId);
            this.setState({ playheadIntervalId: null });
        }
    }

    onPlayPressed = () => {
        if (window && this.props.audioPlayer.getIsLoaded() && !this.props.audioPlayer.getIsPlaying()) {
            this.props.audioPlayer.play();
            const playheadIntervalId = window.setInterval(() => this.updatePlayheadPosition(), 1);
            this.setState({ playheadIntervalId });
        }
    }

    render() {
        return <div className="track-area">
            <div className="label-area"
                 onClick={this.onLabelAreaClick.bind(this)}>
                {this.state.labels.map((label: LabelInfo) => 
                    <Label key={label._id}
                           info={label}
                           onClickHandler={this.onLabelClick.bind(this)}/>
                )}
            </div>
            <div className="playhead-area">
                <Playhead x={this.state.playheadPosition}/>
            </div>
            <div className="waveform-area">
                <Waveform audioBuffer={this.props.audioBuffer}/>
            </div>
            <div className="controls-area">
                <AudioControls audioPlayer={this.props.audioPlayer}
                               isPlaying={this.props.audioPlayer.getIsPlaying()}
                               onPauseCallback={this.onPausePressed.bind(this)}
                               onPlayCallback={this.onPlayPressed.bind(this)}/>
            </div>
        </div>;
    }

}

export default TrackArea;
