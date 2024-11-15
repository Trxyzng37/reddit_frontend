export class CommentCallback {
    comment_id: number;
    type: string;

    public constructor(comment_id: number, type: string) {
        this.comment_id = comment_id;
        this.type = type;
    }
}