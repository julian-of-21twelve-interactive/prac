// response haldler

class ResponseHandler {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    sender(message, status, data, error) {        
        if (error) {
            console.log("-----------------------------------------------------------------")
            console.error(this.req.method + " : "+ this.req.originalUrl); 
            console.error("Headers : ", JSON.stringify(this.req.headers)); 
            console.error("Body : ", JSON.stringify(this.req.body)); 
            console.error("ERROR", error); 
            console.log("-----------------------------------------------------------------")
        }
        
        this.res
            .status(status)
            .json({
                message,
                status,
                data
            })

        // process.env.ENABLE_ACCESS_LOGS will be added
    }

    
    // args : Status code, message, data object,  error object
    custom(...args) { this.sender(...args) }

    // 2XX SUCCESS
    success(message, status,  data) {
        this.sender(
            message || 'STATUS.SUCCESS',
            status,
            data
        )
    }

    created(message, status, data) {
        this.sender(
            message || 'STATUS.CREATED',
            status,
            data
        )
    }

    // 4XX CLIENT ERROR
    badRequest(message, status, data) {
        this.sender(
            message || 'STATUS.BAD_REQUEST',
            status,
            data
        )
    }

    unauthorized(message, status, data, error) {
        this.sender(
            message || 'STATUS.UNAUTHORIZED',
            status,
            data, error
        )
    }

    forbidden(message, status, data, error) {
        this.sender(
            message || 'STATUS.FORBIDDEN',
            status,
            data, error
        )
    }

    notFound(message, status, data, error) {
        this.sender(
            message || 'STATUS.NOT_FOUND',
            status,
            data, error
        )
    }

    // 5XX SERVER ERROR
    serverError(error, status, data) {
        this.sender(
            MESSAGES.SERVER_ERROR,
            status,
            data ? data.toString() : {},
            error
        )
    }

    validation(message, status, data) {
        this.sender(
            message || 'STATUS.NOT_FOUND',
            status,
            data
        )
    }

    notAllowed(message, status, error) {
        this.sender(
            message || 'STATUS.NOT_ALLOWED',
            status,
            error
        )
    }
}

module.exports = ResponseHandler;
