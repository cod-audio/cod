import React, { Component } from "react";
import { AxiosResponse } from "axios";
import "./App.css";

import AudioLoader from "./AudioLoader";
import AudioPlayer from "../util/AudioPlayer";
import LabelGenerator from "./LabelGenerator";
import PageDescription from "./PageDescription";
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

    handleApiResponse = (res: AxiosResponse) => {
        
    }

    render() {
        return <main className="App"
                    style={{ margin: StyleConstants.AppMargin }}>
            <PageDescription/>
            <AudioLoader handleFileLoad={this.handleFileLoad}/>
            <LabelGenerator audioBuffer={this.state.audioBuffer}
                            handleApiResponse={this.handleApiResponse.bind(this)}/>
            <TrackArea audioBuffer={this.state.audioBuffer}
                       audioPlayer={this.state.audioPlayer}/>
        </main>;
    }

}

export default App;
