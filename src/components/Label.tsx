import React, { Component, Fragment } from "react";
import "./Label.css";

import LabelInfo from "../util/LabelInfo";

interface LabelProps {
    info: LabelInfo;
    onClickHandler: (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent<HTMLDivElement>) => void;
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

    runOnClickHandlerOnEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            this.props.onClickHandler(e);
        }
    }

    render() {
        return <div className="label"
                    onClick={this.props.onClickHandler}
                    onKeyDown={this.runOnClickHandlerOnEnter}
                    style={{ left: this.props.info.x }}>
                    Label
               </div>;
    }

}

export default Label;
