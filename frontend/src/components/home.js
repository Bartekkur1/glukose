import React, { Component } from 'react';
import ContentFrame from './contentFrame';

class Home extends Component {
    render() {
        return (
            <div className="container-fluid sidebar-small">
                <div className="row pl-3 pr-3 mt-3">
                    <ContentFrame title="Witaj w glukose!" col="col-sm-12 col-md-6 mx-auto">
                        <h3 className="text-center mt-5">Miłego dnia i dobrych cukrów</h3>
                    </ContentFrame>    
                </div>
            </div>
        )
    }
}

export default Home;