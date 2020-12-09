import React, { Component } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import "./LabelGenerator.css";

import api from "../config/api";

interface LabelGeneratorProps {
    audioBuffer?: AudioBuffer,
    handleApiResponse: (res: AxiosResponse) => void
}

interface LabelGeneratorState {
    disabled: boolean
}

class LabelGenerator extends Component<LabelGeneratorProps, LabelGeneratorState> {
    
    defaultState = { disabled: false };

    constructor(props: LabelGeneratorProps) {
        super(props);
        this.state = this.defaultState;
    }

    getLabels = () => {
        this.setState({ disabled: true });
        axios.post(api.url, {
            buffer: this.props.audioBuffer.getChannelData(0),
            sampleRate: this.props.audioBuffer.sampleRate
        }).then((res: AxiosResponse) => {
            this.setState({ disabled: false });
            this.props.handleApiResponse(res);
        }).catch((_: AxiosError) => {
            this.setState({ disabled: false });
            alert("Could not generate labels. Please try again.");
        });
    }

    render() {
        return this.props.audioBuffer ? 
               <button disabled={this.state.disabled}
                       onClick={this.getLabels}
               >Generate Labels</button> : null;
    }

}

export default LabelGenerator;
