export class ApiError extends Error {
    public code: number;
    constructor(code: number, message:string) {
        super(message);
        this.code = code;
    }
}
export class Error400 extends ApiError {
    constructor(message:string) {
        super(400, message);
    }
}
export class Error401 extends ApiError {
    constructor(message:string) {
        super(401, message);
    }
}

export class Error404 extends ApiError {
    constructor(message:string) {
        super(404, message);
    }
}

export class Error500 extends ApiError {
    constructor(message:string) {
        super(500, message);
    }
}