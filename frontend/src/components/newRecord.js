import React, { Component } from 'react';
import Axios from 'axios';
import {server} from '../../package.json';
import Error from './error';

class RecordTitle extends Component {
    render() {
        return (
            <div className="col-4 p-0 record-header" onClick={() => this.props.segmentChange()}
            style={this.props.segment === this.props.name ? {backgroundColor: "#e9ecef"} : {backgroundColor: "#64e864"}}>
                {this.props.name}
            </div>        
        )
    }
}

class RecordForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dateToday: true,
            carbohydrates: this.props.carbohydrates,
        }
    }

    render() {
        return (
            <form onSubmit={e => this.props.formSubmit(e)}>
                {this.props.form}
                <div className="form-check text-center">
                    <input defaultChecked={true} onChange={() => this.setState({dateToday: !this.state.dateToday})} 
                    type="checkbox" className="form-check-input record-checkbox" id="date" />
                    <label className="form-check-label">Teraz</label>
                </div>
                {!this.state.dateToday ? (
                <div className="form-group">
                    <label>Data i godzina:</label>
                    <input type="datetime-local" name="date" required={true} className="form-control" onChange={e => this.props.change(e)}/>
                </div>                    
                ) : null}
                <button className="btn glukose-main btn-lg mt-3 mb-3 btn-block" type="submit" value="Submit">Zapisz</button>
            </form>
        )
    }
}

class NewRecord extends Component {
    constructor(props) {
        super(props)

        this.state = {
            segment: "Cukier",
            fats: 0,
            carbohydrates: 0,
            loading: false,
            error: null
        }
    }

    change(e) {
        if(e.target.name === "fats" && e.target.value > 100)
            return false;
        this.setState({ 
            [e.target.name]: e.target.value
        });
    }

    async submit(e) {
        e.preventDefault();
        if(this.state.loading)
            return false;
        var payload = {};
        var api = "";
        if(this.state.segment === "Cukier") {
            payload["amount"] = this.state.sugarAmount;
            api = "/api/sugar";
        }
        else if(this.state.segment === "Insulina") {
            payload["amount"] = this.state.insulinAmount;
            payload["type"] = "Humalog";
            api = "/api/dose";
        }
        else if(this.state.segment === "Posiłek") {
            payload["kcal"] = this.state.kcal;
            payload["fats"] = this.state.fats;
            payload["carbohydrates"] = 100 - this.state.fats;
            api = "/api/meal";
        }
        if(this.state.date) {
            var d = new Date(this.state.date);
            d.setTime(d.getTime() + d.getTimezoneOffset() * -1 * 60 * 1000);
            payload["date"] = d.toString();
        }
        try {
            let res = await Axios.post(server + api, payload);
            res["title"] = "rekord dodany pomyślnie";
            this.setState({
                error: res,
                loading: false
            })
        }
        catch(e) {
            this.setState({
                error: e,
                loading: false
            })
        }
    }

    render() {
        return (
            <div className="container-fluid sidebar-small h-100">
                <div className="row">
                <Error error={this.state.error} close={() => this.setState({error: false})} />
                    <div className="col-12 text-center mt-5">
                        <h3>Tutaj możesz dodać nowy rekord</h3>
                        <h5>Dodane rekordy można zobaczyć w zakładce statystyki</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-9 mx-auto record-panel">
                        <div className="jumbotron pt-0 mt-5 pl-3 pr-3 pb-3 mb-0">
                            <div className="row text-center">
                                <RecordTitle name="Cukier" segment={this.state.segment} 
                                segmentChange={() => this.setState({segment: "Cukier"})} />
                                <RecordTitle name="Insulina"  segment={this.state.segment} 
                                segmentChange={() => this.setState({segment: "Insulina"})} />
                                <RecordTitle name="Posiłek" segment={this.state.segment} 
                                segmentChange={() => this.setState({segment: "Posiłek"})} />
                            </div>
                            <div className="row">
                                <div className="col-12 p-2 mx-auto record-panel">
                                {this.state.segment === "Cukier" ? 
                                <RecordForm 
                                formSubmit={(e) => this.submit(e)}
                                change={(e) => this.change(e)}
                                form={(
                                    <div>
                                        <div className="form-group">
                                            <label>Ilość cukru:</label>
                                            <input type="number" name="sugarAmount" className="form-control" onChange={e => this.change(e)}/>
                                        </div>
                                    </div>
                                )} /> : null}
                                {this.state.segment === "Insulina" ? 
                                <RecordForm
                                formSubmit={(e) => this.submit(e)}
                                change={(e) => this.change(e)}
                                form={(
                                    <div>
                                        <div className="form-group">
                                            <label>Ilość j. insuliny:</label>
                                            <input type="number" name="insulinAmount" className="form-control" onChange={e => this.change(e)}/>
                                        </div>
                                    </div>
                                )}
                                /> : null}
                                {this.state.segment === "Posiłek" ? 
                                <RecordForm 
                                formSubmit={(e) => this.submit(e)}
                                change={(e) => this.change(e)}
                                form={(
                                    <div>
                                        <div className="form-group">
                                            <label>Ilość kalorii:</label>
                                            <input type="number" name="kcal" className="form-control" onChange={e => this.change(e)}/>
                                        </div>
                                        <div className="form-group">
                                            <label>Procentowa zawartość białek i tłuszczy:</label>
                                            <input type="number" name="fats" min="0" max="100" value={this.state.fats} className="form-control" onChange={e => this.change(e)}/>
                                        </div>
                                        <div className="form-group">
                                            <label>Procentowa zawartość węglowodanów:</label>
                                            <input type="number" name="carbohydrates" readOnly={true} value={100 - this.state.fats} className="form-control" onChange={e => this.change(e)}/>
                                        </div>
                                    </div>
                                )}
                                /> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewRecord;