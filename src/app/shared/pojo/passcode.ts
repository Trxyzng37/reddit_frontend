export class PassCode {
    public email: string;
    public passcode: number;
    public sendAt: Date;

    public constructor(email: string, passcode: number, sendAt: Date) {
        this.email = email;
        this.passcode = passcode;
        this.sendAt = sendAt;
    }
}