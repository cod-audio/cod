import React, { Component } from "react";

interface AudioPlayerProps {
    audioBuffer?: AudioBuffer;
}

interface AudioPlayerState {
    playbackTime: Number;
}

class AudioPlayer extends Component<AudioPlayerProps, AudioPlayerState>{

    context: AudioContext = new window.AudioContext();
    audioSource: AudioBufferSourceNode;

    defaultState: AudioPlayerState = { playbackTime: 0.0 };

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
        }
    }

    stopAudio = () => {
        if (this.audioSource) {
            this.audioSource.stop();
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
