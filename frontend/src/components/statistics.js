import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import Axios from 'axios';
import {server} from '../../package.json';
import Error from "./error";

class Statistics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: null,
            date: new Date().toISOString().substring(0,10),
            count: 0,
            sugar: {
                count: null,
                data: null
            },
            dose: {
                count: null,
                data: null  
            },
            meal: {
                count: null,
                data: null
            }
        }
    }

    async componentDidMount() {
        try {
            let meal = await Axios.get(server + "/api/meal/" + this.state.date);
            let dose = await Axios.get(server + "/api/dose/" + this.state.date);
            let sugar = await Axios.get(server + "/api/sugar/" + this.state.date);
            this.setState({
                sugar: {
                    data: sugar.data.rows.map((row) => {
                        return {x: row.date, y: row.amount}
                    })
                },
                meal: {
                    data: meal.data.rows.map((row) => {
                        return {x: row.date, y: row.kcal}
                    })   
                },
                dose: {
                    data: dose.data.rows.map((row) => {
                        return {x: row.date, y: row.amount}
                    })
                }
            })
        }
        catch(e)
        {
            this.setState({error: e});
            this.setState({loading: false});
        }  
        console.log(this.state);
    }
    
    render() {
        return (
            <div className="container-fluid sidebar-small h-100">
                <div className="row">
                    <Error error={this.state.error} close={() => this.setState({error: false})} />
                </div>
                <div className="row mt-5">
                    <div className="col-12 p-0">
                        <h3 className="text-center">Wykres przedstawia informacje z dnia: .</h3>
                    </div>
                </div>                
                <div className="row h-50">
                    <div className="col-12 sugar-content mx-auto">
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
                                            max: 600
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
                                            min: "2018-12-05T00:00:00.000Z",
                                            max: "2018-12-06T00:00:00.000Z",
                                            displayFormats: {
                                                minutes: 'h:mm a'
                                            }
                                        }
                                    }],
                                },
                                responsive: true,
                                maintainAspectRatio: false,
                                legend: {
                                    position: "bottom",
                                    labels: {
                                        boxWidth: 50
                                    }
                                }
                            }}
                        />
                        <div className="jumbotron mt-5">
                            <h1>kek</h1>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Statistics;