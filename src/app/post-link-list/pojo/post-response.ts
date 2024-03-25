export class PostResponse {
    public post_id: number;
    public community_id: number;
    public uid: number;
    public created_at: string;
    public vote: number;

    public constructor(post_id: number, community_id: number, uid: number, created_at: string, vote: number) {
        this.post_id = post_id;
        this.community_id = community_id;
        this.uid = uid;
        this.created_at = created_at;
        this.vote = vote;
    }
}