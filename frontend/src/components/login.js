import React, { Component } from 'react';
import axios from 'axios';
import Error from './error';
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
        e.preventDefault();
        if(!this.state.loading) {
            this.setState({error: null, loading: true});
            try {
                let res = await axios.post(server + "/api/auth", this.state);
                localStorage.setItem("Authorization", res.data.token);
            }
            catch(e)
            {
                this.setState({error: e});
                setTimeout(() => this.setState({error: null}), 3000);
            }
            this.setState({loading: false});
        }
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
            loading = "Zaloguj";
        return (
            <div>
                <Error error={this.state.error}/>
                <div className="container">
                    <img className="logo" src={process.env.PUBLIC_URL + '/images/logo.svg'} alt="logo"/>
                    <form onSubmit={e => this.submit(e)}>
                        <input type="text" placeholder="Login" name="login" onChange={e => this.change(e)}/>
                        <input type="password" placeholder="Hasło" name="password" onChange={e => this.change(e)}/>
                        <button className="submit" type="submit" value="Submit">{loading}</button>
                    </form>
                    <p className="register">
                        Nie posiadasz konta? zarejestruj się <Link to="/register">tutaj!</Link>
                    </p>
                    <p className="register">
                        Zapomniałeś hasła? odzyskaj je <Link to="/password_recovery">tutaj!</Link>
                    </p>
                </div>
            </div>
        );
    }
}

export default Login;