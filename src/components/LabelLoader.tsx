import React, { Component } from "react";
import "./AudioLoader.css";

import LabelInfo from "../util/LabelInfo";

interface LabelLoaderProps {}

interface LabelLoaderState {}

class LabelLoader extends Component<LabelLoaderProps, LabelLoaderState> {

    fileReader: FileReader;

    defaultState: LabelLoaderState = {};

    constructor(props: LabelLoaderProps) {
        super(props);
        this.state = this.defaultState;

        this.fileReader = new FileReader();

        this.fileReader.onloadend = (_: ProgressEvent<FileReader>) => {
            this.processLabelFile(this.fileReader.result as string);
        }
    }

    processLabelFile = (fileContent: string): Array<LabelInfo | null> => {
        return fileContent.split("\n").map((line: string) => {
            const words = line.split("&#x2192");
            const startTime = Number.parseFloat(words[0].trim());
            if (Number.isNaN(startTime)) {
                return null;
            }
            return new LabelInfo(startTime, React.createRef());
        });
    }

    render() {
        return <input accept=".txt"
                      name="file"
                      onChange={e => this.fileReader.readAsText(e.target.files?.[0])}
                      type="file"/>;
    }

}

export default LabelLoader;
