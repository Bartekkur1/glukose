import React, { Component } from 'react';
import Axios from 'axios';
import Error from './error';
import Form from './form';
import {server} from '../../package.json';
import { Link } from "react-router-dom";
import '../style.css';

class PasswordRecovery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: null,
            email: null,
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
                let res = await Axios.post(server + "resetpassword", {
                    email: this.state.email
                });
                res["title"] = "Sukces";
                res["body"] = "Proszę sprawdzić pocztę email";
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
            loading = "Odzyskaj";
        return (
            <Form
                error = {<Error error={this.state.error} close={() => this.setState({error: null})}/>}
                form = {
                    <form onSubmit={e => this.submit(e)}>
                        <h5 className="font-weight-light mb-4 mt-3">
                            Na podany email zostanie wysłany link do wygenerowania nowego hasła.
                        </h5>
                        <input type="text" className="form-control form-control-lg mb-2" name="email" placeholder="Email" onChange={e => this.change(e)}/>
                        <button className="btn glukose-main btn-lg mb-3 btn-block" type="submit" value="Submit">{loading}</button>
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

export default PasswordRecovery;