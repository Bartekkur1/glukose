import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import Axios from 'axios';
import {server} from '../../package.json';

class Sugar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: null,
            labels: null,
            count: 0
        }
    }

    async componentDidMount() {
        try {
            let res = await Axios.get(server + "/api/sugar");
            console.log(res.data);
            this.setState({
                count: res.data.count,
                labels: res.data.rows.map((row) => {
                    return new Date(row["date"]).toLocaleString();
                }),
                data: res.data.rows.map((row) => {
                    return row["amount"];
                }),
            });
        }
        catch(e)
        {
            this.setState({error: e});
            this.setState({loading: false});
        }  
    }

    render() {
        return (
            <div className="container-fluid sidebar-small h-100">
                <div className="row">
                    <div className="col-12 p-0">
                        <h1 className="text-center">Wykres cukrów.</h1>
                    </div>
                </div>                
                <div className="row h-50">
                    <div className="col-12 sugar-content mx-auto">
                        <Line
                            data={{
                                labels: this.state.labels,
                                datasets: [
                                    {
                                        label: "Cukier",
                                        data: this.state.data,
                                        backgroundColor: "rgba(153,255,51, 0)",
                                        lineTension: 0.3,
                                        borderColor: 'rgba(255,0,0,0.6)',
                                    }
                                ],
                            }}
                            options={{
                                scales: {
                                    yAxes: [{
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Ilośc cukru',
                                        },
                                        ticks: {
                                            max : 300,    
                                            min : 0,
                                        }
                                    }],
                                    xAxes: [{
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Data'
                                        }
                                    }],
                                },
                                responsive: true,
                                maintainAspectRatio: false,
                                legend: {
                                    display: false,
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

export default Sugar;