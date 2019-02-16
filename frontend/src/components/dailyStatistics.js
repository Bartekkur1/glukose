import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import Axios from 'axios';
import {server} from '../../package.json';
import Error from "./error";

class DailyStatistics extends Component {
    constructor(props) {
        super(props);
        var d = new Date();
        this.state = {
            loading: true,
            data: null,
            date: d.toISOString().substring(0,10),
            backupDate: d.toISOString().substring(0,10),
            count: 0,
            sugar: {
                count: null,
                data: null,
                avg: null,
                max: null,
                min: null,
                values: null,
                amount: null
            },
            dose: {
                count: null,
                data: null,
                avg: null,
                max: null,
                min: null,
                values: null,
                amount: null
            },
            meal: {
                count: null,
                data: null,
                avg: null,
                sum: null,
                values: null,
                amount: null
            }
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
        if(e.target.name === "date")
            this.getData();
    }

    async getData() {
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            let dose = await Axios.get(server + "/api/dose/" + this.state.date);
            let meal = await Axios.get(server + "/api/meal/" + this.state.date);
            let sugar = await Axios.get(server + "/api/sugar/" + this.state.date);
            this.setState({
                sugar: {
                    count: sugar.data.count,
                    data: sugar.data.rows.map((row) => {
                        return {x: row.date, y: row.amount}
                    }),
                    values: sugar.data.rows.map((row) => {
                        return row.amount
                    }),
                },
                meal: {
                    count: meal.data.count,
                    data: meal.data.rows.map((row) => {
                        return {x: row.date, y: row.kcal}
                    }),
                    values: meal.data.rows.map((row) => {
                        return row.kcal
                    }),
                },
                dose: {
                    count: dose.data.count,
                    data: dose.data.rows.map((row) => {
                        return {x: row.date, y: row.amount}
                    }),
                    values: dose.data.rows.map((row) => {
                        return row.amount
                    }),
                },
                loading: false,
            })
        }
        catch(e)
        {
            this.setState({error: e});
            this.setState({loading: false});
        }  
    }

    async componentDidMount() {
        this.getData();
    }
    
    render() {
        if(this.state.loading)
            return (                
                <div className="row m-0 h-100 glukose-off">
                    <img className="mx-auto loading-page" src={process.env.PUBLIC_URL + '/images/loading-gray.svg'} alt="Loading"/>
                </div>)
        return (
            <div className="container-fluid sidebar-small">
                <div className="row">
                    <Error error={this.state.error} close={() => this.setState({error: false})} />
                </div>
                <div className="row mt-5">
                    <div className="col-12 p-0">
                        <p className="text-center pl-5" style={{fontSize: "24px", fontWeight: "bold"}}>
                            Statystyka z dnia:
                            <input type="date" className="stats-input ml-1" value={this.state.date}
                            name="date" onChange={e => this.change(e)}/>
                        </p>
                    </div>
                </div>                
                <div className="row">
                    <div className="col-12 sugar-content mx-auto pl-5 pr-5" style={{maxHeight: "400px"}}>
                        <Line
                            data={{
                                datasets: [
                                    {
                                        label: 'Cukier',
                                        type:'line',
                                        yAxisID: 'Cukier',
                                        data: this.state.sugar.data,
                                        fill: false,
                                        borderColor: 'rgba(255,0,0,0.4)',
                                        backgroundColor: 'rgba(255,0,0,1)',
                                        borderWidth: 4,
                                        lineTension: 0.3
                                    },
                                    {
                                        label: 'Insulina',
                                        type:'line',
                                        yAxisID: 'Insulina',
                                        data: this.state.dose.data,
                                        fill: false,
                                        borderColor: 'rgba(0,255,0,0.6)',
                                        backgroundColor: 'rgba(0,255,0,1)',
                                        borderWidth: 4,
                                        lineTension: 0.3
                                    },
                                    {
                                        label: 'Posiłek',
                                        type:'line',
                                        yAxisID: 'Posiłek',
                                        data: this.state.meal.data,
                                        fill: false,
                                        borderColor: 'rgba(0,0,255,0.6)',
                                        backgroundColor: 'rgba(0,0,255,1)',
                                        borderWidth: 4,
                                        lineTension: 0.3
                                    },
                                ],
                            }}
                            options={{
                                scales: {
                                    yAxes: [{
                                        id: "Cukier",
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Ilośc cukru',
                                        },
                                        ticks: {
                                            min: 40,
                                            max: 600,
                                        }
                                    }, {
                                        id: "Posiłek",
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Ilość kalorii',
                                        },
                                        ticks: {
                                            min: 0,
                                            max: 900
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
                                            max: 15
                                        }
                                    }],
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            min: `${this.state.date}T00:00:00`,
                                            max: `${this.state.date}T24:00:00`,
                                            displayFormats: {
                                                minutes: 'h:mm a'
                                            }
                                        }
                                    }],
                                },
                                responsive: true,
                                maintainAspectRatio: true,
                                legend: {
                                    position: "bottom",
                                    labels: {
                                        boxWidth: 50
                                    }
                                }
                            }}
                        />
                        <div className="jumbotron mt-3 p-0">
                            <div className="row pl-3 pt-3">
                                <div className="col-4">
                                    <h3>Cukry</h3>
                                    <ul>
                                        <li>Średni pomiar: {this.state.sugar.values && this.state.sugar.values.length > 0 
                                        ? Math.round(this.state.sugar.values.reduce((a,b) => a + b) / this.state.sugar.count) : 0}</li>
                                        <li>Największy pomiar: {this.state.sugar.values && this.state.sugar.values.length > 0 
                                        ? Math.max.apply(null, this.state.sugar.values) : 0}</li>
                                        <li>Najmniejszy pomiar: {this.state.sugar.values && this.state.sugar.values.length > 0 
                                        ? Math.min.apply(null, this.state.sugar.values) : 0}</li>
                                        <li>Ilość pomiarów: {this.state.sugar.count}</li>
                                    </ul>
                                </div>
                                <div className="col-4">
                                    <h3>Posiłki</h3>
                                    <ul>
                                        <li>Ilość kalorii: {this.state.meal.values && this.state.meal.values.length > 0 
                                        ? this.state.meal.values.reduce((a,b) => a + b) : 0}</li>
                                        <li>Średnia ilość kalorii: {this.state.meal.values && this.state.meal.values.length > 0 
                                        ? Math.round(this.state.meal.values.reduce((a,b) => a + b) / this.state.meal.count) : 0}</li>
                                        <li>Ilość posiłków: {this.state.meal.count}</li>
                                    </ul>
                                </div>
                                <div className="col-4">
                                    <h3>Insulina</h3>
                                    <ul>
                                        <li>Średnia dawka: {this.state.dose.values && this.state.dose.values.length > 0 
                                        ? Math.round(this.state.dose.values.reduce((a,b) => a + b) / this.state.dose.count) : 0}</li>
                                        <li>Największa dawka: {this.state.dose.values && this.state.dose.values.length > 0 
                                        ? Math.max.apply(null, this.state.dose.values) : 0}</li>
                                        <li>Najmniejsza dawka: {this.state.dose.values && this.state.dose.values.length > 0 
                                        ? Math.min.apply(null, this.state.dose.values) : 0}</li>
                                        <li>Ilość dawek: {this.state.dose.count}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DailyStatistics;