import React, { Component } from 'react';
import Axios from 'axios';
import { server } from "../../package.json";

class Export extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            data: null,
            error: null
        }
    }

    async exportToJson() {
        this.setState({loading: true});
        try {
            let res = await Axios.post(server + "all_records");
            console.log(res.data);
            this.setState({
                data: res.data,
                loading: false
            });
            let filename = "glukoseData.json";
            let contentType = "application/json;charset=utf-8;";
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(this.state.data)))], { type: contentType });
                navigator.msSaveOrOpenBlob(blob, filename);
            } else {
                var a = document.createElement('a');
                a.download = filename;
                a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(this.state.data));
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
        catch(e)
        {
            console.log(e);
        }
    }
      
    render() {
        if(this.state.loading)
            return (                
                <div className="row m-0 h-100 glukose-off">
                    <img className="mx-auto loading-page" src={process.env.PUBLIC_URL + '/images/loading-gray.svg'} alt="Loading"/>
                </div>)
        return (
            <div className="container-fluid h-100 sidebar-small">
                <div className="row h-100">
                    <div className="col-9 my-auto mx-auto text-center">
                        <h1>Eksport danych</h1>
                        <button className="btn glukose-main btn-lg mt-3 mx-auto"
                        style={{fontSize: "30px"}} type="submit" value="Submit"
                        onClick={() => this.exportToJson()}>Pobierz dane</button>
                    </div>
                </div>
            </div>)
    }
}

export default Export;