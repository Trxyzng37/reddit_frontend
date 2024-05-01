export class EditPostRequest {
    public post_id: number;
    public type: string;
    public title: string;
    public content: string;

    public constructor(post_id: number, type: string, title: string, content: string) {
        this.post_id = post_id;
        this.type = type;
        this.title = title;
        this.content = content;
    }
}