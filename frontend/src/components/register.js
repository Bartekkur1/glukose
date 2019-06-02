import React, { Component } from 'react';
import Axios from 'axios';
import Error from './error';
import Form from './form';
import {server} from '../../package.json';
import { Link } from "react-router-dom";
import '../style.css';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
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
                let res = await Axios.post(server + "user/register", {
                    username: this.state.username,
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
                // console.log(e.response);
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
            <Form 
                form = {
                    <form onSubmit={e => this.submit(e)}>
                        <input type="text" className="form-control mb-2 mt-3" placeholder="Login" name="username" onChange={e => this.change(e)}/>
                        <input type="text" className="form-control mb-2" placeholder="Email" name="email" onChange={e => this.change(e)}/>
                        <input type="password" className="form-control mb-2" placeholder="Hasło" name="password" onChange={e => this.change(e)}/>
                        <input type="password" className="form-control mb-2" placeholder="Powtórz hasło" name="confirmPassword" onChange={e => this.change(e)}/>
                        <div className="form-check mb-3">
                            <input className="form-check-input" name="approved" type="checkbox" required={true} onChange={e => this.setState({approved: e.target.checked})}/>
                            <label className="form-check-label" htmlFor="gridCheck">
                                Akceptuję regulamin
                            </label>
                        </div>
                        <button className="btn glukose-main btn-lg mb-3 btn-block" type="submit" value="Submit">{loading}</button>
                        <Error error={this.state.error} close={() => this.setState({error: null})}/>
                    </form>
                }
                link = {
                    <div>
                        <p className="font-weight-light">
                            Powrót do logowania <Link to="/login">tutaj!</Link>
                        </p>
                    </div>
                }
            />
        );
    }
}

export default Register;