import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
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
        }
    }

    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        if(e.target.name === "date")
            this.getData();
    }

    async getData() {
        try {
            let res = await Axios.get(server + "/api/stats");
            this.setState({
                loading: false,
                data: res.data
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
            <div className="container-fluid sidebar-small h-100">
                <div className="row">
                    <Error error={this.state.error} close={() => this.setState({error: false})} />
                </div>            
                <div className="row mt-5 pl-5 pr-5">
                    <ContentFrame col="col-sm-12 col-md-12 col-xl-9 mx-auto"
                        title="Statystyka ogólna">
                        <div className="p-4">
                            <Line
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
                                    maintainAspectRatio: true,
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
            </div>
        )
    }
}

export default Statistics;