export class ResendEmailPasscodeResponse {
    public createdNewPasscode: boolean;

    public constructor(createdNewPasscode: boolean) {
        this.createdNewPasscode = createdNewPasscode;
    }
}