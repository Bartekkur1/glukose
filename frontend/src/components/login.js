import React, { Component } from 'react';
import axios from 'axios';
import ErrorHandler from '../ErrorHandler';
import {server} from '../../package.json';
import { Link } from "react-router-dom";
import '../styles/login.css';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: "",
            password: "",
            loading: false,
            error: null
        }
    }

    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async submit(e) {
        this.setState({error: null, loading: true});
        e.preventDefault();
        await axios.post(server + "/api/auth", this.state)
        .then(res => {
            localStorage.setItem("Authorization", res.data.token);
        })
        .catch(e => {
            this.setState({"error": ErrorHandler.processException(e)});
        });
        this.setState({loading: false});
    }

    close(e) {
        e.preventDefault();
        this.setState({error: false});
    }

    render() {
        if(this.state.error) {
            var error = (
                <div className="error" onClick={e => this.close(e)}>
                    <h3>{this.state.error.title}</h3>
                    <p>{this.state.error.body}</p>
                </div>
            )
        }
        if(this.state.loading) {
            var loading = (
                <div>
                    <img className="loading-image" src={process.env.PUBLIC_URL + '/images/loading.gif'} alt="Loading"/>
                </div>
            )
        }
        else
            loading = "Zaloguj";
        return (
            <div className="container">
                <img className="logo" src={process.env.PUBLIC_URL + '/images/logo.svg'} alt="logo"/>
                <form onSubmit={e => this.submit(e)}>
                    <input type="text" placeholder="Login" name="login" onChange={e => this.change(e)}/>
                    <input type="password" placeholder="Hasło" name="password" onChange={e => this.change(e)}/>
                    <button className="submit" type="submit" value="Submit">{loading}</button>
                </form>
                {error}
                <p className="register">
                    Nie posiadasz konta? zarejestruj się <Link to="/register">tutaj!</Link>
                </p>
            </div>
        );
    }
}

export default Login;