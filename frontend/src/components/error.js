import React, { Component } from 'react';
import '../styles/error.css';

class Error extends Component {
    constructor(props) {
        super(props);

    }

    setError(title, body) {
        return (
            <div>
                <h3>{title}</h3>
                <p>{body}</p>
            </div>
        )
    }

    processException(e) {
        if(typeof(e) == "string")
            return this.setError(e);
        else {
            if(e.response && e.response.data && e.response.data.message)
                return this.setError(e.response.data.title, e.response.data.message);
            else if(e.response && e.response.status)
                return this.setError(`Nieznany błąd ${e.response.status}`, e);
            // eslint-disable-next-line
            else if(e.toString() == "Error: Network Error")
                return this.setError("Wystąpił błąd serwera", "Problem z połączeniem");
            else
                return this.setError("Nieznany błąd", e.toString());
        }
    }
    
    render() {
        if(this.props.error)
            var error = this.processException(this.props.error)
        return (
            <div className="error">
                {error}
            </div>
        )
    }
}

export default Error;