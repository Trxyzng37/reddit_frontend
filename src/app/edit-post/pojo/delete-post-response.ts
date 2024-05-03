export class DeletePostResponse {
    public deleted: boolean;
    public error: string;

    public constructor(deleted: boolean, error: string) {
        this.deleted = deleted;
        this.error = error;
    }
}