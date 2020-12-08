import React, { Component } from "react";
import "./Label.css";

import LabelInfo from "../util/LabelInfo";

interface LabelProps {
    info: LabelInfo;
    onSelectHandler: (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent<HTMLDivElement>) => void;
}

interface LabelState {
    text: string;
}

class Label extends Component<LabelProps, LabelState> {

    constructor(props: LabelProps) {
        super(props);
        this.state = {
            text: this.props.info.text,
        };
    }

    runOnSelectHandlerOnEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            this.props.onSelectHandler(e);
        }
    }

    render() {
        return <div className="label"
                    onClick={this.props.onSelectHandler}
                    onKeyDown={this.runOnSelectHandlerOnEnter}
                    ref={this.props.info.ref}
                    style={{ left: this.props.info.x }}
                    tabIndex={0}>
                    Label
               </div>;
    }

}

export default Label;
