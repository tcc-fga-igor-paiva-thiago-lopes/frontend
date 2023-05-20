import { HttpResponse } from '@capacitor/core';

export class APIError extends Error {
    public response: HttpResponse;

    constructor(response: HttpResponse, message?: string) {
        super(message);

        this.response = response;
    }
}

export default APIError;
