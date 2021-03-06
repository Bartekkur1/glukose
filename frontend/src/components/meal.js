import React, { Component } from 'react';
import {server} from '../../package.json';
import Axios from 'axios';
import moment from 'moment';

class Meal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            id: this.props.match.params.id,
            date: null,
            kcal: null,
            fats: null,
            carbohydrates: null,
            mealParts: null,
            redirect: null,
        };
    }
    
    async componentDidMount() {
        try {
            var meal = await Axios.get(server + "find_record/meal/id/" + this.state.id);
            var mealParts = await Axios.get(server + "mealpart/" + this.state.id);
            var arr = [];
            mealParts.data.map((value) => {
                return arr[value.id] = value;
            });
            this.setState({kcal: meal.data.value.kcal, 
                fats: meal.data.value.fats, 
                carbohydrates: meal.data.value.carbohydrates, 
                date: meal.data.value.date, 
                mealParts: arr
            });
            this.setState({loading: false});
        }
        catch(e) {
            console.log(e);
        }
    }

    async updateMeal() {
        this.setState({loading: true});
        try {
            await Axios.patch(server + "update_record/meal", {
                id: this.state.id,
                date: moment(this.state.date),
                kcal: this.state.kcal,
                fats: this.state.fats,
                carbohydrates: this.state.carbohydrates
            })
        }
        catch(e) {
            console.log(e);
        }
        this.setState({loading: false});
    }

    async newMealPart() {
        this.setState({loading: true})
        try {
            await Axios.post(server + "mealpart", {
                id: this.state.id
            });
        }
        catch(e) {
            console.log(e);
        }
        try {
            var mealParts = await Axios.get(server + "mealpart/" + this.state.id);
            var arr = [];
            mealParts.data.map((value) => {
                return arr[value.id] = value;
            });
            this.setState({
                mealParts: arr
            });
        }
        catch(e) {
            console.log(e);
        }
        this.setState({loading: false})
    }

    async updateMealPart(id) {
        this.setState({loading: true});
        try {
            await Axios.patch(server + "mealpart", {
                id: id,
                name: this.state.mealParts[id].name,
                weight: this.state.mealParts[id].weight,
                kcal: this.state.mealParts[id].kcal,
            });
        }
        catch(e) {
            console.log(e);
        }
        this.setState({loading: false});
    }

    async mealPartDelete(id) {
        try {
            this.setState({
                loading: true
            });
            await Axios.delete(server + "mealpart/" + id);
            delete this.state.mealParts[id];
            this.setState({loading: false, mealParts: this.state.mealParts});
        }
        catch(e) {
            console.log(e);
        }
    }

    mealPartModelChange(e, id)
    {
        var localMP = this.state.mealParts;
        if(e.target.name == "name")
            localMP[id].name = e.target.value;
        if(e.target.name == "weight")
            localMP[id].weight = e.target.value;
        if(e.target.name == "kcal")
            localMP[id].kcal = e.target.value;
        this.setState({mealParts: localMP});
    }

    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        if(this.state.redirect)
            return (
                <div>
                    {this.state.redirect}
                </div>);
        if(this.state.loading)
            return (                
                <div className="row m-0 h-100 glukose-off">
                    <img className="mx-auto loading-page" src={process.env.PUBLIC_URL + '/images/loading-gray.svg'} alt="Loading"/>
                </div>)
        return(
            <div className="container">
                <div className="row">
                    <div className="col-9 mx-auto userinfo-panel box-shadow mt-5 mb-5 pl-0 pr-0 mr-0 ml-0">
                        <div className="jumbotron pt-3 pb-3 mb-0" style={{"backgroundColor": "white"}} >
                                <h1>Edycja rekordu id: {this.state.id}</h1>
                                <div className="form-group">
                                    <label>Data:</label>
                                    <input type="datetime-local" name="date" defaultValue={moment(this.state.date).format("YYYY-MM-DDTHH:mm")} required={true} className="form-control" onChange={e => this.change(e)} />
                                </div>
                                <div className="form-group">
                                    <label>Ilość kalorii:</label>
                                    <input type="number" name="kcal" placeholder={this.state.kcal} className="form-control" onChange={e => this.change(e)}/>
                                </div>
                                <div className="form-group">
                                    <label>Procentowa zawartość tłuszczy:</label>
                                    <input type="number" name="fats" placeholder={this.state.fats} className="form-control" onChange={e => this.change(e)}/>
                                </div>
                                <div className="form-group">
                                    <label>Procentowa zawartość węglowodanów:</label>
                                    <input type="number" name="carbohydrates" readOnly={true} value={100 - this.state.fats} className="form-control" onChange={e => this.change(e)}/>
                                </div>
                                <button className="btn glukose-main btn-lg mt-3 mb-3 btn-block" type="submit" value="Submit" onClick={() => this.updateMeal()}>Zapisz</button>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <h1>Skład:</h1>
                </div>
                {this.state.mealParts.map(((mealPart, index) => {
                    return (
                        <div key={index} className="row">
                            <div className="col-9 mx-auto userinfo-panel box-shadow mt-1 mb-5 pl-0 pr-0 mr-0 ml-0">
                                <div className="jumbotron pt-3 pb-3 mb-0" style={{"backgroundColor": "white"}} >
                                    <div className="text-right">
                                        <i className="fa fa-2x fa-trash" onClick={() => {this.mealPartDelete(mealPart.id)}} />
                                    </div>
                                    <div className="form-group">
                                        <label>Nazwa:</label>
                                        <input type="text" name="name" placeholder={mealPart.name} className="form-control" onChange={e => this.mealPartModelChange(e, mealPart.id)}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Waga (g):</label>
                                        <input type="number" name="weight" placeholder={mealPart.weight} className="form-control" onChange={e => this.mealPartModelChange(e, mealPart.id)}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Ilość kalorii:</label>
                                        <input type="number" name="kcal" placeholder={mealPart.kcal} className="form-control" onChange={e => this.mealPartModelChange(e, mealPart.id)}/>
                                    </div>
                                    <button className="btn glukose-main btn-lg mt-3 mb-3 btn-block" type="submit" value="Submit" 
                                        onClick={() => this.updateMealPart(mealPart.id)}>Zapisz</button>
                                </div>
                            </div>
                        </div>
                    )
                }))}
                <div className="text-center">
                <i className="fa fa-3x fas fa-plus"
                    onClick={() => this.newMealPart()}/>
                </div>
            </div>
        )
    }
}

export default Meal;