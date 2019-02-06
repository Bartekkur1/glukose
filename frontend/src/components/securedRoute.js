import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import {server} from '../../package.json';
import { Redirect } from "react-router-dom";

class SecuredRoutes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
            user: null
        }
    }

    async componentDidMount() {
        let jwt = localStorage.getItem("Authorization");
        if(!jwt)
            jwt = "";
        Axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
        try {
            let res = await Axios.post(server + "/api/auth/check");
            this.setState({user: res.data});
        }
        catch(e)
        {
            console.log(e);
            localStorage.clear();
            this.setState({redirect: <Redirect to={{
                pathname: "/login"}}/>})
        }
    }

    render() {
        if(this.state.redirect)
            return this.state.redirect;
        if(!this.state.user)
            return (
                <div className="row m-0 h-100 glukose-main">
                    <img className="mx-auto loading-page" src={process.env.PUBLIC_URL + '/images/loading.gif'} alt="Loading"/>
                </div>
            )
        return this.props.children;
    }
}

export default withRouter(SecuredRoutes);