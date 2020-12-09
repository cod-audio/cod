import React, { Component } from "react";
import { AxiosResponse } from "axios";
import ReactDOM from "react-dom";
import "./App.css";

import AudioControls from "./AudioControls";
import AudioLoader from "./AudioLoader";
import AudioPlayer from "../util/AudioPlayer";
import Label from "./Label";
import LabelGenerator from "./LabelGenerator";
import LabelInfo from "../util/LabelInfo";
import LabelImporter from "./LabelImporter";
import PageDescription from "./PageDescription";
import Playhead from "./Playhead";
import Style from "../util/StyleConstants";
import Waveform from "./Waveform";

interface AppState {
    audioBuffer?: AudioBuffer;
    audioPlayer: AudioPlayer;
    createLabelDisabled: boolean;
    labels: Array<LabelInfo>;
    playheadIntervalId?: number;
    playheadPosition: number;
    playheadTime: number;
}

type KeyboardEvent = React.KeyboardEvent<HTMLDivElement>;
type MouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

enum Key {
    L = "l",
    Left = "arrowleft",
    Right = "arrowright",
    Delete = "delete"
}

class App extends Component<{}, AppState> {

    playheadAreaRef: React.RefObject<HTMLDivElement>;
    playheadArrowKeyMovePixels: number = 5;
    playheadStepInterval?: number;
    playheadStepSizeMs = 5;

    defaultState: AppState = {
        audioPlayer: new AudioPlayer(),
        createLabelDisabled: false,
        labels: [],
        playheadPosition: 0,
        playheadTime: 0
    };

    constructor(props: {}) {
        super(props);
        this.state = this.defaultState;

        this.playheadAreaRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    // MARK: AudioLoader

    handleFileLoad = (audioBufferPromise: Promise<AudioBuffer>) => {
        audioBufferPromise.then(audioBuffer => {
            this.setState({ audioBuffer });
            this.state.audioPlayer.load(audioBuffer);
        });
    }

    // MARK: LabelGenerator
    
    handleApiResponse = (res: AxiosResponse) => {
        // Get labels
        // Call this.createLabels
    }

    // MARK: Label creation and related methods

    createLabel = (x: number) => {
        if (!this.state.createLabelDisabled) {
            const labels = [...this.state.labels, new LabelInfo(x)].sort((a: LabelInfo, b: LabelInfo) => a.x - b.x);
            this.setState({ labels });
        }
    }

    createLabels = (newLabels: Array<LabelInfo>) => {
        // Augment label ids to avoid duplicates
        for (let i = 0; i < newLabels.length; i++) {
            newLabels[i]._id += i;
        }
        const labels = [...this.state.labels, ...newLabels].sort((a: LabelInfo, b: LabelInfo) => a.x - b.x);
        this.setState({ labels });
    }

    deleteLabel = (i: number) => {
        const labels = this.state.labels;
        labels.splice(i, 1);
        this.setState({ labels });
    }

    onLabelSelect = (e: MouseEvent | KeyboardEvent) => {
        e.stopPropagation();

        // Undefined behavior if labels are somehow selected without audio being loaded
        if (this.state.audioBuffer) {
            const labelRect: DOMRect = e.currentTarget.getBoundingClientRect();
            const playheadPosition = labelRect.left - Style.AppMargin;
            this.setState({ playheadPosition });

            this.onPausePressed();
            this.matchAudioToPlayhead();
        }
    }

    onLabelAreaClick = (e: MouseEvent) => {
        // Labels shouldn't be created without audio loaded
        if (this.state.audioBuffer) {
            this.createLabel(e.pageX - e.currentTarget.offsetLeft);
        }
    }

    toggleDisableCreateLabel = (createLabelDisabled: boolean) => this.setState({ createLabelDisabled });
    
    // MARK: Playhead movement and related methods

    calculateInterval(): number {
        const buffer = this.state.audioBuffer;
        return (Style.TrackAreaWidth * buffer?.sampleRate * this.playheadStepSizeMs) / (1000 * buffer?.length);
    }

    setPlayheadPosition = (x: number) => {
        // Disable playhead movement if audio is not loaded
        if (this.state.audioBuffer) {
            // const playheadPosition = Math.min(Math.max(x - Style.AppMargin + (Style.PlayheadWidth / 2) + 1, 0), Style.AppMargin + Style.TrackAreaWidth);
            const playheadPosition = Math.max(x - Style.AppMargin + (Style.PlayheadWidth / 2) + 1, 0);
            this.setState({ playheadPosition });

            this.onPausePressed();
            this.matchAudioToPlayhead();
        }
    }

    onPlayheadAreaClick = (e: MouseEvent) => {
        // Condition prevents playhead from jumping to 0 when enter is pressed
        if (e.pageX) {
            this.setPlayheadPosition(e.pageX - e.currentTarget.offsetLeft);
        }
    }

    matchAudioToPlayhead() {
        const playheadTime = this.positionToTime(this.state.playheadPosition);
        this.state.audioPlayer.setElapsed(playheadTime);
        this.setState({ playheadTime });
    }

    // MARK: Audio playing

    resetTrack = () => {
        this.onPausePressed();
        this.state.audioPlayer.reset();
        this.setState({ playheadPosition: 0 });
    }

    onPausePressed = () => {
        if (window && this.state.audioPlayer.getIsPlaying()) {
            this.state.audioPlayer.pause();
            window.clearInterval(this.state.playheadIntervalId);
            this.setState({ playheadIntervalId: null });
        }
    }

    onPlayPressed = () => {
        if (window && this.state.audioPlayer.getIsLoaded() && !this.state.audioPlayer.getIsPlaying()) {
            if (this.state.playheadPosition >= Style.TrackAreaWidth) {
                this.resetTrack();
            }
            this.playheadStepInterval = this.calculateInterval();
            this.state.audioPlayer.play();
            const playheadIntervalId = window.setInterval(() => {
                this.setState({ playheadPosition: this.state.playheadPosition + this.playheadStepInterval || 0 });
                if (this.state.playheadPosition >= Style.TrackAreaWidth) {
                    this.onPausePressed();
                }
            }, this.playheadStepSizeMs);
            this.setState({ playheadIntervalId });
        }
    }

    // MARK: Custom accessibility navigation

    onKeyDown = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();

        if (e.altKey) {
            if (key === Key.L) {
                // We only override screen reader default behavior if one of our keybinds is detected
                e.preventDefault();
                this.createLabel(this.state.playheadPosition);
            } else if (key === Key.Right || key === Key.Left) {
                // Check if a label is focused
                let i;
                if ((i = this.focusedLabelIndex()) !== -1) {
                    e.preventDefault();
                    // Label i has focus
                    this.focusNextOrPrevMatchingLabel(i, key);
                }
            }
        } else if (key === Key.Right || key === Key.Left) {
            // Check if the playhead area is focused
            if (this.isFocused(this.playheadAreaRef)) {
                e.preventDefault();
                // Mimic slider behavior
                switch(key) {
                    case Key.Right:
                        this.setPlayheadPosition(this.state.playheadPosition + this.playheadArrowKeyMovePixels);
                        break;
                    case Key.Left:
                        this.setPlayheadPosition(this.state.playheadPosition - this.playheadArrowKeyMovePixels);
                        break;
                    default:
                }
            }
        } else if (key === Key.Delete) {
            let i;
            if ((i = this.focusedLabelIndex()) !== -1) {
                e.preventDefault();
                // Label i has focus
                this.deleteLabel(i);
            }
        }
        
    }

