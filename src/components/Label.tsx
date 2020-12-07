import React, { Component } from "react";
import "./Label.css";

import LabelInfo from "../util/LabelInfo";

interface LabelProps {
    info: LabelInfo;
    onClickHandler: () => void;
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

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        this.setState({ text: e.currentTarget.value });
    }


    render() {
        return <div className="label"
                    onClick={this.props.onClickHandler}
                    style={{ left: this.props.info.x }}>
                    Label
                    {/*<input onInput={this.onChange}
                           type="text"
                           value={this.state.text}/>*/}
               </div>;
    }

}

export default Label;
