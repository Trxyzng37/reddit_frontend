export class JoinCommunity {
    community_id: number;
    join: boolean;

    public constructor(community_id: number, join: boolean) {
        this.community_id = community_id;
        this.join = join;
    }
}