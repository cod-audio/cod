import React, { Component } from "react";
import "./App.css";

import AudioLoader from "./AudioLoader";
import AudioPlayer from "./AudioPlayer";
import Waveform from "./Waveform";

interface AppProps {}

interface AppState {
    audioBuffer?: AudioBuffer;
}

class App extends Component<AppProps, AppState> {

    defaultState: AppState = {};

    constructor(props: AppProps) {
        super(props);
        this.state = this.defaultState;
    }

    handleFileLoad = (audioBufferPromise: Promise<AudioBuffer>) => {
        audioBufferPromise.then(audioBuffer => this.setState({ audioBuffer }));
    }

    render() {
        return <div>
            <AudioLoader handleFileLoad={this.handleFileLoad}/>
            <AudioPlayer audioBuffer={this.state.audioBuffer}/>
            <Waveform audioBuffer={this.state.audioBuffer}/>
        </div>;
    }

}

export default App;
