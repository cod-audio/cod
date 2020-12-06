import React, { Component } from "react";
import "./TrackArea.css";

import Waveform from "waveform-react";

interface TrackAreaProps {
    audioBuffer?: AudioBuffer;
}

class TrackArea extends Component<TrackAreaProps, {}> {

    render() {
        // Janky hack
        setTimeout(() => window.dispatchEvent(new Event("resize")), 0.01);

        return this.props.audioBuffer ?
            <div className="waveform-wrapper">
                <Waveform
                    buffer={this.props.audioBuffer}
                    plot="line"
                    responsive={true}
                    showPosition={false}
                    waveStyle={{
                        animate: true,
                        color: '#4e2a84',
                        pointWidth: 2
                    }}
                />
            </div> : null;
    }

}

export default TrackArea;
