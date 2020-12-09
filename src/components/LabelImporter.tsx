import React, { Component } from "react";
import "./AudioLoader.css";

import LabelInfo from "../util/LabelInfo";
import Style from "../util/StyleConstants";

interface LabelImporterProps {
    audioBuffer?: AudioBuffer;
    onFileRead: (labels: Array<LabelInfo>) => void;
}

interface LabelImporterState {}

class LabelImporter extends Component<LabelImporterProps, LabelImporterState> {

    fileReader: FileReader;

    defaultState: LabelImporterState = {};

    constructor(props: LabelImporterProps) {
        super(props);
        this.state = this.defaultState;

        this.fileReader = new FileReader();

        this.fileReader.onloadend = (_: ProgressEvent<FileReader>) => {
            const labels = this.processLabelFile(this.fileReader.result as string);
            this.props.onFileRead(labels.filter((label: LabelInfo | null) => label !== null));
        }
    }

    // Parameter t is in milliseconds
    timeToPosition = (t: number): number => {
        const buffer = this.props.audioBuffer;
        if (!buffer) {
            return 0;
        }
        const trackTimeSec = buffer.length / buffer.sampleRate;
        const timeRatio = t / (trackTimeSec * 1000);
        return Math.round(timeRatio * Style.TrackAreaWidth);
    }

    processLabelFile = (fileContent: string): Array<LabelInfo | null> => {
        return fileContent.split("\n").map((line: string) => {
            const words = line.split("→");
            const startTime = Number.parseFloat(words[0].trim());
            if (Number.isNaN(startTime)) {
                return null;
            }
            const text = words[2].trim();
            return new LabelInfo(this.timeToPosition(startTime * 1000), text);
        });
    }

    render() {
        return this.props.audioBuffer ? <div>
                <button onClick={() => document.getElementById("label-importer").click()}>Import Labels</button>
                <input accept=".txt"
                       id="label-importer"
                       name="file"
                       onChange={e => this.fileReader.readAsText(e.target.files?.[0])}
                       style={{ display: "none" }}
                       type="file"/>
            </div> : null;
    }

}

export default LabelImporter;
