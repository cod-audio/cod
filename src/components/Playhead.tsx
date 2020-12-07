import React, { Component } from "react";
import "./Playhead.css";

import StyleConstants from "../util/StyleConstants";

interface PlayheadProps {
    x: number;
}

interface PlayheadState {
    
}

class Playhead extends Component<PlayheadProps, PlayheadState> {

    render() {
        return <div className="playhead"
                    style={{
                        left: this.props.x - (StyleConstants.PlayheadWidth / 2),
                        width: StyleConstants.PlayheadWidth
                    }}>
            &#x25BC;
        </div>;
    }

}

export default Playhead;