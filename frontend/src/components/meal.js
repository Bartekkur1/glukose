import React, { Component } from 'react';
import {server} from '../../package.json';
import Axios from 'axios';

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
            mealParts: null
        };
    }
    
    async componentDidMount() {
        try {
            var meal = await Axios.get(server + "find_record/meal/id/" + this.state.id);
            var mealParts = await Axios.get(server + "mealpart/" + this.state.id);
            this.setState({kcal: meal.data.value.kcal, 
                fats: meal.data.value.fats, 
                carbohydrates: meal.data.value.carbohydrates, 
                date: meal.data.value.data, 
                mealParts: mealParts.data
            });
            this.setState({loading: false});
        }
        catch(e) {

        }
    }

    async updateMeal() {
        this.setState({loading: true});
        try {
            var res = await Axios.patch(server + "meal", {
                id: this.state.id,
                date: this.state.date,
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

    async updateMealPart(id, name, weight, kcal) {
        console.log(name);
        try {
            var res = await Axios.patch(server + "mealpart", {
                id: id,
                name: name,
                weight: weight,
                kcal: kcal
            });
            console.log(res);
        }
        catch(e) {
            console.log(e);
        }
    }

    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        if(this.state.loading)
            return (                
                <div className="row m-0 h-100 glukose-off">
                    <img className="mx-auto loading-page" src={process.env.PUBLIC_URL + '/images/loading-gray.svg'} alt="Loading"/>
                </div>)
        return(
            <div className="container">
                <div className="row">
                    <div className="col-9 mx-auto userinfo-panel box-shadow mt-5 mb-5 pl-0 pr-0 mr-0 ml-0">
                        <div className="jumbotron pt-3 pb-3 mb-0" style={{"backgroundColor": "white"}} onBlur={() => this.updateMeal()}>
                                <h1>Edycja rekordu id: {this.state.id}</h1>
                                <div className="form-group">
                                    <label>Data:</label>
                                    <input type="datetime-local" name="date" required={true} className="form-control" onChange={e => this.props.change(e)} />
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
                                    <div className="form-group">
                                        <label>Nazwa:</label>
                                        <input type="text" name="name" placeholder={mealPart.name} className="form-control" onChange={e => this.change(e)}
                                            onBlur={(e) => this.updateMealPart(mealPart.id, e.target.value, mealPart.weight, mealPart.kcal)}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Waga (g):</label>
                                        <input type="number" name="weight" placeholder={mealPart.weight} className="form-control" onChange={e => this.change(e)}
                                            onBlur={(e) => this.updateMealPart(mealPart.id, mealPart.name, e.target.value, mealPart.kcal)}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Ilość kalorii::</label>
                                        <input type="number" name="kcal" placeholder={mealPart.kcal} className="form-control" onChange={e => this.change(e)}
                                            onBlur={(e) => this.updateMealPart(mealPart.id, mealPart.name, mealPart.weight, e.target.value)}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }))}
            </div>
        )
    }
}

export default Meal;