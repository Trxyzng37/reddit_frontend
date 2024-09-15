export class DeletePostRequest {
    public post_id: number;
    public uid: number;
    public deleted_by: number;

    public constructor(post_id: number, uid: number, deleted_by: number) {
        this.post_id = post_id;
        this.uid = uid;
        this.deleted_by = deleted_by;
    }
}