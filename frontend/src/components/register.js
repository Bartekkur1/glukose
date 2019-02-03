import React, { Component } from 'react';
import axios from 'axios';
import Error from './error';
import {server} from '../../package.json';
import { Link } from "react-router-dom";
import '../style.css';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            login: null,
            password: null,
            password2: null,
            email: null,
            approved: false
        }
    }

    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async submit(e) {
        e.preventDefault();
        if(!this.state.loading) {
            this.setState({error: null, loading: true});
            try {
                let res = await axios.post(server + "/api/register", {
                    login: this.state.login,
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword,
                    email: this.state.email,
                    approved: this.state.approved
                });
                res["title"] = "Rejestracja przebiegła pomyślnie";
                this.setState({error: res});
            }
            catch(e)
            {
                this.setState({error: e});
            }
            this.setState({loading: false});
        }
    }

    render() {
        if(this.state.loading) {
            var loading = (
                <div>
                    <img className="loading-gif" src={process.env.PUBLIC_URL + '/images/loading.gif'} alt="Loading"/>
                </div>
            )
        }
        else
            loading = "Zarejestruj";
        return (
            <div className="container-fluid p-0">
                <Error error={this.state.error} close={() => this.setState({error: null})}/>
                <div className="row login-panel mx-auto">
                    <div className="col-12 text-center">
                        <img className="logo" src={process.env.PUBLIC_URL + '/images/logo.svg'} alt="logo"/>
                        <form onSubmit={e => this.submit(e)}>
                            <input type="text" className="form-control mb-2" placeholder="Login" name="login" onChange={e => this.change(e)}/>
                            <input type="text" className="form-control mb-2" placeholder="Email" name="email" onChange={e => this.change(e)}/>
                            <input type="password" className="form-control mb-2" placeholder="Hasło" name="password" onChange={e => this.change(e)}/>
                            <input type="password" className="form-control mb-2" placeholder="Powtórz hasło" name="confirmPassword" onChange={e => this.change(e)}/>
                            <div className="form-check mb-3">
                                <input className="form-check-input" name="approved" type="checkbox" onChange={e => this.setState({approved: e.target.checked})}/>
                                <label className="form-check-label" htmlFor="gridCheck">
                                    Akceptuje regulamin
                                </label>
                            </div>
                            <button className="btn glukose-green btn-lg mb-3 btn-block" type="submit" value="Submit">{loading}</button>
                        </form>
                        <p className="font-weight-light">
                            Powrót do logowania <Link to="/login">tutaj!</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;