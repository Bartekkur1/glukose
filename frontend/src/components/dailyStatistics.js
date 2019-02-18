import React, { Component } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import ContentFrame from './contentFrame';
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
            sugar: null,
            dose: null,
            meal: null
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
                sugar: sugar.data,
                dose: dose.data,
                meal: meal.data,
                loading: false
            });
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
                <div className="row pl-3 pr-3 mt-3">
                    <ContentFrame col="col-sm-12 col-md-12 col-xl-11 mx-auto"
                        title={
                            <div>
                                <span>Statystyka z dnia:</span>     
                                <input type="date" className="stats-input pl-2" value={this.state.date}
                                name="date" onChange={e => this.change(e)}/>
                            </div>
                        }>
                        <div className="p-4">
                            <Line
                                height="500vh"
                                data={{
                                    datasets: [
                                        {
                                            label: 'Cukier',
                                            type:'line',
                                            yAxisID: 'Cukier',
                                            data: this.state.sugar.values.map((row) => {
                                                return {x: row.date, y: row.amount}
                                            }),
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
                                            data: this.state.dose.values.map((row) => {
                                                return {x: row.date, y: row.amount}
                                            }),
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
                                            data: this.state.meal.values.map((row) => {
                                                return {x: row.date, y: row.kcal}
                                            }),
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
                                    maintainAspectRatio: false,
                                    legend: {
                                        position: "bottom",
                                        labels: {
                                            boxWidth: 50
                                        }
                                    }
                                }}
                            />
                        </div>
                    </ContentFrame>
                </div>
                <div className="row pl-3 pr-3 justify-content-center mt-5">   
                    <ContentFrame col="col-sm-12 col-md-6 col-xl-6"
                        title="Informacje">
                            <div className="row p-3 stats-info">
                                <div className="col-lg-12 col-xl-4">
                                    <h3>Cukry</h3>
                                    <ul>
                                        <li>Średni pomiar: {this.state.sugar.avg}</li>
                                        <li>Największy pomiar: {this.state.sugar.max}</li>
                                        <li>Najmniejszy pomiar: {this.state.sugar.min}</li>
                                        <li>Ilość pomiarów: {this.state.sugar.count}</li>
                                    </ul>
                                </div>
                                <div className="col-lg-12 col-xl-4">
                                    <h3>Posiłki</h3>
                                    <ul>
                                        <li>Ilość kalorii: {this.state.meal.sum}</li>
                                        <li>Średnia ilość kalorii: {this.state.meal.avg}</li>
                                        <li>Ilość posiłków: {this.state.meal.count}</li>
                                    </ul>
                                </div>
                                <div className="col-lg-12 col-xl-4">
                                    <h3>Insulina</h3>
                                    <ul>
                                        <li>Średnia dawka: {this.state.dose.avg}</li>
                                        <li>Największa dawka: {this.state.dose.max}</li>
                                        <li>Najmniejsza dawka: {this.state.dose.min}</li>
                                        <li>Ilość dawek: {this.state.dose.count}</li>
                                    </ul>
                                </div>
                            </div>
                    </ContentFrame>
                    <ContentFrame col="col-sm-12 col-md-6 col-xl-5 content-padding"
                        title="Posiłki" fill={true}>
                        <div className="mt-3">
                            <Doughnut 
                                data={{
                                    labels: ["Tłuszcze/Białka", "Węglowodany"],
                                    datasets: [
                                        {
                                            label: "Zawartość",
                                            backgroundColor: ["#FFC870", "#F7464A"],
                                            data: [this.state.meal.fats || 50, this.state.meal.carbohydrates || 50]
                                        }
                                    ],
                                    options: {
                                        title: {
                                            display: true,
                                            text: 'Predicted world population (millions) in 2050'
                                        }
                                    },
                                    responsive: false,
                                    maintainAspectRatio: false,
                                }}/>
                        </div>
                    </ContentFrame>
                </div>
                <div className="row pl-3 pr-3 m-5">
                    <ContentFrame col="col-sm-12 col-md-12 col-xl-11 mx-auto"
                        title="Cukry">
                        <h1>XD</h1>
                    </ContentFrame>
                </div>
            </div>
        )
    }
}

export default DailyStatistics;