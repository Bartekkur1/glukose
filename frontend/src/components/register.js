import React, { Component } from 'react';
import axios from 'axios';
import {server} from '../../package.json';
import { Link } from "react-router-dom";
import Error from './error';
import '../styles/register.css';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            login: null,
            password: null,
            password2: null,
            email: null
        }
    }

    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submit() {
        //todo axios
    }

    render() {
        if(this.state.loading) {
            var loading = (
                <div>
                    <img className="loading-image" src={process.env.PUBLIC_URL + '/images/loading.gif'} alt="Loading"/>
                </div>
            )
        }
        else
            loading = "Zarejestruj";
        return (
            <div>
                <Error error={this.state.error}/>
                <div className="container">
                    <img className="logo" src={process.env.PUBLIC_URL + '/images/logo.svg'} alt="logo"/>
                    <form onSubmit={e => this.submit(e)}>
                        <input type="text" placeholder="Login" name="login" onChange={e => this.change(e)}/>
                        <input type="email" placeholder="Email" name="email" onChange={e => this.change(e)}/>
                        <input type="password" placeholder="Hasło" name="password" onChange={e => this.change(e)}/>
                        <input type="password" placeholder="Powtórz hasło" name="password2" onChange={e => this.change(e)}/>
                        <button className="submit" type="submit" value="Submit">{loading}</button>
                    </form>
                    <p className="register">
                        Powrót do logowania <Link to="/password_recovery">tutaj!</Link>
                    </p>
                </div>
            </div>
        );
    }
}

export default Register;