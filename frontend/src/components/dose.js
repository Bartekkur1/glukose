import React, { Component } from 'react';
import {server} from '../../package.json';
import Axios from 'axios';
import moment from 'moment';

class Dose extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            id: this.props.match.params.id,
            redirect: null,
            date: null,
            amount: null,
            type: null
        };
    }

    async updateDose() {
        this.setState({loading: true});
        try {
            await Axios.patch(server + "update_record/dose", {
                id: this.state.id,
                amount: this.state.amount,
                type: this.state.type,
                date: moment(this.state.date)
            });
        }
        catch(e) {
            console.log(e);
        }
        this.setState({loading: false});
    }

    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async componentDidMount() {
        this.setState({loading: true});
        try {
            var res = await Axios.get(server + "find_record/dose/id/" + this.state.id);
            this.setState({
                amount: res.data.value.amount,
                date: res.data.value.date,
                type: res.data.value.type
            });
        }
        catch(e) {
            console.log(e);
        }   
        this.setState({loading: false});
    }

    render() {
        if(this.state.loading)
            return (                
                <div className="row m-0 h-100 glukose-off">
                    <img className="mx-auto loading-page" src={process.env.PUBLIC_URL + '/images/loading-gray.svg'} alt="Loading"/>
                </div>)
        return(
            <div className="container">
                <div className="row">
                    <div className="col-9 mx-auto userinfo-panel box-shadow mt-5 mb-5 pl-0 pr-0 mr-0 ml-0">
                        <div className="jumbotron pt-3 pb-3 mb-0" style={{"backgroundColor": "white"}} onBlur={() => this.updateDose()}>
                            <h1>Edycja rekordu id: {this.state.id}</h1>
                            <div className="form-group">
                                {/* value="2018-06-12T19:30" */}
                                <label>Data i godzina:</label>
                                <input type="datetime-local" name="date" defaultValue={moment(this.state.date).format("YYYY-MM-DDTHH:mm")} required={true} className="form-control" onChange={e => this.change(e)}/>
                            </div>  
                            <div className="form-group">
                                <label>Ilość insuliny:</label>
                                <input type="number" name="amount" placeholder={this.state.amount} className="form-control" onChange={e => this.change(e)}/>
                            </div>
                            <div className="form-group">
                                <label>Typ insuliny:</label>
                                <select name="insulinType" defaultValue={this.state.type} className="form-control" onChange={e => this.change(e)}>
                                    <option value="Posiłek">Posiłek</option>
                                    <option value="Korekta">Korekta</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dose;