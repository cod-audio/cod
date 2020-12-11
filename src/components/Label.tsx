import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./Label.css";

import LabelInfo from "../util/LabelInfo";
import Style from "../util/StyleConstants";

interface LabelProps {
    audioBuffer?: AudioBuffer;
    info: LabelInfo;
    onSelectHandler: (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent<HTMLDivElement>) => void;
    toggleDisableCreateLabel: (createLabelDisabled: boolean) => void;
}

interface LabelState {
    editing: boolean;
    text: string;
}

enum Key {
    E = "e",
    Enter = "Enter"
}

class Label extends Component<LabelProps, LabelState> {

    inputRef: React.RefObject<HTMLInputElement>;

    defaultState: LabelState = {
        editing: false,
        text: this.props.info.text
    }

    constructor(props: LabelProps) {
        super(props);
        this.state = this.defaultState;

        this.inputRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    labelIsFocused = () => window && window.document.activeElement === ReactDOM.findDOMNode(this.props.info.ref.current);

    textInputIsFocused = () => window && window.document.activeElement === ReactDOM.findDOMNode(this.inputRef.current);

    focusLabel = () => {
        this.props.toggleDisableCreateLabel(false);
        this.setState({ editing: false });
        this.props.info.ref.current?.focus();
    }

    focusInput = () => {
        this.props.toggleDisableCreateLabel(true);
        this.setState({ editing: true });
        this.inputRef.current?.focus();
    }

    // This is required; otherwise the key event is captured by the document listener instead
    runOnSelectHandlerOnEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === Key.Enter) {
            this.props.onSelectHandler(e);
        }
    }

    onKeyDown = (e: KeyboardEvent) => {
        if (this.labelIsFocused() || this.textInputIsFocused()) {
            if (e.altKey && e.key.toLowerCase() === Key.E) {
                e.preventDefault();
                if (this.state.editing) {
                    this.focusLabel();
                } else {
                    this.focusInput();
                }
            }
        }
    }

    onBlur = () => {
        if (this.state.editing) {
            this.focusLabel();
        }
    }

    setText = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.info.text = e.currentTarget.value;
        this.setState({ text: e.currentTarget.value });
    }

    positionToTime = (x: number): number => {
        const buffer = this.props.audioBuffer;
        if (!buffer) {
            return 0;
        }
        const trackTimeSec = buffer.length / buffer.sampleRate;
        const pixelsTravelledRatio = x / Style.TrackAreaWidth;
        return trackTimeSec * pixelsTravelledRatio;
    }

    ariaLabel = () => {
        const labelTime = this.positionToTime(this.props.info.x);
        const seconds = labelTime.toFixed(0);
        const tenths = ((labelTime % 1) * 10).toFixed(0);
        const hundredths = ((labelTime % 0.1) * 100).toFixed(0);
        return `${this.state.text} at ${seconds} point ${tenths} ${hundredths} seconds`;
    }

    render() {
        return this.state.editing ? 
               <input className="label-edit"
                      onChange={e => this.setText(e)}
                      onBlur={this.onBlur}
                      ref={this.inputRef}
                      role="application"
                      style={{ left: this.props.info.x }}
                      type="text"
                      value={this.state.text}/> :
               <div aria-label={this.ariaLabel()}
                    className="label"
                    onClick={this.props.onSelectHandler}
                    onKeyDown={this.runOnSelectHandlerOnEnter}
                    ref={this.props.info.ref}
                    role="button"
                    style={{ left: this.props.info.x }}
                    tabIndex={0}>
                    {this.state.text}
               </div>;
    }

}

export default Label;
