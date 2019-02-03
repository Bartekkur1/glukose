import React, { Component } from 'react';
import '../style.css';

class Form extends Component {
    render() {
        return (
            <div className="container-fluid p-0">
                {this.props.error}
                <div className="row m-0">
                    <img className="logo mx-auto" src={process.env.PUBLIC_URL + '/images/logo.svg'} alt="logo"/>
                </div>
                <div className="row login-panel mx-auto">
                    <div className="col-12 login-background text-center my-auto">
                        {this.props.form}
                        {this.props.link}
                    </div>
                </div>
            </div>
        );
    }
}

export default Form;