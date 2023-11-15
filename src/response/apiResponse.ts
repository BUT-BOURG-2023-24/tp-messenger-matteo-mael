import {ErrorEnum} from "./errorEnum";
import {ErrorResponse} from "./errorResponse";

export class ApiResponse {
    public error?: ErrorResponse;
    public data?: unknown;

    constructor(error?: ErrorResponse, data?: any) {
        this.error = error;
        this.data = data;
    }
}