import React, { Component } from 'react';
import axios from 'axios';
import ErrorHandler from '../ErrorHandler';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: "",
            password: "",
            error: null
        }
    }

    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submit(e) {
        this.setState({error: null});
        e.preventDefault();
        axios.post("http://localhost:8000/api/auth", this.state)
        .then(res => {
            localStorage.setItem("Authorization", res.data.token);
        })
        .catch(e => {
            this.setState({error: ErrorHandler(e)});
        });
    }

    render() {
        if(this.state.error) {
            var error = (
                <div>
                    <h5>{this.state.error.title}</h5>
                    <p>{this.state.error.message}</p>
                </div>
            )
        }
        return (
            <div>
                <h1>Login</h1>
                <form onSubmit={e => this.submit(e)}>
                    <label>Login: </label>
                    <input type="text" name="login" onChange={e => this.change(e)} />
                    <br/>
                    <label>Password: </label>
                    <input type="password" name="password" onChange={e => this.change(e)}/>
                    <br/>
                    <button type="submit" value="Submit">Submit</button>
                </form>
                <div>
                    {error}
                </div>
            </div>
        );
    }
}

export default Login;