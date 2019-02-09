import React, { Component } from 'react';

class RecordTitle extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="col-4 p-0 record-header" onClick={() => this.props.segmentChange()}
            style={this.props.segment === this.props.name ? {backgroundColor: "#e9ecef"} : {backgroundColor: "#64e864"}}>
                {this.props.name}
            </div>        
        )
    }
}

class NewRecord extends Component {
    constructor(props) {
        super(props)

        this.state = {
            segment: "Cukier",
            timeToday: true,
            sugarAmount: null,
            sugarDate: null,
        }
    }

    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        console.log(this.state);
    }

    render() {
        if(this.state.segment == "Cukier")
            var cukier = (
                <form>
                    <div className="form-group">
                        <label>Ilość cukru:</label>
                        <input type="number" name="sugarAmount" className="form-control" onChange={e => this.change(e)}/>
                    </div>
                    <div className="form-check text-center">
                        <input type="checkbox" checked={this.state.timeToday} 
                        onClick={() => this.setState({timeToday: !this.state.timeToday, sugarDate: null})} 
                        className="record-checkbox form-check-input"/>
                        <label className="form-check-label">Teraz</label>
                    </div>
                        {!this.state.timeToday ?
                            <div className="form-group">
                            <label>Data:</label>
                            <input type="datetime-local" name="sugarDate" onChange={e => this.change(e)} className="form-control"/>
                        </div>
                        : null}
                    <button className="btn glukose-main btn-lg mb-3 btn-block" type="submit" value="Submit">Dodaj</button>
                </form>
        )
        else cukier = null;
        return (
            <div className="container-fluid sidebar-small h-100">
                <div className="row">
                    <div className="col-9 p-2 mx-auto record-panel">
                        <h1 className="text-center mb-3">Dodaj nowy rekord</h1>
                        <div className="jumbotron pt-0 pl-3 pr-3 pb-3 mb-0">
                            <div className="row text-center">
                                <RecordTitle name="Cukier" segment={this.state.segment} segmentChange={() => this.setState({segment: "Cukier"})} />
                                <RecordTitle name="Insulina" segment={this.state.segment} segmentChange={() => this.setState({segment: "Insulina"})} />
                                <RecordTitle name="Posiłek" segment={this.state.segment} segmentChange={() => this.setState({segment: "Posiłek"})} />
                            </div>
                            <div className="row">
                                <div className="col-9 p-2 mx-auto record-panel">
                                    {cukier}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewRecord;