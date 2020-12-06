import React, { Component } from "react";
import './App.css';

import AudioLoader from "./AudioLoader";

interface AppProps {}

interface AppState {
    
}

class App extends Component {

    defaultState: AppState = {};

    constructor(props: AppProps) {
        super(props);
        this.state = this.defaultState;
    }

    render() {
        return <AudioLoader/>;
    }

}

export default App;
