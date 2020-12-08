import React, { Component } from "react";
import "./Playhead.css";

import StyleConstants from "../util/StyleConstants";

interface PlayheadProps {
    x: number;
}

class Playhead extends Component<PlayheadProps, {}> {

    render() {
        return <div className="playhead"
                    tabIndex={-1}
                    style={{
                        left: this.props.x + StyleConstants.PlayheadOffset,
                        width: StyleConstants.PlayheadWidth
                    }}>
            &#x25BC;
        </div>;
    }

}

export default Playhead;