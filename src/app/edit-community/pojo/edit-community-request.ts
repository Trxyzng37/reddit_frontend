export class EditCommunityRequest {
    public community_id: number;
    public uid: number;
    public description: string;
    public avatar: string;
    public banner: string;

    public constructor(community_id: number, uid: number, description: string, avatar: string, banner: string) {
        this.community_id = community_id;
        this.uid = uid;
        this.description = description;
        this.avatar = avatar;
        this.banner = banner;
    }
}