    isFocused = (ref: React.RefObject<HTMLDivElement>) => {
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
    focusNextOrPrevMatchingLabel = (i: number, direction: Key.Left | Key.Right) => {
        const labels = this.state.labels;
        if (i < labels.length) {
            const increment = direction === Key.Left ? -1 : 1;
            const boundCondition = (j: number) => direction === Key.Left ? j >= 0 : j < labels.length;

            // Find the next label with the same text
            for (let j = i + increment; boundCondition; j += increment) {
                if (labels[i].text === labels[j].text) {
                    // Change focus to the matching label
                    labels[j].ref.current.focus();
                    break;
                }
            }
        }
    }

    // MARK: Helpers

    positionToTime = (x: number): number => {
        const buffer = this.state.audioBuffer;
        if (!buffer) {
            return 0;
        }
        const trackTimeSec = buffer.length / buffer.sampleRate;
        const pixelsTravelledRatio = x / Style.TrackAreaWidth;
        return trackTimeSec * pixelsTravelledRatio * 1000;
    }

    // Parameter t is in milliseconds
    timeToPosition = (t: number): number => {
        const buffer = this.state.audioBuffer;
        if (!buffer) {
            return 0;
        }
        const trackTimeSec = buffer.length / buffer.sampleRate;
        const timeRatio = t / (trackTimeSec * 1000);
        return Math.round(timeRatio * Style.TrackAreaWidth);
    }

    roundToNDigits = (n: number, digits: number): number => {
        const multiplier = Math.pow(10, digits);
        return Math.round(((n) + Number.EPSILON) * multiplier) / multiplier;
    }

    render() {
        return <main className="App"
                    style={{ margin: Style.AppMargin }}>
            <PageDescription/>
            {this.state.audioBuffer ? null : <AudioLoader handleFileLoad={this.handleFileLoad}/>}
            <LabelImporter audioBuffer={this.state.audioBuffer} 
                           onFileRead={this.createLabels.bind(this)}/>
            <LabelGenerator audioBuffer={this.state.audioBuffer}
                            handleApiResponse={this.handleApiResponse.bind(this)}/>
            <div className="track-area"
                 style={{ width: Style.TrackAreaWidth }}>
                <div aria-live="polite"
                     aria-relevant="additions"
                     className="label-area"
                     onClick={this.onLabelAreaClick.bind(this)}>
                     {this.state.labels.map((label: LabelInfo) => label.x <= Style.TrackAreaWidth ? 
                                                                  <Label key={label._id}
                                                                         info={label}
                                                                         onSelectHandler={this.onLabelSelect.bind(this)}
                                                                         toggleDisableCreateLabel={this.toggleDisableCreateLabel.bind(this)}/>
                                                                  : null)}
                </div>
                <div aria-label="playhead"
                     aria-valuenow={+((this.state.playheadTime / 1000).toFixed(2))}
                     aria-valuetext={`${(this.state.playheadTime / 1000).toFixed(2)} seconds`}
                     className="playhead-area"
                     onClick={this.onPlayheadAreaClick.bind(this)}
                     ref={this.playheadAreaRef}
                     role="slider"
                     tabIndex={this.state.audioBuffer ? 0 : -1}>
                     {this.state.audioBuffer ? <Playhead x={this.state.playheadPosition}/> : null}
                </div>
                <div className="waveform-area">
                    <Waveform audioBuffer={this.state.audioBuffer}/>
                </div>
                <div className="controls-area">
                    <AudioControls audioPlayer={this.state.audioPlayer}
                                   isPlaying={this.state.audioPlayer.getIsPlaying()}
                                   onPauseCallback={this.onPausePressed.bind(this)}
                                   onPlayCallback={this.onPlayPressed.bind(this)}/>
                </div>
            </div>
        </main>;
    }

}

export default App;
