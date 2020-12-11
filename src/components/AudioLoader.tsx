import React, { Component } from "react";
import "./AudioLoader.css";

interface AudioLoaderProps {
    handleFileLoad(audioBuffer: Promise<AudioBuffer>): void; 
}

interface AudioLoaderState {}

const AudioContext = window.AudioContext || window.webkitAudioContext;

class AudioLoader extends Component<AudioLoaderProps, AudioLoaderState> {

    context: AudioContext;
    fileReader: FileReader;

    defaultState: AudioLoaderState = {};

    constructor(props: AudioLoaderProps) {
        super(props);
        this.state = this.defaultState;

        this.fileReader = new FileReader();

        this.fileReader.onloadend = (_: ProgressEvent<FileReader>) => {
            const buffer = this.fileReader.result as ArrayBuffer;
            this.context = new AudioContext();

            this.props.handleFileLoad(new Promise(
                resolve => {
                    this.context.decodeAudioData(buffer, res => resolve(res));
                }
            ));
        };
    }

    render() {
        return <div>
            <button onClick={() => document.getElementById("audio-importer").click()}>Import Audio</button>
            <input accept=".wav, .mp3, .m4a, .pcm, .aiff, .aac, .mov"
                   id="audio-importer"
                   name="file"
                   onChange={e => this.fileReader.readAsArrayBuffer(e.target.files?.[0])}
                   style={{ display: "none" }}
                   type="file"/>
        </div>;
    }

}

export default AudioLoader;
