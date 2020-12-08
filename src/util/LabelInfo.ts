import React from "react";

type Ref = React.RefObject<HTMLDivElement>;

class LabelInfo {

    readonly _id: number;
    public ref: Ref;
    public text: string;
    public x: number;

    constructor(x: number, ref: Ref, text: string = "") {
        this._id = Date.now();
        this.ref = ref;
        this.text = text;
        this.x = x;
    }

}

export default LabelInfo;
