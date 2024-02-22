export class ChangePasswordResponse {
    public isPasswordChange: boolean;

    constructor (isPasswordChange: boolean) {
        this.isPasswordChange = isPasswordChange;
    }
}