export class VotePostRequest {
    public post_id: number;
    public vote:number;
    public username: string;
    public type: string;

    public constructor(post_id: number, vote:number, username: string, type: string) {
        this.post_id = post_id;
        this.vote = vote;
        this.username = username;
        this.type = type;
    }
}