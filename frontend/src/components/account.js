import React, { Component } from 'react';
import Axios from 'axios';
import { server } from '../../package.json';
import Error from './error';

class Account extends Component {
    constructor(props) {
        super(props)

        this.state = {
            error: null,
            emailOrginal: null,
            loading: true,
            email: null,
            login: null
        }
    }

    async componentDidMount() {
        try {
            let res = await Axios.post(server + "/api/auth/check");
            this.setState({
                emailOrginal: res.data.email,
                email: res.data.email,
                login: res.data.login,
                password: null,
                confirmPassword: null,
                loading: false,
                change: false
            })
        }
        catch(e)
        {
            this.setState({error: e});
            this.setState({loading: false});
        }  
    }

    async submit(e) {
        e.preventDefault();
        if(!this.state.loading && this.state.change) {
            this.setState({error: null, loading: true});
            try {
                var payload = {}
                if(this.state.email !== this.state.emailOrginal)
                    payload["email"] = this.state.email
                if(this.state.password) {
                    payload["password"] = this.state.password;
                    payload["confirmPassword"] = this.state.confirmPassword
                }
                let res = await Axios.post(server + "/api/user", payload);
                console.log(res);
                res["title"] = "informacje zaktualizowano pomyślnie";
                this.setState({
                    error: res,
                    loading: false
                })
            }
            catch(e)
            {
                this.setState({error: e});
                this.setState({loading: false});
            }
        }
    }

    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        if(!this.state.change)
            this.setState({
                change: true
            });
    }

    render() {
        if(this.state.loading)
            return (                
            <div className="row m-0 h-100 glukose-off">
                <img className="mx-auto loading-page" src={process.env.PUBLIC_URL + '/images/loading-gray.svg'} alt="Loading"/>
            </div>)
        return (
            <div className="container-fluid sidebar-small mt-5">
                <div className="row">
                    <Error error={this.state.error} close={() => this.setState({error: false})} />
                    <div className="col-12 p-0">
                        <h1 className="text-center">Twoje konto</h1>
                    </div>
                </div>                
                <div className="row">
                    <div className="col-9 p-2 mx-auto userinfo-panel">
                        <div className="jumbotron pt-3 pb-3 mb-0">
                        <form onSubmit={e => this.submit(e)}>
                            <div className="form-group">
                                <label>Login:</label>
                                <input type="text" className="form-control"
                                readOnly={true} placeholder={this.state.login}/>
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input type="email" name="email" className="form-control"
                                value={this.state.email} onChange={e => this.change(e)}/>
                            </div>
                            <div className="form-group">
                                <label>Nowe hasło:</label>
                                <input type="text" name="password" className="form-control" onChange={e => this.change(e)}/>
                            </div>
                            <div className="form-group">
                                <label>Powtórz nowe hasło:</label>
                                <input type="text" name="confirmPassword" className="form-control" onChange={e => this.change(e)}/>
                            </div>
                            <button className="btn glukose-main btn-lg mb-3 btn-block" type="submit" value="Submit">Zapisz</button>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        ) 
    }
}

export default Account;