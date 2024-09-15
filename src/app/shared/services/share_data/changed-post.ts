export class ChangedPost {
    public post_id: number;
    public allow: number;
    public deleted: number;
    public allowed_at: string;
    public deleted_at: string;

    public constructor(post_id: number, allow: number, deleted: number, allowed_at: string, deleted_at: string) {
        this.post_id = post_id;
        this.allow = allow;
        this.deleted = deleted;
        this.allowed_at = allowed_at;
        this.deleted_at = deleted_at;
    }
}