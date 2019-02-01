const ErrorHandler = {
    error: {},
    setError: function(title, body) {
        if(!body)
            this.error = {
                title: "Wystąpił błąd",
                body: title,
                isError: true,
            };
        else
            this.error = {
                title: title,
                body: body,
                isError: true,
            };
    },
    processException: function(e) {
        if(typeof(e) == "string")
            this.setError(e);
        else {
            if(e.response && e.response.data && e.response.data.message)
                this.setError(e.response.data.title, e.response.data.message);
            else if(e.response && e.response.status)
                this.setError(`Nieznany błąd ${e.response.status}`, e);
            // eslint-disable-next-line
            else if(e.toString() == "Error: Network Error")
                this.setError("Wystąpił błąd serwera", "Problem z połączeniem");
            else
                this.setError("Nieznany błąd", e.toString());
        }
        return this.error;
    },
}

export default ErrorHandler;