export class DefaultResponse {
    public error_code: number;

    public constructor(error_code: number) {
        this.error_code = error_code;
    }
}