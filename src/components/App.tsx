import React, { Component } from "react";
import "./App.css";

import AudioLoader from "./AudioLoader";
import AudioPlayer from "../util/AudioPlayer";
import StyleConstants from "../util/StyleConstants";
import TrackArea from "./TrackArea";

interface AppState {
    audioBuffer?: AudioBuffer;
    audioPlayer: AudioPlayer;
}

class App extends Component<{}, AppState> {

    defaultState: AppState = {
        audioPlayer: new AudioPlayer()
    };

    constructor(props: {}) {
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
        return <div className="App"
                    style={{ margin: StyleConstants.AppMargin }}>
            <AudioLoader handleFileLoad={this.handleFileLoad}/>
            <TrackArea audioBuffer={this.state.audioBuffer}
                       audioPlayer={this.state.audioPlayer}/>
        </div>;
    }

}

export default App;
