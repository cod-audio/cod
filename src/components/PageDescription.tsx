import React, { Component } from "react";
import "./PageDescription.css";

import Style from "../util/StyleConstants";

class PageDescription extends Component<{}, {}> {

    render() {
        return <section className="page-description"
                        style={{ width: Style.TrackAreaWidth }}
                        tabIndex={0}>
            <h1>Welcome to Cod!</h1>
            <p>
                Cod is an online tool for audio playback and labeling. Simply 
                import an audio file and click on the <b>Generate Labels </b>
                button to add labels to the track. Press the <b>Play </b> button 
                to play the track starting at the playhead. Select a label to move 
                the playhead to it.
            </p>
            <h3>Keyboard Navigation:</h3>
            <ol>
                <li>Press enter on the play button to play or pause the audio.</li>
                <li>
                    Press shift plus the left and right arrow keys while the playhead 
                    is focused to move the playhead.
                </li>
                <li>
                    Press shift plus the left and right arrow keys while a label is 
                    selected to focus the next or previous label with the same name.
                </li>
            </ol>
        </section>
    }

}

export default PageDescription;
