import React, { Component } from 'react';
import '../style.css';

class Form extends Component {
    render() {
        return (
            <div className="container-fluid h-100">
                <div className="row">
                    {this.props.error}
                </div>
                <div className="row h-100 pl-3 pr-3">
                    <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3 mx-auto login-background text-center my-auto">
                        <img className="logo mx-auto" src={process.env.PUBLIC_URL + '/images/logo.svg'} alt="logo"/>
                        {this.props.form}
                        {this.props.link}
                    </div>
                </div>
            </div>
        );
    }
}

export default Form;