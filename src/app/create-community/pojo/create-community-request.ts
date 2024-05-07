export class CreateCommunityRequest {
    public uid: number;
    public name: string;
    public description: string;
    public avatar: string;

    public constructor(uid: number, name: string, description: string, avatar: string) {
        this.uid = uid;
        this.name = name;
        this.description = description;
        this.avatar = avatar;
    }
}