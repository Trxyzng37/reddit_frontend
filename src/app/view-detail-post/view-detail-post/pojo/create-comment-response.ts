export class CreateCommentResponse {
    comment_created: boolean;
    comment_id: number;

    public constructor(comment_created: boolean, comment_id: number) {
        this.comment_created = comment_created;
        this.comment_id = comment_id;
    }
}