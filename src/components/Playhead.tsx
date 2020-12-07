import React, { Component } from "react";
import "./Playhead.css";

interface PlayheadProps {
    x: number;
}

interface PlayheadState {
    
}

class Playhead extends Component<PlayheadProps, PlayheadState> {

    render() {
        return <div className="playhead" style={{
            position: "relative",
            left: this.props.x
        }}>
            &#x25BC;
        </div>;
    }

}

export default Playhead;