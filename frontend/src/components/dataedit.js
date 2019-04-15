import React, { Component } from 'react';
import Axios from 'axios';
import moment from 'moment';
import {server} from '../../package.json';
import now from 'moment';
import { Redirect } from "react-router-dom";

class DataEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment(now()).format("YYYY-MM-DD"),
            type: "sugar",
            loading: false,
            found: null,
        }
    }

    redirect(id) {
        var link = "/" + this.state.type + "/" + id
        this.setState({
            redirect: <Redirect to={link} />
        })
    }

    async deleteRecord(id) {
        try {
            let res = await Axios.get(server + "delete_record/" + this.state.type + "/" + id);
            delete this.state.found[id];
            this.setState({found: this.state.found});
        }
        catch(e) {
            console.log(e);
        }
    }

    renderSearch() {
        return (
            <div className="table-responsive row p-3 stats-info">
                {this.state.redirect}
                <table className="table text-center stats-table">
                    <thead>
                        <tr>
                            <th scope="col">Identyfikator</th>
                            <th scope="col">Data</th>
                            <th scope="col">#</th>
                            <th scope="col">#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.found.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{++index}</td>
                                    <td>{item.date}</td>
                                    <td><input type="button" className="btn glukose-main" value="Edytuj" onClick={() => this.redirect(item.id)}/></td>
                                    <td><input type="button" className="btn btn-danger" value="Usuń" onClick={() => this.deleteRecord(item.id)}/></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    async searchRecords() {
        this.setState({loading: true, found: null});
        try {
            let res = await Axios.get(server + "find_record/" + this.state.type + "/" + this.state.date + "/" + moment(this.state.date).add(1, "days").format("YYYY-MM-DD"));
            var arr = [];
            res.data.values.map((value) => {
                arr[value.id] = value;
            });
            this.setState({found: arr});
            this.renderSearch();
        }
        catch(e) {
            console.log(e);
        }
        this.setState({loading: false});
    }

    change(e) {
        if(e.target.name === "type")
            this.setState({found: null});
        this.setState({ 
            [e.target.name]: e.target.value
        });
    }

    render() {
        return(
            <div className="container-fluid sidebar-small h-100">
                <div className="row text-center p-2">
                    <div className="col-sm-12 col-lg-9 col-md-9 col-xl-4 mx-auto mt-3">
                        <div className="home_box p-4 mt-5">
                            {this.state.loading ? 
                                <div className="row m-0 h-100">
                                    <img className="mx-auto loading-page" src={process.env.PUBLIC_URL + '/images/loading-gray.svg'} alt="Loading"/>
                                </div>
                            :
                            <div>
                                <h2>
                                    Znajdz rekord
                                </h2>
                                <span>Z dnia:</span>
                                <input type="date" name="date" className="stats-input" value={this.state.date}
                                    onChange={e => {this.change(e)}} />
                                <br/>
                                <div className="col-6 mx-auto">
                                    <select className="form-control" name="type" defaultValue={this.state.type}
                                        onChange={e => {this.change(e)}}>
                                        <option value="sugar">Cukier</option>
                                        <option value="meal">Posiłek</option>
                                        <option value="dose">Insulina</option>
                                    </select>
                                    <input type="button" value="Szukaj" className="btn glukose-main mt-3" 
                                        onClick={() => {this.searchRecords()}}/>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-lg-9 col-md-9 col-xl-12 mx-auto mt-3">
                        {this.state.found ? 
                            <div className=" mt-5">
                                {this.renderSearch()}
                            </div>
                        : ""}
                    </div> 
                </div>
            </div>
        )
    }
}

export default DataEdit;