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
            error: null,
            hightlight: null
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
            this.setState({error: null, loading: true, hightlight: null});
            try {
                let res = await Axios.post(server + "auth/login", {
                    username: this.state.login,
                    password: this.state.password
                });
                console.log(res);
                localStorage.setItem("Authorization", res.data.token);
                this.props.history.push('/');
            }
            catch(e)
            {
                this.setState({error: e});
                if(e.response)
                    if(e.response.data.name)
                        this.setState({"hightlight": e.response.data.name});
                this.setState({loading: false});
            }
        }
    }

    componentDidMount() {
        if(localStorage.getItem("Authorization"))
            this.props.history.push('/');
        Axios.defaults.headers.common['Authorization'] = null;
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
                form = {
                    <form onSubmit={e => this.submit(e)}>
                        <input type="text" className="form-control mb-2 mt-3" style={this.state.hightlight === "username" ? {"borderColor": "Red"} : {}} 
                            placeholder="Login" name="login" onChange={e => this.change(e)}/>
                        <input type="password" className="form-control mb-3" style={this.state.hightlight === "password" ? {"borderColor": "Red"} : {}} 
                            placeholder="Hasło" name="password" onChange={e => this.change(e)}/>
                        <button className="btn glukose-main btn-lg mb-3 btn-block" type="submit" value="Submit">{loading}</button>
                        <Error error={this.state.error} close={() => this.setState({error: null})}/>
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