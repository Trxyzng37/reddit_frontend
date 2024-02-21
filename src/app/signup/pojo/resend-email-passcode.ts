export class ResendEmailPasscode {
    public createdNewPasscode: boolean;

    public constructor(createdNewPasscode: boolean) {
        this.createdNewPasscode = createdNewPasscode;
    }
}