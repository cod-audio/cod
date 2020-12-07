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

    processLabelFile = (fileContent: string): Array<LabelInfo> => {
        return fileContent.split("\n").map((line: string) => {
            return new LabelInfo(0); //TODO: This
        });
    }

    render() {
        return <input type="file"
                      name="file"
                      accept=".txt"
                      onChange={e => this.fileReader.readAsText(e.target.files?.[0])}/>;
    }

}

export default LabelLoader;
