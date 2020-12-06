import React, { Component } from "react";
import "./Waveform.css";

import WaveformReact from "waveform-react";

interface WaveformProps {
    audioBuffer?: AudioBuffer;
}

class Waveform extends Component<WaveformProps, {}> {

    render() {
        // Janky hack
        setTimeout(() => window.dispatchEvent(new Event("resize")), 0.01);

        return this.props.audioBuffer ?
            <div className="waveform-wrapper">
                <WaveformReact
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

export default Waveform;
