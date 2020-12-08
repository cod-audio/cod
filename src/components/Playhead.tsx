import React, { Component } from "react";
import "./Playhead.css";

import StyleConstants from "../util/StyleConstants";

interface PlayheadProps {
    x: number;
}

class Playhead extends Component<PlayheadProps, {}> {

    render() {
        return <div className="playhead"
                    style={{
                        left: this.props.x + StyleConstants.PlayheadOffset,
                        width: StyleConstants.PlayheadWidth
                    }}
                    tabIndex={-1}>
            &#x25BC;
        </div>;
    }

}

export default Playhead;