import React, { Component } from 'react';
import '../style.css';

class Error extends Component {

    setError(title, body, status) {
        return (
            <div className={`alert alert-dismissible text-center ${status === 200 ? "alert-success" : "alert-danger"}`}>
                <button type="button" className="close" onClick={this.props.close}>&times;</button>
                <strong>{body}</strong>
            </div>
        )
    }

    processException(e) {
        if(e.toString() === "Error: Network Error")
            return this.setError("Wystąpił błąd serwera", "Problem z połączeniem", 400);
        else if(e.toString() === "Error: Request failed with status code 401")
            return this.setError("Wymagane zalogowanie", "Proszę się zalogować", 401);
        else if(e.response && e.response.data.error)
            return this.setError("Wystąpił błąd", e.response.data.error, e.response.status);
        else if(e.status === 200)
            return this.setError("", e.title, e.status);
        else if(e.data === "OK")    
            return this.setError("Sukces", e.title, e.status);
        else
            return this.setError("", "Wystąpił nieznany błąd", 400);
    }
    
    render() {
        if(this.props.error)
            return this.processException(this.props.error)
        return (null);
    }
}

export default Error;