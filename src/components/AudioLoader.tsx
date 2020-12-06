import React, { Component } from "react";
import './AudioLoader.css';

interface AudioLoaderProps {

}

interface AudioLoaderState {

}

class AudioLoader extends Component {

    defaultState: AudioLoaderState = {};

    onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.target.files?.[0]);
        this.setState({
            selectedFile: e.target.files?.[0]
        });
    }

    constructor(props: AudioLoaderProps) {
        super(props);
        this.state = this.defaultState;
    }

    render() {
        return <input type="file" name="file" onChange={this.onChangeHandler}/>;
    }

}

export default AudioLoader;
