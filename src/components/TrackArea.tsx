import React, { Component } from "react";
import ReactDOM from "react-dom";
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

type MouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;
type KeyboardEvent = React.KeyboardEvent<HTMLDivElement>;

enum ArrowKey {
    Up = "arrowup",
    Down = "arrowdown",
    Left = "arrowleft",
    Right = "arrowright"
}

class TrackArea extends Component<TrackAreaProps, TrackAreaState> {

    playheadStepInterval?: number;
    playheadStepSize = 5;

    defaultState: TrackAreaState = {
        labels: [],
        playheadPosition: 0
    };

    constructor(props: TrackAreaProps) {
        super(props);
        this.state = this.defaultState;
    }

    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    createLabel = (x: number) => {
        const ref = React.createRef<HTMLDivElement>();
        const labels = [...this.state.labels, new LabelInfo(x, ref)].sort((a: LabelInfo, b: LabelInfo) => a.x - b.x);
        this.setState({ labels });
    }

    focusNextOrPrevMatchingLabel = (direction: ArrowKey.Left | ArrowKey.Right) => {
        // I love how well-documented and intuitive setting up custom focus in React is :)
        const labels = this.state.labels;
        let i = 0;
        for (const info of labels) {
            // Find if the label has focus
            if (window.document.activeElement === ReactDOM.findDOMNode(info.ref.current)) {
                break;
            }
            i++;
        }

        // Label i has focus
        if (i < labels.length) {
            const increment = direction === ArrowKey.Left ? -1 : 1;
            const boundCondition = direction === ArrowKey.Left ?
                                   (i: number) => i >= 0 :
                                   (i: number) => i < labels.length;

            // Find the next label with the same text
            for (let j = i + increment; boundCondition; i += increment) {
                if (labels[i].text === labels[j].text) {
                    // Change focus to the matching label
                    labels[j].ref.current.focus();
                    break;
                }
            }
        }
    }

    onKeyDown = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();
        if (key === "l") {
            this.createLabel(this.state.playheadPosition);
        } else if (e.shiftKey) {
            // Navigate to the next matching label (if one is currently focused)
            if (key === ArrowKey.Right || key === ArrowKey.Left) {
                this.focusNextOrPrevMatchingLabel(key);
            }
        }
    }

    calculateInterval(): number {
        const buffer = this.props.audioBuffer;
        return (StyleConstants.TrackAreaWidth * buffer?.sampleRate * this.playheadStepSize) / (1000 * buffer?.length);
    }

    matchAudioToPlayhead(playheadPosition: number) {
        const buffer = this.props.audioBuffer;
        if (buffer) {
            const trackTimeSec = buffer.length / buffer.sampleRate;
            const pixelsTravelledRatio = playheadPosition / StyleConstants.TrackAreaWidth;
            this.props.audioPlayer.setElapsed(trackTimeSec * pixelsTravelledRatio * 1000);
        }
    }

    onLabelSelect = (e: MouseEvent | KeyboardEvent) => {
        e.stopPropagation();

        // Undefined behavior if labels are somehow selected without audio being loaded
        if (this.props.audioBuffer) {
            const labelRect: DOMRect = e.currentTarget.getBoundingClientRect();
            const playheadPosition = labelRect.left - StyleConstants.AppMargin;
            this.setState({ playheadPosition });

            this.onPausePressed();
            this.matchAudioToPlayhead(playheadPosition);
        }
    }

    onLabelAreaClick = (e: MouseEvent) => {
        // Labels shouldn't be created without audio loaded
        if (this.props.audioBuffer) {
            this.createLabel(e.pageX - e.currentTarget.offsetLeft);
        }
    }

    onPlayheadAreaClick = (e: MouseEvent) => {
        // Disable playhead movement if audio is not loaded
        if (this.props.audioBuffer) {
            const x = e.pageX - e.currentTarget.offsetLeft;
            const playheadPosition = Math.max(x - StyleConstants.AppMargin + (StyleConstants.PlayheadWidth / 2) + 1, 0);
            this.setState({ playheadPosition });

            this.onPausePressed();
            this.matchAudioToPlayhead(playheadPosition);
        }
    }

    resetTrack = () => {
        this.onPausePressed();
        this.props.audioPlayer.reset();
        this.setState({ playheadPosition: 0 });
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
            if (this.state.playheadPosition >= StyleConstants.TrackAreaWidth) {
                this.resetTrack();
            }
            this.playheadStepInterval = this.calculateInterval();
            this.props.audioPlayer.play();
            const playheadIntervalId = window.setInterval(() => {
                this.setState({ playheadPosition: this.state.playheadPosition + this.playheadStepInterval || 0 });
                if (this.state.playheadPosition >= StyleConstants.TrackAreaWidth) {
                    this.onPausePressed();
                }
            }, this.playheadStepSize);
            this.setState({ playheadIntervalId });
        }
    }

    render() {
        return <div className="track-area"
                    style={{ width: StyleConstants.TrackAreaWidth }}>
            <div className="label-area"
                 onClick={this.onLabelAreaClick.bind(this)}
                 tabIndex={0}>
                {this.state.labels.map((label: LabelInfo) => <Label key={label._id}
                                   info={label}
                                   onSelectHandler={this.onLabelSelect.bind(this)}/>)}
            </div>
            <div className="playhead-area"
                 onClick={this.onPlayheadAreaClick.bind(this)}
                 tabIndex={0}>
                {this.props.audioBuffer ? <Playhead x={this.state.playheadPosition}/> : null}
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
