import React, { Component } from "react";
import "./App.css";

import AudioControls from "./AudioControls";
import AudioLoader from "./AudioLoader";
import AudioPlayer from "../util/AudioPlayer";
import Waveform from "./Waveform";

interface AppProps {}

interface AppState {
    audioBuffer?: AudioBuffer;
    audioPlayer: AudioPlayer;
}

class App extends Component<AppProps, AppState> {

    defaultState: AppState = {
        audioPlayer: new AudioPlayer()
    };

    constructor(props: AppProps) {
        super(props);
        this.state = this.defaultState;
    }

    handleFileLoad = (audioBufferPromise: Promise<AudioBuffer>) => {
        audioBufferPromise.then(audioBuffer => {
            this.setState({ audioBuffer });
            this.state.audioPlayer.load(audioBuffer);
        });
    }

    render() {
        return <div className="App">
            <AudioLoader handleFileLoad={this.handleFileLoad}/>
            <AudioControls audioPlayer={this.state.audioPlayer}/>
            <Waveform audioBuffer={this.state.audioBuffer}/>
        </div>;
    }

}

export default App;
