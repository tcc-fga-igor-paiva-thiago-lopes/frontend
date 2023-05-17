import { HttpResponse } from '@capacitor/core';

export class APIError extends Error {
    public response: HttpResponse;

    constructor(response: HttpResponse, message?: string) {
        super(message);

        this.response = response;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, APIError.prototype);
    }
}

export default APIError;
