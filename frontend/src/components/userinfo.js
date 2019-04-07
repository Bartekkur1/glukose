import React, { Component } from 'react';
import Axios from 'axios';
import { server } from '../../package.json';
import Error from './error';

class UserInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            age: 0,
            gender: "Kobieta",
            height: 0,
            weight: 0,
            insulinType: "Humalog",
            dailyInsulinType: "Lantus",
            dailyInsulinAmount: 0,
            loading: false,
            error: null,
            change: false
        }
    }

    async componentDidMount() {
        try {
            let res = await Axios.get(server + "/api/userinfo");
            if(res.data) {
                this.setState({
                    age: res.data.age,
                    gender: res.data.gender,
                    height: res.data.height,
                    weight: res.data.weight,
                    insulinType: res.data.insulinType,
                    dailyInsulinType: res.data.dailyInsulinType,
                    dailyInsulinAmount: res.data.dailyInsulinAmount
                })
            }
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
                let res = await Axios.post(server + "/api/userinfo", {
                    age: this.state.age,
                    gender: this.state.gender,
                    height: this.state.height,
                    weight: this.state.weight,
                    insulinType: this.state.insulinType,
                    dailyInsulinType: this.state.dailyInsulinType,
                    dailyInsulinAmount: this.state.dailyInsulinAmount
                });
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
                        <h1 className="text-center">Dane użytkownika</h1>
                    </div>
                </div>                
                <div className="row">
                    <div className="col-12 p-2">
                        <h4 className="text-center">
                            Podane dane są potrzebne do lepszego przewidywania zachowań cukrzycy
                        </h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-9 p-2 mx-auto userinfo-panel">
                        <div className="jumbotron pt-3 pb-3 mb-0">
                        <form onSubmit={e => this.submit(e)}>
                            <div className="form-group">
                                <label>Wiek:</label>
                                <input type="number" name="age" className="form-control" placeholder={this.state.age} onChange={e => this.change(e)}/>
                            </div>
                            <div className="form-group">
                                <label>Płeć:</label>
                                <select name="gender" className="form-control" value={this.state.gender} onChange={e => this.change(e)}>
                                    <option value="Kobieta">Kobieta</option>
                                    <option value="Mężczyzna">Mężczyzna</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Wzrost:</label>
                                <input type="number" name="height" className="form-control" placeholder={this.state.height} onChange={e => this.change(e)}/>
                            </div>
                            <div className="form-group">
                                <label>Waga:</label>
                                <input type="number" name="weight" className="form-control" placeholder={this.state.weight} onChange={e => this.change(e)}/>
                            </div>
                            <div className="form-group">
                                <label>Typ insuliny:</label>
                                <select name="insulinType" className="form-control" value={this.state.insulinType} onChange={e => this.change(e)}>
                                    <option value="Humalog">Humalog</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Typ insuliny całodobowej:</label>
                                <select name="dailyInsulinType" className="form-control" value={this.state.dailyInsulinType} onChange={e => this.change(e)}>
                                    <option value="Lantus">Lantus</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Dawka insuliny calodobowej:</label>
                                <input type="number" name="dailyInsulinAmount" className="form-control" placeholder={this.state.dailyInsulinAmount} onChange={e => this.change(e)}/>
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

export default UserInfo;