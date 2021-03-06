import React, { Component } from 'react';
import Axios from 'axios';
import {server} from '../../package.json';
import Error from './error';
import { now } from 'moment';
import moment from 'moment';

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
            error: null,
            sugarAmount: 110,
            hightlight: null,
            insulinType: "Posiłek",
            mealParts: [],
            meal: {},
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
            api = "sugar";
        }
        else if(this.state.segment === "Insulina") {
            payload["amount"] = this.state.insulinAmount;
            payload["type"] = this.state.insulinType;
            api = "dose";
        }
        else if(this.state.segment === "Posiłek") {
            payload["kcal"] = this.state.kcal;
            payload["fats"] = this.state.fats;
            payload["carbohydrates"] = 100 - this.state.fats;

            api = "meal";
        }
        if(this.state.date) {
            payload["date"] = moment(this.state.date);
        }
        else 
        {
            payload["date"] = moment(now());
        }
        try {
            this.setState({loading: true});
            let res = await Axios.post(server + "new_record/" + api, payload);
            if(this.state.meal[0])
            {
                for(var i in this.state.meal)
                {
                    this.state.meal[i]["id"] = res.data["id"];
                    await Axios.post(server + "mealpart" , this.state.meal[i]);
                }
            }
            res["title"] = "Rekord dodany pomyślnie";
            this.setState({
                error: res,
                loading: false,
                meal: {}
            })
        }
        catch(e) {
            this.setState({
                error: e,
                loading: false
            })
        }
    }

    mealAppend(index, value, type) {
        var arr = this.state.meal;
        if(!arr[index])
            arr[index] = {}
        arr[index][type] = value;
        this.setState({meal: this.state.meal});
    }

    getMealPart(index) {
        return (
            <div key={index} className="pt-2">
                <div className="row pb-1">
                    <div className="col pr-0">
                        <input onChange={e => {this.mealAppend(index, e.target.value, "name")}} 
                            type="text" className="form-control" placeholder="Nazwa" required={true}/>
                    </div>
                    <div className="col-2 text-center">
                        <i className="fa-1x fa fa-trash" style={{"cursor": "pointer", "fontSize": "30px"}} aria-hidden="true" onClick={() => {
                            delete this.state.mealParts[index];
                            delete this.state.meal[index];
                            this.setState({mealParts: this.state.mealParts, meal: this.state.meal});
                        }}></i>
                    </div>
                </div>
                <div className="row pb-1">
                    <div className="col pr-1">
                        <input onChange={e => {this.mealAppend(index, e.target.value, "weight")}} 
                            type="number" className="form-control" placeholder="Waga (g)" required={true}/>
                    </div>
                    <div className="col pl-1">
                        <input onChange={e => {this.mealAppend(index, e.target.value, "kcal")}} 
                            type="number" className="form-control" placeholder="Kalorie" required={true}/>
                    </div>                    
                </div>
            </div>
        )
    }

    render() {
        if(this.state.loading)
            return (                
                <div className="row m-0 h-100 glukose-off">
                    <img className="mx-auto loading-page" src={process.env.PUBLIC_URL + '/images/loading-gray.svg'} alt="Loading"/>
                </div>)
        return (
            <div className="container-fluid sidebar-small h-100">
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-xl-3 record-panel p-0 mt-5 mx-auto" >
                            <div className="jumbotron mt-0 mb-0 p-4 ml-3 mr-3 box-shadow" style={{"backgroundColor": "white", "borderRadius": "5px", "minWidth": 320}}>
                                <div className="row text-center">
                                    <RecordTitle name="Cukier" segment={this.state.segment} 
                                    segmentChange={() => this.setState({segment: "Cukier"})} />
                                    <RecordTitle name="Insulina"  segment={this.state.segment} 
                                    segmentChange={() => this.setState({segment: "Insulina"})} />
                                    <RecordTitle name="Posiłek" segment={this.state.segment} 
                                    segmentChange={() => this.setState({segment: "Posiłek"})} />
                                </div>  
                                <div className="row">
                                    <div className="col-12 p-0 pt-2 mx-auto record-panel">
                                    <Error error={this.state.error} close={() => this.setState({error: false})} />
                                    {this.state.segment === "Cukier" ? 
                                    <RecordForm 
                                    formSubmit={(e) => this.submit(e)}
                                    change={(e) => this.change(e)}
                                    form={(
                                        <div className="form-group">
                                            <label>Ilość cukru:</label>
                                            <input type="number" name="sugarAmount" className="form-control" style={this.state.hightlight === "amount" ? {"borderColor": "Red"} : {}}
                                            style={{"fontSize": "60px"}}
                                            placeholder={this.state.sugarAmount} onChange={e => this.change(e)}/>
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
                                                <input type="number" name="insulinAmount" className="form-control" onChange={e => this.change(e)} style={this.state.hightlight === "amount" ? {"borderColor": "Red"} : {}} 
                                                style={{"fontSize": "60px"}} placeholder={5}/>
                                            </div>
                                            <div className="form-group pt-2">
                                                <label>Typ insuliny:</label>
                                                <select name="insulinType" className="form-control" onChange={e => this.change(e)}>
                                                    <option value="Posiłek">Posiłek</option>
                                                    <option value="Korekta">Korekta</option>
                                                </select>
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
                                                <input type="number" name="kcal" className="form-control" onChange={e => this.change(e)} placeholder={450} 
                                                    style={this.state.hightlight === "kcal" ? {"borderColor": "Red"} : {}} style={{"fontSize": "60px"}} />
                                            </div>
                                            <div className="form-group">
                                                <label>Procentowa zawartość białek i tłuszczy:</label>
                                                <input type="number" name="fats" min="0" max="100" value={this.state.fats} className="form-control" onChange={e => this.change(e)} 
                                                style={{"fontSize": "30px"}}/>
                                            </div>
                                            <div className="form-group">
                                                <label>Procentowa zawartość węglowodanów:</label>
                                                <input type="number" name="carbohydrates" readOnly={true} value={100 - this.state.fats} className="form-control" onChange={e => this.change(e)}
                                                style={{"fontSize": "30px"}}/>
                                            </div>
                                            <div className="form-group">
                                                <label>Skład:</label>
                                                {this.state.mealParts.map((element) => {
                                                    return element;
                                                })}<br/>
                                                <div className="text-center">
                                                    <i className="fa fa-2x fas fa-plus" style={{"cursor": "pointer"}} onClick={() => {
                                                        var arr = this.state.mealParts;
                                                        arr.push(this.getMealPart(arr.length));
                                                        this.setState({mealParts: arr});
                                                    }}></i>
                                                </div>
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