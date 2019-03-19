import React, { Component } from 'react';
import ContentFrame from './contentFrame';
import Axios from 'axios';
import { server } from "../../package.json";
import moment from 'moment';

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: ""
        }
    }

    async componentDidMount() {
        try {
            var res = await Axios.get(server + "/api/data")
            const now = moment(res.data.date);
            const expiration = moment(Date.now());
            expiration.add(1, "hour");
            const diff = expiration.diff(now);
            const diffDuration = moment.duration(diff);
            this.setState({
                days: diffDuration.days(),
                hours: diffDuration.hours(),
                minutes: diffDuration.minutes(),
                seconds: diffDuration.seconds(),
                response: res.data.date
            })
            if(!this.state.response)
                this.setState({
                    message: "Zmierz cukier!"
                })
            console.log(this.state);
        }
        catch(e) {
            console.log(e)
        }
        setInterval(() => { 
            if(this.state.seconds <= 60)
                this.setState({
                    seconds: this.state.seconds + 1
                })
            else
                this.setState({
                    minutes: this.state.minutes + 1,
                    seconds: 0
                })
        }, 1000);
        if(this.state.hours > 4) {
            this.setState({
                message: "Zmierz cukier!"
            })
        }
    }

    render() {
        return (
            <div className="container-fluid sidebar-small">
                <div className="row pl-3 pr-3 mt-3">
                    <ContentFrame title="Witaj w glukose!" col="col-sm-12 col-md-8 mx-auto">
                        <img className="logo mx-auto" src={process.env.PUBLIC_URL + '/images/logo.svg'} alt="logo"/>
                        <h3 className="text-center pt-3">Miłego dnia i dobrych cukrów</h3>
                        <h1 className="text-center pb-5">
                            {this.state.response ? 
                                "Ostatni pomiar cukru: " +
                                this.state.hours + " h " +
                                this.state.minutes + " m " + 
                                this.state.seconds + " s temu"
                            : ""}
                        </h1>
                        <p className="text-center" style={{fontSize: "100px", color: "red", fontWeight: "bold"}}>
                            {this.state.message}
                        </p>
                    </ContentFrame>    
                </div>
            </div>
        )
    }
}

export default Home;