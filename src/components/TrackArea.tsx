import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./TrackArea.css";

import AudioControls from "./AudioControls";
import AudioPlayer from "../util/AudioPlayer";
import Label from "./Label";
import LabelInfo from "../util/LabelInfo";
import Playhead from "./Playhead";
import Style from "../util/StyleConstants";
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

type KeyboardEvent = React.KeyboardEvent<HTMLDivElement>;
type MouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;
type Ref = React.RefObject<HTMLDivElement>;

enum ArrowKey {
    Up = "arrowup",
    Down = "arrowdown",
    Left = "arrowleft",
    Right = "arrowright"
}

class TrackArea extends Component<TrackAreaProps, TrackAreaState> {

    playheadAreaRef: Ref;
    playheadArrowKeyMovePixels: number = 5;
    playheadStepInterval?: number;
    playheadStepSizeMs = 5;

    defaultState: TrackAreaState = {
        labels: [],
        playheadPosition: 0
    };

    constructor(props: TrackAreaProps) {
        super(props);
        this.state = this.defaultState;

        this.playheadAreaRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    // MARK: Custom accessibility navigation

    isFocused = (ref: Ref) => {
        return window && window.document.activeElement === ReactDOM.findDOMNode(ref.current);
    }

    // Returns the index of the focused label, if any. Otherwise -1.
    focusedLabelIndex = (): number => {
        // Check if a label is currently focused
        const labels = this.state.labels;
        let i = 0;
        for (const info of labels) {
            // Find if the label has focus
            if (this.isFocused(info.ref)) {
                break;
            }
            i++;
        }
        if (i < labels.length) {
            return i;
        }
        return -1;
    }

    // Navigate to the next or previous matching label (if one is currently focused)
    focusNextOrPrevMatchingLabel = (i: number, direction: ArrowKey.Left | ArrowKey.Right) => {
        const labels = this.state.labels;
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
        if (e.altKey) {
            if (key === "l") {
                // We only override screen reader default behavior if one of our keybinds is detected
                e.preventDefault();
                this.createLabel(this.state.playheadPosition);
            } else if (key === ArrowKey.Right || key === ArrowKey.Left) {
                // Check if a label is focused
                let i;
                if ((i = this.focusedLabelIndex()) !== -1) {
                    e.preventDefault();
                    // Label i has focus
                    this.focusNextOrPrevMatchingLabel(i, key);
                }

                // Check if the playhead area is focused
                if (this.isFocused(this.playheadAreaRef)) {
                    e.preventDefault();
                    switch(key) {
                        case ArrowKey.Right:
                            this.setPlayheadPosition(this.state.playheadPosition + this.playheadArrowKeyMovePixels);
                            break;
                        case ArrowKey.Left:
                            this.setPlayheadPosition(this.state.playheadPosition - this.playheadArrowKeyMovePixels);
                            break;
                        default:
                    }
                }
            }
        }
    }
    
    // MARK: Playhead movement and related methods

    calculateInterval(): number {
        const buffer = this.props.audioBuffer;
        return (Style.TrackAreaWidth * buffer?.sampleRate * this.playheadStepSizeMs) / (1000 * buffer?.length);
    }

    setPlayheadPosition = (x: number) => {
        // Disable playhead movement if audio is not loaded
        if (this.props.audioBuffer) {
            // const playheadPosition = Math.min(Math.max(x - Style.AppMargin + (Style.PlayheadWidth / 2) + 1, 0), Style.AppMargin + Style.TrackAreaWidth);
            const playheadPosition = Math.max(x - Style.AppMargin + (Style.PlayheadWidth / 2) + 1, 0);
            this.setState({ playheadPosition });

            this.onPausePressed();
            this.matchAudioToPlayhead(playheadPosition);
        }
    }

    matchAudioToPlayhead(playheadPosition: number) {
        const buffer = this.props.audioBuffer;
        if (buffer) {
            const trackTimeSec = buffer.length / buffer.sampleRate;
            const pixelsTravelledRatio = playheadPosition / Style.TrackAreaWidth;
            this.props.audioPlayer.setElapsed(trackTimeSec * pixelsTravelledRatio * 1000);
        }
    }

    onPlayheadAreaClick = (e: MouseEvent) => {
        // Condition prevents playhead from jumping to 0 when enter is pressed
        if (e.pageX) {
            this.setPlayheadPosition(e.pageX - e.currentTarget.offsetLeft);
        }
    }

    // MARK: Label creation and related methods

    createLabel = (x: number) => {
        const ref = React.createRef<HTMLDivElement>();
        const labels = [...this.state.labels, new LabelInfo(x, ref)].sort((a: LabelInfo, b: LabelInfo) => a.x - b.x);
        this.setState({ labels });
    }

    onLabelSelect = (e: MouseEvent | KeyboardEvent) => {
        e.stopPropagation();

        // Undefined behavior if labels are somehow selected without audio being loaded
        if (this.props.audioBuffer) {
            const labelRect: DOMRect = e.currentTarget.getBoundingClientRect();
            const playheadPosition = labelRect.left - Style.AppMargin;
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

    // MARK: Audio playing

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
            if (this.state.playheadPosition >= Style.TrackAreaWidth) {
                this.resetTrack();
            }
            this.playheadStepInterval = this.calculateInterval();
            this.props.audioPlayer.play();
            const playheadIntervalId = window.setInterval(() => {
                this.setState({ playheadPosition: this.state.playheadPosition + this.playheadStepInterval || 0 });
                if (this.state.playheadPosition >= Style.TrackAreaWidth) {
                    this.onPausePressed();
                }
            }, this.playheadStepSizeMs);
            this.setState({ playheadIntervalId });
        }
    }

    render() {
        return <div className="track-area"
                    style={{ width: Style.TrackAreaWidth }}>
            <div className="label-area"
                 onClick={this.onLabelAreaClick.bind(this)}>
                {this.state.labels.map((label: LabelInfo) => <Label key={label._id}
                                   info={label}
                                   onSelectHandler={this.onLabelSelect.bind(this)}/>)}
            </div>
            <div className="playhead-area"
                 onClick={this.onPlayheadAreaClick.bind(this)}
                 ref={this.playheadAreaRef}
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
