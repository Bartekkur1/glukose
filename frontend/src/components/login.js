import React, { Component } from 'react';
import Axios from 'axios';
import Error from './error';
import {server} from '../../package.json';
import { Link } from "react-router-dom";
import Form from './form';
import '../style.css';

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
                let res = await Axios.post(server + "/api/auth", {
                    login: this.state.login,
                    password: this.state.password
                });
                localStorage.setItem("Authorization", res.data.token);
            }
            catch(e)
            {
                this.setState({error: e});
            }
            this.setState({loading: false});
        }
    }

    componentDidMount() {
        if(this.props.location.state)
            this.setState({error: this.props.location.state.error});
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
            loading = "Zaloguj";

        return (
            <Form
                error = {<Error error={this.state.error} close={() => this.setState({error: null})}/>}
                form = {
                    <form onSubmit={e => this.submit(e)}>
                        <input type="text" className="form-control mb-2 mt-3" placeholder="Login" name="login" onChange={e => this.change(e)}/>
                        <input type="password" className="form-control mb-3" placeholder="Hasło" name="password" onChange={e => this.change(e)}/>
                        <button className="btn glukose-green btn-lg mb-3 btn-block" type="submit" value="Submit">{loading}</button>
                    </form>
                }
                link = {
                    <div>
                        <p className="font-weight-light">
                            Nie posiadasz konta? zarejestruj się <Link to="/register">tutaj!</Link>
                        </p>
                        <p className="font-weight-light">
                            Zapomniałeś hasła? odzyskaj je <Link to="/password_recovery">tutaj!</Link>
                        </p>
                    </div>
                }
            />
        );
    }
}

export default Login;