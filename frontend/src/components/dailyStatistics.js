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
        this.state = {
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
            error: null,
            mealParts: {}
        }
    }

    renderMealPart(meal) {
        if(meal.mealParts[0].name)
            return(
                <div key={meal.id} className="row">
                    <div className="col-sm-12 col-md-6 col-xl-6 mx-auto box-shadow p-0 mt-5">
                        <h4 className="p-2">Posiłek z {meal.date}</h4>
                            <div className="table-responsive row m-0">
                            <table className="table text-center small-table">
                                <thead className="small-table">
                                    <tr className="p-0">
                                        <th scope="col">Nazwa</th>
                                        <th scope="col">Waga (g)</th>
                                        <th scope="col">Kalorie</th>
                                    </tr>
                                </thead>
                                <tbody className="p-0">
                                    {meal.mealParts.map((mealPart) => {
                                        return(<tr key={mealPart.id}>
                                            <td>{mealPart.name}</td>
                                            <td>{mealPart.weight}</td>
                                            <td>{mealPart.kcal}</td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )
    }

    componentWillMount() {
        window.addEventListener("keydown", (key) => {
            if(key.code === "ArrowRight") {
                this.setState({date: moment(this.state.date).add("days", 1).format("YYYY-MM-DD"),
                               range: moment(this.state.range).add("days", 1).format("YYYY-MM-DD")});
                this.getData();
            } else if(key.code === "ArrowLeft") {
                this.setState({date: moment(this.state.date).subtract("days", 1).format("YYYY-MM-DD"),
                               range: moment(this.state.range).subtract("days", 1).format("YYYY-MM-DD")});
                this.getData();
            }
        }, false);
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
                if(record.amount < 180 && record.amount > 70)
                    mid++;
                if(record.amount > 180)
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
                        {this.state.meals.map((meal) => {
                            return this.renderMealPart(meal);
                        })}
                </div>}
            </div>
        )
    }
}

export default DailyStatistics;