export class PasscodeResponse {
    public isPasscodeMatch: boolean;
    public isPasscodeExpired: boolean;

    public constructor(isPasscodeMatch: boolean, isPasscodeExpired: boolean) {
        this.isPasscodeMatch = isPasscodeMatch;
        this.isPasscodeExpired = isPasscodeExpired;
    }
}