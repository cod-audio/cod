class LabelInfo {
    readonly _id: number;
    public text: string;
    public x: number;

    constructor(x: number, text: string = "") {
        this._id = Date.now();
        this.text = text;
        this.x = x;
    }

}

export default LabelInfo;
