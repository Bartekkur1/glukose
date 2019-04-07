import React, { Component } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import Axios from 'axios';
import {server} from '../../package.json';
import Error from "./error";

class Statistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            miniloading: false,
            sugars: [],
            doses: [],
            meals: [],
            max: {
                sugar: {
                    value: 100
                },
                dose: {
                    value: 100
                },
                meal: {
                    value: 100
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
            error: null
        }
    }

    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        if(e.target.name === "date")
            this.getData();
    }

    dailyParse(arr, type) {
        var p = [0, 0, 0, 0]
        if(type === "dose")
        {
            arr.forEach(element => {
                if(element.type === "Posiłek")
                {
                    if(element.hour > 7 && element.hour < 10) 
                        p[0] += parseInt(element.value)
                    if(element.hour > 10 && element.hour < 14)
                        p[1] += parseInt(element.value)
                    if(element.hour > 14 && element.hour < 17)
                        p[2] += parseInt(element.value)
                    if(element.hour > 17 && element.hour < 21)
                        p[3] += parseInt(element.value)
                }
            });   
        }
        else if(type === "sugar")
            arr.forEach(element => {
                if(element.hour > 7 && element.hour < 10) 
                    p[0] += parseInt(element.value)
                if(element.hour > 10 && element.hour < 14)
                    p[1] += parseInt(element.value)
                if(element.hour > 14 && element.hour < 17)
                    p[2] += parseInt(element.value)
                if(element.hour > 17 && element.hour < 21)
                    p[3] += parseInt(element.value)
            });
        else if(type === "meal")
            arr.forEach(element => {
                if(element.hour > 7 && element.hour < 10) 
                    p[0] += parseInt(element.value)
                if(element.hour > 10 && element.hour < 14)
                    p[1] += parseInt(element.value)
                if(element.hour > 14 && element.hour < 17)
                    p[2] += parseInt(element.value)
                if(element.hour > 17 && element.hour < 21)
                    p[3] += parseInt(element.value)
            });
        p[0] = Math.round((p[0]/2)*100)/100
        p[1] = Math.round((p[1]/2)*100)/100
        p[2] = Math.round((p[2]/2)*100)/100
        p[3] = Math.round((p[3]/2)*100)/100
        return p;
    }

    async getData() {
        this.setState({
            miniloading: true
        })
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            let dose = await Axios.get(server + "find_record/dose/avghours");
            let meal = await Axios.get(server + "find_record/meal/avghours");
            let sugar = await Axios.get(server + "find_record/sugar/avghours");
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
                    <h1 className="pt-4 text-center">STATYSTYKA OGÓLNA</h1>
                    <div className="row">
                        {this.state.miniloading ?
                            <div className="row mx-auto h-100">
                                <img className="loading-page" src={process.env.PUBLIC_URL + '/images/loading-gray.svg'} alt="Loading"/>
                            </div>
                        :
                            <div className="col-12">
                                <div className="col-12 p-4 mx-auto">
                                    <Line
                                        height={parseInt("130vh")}
                                        data={{
                                            datasets: [
                                                {
                                                    label: "Cukier",
                                                    type:'line',
                                                    yAxisID: 'Cukier',
                                                    data: this.state.sugars.map((row) => {
                                                        return {x: row.hour, y: row.value}
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
                                                        return {x: row.hour, y: row.value}
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
                                                        return {x: row.hour, y: row.value}
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
                                            tooltips: {
                                                titleFontSize: 14,
                                                bodyFontSize: 14,
                                                callbacks: {
                                                    title: function(tooltipItem, data) {
                                                        return 'Średnio o godzinie: ' + tooltipItem[0].xLabel;
                                                    },
                                                    label: function(tooltipItem, data) {
                                                        return tooltipItem.yLabel; 
                                                    },
                                                },
                                            },
                                            scales: {
                                                yAxes: [{
                                                    id: "Cukier",
                                                    scaleLabel: {
                                                        display: true,
                                                        labelString: 'Ilośc cukru',
                                                    },
                                                    ticks: {
                                                        min: parseFloat(this.state.min.sugar.value) - 30,
                                                        max: parseFloat(this.state.max.sugar.value) + 30,
                                                    }
                                                }, {
                                                    id: "Posiłek",
                                                    scaleLabel: {
                                                        display: true,
                                                        labelString: 'Ilość kalorii',
                                                    },
                                                    ticks: {
                                                        min: parseFloat(this.state.min.meal.value) - 50,
                                                        max: parseFloat(this.state.max.meal.value) + 50,
                                                    }
                                                }, {
                                                    id: "Insulina",
                                                    position: 'right',
                                                    scaleLabel: {
                                                        display: true,
                                                        labelString: 'Ilość jednostek',
                                                    },
                                                    ticks: {
                                                        min: parseFloat(this.state.min.dose.value) - 1,
                                                        max: parseFloat(this.state.max.dose.value) + 3,
                                                    }
                                                }],
                                                xAxes: [{
                                                    type: 'time',
                                                    time: {
                                                    parser: "HH:mm",
                                                    unit: 'hour',
                                                    unitStepSize: 1,
                                                    displayFormats: {
                                                        'minute': 'HH:mm', 
                                                        'hour': 'HH:mm', 
                                                        min: '00:00',
                                                        max: '24:00'
                                                    },
                                                    }
                                                }],
                                            },
                                            responsive: true,
                                            maintainAspectRatio: true,
                                        }}
                                    />
                                </div>
                                <div className="col-sm-12 col-lg-12 col-md-12 col-xl-12 p-4 mx-auto">
                                    <Bar
                                        height={parseInt("90vh")}
                                        data={{
                                            labels: ["6:00-10:00", "10:00-14:00", "14:00-17:00", "17:00-21:00"],
                                            datasets: [
                                            {
                                                label: 'insulina',
                                                yAxisID: 'insulina',
                                                backgroundColor: ["#64e864", "#64e864","#64e864","#64e864"],
                                                data: this.dailyParse(this.state.doses, "dose"),
                                            },
                                            {
                                                label: 'cukier',
                                                yAxisID: 'cukier',
                                                backgroundColor: ["#ff0000", "#ff0000", "#ff0000", "#ff0000"],
                                                data: this.dailyParse(this.state.sugars, "sugar")
                                            },
                                            {
                                                label: 'kcal',
                                                yAxisID: 'kcal',
                                                backgroundColor: ["yellow", "yellow", "yellow", "yellow"],
                                                data: this.dailyParse(this.state.meals, "meal")
                                            },
                                            ]
                                        }}
                                        options={{
                                            scales: {
                                                yAxes: [{
                                                    id: "cukier",
                                                    scaleLabel: {
                                                        display: true,
                                                        labelString: 'Ilośc cukru',
                                                    },
                                                    ticks: {
                                                        min: 0,
                                                        max: parseInt(this.state.max.sugar.value) + 100,
                                                    }
                                                }, {
                                                    id: "insulina",
                                                    scaleLabel: {
                                                        display: true,
                                                        labelString: 'Ilość insuliny',
                                                    },
                                                    ticks: {
                                                        min: 0,
                                                        max: parseInt(this.state.max.dose.value) + 3,
                                                    }
                                                }, {
                                                    id: "kcal",
                                                    scaleLabel: {
                                                        display: true,
                                                        labelString: 'Ilość kalorii',
                                                    },
                                                    ticks: {
                                                        min: 0,
                                                        max: parseInt(this.state.max.meal.value) + 400,
                                                    }
                                                }
                                                
                                            ],}
                                        }}
                                        legend={{
                                            display: null
                                        }}
                                    />
                                </div>
                            </div>}
                    </div>

            </div>
        )
    }
}

export default Statistics;