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
            meal: null,
            error: null
        }
    }

    componentWillMount() {
        var d = new Date(this.state.date);
        window.addEventListener("keydown", (key) => {
            if(key.code === "ArrowRight") {
                d.setDate(d.getDate() + 1);
                this.setState({date: d.toISOString().substring(0,10)});
            } else if(key.code === "ArrowLeft") {
                d.setDate(d.getDate() - 1);
                this.setState({date: d.toISOString().substring(0,10)});
            }
            this.getData();
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
        if(e.target.name === "date")
            this.getData();
    }

    async sugarUpdate(amount, id) {
        try {
            await Axios.patch(server + "/api/sugar", {
                amount: amount,
                id: id
            });
            console.log("Updated");
            this.getData();
        }
        catch(e) {
            this.setState({
                error: e,
            })
        }
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
            <div className="container-fluid sidebar-small" onKeyDown={() => {console.log("xd")}}>
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
                                height={500}
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
                                            <td>{this.state.sugar.avg || 0}</td>
                                            <td>{this.state.sugar.max || 0}</td>
                                            <td>{this.state.sugar.min || 0}</td>
                                            <td>{this.state.sugar.min || 0}</td>
                                            <td>#</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Posiłki</th>
                                            <td>{this.state.meal.avg || 0}</td>
                                            <td>{this.state.meal.max || 0}</td>
                                            <td>{this.state.meal.min || 0}</td>
                                            <td>{this.state.meal.count || 0}</td>
                                            <td>{this.state.meal.sum || 0}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Insulina</th>
                                            <td>{this.state.dose.avg || 0}</td>
                                            <td>{this.state.dose.max || 0}</td>
                                            <td>{this.state.dose.min || 0}</td>
                                            <td>{this.state.dose.count || 0}</td>
                                            <td>{this.state.dose.sum || 0}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                    </ContentFrame>
                    <ContentFrame col="col-sm-12 col-md-6 col-xl-5 content-padding"
                        title="Posiłki" fill={true}>
                        <div className="mt-3 text-center" style={{maxHeight: "40vh"}}>
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
                                    responsive: true,
                                    maintainAspectRatio: true,
                                }}/>
                            <h1 className="pt-2">{this.state.meal.fats || 50}/{this.state.meal.carbohydrates || 50}</h1>
                        </div>
                    </ContentFrame>
                </div>
                <div className="row pl-3 pr-3 mt-5 justify-content-center">
                    <ContentFrame col="col-sm-12 col-md-12 col-xl-5"
                        title="Edycja danych">
                        <div className="p-4 table-responsive">
                        <h1>Cukry:</h1>
                        <table className="table text-center">
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
                                    {this.state.sugar.values.map((row) => {
                                        var date = new Date(row.date);
                                        return (<tr key={row.id}>
                                            <th scope="row">{row.id}</th>
                                            <td>{date.toLocaleString()}</td>
                                            <td><input type="number" placeholder={row.amount} onChange={e => {this.sugarUpdate(e.target.value, row.id)}}/></td>
                                            <td><button type="button" data-toggle="modal" data-target="#exampleModalLong" className="btn btn-danger">Usuń</button></td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                        <h1>Insulina:</h1>
                        <table className="table text-center">
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
                                {this.state.dose.values.map((row) => {
                                    var date = new Date(row.date);
                                    return (<tr key={row.id}>
                                        <th scope="row">{row.id}</th>
                                        <td>{date.toLocaleString()}</td>
                                        <td>{row.amount}</td>
                                        <td><button type="button" className="btn btn-info">Edytuj</button></td>
                                        <td><button type="button" className="btn btn-danger">Usuń</button></td>
                                    </tr>)
                                })}
                            </tbody>
                            </table>
                        </div>
                    </ContentFrame>
                    <ContentFrame col="col-sm-12 col-md-12 col-xl-6 content-padding"
                        title="Edycja danych">
                        <div className="p-4 table-responsive">
                        <h1>Posiłki:</h1>
                        <table className="table text-center">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Data</th>
                                <th scope="col">Kcal</th>
                                <th scope="col">Tłuscze/białka</th>
                                <th scope="col">Węglowodany</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.meal.values.map((row) => {
                                    var date = new Date(row.date);
                                    return (<tr key={row.id}>
                                        <th scope="row">{row.id}</th>
                                        <td>{date.toLocaleString()}</td>
                                        <td>{row.kcal}</td>
                                        <td>{row.fats}</td>
                                        <td>{row.carbohydrates}</td>
                                        <td><button type="button" className="btn btn-info">Edytuj</button></td>
                                        <td><button type="button" className="btn btn-danger">Usuń</button></td>
                                    </tr>)
                                })}
                            </tbody>
                            </table>
                        </div>
                    </ContentFrame>
                </div>
            </div>
        )
    }
}

export default DailyStatistics;