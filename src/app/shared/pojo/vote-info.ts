export class VoteInfo {
    public curVote: number;
    public prevVote: number;
    public curVoteType: string|null;
    public prevVoteType: string|null;

    public constructor(curVote: number, prevVote: number, curVoteType: string|null, prevVoteType: string|null) {
        this.curVote = curVote;
        this.prevVote = prevVote;
        this.curVoteType = curVoteType;
        this.prevVoteType = prevVoteType;
    }
}