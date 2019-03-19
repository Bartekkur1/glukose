import React, { Component } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import Axios from 'axios';
import {server} from '../../package.json';
import Error from "./error";
import ContentFrame from './contentFrame';

class Statistics extends Component {
    constructor(props) {
        super(props);
        var d = new Date();
        this.state = {
            loading: true,
            data: null,
            date: d.toISOString().substring(0,10),
            avgDose: null,
            avgSugars: null
        }
    }

    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        if(e.target.name === "date")
            this.getData();
    }

    avgArray(arr) {
        var ans = [0, 0, 0, 0];
        arr.forEach((element, idx) => {
            if(idx >= 6 && idx <= 10)
                ans[0] += element.y
            if(idx >= 10 && idx <= 14)
                ans[1] += element.y
            if(idx >= 14 && idx <= 17)
                ans[2] += element.y
            if(idx >= 17 && idx <= 21)
                ans[3] += element.y
        });
        return ans
    }

    avgDose(meals, doses, sugars) {
        var mealsAvg = this.avgArray(meals)
        var dosesAvg = this.avgArray(doses)
        var sugarsAvg = this.avgArray(sugars);
        var avgDose  = [0, 0, 0, 0];
        avgDose.forEach((e, idx) => {
            avgDose[idx] = Math.round((dosesAvg[idx] / (mealsAvg[idx]/100))*100)/100
        });
        sugarsAvg.forEach((element, idx) => {
            sugarsAvg[idx] = Math.round(100*(element/4))/100
        })
        this.setState({
            avgDose: avgDose,
            avgSugars: sugarsAvg
        });
    }

    async getData() {
        try {
            let res = await Axios.get(server + "/api/stats");
            this.setState({
                loading: false,
                data: res.data
            })
            this.avgDose(this.state.data.meals, this.state.data.doses,
                this.state.data.sugars);
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
            <div className="container-fluid sidebar-small h-100">
                <div className="row">
                    <Error error={this.state.error} close={() => this.setState({error: false})} />
                </div>            
                <div className="row mt-3">
                    <ContentFrame col="col-sm-12 col-md-12 col-xl-11 mx-auto" //col="col-sm-12 col-md-12 col-xl-9 mx-auto"
                        title="Statystyka ogólna">
                        <div className="p-4">
                            <Line
                                height={500}
                                data={{
                                    datasets: [
                                        {
                                            label: 'Cukier',
                                            type:'line',
                                            yAxisID: 'Cukier',
                                            data: this.state.data.sugars,
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
                                            data: this.state.data.doses,
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
                                            data: this.state.data.meals,
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
                                                displayFormats: {
                                                    minutes: 'h:mm a'
                                                }
                                            },
                                        }],
                                    },
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    legend: {
                                        position: "bottom",
                                        labels: {
                                            boxWidth: 50
                                        }
                                    },
                                    tooltips: {
                                        callbacks: {
                                            title: function(t) {
                                                return t[0].xLabel.substring(12,t[0].xLabel.length);
                                            }
                                        }
                                    }
                                }}
                            />      
                        </div>
                    </ContentFrame>
                </div>
                <div className="row mt-5 mb-5">
                    <ContentFrame col="col-sm-12 col-md-12 col-xl-11 mx-auto"
                        title="Ilość insuliny"> 
                            <div className="row text-center">
                                <div className="col-12 text-center">
                                    Wykres przedstawia średnią ilość insuliny (na 100kcal) i cukru w przedziałach czasowych
                                </div>
                                <div className="col-7 text-center">
                                    <Bar
                                        data={{
                                            labels: ["6:00-10:00", "10:00-14:00", "14:00-17:00", "17:00-21:00"],
                                            datasets: [
                                              {
                                                label: 'kcal',
                                                yAxisID: 'kcal',
                                                backgroundColor: ["#64e864", "#64e864","#64e864","#64e864"],
                                                data: this.state.avgDose,
                                              },
                                              {
                                                label: 'sugar',
                                                yAxisID: 'sugar',
                                                backgroundColor: ["#ff0000", "#ff0000", "#ff0000", "#ff0000"],
                                                data: this.state.avgSugars
                                              }
                                            ]
                                        }}
                                        options={{
                                            scales: {
                                                yAxes: [{
                                                    id: "sugar",
                                                    scaleLabel: {
                                                        display: true,
                                                        labelString: 'Ilośc cukru',
                                                    },
                                                    ticks: {
                                                        min: 50,
                                                        max: 250,
                                                    }
                                                }, {
                                                    id: "kcal",
                                                    scaleLabel: {
                                                        display: true,
                                                        labelString: 'Ilość insuliny',
                                                    },
                                                    ticks: {
                                                        min: 0,
                                                        max: 4,
                                                    }
                                                }
                                            ],}
                                        }}
                                        legend={{
                                            display: null
                                        }}
                                    />
                                </div>
                                <div className="col-5">
                                    <h4 className="pt-5">Ilość jednostek insuliny na dzień:</h4>
                                    <span style={{"fontSize": "5em"}}>27.5</span>
                                </div>
                            </div>
                    </ContentFrame>
                </div>
            </div>
        )
    }
}

export default Statistics;