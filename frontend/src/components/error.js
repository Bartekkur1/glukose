import React, { Component } from 'react';
import '../style.css';

class Error extends Component {

    setError(title, body, status) {
        return (
            <div className={`alert alert-dismissible text-center ${status === 200 ? "alert-success" : "alert-danger"}`}>
                <button type="button" className="close" onClick={this.props.close}>&times;</button>
                <strong>{title}</strong> {body}
            </div>
        )
    }

    processException(e) {
        if(typeof(e) == "string")
            return this.setError(e);
        else {
            if(e.status && e.status === 200)
                    return this.setError(e.title, "", 200);
            else if(e.response && e.response.data && e.response.data.message)
                return this.setError(e.response.data.title, e.response.data.message, e.response.status);
            else if(e.response && e.response.status)
                return this.setError(`Nieznany błąd ${e.response.status}`, e, e.response.status);
            // eslint-disable-next-line
            else if(e.toString() == "Error: Network Error")
                return this.setError("Wystąpił błąd serwera", "Problem z połączeniem", e.response.status);
            else
                return this.setError("Nieznany błąd", e.toString(), e.response.status);
        }
    }
    
    render() {
        if(this.props.error)
            var error = this.processException(this.props.error)
        return (
            <div>
                {error}
            </div>
        )
    }
}

export default Error;