export class Comment {
    public _id: number;
    public uid: number;
    public parent_id: number;
    public content: string;
    public level: number;
    public created_at: string;
    public vote: number;

    public constructor(_id: number, uid: number, parent_id: number, content: string, level: number, created_at: string, vote: number) {
        this._id = _id;
        this.uid = uid;
        this.parent_id = parent_id;
        this.content = content;
        this.level = level;
        this.created_at = created_at;
        this.vote = vote;
    }
}