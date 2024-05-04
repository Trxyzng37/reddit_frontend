export class UserProfile {
    public uid: number;
    public username: string;
    public description: string;
    public created_at: string;
    public karma: number;
    public avatar: string;

    public constructor(uid: number, username: string, 
                        description: string, created_at: string, 
                        karma: number, avatar: string) {
        this.uid = uid;
        this.username = username;
        this.description = description;
        this.created_at = created_at;
        this.karma = karma;
        this.avatar = avatar;
    }
}