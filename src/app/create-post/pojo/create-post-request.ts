export class PostRequest {
    public type: string;
    public username: string;
    public community_name: string;
    public title: string;
    public content: string;
    public created_at: Date

    public constructor(type: string, username: string, community_name: string, title: string, content: string, created_at: Date) {
        this.type = type;
        this.community_name = community_name;
        this.username = username;
        this.title = title;
        this.content = content;
        this.created_at = created_at;
    }
}