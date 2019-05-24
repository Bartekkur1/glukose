import React, { Component } from 'react';
import {server} from '../../package.json';
import Axios from 'axios';
import moment from 'moment';

class Sugar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            id: this.props.match.params.id,
            redirect: null,
            date: null,
            amount: null
        };
    }

    async updateSugar() {
        this.setState({loading: true});
        try {
            await Axios.patch(server + "update_record/sugar", {
                id: this.state.id,
                amount: this.state.amount,
                date: moment(this.state.date)
            });
        }
        catch(e) {
            console.log(e);
        }
        this.setState({loading: false});
    }

    async componentDidMount() {
        this.setState({loading: true});
        try {
            var res = await Axios.get(server + "find_record/sugar/id/" + this.state.id);
            this.setState({
                amount: res.data.value.amount,
                date: res.data.value.date
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
                        <div className="jumbotron pt-3 pb-3 mb-0" style={{"backgroundColor": "white"}} onBlur={() => this.updateSugar()}>
                            <h1>Edycja rekordu id: {this.state.id}</h1>
                            <div className="form-group">
                                {/* value="2018-06-12T19:30" */}
                                <label>Data i godzina:</label>
                                <input type="datetime-local" name="date" defaultValue={moment(this.state.date).format("YYYY-MM-DDTHH:mm")} required={true} className="form-control" onChange={e => this.change(e)}/>
                            </div>  
                            <div className="form-group">
                                <label>Ilość cukru:</label>
                                <input type="number" name="amount" placeholder={this.state.amount} className="form-control" onChange={e => this.change(e)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Sugar;