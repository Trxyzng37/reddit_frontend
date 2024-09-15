import { GetPostResponse } from "./get-post-response";

export class DetailPost extends GetPostResponse {
    public join: number|null;
    public voteType: string|null;
    public save: number|null;
    public communityOwner: number;
    public deleted_by: number;
    public deleted_at: string|null;
    public allowed_at: string|null;
    public editted: number;
    public editted_at: string|null;

    // public constructor(post_id: number, type: string, uid: number, username: string, username_icon: string, community_id: number, community_name: string, community_icon: string, title: string, content: string, created_at: string, vote: number, allow: number, deleted: number, join: number|null, voteType: string|null, save: number|null, communityOwner: number, deleted_by: number, deleted_at: string, allowed_at: string) {
    //     super(post_id, type, uid, username, username_icon, community_id, community_name, community_icon, title, content, created_at, vote, allow, deleted);
    //     this.join = join;
    //     this.voteType = voteType;
    //     this.save = save;
    //     this.communityOwner = communityOwner;
    //     this.deleted_by = deleted_by;
    //     this.deleted_at = deleted_at;
    //     this.allowed_at = allowed_at;
    // }

    public constructor() {
        super(0,'',0,'','',0,'','','','','',0,0,0);
        this.join = null;
        this.voteType = null;
        this.save = null;
        this.communityOwner = 0;
        this.deleted_by = 0;
        this.deleted_at = null;
        this.allowed_at = null;
        this.editted = 0;
        this.editted_at = null;
    }
}