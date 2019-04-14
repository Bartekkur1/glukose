import React, { Component } from 'react';
import Axios from 'axios';
import { server } from "../../package.json";
import moment, { now } from 'moment';

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: "",
            loading: true,
        }
    }

    async componentDidMount() {
        try {
            var res = await Axios.get(server + "find_record/sugar/latest")
            var duration = moment.duration(moment(now()).diff(moment(res.data.date)));
            duration.add(moment.duration("-01:00:00"))
        }
        catch(e) {
            // console.log(e)
        }
        var d = moment.duration(this.state.duration)
        if(d.get("hours") > 4)
        {
            this.setState({
                message: "Zmierz cukier!!"
            });
        }
        setInterval(() => {
            this.setState({
                duration: new Date(duration.add(moment.duration("00:00:01"))).toLocaleTimeString(),
                loading: false,
            })
            var d = moment.duration(this.state.duration)
            if(d.get("hours") > 4 || duration.get("days") > 0)
            {
                this.setState({
                    message: "Zmierz cukier!!"
                });
            }
        }, 1000);
    }

    render() {
        if(this.state.loading)
            return (                
            <div className="row m-0 h-100 glukose-off">
                <img className="mx-auto loading-page" src={process.env.PUBLIC_URL + '/images/loading-gray.svg'} alt="Loading"/>
            </div>)
        return (
            <div className="container-fluid sidebar-small h-100">
                <div className="row text-center p-2">
                    <div className="col-sm-12 col-md-9 col-lg-8 col-xl-9 mt-5 mx-auto"
                        style={{"color": "gray"}}>
                        <h1>Witaj w Glukose!</h1>
                        <h4>Miłego dnia i dobrych cukrów!</h4>
                    </div>
                </div>
                <div className="row text-center p-2" style={{"height": "70vh"}}>
                    <div className="col-sm-12 col-lg-9 col-md-9 col-xl-4 mx-auto my-auto">
                            {this.state.message ?
                            <div className="home_box pb-4 pt-5" style={{"fontSize": "5vh", "color": "red", "fontWeight": "bold"}}>
                                <i className="fa fa-2x fas fa-exclamation-triangle"></i>
                                <p className="m-0">{this.state.message}</p>
                            </div>
                            :
                            <div className="home_box p-4">
                                <span style={{"fontWeight": "bold", "fontSize": "10vh"}}>
                                    {this.state.duration}
                                </span>
                                <h4>
                                    Od ostatniego pomiaru cukru
                                </h4>
                            </div>}
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;