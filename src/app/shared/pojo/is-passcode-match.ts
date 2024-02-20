export class IsPasscodeMatch {
    public isPasscodeMatch: boolean;
    public isPasscodeExpired: boolean;

    public constructor(isPasscodeExpired: boolean, isPasscodeMatch: boolean) {
        this.isPasscodeMatch = isPasscodeMatch;
        this.isPasscodeExpired = isPasscodeExpired;
    }
}