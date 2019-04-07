import React, { Component } from 'react';
import Axios from 'axios';
import {server} from '../../package.json';
import Error from "./error";
import { Line, Doughnut } from 'react-chartjs-2';
import { now } from 'moment';
import moment from 'moment';

class DailyStatistics extends Component {
    constructor(props) {
        super(props);
        // console.log(moment(now()).set({hours: 24, minute:0, seconds: 0}).format("YYYY-MM-DD HH:mm:ss"));
        this.state = {
            // console.log(moment(now()).format("YYYY-MM-DD"));
            date: moment(now()).format("YYYY-MM-DD"),
            range: moment(now()).format("YYYY-MM-DD"),
            loading: false,
            miniloading: false,
            sugars: [],
            doses: [],
            meals: [],
            avg: {
                sugar: 0,
                dose: 0,
                meal: 0
            },
            max: {
                sugar: {
                    value: 0
                },
                dose: {
                    value: 0
                },
                meal: {
                    value: 0
                },
            },
            min: {
                sugar: {
                    value: 0
                },
                dose: {
                    value: 0
                },
                meal: {
                    value: 0
                },
            },
            donut: {
                low: 0,
                mid: 0,
                high: 0
            },
            error: null
        }
    }

    change(e) {
        if(e.target.value)
            this.setState({
                [e.target.name]: e.target.value
            });
        else
            this.setState({
                date: this.state.backupDate
            })
        if(e.target.name === "date" || e.target.name === "range")
            this.getData();
    }

    async mealUpdate(type, value, id) {
        var data = {}
        if(type === "kcal")
            data["kcal"] = value
        if(type === "fats")
            data["fats"] = value
        if(type === "carbohydrates")
            data["carbohydrates"] = value
        data["id"] = id
        try {
            await Axios.patch(server + "meal", data);
            this.getData();
        }
        catch(e) {
            this.setState({
                error: e,
            })
        }
    }

    async doseUpdate(amount, type, id) {
        try {
            await Axios.patch(server + "dose", {
                amount: amount,
                type: type,
                id: id
            });
            this.getData();
        }
        catch(e) {
            this.setState({
                error: e,
            })
        }
    }

    async doseDelete(id) {
        try {
            await Axios.delete(server + "delete_record/dose/" + id);
            this.getData();
        }
        catch(e) {
            this.setState({
                error: e,
            })
        }
    }

    async sugarUpdate(amount, id) {
        try {
            await Axios.patch(server + "sugar", {
                amount: amount,
                id: id
            });
            this.getData();
        }
        catch(e) {
            this.setState({
                error: e,
            })
        }
    }

    async sugarDelete(id) {
        try {
            await Axios.delete(server + "delete_record/sugar/" + id);
            this.getData();
        }
        catch(e) {
            this.setState({
                error: e,
            })
        }
    }

