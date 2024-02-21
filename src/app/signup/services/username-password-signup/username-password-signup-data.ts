export class UsernamePasswordSignupData {
    public username: string;
    public password: string;
    public email: string;
    public role: string

    public constructor(username: string, password: string, email: string) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = "customer";
    }
}