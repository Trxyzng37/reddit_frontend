export class DeletePostRequest {
    public post_id: number;
    public uid: number;

    public constructor(post_id: number, uid: number) {
        this.post_id = post_id;
        this.uid = uid;
    }
}