    async getData() {
        this.setState({
            miniloading: true
        })
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            let dose = await Axios.get(server + "find_record/dose/" + this.state.date + "/" + moment(this.state.range).add("days", 1).format("YYYY-MM-DD"));
            let meal = await Axios.get(server + "find_record/meal/" + this.state.date + "/" + moment(this.state.range).add("days", 1).format("YYYY-MM-DD"));
            let sugar = await Axios.get(server + "find_record/sugar/" + this.state.date + "/" + moment(this.state.range).add("days", 1).format("YYYY-MM-DD"));
            this.setState({
                sugars: sugar.data.values,
                doses: dose.data.values,
                meals: meal.data.values,
                avg: {
                    sugar: sugar.data.avg,
                    dose: dose.data.avg,
                    meal: meal.data.avg
                },
                min: {
                    sugar: sugar.data.min,
                    dose: dose.data.min,
                    meal: meal.data.min
                },
                max: {
                    sugar: sugar.data.max,
                    dose: dose.data.max,
                    meal: meal.data.max
                },
            });
            var low = 0;
            var mid = 0;
            var high = 0;
            this.state.sugars.forEach(record => {
                if(record.amount < 70 && record.amount > 0)
                    low++;
                if(record.amount < 140 && record.amount > 70)
                    mid++;
                if(record.amount > 140)
                    high++;
            });
            this.setState({
                donut: {
                    low: low,
                    mid: mid,
                    high: high
                }
            });
        }
        catch(e)
        {
            // console.log(e.response);
            this.setState({error: e});
            this.setState({loading: false});
        }  
        this.setState({
            loading: false,
            miniloading: false
        });
    }

    sumArray(arr)
    {
        var sum = 0;
        arr.forEach(element => {
            if(element.amount)
                sum = sum + element.amount
            if(element.kcal)
                sum = sum + element.kcal
        });
        return sum;
    }

    componentDidMount() {
        this.getData();
    }
    
    render() {
        if(this.state.loading)
            return (                
                <div className="row m-0 h-100 glukose-off">
                    <img className="mx-auto loading-page" src={process.env.PUBLIC_URL + '/images/loading-gray.svg'} alt="Loading"/>
                </div>)
        return (
            <div className="container-fluid sidebar-small mb-5">
                <div className="row">
                    <Error error={this.state.error} close={() => this.setState({error: false})} />
                </div>
                    <h1 className="pt-4 text-center">STATYSTYKA DZIENNA</h1>
                {this.state.miniloading ?
                        <div className="row m-0 h-100">
                            <img className="mx-auto loading-page" src={process.env.PUBLIC_URL + '/images/loading-gray.svg'} alt="Loading"/>
                        </div>
                    :
                <div>
                <div className="row">
                    <div className="col-12 p-4 mx-auto">
                        <div className="row text-center">
                            <div className="col-sm-12 col-lg-6 col-md-6 col-xl-6">
                                <span>od: </span>
                                <input type="date" className="stats-input" value={this.state.date}
                                        name="date" onChange={e => this.change(e)}/>
                            </div>
                            <div className="col-sm-12 col-lg-6 col-md-6 col-xl-6">
                                <span>do: </span>
                                <input type="date" className="stats-input" value={this.state.range}
                                    name="range" onChange={e => this.change(e)}/>
                            </div>
                        </div>

                        <Line
                            height={parseInt("130vh")}
                            data={{
                                datasets: [
                                    {
                                        label: "Cukier",
                                        type:'line',
                                        yAxisID: 'Cukier',
                                        data: this.state.sugars.map((row) => {
                                            return {x: row.date, y: row.amount}
                                        }),
                                        fill: false,
                                        borderColor: 'rgba(255,0,0,0.4)',
                                        backgroundColor: 'rgba(255,0,0,1)',
                                        borderWidth: 4,
                                        lineTension: 0.3,
                                        pointRadius: 7,
                                        pointHoverRadius: 10
                                    },
                                    {
                                        label: "Insulina",
                                        type:'line',
                                        yAxisID: 'Insulina',
                                        data: this.state.doses.map((row) => {
                                            return {x: row.date, y: row.amount}
                                        }),
                                        fill: false,
                                        borderColor: 'rgba(0,255,0,0.4)',
                                        backgroundColor: 'rgba(0,255,0,1)',
                                        borderWidth: 4,
                                        lineTension: 0.3,
                                        pointRadius: 7,
                                        pointHoverRadius: 10
                                    },
                                    {
                                        label: "Posiłki",
                                        type:'line',
                                        yAxisID: 'Posiłek',
                                        data: this.state.meals.map((row) => {
                                            return {x: row.date, y: row.kcal}
                                        }),
                                        fill: false,
                                        borderColor: 'rgba(0,0,255,0.4)',
                                        backgroundColor: 'rgba(0,0,255,1)',
                                        borderWidth: 4,
                                        lineTension: 0.3,
                                        pointRadius: 7,
                                        pointHoverRadius: 10
                                    },
                                ],
                            }}
                            options={{
                                hover: {
                                    mode: 'point'
                                },
                                tooltips: {
                                    titleFontSize: 14,
                                    bodyFontSize: 14,
                                },
                                scales: {
                                    yAxes: [{
                                        id: "Cukier",
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Ilośc cukru',
                                        },
                                        ticks: {
                                            min: 0,
                                            max: parseInt(this.state.max.sugar.value) + 30,
                                        }
                                    }, {
                                        id: "Posiłek",
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Ilość kalorii',
                                        },
                                        ticks: {
                                            min: 0,
                                            max: parseInt(this.state.max.meal.value) + 50,
                                        }
                                    }, {
                                        id: "Insulina",
                                        position: 'right',
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Ilość jednostek',
                                        },
                                        ticks: {
                                            min: 0,
                                            max: parseInt(this.state.max.dose.value) + 3,
                                        }
                                    }],
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            min: moment(this.state.date).set({hours: 0, minuts: 0, seconds: 0}).format("YYYY-MM-DD HH:mm:ss"),
                                            max: moment(this.state.range).set({hours: 23, minute: 59, seconds: 59}).format("YYYY-MM-DD HH:mm:ss"),
                                        }
                                    }],
                                },
                                responsive: true,
                                maintainAspectRatio: true,
                            }}
                        />
                    </div>
                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-sm-12 col-lg-7 col-md-7 col-xl-7">
                        <div className="table-responsive row p-3 stats-info">
                            <table className="table text-center stats-table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Średnia</th>
                                        <th scope="col">Max</th>
                                        <th scope="col">Min</th>
                                        <th scope="col">Ilość</th>
                                        <th scope="col">Suma</th>
                                    </tr>
                                </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Cukry</th>
                                            <td>{Math.round(this.state.avg.sugar.value * 10)/10 || 0}</td>
                                            <td>{this.state.max.sugar.value || 0}</td>
                                            <td>{this.state.min.sugar.value || 0}</td>
                                            <td>{this.state.sugars.length}</td>
                                            <td>#</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Posiłki</th>
                                            <td>{Math.round(this.state.avg.meal.value * 10)/10 || 0}</td>
                                            <td>{this.state.max.meal.value || 0}</td>
                                            <td>{this.state.min.meal.value || 0}</td>
                                            <td>{this.state.meals.length}</td>
                                            <td>{this.sumArray(this.state.meals) || 0}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Insulina</th>
                                            <td>{Math.round(this.state.avg.dose.value * 10)/10 || 0}</td>
                                            <td>{this.state.max.dose.value || 0}</td>
                                            <td>{this.state.min.dose.value || 0}</td>
                                            <td>{this.state.doses.length}</td>
                                            <td>{this.sumArray(this.state.doses) || 0}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-sm-12 col-lg-5 col-md-5 col-xl-5 text-center">
                            <h4>Pomiary</h4>
                            <div>
                                <Doughnut
                                    height={parseInt("90vh")}
                                    data={{
                                        labels: ["Niskie", "Poprawne", "Wysokie"],
                                        datasets: [
                                            {
                                                label: "Ilość",
                                                backgroundColor: ["yellow", "green", "red"],
                                                data: [this.state.donut.low,  this.state.donut.mid, this.state.donut.high]
                                            }
                                        ],
                                    }}
                                    options={{
                                        responsive: true
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                <hr></hr>
                <div className="row">
                    <div className="col-sm-12 col-lg-6 col-md-6 col-xl-6 text-center table-responsive">
                        <h2>Cukry:</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col" style={{width: "5%"}}>#</th>
                                    <th scope="col" style={{width: "25%"}}>Data</th>
                                    <th scope="col" style={{width: "15%"}}>Ilość</th>
                                    <th scope="col" style={{width: "1%"}}></th>
                                    <th scope="col" style={{width: "1%"}}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.sugars.map((row, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <th scope="row">{idx+1}</th>
                                            <td>{moment(row.date).format("YYYY-MM-DD HH:mm:ss")}</td>
                                            <td><input type="number" placeholder={row.amount} 
                                            onBlur={e => {this.sugarUpdate(e.target.value, row.id)}}/></td>
                                            <td><button type="button" onClick={() => this.sugarDelete(row.id)}
                                            className="btn glukose-main">Usuń</button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-sm-12 col-lg-6 col-md-6 col-xl-6 text-center table-responsive">
                        <h2>Insulina:</h2>
                        <table className="table text-center">
                            <thead>
                                <tr>
                                    <th scope="col" style={{width: "5%"}}>#</th>
                                    <th scope="col" style={{width: "25%"}}>Data</th>
                                    <th scope="col" style={{width: "15%"}}>Ilość</th>
                                    <th scope="col" style={{width: "15%"}}>Typ</th>
                                    <th scope="col" style={{width: "1%"}}></th>
                                    <th scope="col" style={{width: "1%"}}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.doses.map((row, idx) => {
                                    return (
                                        <tr key={row.id}>
                                            <th scope="row">{idx+1}</th>
                                            <td>{moment(row.date).format("YYYY-MM-DD HH:mm:ss")}</td>
                                            <td><input type="number" placeholder={row.amount} 
                                            onBlur={e => {this.doseUpdate(e.target.value, row.type, row.id)}}/></td>
                                            <td>{row.type}</td>
                                            <td><button type="button" onClick={() => this.doseDelete(row.id)}
                                            className="btn glukose-main">Usuń</button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-lg-7 col-md-7 col-xl-7 text-center table-responsive">
                        <h2>Posiłki:</h2>
                        <table className="table text-center">
                            <thead>
                                <tr>
                                <th scope="col" style={{width: "5%"}}>#</th>
                                <th scope="col" style={{width: "20%"}}>Data</th>
                                <th scope="col" style={{width: "15%"}}>Kcal</th>
                                <th scope="col" style={{width: "15%"}}>Tłuscze/białka</th>
                                <th scope="col" style={{width: "15%"}}>Węglowodany</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.meals.map((row, idx) => {
                                    return (
                                        <tr key={row.id}>
                                            <th scope="row">{idx+1}</th>
                                            <td>{moment(row.date).format("YYYY-MM-DD HH:mm:ss")}</td>
                                            <td><input type="number" placeholder={row.kcal} 
                                            onBlur={e => {this.mealUpdate("kcal", e.target.value, row.id)}}/></td>
                                            <td><input type="number" placeholder={row.fats} 
                                            onBlur={e => {this.mealUpdate("fats", e.target.value, row.id)}}/></td>
                                            <td><input type="number" placeholder={row.carbohydrates} 
                                            onBlur={e => {this.mealUpdate("carbohydrates", e.target.value, row.id)}}/></td>
                                            <td><button type="button" onClick={() => this.mealDelete(row.id)}
                                            className="btn glukose-main">Usuń</button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>}
            </div>
        )
    }
}

export default DailyStatistics;