export class ChangePasswordRequest{
    public email: string;
    public newPassword: string;

    constructor (email: string, newPassword: string) {
        this.email = email;
        this.newPassword = newPassword;
    }
}