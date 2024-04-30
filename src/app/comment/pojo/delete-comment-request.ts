export class DeleteCommentRequest {
    public post_id: number;
    public uid: number;
    public _id: number;

    public constructor(post_id: number, uid: number, _id: number) {
        this.post_id = post_id;
        this.uid = uid;
        this._id = _id;
    }
}