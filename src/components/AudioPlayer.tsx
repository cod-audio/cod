import React, { Component } from "react";

import Timer from "../util/Timer";

interface AudioPlayerProps {
    audioBuffer?: AudioBuffer;
}

interface AudioPlayerState {
    timer: Timer;
}

class AudioPlayer extends Component<AudioPlayerProps, AudioPlayerState>{

    context: AudioContext = new window.AudioContext();
    audioSource: AudioBufferSourceNode;

    defaultState: AudioPlayerState = {
        timer: new Timer(() => console.log("Tick, Tock"))
    };

    constructor(props: AudioPlayerProps) {
        super(props);
        this.state = this.defaultState;
    }

    loadAudio = () => {
        if (this.props.audioBuffer) {
            const audioSource = this.context.createBufferSource();
            audioSource.buffer = this.props.audioBuffer;
            audioSource.connect(this.context.destination);
            this.audioSource = audioSource;
        }
    }

    playAudio = () => {
        if (this.audioSource) {
            this.audioSource.start();
            this.state.timer.start();
        }
    }

    stopAudio = () => {
        if (this.audioSource) {
            this.audioSource.stop();
            this.state.timer.stop();
        }
    }

    componentDidUpdate() {
        this.loadAudio();
        this.playAudio();
    }

    render() {
        this.context = new window.AudioContext();
        return <div/>;
    }

}

export default AudioPlayer;
