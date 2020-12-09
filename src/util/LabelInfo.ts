import React from "react";

class LabelInfo {

    readonly _id: number;
    public ref: React.RefObject<HTMLDivElement>;
    public text: string;
    public x: number;

    constructor(x: number, text: string = "Label") {
        this._id = Date.now();
        this.ref = React.createRef();
        this.text = text;
        this.x = x;
    }

}

export default LabelInfo;
