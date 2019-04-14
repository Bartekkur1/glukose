import React, { Component } from 'react';
import Axios from 'axios';
import moment from 'moment';
import {server} from '../../package.json';
import now from 'moment';

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

    renderSearch() {
        if(this.state.type === "meal") {
            return (
                <div className="table-responsive row p-3 stats-info">
                    <table className="table text-center stats-table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Data</th>
                                <th scope="col">Kcal</th>
                                <th scope="col">Tłuszcze</th>
                                <th scope="col">Węglowodany</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.found.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{++index}</td>
                                        <td>{item.date}</td>
                                        <td>{item.kcal}</td>
                                        <td>{item.fats}</td>
                                        <td>{item.carbohydrates}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            );
        }
        else if(this.state.type === "sugar") {

        }
        else if(this.state.type === "dose") {

        }
    }

    async searchRecords() {
        this.setState({loading: true, found: null});
        try {
            let res = await Axios.get(server + "find_record/" + this.state.type + "/" + this.state.date);
            this.setState({found: res.data.values});
            console.log(res);
        }
        catch(e) {
            console.log(e);
        }
        this.setState({loading: false});
    }

    change(e) {
        this.setState({ 
            [e.target.name]: e.target.value
        });
        console.log(this.state);
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
                            <div className="home_box mt-5">
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