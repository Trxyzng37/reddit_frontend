export class CommentCount {
    public post_id: number;
    public comment_count: number;

    public constructor(post_id: number, comment_count: number) {
        this.post_id = post_id;
        this.comment_count = comment_count;
    }
}