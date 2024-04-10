export class PostRequest {
    public type: string;
    public community: string;
    public title: string;
    public content: string;
    public constructor(type: string, community: string, title: string, content: string) {
        this.community = community;
        this.type = type;
        this.title = title;
        this.content = content;
    }
}