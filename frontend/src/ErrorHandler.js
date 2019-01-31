const ErrorHandler = (e) => {
    return {
        status: e.response.status,
        title: e.response.data.title,
        message: e.response.data.message
    }
};

export default ErrorHandler;