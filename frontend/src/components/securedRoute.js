import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import {server} from '../../package.json';
import { Redirect } from "react-router-dom";

class SecuredRoutes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null
        }
    }

    async componentDidMount() {
        let jwt = localStorage.getItem("Authorization");
        if(!jwt)
            jwt = "";
        try {
            let res = await Axios.post(server + "/api/auth/check", {}, {
                headers: {
                    authorization: "Bearer " + jwt
                }
            })
            this.setState({user: res.data});
        }
        catch(e)
        {
            console.log(e);
            this.setState({error: <Redirect to={{
                pathname: "/login",
                state: { error: {
                    response: {
                        data: {
                            title: e.response.data.title,
                            message: e.response.data.message,
                            status: 401
                        }
                    }
                }}
            }} />});
        }
    }

    render() {
        if(this.state.error)
            return (this.state.error)
        if(!this.state.user)
            return (
                <div className="row m-0 h-100 glukose-green">
                    <img className="mx-auto my-auto" src={process.env.PUBLIC_URL + '/images/loading.gif'} alt="Loading"/>
                </div>
            )
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

export default withRouter(SecuredRoutes);