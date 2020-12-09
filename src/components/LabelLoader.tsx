import React, { Component } from "react";
import "./AudioLoader.css";

import LabelInfo from "../util/LabelInfo";

interface LabelLoaderProps {
    audioBuffer?: AudioBuffer;
    onFileRead: (labels: Array<LabelInfo>) => void;
}

interface LabelLoaderState {}

class LabelLoader extends Component<LabelLoaderProps, LabelLoaderState> {

    fileReader: FileReader;

    defaultState: LabelLoaderState = {};

    constructor(props: LabelLoaderProps) {
        super(props);
        this.state = this.defaultState;

        this.fileReader = new FileReader();

        this.fileReader.onloadend = (_: ProgressEvent<FileReader>) => {
            const labels = this.processLabelFile(this.fileReader.result as string);
            this.props.onFileRead(labels.filter((label: LabelInfo | null) => label !== null));
        }
    }

    processLabelFile = (fileContent: string): Array<LabelInfo | null> => {
        return fileContent.split("\n").map((line: string) => {
            const words = line.split("&#x2192");
            const startTime = Number.parseFloat(words[0].trim());
            if (Number.isNaN(startTime)) {
                return null;
            }
            return new LabelInfo(startTime);
        });
    }

    render() {
        return this.props.audioBuffer ?
                <input accept=".txt"
                       name="file"
                       onChange={e => this.fileReader.readAsText(e.target.files?.[0])}
                       type="file"/>
               : null;
    }

}

export default LabelLoader;
