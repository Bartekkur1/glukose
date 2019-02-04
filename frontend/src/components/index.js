import React, { Component } from 'react';

class Index extends Component {
    logout() {
        localStorage.clear();
        this.props.history.push('/login');
    }

    apiTest() {

    }

    render() {
        return (
            <div>
                kek
                <button type="button" onClick={() => this.logout()}>Logout</button>
                <button type="button" onClick={() => this.apiTest()}>Test</button>
            </div>
        )
    }
}

export default Index;