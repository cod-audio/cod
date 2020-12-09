import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./Label.css";

import LabelInfo from "../util/LabelInfo";

interface LabelProps {
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

    isFocused = () => window && window.document.activeElement === ReactDOM.findDOMNode(this.props.info.ref.current);

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
        if (this.isFocused() && e.altKey && e.key.toLowerCase() === Key.E) {
            e.preventDefault();
            if (this.state.editing) {
                this.focusLabel();
            } else {
                this.focusInput();
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

    render() {
        return this.state.editing ? 
               <input className="label-edit"
                      onChange={e => this.setText(e)}
                      onBlur={this.onBlur}
                      ref={this.inputRef}
                      style={{ left: this.props.info.x }}
                      type="text"
                      value={this.state.text}/> :
               <div aria-label={`Label ${this.state.text}`}
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
